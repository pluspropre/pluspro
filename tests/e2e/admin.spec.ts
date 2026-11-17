import { expect, test } from '@playwright/test'

test('admin is protected and not indexable', async ({ page }) => {
  const res = await page.goto('/admin')
  expect(page.url()).toContain('/admin/login')
  expect(res?.headers()['x-robots-tag']).toContain('noindex')
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
})

// Full admin flow (needs E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD for a test admin on a non-production project)
test('admin can sign in and see the leads inbox', async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_EMAIL, 'admin credentials not provided')
  await page.goto('/admin/login')
  await page.getByLabel('E-mail').fill(process.env.E2E_ADMIN_EMAIL!)
  await page.getByLabel('Mot de passe').fill(process.env.E2E_ADMIN_PASSWORD!)
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await page.getByRole('link', { name: /Devis/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Demandes de devis' })).toBeVisible()
})
