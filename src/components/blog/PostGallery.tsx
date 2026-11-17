'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { PostImage } from '@/lib/data/posts'
import { mediaUrl } from '@/lib/images'
import { ArrowLeft, ArrowRight, CloseIcon } from '@/components/ui/icons'

export function PostGallery({ images }: { images: PostImage[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open !== null && !d.open) d.showModal()
    if (open === null && d.open) d.close()
  }, [open])
  if (images.length === 0) return null
  const current = open !== null ? images[open] : null
  return (
    <section aria-labelledby="t-gallery" className="mt-16">
      <h2 id="t-gallery" className="h3">
        Galerie photos
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((img, i) => {
          const src = mediaUrl(img.path)
          return (
            <li key={img.id}>
              <button type="button" className="zoomable block w-full" onClick={() => setOpen(i)} aria-label={`Agrandir : ${img.alt || `photo ${i + 1}`}`}>
                <span className="media relative block aspect-square">
                  {src ? <Image src={src} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 260px" className="object-cover" /> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <dialog ref={ref} className="lightbox m-auto bg-dark" aria-label="Galerie" onClose={() => setOpen(null)}>
        {current ? (
          <div className="relative p-4">
            <div className="relative mx-auto aspect-[4/3] max-h-[80dvh] w-full">
              <Image src={mediaUrl(current.path) ?? ''} alt={current.alt} fill sizes="90vw" className="object-contain" />
            </div>
            {current.caption ? <p className="mt-3 text-center text-white/80">{current.caption}</p> : null}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button type="button" className="rbtn" aria-label="Photo précédente" onClick={() => setOpen((open! - 1 + images.length) % images.length)}>
                <ArrowLeft />
              </button>
              <span className="text-white">
                {open! + 1} / {images.length}
              </span>
              <button type="button" className="rbtn" aria-label="Photo suivante" onClick={() => setOpen((open! + 1) % images.length)}>
                <ArrowRight />
              </button>
              <button type="button" className="rbtn ml-4" aria-label="Fermer" onClick={() => setOpen(null)}>
                <CloseIcon />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}
