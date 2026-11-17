'use client'
import { useEffect, useRef, useState } from 'react'
import type { Review } from '@/lib/data/reviews'
import { initials } from '@/lib/utils'
import { ArrowLeft, ArrowRight, QuoteIcon } from '@/components/ui/icons'
import { Stars } from '@/components/ui/Stars'

const avatarColors = ['#D9E3FF', '#D3F1EA', '#FCE6D2', '#EAD3F5', '#F4E8B8']
const sourceLabel: Record<Review['source'], string> = {
  google: 'Google',
  facebook: 'Facebook',
  pagesjaunes: 'PagesJaunes',
  trustpilot: 'Trustpilot',
  direct: 'Client direct',
  other: 'Avis client',
}

/** Accessible carousel: every card in the DOM, buttons + counter, drag/swipe, no auto-rotation. */
export function ReviewsCarousel({ reviews, controlsSlot }: { reviews: Review[]; controlsSlot?: 'left' | 'inline' }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const max = reviews.length - 1

  const [step, setStep] = useState(0)
  const go = (i: number) => setIndex(Math.max(0, Math.min(max, i)))

  // measure one card + gap so the track can be translated by whole cards
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      const card = track.children[0] as HTMLElement | undefined
      setStep(card ? card.offsetWidth + 24 : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  const controls = (
    <div className="rev-ctrl">
      <button className="rbtn" type="button" aria-label="Avis précédent" onClick={() => go(index - 1)} disabled={index === 0}>
        <ArrowLeft />
      </button>
      <span className="rev-num" aria-live="polite">
        {index + 1} <span>/ {reviews.length}</span>
      </span>
      <button className="rbtn" type="button" aria-label="Avis suivant" onClick={() => go(index + 1)} disabled={index === max}>
        <ArrowRight />
      </button>
    </div>
  )

  return (
    <div>
      {controlsSlot === 'inline' ? controls : null}
      <div
        className="rev-view"
        ref={viewRef}
        aria-roledescription="carrousel"
        aria-label="Avis clients"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false }
          viewRef.current?.classList.add('is-drag')
        }}
        onPointerUp={(e) => {
          viewRef.current?.classList.remove('is-drag')
          if (!drag.current) return
          const dx = e.clientX - drag.current.x
          if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1))
          drag.current = null
        }}
        onPointerLeave={() => {
          viewRef.current?.classList.remove('is-drag')
          drag.current = null
        }}
      >
        <div
          className="rev-track"
          ref={trackRef}
          style={{ transform: `translate3d(${-step * index}px,0,0)` }}
        >
          {reviews.map((r, i) => (
            <div key={r.id} role="group" aria-roledescription="avis" aria-label={`Avis ${i + 1} sur ${reviews.length}`}>
              <figure className="rev-card">
                <div className="flex items-center justify-between">
                  <QuoteIcon className="rev-q" />
                  <Stars rating={r.rating} size="sm" />
                </div>
                <blockquote>« {r.content} »</blockquote>
                <figcaption className="rev-who">
                  <span className="rav" style={{ background: avatarColors[i % avatarColors.length] }} aria-hidden>
                    {initials(r.author_name)}
                  </span>
                  <div>
                    <strong>{r.author_name}</strong>
                    {r.author_context ? <span>{r.author_context}</span> : null}
                  </div>
                  {r.source_url ? (
                    <a className="rev-src" href={r.source_url} target="_blank" rel="noopener nofollow">
                      {sourceLabel[r.source]}
                    </a>
                  ) : (
                    <span className="rev-src">{sourceLabel[r.source]}</span>
                  )}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
      {controlsSlot !== 'inline' && reviews.length > 1 ? controls : null}
    </div>
  )
}
