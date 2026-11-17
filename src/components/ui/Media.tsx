import Image from 'next/image'
import { cn } from '@/lib/utils'

export type Gradient = 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'

/** Branded gradient placeholder (docs/04 §3) — used whenever a photo is missing. */
export function Placeholder({ g = 'g1', label, className }: { g?: Gradient; label?: string; className?: string }) {
  return (
    <div className={cn('ph', className)} aria-hidden={label ? undefined : true}>
      <div className={cn('ph-img', g)} />
      {label ? <span className="ph-tag">{label}</span> : null}
    </div>
  )
}

/** Fill-mode image inside a positioned parent, with the placeholder as fallback. */
export function FillImage({
  src,
  alt,
  sizes,
  priority,
  g = 'g1',
  className,
  quality,
}: {
  src: string | null | undefined
  alt: string
  sizes: string
  priority?: boolean
  g?: Gradient
  className?: string
  quality?: 75 | 85
}) {
  if (!src) return <Placeholder g={g} />
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={cn('object-cover', className)}
    />
  )
}
