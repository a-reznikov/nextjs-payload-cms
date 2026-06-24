export const registerForClassFields = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
  'boatNumber',
] as const

export const requiredRegisterForClassFields = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
] as const

export type RegisterForClassField = (typeof registerForClassFields)[number]

export type RegisterForClassPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  plz: string
  city: string
  sailingClub: string
  boatNumber?: string
}

export type RegisterForClassFormValues = Record<RegisterForClassField, string>

export type RegisterForClassSuccessResponse = {
  success: true
  data: RegisterForClassPayload
}

export type RegisterForClassErrorResponse = {
  success: false
  error: string
  fieldErrors?: Partial<Record<RegisterForClassField, string>>
}

export type RegisterForClassResponse =
  | RegisterForClassSuccessResponse
  | RegisterForClassErrorResponse

export const emptyRegisterForClassFormValues: RegisterForClassFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  plz: '',
  city: '',
  sailingClub: '',
  boatNumber: '',
}
