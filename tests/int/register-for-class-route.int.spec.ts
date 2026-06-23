import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/register-for-class/route'

const validPayload = {
  firstName: ' Ada ',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '123456789',
  address: ' Main Street 1 ',
  plz: '8000',
  city: 'Zurich',
  sailingClub: 'Lake Club',
}

describe('register-for-class route', () => {
  it('returns sanitized submission data for a valid payload', async () => {
    const request = new Request('http://localhost:3000/api/register-for-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validPayload),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      submission: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '123456789',
        address: 'Main Street 1',
        plz: '8000',
        city: 'Zurich',
        sailingClub: 'Lake Club',
      },
    })
  })

  it('returns a 400 error when a required field is missing', async () => {
    const request = new Request('http://localhost:3000/api/register-for-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validPayload,
        city: '   ',
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      success: false,
      error: 'Missing required fields',
      fields: ['city'],
    })
  })

  it('returns a 400 error when a required field is not a string', async () => {
    const request = new Request('http://localhost:3000/api/register-for-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validPayload,
        phone: 123,
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      success: false,
      error: 'Missing required fields',
      fields: ['phone'],
    })
  })
})
