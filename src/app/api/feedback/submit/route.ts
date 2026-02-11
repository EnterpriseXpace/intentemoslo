import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            resultId,
            email,
            ierScore,
            globalState,
            productType,
            emotion,
            usefulness,
            comment,
            consent
        } = body;

        // Validate basic requirement: We need at least the score/context if resultId is missing, 
        // but ideally we have resultId.

        // Consent defaults to true if undefined (Implicit consent as per requirements)
        // If explicitly false, we might still store anon stats but strictly speaking we should respect it.
        // Requirement said: "Si no hay checkbox explícito, guárdalo como true por defecto"
        const finalConsent = consent !== false;

        const { data, error } = await supabaseAdmin
            .from('feedback_responses')
            .insert({
                result_id: resultId || null,
                email: email || null,
                ier_score: ierScore,
                global_state: globalState,
                product_type: productType,
                emotion: emotion,
                usefulness: usefulness,
                comment: comment,
                consent: finalConsent
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error saving feedback:', error);
            return NextResponse.json(
                { error: 'Failed to save feedback' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, feedbackId: data.id });

    } catch (e) {
        console.error('Unexpected error in feedback/submit:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
