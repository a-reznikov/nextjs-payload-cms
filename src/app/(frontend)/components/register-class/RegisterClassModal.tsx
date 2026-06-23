'use client'

import React, { useState } from 'react'

import { REGISTER_CLASS_FORM_DEFAULTS, REGISTER_CLASS_REQUIRED_FIELDS } from './form-schema'
import { RegisterClassForm } from './RegisterClassForm'
import { RegisterClassSuccess } from './RegisterClassSuccess'
import { submitRegistration } from './submitRegistration'
import {
  RegisterClassSubmissionStatus,
  type RegisterClassFormErrors,
  type RegisterClassFormValues,
  type RegisterClassSubmissionError,
  type RegisterClassSubmissionSuccess,
} from './types'

const MODAL_DESCRIPTION =
  'Pellentesque vitae sodales sed mauris elit nulla proin ut aliquam cursus ligula quisque odio'

const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const trimValues = (values: RegisterClassFormValues): RegisterClassFormValues => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  email: values.email.trim(),
  phone: values.phone.trim(),
  address: values.address.trim(),
  postalCode: values.postalCode.trim(),
  city: values.city.trim(),
  sailingClub: values.sailingClub.trim(),
  boatNumber: values.boatNumber.trim(),
})

const getValidationErrors = (values: RegisterClassFormValues): RegisterClassFormErrors => {
  const trimmedValues = trimValues(values)
  const errors: RegisterClassFormErrors = {}

  REGISTER_CLASS_REQUIRED_FIELDS.forEach((field) => {
    if (!trimmedValues[field.name]) {
      errors[field.name] = 'This field is required.'
    }
  })

  if (trimmedValues.email && !isEmailValid(trimmedValues.email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

const hasErrors = (errors: RegisterClassFormErrors) => Object.keys(errors).length > 0

export const RegisterClassModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState<RegisterClassFormValues>(REGISTER_CLASS_FORM_DEFAULTS)
  const [errors, setErrors] = useState<RegisterClassFormErrors>({})
  const [status, setStatus] = useState<RegisterClassSubmissionStatus>(RegisterClassSubmissionStatus.IDLE)
  const [submissionError, setSubmissionError] = useState('')
  const [successPayload, setSuccessPayload] = useState<RegisterClassSubmissionSuccess | null>(null)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const resetForm = () => {
    setValues(REGISTER_CLASS_FORM_DEFAULTS)
    setErrors({})
    setStatus(RegisterClassSubmissionStatus.IDLE)
    setSubmissionError('')
    setSuccessPayload(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    resetForm()
  }

  const handleFieldChange = (name: keyof RegisterClassFormValues, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors
      }

      const updatedErrors = { ...currentErrors }
      delete updatedErrors[name]

      return updatedErrors
    })

    if (submissionError) {
      setSubmissionError('')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === RegisterClassSubmissionStatus.SUBMITTING) {
      return
    }

    const trimmedValues = trimValues(values)
    const validationErrors = getValidationErrors(trimmedValues)

    setValues(trimmedValues)
    setErrors(validationErrors)

    if (hasErrors(validationErrors)) {
      setStatus(RegisterClassSubmissionStatus.IDLE)
      return
    }

    setStatus(RegisterClassSubmissionStatus.SUBMITTING)
    setSubmissionError('')

    try {
      const result = await submitRegistration(trimmedValues)

      setSuccessPayload(result)
      setStatus(RegisterClassSubmissionStatus.SUCCESS)
    } catch (error) {
      const submissionResult = error as RegisterClassSubmissionError

      setSubmissionError(submissionResult.message)
      setErrors(submissionResult.fieldErrors ?? {})
      setStatus(RegisterClassSubmissionStatus.ERROR)
    }
  }

  const isSubmitting = status === RegisterClassSubmissionStatus.SUBMITTING
  const isSuccess = status === RegisterClassSubmissionStatus.SUCCESS && successPayload

  return (
    <>
      <button className="register-class-trigger" onClick={handleOpen} type="button">
        Register for class
      </button>

      {isOpen ? (
        <div aria-modal="true" className="register-class-overlay" role="dialog">
          <div className="register-class-modal">
            <button
              aria-label="Close registration form"
              className="register-class-close"
              onClick={handleClose}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className="register-class-modal__content">
              <div className="register-class-modal__header">
                <h2 className="register-class-modal__title">Register for class</h2>
                <p className="register-class-modal__description">{MODAL_DESCRIPTION}</p>
              </div>

              {isSuccess ? (
                <RegisterClassSuccess
                  message={successPayload.message}
                  registration={successPayload.registration}
                />
              ) : (
                <form className="register-class-modal__form" onSubmit={handleSubmit}>
                  <RegisterClassForm
                    disabled={isSubmitting}
                    errors={errors}
                    onChange={handleFieldChange}
                    values={values}
                  />

                  {submissionError ? (
                    <p className="register-class-modal__error" role="alert">
                      {submissionError}
                    </p>
                  ) : null}

                  <button
                    className="register-class-submit"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
