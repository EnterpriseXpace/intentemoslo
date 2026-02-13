import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Admin client to read purchases table (which has RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    console.log('--- ACCESS CHECK ---')
    console.log('Checking access for email:', email)

    if (!email) {
        console.log('No email provided. Access denied.')
        return NextResponse.json({ access: 'none' })
    }

    try {
        // Strict query: Email + Deep + Paid/Completed
        const { data: purchases, error } = await supabaseAdmin
            .from('purchases')
            .select('product_type, status')
            .eq('email', email)
            .eq('product_type', 'deep')
            .in('status', ['paid', 'completed'])
            .limit(1)

        if (error) {
            console.error('Access Check DB Error:', error)
            return NextResponse.json({ access: 'none' }, { status: 500 })
        }

        console.log('Query result:', purchases)

        if (purchases && purchases.length > 0) {
            console.log('Access GRANTED: deep')
            return NextResponse.json({ access: 'deep' })
        }

        console.log('Access DENIED: No matching strict record found.')
        return NextResponse.json({ access: 'none' })

    } catch (error) {
        console.error('Access Check Unexpected Error:', error)
        return NextResponse.json({ access: 'none' }, { status: 500 })
    }
}
