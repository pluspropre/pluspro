import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { AdminHeader } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Modifier la réalisation' }

export default async function EditProjectPage({ params }: PageProps<'/admin/realisations/[id]'>) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  return (
    <>
      <AdminHeader back="/admin/realisations" title="Modifier la réalisation" />
      <ProjectForm initial={data} />
    </>
  )
}
