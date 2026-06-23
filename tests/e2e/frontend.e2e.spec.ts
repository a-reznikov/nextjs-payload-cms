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

  test('submits the register for class form and shows the success state', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.getByRole('button', { name: 'Register for class' })).toBeVisible()

    await page.getByRole('button', { name: 'Register for class' }).click()

    await expect(page.getByRole('dialog', { name: 'Register for class' })).toBeVisible()
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('First name is required')).toBeVisible()
    await expect(page.getByText('Last name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Phone is required')).toBeVisible()
    await expect(page.getByText('Address is required')).toBeVisible()
    await expect(page.getByText('Plz is required')).toBeVisible()
    await expect(page.getByText('City is required')).toBeVisible()
    await expect(page.getByText('Sailing club is required')).toBeVisible()

    await page.getByLabel('First name').fill('Ada')
    await page.getByLabel('Last name').fill('Lovelace')
    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Phone').fill('123456789')
    await page.getByLabel('Address').fill('Main Street 1')
    await page.getByLabel('Plz').fill('8000')
    await page.getByLabel('City').fill('Zurich')
    await page.getByLabel('Sailing club').fill('Lake Club')
    await page.getByLabel('Boat number (optional)').fill('SUI')

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
    await expect(page.getByText('Registration submitted')).toBeVisible()
    await expect(page.getByText('Ada')).toBeVisible()
    await expect(page.getByText('Lovelace')).toBeVisible()
    await expect(page.getByText('ada@example.com')).toBeVisible()
    await expect(page.getByText('Lake Club')).toBeVisible()
    await expect(page.getByText('SUI')).toBeVisible()
  })
})
