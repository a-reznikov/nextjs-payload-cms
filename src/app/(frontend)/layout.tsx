import React from 'react'
import './styles.css'

import { Header } from '@/components/common/header/Header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-50 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
