import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config.js'

type SeedReport = {
  title: string
  date: string
  content: string
  image: string
}

const reports: SeedReport[] = [
  {
    title: 'Yacht Club Luzern',
    date: '2025-10-01T00:00:00.000Z',
    content: 'October report for the Luzern club.',
    image: '/images/placeholder.png',
  },
  {
    title: 'Yacht Club Torbelo',
    date: '2025-09-01T00:00:00.000Z',
    content: 'September report for Torbelo.',
    image: '/images/placeholder.png',
  },
  {
    title: 'Bodensee Battle Yacht club Bregenz',
    date: '2025-08-01T00:00:00.000Z',
    content: 'August report for the Bregenz race.',
    image: '/images/placeholder.png',
  },
]

async function seedReports() {
  const payload = await getPayload({ config })

  for (const report of reports) {
    const existing = await payload.find({
      collection: 'reports',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        title: {
          equals: report.title,
        },
      },
    })

    const existingReport = existing.docs[0]

    if (existingReport) {
      await payload.update({
        collection: 'reports',
        id: existingReport.id,
        data: report,
      })
      continue
    }

    await payload.create({
      collection: 'reports',
      data: report,
    })
  }
}

seedReports()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seeded reports collection.')
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exitCode = 1
  })
