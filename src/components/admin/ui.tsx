import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AdminHeader({ title, back, actions, description }: { title: string; back?: string; actions?: ReactNode; description?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back ? (
          <Link href={back} className="mb-2 inline-flex items-center gap-1 text-[14px] font-semibold text-teal-dk">
            ← Retour
          </Link>
        ) : null}
        <h1 className="font-display text-[30px] leading-tight font-extrabold tracking-tight text-ink md:text-[36px]">{title}</h1>
        {description ? <p className="mt-1 text-label">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function Panel({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <section className={cn('rounded-[24px] bg-white p-5 shadow-[0_1px_0_rgb(11_27_63/0.04)] md:p-7', className)}>
      {title ? <h2 className="mb-5 font-display text-[19px] font-bold text-ink">{title}</h2> : null}
      {children}
    </section>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'blue' | 'amber' | 'red' }) {
  const tones = {
    neutral: 'bg-surface-2 text-label',
    green: 'bg-mint text-teal-dk',
    blue: 'bg-[#E1E8FA] text-blue',
    amber: 'bg-[#FDF3D7] text-[#7A5600]',
    red: 'bg-[#FDECEA] text-danger',
  }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-bold', tones[tone])}>{children}</span>
}

export function EmptyState({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-[24px] border-2 border-dashed border-line bg-white/60 p-10 text-center">
      <p className="text-label">{children}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export const btn = {
  primary: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green px-6 font-semibold text-ink transition-colors hover:bg-green-h disabled:opacity-60',
  dark: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 font-semibold text-white transition-colors hover:bg-[#13275a] disabled:opacity-60',
  ghost: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-ink transition-colors hover:border-ink disabled:opacity-60',
  danger: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-danger/30 bg-white px-5 font-semibold text-danger transition-colors hover:bg-[#FDECEA] disabled:opacity-60',
}
