/** Business facts — single source of truth (docs/05 §3). Admin-editable facts live in `site_settings`. */
export const site = {
  name: '+Propre',
  legalName: '+PROPRE',
  url: 'https://www.plus-propre.fr',
  tagline: 'Nettoyage professionnel pour bureaux, cabinets médicaux, commerces et copropriétés à Strasbourg.',
  description:
    'Entreprise de nettoyage professionnel à Strasbourg : bureaux, cabinets médicaux, centres de formation, commerces, copropriétés, locations courte durée, fins de bail et de chantier.',
  phone: { display: '07 65 55 11 11', e164: '+33765551111' },
  email: 'contact@plus-propre.fr',
  address: {
    street: '7 Rue de Koenigshoffen',
    postalCode: '67000',
    city: 'Strasbourg',
    region: 'Grand Est',
    country: 'FR',
  },
  areaServed: ['Strasbourg', 'Eurométropole de Strasbourg'],
  zoneLabel: 'Strasbourg et l’Eurométropole',
  social: {
    instagram: 'https://www.instagram.com/plus_propre.fr/',
    facebook: 'https://www.facebook.com/people/Pluspropre/61576653958810/',
    linkedin: 'https://www.linkedin.com/company/propre-nettoyage/',
  },
  promises: { quoteDelay: '24h', availability: '7j/7' },
  siren: '992 924 944',
  siret: '99292494400018',
  siretDisplay: '992 924 944 00018',
  vat: 'FR01992924944',
  /** fallback "Laisser un avis" target until the admin sets the Google review link */
  googleSearchUrl: 'https://www.google.com/search?q=%2BPropre+nettoyage+Strasbourg',
} as const

export const days = [
  { key: 'Mo', label: 'Lundi', schema: 'Monday' },
  { key: 'Tu', label: 'Mardi', schema: 'Tuesday' },
  { key: 'We', label: 'Mercredi', schema: 'Wednesday' },
  { key: 'Th', label: 'Jeudi', schema: 'Thursday' },
  { key: 'Fr', label: 'Vendredi', schema: 'Friday' },
  { key: 'Sa', label: 'Samedi', schema: 'Saturday' },
  { key: 'Su', label: 'Dimanche', schema: 'Sunday' },
] as const

export type DayKey = (typeof days)[number]['key']
