import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Runs on /admin/*: refreshes the Supabase session cookie and sends signed-out visitors to the login page.
 * Authorisation (admin role) is enforced again in the protected layout, in every server action and by RLS.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const path = request.nextUrl.pathname
  const isLogin = path.startsWith('/admin/login') || path.startsWith('/admin/auth')
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        response.headers.set('X-Robots-Tag', 'noindex, nofollow')
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v))
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims?.sub)

  if (!signedIn && !isLogin) {
    const login = request.nextUrl.clone()
    login.pathname = '/admin/login'
    login.search = ''
    login.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(login)
  }
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
