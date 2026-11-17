import { Suspense } from 'react'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { LogoMark } from '@/components/ui/Logo'
import { signOut } from '../login/actions'

/** Prerendered per param (or request-bound); opt out of the dev-only instant-navigation validation. */
export const instant = false

async function Guard({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { count } = await supabase.from('quote_requests').select('id', { count: 'exact', head: true }).is('read_at', null)
  return (
    <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-6 pb-28 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:pb-12">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center justify-between gap-3 lg:mb-8 lg:block">
          <a href="/admin" className="flex items-center gap-3">
            <LogoMark className="size-10" />
            <span>
              <span className="block font-display text-[19px] leading-none font-extrabold text-blue">+PROPRE</span>
              <span className="text-[13px] text-label">Administration</span>
            </span>
          </a>
          <div className="flex items-center gap-2 lg:mt-6">
            <a href="/" target="_blank" className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink">
              Voir le site ↗
            </a>
            <form action={signOut}>
              <button type="submit" className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-label hover:text-ink">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
        <div className="mt-6 hidden lg:block">
          <AdminNav newLeads={count ?? 0} />
          <p className="mt-8 truncate px-4 text-[13px] text-label">{admin.email}</p>
        </div>
        <div className="lg:hidden">
          <AdminNav newLeads={count ?? 0} />
        </div>
      </aside>
      <main id="contenu">{children}</main>
    </div>
  )
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-label">Chargement…</div>}>
      <Guard>{children}</Guard>
    </Suspense>
  )
}
