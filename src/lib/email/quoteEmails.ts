import 'server-only'
import { Resend } from 'resend'
import { getService } from '@/content/services'
import { site } from '@/content/site'
import { serverEnv } from '@/lib/env.server'
import { frequencyOptions, labelOf, type QuoteInput } from '@/lib/validation/quote'

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export function quoteRows(q: QuoteInput): [string, string][] {
  const rows: [string, string | undefined][] = [
    ['Prestation', getService(q.type)?.name ?? 'Autre'],
    ['Client', q.client === 'pro' ? 'Professionnel' : 'Particulier'],
    ['Surface', `${q.surface} m²`],
    ['Fréquence', labelOf(frequencyOptions, q.frequency)],
    ['Localisation', `${q.postalCode} ${q.city}`],
    ['Adresse', q.address],
    ['Sanitaires', q.sanitaires ? String(q.sanitaires) : undefined],
    ['Cuisines / kitchenettes', q.cuisines ? String(q.cuisines) : undefined],
    ['Bureaux / salles', q.bureaux ? String(q.bureaux) : undefined],
    ['Fenêtres et baies vitrées', q.fenetres ? String(q.fenetres) : undefined],
    ['Démarrage souhaité', q.startDate],
    ['Nom', q.fullName],
    ['Société', q.company],
    ['Fonction', q.jobTitle],
    ['E-mail', q.email],
    ['Téléphone', q.phone],
    ['Message', q.message],
  ]
  return rows.filter((r): r is [string, string] => Boolean(r[1]))
}

function layout(title: string, body: string) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F1F4F3;font-family:Arial,Helvetica,sans-serif;color:#3A4660">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0B1B3F;padding:24px 32px;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px">+PROPRE</td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 16px;font-size:22px;color:#0B1B3F">${esc(title)}</h1>${body}</td></tr>
<tr><td style="padding:20px 32px;background:#EAF8F5;font-size:13px">${esc(site.name)} · ${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)} · ${esc(site.phone.display)}</td></tr>
</table></td></tr></table></body></html>`
}

function table(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #E5E9EE;color:#56627A;vertical-align:top;width:40%">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #E5E9EE;color:#0B1B3F;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`
}

/** Sends the lead notification (reply-to = prospect) and the confirmation. Silently skipped without RESEND_API_KEY. */
export async function sendQuoteEmails(q: QuoteInput, adminUrl: string) {
  if (!serverEnv.RESEND_API_KEY) return { sent: false }
  const resend = new Resend(serverEnv.RESEND_API_KEY)
  const service = getService(q.type)?.name ?? 'Autre'
  const rows = quoteRows(q)
  const results = await Promise.allSettled([
    resend.emails.send({
      from: serverEnv.EMAIL_FROM,
      to: serverEnv.QUOTE_NOTIFICATION_TO,
      replyTo: q.email,
      subject: `Nouvelle demande de devis — ${service} — ${q.city}`,
      html: layout(
        'Nouvelle demande de devis',
        `${table(rows)}<p style="margin-top:24px"><a href="${esc(adminUrl)}" style="background:#3BB273;color:#0B1B3F;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Ouvrir dans l’espace admin</a></p>`,
      ),
    }),
    resend.emails.send({
      from: serverEnv.EMAIL_FROM,
      to: q.email,
      replyTo: site.email,
      subject: 'Votre demande de devis +Propre',
      html: layout(
        'Nous avons bien reçu votre demande',
        `<p style="font-size:16px;line-height:1.6">Bonjour ${esc(q.fullName)},<br>merci pour votre demande de devis. Nous revenons vers vous sous 24h, par téléphone ou par e-mail. Pour toute précision, appelez-nous au <a href="tel:${site.phone.e164}">${esc(site.phone.display)}</a>.</p><p style="font-size:15px;margin:24px 0 8px;color:#0B1B3F;font-weight:700">Récapitulatif</p>${table(rows)}`,
      ),
    }),
  ])
  results.forEach((r) => r.status === 'rejected' && console.error('[quote] email failed'))
  return { sent: results.every((r) => r.status === 'fulfilled') }
}
