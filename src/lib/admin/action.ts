import 'server-only'
import { getAdminOrNull, type AdminUser } from '@/lib/auth/requireAdmin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

export const NOT_ALLOWED: ActionResult = { ok: false, error: 'Session expirée : reconnectez-vous.' }

/** Every admin server action starts here: re-checks the admin role, then returns an RLS-bound client. */
export async function adminContext(): Promise<
  { admin: AdminUser; supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> } | null
> {
  const admin = await getAdminOrNull()
  if (!admin) return null
  const supabase = await createSupabaseServerClient()
  return { admin, supabase }
}

export function zodFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {}
  for (const i of issues) {
    const key = String(i.path[0] ?? 'form')
    out[key] ??= i.message
  }
  return out
}
