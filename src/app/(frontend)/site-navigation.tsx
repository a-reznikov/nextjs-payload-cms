'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/reports', label: 'Reports' },
]

export function SiteNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/80 p-1 text-sm shadow-2xl shadow-black/25 backdrop-blur md:right-6 md:top-6">
      {links.map((link) => {
        const active =
          link.href === '/'
            ? pathname === '/'
            : pathname === link.href || pathname.startsWith(`${link.href}/`)

        return (
          <Link
            key={link.href}
            className={`rounded-full px-4 py-2 transition ${
              active ? 'bg-white text-slate-950' : 'text-slate-200 hover:bg-white/10'
            }`}
            href={link.href}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
