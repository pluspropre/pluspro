import Image from 'next/image'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MailIcon, PhoneIcon } from '@/components/ui/icons'

/** Dark photo CTA with a real before → after wipe driven by scroll (docs/04 §5 #13). */
export function FinalCta({ href = '/devis', label = 'Demander mon devis gratuit' }: { href?: string; label?: string }) {
  return (
    <section className="cta-sec" aria-labelledby="t-cta" data-cta>
      <div className="cta">
        <div className="cta-photo">
          <Image
            src="/images/realisations/parking-abords-apres.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            data-cta-photo
          />
        </div>
        {/* the same site before our intervention, wiped away by scroll (hidden without JS: final state only) */}
        <div className="cta-dust" aria-hidden data-cta-dust>
          <Image src="/images/realisations/parking-abords-avant.webp" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <span className="cta-band" aria-hidden data-cta-band />
        <div className="cta-shade" aria-hidden />
        <div className="cta-copy">
          <Eyebrow>Devis gratuit sous 24h</Eyebrow>
          <h2 className="h2" id="t-cta">
            Un espace <em className="serif">+Propre</em> commence ici.
          </h2>
          <ButtonLink href={href} magnetic>
            {label}
          </ButtonLink>
          <div className="cta-contact">
            <a className="ul" href={`tel:${site.phone.e164}`}>
              <PhoneIcon />
              {site.phone.display}
            </a>
            <a className="ul" href={`mailto:${site.email}`}>
              <MailIcon />
              {site.email}
            </a>
          </div>
          <p className="cta-zone">Interventions à {site.zoneLabel}</p>
        </div>
      </div>
    </section>
  )
}
