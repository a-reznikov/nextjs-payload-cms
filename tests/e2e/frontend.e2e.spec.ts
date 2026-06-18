import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('renders the desktop header', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByAltText('Swiss Class Association')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Regattas' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Documents' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Board' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Forum ↗' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Register for class' })).toBeVisible()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Welcome to your new project.')
  })
})
