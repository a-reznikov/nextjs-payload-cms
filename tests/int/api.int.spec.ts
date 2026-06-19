import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { cleanupReports, seedReports, reportsSeedData } from '../helpers/seedReports'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    await seedReports()

    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    await cleanupReports()
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('fetches reports', async () => {
    const reports = await payload.find({
      collection: 'reports',
      limit: 3,
      sort: '-date',
    })

    expect(reports.docs).toHaveLength(reportsSeedData.length)
    expect(reports.docs[0]?.title).toBe(reportsSeedData[0].title)
  })
})
