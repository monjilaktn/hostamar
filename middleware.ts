import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Public paths — no auth needed
  const publicPaths = ['/', '/login', '/signup', '/pricing', '/about', '/contact', '/privacy', '/terms', '/blog', '/payment/success', '/payment/fail', '/payment/cancel']
  const publicApiPaths = ['/api/auth/login', '/api/auth/register', '/api/health', '/api/auth/signup', '/api/payment/ipn', '/api/queue/process']
  
  for (const p of publicPaths) {
    if (pathname === p || pathname.startsWith(p + '/')) {
      if (pathname.startsWith('/api/') && !publicApiPaths.some(ap => pathname.startsWith(ap))) {
        break
      }
      return NextResponse.next()
    }
  }
  for (const ap of publicApiPaths) {
    if (pathname.startsWith(ap)) {
      return NextResponse.next()
    }
  }

  // Static assets — always allow
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname === '/favicon.ico' || pathname.startsWith('/manifest.json') || pathname.startsWith('/opengraph-image')) {
    return NextResponse.next()
  }

  // API routes — validate token using jose (Edge-compatible)
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET)
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.id as string)
      requestHeaders.set('x-user-email', payload.email as string)
      requestHeaders.set('x-user-name', payload.name as string)
      return NextResponse.next({
        request: { headers: requestHeaders }
      })
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  // Protected pages — redirect to login
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      await jose.jwtVerify(token, JWT_SECRET)
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|opengraph-image).*)']
}
