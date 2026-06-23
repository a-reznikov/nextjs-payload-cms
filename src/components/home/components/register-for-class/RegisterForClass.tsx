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

type Submission = FormValues

type FormErrors = Partial<Record<keyof FormValues, string>>

type SuccessResponse = {
  success: true
  submission: Submission
}

type ErrorResponse = {
  success: false
  error?: string
  fields?: Array<keyof FormValues>
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

const requiredFields: Array<keyof Omit<FormValues, 'boatNumber'>> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
]

const fieldLabels: Record<keyof FormValues, string> = {
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

export const RegisterForClass: React.FC = () => {
  const titleId = useId()
  const descriptionId = useId()
  const firstInputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    firstInputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSubmitting])

  useEffect(() => {
    if (isOpen) {
      return
    }

    triggerRef.current?.focus()
  }, [isOpen])

  const validate = (values: FormValues) => {
    const nextErrors: FormErrors = {}

    requiredFields.forEach((field) => {
      if (!values[field].trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required`
      }
    })

    return nextErrors
  }

  const handleOpen = () => {
    setIsOpen(true)
    setFormValues(initialValues)
    setSubmission(null)
    setSubmissionError(null)
    setFormErrors({})
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    setIsOpen(false)
  }

  const handleChange =
    (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value

      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: nextValue,
      }))

      setFormErrors((currentErrors) => {
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

    const nextErrors = validate(formValues)
    setFormErrors(nextErrors)
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
        body: JSON.stringify(formValues),
      })

      const body = (await response.json()) as SuccessResponse | ErrorResponse

      if (!response.ok) {
        const errorBody = body as ErrorResponse
        const nextServerErrors: FormErrors = {}

        errorBody.fields?.forEach((field) => {
          if (field !== 'boatNumber') {
            nextServerErrors[field] = `${fieldLabels[field]} is required`
          }
        })

        setFormErrors(nextServerErrors)
        setSubmissionError(errorBody.error ?? 'Something went wrong while submitting the form.')
        return
      }

      if (body.success === false) {
        const nextServerErrors: FormErrors = {}

        body.fields?.forEach((field) => {
          if (field !== 'boatNumber') {
            nextServerErrors[field] = `${fieldLabels[field]} is required`
          }
        })

        setFormErrors(nextServerErrors)
        setSubmissionError(body.error ?? 'Something went wrong while submitting the form.')
        return
      }

      setSubmission(body.submission)
    } catch {
      setSubmissionError('Something went wrong while submitting the form.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="inline-flex items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
        type="button"
        onClick={handleOpen}
      >
        Register for class
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="relative max-h-full w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl shadow-cyan-950/40 sm:p-8"
            role="dialog"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <button
              aria-label="Close register for class modal"
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="button"
              onClick={handleClose}
            >
              ×
            </button>

            <div className="pr-12">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
                Sailing registration
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white" id={titleId}>
                Register for class
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300" id={descriptionId}>
                Share your details below and we&apos;ll use them for the class registration.
              </p>
            </div>

            {submission ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
                  <h3 className="text-xl font-semibold text-emerald-200">Registration submitted</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                    We received the following details.
                  </p>
                </div>

                <dl className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
                  {(Object.entries(submission) as Array<[keyof FormValues, string]>).map(
                    ([field, value]) => (
                      <div
                        className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"
                        key={field}
                      >
                        <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                          {fieldLabels[field]}
                        </dt>
                        <dd className="mt-2 text-sm text-slate-100">{value || 'Not provided'}</dd>
                      </div>
                    ),
                  )}
                </dl>
              </div>
            ) : (
              <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-200">First name</span>
                    <input
                      ref={firstInputRef}
                      aria-invalid={Boolean(formErrors.firstName)}
                      aria-describedby={formErrors.firstName ? 'first-name-error' : undefined}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSubmitting}
                      name="firstName"
                      type="text"
                      value={formValues.firstName}
                      onChange={handleChange('firstName')}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-rose-300" id="first-name-error">
                        {formErrors.firstName}
                      </p>
                    )}
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-200">Last name</span>
                    <input
                      aria-invalid={Boolean(formErrors.lastName)}
                      aria-describedby={formErrors.lastName ? 'last-name-error' : undefined}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSubmitting}
                      name="lastName"
                      type="text"
                      value={formValues.lastName}
                      onChange={handleChange('lastName')}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-rose-300" id="last-name-error">
                        {formErrors.lastName}
                      </p>
                    )}
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">Email</span>
                  <input
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-rose-300" id="email-error">
                      {formErrors.email}
                    </p>
                  )}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">Phone</span>
                  <input
                    aria-invalid={Boolean(formErrors.phone)}
                    aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    name="phone"
                    type="tel"
                    value={formValues.phone}
                    onChange={handleChange('phone')}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-rose-300" id="phone-error">
                      {formErrors.phone}
                    </p>
                  )}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">Address</span>
                  <input
                    aria-invalid={Boolean(formErrors.address)}
                    aria-describedby={formErrors.address ? 'address-error' : undefined}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    name="address"
                    type="text"
                    value={formValues.address}
                    onChange={handleChange('address')}
                  />
                  {formErrors.address && (
                    <p className="text-sm text-rose-300" id="address-error">
                      {formErrors.address}
                    </p>
                  )}
                </label>

                <div className="grid gap-5 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)]">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-200">Plz</span>
                    <input
                      aria-invalid={Boolean(formErrors.plz)}
                      aria-describedby={formErrors.plz ? 'plz-error' : undefined}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSubmitting}
                      name="plz"
                      type="text"
                      value={formValues.plz}
                      onChange={handleChange('plz')}
                    />
                    {formErrors.plz && (
                      <p className="text-sm text-rose-300" id="plz-error">
                        {formErrors.plz}
                      </p>
                    )}
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-200">City</span>
                    <input
                      aria-invalid={Boolean(formErrors.city)}
                      aria-describedby={formErrors.city ? 'city-error' : undefined}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSubmitting}
                      name="city"
                      type="text"
                      value={formValues.city}
                      onChange={handleChange('city')}
                    />
                    {formErrors.city && (
                      <p className="text-sm text-rose-300" id="city-error">
                        {formErrors.city}
                      </p>
                    )}
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">Sailing club</span>
                  <input
                    aria-invalid={Boolean(formErrors.sailingClub)}
                    aria-describedby={formErrors.sailingClub ? 'sailing-club-error' : undefined}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    name="sailingClub"
                    type="text"
                    value={formValues.sailingClub}
                    onChange={handleChange('sailingClub')}
                  />
                  {formErrors.sailingClub && (
                    <p className="text-sm text-rose-300" id="sailing-club-error">
                      {formErrors.sailingClub}
                    </p>
                  )}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">Boat number (optional)</span>
                  <input
                    aria-invalid={Boolean(formErrors.boatNumber)}
                    aria-describedby={formErrors.boatNumber ? 'boat-number-error' : undefined}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    name="boatNumber"
                    type="text"
                    value={formValues.boatNumber}
                    onChange={handleChange('boatNumber')}
                  />
                  {formErrors.boatNumber && (
                    <p className="text-sm text-rose-300" id="boat-number-error">
                      {formErrors.boatNumber}
                    </p>
                  )}
                </label>

                {submissionError && (
                  <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {submissionError}
                  </p>
                )}

                <div className="flex justify-end pt-3">
                  <button
                    className="inline-flex min-w-36 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
