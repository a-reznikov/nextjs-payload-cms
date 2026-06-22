import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Register for your next sailing class from the public homepage.',
  title: 'Register for Class | Payload Demo',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
