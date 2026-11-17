import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { connection } from 'next/server'
import { publicEnv } from '@/lib/env'
import type { Database } from './database.types'

/** Cookie-aware client for admin pages and server actions: queries run as the signed-in user (RLS applies). */
export async function createSupabaseServerClient() {
  // Everything behind this client is per-request: Supabase auth reads the clock (`Date.now()`) to check session
  // expiry, and callers compare against `new Date()`. With cacheComponents + runtime prefetching, cookies() alone
  // doesn't stop Next from prerendering past this point, which fails with "unstable value Date.now()".
  await connection()
  const cookieStore = await cookies()
  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'missing-key',
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component: the proxy refreshes the session instead.
          }
        },
      },
    },
  )
}
