'use client'

import React, { useState } from 'react'

type Props = Record<string, never>
type RegistrationResponse = Record<string, string>

const fieldDefinitions = [
  { label: 'First name', name: 'firstName', required: true },
  { label: 'Last name', name: 'lastName', required: true },
  { label: 'Email', name: 'email', required: true },
  { label: 'Phone', name: 'phone', required: true },
  { label: 'Address', name: 'address', required: true },
  { label: 'Plz', name: 'plz', required: true },
  { label: 'City', name: 'city', required: true },
  { label: 'Sailing club', name: 'sailingClub', required: true },
  { label: 'Boat number (optional)', name: 'boatNumber', required: false },
]

export const ClassRegistrationModal: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<RegistrationResponse | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const formData = new FormData(event.currentTarget)
    const body = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/class-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const responseBody = (await response.json()) as {
        data?: RegistrationResponse
        error?: string
      }

      if (!response.ok || !responseBody.data) {
        throw new Error(responseBody.error ?? 'Unable to submit the registration form.')
      }

      setSubmittedData(responseBody.data)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to submit the registration form.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Register for class
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-4 py-6 sm:px-6 sm:py-10"
          role="dialog"
        >
          <div className="mx-auto w-full max-w-[880px] rounded-[42px] border border-[#D5DDEA] bg-[#F9FBFF] p-6 text-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.35)] sm:p-10">
            {submittedData ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-4xl font-semibold tracking-tight">Registration received</h2>
                  <p className="text-lg leading-8 text-slate-700">
                    Submitted values returned by the Next.js API for verification.
                  </p>
                </div>

                <dl className="space-y-4">
                  {fieldDefinitions.map(({ label, name }) => (
                    <div key={name}>
                      <dt className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-1 text-lg text-slate-900">
                        {submittedData[name] || 'Not provided'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <h2 className="text-4xl font-semibold tracking-tight">Register for class</h2>
                  <p className="text-lg leading-8 text-slate-700">
                    Pellentesque vitae sodales sed mauris elit nulla proin ut aliquam cursus ligula
                    quisque odio
                  </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  {fieldDefinitions.map(({ label, name, required }) => (
                    <label className="block space-y-3 text-[26px] font-medium text-slate-500" key={label}>
                      <span>{label}</span>
                      <input
                        className="h-18 w-full rounded-[22px] border border-[#C8D0DB] bg-white px-6 text-[26px] text-slate-900 outline-none"
                        name={name}
                        required={required}
                        type="text"
                      />
                    </label>
                  ))}

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
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
