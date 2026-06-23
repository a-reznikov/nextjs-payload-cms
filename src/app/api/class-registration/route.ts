type RegistrationFormValues = {
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

const requiredFields: Array<keyof RegistrationFormValues> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
]

const optionalFields: Array<keyof RegistrationFormValues> = ['boatNumber']

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<RegistrationFormValues> | null

  if (!body) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const data = normalizeRegistration(body)
  const missingField = requiredFields.find((field) => data[field].length === 0)

  if (missingField) {
    return Response.json(
      { error: `${toLabel(missingField)} is required.` },
      { status: 400 },
    )
  }

  return Response.json({ data }, { status: 200 })
}

function normalizeRegistration(body: Partial<RegistrationFormValues>): RegistrationFormValues {
  const normalizedEntries = [...requiredFields, ...optionalFields].map((field) => [
    field,
    typeof body[field] === 'string' ? body[field].trim() : '',
  ])

  return Object.fromEntries(normalizedEntries) as RegistrationFormValues
}

function toLabel(field: keyof RegistrationFormValues) {
  switch (field) {
    case 'firstName':
      return 'First name'
    case 'lastName':
      return 'Last name'
    case 'sailingClub':
      return 'Sailing club'
    default:
      return field.charAt(0).toUpperCase() + field.slice(1)
  }
}
