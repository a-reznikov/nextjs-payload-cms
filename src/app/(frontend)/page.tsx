import React from 'react'
import Link from 'next/link'

export const metadata = {
  description: 'Payload CMS starter page with a link to the reports listing.',
  title: 'Payload Blank Template',
}

export default async function HomePage() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_30%)]"
      />

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex flex-1 items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              Public frontend
            </p>

            <div className="mt-8 space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Welcome to your new project.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                The reports listing now lives on its own page so the home screen stays simple and
                the content has a clear route of its own.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                href="/reports"
              >
                Go to reports
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                href="/admin"
              >
                Go to admin panel
              </a>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 pt-6 text-sm text-slate-400">
          Reports are available on the dedicated page at{' '}
          <Link className="text-cyan-300 underline underline-offset-4" href="/reports">
            /reports
          </Link>
          .
        </footer>
      </main>
    </section>
  )
}
