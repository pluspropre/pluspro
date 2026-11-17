import type { Metadata } from 'next'
import { ReviewForm } from '@/components/admin/ReviewForm'
import { AdminHeader } from '@/components/admin/ui'

export const metadata: Metadata = { title: 'Nouvel avis' }

export default function NewReviewPage() {
  return (
    <>
      <AdminHeader back="/admin/avis" title="Nouvel avis" />
      <ReviewForm />
    </>
  )
}
