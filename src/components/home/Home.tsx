import React from 'react'

import { RegisterForClass } from './components/register-for-class/RegisterForClass'

type Props = {
  adminRoute: string
  fileURL: string
  heading: string
}

export const Home: React.FC<Props> = ({ adminRoute, fileURL, heading }) => (
  <section className="relative isolate overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
    />

    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
      <div className="flex flex-1 items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-cyan-500/10 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Payload CMS starter
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              alt="Payload Logo"
              className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-cyan-500/10"
              height={64}
              src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg"
              width={64}
            />

            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
                Public frontend
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {heading}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            The public page now uses Tailwind utilities for the layout, buttons, spacing, and visual
            treatment while keeping the Payload auth state and admin link intact.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <RegisterForClass />
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-cyan-400/95 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              href={adminRoute}
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to admin panel
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              href="https://payloadcms.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Update this page by editing</p>
        <a
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200 transition hover:bg-white/10"
          href={fileURL}
        >
          <code className="font-mono text-xs">app/(frontend)/page.tsx</code>
        </a>
      </footer>
    </main>
  </section>
)
