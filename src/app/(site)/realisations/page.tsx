import type { Metadata } from 'next'
import { Suspense } from 'react'
import { services } from '@/content/services'
import { getProjects } from '@/lib/data/projects'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { PageMotion } from '@/components/motion/PageMotion'
import { RealisationsGallery, RealisationsGalleryWithParams } from '@/components/realisations/RealisationsGallery'
import { JsonLd } from '@/components/seo/JsonLd'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'
import { ButtonLink } from '@/components/ui/Button'

const description =
  'Photos avant / après de nos interventions de nettoyage à Strasbourg : cuisines, salles de bain, bureaux, fins de chantier…'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Réalisations', path: '/realisations' },
]

export const metadata: Metadata = buildMetadata({ title: 'Nos réalisations : avant / après', description, path: '/realisations' })

export default async function RealisationsPage() {
  const projects = await getProjects()
  const used = new Set(projects.map((p) => p.service_slug))
  const filters = services.filter((s) => used.has(s.slug)).map((s) => ({ slug: s.slug, name: s.name }))
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ path: '/realisations', name: 'Nos réalisations', description, type: 'CollectionPage' }),
          breadcrumbLd(crumbs),
        )}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Avant / après"
        title={
          <>
            Nos <em className="serif">réalisations</em>
          </>
        }
        intro={
          <p>
            Des photos prises sur nos interventions à Strasbourg et dans l’Eurométropole, sans retouche&nbsp;: fours et
            cuisines dégraissés, salles de bain détartrées, fenêtres après travaux, salles de réunion et de formation
            entretenues. Ouvrez une réalisation pour comparer l’avant et l’après.
          </p>
        }
        actions={<ButtonLink href="/devis">Demander un devis</ButtonLink>}
      />
      <section className="sec" aria-label="Galerie des réalisations">
        <div className="wrap">
          <Suspense fallback={<RealisationsGallery projects={projects} filters={filters} />}>
            <RealisationsGalleryWithParams projects={projects} filters={filters} />
          </Suspense>
        </div>
      </section>
      <FinalCta />
      <PageMotion />
    </>
  )
}
