import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import { Home } from '@/components/home/Home'
import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <Home
      adminRoute={payloadConfig.routes.admin}
      fileURL={fileURL}
      heading={user ? `Welcome back, ${user.email}` : 'Welcome to your new project.'}
    />
  )
}
