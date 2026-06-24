import { getPayload, Payload } from 'payload'
import { NextRequest } from 'next/server'
import config from '@/payload.config'
import { POST as registerForClass } from '@/app/api/register-for-class/route'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API payload access', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})

describe('API register for class route', () => {
  it('accepts a valid register for class submission', async () => {
    const request = new NextRequest('http://localhost:3000/api/register-for-class', {
      body: JSON.stringify({
        firstName: 'Aliaksandr',
        lastName: 'Reznikau',
        email: 'aliaksandr@example.com',
        phone: '+375291112233',
        address: '123 Windward Ave',
        plz: '220004',
        city: 'Minsk',
        sailingClub: 'Sea Breeze Club',
        boatNumber: 'SUI 100',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })

    const response = await registerForClass(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: {
        firstName: 'Aliaksandr',
        lastName: 'Reznikau',
        email: 'aliaksandr@example.com',
        phone: '+375291112233',
        address: '123 Windward Ave',
        plz: '220004',
        city: 'Minsk',
        sailingClub: 'Sea Breeze Club',
        boatNumber: 'SUI 100',
      },
    })
  })

  it('rejects a register for class submission when required data is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/register-for-class', {
      body: JSON.stringify({
        firstName: '',
        lastName: 'Reznikau',
        email: 'aliaksandr@example.com',
        phone: '+375291112233',
        address: '123 Windward Ave',
        plz: '220004',
        city: 'Minsk',
        sailingClub: '',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })

    const response = await registerForClass(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Please correct the highlighted fields.',
      fieldErrors: {
        firstName: 'This field is required.',
        sailingClub: 'This field is required.',
      },
    })
  })

  it('accepts an empty optional boat number', async () => {
    const request = new NextRequest('http://localhost:3000/api/register-for-class', {
      body: JSON.stringify({
        firstName: 'Aliaksandr',
        lastName: 'Reznikau',
        email: 'aliaksandr@example.com',
        phone: '+375291112233',
        address: '123 Windward Ave',
        plz: '220004',
        city: 'Minsk',
        sailingClub: 'Sea Breeze Club',
        boatNumber: '',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })

    const response = await registerForClass(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: {
        firstName: 'Aliaksandr',
        lastName: 'Reznikau',
        email: 'aliaksandr@example.com',
        phone: '+375291112233',
        address: '123 Windward Ave',
        plz: '220004',
        city: 'Minsk',
        sailingClub: 'Sea Breeze Club',
      },
    })
  })
})
