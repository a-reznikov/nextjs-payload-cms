import { NextRequest } from 'next/server'

import {
  registerForClassFields,
  type RegisterForClassField,
  type RegisterForClassFormValues,
  type RegisterForClassPayload,
  type RegisterForClassResponse,
  requiredRegisterForClassFields,
} from '@/lib/register-for-class'

const emailExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeFormValues = (body: unknown): RegisterForClassFormValues =>
  registerForClassFields.reduce<RegisterForClassFormValues>((values, field) => {
    const rawValue =
      body && typeof body === 'object' && field in body
        ? (body as Record<RegisterForClassField, unknown>)[field]
        : ''

    values[field] = typeof rawValue === 'string' ? rawValue.trim() : ''
    return values
  }, { ...Object.fromEntries(registerForClassFields.map((field) => [field, ''])) } as RegisterForClassFormValues)

const buildPayload = (values: RegisterForClassFormValues): RegisterForClassPayload => ({
  address: values.address,
  city: values.city,
  email: values.email,
  firstName: values.firstName,
  lastName: values.lastName,
  phone: values.phone,
  plz: values.plz,
  sailingClub: values.sailingClub,
  ...(values.boatNumber ? { boatNumber: values.boatNumber } : {}),
})

const validateFormValues = (
  values: RegisterForClassFormValues,
): Partial<Record<RegisterForClassField, string>> => {
  const fieldErrors: Partial<Record<RegisterForClassField, string>> = {}

  requiredRegisterForClassFields.forEach((field) => {
    if (!values[field]) {
      fieldErrors[field] = 'This field is required.'
    }
  })

  if (values.email && !emailExpression.test(values.email)) {
    fieldErrors.email = 'Enter a valid email address.'
  }

  return fieldErrors
}

export const POST = async (request: NextRequest) => {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    const response: RegisterForClassResponse = {
      success: false,
      error: 'Invalid request body.',
    }

    return Response.json(response, { status: 400 })
  }

  const values = normalizeFormValues(body)
  const fieldErrors = validateFormValues(values)

  if (Object.keys(fieldErrors).length > 0) {
    const response: RegisterForClassResponse = {
      success: false,
      error: 'Please correct the highlighted fields.',
      fieldErrors,
    }

    return Response.json(response, { status: 400 })
  }

  const response: RegisterForClassResponse = {
    success: true,
    data: buildPayload(values),
  }

  return Response.json(response, { status: 200 })
}
