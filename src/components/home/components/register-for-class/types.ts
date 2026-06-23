export type FormValues = {
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

export type Submission = FormValues

export type FormErrors = Partial<Record<keyof FormValues, string>>

export type SuccessResponse = {
  success: true
  submission: Submission
}

export type ErrorResponse = {
  success: false
  error?: string
  fields?: Array<keyof FormValues>
}
