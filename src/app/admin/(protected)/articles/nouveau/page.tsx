import type { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PostForm } from '@/components/admin/PostForm'
import { AdminHeader } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Nouvel article' }

export default async function NewPostPage() {
  const supabase = await createSupabaseServerClient()
  const { data: categories } = await supabase.from('post_categories').select('id, name').order('sort_order')
  return (
    <>
      <AdminHeader back="/admin/articles" title="Nouvel article" />
      <PostForm categories={categories ?? []} />
    </>
  )
}
