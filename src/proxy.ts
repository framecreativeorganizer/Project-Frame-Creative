import { NextRequest, NextResponse } from 'next/server'
import { verifySession, COOKIE_NAME } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verify session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = token ? await verifySession(token) : null

  if (!session || session.role !== 'ADMIN') {
    // If it's an API route, return 401 JSON instead of redirecting
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Redirect to login with callback URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Valid admin session — attach user info to header for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-admin-email', session.email)
  requestHeaders.set('x-admin-name', session.name)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  // Run proxy on admin and admin API routes
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
