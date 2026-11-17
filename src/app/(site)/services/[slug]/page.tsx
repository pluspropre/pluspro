import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getService, serviceSlugs } from '@/content/services'
import { site } from '@/content/site'
import { getProjects } from '@/lib/data/projects'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, faqLd, graph, serviceLd, webPageLd } from '@/lib/seo/jsonld'
import { mediaUrl } from '@/lib/images'
import { PageMotion } from '@/components/motion/PageMotion'
import { JsonLd } from '@/components/seo/JsonLd'
import { BeforeAfterShowcase } from '@/components/sections/BeforeAfter'
import { FaqSection } from '@/components/sections/FaqSection'
import { FinalCta } from '@/components/sections/FinalCta'
import { LatestPosts } from '@/components/sections/LatestPosts'
import { PageHero } from '@/components/sections/PageHero'
import { Process } from '@/components/sections/Process'
import { Reviews } from '@/components/sections/Reviews'
import { ServiceCard } from '@/components/services/ServiceCard'
import { ButtonLink } from '@/components/ui/Button'
import { CheckIcon, PhoneIcon } from '@/components/ui/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Prerendered per param (or request-bound); opt out of the dev-only instant-navigation validation. */
export const instant = false

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const s = getService(slug)
  if (!s) return {}
  return buildMetadata({ title: s.metaTitle, absoluteTitle: true, description: s.metaDescription, path: `/services/${s.slug}` })
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params
  const s = getService(slug)
  if (!s) notFound()
  const path = `/services/${s.slug}`
  const crumbs = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: s.name, path },
  ]
  const projects = await getProjects({ service: s.slug })
  const pairs = projects.filter((p) => p.before_path).slice(0, 4)
  const singles = projects.filter((p) => !p.before_path).slice(0, 3)
  const related = s.related.map(getService).filter((r) => r !== undefined)
  const quoteHref = `/devis?type=${s.quotePrefill.type}${s.quotePrefill.frequency ? `&frequence=${s.quotePrefill.frequency}` : ''}`

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ path, name: s.h1, description: s.metaDescription }),
          breadcrumbLd(crumbs),
          serviceLd(s),
          faqLd(s.faq),
        )}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={s.group === 'secteur' ? 'Secteur · contrat régulier' : 'Prestation ponctuelle'}
        title={s.h1}
        intro={<p>{s.intro}</p>}
        actions={
          <>
            <ButtonLink href={quoteHref} magnetic>
              Demander un devis
            </ButtonLink>
            <a className="btn btn--ghost" href={`tel:${site.phone.e164}`}>
              <PhoneIcon width={18} height={18} />
              {site.phone.display}
            </a>
          </>
        }
        aside={
          <div className="page-hero-media">
            <Image src={s.photo.src} alt={s.photo.alt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        }
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {s.guarantees.map((g) => (
            <li key={g} className="chip-trust">
              <CheckIcon />
              {g}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Hook + pain points */}
      <section className="sec" aria-labelledby="t-hook">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <span className="eyebrow">Vous connaissez ça&nbsp;?</span>
            <h2 className="h2 h2--sm" id="t-hook">
              {s.hook.title}
            </h2>
            <p className="lead mt-6">{s.hook.text}</p>
          </div>
          <ul className="grid gap-4" data-reveal>
            {s.painPoints.map((p) => (
              <li key={p} className="card-soft flex gap-4 p-6 text-[17px] text-ink">
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-white text-teal-dk" aria-hidden>
                  !
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Process
        steps={s.method}
        eyebrow="Notre méthode"
        id="t-method"
        title={
          <>
            Notre <em className="serif">méthode</em>
          </>
        }
        lead="Un protocole écrit, validé avec vous, appliqué à chaque passage."
      />

      {/* Tasks by zone */}
      <section className="sec sec--tight" aria-labelledby="t-tasks">
        <div className="wrap">
          <SectionHeading
            eyebrow="Le détail"
            id="t-tasks"
            small
            title={
              <>
                Ce que nous <em className="serif">nettoyons</em>
              </>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {s.tasks.map((t) => (
              <div key={t.area} className="card p-7" data-reveal>
                <h3 className="h3 text-[20px]">{t.area}</h3>
                <ul className="check-list mt-5 text-[16px]">
                  {t.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequencies */}
      <section className="sec sec--tight" aria-labelledby="t-freq">
        <div className="wrap">
          <SectionHeading
            eyebrow={s.group === 'secteur' ? 'À votre rythme' : 'Organisation'}
            id="t-freq"
            small
            title={
              s.group === 'secteur' ? (
                <>
                  Fréquences <em className="serif">possibles</em>
                </>
              ) : (
                <>
                  Comment nous <em className="serif">intervenons</em>
                </>
              )
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {s.frequencies.map((f, i) => (
              <div key={f.label} className={i % 2 ? 'card p-7' : 'card-soft p-7'} data-reveal>
                <h3 className="font-display text-[22px] leading-tight font-extrabold tracking-tight text-ink uppercase">{f.label}</h3>
                <p className="mt-3 text-[16px]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {pairs.length > 0 || singles.length > 0 ? (
        <section className="sec sec--tight" aria-labelledby="t-real">
          <div className="wrap">
            <SectionHeading
              eyebrow="Réalisations"
              id="t-real"
              small
              title={
                <>
                  Nos interventions en <em className="serif">images</em>
                </>
              }
              lead={
                <Link className="link" href={`/realisations?service=${s.slug}`}>
                  Voir toutes les réalisations « {s.name} »
                </Link>
              }
            />
            {pairs.length > 0 ? <BeforeAfterShowcase projects={pairs} /> : null}
            {singles.length > 0 ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {singles.map((p) => {
                  const src = mediaUrl(p.after_path)
                  return (
                    <figure key={p.id} data-reveal>
                      <div className="media relative aspect-[4/5]">
                        {src ? <Image src={src} alt={p.after_alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /> : null}
                      </div>
                      <figcaption className="mt-3 font-display text-[17px] font-bold text-ink">{p.title}</figcaption>
                    </figure>
                  )
                })}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <Reviews service={s.slug} />

      <FaqSection
        items={s.faq}
        title={
          <>
            Questions <em className="serif">fréquentes</em>
          </>
        }
      />

      <LatestPosts
        service={s.slug}
        title={
          <>
            À lire <em className="serif">aussi</em>
          </>
        }
      />

      {related.length > 0 ? (
        <section className="sec sec--tight" aria-labelledby="t-related">
          <div className="wrap">
            <SectionHeading
              eyebrow="Services liés"
              id="t-related"
              small
              title={
                <>
                  Vous pourriez aussi <em className="serif">avoir besoin</em>
                </>
              }
            />
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {related.map((r) => (
                <div key={r.slug} data-reveal>
                  <ServiceCard service={r} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FinalCta href={quoteHref} label={`Demander un devis : ${s.name.toLowerCase()}`} />
      <PageMotion />
    </>
  )
}
