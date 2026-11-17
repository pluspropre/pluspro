import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Eyebrow } from './Eyebrow'

/** Eyebrow + uppercase H2 (pass the accent word as <em className="serif">) + optional lead on the right. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  as: Tag = 'h2',
  className,
  small,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  id?: string
  as?: 'h1' | 'h2'
  className?: string
  small?: boolean
}) {
  return (
    <div className={cn('sec-head', !lead && 'sec-head--solo', className)}>
      <div data-reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Tag className={cn('h2', small && 'h2--sm')} id={id}>
          {title}
        </Tag>
      </div>
      {lead ? (
        <div className="lead" data-reveal>
          {lead}
        </div>
      ) : null}
    </div>
  )
}
