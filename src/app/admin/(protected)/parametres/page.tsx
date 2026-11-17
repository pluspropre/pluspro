import type { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { parseSettings } from '@/lib/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { AdminHeader, Badge, Panel } from '@/components/admin/ui'

/** Per-request admin session (see src/lib/supabase/server.ts): may block; loading.tsx streams meanwhile. */
export const instant = false

export const metadata: Metadata = { title: 'Configuration' }

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: row }, { data: profiles }] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('profiles').select('id, full_name, role, created_at').order('created_at'),
  ])
  return (
    <>
      <AdminHeader title="Configuration" description="Les informations modifiables du site : chiffres, horaires, engagement, avis, mentions légales." />
      <SettingsForm initial={parseSettings(row)} />
      <Panel title="Accès administrateurs" className="mt-6">
        <ul className="divide-y divide-line">
          {(profiles ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3">
              <span className="text-ink">{p.full_name || 'Administrateur'}</span>
              <Badge tone={p.role === 'viewer' ? 'amber' : 'green'}>{p.role === 'viewer' ? 'En attente' : 'Admin'}</Badge>
            </li>
          ))}
        </ul>
        <p className="form-hint mt-4">
          Pour ajouter un administrateur : invitez son e-mail depuis le tableau de bord Supabase (Authentication → Users →
          Invite), puis passez son rôle à « admin » (voir README).
        </p>
      </Panel>
    </>
  )
}
