import { supabaseAdmin } from '../src/lib/supabase-admin';

async function checkTables() {
    console.log("Checking tables...");

    // Check result_snapshots
    const { data: snapshots, error: snapError } = await supabaseAdmin
        .from('result_snapshots')
        .select('count')
        .limit(1);

    if (snapError) {
        console.error("❌ Error accessing result_snapshots:", snapError.message);
    } else {
        console.log("✅ result_snapshots table exists and is accessible.");
    }

    // Check feedback_responses
    const { data: feedback, error: feedError } = await supabaseAdmin
        .from('feedback_responses')
        .select('count')
        .limit(1);

    if (feedError) {
        console.error("❌ Error accessing feedback_responses:", feedError.message);
    } else {
        console.log("✅ feedback_responses table exists and is accessible.");
    }
}

checkTables();
