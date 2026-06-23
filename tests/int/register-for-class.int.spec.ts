import React from 'react'
import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'

import { POST } from '@/app/api/register-for-class/route'
import { RegisterForClassCTA } from '@/components/home/components/register-for-class-cta/RegisterForClassCTA'

import { afterEach, describe, expect, it, vi } from 'vitest'

let container: HTMLDivElement | null = null
let root: Root | null = null

declare global {
  interface Window {
    IS_REACT_ACT_ENVIRONMENT?: boolean
  }
}

window.IS_REACT_ACT_ENVIRONMENT = true

function getByText(text: string) {
  const matcher = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const elements = Array.from(container?.querySelectorAll('*') ?? [])
  const match = elements.find((element) => matcher.test(element.textContent ?? ''))

  if (!match) {
    throw new Error(`Unable to find text: ${text}`)
  }

  return match as HTMLElement
}

function queryByText(text: string) {
  const matcher = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const elements = Array.from(container?.querySelectorAll('*') ?? [])
  return (elements.find((element) => matcher.test(element.textContent ?? '')) ?? null) as
    | HTMLElement
    | null
}

function getInput(name: string) {
  const input = container?.querySelector<HTMLInputElement>(`input[name="${name}"]`)

  if (!input) {
    throw new Error(`Unable to find input: ${name}`)
  }

  return input
}

function getButton(label: string) {
  const buttons = Array.from(container?.querySelectorAll('button') ?? [])
  const button = buttons.find((element) => element.textContent?.trim() === label)

  if (!button) {
    throw new Error(`Unable to find button: ${label}`)
  }

  return button as HTMLButtonElement
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

async function change(element: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set

  if (!valueSetter) {
    throw new Error('Unable to access native input value setter')
  }

  await act(async () => {
    valueSetter.call(element, value)
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

async function submitForm() {
  const form = container?.querySelector('form')

  if (!form) {
    throw new Error('Unable to find form')
  }

  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
}

afterEach(() => {
  vi.restoreAllMocks()

  if (root) {
    act(() => {
      root?.unmount()
    })
  }

  container?.remove()
  container = null
  root = null
})

describe('Register for class flow', () => {
  it('opens the modal, validates required fields, submits, shows success, and resets on reopen', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        submittedAt: '2026-06-23T12:00:00.000Z',
        submission: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          phone: '+12025550123',
          address: '123 Harbor Street',
          plz: '8001',
          city: 'Zurich',
          sailingClub: 'Lake Club',
          boatNumber: '',
        },
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(React.createElement(RegisterForClassCTA))
    })

    await click(getButton('Register for class'))

    expect(container.querySelector('[role="dialog"]')).toBeTruthy()

    await submitForm()

    expect(container.textContent?.match(/is required/g)?.length).toBe(8)

    await change(getInput('firstName'), 'Jane')
    await change(getInput('lastName'), 'Doe')
    await change(getInput('email'), 'jane@example.com')
    await change(getInput('phone'), '+12025550123')
    await change(getInput('address'), '123 Harbor Street')
    await change(getInput('plz'), '8001')
    await change(getInput('city'), 'Zurich')
    await change(getInput('sailingClub'), 'Lake Club')

    await submitForm()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      await Promise.resolve()
    })

    expect(getByText('Registration received')).toBeTruthy()
    expect(getByText('jane@example.com')).toBeTruthy()

    const closeButton =
      container.querySelector<HTMLButtonElement>('button[aria-label="Close registration modal"]')

    if (!closeButton) {
      throw new Error('Unable to find close button')
    }

    await click(closeButton)

    expect(queryByText('Registration received')).toBeNull()

    await click(getButton('Register for class'))

    expect(getInput('firstName').value).toBe('')
    expect(queryByText('Registration received')).toBeNull()
  })

  it('returns the normalized payload from the API route', async () => {
    const request = new Request('http://localhost:3000/api/register-for-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: ' Jane ',
        lastName: ' Doe ',
        email: ' jane@example.com ',
        phone: ' +12025550123 ',
        address: ' 123 Harbor Street ',
        plz: ' 8001 ',
        city: ' Zurich ',
        sailingClub: ' Lake Club ',
        boatNumber: ' ',
      }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.submission).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '+12025550123',
      address: '123 Harbor Street',
      plz: '8001',
      city: 'Zurich',
      sailingClub: 'Lake Club',
      boatNumber: '',
    })
  })
})
