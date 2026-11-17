'use client'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { gsap, MQ, prefersReducedMotion, ScrollTrigger } from './gsap'

/**
 * Global motion layer for the public site (docs/04 §6): Lenis smooth scroll synced with ScrollTrigger,
 * magnetic buttons (.mag) and the bubble cursor. Per-page choreography lives in <PageMotion />.
 * Everything is progressive enhancement: the server HTML is the final state.
 */
/** React tags every DOM node it has hydrated or created with a `__reactFiber$<id>` key. */
function isHydrated(el: Element) {
  return Object.keys(el).some((k) => k.startsWith('__reactFiber$'))
}

/** Turns the bubble cursor + magnetic buttons on; returns the teardown. */
function enableCursor(cursor: HTMLDivElement | null) {
  const root = document.documentElement
  root.classList.add('has-cursor')
  const xTo = cursor ? gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3' }) : null
  const yTo = cursor ? gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3' }) : null
  let activeMag: HTMLElement | null = null

  const onMove = (e: PointerEvent) => {
    xTo?.(e.clientX)
    yTo?.(e.clientY)
    const target = e.target as Element | null
    const view = target?.closest('[data-cursor="view"]')
    const hover = target?.closest('a, button, [role="button"], input, select, label')
    cursor?.classList.toggle('is-view', Boolean(view))
    cursor?.classList.toggle('is-hover', Boolean(hover) && !view)
    // Only touch a button React has already hydrated: this layer hydrates before the page segment,
    // and an inline transform written on not-yet-hydrated server HTML causes a hydration mismatch.
    const hit = target?.closest<HTMLElement>('.mag')
    const mag = hit && isHydrated(hit) ? hit : null
    if (activeMag && activeMag !== mag) {
      gsap.to(activeMag, { x: 0, y: 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
    }
    activeMag = mag
    if (mag) {
      const r = mag.getBoundingClientRect()
      gsap.to(mag, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.3,
        y: (e.clientY - (r.top + r.height / 2)) * 0.4,
        duration: 0.6,
        ease: 'expo.out',
        overwrite: 'auto',
      })
    }
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    window.removeEventListener('pointermove', onMove)
    root.classList.remove('has-cursor')
    cursor?.classList.remove('is-view', 'is-hover')
    if (activeMag) gsap.set(activeMag, { x: 0, y: 0 })
  }
}

export function MotionLayer() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Lenis + live flag (once)
  useEffect(() => {
    const root = document.documentElement
    if (prefersReducedMotion()) return
    root.classList.add('is-live', 'js-motion')
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -110 } })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      root.classList.remove('is-live', 'js-motion')
    }
  }, [])

  // scroll to top on route change (Lenis keeps its own position)
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  // Magnetic buttons + bubble cursor (fine pointer, desktop only). Re-evaluated live so switching to a
  // phone-sized / touch viewport without a reload turns the cursor off (and back on when returning to desktop).
  useEffect(() => {
    const mm = window.matchMedia(`${MQ.fine} and ${MQ.desk}`)
    if (prefersReducedMotion()) return
    let teardown: (() => void) | null = null
    const sync = () => {
      teardown?.()
      teardown = mm.matches ? enableCursor(cursorRef.current) : null
    }
    sync()
    mm.addEventListener('change', sync)
    return () => {
      mm.removeEventListener('change', sync)
      teardown?.()
    }
  }, [])

  return (
    <div className="cursor" ref={cursorRef} aria-hidden>
      <div className="cursor-b">
        <span className="cursor-l">Voir</span>
      </div>
    </div>
  )
}
