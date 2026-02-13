import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase Admin Client (for writing to restricted table)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const sig = headers().get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        // Idempotency Check
        try {
            const { data: existingPurchase, error: fetchError } = await supabaseAdmin
                .from('purchases')
                .select('id')
                .eq('stripe_session_id', session.id)
                .single()

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                console.error('Error checking existing purchase:', fetchError)
            }

            if (existingPurchase) {
                console.log(`Purchase already recorded for session ${session.id}`)
                return NextResponse.json({ received: true })
            }

            // Extract metadata
            const metadata = session.metadata || {}
            const productType = metadata.productType || 'quick'

            // Logic: if 'upgrade', store as 'deep'
            const finalProductType = productType === 'upgrade' ? 'deep' : productType

            // Insert into DB
            const { error: insertError } = await supabaseAdmin.from('purchases').insert({
                stripe_session_id: session.id,
                email: session.customer_details?.email || session.customer_email || '',
                product_type: finalProductType,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                status: session.payment_status || 'completed',
            })

            if (insertError) {
                console.error('Supabase Insert Error:', insertError)
                return new NextResponse(`Database Error: ${insertError.message}`, { status: 500 })
            }

            console.log(`Purchase recorded: ${session.id} (${finalProductType})`)
        } catch (err: any) {
            console.error('Unexpected Webhook Error:', err)
            return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 })
        }


    }

    return NextResponse.json({ received: true })
}
