'use client'

import React, { useEffect, useState } from 'react'

type RegistrationFormData = {
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

type ValidationErrors = Partial<Record<keyof RegistrationFormData, string>>

type ApiSuccessResponse = {
  submittedAt: string
  submission: RegistrationFormData
}

type ApiErrorResponse = {
  error?: string
}

type Props = Record<string, never>

const EMPTY_FORM: RegistrationFormData = {
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

const REQUIRED_FIELDS: Array<keyof RegistrationFormData> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
]

const FIELD_LABELS: Record<keyof RegistrationFormData, string> = {
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

const FORM_FIELDS: Array<{
  key: keyof RegistrationFormData
  autoComplete: string
  className?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  type?: React.HTMLInputTypeAttribute
}> = [
  { key: 'firstName', autoComplete: 'given-name', className: 'sm:col-span-1' },
  { key: 'lastName', autoComplete: 'family-name', className: 'sm:col-span-1' },
  { key: 'email', autoComplete: 'email', className: 'sm:col-span-2', type: 'email' },
  { key: 'phone', autoComplete: 'tel', className: 'sm:col-span-2', type: 'tel' },
  { key: 'address', autoComplete: 'street-address', className: 'sm:col-span-2' },
  { key: 'plz', autoComplete: 'postal-code', className: 'sm:col-span-1', inputMode: 'numeric' },
  { key: 'city', autoComplete: 'address-level2', className: 'sm:col-span-1' },
  { key: 'sailingClub', autoComplete: 'organization', className: 'sm:col-span-2' },
  { key: 'boatNumber', autoComplete: 'off', className: 'sm:col-span-2' },
]

const validateForm = (values: RegistrationFormData) => {
  const errors: ValidationErrors = {}

  for (const field of REQUIRED_FIELDS) {
    if (!values[field].trim()) {
      errors[field] = `${FIELD_LABELS[field]} is required`
    }
  }

  return errors
}

const formatFieldValue = (value: string) => value.trim() || 'Not provided'

export const RegisterForClassCTA: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<RegistrationFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [serverError, setServerError] = useState('')
  const [submission, setSubmission] = useState<ApiSuccessResponse | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && status !== 'submitting') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, status])

  const closeModal = () => {
    if (status === 'submitting') return

    setIsOpen(false)
    setStatus('idle')
    setErrors({})
    setServerError('')
    setSubmission(null)
    setFormData(EMPTY_FORM)
  }

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current

      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
    setServerError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm(formData)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setServerError('')
    setStatus('submitting')

    try {
      const response = await fetch('/api/register-for-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const payload = (await response.json()) as ApiSuccessResponse | ApiErrorResponse

      if (!response.ok || !('submission' in payload)) {
        const errorMessage = 'error' in payload ? payload.error : undefined
        setServerError(errorMessage ?? 'Unable to submit the form right now.')
        setStatus('idle')
        return
      }

      setSubmission(payload)
      setStatus('success')
    } catch {
      setServerError('Unable to submit the form right now.')
      setStatus('idle')
    }
  }

  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-[24px] bg-[#1387af] px-7 py-4 text-base font-medium text-white shadow-[0_18px_40px_rgba(19,135,175,0.35)] transition hover:bg-[#0f7699] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:text-lg"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Register for class
      </button>

      {isOpen ? (
        <div
          aria-labelledby="register-for-class-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm sm:px-6"
          role="dialog"
        >
          <div className="relative w-full max-w-[880px] rounded-[44px] border border-slate-300/70 bg-[#f8fbff] p-6 text-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.45)] sm:p-10">
            <button
              aria-label="Close registration modal"
              className="absolute right-5 top-5 inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-slate-300 bg-white text-4xl leading-none text-slate-500 transition hover:border-slate-400 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              type="button"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            {status === 'success' && submission ? (
              <div className="space-y-8 pr-8">
                <div className="space-y-4">
                  <h2 id="register-for-class-title" className="text-4xl font-semibold tracking-tight">
                    Registration received
                  </h2>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    The form was submitted successfully. Keeping the submitted values here for
                    quick verification until you close the modal.
                  </p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {FORM_FIELDS.map(({ key }) => (
                      <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <dt className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                          {FIELD_LABELS[key]}
                        </dt>
                        <dd className="mt-2 text-base font-medium text-slate-900">
                          {formatFieldValue(submission.submission[key])}
                        </dd>
                      </div>
                    ))}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                      <dt className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                        Submitted at
                      </dt>
                      <dd className="mt-2 text-base font-medium text-slate-900">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <form className="space-y-8" noValidate onSubmit={handleSubmit}>
                <div className="space-y-4 pr-8">
                  <h2
                    id="register-for-class-title"
                    className="text-4xl font-semibold tracking-tight text-slate-900"
                  >
                    Register for class
                  </h2>
                  <p className="max-w-3xl text-lg leading-8 text-slate-700 sm:text-[1.75rem] sm:leading-[1.25]">
                    Pellentesque vitae sodales sed mauris elit nulla proin ut aliquam cursus ligula
                    quisque odio
                  </p>
                </div>

                <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
                  {FORM_FIELDS.map(({ autoComplete, className, inputMode, key, type = 'text' }) => {
                    const isRequired = REQUIRED_FIELDS.includes(key)

                    return (
                      <label key={key} className={`block ${className ?? ''}`}>
                        <span className="mb-3 block text-2xl font-medium text-slate-500">
                          {FIELD_LABELS[key]}
                        </span>
                        <input
                          aria-invalid={errors[key] ? 'true' : 'false'}
                          autoComplete={autoComplete}
                          className="w-full rounded-[22px] border border-slate-300 bg-white px-6 py-4 text-xl text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1387af] focus:ring-4 focus:ring-cyan-100 disabled:cursor-wait disabled:opacity-70"
                          disabled={status === 'submitting'}
                          inputMode={inputMode}
                          name={key}
                          required={isRequired}
                          type={type}
                          value={formData[key]}
                          onChange={(event) => handleChange(key, event.target.value)}
                        />
                        {errors[key] ? (
                          <span className="mt-2 block text-sm font-medium text-rose-600">
                            {errors[key]}
                          </span>
                        ) : null}
                      </label>
                    )
                  })}
                </div>

                {serverError ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
                    {serverError}
                  </p>
                ) : null}

                <div className="space-y-3 pt-2">
                  <button
                    className="inline-flex w-full items-center justify-center rounded-[28px] bg-[#1387af] px-6 py-5 text-2xl font-medium text-white shadow-[0_18px_40px_rgba(19,135,175,0.24)] transition hover:bg-[#0f7699] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 disabled:cursor-wait disabled:opacity-80"
                    disabled={status === 'submitting'}
                    type="submit"
                  >
                    {status === 'submitting' ? (
                      <span className="inline-flex items-center gap-3">
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        Sending...
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
