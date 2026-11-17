import type { Metadata } from 'next'
import { getPolitiqueConfidentialite } from '@/content/legal/politique-de-confidentialite'
import { getSettings } from '@/lib/data/settings'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { LegalDocument } from '@/components/legal/LegalDocument'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'

const description = 'Comment +Propre collecte, utilise et protège vos données personnelles, et comment exercer vos droits.'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Politique de confidentialité', path: '/politique-de-confidentialite' },
]

export const metadata: Metadata = buildMetadata({ title: 'Politique de confidentialité', description, path: '/politique-de-confidentialite' })

export default async function PrivacyPage() {
  const settings = await getSettings()
  const doc = getPolitiqueConfidentialite({ legalForm: settings.legalForm, publicationDirector: settings.publicationDirector })
  return (
    <>
      <JsonLd
        data={graph(webPageLd({ path: '/politique-de-confidentialite', name: 'Politique de confidentialité', description }), breadcrumbLd(crumbs))}
      />
      <PageHero crumbs={crumbs} title="Politique de confidentialité" />
      <section className="sec">
        <div className="wrap">
          <LegalDocument doc={doc} toc />
        </div>
      </section>
    </>
  )
}
