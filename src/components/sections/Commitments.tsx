import type { ComponentType, SVGProps } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PhoneCallIcon, ReceiptIcon, SparkleIcon, UsersIcon } from '@/components/ui/icons'

const items: { Icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; text: string }[] = [
  {
    Icon: SparkleIcon,
    title: 'Un nettoyage soigné, jusque dans les détails.',
    text: 'Nous accordons une attention particulière aux finitions et aux détails qui font la différence au quotidien.',
  },
  {
    Icon: ReceiptIcon,
    title: 'Vous payez uniquement ce qui est fait.',
    text: 'Pas de forfait mensuel imposé. Votre établissement ferme pour les congés ? Les passages non effectués ne sont pas facturés.',
  },
  {
    Icon: UsersIcon,
    title: 'Un agent absent ? On s’organise.',
    text: 'Nous prévoyons son remplacement pour maintenir l’entretien de vos locaux.',
  },
  {
    Icon: PhoneCallIcon,
    title: 'Un seul interlocuteur, vraiment disponible.',
    text: 'Vous échangez directement avec la personne qui organise vos prestations, connaît vos locaux et gère les imprévus.',
  },
]

/** What sets +Propre apart (client copy, 18/11/2026): shown on the home page and the regular-contract service pages. */
export function Commitments() {
  return (
    <section className="sec sec--tight" aria-labelledby="t-simple">
      <div className="wrap">
        <SectionHeading
          eyebrow="Nos engagements"
          id="t-simple"
          small
          title={
            <>
              Avec +Propre, les choses sont <em className="serif">simples</em>.
            </>
          }
        />
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map(({ Icon, title, text }, i) => (
            <li key={title} className={i % 2 ? 'card p-7' : 'card-soft p-7'} data-reveal>
              <span className="grid size-12 place-items-center rounded-full bg-white text-teal-dk shadow-[0_0_0_1px_var(--color-line)]">
                <Icon width={24} height={24} />
              </span>
              <h3 className="h3 mt-5 text-[21px]">{title}</h3>
              <p className="mt-3 text-[16px]">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
