import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/public|.\\.(?:svg|png|jpg|jpeg|gif|webp)$).)',
  ],
}

export async function middleware(request: NextRequest) {
  console.log('Middleware processing route:', request.nextUrl.pathname)

  // Create an empty response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession()

    // Define auth pages
    const isAuthPage = [
      '/login',
      '/register',
      '/auth/register'
    ].includes(request.nextUrl.pathname)

    // Define protected routes
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/data-input') ||
                           request.nextUrl.pathname.startsWith('/goals') ||
                           request.nextUrl.pathname.startsWith('/reports') ||
                           request.nextUrl.pathname.startsWith('/settings') ||
                           request.nextUrl.pathname.startsWith('/help')

    // Handle route group (auth) properly
    if (request.nextUrl.pathname === '/auth/login') {
      console.log('Redirecting to login path')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Root redirect
    if (request.nextUrl.pathname === '/') {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!session && isProtectedRoute) {
      console.log('Redirecting unauthenticated user to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users away from auth pages
    if (session && isAuthPage) {
      console.log('Redirecting authenticated user to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (e) {
    // Handle any errors
    console.error('Middleware error:', e)
  }

  return response
}