import type { Metadata } from 'next'
import { getGeneralFaq } from '@/content/faq'
import { ponctuels, secteurs, services } from '@/content/services'
import { getSettings } from '@/lib/data/settings'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, catalogLd, faqLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { PageMotion } from '@/components/motion/PageMotion'
import { JsonLd } from '@/components/seo/JsonLd'
import { FaqSection } from '@/components/sections/FaqSection'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'
import { Process } from '@/components/sections/Process'
import { Reviews } from '@/components/sections/Reviews'
import { ServiceCard } from '@/components/services/ServiceCard'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'

const description =
  'Bureaux, cabinets médicaux, centres de formation, commerces, copropriétés, locations courte durée, fins de bail et de chantier : découvrez nos prestations.'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Services', path: '/services' },
]

export const metadata: Metadata = buildMetadata({ title: 'Nos services de nettoyage à Strasbourg', description, path: '/services' })

export default async function ServicesPage() {
  const settings = await getSettings()
  const faq = getGeneralFaq(settings.contractTerms)
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ path: '/services', name: 'Nos services de nettoyage à Strasbourg', description, type: 'CollectionPage' }),
          breadcrumbLd(crumbs),
          catalogLd(services),
          faqLd(faq),
        )}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Nos prestations"
        title={
          <>
            Nos services de nettoyage <em className="serif">à Strasbourg</em>
          </>
        }
        intro={
          <p>
            +Propre entretient les locaux des professionnels et des particuliers à Strasbourg et dans l’Eurométropole&nbsp;:
            entretien régulier pour les bureaux, cabinets médicaux, commerces ou copropriétés, et interventions ponctuelles
            pour une fin de bail, une vente ou une fin de chantier. Chaque prestation suit un protocole écrit, et votre
            devis vous parvient sous 24h.
          </p>
        }
        actions={
          <>
            <ButtonLink href="/devis">Demander un devis</ButtonLink>
            <ButtonLink href="#secteurs" variant="ghost" arrow={false}>
              Voir les secteurs
            </ButtonLink>
          </>
        }
      />

      <section className="sec" id="secteurs" aria-labelledby="t-secteurs">
        <div className="wrap">
          <SectionHeading
            eyebrow="Entretien régulier"
            id="t-secteurs"
            title={
              <>
                Nos <em className="serif">secteurs</em>
              </>
            }
            lead="Un protocole construit pour vos locaux, des passages planifiés et un interlocuteur unique, semaine après semaine."
          />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {secteurs.map((s) => (
              <div key={s.slug} data-reveal>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tight" id="ponctuelles" aria-labelledby="t-ponctuel">
        <div className="wrap">
          <SectionHeading
            eyebrow="Interventions uniques"
            id="t-ponctuel"
            title={
              <>
                Prestations <em className="serif">ponctuelles</em>
              </>
            }
            lead="Un logement à rendre, un bien à vendre, un chantier à livrer : une intervention complète, planifiée à la date qui vous convient."
          />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {ponctuels.map((s) => (
              <div key={s.slug} data-reveal>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <Reviews />
      <FaqSection items={faq} />
      <FinalCta />
      <PageMotion />
    </>
  )
}
