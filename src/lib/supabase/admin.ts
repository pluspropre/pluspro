import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { publicEnv } from '@/lib/env'
import { serverEnv } from '@/lib/env.server'
import type { Database } from './database.types'

/** Secret-key client (bypasses RLS). Server-only: used exclusively to insert quote requests. */
export function createSupabaseAdminClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL
  const key = serverEnv.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
