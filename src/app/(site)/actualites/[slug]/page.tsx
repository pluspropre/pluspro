import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getService } from '@/content/services'
import { site } from '@/content/site'
import { getAllPostSlugs, getPostBySlug, getPublishedPosts } from '@/lib/data/posts'
import { mediaUrl } from '@/lib/images'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, businessRef, graph, webPageLd } from '@/lib/seo/jsonld'
import { formatDate } from '@/lib/utils'
import { PostCard } from '@/components/blog/PostCard'
import { PostGallery } from '@/components/blog/PostGallery'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { JsonLd } from '@/components/seo/JsonLd'
import { FinalCta } from '@/components/sections/FinalCta'
import { ButtonLink } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

/** Prerendered per param (or request-bound); opt out of the dev-only instant-navigation validation. */
export const instant = false

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  // Cache Components needs at least one param; unknown slugs render on demand and are then cached.
  return slugs.length > 0 ? slugs.map(({ slug }) => ({ slug })) : [{ slug: 'bienvenue' }]
}

export async function generateMetadata({ params }: PageProps<'/actualites/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Article introuvable', robots: { index: false } }
  const cover = mediaUrl(post.cover_path)
  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || post.title,
    path: `/actualites/${post.slug}`,
    image: cover ?? undefined,
    type: 'article',
    publishedTime: post.published_at ?? undefined,
    modifiedTime: post.updated_at,
    section: post.category?.name,
  })
}

export default async function PostPage({ params }: PageProps<'/actualites/[slug]'>) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const path = `/actualites/${post.slug}`
  const crumbs = [
    { name: 'Accueil', path: '/' },
    { name: 'Actualités', path: '/actualites' },
    { name: post.title, path },
  ]
  const cover = mediaUrl(post.cover_path)
  const service = post.service_slugs.map(getService).find(Boolean)
  const { posts: latest } = await getPublishedPosts({ limit: 4 })
  const related = latest.filter((p) => p.id !== post.id).slice(0, 3)
  const updated = post.published_at && new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 86_400_000

  return (
    <>
      <JsonLd
        data={graph(webPageLd({ path, name: post.title, description: post.excerpt ?? post.title }), breadcrumbLd(crumbs), {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.seo_description || post.excerpt || post.title,
          ...(cover ? { image: [cover.startsWith('http') ? cover : `${site.url}${cover}`] } : {}),
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: { '@type': 'Organization', name: post.author_name },
          publisher: businessRef,
          mainEntityOfPage: `${site.url}${path}`,
          articleSection: post.category?.name,
          inLanguage: 'fr-FR',
        })}
      />
      <article>
        <header className="page-hero">
          <div className="page-hero-card">
            <div className="wrap max-w-[960px]">
              <Breadcrumbs items={crumbs} />
              <div className="post-meta mt-8">
                {post.category ? <span className="tag">{post.category.name}</span> : null}
                {post.published_at ? (
                  <span>
                    Publié le <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  </span>
                ) : null}
                {updated ? (
                  <span>
                    Mis à jour le <time dateTime={post.updated_at}>{formatDate(post.updated_at)}</time>
                  </span>
                ) : null}
                {post.reading_minutes ? <span>{post.reading_minutes} min de lecture</span> : null}
              </div>
              <h1 className="h1 h1--page mt-5" id="page-title">
                {post.title}
              </h1>
              {post.excerpt ? <p className="lead mt-6">{post.excerpt}</p> : null}
              <p className="mt-6 text-[15px] text-label">Par {post.author_name}</p>
            </div>
          </div>
        </header>

        <div className="wrap max-w-[960px] pt-16 pb-24">
          {cover ? (
            <div className="media relative mb-14 aspect-[16/9]">
              <Image src={cover} alt={post.cover_alt ?? ''} fill priority sizes="(max-width: 960px) 100vw, 900px" className="object-cover" />
            </div>
          ) : null}
          {/* content_html is sanitised on save (allow-list) — see app/admin/(protected)/articles/actions.ts */}
          <div className="prose mx-auto" dangerouslySetInnerHTML={{ __html: post.content_html ?? '' }} />
          <PostGallery images={post.images} />
          <div className="mx-auto mt-16 flex max-w-[760px] flex-col gap-8 border-t border-line pt-10">
            <ShareButtons url={`${site.url}${path}`} title={post.title} />
            {service ? (
              <div className="card-soft flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
                <p className="text-[17px] text-ink">
                  Besoin d’un prestataire pour vos locaux&nbsp;? Découvrez notre service <strong>{service.name}</strong>.
                </p>
                <ButtonLink href={`/services/${service.slug}`} className="shrink-0">
                  En savoir plus
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="sec sec--tight" aria-labelledby="t-related-posts">
          <div className="wrap">
            <h2 className="h2 h2--sm" id="t-related-posts">
              À lire <em className="serif">aussi</em>
            </h2>
            <div className="posts mt-12">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <FinalCta />
    </>
  )
}
