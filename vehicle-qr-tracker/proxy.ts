import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {

  const userId = req.cookies.get('userId')?.value

  const path = req.nextUrl.pathname

  // Allow login and auth routes always
  if (
    path.startsWith('/login') ||
    path.startsWith('/api/auth/login')
  ) {
    return NextResponse.next()
  }

  // Protect dashboard and scan routes
  if (
    path.startsWith('/dashboard') ||
    path.startsWith('/scan') ||
    path.startsWith('/api/trips') ||
    path.startsWith('/api/dashboard')
  ) {

    if (!userId) {

      return NextResponse.redirect(
        new URL('/login', req.url)
      )

    }

  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/scan/:path*',
    '/api/trips/:path*',
    '/api/dashboard/:path*'
  ]
}