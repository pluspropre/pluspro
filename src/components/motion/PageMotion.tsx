'use client'
import { useEffect } from 'react'
import { gsap, PLAY_ONCE, prefersReducedMotion, ScrollTrigger } from './gsap'
import { initSectionMotion } from './sectionMotion'

/**
 * Rendered as the last child of each public page: its effect runs once the page tree has hydrated,
 * then attaches reveal-on-scroll and the section choreography. Reverted on unmount (route change).
 */
export function PageMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    let teardown: (() => void) | undefined
    let ctx: gsap.Context | undefined
    let alive = true
    // Defer to the next task: on a client navigation this effect runs before the layout's MotionLayer scrolls the
    // new page back to the top, so triggers created now would measure against the previous page's scroll position.
    // (A timeout rather than requestAnimationFrame, which never fires in a background tab.)
    const init = window.setTimeout(() => {
      ctx = gsap.context(() => {
        teardown = initSectionMotion()
        gsap.utils.toArray<HTMLElement>('main [data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 48,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', ...PLAY_ONCE },
          })
        })
      })
      ScrollTrigger.refresh()
    }, 0)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh())
    return () => {
      alive = false
      window.clearTimeout(init)
      window.clearTimeout(t)
      teardown?.()
      ctx?.revert()
    }
  }, [])
  return null
}
