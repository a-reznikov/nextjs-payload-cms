# Register For Class Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a home-page `Register for class` button that opens a modal form, validates required fields, submits to a Next.js API route, shows a loading state, and then renders the returned submission data in a success state.

**Architecture:** Keep [src/app/(frontend)/page.tsx](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/src/app/(frontend)/page.tsx) as the App Router entry point and keep the server-side data fetch there, but move page rendering into a dedicated synchronous `Home` component under `src/components/home/` to match the local component-placement conventions. Nest the interactive modal as a page-specific component under `src/components/home/components/register-for-class/`, add a small route handler at `src/app/api/register-for-class/route.ts` for request validation and response shaping, then cover the route with Vitest and the user flow with Playwright.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS 4, Vitest, Playwright

---

## File Map

- Modify: [src/app/(frontend)/page.tsx](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/src/app/(frontend)/page.tsx)
  Convert the page file into a thin App Router entry point that exports a named page function and delegates rendering to `Home`.

- Create: `src/components/home/Home.tsx`
  Own the existing public home-page layout and render the register CTA within the hero actions using props supplied by the page entry.

- Create: `src/components/home/components/register-for-class/RegisterForClass.tsx`
  Own the modal trigger, form state, client validation, loading state, API submission, and success rendering.

- Create: `src/app/api/register-for-class/route.ts`
  Accept `POST` requests, sanitize string fields, validate required values, and return either a `400` error payload or `200` success payload.

- Create: `tests/int/register-for-class-route.int.spec.ts`
  Assert the route contract directly with valid and invalid requests.

- Modify: [tests/e2e/frontend.e2e.spec.ts](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/tests/e2e/frontend.e2e.spec.ts)
  Cover the visible button, modal open, client validation, loading transition, and success state.

## Task 1: Add and Verify the API Route Contract

**Files:**
- Create: `tests/int/register-for-class-route.int.spec.ts`
- Create: `src/app/api/register-for-class/route.ts`

- [ ] **Step 1: Write the failing route tests**

Create `tests/int/register-for-class-route.int.spec.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/register-for-class/route'

const validPayload = {
  firstName: ' Ada ',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '123456789',
  address: ' Main Street 1 ',
  plz: '8000',
  city: 'Zurich',
  sailingClub: 'Lake Club',
  boatNumber: ' SUI ',
}

describe('register-for-class route', () => {
  it('returns sanitized submission data for a valid payload', async () => {
    const request = new Request('http://localhost:3000/api/register-for-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validPayload),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
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
    })
  })

  it('returns a 400 error when a required field is missing', async () => {
    const request = new Request('http://localhost:3000/api/register-for-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validPayload,
        city: '   ',
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      success: false,
      error: 'Missing required fields',
      fields: ['city'],
    })
  })
})
```

- [ ] **Step 2: Run the route test to verify it fails**

Run:

```bash
npm test -- --runInBand tests/int/register-for-class-route.int.spec.ts
```

Expected:

```text
FAIL tests/int/register-for-class-route.int.spec.ts
Cannot find module '@/app/api/register-for-class/route'
```

- [ ] **Step 3: Write the minimal route implementation**

Create `src/app/api/register-for-class/route.ts` with:

```ts
const requiredFields = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
] as const

type RegistrationPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  plz: string
  city: string
  sailingClub: string
  boatNumber: string
}

function normalizePayload(input: Record<string, unknown>): RegistrationPayload {
  return {
    firstName: String(input.firstName ?? '').trim(),
    lastName: String(input.lastName ?? '').trim(),
    email: String(input.email ?? '').trim(),
    phone: String(input.phone ?? '').trim(),
    address: String(input.address ?? '').trim(),
    plz: String(input.plz ?? '').trim(),
    city: String(input.city ?? '').trim(),
    sailingClub: String(input.sailingClub ?? '').trim(),
    boatNumber: String(input.boatNumber ?? '').trim(),
  }
}

export async function POST(request: Request) {
  const json = (await request.json()) as Record<string, unknown>
  const submission = normalizePayload(json)

  const missingFields = requiredFields.filter((field) => !submission[field])

  if (missingFields.length > 0) {
    return Response.json(
      {
        success: false,
        error: 'Missing required fields',
        fields: missingFields,
      },
      { status: 400 },
    )
  }

  return Response.json({
    success: true,
    submission,
  })
}
```

- [ ] **Step 4: Run the route test to verify it passes**

Run:

```bash
npm test -- --runInBand tests/int/register-for-class-route.int.spec.ts
```

Expected:

```text
PASS tests/int/register-for-class-route.int.spec.ts
2 passed
```

- [ ] **Step 5: Commit the route contract work**

Run:

```bash
git add tests/int/register-for-class-route.int.spec.ts src/app/api/register-for-class/route.ts
git commit -m "feat(api): add register for class route"
```

## Task 2: Add the End-to-End Test for the Modal Flow

**Files:**
- Modify: [tests/e2e/frontend.e2e.spec.ts](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/tests/e2e/frontend.e2e.spec.ts)

- [ ] **Step 1: Write the failing Playwright test for the registration flow**

Update `tests/e2e/frontend.e2e.spec.ts` to:

```ts
import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)
    await expect(page.locator('h1').first()).toHaveText('Welcome to your new project.')
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
```

- [ ] **Step 2: Run the Playwright test to verify it fails**

Run:

```bash
npm run test:e2e -- --grep "submits the register for class form"
```

Expected:

```text
FAIL tests/e2e/frontend.e2e.spec.ts
Unable to find role="button" with name "Register for class"
```

- [ ] **Step 3: Keep the failing test output handy while implementing**

No code change in this step. Copy the exact failing selector and assertion from the Playwright output into the task notes so the implementation targets the real failure instead of memory.

- [ ] **Step 4: Commit the failing test before implementation**

Run:

```bash
git add tests/e2e/frontend.e2e.spec.ts
git commit -m "test(frontend): cover register for class modal flow"
```

## Task 3: Restructure the Frontend Around `Home` and Add the Modal Component

**Files:**
- Create: `src/components/home/Home.tsx`
- Create: `src/components/home/components/register-for-class/RegisterForClass.tsx`
- Modify: [src/app/(frontend)/page.tsx](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/src/app/(frontend)/page.tsx)

- [ ] **Step 1: Create the page-specific register component in the required folder structure**

Create `src/components/home/components/register-for-class/RegisterForClass.tsx` with:

```tsx
'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  plz: string
  city: string
  sailingClub: string
  boatNumber: string
}

type SubmissionResponse = {
  success: true
  submission: FormValues
}

type ErrorResponse = {
  success: false
  error: string
  fields?: string[]
}

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  plz: '',
  city: '',
  sailingClub: '',
  boatNumber: '',
}

const labels: Record<keyof FormValues, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  plz: 'Plz',
  city: 'City',
  sailingClub: 'Sailing club',
  boatNumber: 'Boat number (optional)',
}

const requiredFields: Array<Exclude<keyof FormValues, 'boatNumber'>> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
]

function validate(values: FormValues) {
  return requiredFields.reduce<Record<string, string>>((errors, field) => {
    if (!values[field].trim()) {
      errors[field] = `${labels[field]} is required`
    }

    return errors
  }, {})
}

export const RegisterForClass: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submission, setSubmission] = useState<FormValues | null>(null)
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus()
      return
    }

    triggerRef.current?.focus()
  }, [isOpen])

  function updateValue(field: keyof FormValues, nextValue: string) {
    setValues((current) => ({ ...current, [field]: nextValue }))
    setErrors((current) => {
      if (!current[field]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmissionError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register-for-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const body = (await response.json()) as SubmissionResponse | ErrorResponse

      if (!response.ok || !body.success) {
        const fieldErrors = (body.fields ?? []).reduce<Record<string, string>>((current, field) => {
          current[field] = `${labels[field as keyof FormValues]} is required`
          return current
        }, {})

        setErrors(fieldErrors)
        setSubmissionError(body.error ?? 'Unable to submit the form')
        return
      }

      setSubmission(body.submission)
    } catch {
      setSubmissionError('Unable to submit the form')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
        type="button"
        onClick={() => {
          setErrors({})
          setSubmissionError(null)
          setSubmission(null)
          setIsOpen(true)
        }}
      >
        Register for class
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className="w-full max-w-4xl rounded-[2rem] border border-slate-200/70 bg-white p-6 text-slate-900 shadow-2xl sm:p-10"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight" id={titleId}>
                  Register for class
                </h2>
                <p className="max-w-3xl text-lg leading-8 text-slate-700">
                  Pellentesque vitae sodales sed mauris elit nulla proin ut aliquam cursus ligula quisque odio
                </p>
              </div>

              <button
                aria-label="Close register for class modal"
                className="rounded-full border border-slate-300 p-3 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <span aria-hidden="true" className="block text-3xl leading-none">
                  ×
                </span>
              </button>
            </div>

            {submission ? (
              <div className="mt-10 space-y-3">
                <h3 className="text-2xl font-semibold">Registration submitted</h3>
                <p className="text-slate-700">Submitted values returned by the API:</p>
                <dl className="grid gap-3 rounded-3xl bg-slate-100 p-6">
                  {Object.entries(submission).map(([key, value]) => (
                    <div className="grid gap-1 sm:grid-cols-[180px_1fr]" key={key}>
                      <dt className="font-medium text-slate-600">{labels[key as keyof FormValues]}</dt>
                      <dd className="text-slate-900">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                  {(
                    [
                      'firstName',
                      'lastName',
                      'email',
                      'phone',
                      'address',
                      'plz',
                      'city',
                      'sailingClub',
                      'boatNumber',
                    ] as Array<keyof FormValues>
                  ).map((field) => {
                    const singleColumnFields = ['email', 'phone', 'address', 'sailingClub', 'boatNumber']
                    const isSingleColumn = singleColumnFields.includes(field)

                    return (
                      <label
                        className={isSingleColumn ? 'space-y-2 sm:col-span-2' : 'space-y-2'}
                        key={field}
                      >
                        <span className="block text-lg text-slate-600">{labels[field]}</span>
                        <input
                          ref={field === 'firstName' ? firstInputRef : undefined}
                          aria-invalid={errors[field] ? 'true' : 'false'}
                          className="w-full rounded-[1.5rem] border border-slate-300 px-6 py-4 text-lg outline-none transition focus:border-sky-500"
                          disabled={isSubmitting}
                          name={field}
                          type={field === 'email' ? 'email' : 'text'}
                          value={values[field]}
                          onChange={(event) => updateValue(field, event.target.value)}
                        />
                        {errors[field] ? (
                          <span className="block text-sm font-medium text-rose-600">{errors[field]}</span>
                        ) : null}
                      </label>
                    )
                  })}
                </div>

                {submissionError ? <p className="text-sm font-medium text-rose-600">{submissionError}</p> : null}

                <button
                  className="inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-4 text-2xl font-semibold text-white transition hover:bg-sky-500 disabled:cursor-wait disabled:opacity-80"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
```

- [ ] **Step 2: Create the page-level `Home` component that renders the existing layout and CTA**

Create `src/components/home/Home.tsx` with:

```tsx
import React from 'react'

import { RegisterForClass } from './components/register-for-class/RegisterForClass'

type Props = {
  adminRoute: string
  fileURL: string
  userEmail?: string
}

export const Home: React.FC<Props> = ({ adminRoute, fileURL, userEmail }) => {

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
      />

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex flex-1 items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-cyan-500/10 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Payload CMS starter
            </div>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <img
                alt="Payload Logo"
                className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-cyan-500/10"
                height={64}
                src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg"
                width={64}
              />

              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
                  Public frontend
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {userEmail ? `Welcome back, ${userEmail}` : 'Welcome to your new project.'}
                </h1>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The public page now uses Tailwind utilities for the layout, buttons, spacing, and
              visual treatment while keeping the Payload auth state and admin link intact.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <RegisterForClass />
              <a
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                href={adminRoute}
                rel="noopener noreferrer"
                target="_blank"
              >
                Go to admin panel
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                href="https://payloadcms.com/docs"
                rel="noopener noreferrer"
                target="_blank"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Update this page by editing</p>
          <a
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200 transition hover:bg-white/10"
            href={fileURL}
          >
            <code className="font-mono text-xs">app/(frontend)/page.tsx</code>
          </a>
        </footer>
      </main>
    </section>
  )
}
```

- [ ] **Step 3: Update the App Router page file so it delegates to `Home`**

Update [src/app/(frontend)/page.tsx](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/src/app/(frontend)/page.tsx) to:

```tsx
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import { Home } from '@/components/home/Home'
import config from '@/payload.config'

export const FrontendPage = async () => {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <Home
      adminRoute={payloadConfig.routes.admin}
      fileURL={fileURL}
      userEmail={user?.email}
    />
  )
}

export default FrontendPage
```

- [ ] **Step 4: Run the targeted route and frontend tests**

Run:

```bash
npm test -- --runInBand tests/int/register-for-class-route.int.spec.ts
npm run test:e2e -- --grep "submits the register for class form"
```

Expected:

```text
PASS tests/int/register-for-class-route.int.spec.ts
PASS tests/e2e/frontend.e2e.spec.ts
```

- [ ] **Step 5: Validate the new components against the building-components checklist**

Confirm all of the following are true before moving on:

```text
- src/components/home/components/register-for-class/ is kebab-case
- RegisterForClass.tsx uses a named export with React.FC
- Home.tsx uses a named export with React.FC
- No default export is used in component files
- The page file is the only file keeping the App Router default export
- One component exists per file
```

- [ ] **Step 6: Refine any selector or accessibility issues without broadening scope**

If Playwright fails on labels or dialog name, only make the smallest fixes needed:

```tsx
<input id="firstName" ... />
<label htmlFor="firstName">First name</label>
```

or:

```tsx
<div aria-labelledby={titleId} role="dialog" aria-modal="true">
  <h2 id={titleId}>Register for class</h2>
</div>
```

Re-run the same two commands from Step 4 after each fix until both tests pass.

- [ ] **Step 7: Run lint auto-fix on the touched component files and re-check**

Run:

```bash
npm run lint -- --fix src/components/home/Home.tsx src/components/home/components/register-for-class/RegisterForClass.tsx src/app/'(frontend)'/page.tsx
npm run lint -- src/components/home/Home.tsx src/components/home/components/register-for-class/RegisterForClass.tsx src/app/'(frontend)'/page.tsx
```

Expected:

```text
eslint exited with code 0 for the touched files
```

- [ ] **Step 8: Commit the interactive frontend**

Run:

```bash
git add src/components/home/Home.tsx src/components/home/components/register-for-class/RegisterForClass.tsx src/app/'(frontend)'/page.tsx
git commit -m "feat(frontend): add register for class modal"
```

## Task 4: Run Full Verification and Prepare the Branch

**Files:**
- Modify: none expected

- [ ] **Step 1: Run the full integration test suite**

Run:

```bash
npm run test:int
npm run test:e2e
```

Expected:

```text
PASS tests/int/api.int.spec.ts
PASS tests/int/register-for-class-route.int.spec.ts
PASS tests/e2e/frontend.e2e.spec.ts
```

- [ ] **Step 2: Run linting**

Run:

```bash
npm run lint
```

Expected:

```text
eslint exited with code 0
```

- [ ] **Step 3: Inspect final git state**

Run:

```bash
git status --short
git log --oneline -3
```

Expected:

```text
<no output from git status --short>
<recent commits include the route, test, and frontend changes>
```

- [ ] **Step 4: Commit any final verification-only adjustments if needed**

If verification required tiny fixes, commit them with the smallest matching scope. Example:

```bash
git add tests/e2e/frontend.e2e.spec.ts src/components/home/components/register-for-class/RegisterForClass.tsx
git commit -m "fix(frontend): align modal accessibility with tests"
```

- [ ] **Step 5: Stop and ask whether to push or keep local**

Report:

```text
Implementation complete, verified locally, and ready for either push or further review on the current branch.
```
