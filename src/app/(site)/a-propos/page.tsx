import type { Metadata } from 'next'
import Image from 'next/image'
import { getGeneralFaq } from '@/content/faq'
import { site } from '@/content/site'
import { getSettings } from '@/lib/data/settings'
import { summariseHours } from '@/lib/settings'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbLd, faqLd, graph, webPageLd } from '@/lib/seo/jsonld'
import { ConsentGate } from '@/components/layout/ConsentGate'
import { PageMotion } from '@/components/motion/PageMotion'
import { JsonLd } from '@/components/seo/JsonLd'
import { Commitments } from '@/components/sections/Commitments'
import { FaqSection } from '@/components/sections/FaqSection'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'
import { Stats } from '@/components/sections/Stats'
import { ButtonLink } from '@/components/ui/Button'
import { ClockIcon, FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'

const description =
  'Qui sommes-nous ? Une équipe de nettoyage professionnel à Strasbourg : méthode, engagements, zone d’intervention et questions fréquentes.'
const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'À propos', path: '/a-propos' },
]

export const metadata: Metadata = buildMetadata({ title: 'À propos de +Propre, nettoyage à Strasbourg', description, path: '/a-propos' })

const method = [
  {
    title: 'Écoute et analyse',
    text: 'Nous commençons par comprendre vos locaux, vos horaires et vos contraintes : surfaces, flux, zones sensibles, accès. Une visite sur place nous permet de proposer un plan d’entretien juste, ni surdimensionné ni approximatif.',
  },
  {
    title: 'Protocole et régularité',
    text: 'Chaque site reçoit un protocole écrit : tâches par zone, fréquences, produits. Les mêmes agents l’appliquent à chaque passage, et votre interlocuteur unique l’ajuste avec vous quand vos besoins évoluent.',
  },
]

const priorities = [
  { title: 'Hygiène médicale', text: 'Désinfection des points de contact et des sanitaires, adaptée aux cabinets et aux zones sensibles.' },
  { title: 'Rigueur & traçabilité', text: 'Un protocole écrit, des passages planifiés, un suivi clair de ce qui est fait.' },
  { title: 'Respect des surfaces', text: 'Des produits et un matériel adaptés à chaque revêtement : sols, vitres, inox, bois.' },
  { title: 'Relation continue', text: 'Un interlocuteur unique, joignable, qui fait le point avec vous régulièrement.' },
]

export default async function AboutPage() {
  const settings = await getSettings()
  const faq = getGeneralFaq(settings.contractTerms)
  const hours = summariseHours(settings.openingHours)
  const mapQuery = encodeURIComponent(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`)
  return (
    <>
      <JsonLd data={graph(webPageLd({ path: '/a-propos', name: 'À propos de +Propre', description, type: 'AboutPage' }), breadcrumbLd(crumbs), faqLd(faq))} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Qui sommes-nous"
        title={
          <>
            À propos de <em className="serif">+Propre</em>
          </>
        }
        intro={
          <p>
            +Propre est une entreprise de nettoyage professionnel installée au {site.address.street} à Strasbourg. Nous
            entretenons les bureaux, cabinets médicaux, centres de formation, commerces et copropriétés de Strasbourg et de
            l’Eurométropole, et intervenons ponctuellement pour les fins de bail, les ventes et les fins de chantier.
            Interventions 7j/7, devis sous 24h.
          </p>
        }
        actions={<ButtonLink href="/devis">Demander un devis</ButtonLink>}
        aside={
          <div className="page-hero-media">
            <Image
              src="/images/photos/equipe-intervention.webp"
              alt="Deux agents d’entretien déchargeant un aspirateur de leur utilitaire avant une intervention"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        }
      />

      <section className="sec" aria-labelledby="t-mission">
        <div className="wrap">
          <SectionHeading
            eyebrow="Notre mission"
            id="t-mission"
            title={
              <>
                Une équipe agile, <em className="serif">au service</em> de vos locaux
              </>
            }
            lead="Nettoyage professionnel et résidentiel : notre rôle est que vous n’ayez plus à penser au ménage, et que vos visiteurs le remarquent."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {method.map((m, i) => (
              <article key={m.title} className={i ? 'card p-8 md:p-10' : 'card-soft p-8 md:p-10'} data-reveal>
                <span className="font-serif text-[28px] text-teal-dk italic">0{i + 1}/</span>
                <h3 className="h3 mt-3 text-[28px]">{m.title}</h3>
                <p className="mt-4">{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tight" aria-labelledby="t-prio">
        <div className="wrap">
          <SectionHeading
            eyebrow="Nos priorités"
            id="t-prio"
            small
            title={
              <>
                Ce qui guide <em className="serif">chaque passage</em>
              </>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {priorities.map((p) => (
              <div key={p.title} className="card p-7" data-reveal>
                <h3 className="h3 text-[21px]">{p.title}</h3>
                <p className="mt-3 text-[16px]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stats settings={settings} />

      <Commitments />

      <section className="sec" aria-labelledby="t-zone">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2">
          <div data-reveal>
            <span className="eyebrow">Zone d’intervention</span>
            <h2 className="h2 h2--sm" id="t-zone">
              Strasbourg et <em className="serif">l’Eurométropole</em>
            </h2>
            <p className="lead mt-6">
              Nous intervenons à Strasbourg et dans les communes de l’Eurométropole. Pour un site plus éloigné,
              contactez-nous&nbsp;: nous étudions chaque demande.
            </p>
            <ul className="mt-8 grid gap-4 text-[17px] text-ink">
              <li className="flex gap-3">
                <PinIcon width={22} height={22} className="mt-0.5 shrink-0 text-teal-dk" />
                <address className="not-italic">
                  {site.address.street}, {site.address.postalCode} {site.address.city}
                </address>
              </li>
              <li className="flex gap-3">
                <PhoneIcon width={22} height={22} className="mt-0.5 shrink-0 text-teal-dk" />
                <a className="ul" href={`tel:${site.phone.e164}`}>
                  {site.phone.display}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon width={22} height={22} className="mt-0.5 shrink-0 text-teal-dk" />
                <a className="ul" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              {hours.length > 0 ? (
                <li className="flex gap-3">
                  <ClockIcon width={22} height={22} className="mt-0.5 shrink-0 text-teal-dk" />
                  <dl>
                    {hours.map((h) => (
                      <div key={h.days}>
                        <dt className="inline font-semibold">{h.days}&nbsp;: </dt>
                        <dd className="inline">{h.hours}</dd>
                      </div>
                    ))}
                    {settings.hoursNote ? <p className="mt-1 text-[15px] text-body">{settings.hoursNote}</p> : null}
                  </dl>
                </li>
              ) : null}
            </ul>
            <div className="soc mt-8" style={{ marginTop: 32 }}>
              {[
                { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
                { href: site.social.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
                { href: site.social.facebook, label: 'Facebook', Icon: FacebookIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`+Propre sur ${label}`}
                  className="grid size-12 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <Icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>
          <div className="h-[420px] overflow-hidden rounded-[24px]" data-reveal>
            <ConsentGate label="La carte est fournie par Google Maps, qui dépose des cookies. Elle ne s’affiche qu’avec votre accord.">
              <iframe
                title="Localisation de +Propre à Strasbourg"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </ConsentGate>
          </div>
        </div>
      </section>

      <FaqSection items={faq} />
      <FinalCta />
      <PageMotion />
    </>
  )
}
