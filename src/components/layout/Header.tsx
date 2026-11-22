'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mainNav } from '@/content/navigation'
import { ponctuels, secteurs } from '@/content/services'
import { site } from '@/content/site'
import { cn } from '@/lib/utils'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { ButtonLink } from '@/components/ui/Button'
import { ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from '@/components/ui/icons'
import { Logo } from '@/components/ui/Logo'

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const indRef = useRef<HTMLSpanElement>(null)
  const progRef = useRef<HTMLSpanElement>(null)
  const megaBtnRef = useRef<HTMLButtonElement>(null)
  const megaRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [megaOpen, setMegaOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasInd, setHasInd] = useState(false)

  // close menus on navigation
  useEffect(() => {
    setMegaOpen(false) // eslint-disable-line react-hooks/set-state-in-effect -- reset on route change
    setMenuOpen(false)
  }, [pathname])

  // scroll states: compact, hide on scroll down, progress bar
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    let last = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      nav.classList.toggle('is-scrolled', y > 80)
      const goingDown = y > last && y > 320
      nav.classList.toggle('is-hidden', goingDown && !megaOpen && !menuOpen)
      last = y
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progRef.current) progRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [megaOpen, menuOpen])

  // sliding indicator following hover/focus, returning to the active link
  const moveInd = useCallback((el: HTMLElement | null, instant = false) => {
    const ind = indRef.current
    const wrap = linksRef.current
    if (!ind || !wrap) return
    if (!el) {
      gsap.to(ind, { opacity: 0, duration: 0.3 })
      return
    }
    const w = wrap.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    gsap.to(ind, {
      x: r.left - w.left,
      width: r.width,
      opacity: 1,
      duration: instant || prefersReducedMotion() ? 0 : 0.55,
      ease: 'expo.out',
    })
  }, [])

  useEffect(() => {
    const active = linksRef.current?.querySelector<HTMLElement>('.is-active')
    setHasInd(true) // eslint-disable-line react-hooks/set-state-in-effect -- enable the indicator once JS runs
    moveInd(active ?? null, true)
  }, [pathname, moveInd])

  // mega-menu: Escape and outside click
  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        megaBtnRef.current?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (!megaRef.current?.contains(t) && !megaBtnRef.current?.contains(t)) setMegaOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [megaOpen])

  // mobile menu: lock scroll, focus trap, Escape
  useEffect(() => {
    if (!menuOpen) return
    const html = document.documentElement
    html.classList.add('lenis-stopped')
    document.body.style.overflow = 'hidden'
    const menu = menuRef.current
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>('a, button, summary') ?? []).concat(
        burgerRef.current ? [burgerRef.current] : [],
      )
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const list = focusables()
        const first = list[0]
        const lastEl = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          lastEl?.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      html.classList.remove('lenis-stopped')
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const onMegaKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setMegaOpen(true)
      window.setTimeout(() => megaRef.current?.querySelector<HTMLElement>('a')?.focus(), 0)
    }
  }

  return (
    <>
      <header className="nav" ref={navRef}>
        <Logo />
        <nav
          className={cn('nav-links', hasInd && 'has-ind')}
          aria-label="Navigation principale"
          ref={linksRef}
          onMouseLeave={() => moveInd(linksRef.current?.querySelector<HTMLElement>('.is-active') ?? null)}
        >
          <span className="nav-ind" ref={indRef} aria-hidden />
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href)
            if ('mega' in item && item.mega) {
              return (
                <div key={item.href} style={{ position: 'relative' }}>
                  <button
                    ref={megaBtnRef}
                    type="button"
                    className={cn('nav-link', active && 'is-active')}
                    aria-expanded={megaOpen}
                    aria-controls="mega-services"
                    onClick={() => setMegaOpen((v) => !v)}
                    onKeyDown={onMegaKey}
                    onMouseEnter={(e) => moveInd(e.currentTarget)}
                    onFocus={(e) => moveInd(e.currentTarget)}
                  >
                    {item.label}
                    <ChevronDown />
                  </button>
                  <div className="mega" id="mega-services" ref={megaRef} hidden={!megaOpen}>
                    <div>
                      <h2>Secteurs · entretien régulier</h2>
                      {secteurs.map((s) => (
                        <Link key={s.slug} href={`/services/${s.slug}`}>
                          <strong>{s.name}</strong>
                          <span>{s.short}</span>
                        </Link>
                      ))}
                    </div>
                    <div>
                      <h2>Prestations ponctuelles</h2>
                      {ponctuels.map((s) => (
                        <Link key={s.slug} href={`/services/${s.slug}`}>
                          <strong>{s.name}</strong>
                          <span>{s.short}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mega-all">
                      <Link href="/services">
                        <strong>Tous nos services →</strong>
                        <span>Comparer nos prestations et nos fréquences d’intervention</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('nav-link', active && 'is-active')}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={(e) => moveInd(e.currentTarget)}
                onFocus={(e) => moveInd(e.currentTarget)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="nav-end">
          <a className="nav-phone" href={`tel:${site.phone.e164}`} aria-label={`Appeler le ${site.phone.display}`}>
            <PhoneIcon />
          </a>
          <ButtonLink href="/devis" variant="dark" magnetic aria-label="Demander un devis">
            Demander un devis
          </ButtonLink>
          <button
            ref={burgerRef}
            className="nav-burger"
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
          </button>
        </div>
        <span className="nav-prog" ref={progRef} aria-hidden />
      </header>

      <div className="nav-menu" id="mobile-menu" ref={menuRef} hidden={!menuOpen}>
        <nav aria-label="Menu mobile" style={{ display: 'contents' }}>
          {mainNav.map((item) =>
            'mega' in item && item.mega ? (
              <details key={item.href}>
                <summary>
                  Services
                  <ChevronDown width={16} height={16} />
                </summary>
                <Link href="/services" aria-current={pathname === '/services' ? 'page' : undefined}>
                  Tous nos services
                </Link>
                {[...secteurs, ...ponctuels].map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    aria-current={pathname === `/services/${s.slug}` ? 'page' : undefined}
                  >
                    {s.name}
                  </Link>
                ))}
              </details>
            ) : (
              <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                {item.label}
              </Link>
            ),
          )}
          <a href={`tel:${site.phone.e164}`}>
            {site.phone.display}
            <PhoneIcon width={18} height={18} />
          </a>
        </nav>
        <ButtonLink href="/devis" className="mt-2 justify-between">
          Demander un devis
        </ButtonLink>
      </div>
    </>
  )
}
