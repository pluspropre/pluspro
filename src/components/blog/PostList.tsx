import Link from 'next/link'
import { getPublishedPosts, POSTS_PER_PAGE } from '@/lib/data/posts'
import { cn } from '@/lib/utils'
import { PostCard } from './PostCard'

/** Grid + real pagination links (?page=2). The first post of page 1 is featured large. */
export async function PostList({ page, category, basePath }: { page: number; category?: string; basePath: string }) {
  const { posts, total } = await getPublishedPosts({ page, category })
  const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
  if (posts.length === 0) {
    return (
      <div className="card-soft p-10 text-center">
        <p className="lead">Nos premiers articles arrivent bientôt. En attendant, découvrez nos réalisations.</p>
        <Link className="link mt-4 inline-block" href="/realisations">
          Voir les réalisations
        </Link>
      </div>
    )
  }
  const [first, ...rest] = posts
  const featured = page === 1 && !category
  return (
    <>
      {featured ? (
        <div className="mb-16 grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <PostCard post={first} headingLevel={2} priority />
        </div>
      ) : null}
      <div className="posts">
        {(featured ? rest : posts).map((p) => (
          <PostCard key={p.id} post={p} headingLevel={2} />
        ))}
      </div>
      {pages > 1 ? (
        <nav className="mt-16 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? basePath : `${basePath}?page=${n}`}
              className={cn('filter-chip min-w-11 justify-center')}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </Link>
          ))}
        </nav>
      ) : null}
    </>
  )
}

export function CategoryNav({ categories, active }: { categories: { slug: string; name: string }[]; active?: string }) {
  return (
    <nav aria-label="Catégories" className="mb-12 flex flex-wrap gap-2">
      <Link className="filter-chip" href="/actualites" aria-current={!active ? 'page' : undefined}>
        Tous les articles
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          className="filter-chip"
          href={`/actualites/categorie/${c.slug}`}
          aria-current={active === c.slug ? 'page' : undefined}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  )
}
