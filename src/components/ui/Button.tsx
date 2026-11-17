import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from './icons'

type Variant = 'green' | 'ghost' | 'dark'

function ArrowSwap() {
  return (
    <span className="ic" aria-hidden>
      <ArrowUpRight className="a1" />
      <ArrowUpRight className="a2" />
    </span>
  )
}

function inner(variant: Variant, children: ReactNode, arrow: boolean) {
  if (variant === 'dark')
    return (
      <>
        {arrow && <ArrowSwap />}
        <span className="bt">{children}</span>
      </>
    )
  return (
    <>
      {children}
      {arrow && variant !== 'ghost' && <ArrowSwap />}
    </>
  )
}

export function ButtonLink({
  href,
  variant = 'green',
  arrow = true,
  magnetic = false,
  className,
  children,
  ...rest
}: Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
  variant?: Variant
  arrow?: boolean
  magnetic?: boolean
}) {
  const cls = cn('btn', `btn--${variant}`, !arrow && 'btn--plain', magnetic && 'mag', className)
  if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a href={href} className={cls} {...(rest as ComponentProps<'a'>)}>
        {inner(variant, children, arrow)}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner(variant, children, arrow)}
    </Link>
  )
}

export function Button({
  variant = 'green',
  arrow = true,
  className,
  children,
  type = 'button',
  ...rest
}: ComponentProps<'button'> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button type={type} className={cn('btn', `btn--${variant}`, !arrow && 'btn--plain', className)} {...rest}>
      {inner(variant, children, arrow)}
    </button>
  )
}
