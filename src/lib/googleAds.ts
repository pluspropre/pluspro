const ADS_ID = 'AW-17091561752'
const LEAD_CONVERSION = 'AW-17091561752/J-gYCIyQxv0bEJiS8tU_'

type AdsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

let advertisingAllowed = false
let initialized = false

function isProductionSite() {
  return ['www.plus-propre.fr', 'plus-propre.fr'].includes(window.location.hostname)
}

/** Load the Google Ads tag only after specific, affirmative consent. */
export function setGoogleAdsConsent(allowed: boolean) {
  advertisingAllowed = allowed
  if (typeof window === 'undefined' || !isProductionSite()) return
  const target = window as AdsWindow
  const consent = {
    ad_storage: allowed ? 'granted' : 'denied',
    ad_user_data: allowed ? 'granted' : 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  }
  if (initialized) {
    target.gtag?.('consent', 'update', consent)
    return
  }
  if (!allowed) return
  target.dataLayer ??= []
  target.gtag ??= function gtag() {
    // The Google tag expects the command arguments object.
    // eslint-disable-next-line prefer-rest-params
    target.dataLayer?.push(arguments)
  }
  target.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  })
  target.gtag('consent', 'update', consent)
  target.gtag('js', new Date())
  target.gtag('config', ADS_ID, { allow_ad_personalization_signals: false, allow_enhanced_conversions: false })
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID
  document.head.appendChild(script)
  initialized = true
}

/** Track successful form submissions, not visits or button clicks. No contact details. */
export function trackGoogleAdsConversion() {
  if (!advertisingAllowed || typeof window === 'undefined' || !isProductionSite()) return
  const target = window as AdsWindow
  target.gtag?.('event', 'conversion', { send_to: LEAD_CONVERSION, value: 1, currency: 'EUR' })
}
