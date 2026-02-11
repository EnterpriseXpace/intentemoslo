import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    // Only protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = req.headers.get('authorization')

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1]
            const [user, pwd] = atob(authValue).split(':')

            // Hardcoded for MVP or use env vars
            // User: admin
            // Pass: intentemoslo
            if (user === 'admin' && pwd === 'intentemoslo') {
                return NextResponse.next()
            }
        }

        return new NextResponse('Auth Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
