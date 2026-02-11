import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productType, customerName, email, currentUrlParams } = body;

        // Debug Logs
        console.log("CHECKOUT_DEBUG: Body:", { productType, email, hasParams: !!currentUrlParams });
        console.log("CHECKOUT_DEBUG: STRIPE KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

        // Dynamic Origin Logic
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("CHECKOUT_ERROR: STRIPE_SECRET_KEY is missing");
            return NextResponse.json(
                { error: 'Missing STRIPE_SECRET_KEY' },
                { status: 500 }
            );
        }

        // Strict Product Type Validation
        if (!productType || !['quick', 'deep', 'upgrade'].includes(productType)) {
            console.error("CHECKOUT_ERROR: Invalid productType:", productType);
            return NextResponse.json(
                { error: 'Invalid product type' },
                { status: 400 }
            );
        }

        let priceId = '';

        if (productType === 'deep') {
            priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_DEEP!;
        } else if (productType === 'upgrade') {
            priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_UPGRADE!;
        } else {
            priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_QUICK!;
        }

        console.log(`CHECKOUT_DEBUG: Resolved Price ID for ${productType}: ${priceId}`);

        // Strict Price ID Validation
        if (!priceId || priceId.includes('PLACEHOLDER')) {
            console.error('CHECKOUT_ERROR: Price ID missing or invalid for type:', productType);
            return NextResponse.json(
                { error: `Configuration Error: Missing price configuration for ${productType}` },
                { status: 500 }
            );
        }

        // --- Client Session Management ---
        const cookieStore = cookies();
        let clientSessionId = cookieStore.get('antigravity_client_tracker')?.value;

        if (!clientSessionId) {
            clientSessionId = uuidv4();
            // We can't set cookies in a Route Handler response easily without returning the response object.
            // But we will pass it to Stripe, and also return it in the JSON so the client can set it if needed (or rely on middleware).
            // For simplicity in this flow, we'll assume client/middleware handles it, OR we just use it for Stripe metadata.
            // Better: Set it in the response header.
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Success URL: Strict separation of flows
            // Upgrade: MUST NOT include currentUrlParams (Quick answers) to avoid contamination.
            // Deep/Quick: MUST include currentUrlParams to preserve answers.
            success_url: productType === 'upgrade'
                ? `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&type=upgrade`
                : `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&type=${productType}&${currentUrlParams || ''}`,

            cancel_url: `${origin}/checkout?type=${productType}`,
            customer_email: email,
            metadata: {
                productType, // 'quick', 'deep', 'upgrade'
                customerName: customerName || '',
                clientSessionId: clientSessionId // Critical for linking back
            },
        });

        const response = NextResponse.json({ url: session.url });

        // Ensure cookie is set if it was missing
        if (!cookieStore.get('antigravity_client_tracker')) {
            response.cookies.set('antigravity_client_tracker', clientSessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 365 // 1 year
            });
        }

        return response;

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
