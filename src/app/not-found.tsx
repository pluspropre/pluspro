import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = { title: 'Page introuvable', robots: { index: false, follow: true } }

export default function NotFound() {
  return (
    <main id="contenu" className="min-h-dvh bg-white p-3 md:p-6">
      <div className="page-hero-card grid min-h-[calc(100dvh-48px)] place-items-center !pt-16">
        <div className="wrap max-w-[760px] text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <p className="mt-12 font-display text-[120px] leading-none font-extrabold tracking-tighter text-ink/10" aria-hidden>
            404
          </p>
          <h1 className="h1 h1--page -mt-6">Page introuvable</h1>
          <p className="lead mx-auto mt-6 max-w-lg">
            Cette page n’existe pas ou a été déplacée. Voici quelques liens utiles pour continuer.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Retour à l’accueil</ButtonLink>
            <ButtonLink href="/services" variant="ghost" arrow={false}>
              Nos services
            </ButtonLink>
            <ButtonLink href="/devis" variant="ghost" arrow={false}>
              Demander un devis
            </ButtonLink>
          </div>
          <p className="mt-8 text-[15px]">
            Ou appelez-nous au{' '}
            <Link className="link" href={`tel:${site.phone.e164}`}>
              {site.phone.display}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
