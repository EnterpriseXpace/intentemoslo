import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    // Only protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = req.headers.get('authorization')

        if (basicAuth) {
            try {
                const authValue = basicAuth.split(' ')[1]
                const [user, pwd] = atob(authValue).split(':')

                // Credentials: admin / intentemoslo
                if (user === 'admin' && pwd === 'intentemoslo') {
                    return NextResponse.next()
                }
                console.log(`[AUTH] Failed attempt for user: ${user}`)
            } catch (e) {
                console.error('[AUTH] Error parsing credentials')
            }
        }

        return new NextResponse('Auth Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
            },
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
