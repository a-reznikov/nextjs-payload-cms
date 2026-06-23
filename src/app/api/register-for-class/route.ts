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

function normalizePayload(input: Record<string, unknown>): RegistrationPayload {
  return {
    firstName: String(input.firstName ?? '').trim(),
    lastName: String(input.lastName ?? '').trim(),
    email: String(input.email ?? '').trim(),
    phone: String(input.phone ?? '').trim(),
    address: String(input.address ?? '').trim(),
    plz: String(input.plz ?? '').trim(),
    city: String(input.city ?? '').trim(),
    sailingClub: String(input.sailingClub ?? '').trim(),
    boatNumber: String(input.boatNumber ?? '').trim(),
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
    submission,
  })
}
