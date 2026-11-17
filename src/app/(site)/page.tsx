import type { Metadata } from 'next'
import { getHomeFaq } from '@/content/faq'
import { getProjects } from '@/lib/data/projects'
import { getSettings } from '@/lib/data/settings'
import { buildMetadata } from '@/lib/seo/metadata'
import { faqLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageMotion } from '@/components/motion/PageMotion'
import { BeforeAfterShowcase } from '@/components/sections/BeforeAfter'
import { FaqSection } from '@/components/sections/FaqSection'
import { FinalCta } from '@/components/sections/FinalCta'
import { Hero } from '@/components/sections/Hero'
import { LatestPosts } from '@/components/sections/LatestPosts'
import { Process } from '@/components/sections/Process'
import { QuoteBar } from '@/components/sections/QuoteBar'
import { Reviews } from '@/components/sections/Reviews'
import { SectorsRail } from '@/components/sections/SectorsRail'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Stats } from '@/components/sections/Stats'
import { WhyStack } from '@/components/sections/WhyStack'
import { SectionHeading } from '@/components/ui/SectionHeading'

const description =
  'Nettoyage de bureaux, cabinets médicaux, commerces et copropriétés à Strasbourg et alentours. Équipe formée et assurée, interventions 7j/7, devis gratuit sous 24h.'

export const metadata: Metadata = buildMetadata({
  title: 'Entreprise de nettoyage à Strasbourg | +Propre',
  absoluteTitle: true,
  description,
  path: '/',
})

export default async function HomePage() {
  const [settings, featured] = await Promise.all([getSettings(), getProjects({ featured: true, limit: 4 })])
  const faq = getHomeFaq(settings.contractTerms)
  return (
    <>
      <JsonLd data={graph(webPageLd({ path: '/', name: 'Entreprise de nettoyage à Strasbourg', description }), faqLd(faq))} />
      <Hero settings={settings} />
      <QuoteBar />
      <ServicesGrid />
      <WhyStack />
      <Stats settings={settings} />
      {featured.length > 0 ? (
        <section className="sec" aria-labelledby="t-ba">
          <div className="wrap">
            <SectionHeading
              eyebrow="Résultats"
              id="t-ba"
              title={
                <>
                  L’<em className="serif">avant</em>, l’<em className="serif">après</em>
                </>
              }
              lead="Faites glisser le curseur : la différence se voit. Des photos prises sur nos chantiers, sans retouche."
            />
            <BeforeAfterShowcase projects={featured} />
          </div>
        </section>
      ) : null}
      <Process />
      <SectorsRail />
      <Reviews />
      <LatestPosts />
      <FaqSection items={faq} />
      <FinalCta />
      <PageMotion />
    </>
  )
}
