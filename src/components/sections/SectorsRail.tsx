import Image from 'next/image'
import Link from 'next/link'
import { secteurs } from '@/content/services'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ArrowUpRight } from '@/components/ui/icons'

/** Wrapped grid of sector cards; images reveal with the same wipe + light band as the services grid. */
export function SectorsRail() {
  return (
    <section className="jobs" id="metiers" aria-labelledby="t-jobs">
      <div className="wrap">
        <div className="jobs-head" data-reveal>
          <Eyebrow>Secteurs</Eyebrow>
          <h2 className="h2" id="t-jobs">
            Une page pour <em className="serif">chaque</em> métier
          </h2>
        </div>
        <ul className="jobs-grid">
          {secteurs.map((s, i) => (
            <li className="job" key={s.slug} data-cursor="view">
              <div className="job-ph wipe" data-wipe data-wipe-delay={(i % 3) * 0.12}>
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
                <span className="wipe-band" aria-hidden />
                <span className="job-n">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="job-b">
                <h3>{s.name}</h3>
                <p>{s.short}</p>
              </div>
              <Link className="job-go" href={`/services/${s.slug}`} aria-label={`Découvrir : ${s.name}`}>
                <ArrowUpRight />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
