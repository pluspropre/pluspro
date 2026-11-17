import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ReviewForm } from '@/components/admin/ReviewForm'
import { AdminHeader } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Modifier l’avis' }

export default async function EditReviewPage({ params }: PageProps<'/admin/avis/[id]'>) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('reviews').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  return (
    <>
      <AdminHeader back="/admin/avis" title="Modifier l’avis" />
      <ReviewForm initial={data} />
    </>
  )
}
