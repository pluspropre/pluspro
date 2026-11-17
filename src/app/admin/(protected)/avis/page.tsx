import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { reviewSources } from '@/lib/validation/review'
import { formatRating } from '@/lib/utils'
import { ActionButton, ActionSwitch } from '@/components/admin/RowActions'
import { AdminHeader, Badge, btn, EmptyState, Panel } from '@/components/admin/ui'
import { deleteReview, moveReview, toggleReview } from './actions'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Avis clients' }

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: reviews }, { data: stats }] = await Promise.all([
    supabase.from('reviews').select('*').order('sort_order').order('created_at'),
    supabase.from('review_stats').select('*').maybeSingle(),
  ])
  return (
    <>
      <AdminHeader
        title="Avis clients"
        description="Copiez ici les avis reçus sur Google, Facebook ou d’autres plateformes."
        actions={
          <Link href="/admin/avis/nouveau" className={btn.primary}>
            + Ajouter un avis
          </Link>
        }
      />
      <Panel className="mb-6">
        <p className="text-label">Note moyenne affichée sur le site (avis publiés)</p>
        <p className="mt-1 font-display text-[40px] leading-none font-extrabold text-ink">
          {stats?.rating_avg ? formatRating(Number(stats.rating_avg)) : '—'}
          <span className="ml-2 text-[18px] font-semibold text-label">/ 5 · {stats?.review_count ?? 0} avis</span>
        </p>
      </Panel>
      {!reviews || reviews.length === 0 ? (
        <EmptyState>Aucun avis pour l’instant.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {reviews.map((r, i) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 rounded-[22px] bg-white p-5">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/avis/${r.id}`} className="font-semibold text-ink hover:underline">
                  {r.author_name}
                </Link>
                <span className="ml-2 text-star" aria-label={`${r.rating} sur 5`}>
                  {'★'.repeat(r.rating)}
                </span>
                <p className="mt-1 line-clamp-2 text-[14px] text-label">{r.content}</p>
                <p className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="blue">{reviewSources.find((s) => s.value === r.source)?.label}</Badge>
                  {!r.is_published ? <Badge tone="amber">Masqué</Badge> : null}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5">
                <ActionSwitch label="Publié" checked={r.is_published} action={toggleReview.bind(null, r.id, 'is_published')} />
                <ActionSwitch label="En avant" checked={r.is_featured} action={toggleReview.bind(null, r.id, 'is_featured')} />
                <div className="flex gap-1">
                  <ActionButton action={moveReview.bind(null, r.id, 'up')} label="Monter" className="grid size-11 place-items-center rounded-full border border-line">
                    {i === 0 ? '·' : '↑'}
                  </ActionButton>
                  <ActionButton action={moveReview.bind(null, r.id, 'down')} label="Descendre" className="grid size-11 place-items-center rounded-full border border-line">
                    {i === reviews.length - 1 ? '·' : '↓'}
                  </ActionButton>
                  <ActionButton
                    action={deleteReview.bind(null, r.id)}
                    confirm={`Supprimer l’avis de ${r.author_name} ?`}
                    label="Supprimer"
                    className="grid size-11 place-items-center rounded-full border border-danger/30 text-danger"
                  >
                    ✕
                  </ActionButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
