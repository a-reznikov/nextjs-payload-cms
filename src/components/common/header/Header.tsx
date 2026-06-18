import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type NavItem = {
  href: string
  label: string
  showArrow?: boolean
}

const navItems: NavItem[] = [
  { href: '/regattas', label: 'Regattas' },
  { href: '/reports', label: 'Reports' },
  { href: '/documents', label: 'Documents' },
  { href: '/board', label: 'Board' },
  { href: '/forum', label: 'Forum', showArrow: true },
]

export const Header: React.FC = () => (
  <header className="border-b border-white/10 bg-[#0b1f33]/95 shadow-[0_1px_0_rgba(255,255,255,0.03),0_12px_32px_rgba(2,6,23,0.35)] backdrop-blur">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <Link className="inline-flex shrink-0 items-center" href="/" aria-label="Swiss Class Association home">
        <Image
          alt="Swiss Class Association"
          className="h-14 w-auto sm:h-16"
          height={64}
          priority
          src="/icons/logo.svg"
          width={196}
        />
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        <nav aria-label="Primary" className="flex-1">
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm font-semibold text-white/90 lg:justify-center">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  className="inline-flex items-center gap-1 transition hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                  href={item.href}
                >
                  <span>{item.label}</span>
                  {item.showArrow && <span aria-hidden="true">↗</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          className="inline-flex items-center justify-center rounded-full bg-[#0f8fbf] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,143,191,0.28)] transition hover:bg-[#16a3d5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 lg:min-w-[198px]"
          href="/register"
        >
          Register for class
        </Link>
      </div>
    </div>
  </header>
)
