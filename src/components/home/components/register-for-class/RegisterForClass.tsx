'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

import { fieldLabels, initialValues, requiredFields } from './constants'
import { RegisterForClassForm } from './components/register-for-class-form/RegisterForClassForm'
import { RegisterForClassSuccess } from './components/register-for-class-success/RegisterForClassSuccess'
import type { ErrorResponse, FormErrors, FormValues, Submission, SuccessResponse } from './types'

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export const RegisterForClass: React.FC = () => {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
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

    const dialogElement = dialogRef.current

    if (!dialogElement) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(focusableSelectors),
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogElement.focus()
        return
      }

      const firstFocusableElement = focusableElements[0]
      const lastFocusableElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (!(activeElement instanceof HTMLElement) || !dialogElement.contains(activeElement)) {
        event.preventDefault()

        if (event.shiftKey) {
          lastFocusableElement.focus()
        } else {
          firstFocusableElement.focus()
        }

        return
      }

      if (event.shiftKey) {
        if (activeElement === firstFocusableElement || activeElement === dialogElement) {
          event.preventDefault()
          lastFocusableElement.focus()
        }

        return
      }

      if (activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
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

  const mapServerErrors = (fields?: Array<keyof FormValues>) => {
    const nextServerErrors: FormErrors = {}

    fields?.forEach((field) => {
      if (field !== 'boatNumber') {
        nextServerErrors[field] = `${fieldLabels[field]} is required`
      }
    })

    return nextServerErrors
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
        setFormErrors(mapServerErrors(errorBody.fields))
        setSubmissionError(errorBody.error ?? 'Something went wrong while submitting the form.')
        return
      }

      if (body.success === false) {
        setFormErrors(mapServerErrors(body.fields))
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
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
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
              <RegisterForClassSuccess submission={submission} />
            ) : (
              <RegisterForClassForm
                firstInputRef={firstInputRef}
                formErrors={formErrors}
                formValues={formValues}
                isSubmitting={isSubmitting}
                submissionError={submissionError}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
