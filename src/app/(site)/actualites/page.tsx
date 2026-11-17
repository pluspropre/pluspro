import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCategories } from '@/lib/data/posts'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { CategoryNav, PostList } from '@/components/blog/PostList'
import { JsonLd } from '@/components/seo/JsonLd'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'

/** Prerendered per param (or request-bound); opt out of the dev-only instant-navigation validation. */
export const instant = false

const description = 'Conseils d’entretien, chantiers réalisés et vie de l’entreprise : les actualités de +Propre à Strasbourg.'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Actualités', path: '/actualites' },
]

export async function generateMetadata({ searchParams }: PageProps<'/actualites'>): Promise<Metadata> {
  const page = Number((await searchParams).page ?? 1)
  const path = page > 1 ? `/actualites?page=${page}` : '/actualites'
  return buildMetadata({
    title: page > 1 ? `Actualités et conseils nettoyage — page ${page}` : 'Actualités et conseils nettoyage',
    description,
    path,
  })
}

async function List({ searchParams }: { searchParams: PageProps<'/actualites'>['searchParams'] }) {
  const raw = Number((await searchParams).page ?? 1)
  const page = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
  return <PostList page={page} basePath="/actualites" />
}

export default async function BlogPage({ searchParams }: PageProps<'/actualites'>) {
  const categories = await getCategories()
  return (
    <>
      <JsonLd data={graph(webPageLd({ path: '/actualites', name: 'Actualités', description, type: 'CollectionPage' }), breadcrumbLd(crumbs))} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Le journal"
        title={
          <>
            Actualités <em className="serif">et conseils</em>
          </>
        }
        intro={<p>Conseils d’entretien, chantiers réalisés et vie de l’entreprise&nbsp;: les actualités de l’équipe +Propre à Strasbourg.</p>}
      />
      <section className="sec">
        <div className="wrap">
          <CategoryNav categories={categories} />
          <Suspense fallback={<p className="lead">Chargement des articles…</p>}>
            <List searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
