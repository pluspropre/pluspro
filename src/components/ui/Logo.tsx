import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Vector redraw of the +Propre mark (blue sphere with a broom sweep) — replaces the raster logo.jpg. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="pp-mark" x1="0.85" y1="0.1" x2="0.2" y2="0.95">
          <stop offset="0" stopColor="#9DB2F5" />
          <stop offset="0.55" stopColor="#6F7FC6" />
          <stop offset="1" stopColor="#4D5BA6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#pp-mark)" />
      <path
        d="M49 3.5C31 9 21.5 28 23.5 50.5 25.5 72 39 88 57.5 95.5 46 86 40.5 76.5 43.5 68.5c8 7.5 18 9.5 29.5 7.5-12-3.5-20-9.5-23-17.5 10.5 5 22.5 5 33.5.5C66.5 56 55 47.5 51 35.5 47.5 24.5 47 13 49 3.5Z"
        fill="#fff"
      />
      <path d="M27.5 30.5 46 28M25.5 39.5 46.5 36.5" stroke="#6F7FC6" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="66" cy="20" r="3.4" fill="#fff" />
      <path d="M72 24.5c7 4 11 11 11.5 19" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className, tone = 'blue' }: { className?: string; tone?: 'blue' | 'white' }) {
  return (
    <Link href="/" className={cn('logo', className)} aria-label="+Propre, accueil" style={tone === 'white' ? { color: '#fff' } : undefined}>
      <LogoMark className="logo-mark" />
      <span className="logo-word">+PROPRE</span>
    </Link>
  )
}
