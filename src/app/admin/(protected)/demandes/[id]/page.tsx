import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { e164, leadCallback, leadFrequency, leadService, leadSurface } from '@/lib/admin/leads'
import { accessOptions, labelOf } from '@/lib/validation/quote'
import { formatDateTime } from '@/lib/utils'
import { AdminHeader, Badge, btn, Panel } from '@/components/admin/ui'
import { LeadButtons, MarkReadOnOpen } from './LeadActions'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Demande de devis' }

type Details = { sanitaires?: number; cuisines?: number; bureaux?: number; vitrage?: string; acces?: string[]; startDate?: string; address?: string }

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[200px_1fr]">
      <dt className="text-[14px] text-label">{label}</dt>
      <dd className="font-medium whitespace-pre-wrap text-ink">{value}</dd>
    </div>
  )
}

export default async function LeadPage({ params }: PageProps<'/admin/demandes/[id]'>) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: l } = await supabase.from('quote_requests').select('*').eq('id', id).maybeSingle()
  if (!l) notFound()
  const d = (l.details ?? {}) as Details
  const tel = e164(l.phone)
  const subject = encodeURIComponent(`Votre demande de devis +Propre — ${leadService(l)}`)
  const greeting = encodeURIComponent(`Bonjour ${l.full_name},\n\nMerci pour votre demande de devis concernant : ${leadService(l)}.\n\n`)

  return (
    <>
      <MarkReadOnOpen id={l.id} unread={!l.read_at} />
      <AdminHeader
        back="/admin/demandes"
        title={l.full_name}
        description={
          <>
            Reçue le {formatDateTime(l.created_at)} · {l.client_type === 'particulier' ? 'Particulier' : 'Professionnel'}{' '}
            {l.read_at ? <Badge>Lue</Badge> : <Badge tone="green">Nouvelle</Badge>}
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <Panel title="Besoin">
            <dl>
              <Row label="Prestation" value={leadService(l)} />
              <Row label="Surface" value={leadSurface(l)} />
              <Row label="Fréquence" value={leadFrequency(l)} />
              <Row label="Localisation" value={[l.postal_code, l.city].filter(Boolean).join(' ')} />
              <Row label="Adresse" value={d.address} />
              <Row label="Sanitaires" value={d.sanitaires} />
              <Row label="Cuisines / kitchenettes" value={d.cuisines} />
              <Row label="Bureaux / salles" value={d.bureaux} />
              <Row label="Surface vitrée" value={d.vitrage} />
              <Row label="Accès" value={d.acces?.map((a) => labelOf(accessOptions, a)).join(', ')} />
              <Row label="Démarrage souhaité" value={d.startDate} />
            </dl>
          </Panel>
          {l.message ? (
            <Panel title="Message">
              <p className="whitespace-pre-wrap text-ink">{l.message}</p>
            </Panel>
          ) : null}
          <Panel title="Coordonnées">
            <dl>
              <Row label="Nom" value={l.full_name} />
              <Row label="Société" value={l.company} />
              <Row label="Fonction" value={l.job_title} />
              <Row label="Téléphone" value={l.phone} />
              <Row label="E-mail" value={l.email} />
              <Row label="Rappel préféré" value={leadCallback(l)} />
              <Row label="Consentement" value={`${formatDateTime(l.consent_at)} (version ${l.consent_version})`} />
            </dl>
          </Panel>
        </div>
        <div className="grid content-start gap-6 xl:sticky xl:top-6">
          <Panel title="Contacter le client">
            <div className="grid gap-3">
              <a className={btn.primary} href={`tel:${tel}`}>
                Appeler · {l.phone}
              </a>
              <a className={btn.dark} href={`mailto:${l.email}?subject=${subject}&body=${greeting}`}>
                Écrire un e-mail
              </a>
              <a className={btn.ghost} href={`sms:${tel}`}>
                Envoyer un SMS
              </a>
              <a className={btn.ghost} href={`https://wa.me/${tel.replace('+', '')}`} target="_blank" rel="noopener">
                WhatsApp
              </a>
            </div>
            {leadCallback(l) ? <p className="mt-4 text-[14px] text-label">Préfère être rappelé : {leadCallback(l).toLowerCase()}.</p> : null}
          </Panel>
          <Panel>
            <p className="mb-4 text-[14px] text-label">
              Les demandes sont conservées 3 ans puis supprimées automatiquement. Vous pouvez en supprimer une à tout moment
              à la demande du client.
            </p>
            <LeadButtons id={l.id} />
          </Panel>
        </div>
      </div>
    </>
  )
}
