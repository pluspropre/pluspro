import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PostForm } from '@/components/admin/PostForm'
import { AdminHeader } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Modifier l’article' }

export default async function EditPostPage({ params }: PageProps<'/admin/articles/[id]'>) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const [{ data: post }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).maybeSingle(),
    supabase.from('post_categories').select('id, name').order('sort_order'),
    supabase.from('post_images').select('path, alt, caption, width, height').eq('post_id', id).order('sort_order'),
  ])
  if (!post) notFound()
  return (
    <>
      <AdminHeader back="/admin/articles" title="Modifier l’article" />
      <PostForm
        key={post.updated_at}
        initial={post}
        categories={categories ?? []}
        initialImages={(images ?? []).map((i) => ({ ...i, caption: i.caption ?? undefined }))}
      />
    </>
  )
}
