import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { publicEnv } from '@/lib/env'
import type { Database } from './database.types'

let client: SupabaseClient<Database> | null = null

/** Cookie-less client for cached public reads (RLS: published rows only). Null when Supabase isn't configured. */
export function getPublicClient(): SupabaseClient<Database> | null {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL
  const key = publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  client ??= createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return client
}
