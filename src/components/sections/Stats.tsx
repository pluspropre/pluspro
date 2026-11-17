import Image from 'next/image'
import Link from 'next/link'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ArrowUpRight } from '@/components/ui/icons'
import { site } from '@/content/site'
import type { SiteSettings } from '@/lib/settings'

const pops: Record<string, { src: string; alt: string } | 'cta' | undefined> = {
  sites: { src: '/images/realisations/salle-de-formation.webp', alt: '' },
  quote: 'cta',
  availability: { src: '/images/photos/equipe-intervention.webp', alt: '' },
}

/** Only figures confirmed by the admin (Configuration › Chiffres clés) are displayed. */
export function Stats({ settings }: { settings: SiteSettings }) {
  const figures = settings.figures.filter((f) => f.enabled)
  if (figures.length === 0) return null
  return (
    <section className="stats" aria-labelledby="t-stats" data-stats>
      <div className="wrap">
        <div className="st-head" data-reveal>
          <Eyebrow>En chiffres</Eyebrow>
          <h2 className="h2" id="t-stats">
            Une exigence <em className="serif">qui se mesure</em>
          </h2>
        </div>
        <div className="st-rows">
          {figures.map((f) => {
            const pop = pops[f.key]
            const numeric = /^\d+$/.test(f.value)
            return (
              <div className="st-row" key={f.key}>
                <div>
                  <div className="st-num">
                    {f.prefix}
                    <span className="cnt" data-to={numeric ? f.value : undefined}>
                      {f.value}
                    </span>
                    {f.suffix}
                  </div>
                  <span className="st-lab">{f.label}</span>
                </div>
                <p className="st-desc">{f.description}</p>
                {pop === 'cta' ? (
                  <Link className="st-go" href="/devis" aria-label="Demander un devis">
                    <ArrowUpRight />
                  </Link>
                ) : pop ? (
                  <div className="st-pop" aria-hidden>
                    <Image src={pop.src} alt="" fill sizes="112px" className="object-cover" />
                  </div>
                ) : (
                  <span />
                )}
                <span className="rule" aria-hidden />
              </div>
            )
          })}
        </div>
        <p className="st-zone" data-reveal>
          Zone d’intervention&nbsp;: <strong className="text-ink">{site.zoneLabel}</strong>
        </p>
      </div>
    </section>
  )
}
