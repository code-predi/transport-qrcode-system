import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {

  const userId = req.cookies.get('userId')?.value

  const path = req.nextUrl.pathname


  const isLoggedIn = !!userId


  // PUBLIC ROUTES
  const publicRoutes = [
    '/login',
    '/api/auth/login'
  ]


  const isPublic =
    publicRoutes.includes(path) ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico')


  // If NOT logged in → block protected routes
  if (!isLoggedIn && !isPublic) {

    return NextResponse.redirect(
      new URL('/login', req.url)
    )

  }


  // If logged in → prevent access to login page
  if (isLoggedIn && path === '/login') {

    return NextResponse.redirect(
      new URL('/dashboard', req.url)
    )

  }


  // Optional: redirect root based on login
  if (path === '/') {

    if (isLoggedIn) {

      return NextResponse.redirect(
        new URL('/dashboard', req.url)
      )

    } else {

      return NextResponse.redirect(
        new URL('/login', req.url)
      )

    }

  }


  return NextResponse.next()

}



export const config = {

  matcher: [

    /*
      Protect everything except static files
    */

    '/((?!_next/static|_next/image|favicon.ico).*)'

  ]

}