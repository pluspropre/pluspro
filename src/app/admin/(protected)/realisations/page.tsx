import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getService } from '@/content/services'
import { mediaUrl } from '@/lib/images'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ActionButton, ActionSwitch } from '@/components/admin/RowActions'
import { AdminHeader, Badge, btn, EmptyState } from '@/components/admin/ui'
import { deleteProject, moveProject, toggleProject } from './actions'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Réalisations' }

export default async function AdminProjectsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, service_slug, city, after_path, before_path, is_published, is_featured, performed_on')
    .order('sort_order')
    .order('created_at')
  return (
    <>
      <AdminHeader
        title="Réalisations"
        description="Photos avant / après affichées sur la page Réalisations, l’accueil et les pages services."
        actions={
          <Link href="/admin/realisations/nouveau" className={btn.primary}>
            + Ajouter une réalisation
          </Link>
        }
      />
      {!projects || projects.length === 0 ? (
        <EmptyState>Aucune réalisation pour l’instant.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {projects.map((p, i) => {
            const src = mediaUrl(p.after_path)
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-[22px] bg-white p-3 pr-5">
                <Link href={`/admin/realisations/${p.id}`} className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-surface-2">
                  {src ? <Image src={src} alt="" fill sizes="80px" className="object-cover" /> : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/realisations/${p.id}`} className="font-semibold text-ink hover:underline">
                    {p.title}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-label">
                    {getService(p.service_slug ?? '')?.name ?? '—'}
                    {p.before_path ? <Badge tone="blue">Avant / après</Badge> : <Badge>Photo seule</Badge>}
                    {p.is_published ? <Badge tone="green">Publiée</Badge> : <Badge tone="amber">Brouillon</Badge>}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                  <ActionSwitch label="Publiée" checked={p.is_published} action={toggleProject.bind(null, p.id, 'is_published')} />
                  <ActionSwitch label="Accueil" checked={p.is_featured} action={toggleProject.bind(null, p.id, 'is_featured')} />
                  <div className="flex gap-1">
                    <ActionButton action={moveProject.bind(null, p.id, 'up')} label="Monter" className="grid size-11 place-items-center rounded-full border border-line" >
                      {i === 0 ? '·' : '↑'}
                    </ActionButton>
                    <ActionButton action={moveProject.bind(null, p.id, 'down')} label="Descendre" className="grid size-11 place-items-center rounded-full border border-line">
                      {i === projects.length - 1 ? '·' : '↓'}
                    </ActionButton>
                    <ActionButton
                      action={deleteProject.bind(null, p.id)}
                      confirm={`Supprimer « ${p.title} » ? Les photos seront effacées.`}
                      label="Supprimer"
                      className="grid size-11 place-items-center rounded-full border border-danger/30 text-danger"
                    >
                      ✕
                    </ActionButton>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
