import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** The +Propre mark (blue sphere with a broom sweep), cropped from the official logo. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <Image
      src="/images/brand/logo-mark.png"
      width={96}
      height={96}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      className={className}
      priority
    />
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
