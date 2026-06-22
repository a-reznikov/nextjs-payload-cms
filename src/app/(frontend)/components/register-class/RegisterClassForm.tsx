'use client'

import React from 'react'

import { REGISTER_CLASS_FIELDS } from './form-schema'
import { RegisterClassField } from './RegisterClassField'
import { type RegisterClassFormErrors, type RegisterClassFormValues } from './types'

type Props = {
  values: RegisterClassFormValues
  errors: RegisterClassFormErrors
  disabled?: boolean
  onChange: (name: keyof RegisterClassFormValues, value: string) => void
}

const FIELD_LAYOUTS: Record<keyof RegisterClassFormValues, string> = {
  firstName: 'register-class-form__field register-class-form__field--half',
  lastName: 'register-class-form__field register-class-form__field--half',
  email: 'register-class-form__field register-class-form__field--full',
  phone: 'register-class-form__field register-class-form__field--full',
  address: 'register-class-form__field register-class-form__field--full',
  postalCode: 'register-class-form__field register-class-form__field--postal',
  city: 'register-class-form__field register-class-form__field--city',
  sailingClub: 'register-class-form__field register-class-form__field--full',
  boatNumber: 'register-class-form__field register-class-form__field--full',
}

export const RegisterClassForm: React.FC<Props> = ({ values, errors, disabled, onChange }) => (
  <div className="register-class-form">
    {REGISTER_CLASS_FIELDS.map((field) => (
      <div className={FIELD_LAYOUTS[field.name]} key={field.name}>
        <RegisterClassField
          autoComplete={field.autoComplete}
          disabled={disabled}
          error={errors[field.name]}
          inputMode={field.inputMode}
          label={field.label}
          name={field.name}
          onChange={onChange}
          type={field.type}
          value={values[field.name]}
        />
      </div>
    ))}
  </div>
)
