'use client'
import type { ReactNode } from 'react'
import { useConsent } from './CookieConsent'

/** Renders external content only after "Contenus externes" consent; otherwise a click-to-load placeholder. */
export function ConsentGate({ children, label }: { children: ReactNode; label: string }) {
  const { consent, setExternal } = useConsent()
  if (consent?.external) return <>{children}</>
  return (
    <div className="grid h-full min-h-72 place-items-center rounded-[24px] bg-mint p-8 text-center">
      <div className="max-w-sm">
        <p className="text-[15px]">{label}</p>
        <button type="button" className="btn btn--dark btn--plain mt-4 min-h-12 px-6" onClick={() => setExternal(true)}>
          Afficher la carte
        </button>
      </div>
    </div>
  )
}
