import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Admin client to read purchases table (which has RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
    const cookieStore = cookies()
    const clientSessionId = cookieStore.get('antigravity_client_tracker')?.value

    if (!clientSessionId) {
        return NextResponse.json({ access: 'none' })
    }

    try {
        // Query for ANY successful purchase linked to this client session
        // Sort by product_type to prioritize 'deep' if both exist (custom logic or simple check)
        // Actually, we can just fetch all and determine max level.
        const { data: purchases, error } = await supabaseAdmin
            .from('purchases')
            .select('product_type')
            .eq('client_session_id', clientSessionId)
            .eq('status', 'completed')

        if (error) {
            console.error('Access Check DB Error:', error)
            return NextResponse.json({ access: 'none' }, { status: 500 })
        }

        if (!purchases || purchases.length === 0) {
            return NextResponse.json({ access: 'none' })
        }

        // Determine highest access level
        const hasDeep = purchases.some(p => p.product_type === 'deep' || p.product_type === 'upgrade')
        const access = hasDeep ? 'deep' : 'quick'

        return NextResponse.json({ access })

    } catch (error) {
        console.error('Access Check Error:', error)
        return NextResponse.json({ access: 'none' }, { status: 500 })
    }
}
