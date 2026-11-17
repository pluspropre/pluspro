import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { leadService, leadSurface } from '@/lib/admin/leads'
import { formatDateTime } from '@/lib/utils'
import { AdminHeader, Badge, btn, EmptyState } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Demandes de devis' }

export default async function LeadsPage({ searchParams }: PageProps<'/admin/demandes'>) {
  const sp = await searchParams
  const filter = sp.filtre === 'non-lues' ? 'unread' : 'all'
  const supabase = await createSupabaseServerClient()
  let query = supabase
    .from('quote_requests')
    .select('id, created_at, full_name, company, service_slug, city, postal_code, surface, client_type, phone, email, read_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (filter === 'unread') query = query.is('read_at', null)
  const { data: leads } = await query

  return (
    <>
      <AdminHeader
        title="Demandes de devis"
        description="Les demandes envoyées depuis le site. Ouvrez une demande pour contacter le client par téléphone ou e-mail."
        actions={
          <a className={btn.ghost} href="/admin/demandes/export" download>
            Exporter (CSV)
          </a>
        }
      />
      <div className="mb-6 flex gap-2">
        <Link href="/admin/demandes" className="filter-chip" aria-current={filter === 'all' ? 'page' : undefined}>
          Toutes
        </Link>
        <Link href="/admin/demandes?filtre=non-lues" className="filter-chip" aria-current={filter === 'unread' ? 'page' : undefined}>
          Non lues
        </Link>
      </div>
      {!leads || leads.length === 0 ? (
        <EmptyState>{filter === 'unread' ? 'Aucune demande non lue. 👍' : 'Aucune demande pour le moment.'}</EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {leads.map((l) => (
            <li key={l.id}>
              <Link
                href={`/admin/demandes/${l.id}`}
                className="block h-full rounded-[22px] border border-transparent bg-white p-5 transition-colors hover:border-ink"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[18px] font-bold text-ink">{l.full_name}</p>
                    {l.company ? <p className="truncate text-[14px] text-label">{l.company}</p> : null}
                  </div>
                  {l.read_at ? <Badge>Lue</Badge> : <Badge tone="green">Nouvelle</Badge>}
                </div>
                <p className="mt-4 font-semibold text-ink">{leadService(l)}</p>
                <p className="text-[14px] text-label">
                  {[leadSurface(l), [l.postal_code, l.city].filter(Boolean).join(' ')].filter(Boolean).join(' · ')}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3 text-[13px] text-label">
                  <time dateTime={l.created_at}>{formatDateTime(l.created_at)}</time>
                  <span>{l.client_type === 'particulier' ? 'Particulier' : 'Professionnel'}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
