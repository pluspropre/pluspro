import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/** Exchanges the code from invite / password-reset e-mails for a session cookie. */
export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/admin'
  const safeNext = next.startsWith('/admin') ? next : '/admin'
  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(safeNext, url.origin))
  }
  return NextResponse.redirect(new URL('/admin/login?error=lien', url.origin))
}
