import type { Metadata } from 'next'
import { getMentionsLegales } from '@/content/legal/mentions-legales'
import { getSettings } from '@/lib/data/settings'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { LegalDocument } from '@/components/legal/LegalDocument'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'

const description = 'Mentions légales du site plus-propre.fr : éditeur, hébergement, propriété intellectuelle et données personnelles.'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Mentions légales', path: '/mentions-legales' },
]

export const metadata: Metadata = buildMetadata({ title: 'Mentions légales', description, path: '/mentions-legales' })

export default async function MentionsLegalesPage() {
  const settings = await getSettings()
  const doc = getMentionsLegales({ legalForm: settings.legalForm, publicationDirector: settings.publicationDirector })
  return (
    <>
      <JsonLd data={graph(webPageLd({ path: '/mentions-legales', name: 'Mentions légales', description }), breadcrumbLd(crumbs))} />
      <PageHero crumbs={crumbs} title="Mentions légales" />
      <section className="sec">
        <div className="wrap">
          <LegalDocument doc={doc} />
        </div>
      </section>
    </>
  )
}
