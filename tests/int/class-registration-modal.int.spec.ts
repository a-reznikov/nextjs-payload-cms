import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Home } from '@/components/home/Home'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('class registration modal', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount()
      })
    }

    container?.remove()
    vi.unstubAllGlobals()
    root = null
    container = null
  })

  it('opens from the homepage and shows the agreed fields', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        React.createElement(Home, {
          adminRoute: '/admin',
          fileURL: 'vscode://file/app/(frontend)/page.tsx',
        }),
      )
    })

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Register for class',
    )

    expect(trigger).toBeDefined()

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(container.textContent).toContain('Register for class')
    expect(container.textContent).toContain('First name')
    expect(container.textContent).toContain('Last name')
    expect(container.textContent).toContain('Email')
    expect(container.textContent).toContain('Phone')
    expect(container.textContent).toContain('Address')
    expect(container.textContent).toContain('Plz')
    expect(container.textContent).toContain('City')
    expect(container.textContent).toContain('Sailing club')
    expect(container.textContent).toContain('Boat number (optional)')
  })

  it('marks all fields except boat number as required', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        React.createElement(Home, {
          adminRoute: '/admin',
          fileURL: 'vscode://file/app/(frontend)/page.tsx',
        }),
      )
    })

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Register for class',
    )

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(getInputForLabel(container, 'First name')?.required).toBe(true)
    expect(getInputForLabel(container, 'Last name')?.required).toBe(true)
    expect(getInputForLabel(container, 'Email')?.required).toBe(true)
    expect(getInputForLabel(container, 'Phone')?.required).toBe(true)
    expect(getInputForLabel(container, 'Address')?.required).toBe(true)
    expect(getInputForLabel(container, 'Plz')?.required).toBe(true)
    expect(getInputForLabel(container, 'City')?.required).toBe(true)
    expect(getInputForLabel(container, 'Sailing club')?.required).toBe(true)
    expect(getInputForLabel(container, 'Boat number (optional)')?.required).toBe(false)
  })

  it('submits class registration data to the application endpoint', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        React.createElement(Home, {
          adminRoute: '/admin',
          fileURL: 'vscode://file/app/(frontend)/page.tsx',
        }),
      )
    })

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Register for class',
    )

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    setInputValue(getInputForLabel(container, 'First name'), 'Jane')
    setInputValue(getInputForLabel(container, 'Last name'), 'Doe')
    setInputValue(getInputForLabel(container, 'Email'), 'jane@example.com')
    setInputValue(getInputForLabel(container, 'Phone'), '+123456789')
    setInputValue(getInputForLabel(container, 'Address'), '123 Harbor Street')
    setInputValue(getInputForLabel(container, 'Plz'), '8000')
    setInputValue(getInputForLabel(container, 'City'), 'Zurich')
    setInputValue(getInputForLabel(container, 'Sailing club'), 'Lake Club')
    setInputValue(getInputForLabel(container, 'Boat number (optional)'), 'SUI 42')

    const submitButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Submit',
    )

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/class-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '+123456789',
        address: '123 Harbor Street',
        plz: '8000',
        city: 'Zurich',
        sailingClub: 'Lake Club',
        boatNumber: 'SUI 42',
      }),
    })
  })

  it('shows a success state with returned class registration data after submit', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            phone: '+123456789',
            address: '123 Harbor Street',
            plz: '8000',
            city: 'Zurich',
            sailingClub: 'Lake Club',
            boatNumber: 'SUI 42',
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        React.createElement(Home, {
          adminRoute: '/admin',
          fileURL: 'vscode://file/app/(frontend)/page.tsx',
        }),
      )
    })

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Register for class',
    )

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    fillRequiredFields(container)

    const submitButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Submit',
    )

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.textContent).toContain('Registration received')
    expect(container.textContent).toContain('jane@example.com')
    expect(container.textContent).toContain('SUI 42')
  })

  it('shows an inline error when submit fails', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'First name is required.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        React.createElement(Home, {
          adminRoute: '/admin',
          fileURL: 'vscode://file/app/(frontend)/page.tsx',
        }),
      )
    })

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Register for class',
    )

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    fillRequiredFields(container)

    const submitButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Submit',
    )

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.textContent).toContain('First name is required.')
  })

  it('shows a loading state and prevents duplicate submits while the request is running', async () => {
    let resolveResponse: ((value: Response) => void) | null = null
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveResponse = resolve
        }),
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        React.createElement(Home, {
          adminRoute: '/admin',
          fileURL: 'vscode://file/app/(frontend)/page.tsx',
        }),
      )
    })

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Register for class',
    )

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    fillRequiredFields(container)

    const submitButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Submit',
    ) as HTMLButtonElement | undefined

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    const pendingButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Sending...',
    ) as HTMLButtonElement | undefined

    expect(pendingButton).toBeDefined()
    expect(pendingButton?.disabled).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveResponse?.(
        new Response(
          JSON.stringify({
            data: {
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'jane@example.com',
              phone: '+123456789',
              address: '123 Harbor Street',
              plz: '8000',
              city: 'Zurich',
              sailingClub: 'Lake Club',
              boatNumber: 'SUI 42',
            },
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )
    })
  })
})

function getInputForLabel(container: HTMLDivElement, labelText: string) {
  return Array.from(container.querySelectorAll('label')).find((label) =>
    label.textContent?.includes(labelText),
  )?.querySelector('input')
}

function setInputValue(input: HTMLInputElement | null | undefined, value: string) {
  if (!input) {
    return
  }

  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

function fillRequiredFields(container: HTMLDivElement) {
  setInputValue(getInputForLabel(container, 'First name'), 'Jane')
  setInputValue(getInputForLabel(container, 'Last name'), 'Doe')
  setInputValue(getInputForLabel(container, 'Email'), 'jane@example.com')
  setInputValue(getInputForLabel(container, 'Phone'), '+123456789')
  setInputValue(getInputForLabel(container, 'Address'), '123 Harbor Street')
  setInputValue(getInputForLabel(container, 'Plz'), '8000')
  setInputValue(getInputForLabel(container, 'City'), 'Zurich')
  setInputValue(getInputForLabel(container, 'Sailing club'), 'Lake Club')
  setInputValue(getInputForLabel(container, 'Boat number (optional)'), 'SUI 42')
}
