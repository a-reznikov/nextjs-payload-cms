import { NextResponse } from 'next/server'

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

function normalizePayload(body: unknown): RegistrationFormData {
  const input = typeof body === 'object' && body !== null ? body : {}

  return {
    firstName: String((input as Partial<RegistrationFormData>).firstName ?? '').trim(),
    lastName: String((input as Partial<RegistrationFormData>).lastName ?? '').trim(),
    email: String((input as Partial<RegistrationFormData>).email ?? '').trim(),
    phone: String((input as Partial<RegistrationFormData>).phone ?? '').trim(),
    address: String((input as Partial<RegistrationFormData>).address ?? '').trim(),
    plz: String((input as Partial<RegistrationFormData>).plz ?? '').trim(),
    city: String((input as Partial<RegistrationFormData>).city ?? '').trim(),
    sailingClub: String((input as Partial<RegistrationFormData>).sailingClub ?? '').trim(),
    boatNumber: String((input as Partial<RegistrationFormData>).boatNumber ?? '').trim(),
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const submission = normalizePayload(body)

  const missingFields = REQUIRED_FIELDS.filter((field) => !submission[field])
  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required fields: ${missingFields.join(', ')}`,
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    submittedAt: new Date().toISOString(),
    submission,
  })
}
