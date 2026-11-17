import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'

const cards = [
  {
    n: '01',
    eyebrow: 'Interlocuteur',
    title: 'Un interlocuteur unique',
    text: 'Un seul contact pour le planning, les ajustements et les imprévus. Joignable, réactif, sans chaîne de décisions.',
    src: '/images/illustrations/agent-lavage-vitres.webp',
    alt: 'Illustration d’un agent +Propre nettoyant une fenêtre à la raclette',
  },
  {
    n: '02',
    eyebrow: 'Équipe',
    title: 'Une équipe stable et formée',
    text: 'Les mêmes agents interviennent chez vous, formés à vos locaux, à vos accès et à vos exigences.',
    src: '/images/illustrations/binome-vitrage.webp',
    alt: 'Illustration de deux agents nettoyant ensemble une grande baie vitrée',
  },
  {
    n: '03',
    eyebrow: 'Hygiène',
    title: 'Hygiène renforcée',
    text: 'Des protocoles adaptés aux cabinets médicaux et aux zones sensibles : surfaces de contact, sanitaires, salles d’attente.',
    src: '/images/illustrations/produits-desinfection.webp',
    alt: 'Illustration de pulvérisateur, flacons de désinfectant et brosse',
  },
]

export function WhyStack() {
  return (
    <section className="sec sec--tight" id="pourquoi" aria-labelledby="t-why">
      <div className="wrap">
        <SectionHeading
          eyebrow="Notre différence"
          id="t-why"
          title={
            <>
              Pourquoi <em className="serif">+Propre</em>&nbsp;?
            </>
          }
          lead="Une organisation simple, pensée pour durer : les mêmes visages, les mêmes standards, à chaque passage."
        />
        <div className="why-stack" data-why>
          {cards.map((c, i) => (
            <article className={`why-card c${i + 1}`} key={c.n}>
              <div className="why-in">
                <div className="why-ph">
                  <div className="why-illu">
                    <Image src={c.src} alt={c.alt} fill sizes="(max-width: 767px) 90vw, 560px" className="object-contain" />
                  </div>
                </div>
                <div className="why-tx">
                  <span className="why-num" aria-hidden>
                    {c.n}
                  </span>
                  <span className="eyebrow">{c.eyebrow}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
