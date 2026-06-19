import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'

type ReportDoc = {
  id: number
  title: string
  date: string
  content: string
  image: string
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
})

function formatReportDate(date: string) {
  return dateFormatter.format(new Date(date))
}

function ReportCard({
  report,
  variant,
}: {
  report: ReportDoc
  variant: 'featured' | 'split' | 'splitReverse'
}) {
  const imageSrc = report.image || '/images/placeholder.png'
  const sharedCard =
    'rounded-[34px] border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_20px_80px_rgba(15,23,42,0.15)] sm:p-5 lg:p-6'

  if (variant === 'featured') {
    return (
      <article className={`${sharedCard} lg:h-full lg:p-6`}>
        <div className="flex h-full flex-col">
          <div className="overflow-hidden rounded-[28px] bg-slate-100">
            <img
              alt={report.title}
              className="aspect-[16/11] h-full w-full object-cover sm:aspect-[16/10] lg:aspect-[16/10]"
              src={imageSrc}
            />
          </div>
          <div className="flex flex-1 flex-col justify-end px-2 py-5 sm:px-3 sm:py-6 lg:px-2 lg:py-8">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              {report.title}
            </h2>
            <p className="mt-4 text-2xl leading-tight text-slate-700 sm:text-[2rem]">
              {formatReportDate(report.date)}
            </p>
          </div>
        </div>
      </article>
    )
  }

  const reverseLayout = variant === 'splitReverse'

  return (
    <article className={`${sharedCard} overflow-hidden`}>
      <div
        className={`flex h-full flex-col gap-5 lg:items-center ${reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
      >
        <div className="w-full overflow-hidden rounded-[24px] bg-slate-100 lg:w-[56%]">
          <img
            alt={report.title}
            className="aspect-[16/11] h-full w-full object-cover"
            src={imageSrc}
          />
        </div>

        <div className="flex w-full flex-1 flex-col justify-center px-1 py-1 sm:px-2 lg:w-[44%] lg:px-3">
          <h2 className="max-w-[12ch] text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.6rem] sm:leading-[1.05]">
            {report.title}
          </h2>
          <p className="mt-4 text-2xl leading-tight text-slate-700 sm:text-[2rem]">
            {formatReportDate(report.date)}
          </p>
        </div>
      </div>
    </article>
  )
}

export default async function ReportsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const reportsResult = await payload.find({
    collection: 'reports',
    depth: 0,
    limit: 3,
    pagination: false,
    sort: '-date',
  })
  const reports = reportsResult.docs as ReportDoc[]

  return (
    <section className="min-h-screen bg-black px-4 py-4 text-slate-950 sm:px-6 sm:py-6">
      <div className="mx-auto grid w-full max-w-[1650px] gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
        {reports[0] ? (
          <div className="lg:row-span-2">
            <ReportCard report={reports[0]} variant="featured" />
          </div>
        ) : null}

        {reports[1] ? <ReportCard report={reports[1]} variant="split" /> : null}

        {reports[2] ? <ReportCard report={reports[2]} variant="splitReverse" /> : null}
      </div>
    </section>
  )
}
