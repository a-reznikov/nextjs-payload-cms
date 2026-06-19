import { test, expect, Page } from '@playwright/test'
import { seedReports, cleanupReports, reportsSeedData } from '../helpers/seedReports'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedReports()

    const context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterAll(async () => {
    await cleanupReports()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    await expect(page.getByRole('link', { name: 'Go to reports' })).toBeVisible()
    await page.getByRole('link', { name: 'Go to reports' }).click()

    await expect(page).toHaveURL('http://localhost:3000/reports')
    await expect(page).toHaveTitle(/Reports \| Payload CMS/)

    const year = page.locator('text=2025').first()

    await expect(year).toBeVisible()

    for (const report of reportsSeedData) {
      await expect(page.getByRole('heading', { name: report.title })).toBeVisible()
    }
  })
})
