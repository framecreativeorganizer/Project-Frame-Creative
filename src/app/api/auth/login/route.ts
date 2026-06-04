import { NextRequest, NextResponse } from 'next/server'
import { signSession, COOKIE_NAME, SESSION_DURATION_MS } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
    }

    if (
      email?.trim().toLowerCase() !== adminEmail.toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 })
    }

    const exp = Date.now() + SESSION_DURATION_MS
    const token = await signSession({
      role: 'ADMIN',
      email: adminEmail,
      name: 'Admin Frame Creative',
      exp,
    })

    const response = NextResponse.json({ success: true, role: 'ADMIN' })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: new Date(exp),
      // secure: true, // enable in production (HTTPS)
    })
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
