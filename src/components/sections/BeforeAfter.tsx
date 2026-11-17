'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/data/projects'
import { mediaUrl } from '@/lib/images'
import { cn } from '@/lib/utils'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { SwapIcon } from '@/components/ui/icons'

/** Single comparison slider: native range input → keyboard and screen-reader friendly. */
export function BeforeAfterSlider({
  project,
  priority,
  demo = false,
  className,
}: {
  project: Project
  priority?: boolean
  demo?: boolean
  className?: string
}) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const landscape = (project.width ?? 4) > (project.height ?? 5)
  const before = mediaUrl(project.before_path)
  const after = mediaUrl(project.after_path)

  // auto-demo once when 60 % in view (50 → 20 → 80 → 50)
  useEffect(() => {
    const el = ref.current
    if (!demo || !el || prefersReducedMotion()) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const state = { p: 50 }
        gsap
          .timeline({ onUpdate: () => setPos(Math.round(state.p * 2) / 2) })
          .to(state, { p: 20, duration: 0.9, ease: 'power2.inOut' })
          .to(state, { p: 80, duration: 1.2, ease: 'power2.inOut' })
          .to(state, { p: 50, duration: 0.9, ease: 'power2.inOut' })
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [demo, project.id])

  if (!before || !after) return null
  const sizes = landscape ? '(max-width: 1280px) 100vw, 1180px' : '(max-width: 900px) 100vw, 600px'
  return (
    <div ref={ref} className={cn('ba', landscape && 'ba--landscape', className)} style={{ '--p': `${pos}%` } as React.CSSProperties}>
      <div className="ba-layer">
        <Image src={after} alt={project.after_alt} fill sizes={sizes} priority={priority} />
      </div>
      <div className="ba-layer ba-before">
        <Image src={before} alt={project.before_alt ?? `Avant — ${project.title}`} fill sizes={sizes} priority={priority} />
      </div>
      <span className="ba-tag l" aria-hidden>
        Avant
      </span>
      <span className="ba-tag r" aria-hidden>
        Après
      </span>
      <input
        className="ba-range"
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparer avant et après : ${project.title}`}
        aria-valuetext={`${Math.round(100 - pos)} % après`}
      />
      <div className="ba-handle" aria-hidden>
        <span className="ba-knob">
          <SwapIcon />
        </span>
      </div>
    </div>
  )
}

/** Featured before/after projects with a selector (home + service pages). */
export function BeforeAfterShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0)
  const current = projects[active]
  if (!current) return null
  return (
    <div className="ba-wrap">
      <BeforeAfterSlider key={current.id} project={current} demo={active === 0} />
      <div>
        <h3 className="h3">{current.title}</h3>
        {current.description ? <p className="mt-3 max-w-md">{current.description}</p> : null}
        {projects.length > 1 ? (
          <div className="ba-thumbs mt-8" role="group" aria-label="Choisir un exemple">
            {projects.map((p, i) => {
              const thumb = mediaUrl(p.after_path)
              return (
                <button
                  key={p.id}
                  className="ba-th"
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                >
                  <span className="ba-mini">
                    {thumb ? <Image src={thumb} alt="" fill sizes="52px" className="object-cover" /> : null}
                  </span>
                  <span>
                    {p.title}
                    {p.city ? <small>{p.city}</small> : null}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
