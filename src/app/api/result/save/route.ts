import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            sessionId,
            email,
            productType,
            ierScore,
            globalState,
            dimensions,
            dominantPattern,
            riskTrajectory,
            source,
            answers_json // New field for raw data persistence
        } = body;

        // Basic validation
        if (!sessionId || !productType || ierScore === undefined || !globalState) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert into result_snapshots
        const { data, error } = await supabaseAdmin
            .from('result_snapshots')
            .insert({
                session_id: sessionId,
                email: email || null,
                product_type: productType,
                ier_score: ierScore,
                global_state: globalState,
                dimensions: dimensions || null,
                dominant_pattern: dominantPattern || null,
                risk_trajectory: riskTrajectory ? JSON.stringify(riskTrajectory) : null,
                source: source || 'web',
                answers_json: answers_json || null // Save raw answers
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error saving result snapshot:', error);
            return NextResponse.json(
                { error: 'Failed to save result' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, resultId: data.id });

    } catch (e) {
        console.error('Unexpected error in result/save:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
