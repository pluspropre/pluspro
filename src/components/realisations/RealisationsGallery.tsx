'use client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/data/projects'
import { mediaUrl } from '@/lib/images'
import { formatDate } from '@/lib/utils'
import { BeforeAfterSlider } from '@/components/sections/BeforeAfter'
import { CloseIcon } from '@/components/ui/icons'

type Filter = { slug: string; name: string }

/** Filter chips (URL ?service= for shareability) + cards + accessible lightbox dialog. */
type Props = { projects: Project[]; filters: Filter[] }

/** Reads ?service= from the URL (suspends during prerender; the static fallback shows everything). */
export function RealisationsGalleryWithParams(props: Props) {
  const params = useSearchParams()
  return <RealisationsGallery {...props} active={params.get('service') ?? ''} />
}

export function RealisationsGallery({ projects, filters, active = '' }: Props & { active?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState<Project | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const list = active ? projects.filter((p) => p.service_slug === active) : projects
  const nameOf = (slug: string | null) => filters.find((f) => f.slug === slug)?.name

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const setFilter = (slug: string) => {
    const url = slug ? `/realisations?service=${slug}` : '/realisations'
    router.replace(url, { scroll: false })
  }

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par service">
        <button type="button" className="filter-chip" aria-pressed={!active} onClick={() => setFilter('')}>
          Toutes
        </button>
        {filters.map((f) => (
          <button key={f.slug} type="button" className="filter-chip" aria-pressed={active === f.slug} onClick={() => setFilter(f.slug)}>
            {f.name}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {list.length} réalisation{list.length > 1 ? 's' : ''}
      </p>
      <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const after = mediaUrl(p.after_path)
          const before = mediaUrl(p.before_path)
          return (
            <li key={p.id}>
              <button type="button" className="zoomable block w-full text-left" onClick={() => setOpen(p)} data-cursor="view">
                <div className="media relative aspect-[4/5]">
                  {after ? <Image src={after} alt={p.after_alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover" /> : null}
                  {before ? (
                    <span className="absolute top-4 left-4 z-[2] h-24 w-20 overflow-hidden rounded-2xl border-[3px] border-white shadow-lg">
                      <Image src={before} alt="" fill sizes="80px" className="object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-0.5 text-center text-[10px] font-bold tracking-widest text-white uppercase">
                        Avant
                      </span>
                    </span>
                  ) : null}
                  <span className="ph-tag">{before ? 'Voir l’avant / après' : 'Agrandir'}</span>
                </div>
                <div className="post-meta">
                  {nameOf(p.service_slug) ? <span className="tag">{nameOf(p.service_slug)}</span> : null}
                  {p.city ? <span>{p.city}</span> : null}
                  {p.performed_on ? <time dateTime={p.performed_on}>{formatDate(p.performed_on, 'short')}</time> : null}
                </div>
                <h2 className="h3 mt-3">{p.title}</h2>
                {p.description ? <p className="mt-2 text-[16px]">{p.description}</p> : null}
              </button>
            </li>
          )
        })}
      </ul>
      {list.length === 0 ? <p className="mt-10">Aucune réalisation pour ce service pour le moment.</p> : null}

      <dialog
        ref={dialogRef}
        className="lightbox m-auto"
        aria-labelledby="lb-title"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialogRef.current && setOpen(null)}
      >
        {open ? (
          <div className="p-5 md:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="lb-title" className="h3">
                  {open.title}
                </h2>
                {open.description ? <p className="mt-1 text-[16px]">{open.description}</p> : null}
              </div>
              <button type="button" className="rbtn shrink-0" aria-label="Fermer" onClick={() => setOpen(null)}>
                <CloseIcon />
              </button>
            </div>
            {open.before_path ? (
              <BeforeAfterSlider project={open} className="mx-auto max-h-[75dvh]" />
            ) : (
              <div className="media relative mx-auto aspect-[4/5] max-h-[75dvh]">
                {mediaUrl(open.after_path) ? (
                  <Image src={mediaUrl(open.after_path)!} alt={open.after_alt} fill sizes="90vw" className="object-contain" />
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </dialog>
    </>
  )
}
