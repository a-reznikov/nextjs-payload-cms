import Link from 'next/link'
import React from 'react'

type Props = Record<string, never>

const navigationItems = [
  { label: 'Regattas', href: '#regattas' },
  { label: 'Reports', href: '#reports' },
  { label: 'Documents', href: '#documents' },
  { label: 'Board', href: '#board' },
  { label: 'Forum ↗', href: '#forum' },
]

export const SiteHeader: React.FC<Props> = () => {
  return (
    <header className="relative z-10 border-b border-white/5 bg-[#08192c] text-white shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex h-[124px] w-full max-w-[1600px] items-center justify-between gap-8 px-6 py-4 sm:px-8 lg:px-12">
        <Link className="shrink-0" href="/" aria-label="Swiss Class Association home">
          <img
            alt="Swiss Class Association"
            className="block h-auto w-[240px] max-w-none"
            height={72}
            src="/icons/logo.svg"
            width={240}
          />
        </Link>

        <nav aria-label="Primary" className="flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-10 xl:gap-14">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  className="text-[19px] font-semibold tracking-[-0.01em] text-white/90 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-cyan-300"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1493C8] px-6 py-3 text-[20px] font-semibold tracking-[-0.01em] text-white shadow-[0_10px_30px_rgba(20,147,200,0.25)] transition hover:bg-[#1aa3da] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          href="#register"
        >
          Register for class
        </Link>
      </div>
    </header>
  )
}
