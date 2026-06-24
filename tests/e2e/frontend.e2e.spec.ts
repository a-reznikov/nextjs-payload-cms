import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Welcome to your new project.')
  })

  test('submits the register for class form', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.getByRole('button', { name: 'Register for class' }).click()

    await expect(page.getByRole('dialog')).toBeVisible()

    await page.getByLabel('First name').fill('Aliaksandr')
    await page.getByLabel('Last name').fill('Reznikau')
    await page.getByLabel('Email').fill('aliaksandr@example.com')
    await page.getByLabel('Phone').fill('+375291112233')
    await page.getByLabel('Address').fill('123 Windward Ave')
    await page.getByLabel('Plz').fill('220004')
    await page.getByLabel('City').fill('Minsk')
    await page.getByLabel('Sailing club').fill('Sea Breeze Club')
    await page.getByLabel('Boat number (optional)').fill('SUI 100')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Registration complete')).toBeVisible()
    await expect(page.getByText('Aliaksandr')).toBeVisible()
    await expect(page.getByText('Sea Breeze Club')).toBeVisible()

    await page.getByRole('button', { name: 'Close' }).click()

    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
