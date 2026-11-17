'use server'
import { headers } from 'next/headers'
import { PRIVACY_VERSION } from '@/content/legal/politique-de-confidentialite'
import { siteUrl } from '@/lib/env'
import { serverEnv } from '@/lib/env.server'
import { sendQuoteEmails } from '@/lib/email/quoteEmails'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { antiSpamSchema, quoteSchema } from '@/lib/validation/quote'

export type QuoteResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> }

const GENERIC = 'Votre demande n’a pas pu être envoyée. Réessayez dans un instant ou appelez-nous.'

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  if (!serverEnv.TURNSTILE_SECRET_KEY) return true // not configured (local dev)
  if (!token) return false
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim()
  const body = new URLSearchParams({ secret: serverEnv.TURNSTILE_SECRET_KEY, response: token })
  if (ip) body.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const json = (await res.json()) as { success?: boolean }
    return Boolean(json.success)
  } catch {
    return false
  }
}

export async function submitQuote(input: unknown): Promise<QuoteResult> {
  const raw = (input ?? {}) as Record<string, unknown>
  const spam = antiSpamSchema.safeParse(raw)
  // honeypot filled or submitted faster than a human could: pretend success, store nothing
  if (!spam.success || (spam.data.website ?? '') !== '' || Date.now() - spam.data.startedAt < 3000) {
    return { ok: true }
  }

  const parsed = quoteSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] ??= issue.message
    }
    return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors }
  }
  const q = parsed.data

  if (!(await verifyTurnstile(spam.data.turnstileToken))) {
    return { ok: false, error: 'La vérification anti-spam a échoué. Rechargez la page et réessayez.' }
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    console.error('[quote] Supabase secret key missing')
    return { ok: false, error: GENERIC }
  }

  // throttle: max 3 requests per e-mail in 10 minutes
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('email', q.email)
    .gte('created_at', since)
  if ((count ?? 0) >= 3) {
    return { ok: false, error: 'Vous avez déjà envoyé plusieurs demandes. Nous revenons vers vous très vite.' }
  }

  const { data, error } = await supabase
    .from('quote_requests')
    .insert({
      service_slug: q.type,
      client_type: q.client,
      surface: q.surfaceExact ? `${q.surface} (${q.surfaceExact} m²)` : q.surface,
      frequency: q.frequency,
      postal_code: q.postalCode,
      city: q.city,
      details: {
        sanitaires: q.sanitaires || null,
        cuisines: q.cuisines || null,
        bureaux: q.bureaux || null,
        vitrage: q.vitrage || null,
        acces: q.acces ?? [],
        startDate: q.startDate || null,
        address: q.address || null,
      },
      full_name: q.fullName,
      company: q.company || null,
      job_title: q.jobTitle || null,
      email: q.email,
      phone: q.phone,
      callback_time: q.callbackTime ?? null,
      message: q.message || null,
      consent_at: new Date().toISOString(),
      consent_version: PRIVACY_VERSION,
      source_path: spam.data.sourcePath ?? '/devis',
    })
    .select('id')
    .single()
  if (error || !data) {
    console.error('[quote] insert failed', error?.code)
    return { ok: false, error: GENERIC }
  }

  await sendQuoteEmails(q, `${siteUrl()}/admin/demandes/${data.id}`)
  return { ok: true }
}
