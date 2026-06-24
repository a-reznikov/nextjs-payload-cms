'use client'

import React, { useEffect, useState } from 'react'

import {
  emptyRegisterForClassFormValues,
  type RegisterForClassErrorResponse,
  type RegisterForClassField,
  type RegisterForClassFormValues,
  type RegisterForClassPayload,
  type RegisterForClassResponse,
  requiredRegisterForClassFields,
} from '@/lib/register-for-class'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type FieldConfig = {
  label: string
  name: RegisterForClassField
  optional?: boolean
  placeholder?: string
  type?: 'email' | 'tel' | 'text'
}

const emailExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldRows: FieldConfig[][] = [
  [
    { label: 'First name', name: 'firstName' },
    { label: 'Last name', name: 'lastName' },
  ],
  [{ label: 'Email', name: 'email', type: 'email' }],
  [{ label: 'Phone', name: 'phone', type: 'tel' }],
  [{ label: 'Address', name: 'address' }],
  [
    { label: 'Plz', name: 'plz' },
    { label: 'City', name: 'city' },
  ],
  [{ label: 'Sailing club', name: 'sailingClub' }],
  [{ label: 'Boat number (optional)', name: 'boatNumber', optional: true, placeholder: 'SUI' }],
]

const successLabels: Record<RegisterForClassField, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  plz: 'Plz',
  city: 'City',
  sailingClub: 'Sailing club',
  boatNumber: 'Boat number',
}

const getClientFieldErrors = (
  values: RegisterForClassFormValues,
): Partial<Record<RegisterForClassField, string>> => {
  const errors: Partial<Record<RegisterForClassField, string>> = {}

  requiredRegisterForClassFields.forEach((field) => {
    if (!values[field].trim()) {
      errors[field] = 'This field is required.'
    }
  })

  if (values.email.trim() && !emailExpression.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export const RegisterForClassCta: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formValues, setFormValues] = useState<RegisterForClassFormValues>(
    emptyRegisterForClassFormValues,
  )
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterForClassField, string>>>(
    {},
  )
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [responseData, setResponseData] = useState<RegisterForClassPayload | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setFieldErrors({})
    setErrorMessage(null)
    setSubmitState('idle')
    setResponseData(null)
    setFormValues(emptyRegisterForClassFormValues)
    setIsOpen(true)
  }

  const handleChange = (field: RegisterForClassField, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))

    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = getClientFieldErrors(formValues)
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      setSubmitState('error')
      setErrorMessage('Please correct the highlighted fields.')
      return
    }

    setSubmitState('submitting')
    setFieldErrors({})
    setErrorMessage(null)

    try {
      const response = await fetch('/api/register-for-class', {
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const payload = (await response.json()) as RegisterForClassResponse

      if (!response.ok || !payload.success) {
        const errorPayload = payload as RegisterForClassErrorResponse
        setSubmitState('error')
        setFieldErrors(errorPayload.fieldErrors ?? {})
        setErrorMessage(errorPayload.error || 'Something went wrong while submitting the form.')
        return
      }

      setResponseData(payload.data)
      setSubmitState('success')
    } catch {
      setSubmitState('error')
      setErrorMessage('Something went wrong while submitting the form.')
    }
  }

  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-full bg-[#1389b5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f789f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:px-7 sm:text-base"
        type="button"
        onClick={openModal}
      >
        Register for class
      </button>

      {isOpen ? (
        <div
          aria-labelledby="register-for-class-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-2xl sm:p-8 lg:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close registration modal"
              className="absolute right-6 top-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-500 transition hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              type="button"
              onClick={closeModal}
            >
              <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </button>

            {submitState === 'success' && responseData ? (
              <div className="space-y-8 pr-12">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1389b5]">
                    Registration complete
                  </p>
                  <h2
                    className="text-3xl font-semibold tracking-tight sm:text-4xl"
                    id="register-for-class-title"
                  >
                    Register for class
                  </h2>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    The form was submitted successfully. Submitted values are shown below for
                    verification.
                  </p>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(successLabels).map(([field, label]) => {
                    const value = responseData[field as RegisterForClassField]

                    return (
                      <div
                        key={field}
                        className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                      >
                        <dt className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                          {label}
                        </dt>
                        <dd className="mt-2 text-base font-medium text-slate-900">
                          {value || 'Not provided'}
                        </dd>
                      </div>
                    )
                  })}
                </dl>

                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-[#1389b5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f789f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-8 pr-12" noValidate onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <h2
                    className="text-3xl font-semibold tracking-tight sm:text-4xl"
                    id="register-for-class-title"
                  >
                    Register for class
                  </h2>
                  <p className="max-w-2xl text-lg leading-8 text-slate-700">
                    Pellentesque vitae sodales sed mauris elit nulla proin ut aliquam cursus
                    ligula quisque odio
                  </p>
                </div>

                <div className="space-y-6">
                  {fieldRows.map((row) => (
                    <div
                      key={row.map((field) => field.name).join('-')}
                      className={`grid gap-5 ${row.length === 2 ? 'sm:grid-cols-[0.95fr_1fr]' : 'grid-cols-1'}`}
                    >
                      {row.map((field) => {
                        const error = fieldErrors[field.name]

                        return (
                          <label key={field.name} className="block">
                            <span className="mb-3 block text-2xl font-medium text-slate-500">
                              {field.label}
                            </span>
                            <input
                              aria-invalid={error ? 'true' : 'false'}
                              aria-describedby={error ? `${field.name}-error` : undefined}
                              className="h-18 w-full rounded-[1.5rem] border border-slate-300 bg-white px-6 text-xl text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1389b5] focus:ring-2 focus:ring-[#1389b5]/20"
                              name={field.name}
                              placeholder={field.placeholder}
                              required={!field.optional}
                              type={field.type ?? 'text'}
                              value={formValues[field.name]}
                              onChange={(event) => handleChange(field.name, event.target.value)}
                            />
                            {error ? (
                              <span
                                className="mt-2 block text-sm font-medium text-rose-600"
                                id={`${field.name}-error`}
                              >
                                {error}
                              </span>
                            ) : null}
                          </label>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {errorMessage ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#1389b5] px-6 py-5 text-xl font-semibold text-white transition hover:bg-[#0f789f] disabled:cursor-not-allowed disabled:bg-[#7cb9cf]"
                  disabled={submitState === 'submitting'}
                  type="submit"
                >
                  {submitState === 'submitting' ? (
                    <span className="inline-flex items-center gap-3">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
