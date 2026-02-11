import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
// We use the service role key if available for bypassing RLS, or the anon key if RLS allows public inserts.
// Ideally, traversing the server-side environment, we should use a service role client to ensure write access.
// However, standard nextjs Supabase auth helpers might be used in this project.
// Let's check if we can use the standard env vars directly.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
    try {
        const { email, source } = await request.json()

        // 1. Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Formato de email inválido' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // 2. Upsert into Supabase
        // We use upsert to handle duplicates gracefully (update explicit fields if needed, or just ensure existence)
        const { error: supabaseError } = await supabase
            .from('subscribers')
            .upsert(
                {
                    email: normalizedEmail,
                    source: source || 'web',
                    // valid input: if user re-subscribes, we can update last_updated or similar if we had that column
                },
                { onConflict: 'email' }
            )

        if (supabaseError) {
            console.error('Supabase error:', supabaseError)
            return NextResponse.json(
                { success: false, error: 'Database error' },
                { status: 500 }
            )
        }

        // 3. Send to Brevo (non-blocking failure)
        try {
            const brevoApiKey = process.env.BREVO_API_KEY
            // Select list based on source
            const listIdLeadMagnet = process.env.BREVO_LIST_ID_LEAD_MAGNET
            const listIdNewsletter = process.env.BREVO_LIST_ID_NEWSLETTER

            // logic: source "lead_magnet" -> Lead Magnet List, otherwise Newsletter List
            const targetListIdEnv = (source === 'lead_magnet' || (source && source.startsWith('lead_magnet')))
                ? listIdLeadMagnet
                : listIdNewsletter

            if (brevoApiKey && targetListIdEnv) {
                const listId = parseInt(targetListIdEnv, 10)

                if (!isNaN(listId)) {
                    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
                        method: 'POST',
                        headers: {
                            'api-key': brevoApiKey,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: normalizedEmail,
                            listIds: [listId],
                            updateEnabled: true // Init or Update
                        })
                    })

                    if (!brevoRes.ok) {
                        const errorData = await brevoRes.json()
                        console.error('Brevo API warning:', errorData)
                        // We do NOT return error to client, as Supabase succeeded
                    }
                } else {
                    console.warn('BREVO List ID is not a valid number:', targetListIdEnv)
                }
            }
        } catch (brevoErr) {
            // Context: External service failure should not block the user flow
            console.error('Brevo connection error (silent):', brevoErr)
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Subscription error:', error)
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        )
    }
}
