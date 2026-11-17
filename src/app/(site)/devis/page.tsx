import type { Metadata } from 'next'
import { Suspense } from 'react'
import { site } from '@/content/site'
import { getReviews } from '@/lib/data/reviews'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { QuoteWizard, QuoteWizardWithParams } from '@/components/quote/QuoteWizard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CheckIcon, MailIcon, PhoneIcon, QuoteIcon } from '@/components/ui/icons'
import { Stars } from '@/components/ui/Stars'

const description =
  'Décrivez vos locaux en 3 étapes : recevez un devis de nettoyage détaillé et gratuit sous 24h. Sans engagement.'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Demande de devis', path: '/devis' },
]

export const metadata: Metadata = buildMetadata({ title: 'Demande de devis gratuit', description, path: '/devis' })

export default async function DevisPage() {
  const [review] = await getReviews({ limit: 1 })
  return (
    <>
      <JsonLd data={graph(webPageLd({ path: '/devis', name: 'Demande de devis', description, type: 'ContactPage' }), breadcrumbLd(crumbs))} />
      <section className="page-hero" aria-labelledby="page-title">
        <div className="page-hero-card" style={{ paddingBottom: 64 }}>
          <div className="wrap">
            <Breadcrumbs items={crumbs} />
            <h1 className="h1 h1--page mt-6" id="page-title">
              Votre devis <em className="serif">sous 24h</em>
            </h1>
            <p className="lead mt-5 max-w-2xl">
              Trois étapes&nbsp;: votre besoin, vos locaux, vos coordonnées. Nous revenons vers vous sous 24h avec une
              proposition détaillée, après une visite sur place si nécessaire.
            </p>
          </div>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 56 }}>
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Suspense fallback={<QuoteWizard />}>
            <QuoteWizardWithParams />
          </Suspense>
          <aside className="grid gap-6 lg:sticky lg:top-28" aria-label="Nos engagements">
            <div className="card-soft p-7">
              <ul className="check-list text-[16px] text-ink">
                <li>Devis gratuit sous 24h</li>
                <li>Sans engagement</li>
                <li>Visite sur place si besoin</li>
                <li>Interventions 7j/7</li>
              </ul>
              <div className="mt-6 grid gap-3 border-t border-line pt-6 text-[16px]">
                <a className="flex items-center gap-3 font-semibold text-ink" href={`tel:${site.phone.e164}`}>
                  <PhoneIcon width={20} height={20} className="text-teal-dk" />
                  {site.phone.display}
                </a>
                <a className="flex items-center gap-3 text-ink" href={`mailto:${site.email}`}>
                  <MailIcon width={20} height={20} className="text-teal-dk" />
                  {site.email}
                </a>
              </div>
            </div>
            {review ? (
              <figure className="card p-7">
                <div className="flex items-center justify-between">
                  <QuoteIcon className="size-8 text-teal" />
                  <Stars rating={review.rating} size="sm" />
                </div>
                <blockquote className="mt-4 text-[16px] text-ink">« {review.content} »</blockquote>
                <figcaption className="mt-4 text-[14px]">
                  <strong className="text-ink">{review.author_name}</strong>
                  {review.author_context ? ` · ${review.author_context}` : ''}
                </figcaption>
              </figure>
            ) : null}
            <p className="flex items-start gap-2 text-[14px] text-label">
              <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-teal-dk" />
              Vos données servent uniquement à traiter votre demande.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
