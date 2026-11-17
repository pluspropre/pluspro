import type { Metadata } from 'next'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/Button'
import { CheckIcon } from '@/components/ui/icons'

export const metadata: Metadata = {
  title: 'Merci pour votre demande',
  description: 'Votre demande de devis a bien été envoyée à +Propre.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/devis/merci' },
}

export default function MerciPage() {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="page-hero-card">
        <div className="wrap max-w-[860px] text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-green text-ink">
            <CheckIcon width={28} height={28} />
          </span>
          <h1 className="h1 h1--page mt-8" id="page-title">
            Merci, votre demande <em className="serif">est bien partie</em>
          </h1>
          <p className="lead mx-auto mt-6 max-w-xl">
            Nous l’étudions et revenons vers vous sous 24h, par téléphone ou par e-mail. Un récapitulatif vous a été
            envoyé si vous avez indiqué votre adresse e-mail.
          </p>
          <ol className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
            {['Nous analysons votre besoin', 'Nous vous appelons pour préciser, et planifions une visite si besoin', 'Vous recevez un devis détaillé sous 24h'].map((t, i) => (
              <li key={t} className="card p-5 text-[15px] text-ink">
                <span className="font-display text-[20px] font-bold text-teal-dk">0{i + 1}</span>
                <p className="mt-2">{t}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/realisations">Voir nos réalisations</ButtonLink>
            <ButtonLink href={`tel:${site.phone.e164}`} variant="ghost" arrow={false}>
              {site.phone.display}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
