import React from 'react'

import { fieldLabels } from '../../constants'
import type { Submission } from '../../types'

type Props = {
  submission: Submission
}

export const RegisterForClassSuccess: React.FC<Props> = ({ submission }) => (
  <div className="mt-8 space-y-6">
    <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
      <h3 className="text-xl font-semibold text-emerald-200">Registration submitted</h3>
      <p className="mt-2 text-sm leading-6 text-emerald-50/90">
        We received the following details.
      </p>
    </div>

    <dl className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
      {(Object.entries(submission) as Array<[keyof Submission, string]>).map(([field, value]) => (
        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4" key={field}>
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            {fieldLabels[field]}
          </dt>
          <dd className="mt-2 text-sm text-slate-100">{value || 'Not provided'}</dd>
        </div>
      ))}
    </dl>
  </div>
)
