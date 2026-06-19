import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const metadata = {
  description: 'Reports listing powered by Payload CMS.',
  title: 'Reports | Payload CMS',
}

export default async function ReportsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { docs: reports } = await payload.find({
    collection: 'reports',
    limit: 3,
    sort: '-date',
  })

  const displayYear = reports[0]
    ? new Date(reports[0].date).getFullYear()
    : new Date().getFullYear()
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_30%)]"
      />

      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <p className="text-4xl font-black tracking-[-0.08em] text-slate-900/85 sm:text-5xl">
            {displayYear}
          </p>
          <a
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            href="/"
          >
            Home
          </a>
        </header>

        {reports.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2 lg:grid-rows-2 xl:gap-6">
            {reports.map((report, index) => {
              const isFeatured = index === 0
              const isReverse = index === 2
              const formattedDate = dateFormatter.format(new Date(report.date))
              const cardClassName = [
                'overflow-hidden rounded-[2rem] bg-white p-4 text-slate-900 shadow-[0_0_0_1px_rgba(15,23,42,0.08)] sm:p-6',
                isFeatured ? 'lg:row-span-2' : 'lg:min-h-[320px]',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <article key={report.id} className={cardClassName}>
                  <div
                    className={[
                      'flex h-full flex-col gap-5',
                      isFeatured ? 'h-full' : 'lg:flex-row lg:items-center',
                      isReverse ? 'lg:flex-row-reverse' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div
                      className={[
                        'overflow-hidden rounded-[1.5rem] bg-slate-100',
                        isFeatured
                          ? 'aspect-[4/3] w-full lg:aspect-auto lg:min-h-[520px]'
                          : 'aspect-[16/10] lg:w-[52%] lg:flex-shrink-0 lg:aspect-auto',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <img
                        alt={report.title}
                        className="h-full w-full object-cover"
                        src={report.image}
                      />
                    </div>

                    <div
                      className={[
                        'flex flex-1 flex-col justify-end px-1 pb-1',
                        !isFeatured ? 'lg:px-4 lg:pb-4' : 'pt-1',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <h2
                        className={[
                          'max-w-xl font-semibold tracking-[-0.05em] text-slate-900',
                          isFeatured
                            ? 'text-3xl leading-[1.05] sm:text-4xl'
                            : 'text-2xl leading-tight sm:text-[2rem]',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {report.title}
                      </h2>
                      <p className="mt-3 text-xl leading-none text-slate-700 sm:text-2xl">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white p-8 text-slate-900">
            <p className="text-2xl font-semibold">No reports yet.</p>
          </div>
        )}
      </main>
    </section>
  )
}
