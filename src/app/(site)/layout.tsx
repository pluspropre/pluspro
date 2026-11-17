import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ConsentProvider } from '@/components/layout/CookieConsent'
import { MotionLayer } from '@/components/motion/MotionLayer'
import { Preloader } from '@/components/motion/Preloader'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSettings } from '@/lib/data/settings'
import { businessGraph } from '@/lib/seo/jsonld'

async function BusinessJsonLd() {
  const settings = await getSettings()
  return <JsonLd data={businessGraph(settings)} />
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <MotionLayer />
      <Preloader />
      <BusinessJsonLd />
    </ConsentProvider>
  )
}
