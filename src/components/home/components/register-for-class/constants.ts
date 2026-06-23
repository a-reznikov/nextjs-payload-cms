import type { FormValues } from './types'

export const initialValues: FormValues = {
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

export const requiredFields: Array<keyof Omit<FormValues, 'boatNumber'>> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'plz',
  'city',
  'sailingClub',
]

export const fieldLabels: Record<keyof FormValues, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  plz: 'Plz',
  city: 'City',
  sailingClub: 'Sailing club',
  boatNumber: 'Boat number (optional)',
}
