'use client'

import React from 'react'

import { RegisterClassFieldType, type RegisterClassFormErrors, type RegisterClassFormValues } from './types'

type Props = {
  label: string
  name: keyof RegisterClassFormValues
  value: string
  error?: RegisterClassFormErrors[keyof RegisterClassFormValues]
  type?: RegisterClassFieldType
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  disabled?: boolean
  onChange: (name: keyof RegisterClassFormValues, value: string) => void
}

export const RegisterClassField: React.FC<Props> = ({
  label,
  name,
  value,
  error,
  type = RegisterClassFieldType.TEXT,
  autoComplete,
  inputMode,
  disabled,
  onChange,
}) => {
  const inputId = `register-class-${name}`
  const errorId = `${inputId}-error`

  return (
    <label className="register-class-field">
      <span className="register-class-field__label">{label}</span>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        autoComplete={autoComplete}
        className="register-class-field__input"
        disabled={disabled}
        id={inputId}
        inputMode={inputMode}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        type={type}
        value={value}
      />
      {error ? (
        <span className="register-class-field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
