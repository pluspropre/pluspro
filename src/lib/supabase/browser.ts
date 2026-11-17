'use client'
import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '@/lib/env'
import type { Database } from './database.types'

/** Browser client — admin-only client components (image uploads to Storage). */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'missing-key',
  )
}
