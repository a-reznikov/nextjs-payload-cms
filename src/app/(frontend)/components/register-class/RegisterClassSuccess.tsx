'use client'

import React from 'react'

import type { RegisterClassFormValues } from './types'

type Props = {
  message: string
  registration: RegisterClassFormValues
}

const SUCCESS_FIELDS: Array<{ key: keyof RegisterClassFormValues; label: string }> = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'postalCode', label: 'Plz' },
  { key: 'city', label: 'City' },
  { key: 'sailingClub', label: 'Sailing club' },
  { key: 'boatNumber', label: 'Boat number' },
]

export const RegisterClassSuccess: React.FC<Props> = ({ message, registration }) => (
  <div className="register-class-success">
    <p className="register-class-success__message">{message}</p>
    <dl className="register-class-success__list">
      {SUCCESS_FIELDS.map(({ key, label }) => {
        const value = registration[key].trim() || 'Not provided'

        return (
          <div className="register-class-success__item" key={key}>
            <dt className="register-class-success__term">{label}</dt>
            <dd className="register-class-success__value">{value}</dd>
          </div>
        )
      })}
    </dl>
  </div>
)
