import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/class-registration/route'

describe('class registration api', () => {
  it('returns normalized form data when the request is valid', async () => {
    const request = new Request('http://localhost:3000/api/class-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: ' Jane ',
        lastName: ' Doe ',
        email: ' jane@example.com ',
        phone: ' +123456789 ',
        address: ' 123 Harbor Street ',
        plz: ' 8000 ',
        city: ' Zurich ',
        sailingClub: ' Lake Club ',
        boatNumber: ' SUI 42 ',
      }),
    })

    const response = await POST(request)
    const body = (await response.json()) as {
      data: {
        firstName: string
        boatNumber: string
      }
    }

    expect(response.status).toBe(200)
    expect(body.data.firstName).toBe('Jane')
    expect(body.data.boatNumber).toBe('SUI 42')
  })

  it('rejects requests when a required field is missing', async () => {
    const request = new Request('http://localhost:3000/api/class-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: '',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '+123456789',
        address: '123 Harbor Street',
        plz: '8000',
        city: 'Zurich',
        sailingClub: 'Lake Club',
        boatNumber: '',
      }),
    })

    const response = await POST(request)
    const body = (await response.json()) as { error: string }

    expect(response.status).toBe(400)
    expect(body.error).toBe('First name is required.')
  })
})
