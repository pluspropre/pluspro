import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { mediaUrl } from '@/lib/images'
import { formatDate } from '@/lib/utils'
import { PostGallery } from '@/components/blog/PostGallery'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Aperçu' }

/** Admin-only preview: renders the public article template with the draft content. */
export default async function PreviewPage({ params }: PageProps<'/admin/articles/[id]/apercu'>) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const [{ data: post }, { data: images }] = await Promise.all([
    supabase.from('posts').select('*, category:post_categories(name)').eq('id', id).maybeSingle(),
    supabase.from('post_images').select('id, path, alt, caption, width, height').eq('post_id', id).order('sort_order'),
  ])
  if (!post) notFound()
  const cover = mediaUrl(post.cover_path)
  return (
    <div className="overflow-hidden rounded-[28px] bg-white">
      <p className="bg-ink px-5 py-3 text-center text-[14px] font-semibold text-white">Aperçu — cet article n’est visible que par vous tant qu’il n’est pas publié.</p>
      <div className="mx-auto max-w-[860px] px-5 py-12">
        <div className="post-meta">
          {(post.category as { name: string } | null)?.name ? <span className="tag">{(post.category as { name: string }).name}</span> : null}
          <span>{formatDate(post.published_at ?? post.updated_at)}</span>
          {post.reading_minutes ? <span>{post.reading_minutes} min de lecture</span> : null}
        </div>
        <h1 className="h1 h1--page mt-5">{post.title}</h1>
        {post.excerpt ? <p className="lead mt-6">{post.excerpt}</p> : null}
        {cover ? (
          <div className="media relative mt-10 aspect-[16/9]">
            <Image src={cover} alt={post.cover_alt ?? ''} fill sizes="860px" className="object-cover" />
          </div>
        ) : null}
        <div className="prose mx-auto mt-10" dangerouslySetInnerHTML={{ __html: post.content_html ?? '' }} />
        <PostGallery images={images ?? []} />
      </div>
    </div>
  )
}
