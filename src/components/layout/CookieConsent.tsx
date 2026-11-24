'use client'
import Link from 'next/link'
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  parseConsent,
  serializeConsent,
  type ConsentState,
} from '@/lib/consent'
import { setGoogleAdsConsent } from '@/lib/googleAds'

type Ctx = { consent: ConsentState | null; setExternal: (v: boolean) => void; openPreferences: () => void }
const ConsentContext = createContext<Ctx | null>(null)

function readCookie(): ConsentState | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
  return parseConsent(match?.split('=').slice(1).join('='))
}

function writeCookie(external: boolean, marketing: boolean) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(external, marketing)}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

/** CNIL-compliant consent (docs/08 §3): refuse = accept in weight, closing = refuse, no external content before consent. */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(false)
  const [externalChoice, setExternalChoice] = useState(false)
  const [marketingChoice, setMarketingChoice] = useState(false)

  useEffect(() => {
    const current = readCookie()
    setGoogleAdsConsent(current?.marketing === true)
    /* eslint-disable react-hooks/set-state-in-effect -- the cookie can only be read after hydration */
    setConsent(current)
    if (!current) setOpen(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    const reopen = () => {
      const saved = readCookie()
      setExternalChoice(saved?.external ?? false)
      setMarketingChoice(saved?.marketing ?? false)
      setCustom(true)
      setOpen(true)
    }
    window.addEventListener('pp:consent', reopen)
    return () => window.removeEventListener('pp:consent', reopen)
  }, [])

  const save = useCallback((external: boolean, marketing = false) => {
    const wasMarketing = readCookie()?.marketing === true
    writeCookie(external, marketing)
    setGoogleAdsConsent(marketing)
    setConsent({ v: CONSENT_VERSION, ts: Date.now(), external, marketing })
    setOpen(false)
    setCustom(false)
    if (wasMarketing && !marketing) window.location.reload()
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      consent,
      setExternal: (external) => save(external, consent?.marketing ?? false),
      openPreferences: () => {
        setExternalChoice(consent?.external ?? false)
        setMarketingChoice(consent?.marketing ?? false)
        setCustom(true)
        setOpen(true)
      },
    }),
    [consent, save],
  )

  return (
    <ConsentContext value={value}>
      {children}
      {open ? (
        <section className="cookie" role="dialog" aria-labelledby="cookie-title" aria-modal="false">
          <div className="flex items-start justify-between gap-4">
            <h2 id="cookie-title" className="h3" style={{ fontSize: 20 }}>
              Vos choix de confidentialité
            </h2>
            <button
              type="button"
              className="hover:bg-mint -mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-full"
              aria-label="Fermer et refuser"
              onClick={() => save(false)}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed">
            La mesure d’audience est anonyme et sans cookie. Google Ads peut mesurer les demandes de devis issues de nos
            annonces, et les contenus externes (carte Google Maps) peuvent déposer des cookies, uniquement si vous
            acceptez les catégories correspondantes.{' '}
            <Link className="link" href="/politique-de-confidentialite#cookies-et-traceurs">
              En savoir plus
            </Link>
          </p>
          {custom ? (
            <fieldset className="mt-4 grid gap-3">
              <legend className="sr-only">Catégories de cookies</legend>
              <label className="flex items-start gap-3 text-[15px]">
                <input type="checkbox" checked disabled className="mt-1 size-5 accent-[#0F766E]" />
                <span>
                  <strong className="text-ink">Strictement nécessaires</strong> — mémorisation de vos choix, sécurité du
                  formulaire. Toujours actifs.
                </span>
              </label>
              <label className="flex items-start gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={externalChoice}
                  onChange={(e) => setExternalChoice(e.target.checked)}
                  className="mt-1 size-5 accent-[#0F766E]"
                />
                <span>
                  <strong className="text-ink">Contenus externes</strong> — carte Google Maps sur la page À propos.
                </span>
              </label>
              <label className="flex items-start gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={marketingChoice}
                  onChange={(e) => setMarketingChoice(e.target.checked)}
                  className="mt-1 size-5 accent-[#0F766E]"
                />
                <span>
                  <strong className="text-ink">Mesure publicitaire</strong> – Google Ads, mesure des demandes de devis
                  liées à nos annonces.
                </span>
              </label>
            </fieldset>
          ) : null}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn btn--ghost btn--plain min-h-12 text-[15px]"
              onClick={() => save(false)}
            >
              Tout refuser
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--plain min-h-12 text-[15px]"
              onClick={() => save(true, true)}
            >
              Tout accepter
            </button>
            {custom ? (
              <button
                type="button"
                className="btn btn--green btn--plain col-span-2 min-h-12 text-[15px]"
                onClick={() => save(externalChoice, marketingChoice)}
              >
                Enregistrer mes choix
              </button>
            ) : (
              <button
                type="button"
                className="text-ink col-span-2 py-2 text-[14px] font-semibold underline underline-offset-4"
                onClick={() => setCustom(true)}
              >
                Personnaliser
              </button>
            )}
          </div>
        </section>
      ) : null}
    </ConsentContext>
  )
}

export function useConsent() {
  const ctx = use(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used inside ConsentProvider')
  return ctx
}

/** Footer link that reopens the preferences. */
export function CookiePreferencesButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event('pp:consent'))}>
      Gestion des cookies
    </button>
  )
}
