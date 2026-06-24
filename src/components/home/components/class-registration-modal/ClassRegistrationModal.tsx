'use client'

import React, { useState } from 'react'

type Props = Record<string, never>

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const body = Object.fromEntries(formData.entries())

    await fetch('/api/class-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
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
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 py-6 sm:px-6 sm:py-10"
          role="dialog"
        >
          <div className="w-full max-w-[880px] rounded-[42px] border border-[#D5DDEA] bg-[#F9FBFF] p-6 text-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.35)] sm:p-10">
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

              <button
                className="inline-flex min-h-18 w-full items-center justify-center rounded-[28px] bg-[#1186AD] px-6 py-4 text-center text-2xl font-medium text-white transition hover:bg-[#0f7598] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
