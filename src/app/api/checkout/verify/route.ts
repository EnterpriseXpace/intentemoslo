import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Admin to write
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    try {
        // 1. Check if already recorded in DB
        const { data: purchase } = await supabaseAdmin
            .from('purchases')
            .select('*')
            .eq('session_id', sessionId)
            .single()

        if (purchase) {
            return NextResponse.json({
                verified: true,
                productType: purchase.product_type,
                customerName: purchase.metadata?.customerName
            })
        }

        // 2. If not in DB, Verify with Stripe (Fallback for slow webhook)
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
        }

        // 3. Record it manually (Idempotent because session_id is unique key)
        const metadata = session.metadata || {}
        const productType = metadata.productType || 'quick'
        const finalProductType = productType === 'upgrade' ? 'deep' : productType

        const { error: insertError } = await supabaseAdmin.from('purchases').insert({
            session_id: session.id,
            customer_email: session.customer_details?.email,
            product_type: finalProductType,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            status: 'completed',
            client_session_id: metadata.clientSessionId,
            metadata: metadata
        })

        if (insertError) {
            // It might have been inserted by webhook milliseconds ago
            console.log('Insert error (likely race condition):', insertError.message)
        }

        return NextResponse.json({
            verified: true,
            productType: finalProductType,
            customerName: metadata.customerName
        })

    } catch (error) {
        console.error('Verification Error:', error)
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }
}
