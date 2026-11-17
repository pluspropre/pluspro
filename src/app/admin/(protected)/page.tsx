import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { leadService } from '@/lib/admin/leads'
import { formatDateTime } from '@/lib/utils'
import { AdminHeader, Badge, btn, Panel } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Tableau de bord' }

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const now = new Date().toISOString()
  const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0
  const [newLeads, published, scheduled, drafts, projects, reviews, latest] = await Promise.all([
    count(supabase.from('quote_requests').select('id', { count: 'exact', head: true }).is('read_at', null)),
    count(supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published').lte('published_at', now)),
    count(supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published').gt('published_at', now)),
    count(supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft')),
    count(supabase.from('projects').select('id', { count: 'exact', head: true })),
    count(supabase.from('reviews').select('id', { count: 'exact', head: true })),
    supabase.from('quote_requests').select('id, created_at, full_name, service_slug, city, read_at').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Nouvelles demandes', value: newLeads, href: '/admin/demandes?filtre=non-lues', highlight: newLeads > 0 },
    { label: 'Articles publiés', value: published, href: '/admin/articles' },
    { label: 'Articles programmés', value: scheduled, href: '/admin/articles' },
    { label: 'Brouillons', value: drafts, href: '/admin/articles' },
    { label: 'Réalisations', value: projects, href: '/admin/realisations' },
    { label: 'Avis clients', value: reviews, href: '/admin/avis' },
  ]

  return (
    <>
      <AdminHeader title="Bonjour 👋" description="Que souhaitez-vous faire aujourd’hui ?" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/realisations/nouveau" className={`${btn.primary} min-h-16 text-[17px]`}>
          + Ajouter une réalisation
        </Link>
        <Link href="/admin/articles/nouveau" className={`${btn.dark} min-h-16 text-[17px]`}>
          + Nouvel article
        </Link>
        <Link href="/admin/avis/nouveau" className={`${btn.ghost} min-h-16 text-[17px]`}>
          + Ajouter un avis
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className={`block rounded-[22px] p-5 ${s.highlight ? 'bg-green' : 'bg-white'}`}>
              <span className="block font-display text-[34px] leading-none font-extrabold text-ink">{s.value}</span>
              <span className="mt-2 block text-[14px] font-semibold text-ink/80">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Panel title="Dernières demandes de devis" className="mt-6">
        {latest.data && latest.data.length > 0 ? (
          <ul className="divide-y divide-line">
            {latest.data.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/demandes/${l.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span>
                    <span className="font-semibold text-ink">{l.full_name}</span>
                    <span className="block text-[14px] text-label">
                      {leadService(l)}
                      {l.city ? ` · ${l.city}` : ''} · {formatDateTime(l.created_at)}
                    </span>
                  </span>
                  {l.read_at ? <Badge>Lue</Badge> : <Badge tone="green">Nouvelle</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-label">Aucune demande pour le moment.</p>
        )}
        <Link href="/admin/demandes" className="mt-4 inline-block font-semibold text-teal-dk">
          Toutes les demandes →
        </Link>
      </Panel>
    </>
  )
}
