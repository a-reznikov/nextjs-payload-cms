import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Welcome to your new project.')
  })

  test('submits the register for class form and shows the success state', async ({ page }) => {
    let releaseSubmission: (() => void) | undefined
    let requestStarted = false

    await page.route('**/api/register-for-class', async (route) => {
      const request = route.request()
      const payload = request.postDataJSON() as {
        address: string
        boatNumber: string
        city: string
        email: string
        firstName: string
        lastName: string
        phone: string
        plz: string
        sailingClub: string
      }

      expect(request.method()).toBe('POST')
      expect(payload).toEqual({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '123456789',
        address: 'Main Street 1',
        plz: '8000',
        city: 'Zurich',
        sailingClub: 'Lake Club',
        boatNumber: 'SUI',
      })

      requestStarted = true

      await new Promise<void>((resolve) => {
        releaseSubmission = resolve
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          submission: {
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            phone: '123456789',
            address: 'Main Street 1',
            plz: '8000',
            city: 'Zurich',
            sailingClub: 'Lake Club',
            boatNumber: 'SUI',
          },
        }),
      })
    })

    await page.goto('http://localhost:3000')

    const registerButton = page.getByRole('button', { name: 'Register for class' })
    await expect(registerButton).toBeVisible()

    await registerButton.click()

    const dialog = page.getByRole('dialog', { name: 'Register for class' })
    const submitButton = dialog.getByRole('button', { name: 'Submit' })
    await expect(dialog).toBeVisible()
    await submitButton.click()

    await expect(dialog.getByText('First name is required')).toBeVisible()
    await expect(dialog.getByText('Last name is required')).toBeVisible()
    await expect(dialog.getByText('Email is required')).toBeVisible()
    await expect(dialog.getByText('Phone is required')).toBeVisible()
    await expect(dialog.getByText('Address is required')).toBeVisible()
    await expect(dialog.getByText('Plz is required')).toBeVisible()
    await expect(dialog.getByText('City is required')).toBeVisible()
    await expect(dialog.getByText('Sailing club is required')).toBeVisible()

    await dialog.getByLabel('First name').fill('Ada')
    await dialog.getByLabel('Last name').fill('Lovelace')
    await dialog.getByLabel('Email').fill('ada@example.com')
    await dialog.getByLabel('Phone').fill('123456789')
    await dialog.getByLabel('Address').fill('Main Street 1')
    await dialog.getByLabel('Plz').fill('8000')
    await dialog.getByLabel('City').fill('Zurich')
    await dialog.getByLabel('Sailing club').fill('Lake Club')
    await dialog.getByLabel('Boat number (optional)').fill('SUI')

    await submitButton.click()

    await expect.poll(() => requestStarted).toBe(true)
    const loadingButton = dialog.getByRole('button', { name: 'Submitting…' })
    await expect(loadingButton).toBeDisabled()

    expect(releaseSubmission).toBeDefined()
    releaseSubmission()

    await expect(dialog.getByText('Registration submitted')).toBeVisible()
    await expect(dialog.getByText('Ada')).toBeVisible()
    await expect(dialog.getByText('Lovelace')).toBeVisible()
    await expect(dialog.getByText('ada@example.com')).toBeVisible()
    await expect(dialog.getByText('Lake Club')).toBeVisible()
    await expect(dialog.getByText('SUI')).toBeVisible()
  })
})
