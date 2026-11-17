import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = ['/', '/services', '/services/cabinets-medicaux', '/realisations', '/a-propos', '/actualites', '/devis', '/mentions-legales', '/politique-de-confidentialite']

for (const path of pages) {
  test(`${path} — SEO basics and accessibility`, async ({ page }) => {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    expect(await page.title()).toMatch(/\+Propre/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /plus-propre\.fr|localhost/)
    for (const script of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(script)).not.toThrow()
    }
    const axe = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()
    expect(axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([])
  })
}

test('legacy /contact redirects permanently to /devis', async ({ request }) => {
  const res = await request.get('/contact', { maxRedirects: 0 })
  expect(res.status()).toBe(308)
  expect(res.headers().location).toContain('/devis')
})

test('unknown URL returns a real 404', async ({ page }) => {
  const res = await page.goto('/cette-page-n-existe-pas')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable')
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('home content and FAQ answers are in the HTML', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('La propreté')
    await expect(page.getByText('Faites-vous une visite sur place', { exact: false })).toBeVisible()
  })
})

test('quote funnel is pre-filled from a service page', async ({ page }) => {
  await page.goto('/devis?type=fin-de-bail&surface=moins-100')
  await expect(page.getByText('Étape 2 sur 3')).toBeVisible()
})

test('quote funnel validates each step', async ({ page }) => {
  await page.goto('/devis')
  await page.getByRole('button', { name: 'Continuer' }).click()
  await expect(page.locator('#quote-form [role="alert"]')).toContainText('Type de prestation')
  await page.locator('#f-type').getByText('Bureaux & open-spaces').click()
  await page.getByRole('button', { name: 'Continuer' }).click()
  await expect(page.getByText('Étape 2 sur 3')).toBeVisible()
})

test('cookie banner: refuse hides it and stores the choice', async ({ page, context }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Tout refuser' }).click()
  await expect(page.getByRole('dialog', { name: 'Vos choix de confidentialité' })).toBeHidden()
  const cookies = await context.cookies()
  expect(cookies.find((c) => c.name === 'pp_consent')).toBeTruthy()
})

test('robots.txt and sitemap.xml', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap: https://www.plus-propre.fr/sitemap.xml')
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('/services/fin-de-chantier')
})
