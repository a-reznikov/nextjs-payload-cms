import type React from 'react'

export enum RegisterClassFieldType {
  EMAIL = 'email',
  TEL = 'tel',
  TEXT = 'text',
}

export enum RegisterClassSubmissionStatus {
  ERROR = 'error',
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
}

export type RegisterClassFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  sailingClub: string
  boatNumber: string
}

export type RegisterClassFormErrors = Partial<Record<keyof RegisterClassFormValues, string>>

export type RegisterClassFieldConfig = {
  name: keyof RegisterClassFormValues
  label: string
  type?: RegisterClassFieldType
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  optional?: boolean
}

export type RegisterClassSubmissionSuccess = {
  status: RegisterClassSubmissionStatus.SUCCESS
  message: string
  registration: RegisterClassFormValues
}

export type RegisterClassSubmissionError = {
  status: RegisterClassSubmissionStatus.ERROR
  message: string
  fieldErrors?: RegisterClassFormErrors
}
