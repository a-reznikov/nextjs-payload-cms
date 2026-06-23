import React from 'react'

import { fieldLabels } from '../../constants'
import type { FormErrors, FormValues } from '../../types'

type Props = {
  formErrors: FormErrors
  formValues: FormValues
  isSubmitting: boolean
  submissionError: string | null
  firstInputRef?: React.RefObject<HTMLInputElement | null>
  onChange: (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const RegisterForClassForm: React.FC<Props> = ({
  formErrors,
  formValues,
  isSubmitting,
  submissionError,
  onChange,
  onSubmit,
  firstInputRef,
}) => (
  <form className="mt-8 space-y-5" noValidate onSubmit={onSubmit}>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-200">{fieldLabels.firstName}</span>
        <input
          ref={firstInputRef}
          aria-invalid={Boolean(formErrors.firstName)}
          aria-describedby={formErrors.firstName ? 'first-name-error' : undefined}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          name="firstName"
          type="text"
          value={formValues.firstName}
          onChange={onChange('firstName')}
        />
        {formErrors.firstName && (
          <p className="text-sm text-rose-300" id="first-name-error">
            {formErrors.firstName}
          </p>
        )}
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-200">{fieldLabels.lastName}</span>
        <input
          aria-invalid={Boolean(formErrors.lastName)}
          aria-describedby={formErrors.lastName ? 'last-name-error' : undefined}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          name="lastName"
          type="text"
          value={formValues.lastName}
          onChange={onChange('lastName')}
        />
        {formErrors.lastName && (
          <p className="text-sm text-rose-300" id="last-name-error">
            {formErrors.lastName}
          </p>
        )}
      </label>
    </div>

    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-200">{fieldLabels.email}</span>
      <input
        aria-invalid={Boolean(formErrors.email)}
        aria-describedby={formErrors.email ? 'email-error' : undefined}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        name="email"
        type="email"
        value={formValues.email}
        onChange={onChange('email')}
      />
      {formErrors.email && (
        <p className="text-sm text-rose-300" id="email-error">
          {formErrors.email}
        </p>
      )}
    </label>

    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-200">{fieldLabels.phone}</span>
      <input
        aria-invalid={Boolean(formErrors.phone)}
        aria-describedby={formErrors.phone ? 'phone-error' : undefined}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        name="phone"
        type="tel"
        value={formValues.phone}
        onChange={onChange('phone')}
      />
      {formErrors.phone && (
        <p className="text-sm text-rose-300" id="phone-error">
          {formErrors.phone}
        </p>
      )}
    </label>

    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-200">{fieldLabels.address}</span>
      <input
        aria-invalid={Boolean(formErrors.address)}
        aria-describedby={formErrors.address ? 'address-error' : undefined}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        name="address"
        type="text"
        value={formValues.address}
        onChange={onChange('address')}
      />
      {formErrors.address && (
        <p className="text-sm text-rose-300" id="address-error">
          {formErrors.address}
        </p>
      )}
    </label>

    <div className="grid gap-5 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)]">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-200">{fieldLabels.plz}</span>
        <input
          aria-invalid={Boolean(formErrors.plz)}
          aria-describedby={formErrors.plz ? 'plz-error' : undefined}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          name="plz"
          type="text"
          value={formValues.plz}
          onChange={onChange('plz')}
        />
        {formErrors.plz && (
          <p className="text-sm text-rose-300" id="plz-error">
            {formErrors.plz}
          </p>
        )}
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-200">{fieldLabels.city}</span>
        <input
          aria-invalid={Boolean(formErrors.city)}
          aria-describedby={formErrors.city ? 'city-error' : undefined}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          name="city"
          type="text"
          value={formValues.city}
          onChange={onChange('city')}
        />
        {formErrors.city && (
          <p className="text-sm text-rose-300" id="city-error">
            {formErrors.city}
          </p>
        )}
      </label>
    </div>

    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-200">{fieldLabels.sailingClub}</span>
      <input
        aria-invalid={Boolean(formErrors.sailingClub)}
        aria-describedby={formErrors.sailingClub ? 'sailing-club-error' : undefined}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        name="sailingClub"
        type="text"
        value={formValues.sailingClub}
        onChange={onChange('sailingClub')}
      />
      {formErrors.sailingClub && (
        <p className="text-sm text-rose-300" id="sailing-club-error">
          {formErrors.sailingClub}
        </p>
      )}
    </label>

    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-200">{fieldLabels.boatNumber}</span>
      <input
        aria-invalid={Boolean(formErrors.boatNumber)}
        aria-describedby={formErrors.boatNumber ? 'boat-number-error' : undefined}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        name="boatNumber"
        type="text"
        value={formValues.boatNumber}
        onChange={onChange('boatNumber')}
      />
      {formErrors.boatNumber && (
        <p className="text-sm text-rose-300" id="boat-number-error">
          {formErrors.boatNumber}
        </p>
      )}
    </label>

    {submissionError && (
      <p
        aria-atomic="true"
        aria-live="assertive"
        className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
        role="alert"
      >
        {submissionError}
      </p>
    )}

    <div className="flex justify-end pt-3">
      <button
        className="inline-flex min-w-36 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </div>
  </form>
)
