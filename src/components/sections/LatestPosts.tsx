import { getPublishedPosts } from '@/lib/data/posts'
import { PostCard } from '@/components/blog/PostCard'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Latest 3 articles — hidden when nothing is published yet. */
export async function LatestPosts({ service, title }: { service?: string; title?: React.ReactNode }) {
  const { posts } = await getPublishedPosts({ limit: 3, service })
  if (posts.length === 0) return null
  return (
    <section className="sec sec--tight" id="actualites" aria-labelledby="t-news">
      <div className="wrap">
        <SectionHeading
          eyebrow="Le journal"
          id="t-news"
          title={
            title ?? (
              <>
                Nos <em className="serif">actualités</em>
              </>
            )
          }
          lead={
            <span className="flex justify-end">
              <ButtonLink href="/actualites" variant="ghost" arrow={false}>
                Tous les articles
              </ButtonLink>
            </span>
          }
        />
        <div className="posts">
          {posts.map((p) => (
            <div key={p.id} data-reveal>
              <PostCard post={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
