const requiredFields = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
] as const

type RegistrationPayload = {
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

function normalizeField(input: Record<string, unknown>, field: keyof RegistrationPayload) {
  const value = input[field]

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function normalizePayload(input: Record<string, unknown>) {
  return {
    firstName: normalizeField(input, 'firstName'),
    lastName: normalizeField(input, 'lastName'),
    email: normalizeField(input, 'email'),
    phone: normalizeField(input, 'phone'),
    address: normalizeField(input, 'address'),
    plz: normalizeField(input, 'plz'),
    city: normalizeField(input, 'city'),
    sailingClub: normalizeField(input, 'sailingClub'),
    boatNumber: typeof input.boatNumber === 'string' ? input.boatNumber.trim() : '',
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>
  const submission = normalizePayload(payload)

  const missingFields = requiredFields.filter((field) => !submission[field])

  if (missingFields.length > 0) {
    return Response.json(
      {
        success: false,
        error: 'Missing required fields',
        fields: missingFields,
      },
      { status: 400 },
    )
  }

  return Response.json({
    success: true,
    submission: submission as RegistrationPayload,
  })
}
