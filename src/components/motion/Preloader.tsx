'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

/** First visit per session only, ≤ 1 s, rendered after hydration so it never blocks no-JS content (docs/04 §6). */
export function Preloader() {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (prefersReducedMotion() || sessionStorage.getItem('pp-intro')) return
      sessionStorage.setItem('pp-intro', '1')
    } catch {
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the preloader must only exist after hydration
    setShow(true)
  }, [])

  useEffect(() => {
    if (!show || !ref.current) return
    const el = ref.current
    const tl = gsap.timeline({ onComplete: () => setShow(false) })
    tl.from(el.querySelectorAll('.pl-plus path'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2)', stagger: 0.06 })
      .from(el.querySelectorAll('.pl-word span'), { yPercent: 110, duration: 0.4, ease: 'expo.out', stagger: 0.03 }, '<0.05')
      .to(el, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', duration: 0.45, ease: 'power3.inOut' }, '+=0.1')
    return () => {
      tl.kill()
    }
  }, [show])

  if (!show) return null
  return (
    <div className="pl" ref={ref} aria-hidden style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
      <div className="pl-in">
        <svg className="pl-plus" viewBox="0 0 60 60">
          <path d="M30 8 V52" />
          <path d="M8 30 H52" />
        </svg>
        <div className="pl-word">
          {'PROPRE'.split('').map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
