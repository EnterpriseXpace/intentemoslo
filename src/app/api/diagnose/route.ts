import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const report: any = {};
    const log = (msg: string, data?: any) => {
        if (!report.logs) report.logs = [];
        report.logs.push({ msg, data });
        console.log(`[DIAGNOSE] ${msg}`, data || '');
    };

    try {
        log('Starting Diagnosis...');

        // 1. Check Purchases Table
        log('Checking Purchases Table...');
        const purchaseId = `test_session_${Date.now()}`;
        const { data: purchaseData, error: purchaseError } = await supabaseAdmin
            .from('purchases')
            .insert({
                session_id: purchaseId,
                product_type: 'quick', // Use valid enum
                status: 'pending',     // Use valid enum
                amount: 0,
                metadata: { test: true }
            })
            .select()
            .single();

        if (purchaseError) {
            log('❌ Purchase Insert Failed', purchaseError);
            report.purchases_status = 'failed';
        } else {
            log('✅ Purchase Insert Success', purchaseData);
            report.purchases_status = 'ok';

            // Clean up
            await supabaseAdmin.from('purchases').delete().eq('session_id', purchaseId);
        }

        // 2. Check Result Snapshots (specifically answers_json)
        log('Checking Result Snapshots & answers_json...');
        const resultId = `test_result_${Date.now()}`; // id is uuid usually, let's see if it auto-gens or if we can pass it if we change schema? 
        // Actually result_snapshots.id is usually uuid default gen_random_uuid(). We don't verify id insert.
        // We verify the JSON column.

        const { data: resultData, error: resultError } = await supabaseAdmin
            .from('result_snapshots')
            .insert({
                session_id: 'test_session_diag',
                product_type: 'quick', // valid enum
                ier_score: 50,
                global_state: 'stable',
                answers_json: { "test": "value" } // CRITICAL CHECK
            })
            .select()
            .single();

        if (resultError) {
            log('❌ Result Snapshot Insert Failed', resultError);
            report.result_snapshots_status = 'failed';
            report.result_error = resultError;
        } else {
            log('✅ Result Snapshot Insert Success', resultData);
            report.result_snapshots_status = 'ok';
            report.answers_saved = resultData.answers_json ? 'yes' : 'no';

            // Clean up
            await supabaseAdmin.from('result_snapshots').delete().eq('id', resultData.id);
        }

        return NextResponse.json(report);

    } catch (e: any) {
        log('🔥 Critical Diagnosis Error', e.message);
        return NextResponse.json({ error: e.message, logs: report.logs }, { status: 500 });
    }
}
