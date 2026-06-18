import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { describe, expect, it } from 'vitest'

import RootLayout from '@/app/(frontend)/layout'

describe('Frontend header', () => {
  it('renders the branded header inside the frontend layout', async () => {
    const element = await RootLayout({
      children: React.createElement('div', null, 'Page body'),
    })

    const html = renderToStaticMarkup(element)

    expect(html).toContain('Swiss Class Association')
    expect(html).toContain('Regattas')
    expect(html).toContain('Reports')
    expect(html).toContain('Documents')
    expect(html).toContain('Board')
    expect(html).toContain('Forum ↗')
    expect(html).toContain('Register for class')
    expect(html).toContain('Page body')
  })
})
