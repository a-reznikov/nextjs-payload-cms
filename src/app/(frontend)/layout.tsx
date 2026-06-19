import React from 'react'
import './styles.css'
import { SiteNavigation } from './site-navigation'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <SiteNavigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
