import Link from 'next/link'
import { cacheLife, cacheTag } from 'next/cache'
import { legalNav } from '@/content/navigation'
import { ponctuels, secteurs } from '@/content/services'
import { site } from '@/content/site'
import { getSettings } from '@/lib/data/settings'
import { summariseHours } from '@/lib/settings'
import { Logo } from '@/components/ui/Logo'
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '@/components/ui/icons'
import { CookiePreferencesButton } from './CookieConsent'
import { FooterWatermark } from './FooterWatermark'

export async function Footer() {
  'use cache'
  cacheTag('settings')
  cacheLife('days')
  const settings = await getSettings()
  const hours = summariseHours(settings.openingHours)
  const year = new Date().getFullYear()

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <Logo tone="white" />
            <p className="foot-tl">{site.tagline}</p>
            <div className="soc">
              <a href={site.social.instagram} aria-label="+Propre sur Instagram" rel="noopener" target="_blank">
                <InstagramIcon />
              </a>
              <a href={site.social.linkedin} aria-label="+Propre sur LinkedIn" rel="noopener" target="_blank">
                <LinkedInIcon />
              </a>
              <a href={site.social.facebook} aria-label="+Propre sur Facebook" rel="noopener" target="_blank">
                <FacebookIcon />
              </a>
            </div>
          </div>
          <div>
            <h2>Contact</h2>
            <div className="foot-list">
              <a className="ul" href={`tel:${site.phone.e164}`}>
                {site.phone.display}
              </a>
              <a className="ul" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <address className="not-italic">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </address>
              {hours.length > 0 ? (
                <dl className="foot-hours">
                  {hours.map((h) => (
                    <div key={h.days}>
                      <dt className="inline">{h.days}&nbsp;: </dt>
                      <dd className="inline">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {settings.hoursNote ? <p className="foot-hours">{settings.hoursNote}</p> : null}
              <span className="foot-hours">Intervention à {site.zoneLabel}</span>
            </div>
          </div>
          <div>
            <h2>Liens</h2>
            <div className="foot-list">
              <Link className="ul" href="/services">Nos services</Link>
              <Link className="ul" href="/realisations">Réalisations</Link>
              <Link className="ul" href="/a-propos">À propos</Link>
              <Link className="ul" href="/actualites">Actualités</Link>
              <Link className="ul" href="/devis">Demande de devis</Link>
              {legalNav.map((l) => (
                <Link key={l.href} className="ul" href={l.href}>
                  {l.label}
                </Link>
              ))}
              <CookiePreferencesButton />
            </div>
          </div>
          <div>
            <h2>Services</h2>
            <div className="foot-list">
              {[...secteurs, ...ponctuels].map((s) => (
                <Link key={s.slug} className="ul" href={`/services/${s.slug}`}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="foot-bar">
          <span>© {year} +Propre · Nettoyage professionnel à Strasbourg · SIRET {site.siretDisplay}</span>
          <a className="ul" href="#top">
            Retour en haut
          </a>
        </div>
      </div>
      <FooterWatermark />
    </footer>
  )
}
