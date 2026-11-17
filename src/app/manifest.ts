import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '+Propre — Nettoyage professionnel à Strasbourg',
    short_name: '+Propre',
    description: 'Entreprise de nettoyage professionnel à Strasbourg.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0B1B3F',
    lang: 'fr',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}
