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

const fields: Array<keyof RegistrationFormValues> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
  'boatNumber',
]

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

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<RegistrationFormValues>
  const data = Object.fromEntries(
    fields.map((field) => [field, typeof body[field] === 'string' ? body[field].trim() : '']),
  ) as RegistrationFormValues

  const missingField = requiredFields.find((field) => data[field].length === 0)

  if (missingField) {
    return Response.json({ error: `${toLabel(missingField)} is required.` }, { status: 400 })
  }

  return Response.json({
    data,
  })
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
