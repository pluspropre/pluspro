import { site, days } from '@/content/site'
import type { Service } from '@/content/types'
import type { FaqItem } from '@/content/types'
import type { SiteSettings } from '@/lib/settings'

const ID = {
  business: `${site.url}/#business`,
  website: `${site.url}/#website`,
  catalog: `${site.url}/services#catalog`,
}

export type Crumb = { name: string; path: string }

export function businessGraph(settings: SiteSettings) {
  const hours = settings.openingHours.filter((h) => h.open)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': ID.business,
        name: site.name,
        legalName: site.legalName,
        alternateName: ['Plus Propre', '+Propre Nettoyage'],
        description: site.description,
        url: `${site.url}/`,
        logo: `${site.url}/images/brand/logo.png`,
        image: `${site.url}/opengraph-image`,
        telephone: site.phone.e164,
        email: site.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        areaServed: [
          { '@type': 'City', name: 'Strasbourg' },
          { '@type': 'AdministrativeArea', name: 'Eurométropole de Strasbourg' },
        ],
        knowsAbout: [
          'nettoyage de bureaux',
          'nettoyage de cabinets médicaux',
          'entretien de copropriétés',
          'nettoyage de fin de chantier',
          'nettoyage de fin de bail',
        ],
        sameAs: [site.social.instagram, site.social.facebook, site.social.linkedin],
        identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: site.siret },
        vatID: site.vat,
        priceRange: '€€',
        hasOfferCatalog: { '@id': ID.catalog },
        ...(hours.length > 0
          ? {
              openingHoursSpecification: hours.map((h) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: `https://schema.org/${days.find((d) => d.key === h.day)?.schema}`,
                opens: h.opens,
                closes: h.closes,
              })),
            }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': ID.website,
        url: `${site.url}/`,
        name: site.name,
        inLanguage: 'fr-FR',
        publisher: { '@id': ID.business },
      },
    ],
  }
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path === '/' ? '/' : c.path}`,
    })),
  }
}

export function webPageLd({
  path,
  name,
  description,
  type = 'WebPage',
}: {
  path: string
  name: string
  description: string
  type?: string
}) {
  return {
    '@type': type,
    '@id': `${site.url}${path}#webpage`,
    url: `${site.url}${path}`,
    name,
    description,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
  }
}

export function faqLd(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
}

export function serviceLd(s: Service) {
  return {
    '@type': 'Service',
    '@id': `${site.url}/services/${s.slug}#service`,
    name: s.name,
    serviceType: s.h1,
    description: s.metaDescription,
    url: `${site.url}/services/${s.slug}`,
    provider: { '@id': ID.business },
    areaServed: [
      { '@type': 'City', name: 'Strasbourg' },
      { '@type': 'AdministrativeArea', name: 'Eurométropole de Strasbourg' },
    ],
  }
}

export function catalogLd(services: Service[]) {
  return {
    '@type': 'OfferCatalog',
    '@id': ID.catalog,
    name: 'Services de nettoyage +Propre',
    itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: serviceLd(s) })),
  }
}

export function graph(...nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export const businessRef = { '@id': ID.business }
