import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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

const defaults = ['conseils', 'chantiers-realises', 'vie-de-l-entreprise']

export async function generateStaticParams() {
  const cats = await getCategories()
  const slugs = cats.length > 0 ? cats.map((c) => c.slug) : defaults
  return slugs.map((slug) => ({ slug }))
}

async function findCategory(slug: string) {
  const cats = await getCategories()
  return { cats, cat: cats.find((c) => c.slug === slug) }
}

export async function generateMetadata({ params }: PageProps<'/actualites/categorie/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const { cat } = await findCategory(slug)
  if (!cat) return {}
  return buildMetadata({
    title: `${cat.name} — actualités`,
    description: cat.description ?? `Articles de la catégorie ${cat.name} : les actualités de +Propre à Strasbourg.`,
    path: `/actualites/categorie/${cat.slug}`,
  })
}

async function List({ searchParams, slug }: { searchParams: PageProps<'/actualites/categorie/[slug]'>['searchParams']; slug: string }) {
  const raw = Number((await searchParams).page ?? 1)
  const page = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
  return <PostList page={page} category={slug} basePath={`/actualites/categorie/${slug}`} />
}

export default async function CategoryPage({ params, searchParams }: PageProps<'/actualites/categorie/[slug]'>) {
  const { slug } = await params
  const { cats, cat } = await findCategory(slug)
  if (!cat) notFound()
  const path = `/actualites/categorie/${cat.slug}`
  const crumbs = [
    { name: 'Accueil', path: '/' },
    { name: 'Actualités', path: '/actualites' },
    { name: cat.name, path },
  ]
  return (
    <>
      <JsonLd data={graph(webPageLd({ path, name: cat.name, description: cat.description ?? cat.name, type: 'CollectionPage' }), breadcrumbLd(crumbs))} />
      <PageHero crumbs={crumbs} eyebrow="Catégorie" title={cat.name} intro={cat.description ? <p>{cat.description}</p> : undefined} />
      <section className="sec">
        <div className="wrap">
          <CategoryNav categories={cats} active={cat.slug} />
          <Suspense fallback={<p className="lead">Chargement des articles…</p>}>
            <List searchParams={searchParams} slug={cat.slug} />
          </Suspense>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
