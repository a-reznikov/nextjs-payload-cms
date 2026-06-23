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
    await expect(page.getByRole('button', { name: 'Register for class' })).toBeVisible()
  })

  test('submits the class registration modal form', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.getByRole('button', { name: 'Register for class' }).click()

    await page.getByLabel('First name').fill('Jane')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByLabel('Email').fill('jane@example.com')
    await page.getByLabel('Phone').fill('+123456789')
    await page.getByLabel('Address').fill('123 Harbor Street')
    await page.getByLabel('Plz').fill('8000')
    await page.getByLabel('City').fill('Zurich')
    await page.getByLabel('Sailing club').fill('Lake Club')
    await page.getByLabel('Boat number (optional)').fill('SUI 42')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByRole('heading', { name: 'Registration received' })).toBeVisible()
    await expect(page.getByText('Jane')).toBeVisible()
    await expect(page.getByText('jane@example.com')).toBeVisible()
    await expect(page.getByText('SUI 42')).toBeVisible()
  })
})
