import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter, Inter_Tight } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { siteUrl } from '@/lib/env'
import { site } from '@/content/site'
import { ROBOTS_INDEX } from '@/lib/seo/metadata'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-inter-tight',
  display: 'swap',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'Entreprise de nettoyage à Strasbourg | +Propre', template: '%s | +Propre' },
  description:
    'Nettoyage de bureaux, cabinets médicaux, commerces et copropriétés à Strasbourg et alentours. Équipe formée et assurée, interventions 7j/7, devis gratuit sous 24h.',
  applicationName: site.name,
  robots: ROBOTS_INDEX,
  openGraph: { siteName: site.name, locale: 'fr_FR', type: 'website' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#0B1B3F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* marks JS availability so no-JS visitors keep every FAQ answer open */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
