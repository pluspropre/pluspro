'use client'
import { gsap, MQ, PLAY_ONCE } from './gsap'

/**
 * Attaches the section choreography of docs/04 §5 to whatever sections exist on the current page.
 * Called inside a gsap.context() by MotionLayer, so everything reverts on route change.
 * Only runs when motion is allowed; server HTML already shows the final state.
 */
export function initSectionMotion() {
  const mm = gsap.matchMedia()
  const cleanups: (() => void)[] = []

  heroIntro()
  countUps()
  processLine()
  ctaWipe()

  mm.add(MQ.desk, () => {
    heroScroll()
    serviceWipes()
  })
  mm.add(`${MQ.desk} and ${MQ.fine}`, () => heroParallax(cleanups))

  return () => {
    cleanups.forEach((fn) => fn())
    mm.revert()
  }
}

function heroIntro() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const q = gsap.utils.selector(hero)
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
  tl.from(q('[data-hero-badge]'), { y: 24, autoAlpha: 0, duration: 0.9 })
    .from(q('.h1 .w'), { yPercent: 115, filter: 'blur(8px)', duration: 1.2, stagger: 0.08 }, '<0.1')
    .fromTo(
      q('.acc .serif'),
      { clipPath: 'inset(-30% 100% -30% -10%)' },
      { clipPath: 'inset(-30% -20% -30% -10%)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' },
      '<0.3',
    )
    .to(
      q('.shine'),
      { xPercent: 360, duration: 1.1, ease: 'power2.inOut', onComplete: () => gsap.set(q('.shine'), { autoAlpha: 0 }) },
      '<0.4',
    )
    .from(q('[data-hero-fade]'), { y: 28, autoAlpha: 0, duration: 1, stagger: 0.1 }, '<-0.6')
    .from(q('.semi'), { scale: 0.6, transformOrigin: '50% 100%', autoAlpha: 0, duration: 1.2 }, '<0.1')
    .from(q('.person-mask'), { yPercent: 30, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.2)' }, '<0.15')
    .from(q('.spark'), { scale: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.08, ease: 'back.out(3)' }, '<0.5')
    .from(q('.hchip'), { scale: 0.6, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: 'elastic.out(1, 0.6)' }, '<')
    .from(q('.proof-in'), { x: -40, autoAlpha: 0, duration: 1 }, '<0.2')
  q<SVGPathElement>('.arcs path, .harrow path').forEach((path) => {
    const len = path.getTotalLength()
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.9 },
    )
  })
  const bar = document.querySelector('[data-quote-bar]')
  if (bar) tl.from(bar, { y: 40, autoAlpha: 0, duration: 1 }, 0.7)
}

function heroScroll() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const card = hero.querySelector('.hero-card')
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
  gsap.to(card, { scale: 0.92, borderRadius: 80, ease: 'none', scrollTrigger: st })
  gsap.to(hero.querySelector('.hero-copy'), { y: -80, autoAlpha: 0.2, ease: 'none', scrollTrigger: st })
  // Each transform channel has a single owner so the tweens compose instead of fighting:
  // the illustration's intro owns `yPercent`, so the scroll drift uses pixel `y` (18% of its height).
  // Otherwise the scrub tween records the intro's from-state (yPercent 30) as its start and the
  // illustration jumps down on the first scroll, then creeps back up.
  gsap.fromTo(
    hero.querySelector<HTMLElement>('[data-person]'),
    { y: 0 },
    { y: (_, el: HTMLElement) => el.offsetHeight * 0.18, ease: 'none', scrollTrigger: st },
  )
  // The pointer parallax (heroParallax) owns the bubble layers' `y`; the scroll drift uses `yPercent`.
  gsap.fromTo(
    hero.querySelectorAll<HTMLElement>('.bub-l'),
    { yPercent: 0 },
    {
      yPercent: (i, el: HTMLElement) => ((-120 * (i + 1)) / Math.max(el.offsetHeight, 1)) * 100,
      ease: 'none',
      scrollTrigger: st,
    },
  )
}

function heroParallax(cleanups: (() => void)[]) {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
    depth: Number(el.dataset.depth ?? 0.5),
    x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
  }))
  const onMove = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    layers.forEach((l) => {
      l.x(nx * 30 * l.depth)
      l.y(ny * 20 * l.depth)
    })
  }
  hero.addEventListener('pointermove', onMove)
  cleanups.push(() => hero.removeEventListener('pointermove', onMove))
}

function serviceWipes() {
  document.querySelectorAll<HTMLElement>('[data-wipe]').forEach((wipe) => {
    const img = wipe.querySelector('img')
    const band = wipe.querySelector('.wipe-band')
    const delay = Number(wipe.dataset.wipeDelay ?? 0)
    const tl = gsap.timeline({ delay, scrollTrigger: { trigger: wipe, start: 'top 85%', ...PLAY_ONCE } })
    tl.fromTo(
      wipe,
      { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
      { clipPath: 'polygon(0 0, 140% 0, 100% 100%, 0 100%)', duration: 1.4, ease: 'power3.inOut' },
    )
    if (img) tl.from(img, { scale: 1.15, duration: 1.6, ease: 'expo.out' }, 0.2)
    if (band) tl.fromTo(band, { xPercent: -120, autoAlpha: 1 }, { xPercent: 700, autoAlpha: 0, duration: 1.4, ease: 'power3.inOut' }, 0)
  })
}

function countUps() {
  const stats = document.querySelector<HTMLElement>('[data-stats]')
  if (!stats) return
  stats.querySelectorAll<HTMLElement>('.cnt[data-to]').forEach((el) => {
    const to = Number(el.dataset.to)
    const state = { v: 0 }
    gsap.to(state, {
      v: to,
      duration: 2,
      ease: 'expo.out',
      onUpdate: () => (el.textContent = String(Math.round(state.v))),
      onComplete: () => (el.textContent = String(to)),
      scrollTrigger: { trigger: el, start: 'top 90%', ...PLAY_ONCE },
    })
  })
  stats.querySelectorAll('.rule').forEach((rule) =>
    gsap.from(rule, { scaleX: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: rule, start: 'top 92%', ...PLAY_ONCE } }),
  )
  stats.querySelectorAll('.st-pop, .st-go').forEach((pop) =>
    gsap.from(pop, { scale: 0, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: pop, start: 'top 90%', ...PLAY_ONCE } }),
  )
}

function processLine() {
  document.querySelectorAll<HTMLElement>('[data-process]').forEach((sec) => {
    const line = sec.querySelector<HTMLElement>('.proc-line')
    const fill = sec.querySelector('.proc-fill')
    const tip = sec.querySelector('.proc-tip')
    const dots = Array.from(sec.querySelectorAll<HTMLElement>('.proc-dot'))
    if (!line || !fill) return
    dots.forEach((d, i) => i > 0 && d.classList.remove('is-on'))
    gsap.fromTo(
      fill,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: line,
          start: 'top 75%',
          end: 'top 35%',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(tip, { left: `${self.progress * 100}%` })
            dots.forEach((d, i) => d.classList.toggle('is-on', self.progress >= i / Math.max(1, dots.length - 1) - 0.02))
          },
        },
      },
    )
  })
}

function ctaWipe() {
  document.querySelectorAll<HTMLElement>('[data-cta]').forEach((sec) => {
    const dust = sec.querySelector('[data-cta-dust]')
    const photo = sec.querySelector('[data-cta-photo]')
    const band = sec.querySelector('[data-cta-band]')
    const st = { trigger: sec, start: 'top 85%', end: 'center 45%', scrub: true }
    gsap.fromTo(
      dust,
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
      { clipPath: 'polygon(130% 0%, 100% 0%, 100% 100%, 100% 100%)', ease: 'none', scrollTrigger: st },
    )
    gsap.fromTo(photo, { filter: 'saturate(0.3)' }, { filter: 'saturate(1)', ease: 'none', scrollTrigger: st })
    gsap.fromTo(band, { xPercent: -150, autoAlpha: 1 }, { xPercent: 800, autoAlpha: 1, ease: 'none', scrollTrigger: st })
  })
}
