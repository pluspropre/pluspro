import type { Metadata } from 'next'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { AdminHeader } from '@/components/admin/ui'

export const metadata: Metadata = { title: 'Nouvelle réalisation' }

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader back="/admin/realisations" title="Nouvelle réalisation" description="Prenez la photo avant et après, ajoutez un titre, publiez." />
      <ProjectForm />
    </>
  )
}
