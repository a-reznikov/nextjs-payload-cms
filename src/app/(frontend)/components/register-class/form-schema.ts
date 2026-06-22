import { RegisterClassFieldType, type RegisterClassFieldConfig, type RegisterClassFormValues } from './types'

export const REGISTER_CLASS_FORM_DEFAULTS: RegisterClassFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  sailingClub: '',
  boatNumber: '',
}

export const REGISTER_CLASS_FIELDS: RegisterClassFieldConfig[] = [
  {
    name: 'firstName',
    label: 'First name',
    autoComplete: 'given-name',
  },
  {
    name: 'lastName',
    label: 'Last name',
    autoComplete: 'family-name',
  },
  {
    name: 'email',
    label: 'Email',
    type: RegisterClassFieldType.EMAIL,
    autoComplete: 'email',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: RegisterClassFieldType.TEL,
    autoComplete: 'tel',
  },
  {
    name: 'address',
    label: 'Address',
    autoComplete: 'street-address',
  },
  {
    name: 'postalCode',
    label: 'Plz',
    autoComplete: 'postal-code',
    inputMode: 'numeric',
  },
  {
    name: 'city',
    label: 'City',
    autoComplete: 'address-level2',
  },
  {
    name: 'sailingClub',
    label: 'Sailing club',
    autoComplete: 'organization',
  },
  {
    name: 'boatNumber',
    label: 'Boat number (optional)',
    optional: true,
  },
]

export const REGISTER_CLASS_REQUIRED_FIELDS = REGISTER_CLASS_FIELDS.filter((field) => !field.optional)
