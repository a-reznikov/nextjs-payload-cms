import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Register for Class/)
    await expect(page.getByRole('button', { name: 'Register for class' })).toBeVisible()
  })

  test('can complete registration modal flow', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.getByRole('button', { name: 'Register for class' }).click()

    await expect(page.getByRole('heading', { name: 'Register for class' })).toBeVisible()

    await page.getByLabel('First name').fill('Ava')
    await page.getByLabel('Last name').fill('Marin')
    await page.getByLabel('Email').fill('ava@example.com')
    await page.getByLabel('Phone').fill('+41 79 555 10 20')
    await page.getByLabel('Address').fill('Harbor Street 12')
    await page.getByLabel('Plz').fill('8001')
    await page.getByLabel('City').fill('Zurich')
    await page.getByLabel('Sailing club').fill('Lake Crew')
    await page.getByLabel('Boat number (optional)').fill('SUI 7')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Registration submitted successfully.')).toBeVisible()
    await expect(page.getByText('ava@example.com')).toBeVisible()
    await expect(page.getByText('SUI 7')).toBeVisible()
  })
})
