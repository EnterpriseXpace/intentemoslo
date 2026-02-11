import { supabaseAdmin } from './supabase-admin';

// Types for our analytics data
export type Period = '7d' | '30d' | 'all';

export interface KPIData {
    started: { total: number; last7Days: number };
    completed: { total: number; last7Days: number; rate: number };
    paid: { total: number; conversionRate: number };
    revenue: { total: number; last7Days: number }; // Optional, if we tracked amount
}

export interface FunnelStep {
    step: string;
    label: string;
    count: number;
    dropoff: number; // Percentage dropped from previous step
}

export interface ProductSplit {
    quick: { started: number; completed: number; paid: number };
    deep: { started: number; completed: number; paid: number };
}

export interface UserMetrics {
    uniqueUsers: number;
    totalSessions: number; // Approximate via 'checklist_started'
    repeatedDiagnostics: number;
}

const EVENTS = {
    STARTED: 'checklist_started',
    COMPLETED: 'checklist_completed',
    PRE_RESULT: 'pre_result_viewed',
    CHECKOUT: 'checkout_clicked',
    PAID: 'payment_completed',
};

// Helper to get count for an event, optionally filtered by date range and product type
async function getCount(eventName: string, days?: number, productType?: 'quick' | 'deep') {
    let query = supabaseAdmin
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_name', eventName);

    if (days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        query = query.gte('created_at', date.toISOString());
    }

    if (productType) {
        query = query.eq('product_type', productType);
    }

    const { count, error } = await query;
    if (error) {
        console.error(`Error fetching count for ${eventName}:`, error);
        return 0;
    }
    return count || 0;
}

// Helper to get UNIQUE count for an event (based on anon_id)
async function getUniqueCount(eventName: string, days?: number) {
    let query = supabaseAdmin
        .from('analytics_events')
        .select('anon_id') // We just need the ID to count distinct
        .eq('event_name', eventName);

    if (days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        query = query.gte('created_at', date.toISOString());
    }

    const { data, error } = await query;
    if (error || !data) {
        console.error(`Error fetching unique count for ${eventName}:`, error);
        return 0;
    }

    // Set handles uniqueness
    return new Set(data.map(d => d.anon_id)).size;
}

function getDaysFromPeriod(period: Period): number | undefined {
    if (period === '7d') return 7;
    if (period === '30d') return 30;
    return undefined;
}

// Fetch Top-Level KPIs
export async function getKPIs(): Promise<KPIData> {
    const [
        startedTotal,
        started7Days,
        completedTotal,
        completed7Days,
        paidTotal,
        paid7Days
    ] = await Promise.all([
        getCount(EVENTS.STARTED),
        getCount(EVENTS.STARTED, 7),
        getCount(EVENTS.COMPLETED),
        getCount(EVENTS.COMPLETED, 7),
        getCount(EVENTS.PAID),
        getCount(EVENTS.PAID, 7),
    ]);

    const completedRate = started7Days > 0 ? Math.round((completed7Days / started7Days) * 100) : 0;
    const conversionRate = startedTotal > 0 ? Math.round((paidTotal / startedTotal) * 100) : 0;

    return {
        started: { total: startedTotal, last7Days: started7Days },
        completed: { total: completedTotal, last7Days: completed7Days, rate: completedRate },
        paid: { total: paidTotal, conversionRate },
        revenue: { total: 0, last7Days: 0 } // Placeholder if needed
    };
}

// Fetch Funnel Data (Last 7 Days by default for relevance, or Total depending on requirement)
// The user asked for "Visual Funnel", usually typically on a specific timeframe or all-time.
// Given "Is usage growing?", let's do Last 7 Days primarily, or allow toggle.
// For now, let's fetch TOTAL for the funnel to have enough data points in early stage.
export async function getFunnelData(): Promise<FunnelStep[]> {
    const steps = [
        { id: EVENTS.STARTED, label: 'Iniciados' },
        { id: EVENTS.COMPLETED, label: 'Completados' },
        { id: EVENTS.PRE_RESULT, label: 'Vio Pre-Result' },
        { id: EVENTS.CHECKOUT, label: 'Clic en Pago' },
        { id: EVENTS.PAID, label: 'Pagado' }
    ];

    const counts = await Promise.all(steps.map(s => getCount(s.id)));

    return steps.map((step, index) => {
        const currentCount = counts[index];
        const previousCount = index > 0 ? counts[index - 1] : currentCount;
        const dropoff = previousCount > 0 ? Math.round(((previousCount - currentCount) / previousCount) * 100) : 0;

        return {
            step: step.id,
            label: step.label,
            count: currentCount,
            dropoff: index === 0 ? 0 : dropoff
        };
    });
}

// Fetch Product Split
export async function getProductSplit(): Promise<ProductSplit> {
    const [
        quickStarted, quickCompleted, quickPaid,
        deepStarted, deepCompleted, deepPaid
    ] = await Promise.all([
        getCount(EVENTS.STARTED, undefined, 'quick'),
        getCount(EVENTS.COMPLETED, undefined, 'quick'),
        getCount(EVENTS.PAID, undefined, 'quick'),
        getCount(EVENTS.STARTED, undefined, 'deep'),
        getCount(EVENTS.COMPLETED, undefined, 'deep'),
        getCount(EVENTS.PAID, undefined, 'deep'),
    ]);

    return {
        quick: { started: quickStarted, completed: quickCompleted, paid: quickPaid },
        deep: { started: deepStarted, completed: deepCompleted, paid: deepPaid }
    };
}

// Fetch User Metrics (Approximate)
export async function getUserMetrics(): Promise<UserMetrics> {
    // Unique users is hard with just 'select count', need distinct.
    // Supabase JS doesn't support 'distinct count' easily without RPC.
    // For now, we'll use 'checklist_started' as proxy for sessions.
    // And to get unique, we might need a raw query or fetch and set (careful with scale).
    // Given the constraints and "early traction", fetching distinct anon_ids for 'checklist_started' is okay if < 1000 rows.
    // But better: Use a simple rpc if available, or just count sessions for now.

    // Let's implement a "safe" unique count by fetching just the anon_id column for 'checklist_started'
    // This is not scalable for millions, but fine for thousands.

    const { data, error } = await supabaseAdmin
        .from('analytics_events')
        .select('anon_id')
        .eq('event_name', EVENTS.STARTED);

    if (error) {
        return { uniqueUsers: 0, totalSessions: 0, repeatedDiagnostics: 0 };
    }

    const uniqueUsers = new Set(data.map(d => d.anon_id)).size;
    const totalSessions = data.length;
    // Repeated: Users who appear more than once
    const counts: Record<string, number> = {};
    data.forEach(d => counts[d.anon_id] = (counts[d.anon_id] || 0) + 1);
    const repeatedDiagnostics = Object.values(counts).filter(c => c > 1).length;

    return {
        uniqueUsers,
        totalSessions,
        repeatedDiagnostics
    };
}
// ... existing code ...

export interface RetentionMetrics {
    completed: number;
    paid: number;
    notPaid: number;
}

export interface ProductPerformance {
    quick: { started: number; paid: number; conversion: number };
    deep: { started: number; paid: number; conversion: number };
}

export interface LocationMetric {
    country: string;
    count: number;
    code: string;
}

// Fetch Retention Metrics (Paid vs Not Paid among Completed)
export async function getRetentionMetrics(period: Period = 'all'): Promise<RetentionMetrics> {
    const days = getDaysFromPeriod(period);

    // We use getUniqueCount to ensure valid user-based comparison
    const [completed, paid] = await Promise.all([
        getUniqueCount(EVENTS.COMPLETED, days),
        getUniqueCount(EVENTS.PAID, days)
    ]);

    const notPaid = Math.max(0, completed - paid);

    return {
        completed,
        paid,
        notPaid
    };
}

// Fetch Detailed Product Performance
export async function getProductPerformance(period: Period = 'all'): Promise<ProductPerformance> {
    const days = getDaysFromPeriod(period);

    const [
        quickStarted, quickPaid,
        deepStarted, deepPaid
    ] = await Promise.all([
        getCount(EVENTS.STARTED, days, 'quick'),
        getCount(EVENTS.PAID, days, 'quick'),
        getCount(EVENTS.STARTED, days, 'deep'),
        getCount(EVENTS.PAID, days, 'deep'),
    ]);

    const quickConv = quickStarted > 0 ? Math.round((quickPaid / quickStarted) * 100) : 0;
    const deepConv = deepStarted > 0 ? Math.round((deepPaid / deepStarted) * 100) : 0;

    return {
        quick: { started: quickStarted, paid: quickPaid, conversion: quickConv },
        deep: { started: deepStarted, paid: deepPaid, conversion: deepConv }
    };
}

// Fetch Location Metrics
export async function getLocationMetrics(period: Period = 'all'): Promise<LocationMetric[]> {
    const days = getDaysFromPeriod(period);

    // Group by the actual 'country' column
    let query = supabaseAdmin
        .from('analytics_events')
        .select('country')
        .neq('country', null); // Only valid countries

    if (days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        query = query.gte('created_at', date.toISOString());
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
        return [
            { country: "Preparado (Sin datos)", count: 0, code: "XX" }
        ];
    }

    // Aggregation in JS
    const countries: Record<string, number> = {};

    data.forEach(event => {
        const c = event.country;
        if (c) {
            countries[c] = (countries[c] || 0) + 1;
        }
    });

    const sorted = Object.entries(countries)
        .map(([country, count]) => ({ country, count, code: country }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5

    if (sorted.length === 0) {
        return [
            { country: "Preparado (Sin datos)", count: 0, code: "XX" }
        ];
    }

    return sorted;
}
