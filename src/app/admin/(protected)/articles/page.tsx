import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils'
import { AdminHeader, Badge, btn, EmptyState } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Articles' }

function isFuture(iso: string | null) {
  return Boolean(iso && new Date(iso).getTime() > Date.now())
}

export default async function AdminPostsPage({ searchParams }: PageProps<'/admin/articles'>) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q.trim() : ''
  const cat = typeof sp.categorie === 'string' ? sp.categorie : ''
  const supabase = await createSupabaseServerClient()
  const [{ data: categories }, postsRes] = await Promise.all([
    supabase.from('post_categories').select('id, name').order('sort_order'),
    (() => {
      let query = supabase
        .from('posts')
        .select('id, title, slug, status, published_at, updated_at, category:post_categories(name)')
        .order('updated_at', { ascending: false })
      if (q) query = query.ilike('title', `%${q.replace(/[%_]/g, '')}%`)
      if (cat) query = query.eq('category_id', cat)
      return query
    })(),
  ])
  const posts = postsRes.data ?? []
  return (
    <>
      <AdminHeader
        title="Articles"
        actions={
          <Link href="/admin/articles/nouveau" className={btn.primary}>
            + Nouvel article
          </Link>
        }
      />
      <form className="mb-6 flex flex-wrap gap-2" role="search">
        <label className="sr-only" htmlFor="q">
          Rechercher
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Rechercher un titre…" className="input max-w-xs !min-h-11 bg-white" />
        <label className="sr-only" htmlFor="categorie">
          Catégorie
        </label>
        <select id="categorie" name="categorie" defaultValue={cat} className="input max-w-[220px] !min-h-11 bg-white">
          <option value="">Toutes catégories</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className={btn.ghost}>
          Filtrer
        </button>
      </form>
      {posts.length === 0 ? (
        <EmptyState>Aucun article.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {posts.map((p) => {
            const scheduled = p.status === 'published' && isFuture(p.published_at)
            return (
              <li key={p.id}>
                <Link href={`/admin/articles/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-white p-5 hover:ring-1 hover:ring-ink">
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{p.title}</span>
                    <span className="text-[13px] text-label">
                      {(p.category as { name: string } | null)?.name ?? 'Sans catégorie'} · modifié le {formatDateTime(p.updated_at)}
                    </span>
                  </span>
                  {p.status === 'draft' ? (
                    <Badge tone="amber">Brouillon</Badge>
                  ) : p.status === 'archived' ? (
                    <Badge>Archivé</Badge>
                  ) : scheduled ? (
                    <Badge tone="blue">Programmé · {formatDateTime(p.published_at!)}</Badge>
                  ) : (
                    <Badge tone="green">Publié</Badge>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
