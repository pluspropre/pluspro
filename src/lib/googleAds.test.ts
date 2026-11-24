import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CONSENT_VERSION, parseConsent, serializeConsent } from './consent'

describe('advertising consent', () => {
  it('requires a new choice after a policy update and preserves independent preferences', () => {
    expect(parseConsent(encodeURIComponent(JSON.stringify({ v: 1, ts: Date.now(), external: true })))).toBeNull()
    expect(parseConsent(serializeConsent(true))).toMatchObject({ v: CONSENT_VERSION, external: true, marketing: false })
    expect(parseConsent(serializeConsent(false, true))).toMatchObject({ external: false, marketing: true })
  })
})

describe('Google Ads conversion', () => {
  beforeEach(() => vi.resetModules())
  afterEach(() => vi.unstubAllGlobals())

  function mockBrowser(hostname = 'www.plus-propre.fr') {
    const gtag = vi.fn()
    const appendChild = vi.fn()
    vi.stubGlobal('window', { location: { hostname }, gtag, dataLayer: [] })
    vi.stubGlobal('document', { createElement: () => ({ async: false, src: '' }), head: { appendChild } })
    return { gtag, appendChild }
  }

  it('does not send anything before consent; submits exactly one conversion; stops on withdrawal', async () => {
    const { gtag, appendChild } = mockBrowser()
    const { setGoogleAdsConsent, trackGoogleAdsConversion } = await import('./googleAds')
    setGoogleAdsConsent(false)
    trackGoogleAdsConversion()
    expect(gtag).not.toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
    setGoogleAdsConsent(true)
    expect(appendChild).toHaveBeenCalledOnce()
    expect(appendChild).toHaveBeenCalledWith(
      expect.objectContaining({ async: true, src: 'https://www.googletagmanager.com/gtag/js?id=AW-17091561752' }),
    )
    expect(gtag.mock.calls.filter((call) => call[0] === 'event')).toHaveLength(0)
    trackGoogleAdsConversion()
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-17091561752/J-gYCIyQxv0bEJiS8tU_',
      value: 1,
      currency: 'EUR',
    })
    setGoogleAdsConsent(false)
    trackGoogleAdsConversion()
    expect(gtag.mock.calls.filter((call) => call[0] === 'event')).toHaveLength(1)
  })

  it('does not send conversions from development or preview sites', async () => {
    const { gtag, appendChild } = mockBrowser('preview.vercel.app')
    const { setGoogleAdsConsent, trackGoogleAdsConversion } = await import('./googleAds')
    setGoogleAdsConsent(true)
    trackGoogleAdsConversion()
    expect(gtag).not.toHaveBeenCalled()
    expect(appendChild).not.toHaveBeenCalled()
  })
})
