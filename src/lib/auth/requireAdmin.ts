import 'server-only'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type AdminUser = { id: string; email: string; name: string | null }

async function readAdmin(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile || !['admin', 'editor'].includes(profile.role)) return null
  return { id: user.id, email: user.email ?? '', name: profile.full_name }
}

/** For admin pages: redirects to the login page when the visitor isn't an admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await readAdmin()
  if (!admin) redirect('/admin/login?error=acces')
  return admin
}

/** For server actions: returns null instead of redirecting so the action can answer with an error. */
export async function getAdminOrNull(): Promise<AdminUser | null> {
  return readAdmin()
}
