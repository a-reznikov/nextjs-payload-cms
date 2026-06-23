import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { RegisterClassModal } from './components/register-class'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
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
                  Sailing registration
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {user ? `Welcome back, ${user.email}` : 'Register for your next class in minutes.'}
                </h1>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Open the registration modal from this page, send your details to the app API, and
              verify exactly what was submitted in the success state before you close the dialog.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <RegisterClassModal />
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                href={payloadConfig.routes.admin}
                rel="noopener noreferrer"
                target="_blank"
              >
                Go to admin panel
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                href="https://payloadcms.com/docs"
                rel="noopener noreferrer"
                target="_blank"
              >
                Documentation
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                  Step 1
                </p>
                <p className="mt-3 text-lg font-semibold text-white">Open the modal</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Launch the registration flow without leaving the home page.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                  Step 2
                </p>
                <p className="mt-3 text-lg font-semibold text-white">Submit details</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Fill in your class information and send it directly to the app API.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                  Step 3
                </p>
                <p className="mt-3 text-lg font-semibold text-white">Verify success</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Review the submitted values in the success state before closing the modal.
                </p>
              </div>
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
}
