import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Whitelist of allowed events
const ALLOWED_EVENTS = new Set([
    'checklist_started',
    'checklist_question_answered',
    'checklist_completed',
    'processing_started',
    'pre_result_viewed',
    'checkout_clicked',
    'payment_completed',
    'result_viewed',
    'email_submitted',
    'diagnostic_repeated',
    'session_started'
]);

// Simple in-memory cache for session -> country to avoid repeated API calls
// Note: In serverless, this is not perfect but helps within warm instances.
const SESSION_COUNTRY_CACHE = new Map<string, string>();

async function resolveCountry(ip: string, sessionId: string): Promise<string | null> {
    // 1. Check Cache
    if (SESSION_COUNTRY_CACHE.has(sessionId)) {
        return SESSION_COUNTRY_CACHE.get(sessionId) || null;
    }

    try {
        // 2. Resolve from External API (ipapi.co is simple, rate-limited but free)
        // Set a strict timeout to avoid hanging the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout

        const response = await fetch(`https://ipapi.co/${ip}/country/`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return null;
        }

        const countryCode = await response.text();

        // 3. Normalize & Validate (ISO-2, Upper)
        if (countryCode && /^[A-Z]{2}$/.test(countryCode.trim().toUpperCase())) {
            const normalized = countryCode.trim().toUpperCase();
            // Cache it
            SESSION_COUNTRY_CACHE.set(sessionId, normalized);
            // Limit cache growth (simple LRU-ish safety)
            if (SESSION_COUNTRY_CACHE.size > 1000) SESSION_COUNTRY_CACHE.clear();

            return normalized;
        }
    } catch (e) {
        // Silent fail for timeout or network error
        return null;
    }

    return null;
}

export async function POST(request: Request) {
    // 1. Safety Check: Dev/Local Environment
    // Disable analytics in non-production to prevent local crashes and console spam
    if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ success: true });
    }

    try {
        const body = await request.json();
        const { event_name, anon_id, session_id, product_type, metadata, url } = body;

        // 2. Validate Event Name
        if (!ALLOWED_EVENTS.has(event_name)) {
            // Internal requirement: No 400 errors, just silent failure
            return NextResponse.json({ success: false }, { status: 200 });
        }

        // 3. Validate Required Fields
        if (!anon_id || !session_id) {
            // Internal requirement: No 400 errors, just silent failure
            return NextResponse.json({ success: false }, { status: 200 });
        }

        // 4. Resolve Country (Render/External)
        // Get IP from headers (x-forwarded-for is standard in Render)
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || null;

        let country: string | null = null;

        // Only resolve if we have an IP and it's not localhost (approx check)
        if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            country = await resolveCountry(ip, session_id);
        }

        // 5. Insert into Supabase
        let { error } = await supabaseAdmin
            .from('analytics_events')
            .insert({
                event_name,
                anon_id,
                session_id,
                product_type,
                country, // Add country column
                metadata: metadata || {},
                url: url || '',
            });

        // Handle missing 'country' column error gracefully (if migration wasn't run)
        if (error && error.message && error.message.includes('column "country" of relation "analytics_events" does not exist')) {
            console.warn('Analytics: "country" column missing in DB. Retrying without it.');
            const retry = await supabaseAdmin
                .from('analytics_events')
                .insert({
                    event_name,
                    anon_id,
                    session_id,
                    product_type,
                    // country omitted
                    metadata: metadata || {},
                    url: url || '',
                });
            error = retry.error;
        }

        if (error) {
            console.error('Supabase Analytics Error:', error);
            // Critical: Never return 500, return success: false instead
            return NextResponse.json({ success: false }, { status: 200 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        // Critical: Never return 500, return success: false instead
        console.error('API Error /api/track:', err);
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
