import Image from 'next/image'
import Link from 'next/link'
import type { PostSummary } from '@/lib/data/posts'
import { mediaUrl } from '@/lib/images'
import { formatDate } from '@/lib/utils'
import { Placeholder } from '@/components/ui/Media'

export function PostCard({ post, headingLevel = 3, priority }: { post: PostSummary; headingLevel?: 2 | 3; priority?: boolean }) {
  const cover = mediaUrl(post.cover_path)
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link className="post" href={`/actualites/${post.slug}`} data-cursor="view">
      <div className="post-ph">
        {cover ? (
          <Image
            src={cover}
            alt={post.cover_alt ?? ''}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 400px"
            className="object-cover"
          />
        ) : (
          <Placeholder g="g2" />
        )}
      </div>
      <div className="post-meta">
        {post.category ? <span className="tag">{post.category.name}</span> : null}
        {post.published_at ? <time dateTime={post.published_at}>{formatDate(post.published_at, 'short')}</time> : null}
      </div>
      <H>
        <span>{post.title}</span>
      </H>
      {post.reading_minutes ? <p className="post-rt">{post.reading_minutes} min de lecture</p> : null}
    </Link>
  )
}
