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

    console.log("[ACCESS CHECK] Email recibido:", email)


    if (!email) {
        console.log('No email provided. Access denied.')
        return NextResponse.json({ access: 'none' })
    }

    try {
        // Query ALL paid/completed purchases for this email
        const { data: purchases, error } = await supabaseAdmin
            .from('purchases')
            .select('product_type, status')
            .eq('customer_email', email)
            .in('status', ['paid', 'completed'])

        if (error) {
            console.error('Access Check DB Error:', error)
            return NextResponse.json({ access: 'none' }, { status: 500 })
        }

        console.log("[ACCESS CHECK] Compras encontradas:", purchases?.length)

        if (!purchases || purchases.length === 0) {
            return NextResponse.json({ access: 'none' })
        }

        // Determine highest access level
        const hasDeep = purchases.some(p => p.product_type === 'deep' || p.product_type === 'upgrade')
        const hasQuick = purchases.some(p => p.product_type === 'quick')

        if (hasDeep) {
            console.log('Access GRANTED: deep')
            return NextResponse.json({ access: 'deep' })
        }

        if (hasQuick) {
            console.log('Access GRANTED: quick')
            return NextResponse.json({ access: 'quick' })
        }

        return NextResponse.json({ access: 'none' })

    } catch (error) {
        console.error('Access Check Unexpected Error:', error)
        return NextResponse.json({ access: 'none' }, { status: 500 })
    }
}
