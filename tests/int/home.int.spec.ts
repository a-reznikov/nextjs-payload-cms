import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Home } from '@/components/home/Home'

describe('homepage', () => {
  it('shows a register for class entry point', () => {
    const markup = renderToStaticMarkup(
      React.createElement(Home, {
        adminRoute: '/admin',
        fileURL: 'vscode://file/app/(frontend)/page.tsx',
      }),
    )

    expect(markup).toContain('Register for class')
  })
})
