'use client'

import React, { useEffect, useId, useState } from 'react'

import { FormField } from './components/form-field/FormField'

type Props = Record<string, never>

type RegistrationFormValues = {
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

type SubmissionResult = RegistrationFormValues

const initialValues: RegistrationFormValues = {
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

const fieldLabels: Record<keyof RegistrationFormValues, string> = {
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

export const ClassRegistrationModal: React.FC<Props> = () => {
  const titleId = useId()
  const descriptionId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<SubmissionResult | null>(null)
  const [values, setValues] = useState(initialValues)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSubmitting])

  const closeModal = () => {
    if (isSubmitting) {
      return
    }

    setIsOpen(false)
  }

  const openModal = () => {
    setValues(initialValues)
    setSubmitError(null)
    setSubmittedData(null)
    setIsOpen(true)
  }

  const handleChange =
    (field: keyof RegistrationFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/class-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const body = (await response.json()) as
        | { data?: SubmissionResult; error?: string }
        | undefined

      if (!response.ok || !body?.data) {
        throw new Error(body?.error ?? 'Unable to submit the registration form.')
      }

      setSubmittedData(body.data)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to submit the registration form.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        className="inline-flex min-h-18 items-center justify-center rounded-[28px] bg-[#1186AD] px-6 py-4 text-center text-xl font-medium text-white transition hover:bg-[#0f7598] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:min-h-0 sm:px-14 sm:py-5 sm:text-[28px]"
        onClick={openModal}
        type="button"
      >
        Register for class
      </button>

      {isOpen ? (
        <div
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 sm:px-6 sm:py-10"
          role="dialog"
        >
          <div className="absolute inset-0" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-[880px] rounded-[42px] border border-[#D5DDEA] bg-[#F9FBFF] p-6 text-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.35)] sm:p-10">
            <button
              aria-label="Close registration modal"
              className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#C8D0DB] bg-white/70 text-4xl font-light leading-none text-slate-500 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              onClick={closeModal}
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            {submittedData ? (
              <div className="space-y-6">
                <div className="space-y-3 pr-16">
                  <h2 className="text-4xl font-semibold tracking-tight" id={titleId}>
                    Registration received
                  </h2>
                  <p className="text-lg leading-8 text-slate-600" id={descriptionId}>
                    Submitted values returned by the Next.js API for verification.
                  </p>
                </div>

                <dl className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm sm:grid-cols-2">
                  {Object.entries(submittedData).map(([key, value]) => (
                    <div className="space-y-1" key={key}>
                      <dt className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                        {fieldLabels[key as keyof RegistrationFormValues]}
                      </dt>
                      <dd className="break-words text-lg text-slate-900">
                        {value || 'Not provided'}
                      </dd>
                    </div>
                  ))}
                </dl>

                <button
                  className="inline-flex min-h-14 items-center justify-center rounded-[28px] bg-[#1186AD] px-8 py-4 text-lg font-medium text-white transition hover:bg-[#0f7598] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  onClick={closeModal}
                  type="button"
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="space-y-7" onSubmit={handleSubmit}>
                <div className="space-y-3 pr-16">
                  <h2 className="text-4xl font-semibold tracking-tight" id={titleId}>
                    Register for class
                  </h2>
                  <p className="text-lg leading-8 text-slate-700" id={descriptionId}>
                    Pellentesque vitae sodales sed mauris elit nulla proin ut aliquam cursus
                    ligula quisque odio
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    autoComplete="given-name"
                    label="First name"
                    name="firstName"
                    onChange={handleChange('firstName')}
                    required
                    value={values.firstName}
                  />
                  <FormField
                    autoComplete="family-name"
                    label="Last name"
                    name="lastName"
                    onChange={handleChange('lastName')}
                    required
                    value={values.lastName}
                  />
                </div>

                <FormField
                  autoComplete="email"
                  label="Email"
                  name="email"
                  onChange={handleChange('email')}
                  required
                  type="email"
                  value={values.email}
                />

                <FormField
                  autoComplete="tel"
                  label="Phone"
                  name="phone"
                  onChange={handleChange('phone')}
                  required
                  value={values.phone}
                />

                <FormField
                  autoComplete="street-address"
                  label="Address"
                  name="address"
                  onChange={handleChange('address')}
                  required
                  value={values.address}
                />

                <div className="grid gap-6 sm:grid-cols-[176px_minmax(0,1fr)]">
                  <FormField
                    autoComplete="postal-code"
                    label="Plz"
                    name="plz"
                    onChange={handleChange('plz')}
                    required
                    value={values.plz}
                  />
                  <FormField
                    autoComplete="address-level2"
                    label="City"
                    name="city"
                    onChange={handleChange('city')}
                    required
                    value={values.city}
                  />
                </div>

                <FormField
                  label="Sailing club"
                  name="sailingClub"
                  onChange={handleChange('sailingClub')}
                  required
                  value={values.sailingClub}
                />

                <FormField
                  label="Boat number (optional)"
                  name="boatNumber"
                  onChange={handleChange('boatNumber')}
                  placeholder="SUI"
                  value={values.boatNumber}
                />

                {submitError ? (
                  <p className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </p>
                ) : null}

                <button
                  className="inline-flex min-h-18 w-full items-center justify-center rounded-[28px] bg-[#1186AD] px-6 py-4 text-center text-2xl font-medium text-white transition hover:bg-[#0f7598] disabled:cursor-wait disabled:bg-[#6BAFC6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-3">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Sending...
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
