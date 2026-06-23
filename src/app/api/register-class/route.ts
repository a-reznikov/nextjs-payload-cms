import { NextResponse } from 'next/server'

type RegisterClassFormValues = {
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

type RegisterClassFormErrors = Partial<Record<keyof RegisterClassFormValues, string>>

const REQUIRED_FIELDS: Array<keyof RegisterClassFormValues> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'postalCode',
  'city',
  'sailingClub',
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeField = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const normalizeRegistration = (body: Record<string, unknown>): RegisterClassFormValues => ({
  firstName: normalizeField(body.firstName),
  lastName: normalizeField(body.lastName),
  email: normalizeField(body.email),
  phone: normalizeField(body.phone),
  address: normalizeField(body.address),
  postalCode: normalizeField(body.postalCode),
  city: normalizeField(body.city),
  sailingClub: normalizeField(body.sailingClub),
  boatNumber: normalizeField(body.boatNumber),
})

const getValidationErrors = (values: RegisterClassFormValues): RegisterClassFormErrors => {
  const errors: RegisterClassFormErrors = {}

  REQUIRED_FIELDS.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'This field is required.'
    }
  })

  if (values.email && !isEmailValid(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export const POST = async (request: Request) => {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        message: 'The registration request body must be valid JSON.',
      },
      { status: 400 },
    )
  }

  if (!isRecord(payload)) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'The registration request body must be an object.',
      },
      { status: 400 },
    )
  }

  const registration = normalizeRegistration(payload)
  const fieldErrors = getValidationErrors(registration)

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Please complete the required fields and try again.',
        fieldErrors,
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    status: 'success',
    message: 'Registration submitted successfully. Please verify your details below.',
    registration,
  })
}
