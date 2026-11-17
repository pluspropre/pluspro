import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowUpRight } from '@/components/ui/icons'

const cards = [
  { cls: 's1', n: '01/', name: 'Bureaux & open-spaces', href: '/services/bureaux', src: '/images/photos/bureau-desinfection-gants.webp', alt: 'Mains en gants bleus désinfectant un bureau avec un pulvérisateur et une lingette', sizes: '(max-width: 767px) 100vw, 33vw' },
  { cls: 's2', n: '02/', name: 'Cabinets médicaux', href: '/services/cabinets-medicaux', src: '/images/photos/hygiene-poignees.webp', alt: 'Désinfection de poignées avec des gants et une lavette, points de contact sensibles', sizes: '(max-width: 767px) 100vw, 66vw' },
  { cls: 's3', n: '03/', name: 'Copropriétés & parties communes', href: '/services/coproprietes', src: '/images/photos/escalier-lavage.webp', alt: 'Agent d’entretien lavant un escalier à rampe inox', sizes: '(max-width: 767px) 100vw, 58vw' },
]

export function ServicesGrid() {
  return (
    <section className="sec" id="services" aria-labelledby="t-services">
      <div className="wrap">
        <SectionHeading
          eyebrow="Ce que nous faisons"
          id="t-services"
          title={
            <>
              Nos <em className="serif">services</em>
            </>
          }
          lead="Chaque site a ses contraintes : horaires, flux, zones sensibles. Nous construisons un protocole adapté à vos locaux, puis nous le tenons, semaine après semaine."
        />
        <div className="ser">
          {cards.map((c) => (
            <Link key={c.href} className={`svc ${c.cls}`} href={c.href} data-cursor="view">
              <div className="wipe" data-wipe>
                <Image src={c.src} alt={c.alt} fill sizes={c.sizes} className="object-cover" />
                <span className="wipe-band" aria-hidden />
              </div>
              <div className="cap">
                <span className="cap-n" aria-hidden>
                  {c.n}
                </span>
                <span>{c.name}</span>
                <span className="cap-a" aria-hidden>
                  <ArrowUpRight />
                </span>
              </div>
            </Link>
          ))}
          <div className="s4" data-reveal>
            <div className="svc-card">
              <h3>
                9 prestations, <em className="serif">une même</em> exigence
              </h3>
              <Link className="go" href="/services" aria-label="Voir tous nos services">
                <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
