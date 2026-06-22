import { POST } from '@/app/api/register-class/route'

import { describe, it, expect } from 'vitest'

describe('API', () => {
  it('accepts a valid class registration', async () => {
    const request = new Request('http://localhost:3000/api/register-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Ava',
        lastName: 'Marin',
        email: 'ava@example.com',
        phone: '+41 79 555 10 20',
        address: 'Harbor Street 12',
        postalCode: '8001',
        city: 'Zurich',
        sailingClub: 'Lake Crew',
        boatNumber: 'SUI 7',
      }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe('success')
    expect(json.registration.email).toBe('ava@example.com')
    expect(json.registration.boatNumber).toBe('SUI 7')
  })

  it('rejects an incomplete class registration', async () => {
    const request = new Request('http://localhost:3000/api/register-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: '',
        lastName: 'Marin',
        email: 'wrong-email',
        phone: '',
        address: 'Harbor Street 12',
        postalCode: '',
        city: 'Zurich',
        sailingClub: '',
        boatNumber: '',
      }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.status).toBe('error')
    expect(json.fieldErrors.firstName).toBeDefined()
    expect(json.fieldErrors.email).toBeDefined()
    expect(json.fieldErrors.sailingClub).toBeDefined()
  })
})
