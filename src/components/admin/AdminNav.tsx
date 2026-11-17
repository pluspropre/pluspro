'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'Accueil', icon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
  { href: '/admin/demandes', label: 'Devis', icon: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5' },
  { href: '/admin/realisations', label: 'Réalisations', icon: 'M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4' },
  { href: '/admin/articles', label: 'Articles', icon: 'M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4' },
  { href: '/admin/avis', label: 'Avis', icon: 'M12 3l2.6 5.6 6 .7-4.5 4.2 1.2 6L12 16.6 6.7 19.5l1.2-6L3.4 9.3l6-.7z' },
  { href: '/admin/parametres', label: 'Configuration', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4z' },
]

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

export function AdminNav({ newLeads }: { newLeads?: number }) {
  const pathname = usePathname()
  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))
  return (
    <>
      {/* desktop sidebar */}
      <nav aria-label="Administration" className="hidden flex-col gap-1 lg:flex">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active(i.href) ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-ink transition-colors hover:bg-white',
              active(i.href) && 'bg-white shadow-[var(--shadow-soft)]',
            )}
          >
            <Icon d={i.icon} />
            {i.label}
            {i.href === '/admin/demandes' && newLeads ? (
              <span className="ml-auto rounded-full bg-green px-2 py-0.5 text-[12px] font-bold text-ink">{newLeads}</span>
            ) : null}
          </Link>
        ))}
      </nav>
      {/* mobile bottom bar */}
      <nav
        aria-label="Administration"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active(i.href) ? 'page' : undefined}
            className={cn('relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-label', active(i.href) && 'text-teal-dk')}
          >
            <Icon d={i.icon} />
            {i.label === 'Configuration' ? 'Config.' : i.label}
            {i.href === '/admin/demandes' && newLeads ? (
              <span className="absolute top-2 right-[22%] size-2.5 rounded-full bg-green" aria-label={`${newLeads} nouvelles demandes`} />
            ) : null}
          </Link>
        ))}
      </nav>
    </>
  )
}
