import { getPayload } from 'payload'

import config from '@/payload.config'

export type SeedReport = {
  title: string
  date: string
  content: string
  image: string
}

export const reportsSeedData: SeedReport[] = [
  {
    title: 'Yacht Club Luzern',
    date: '2025-10-01',
    content: 'October coverage from the latest regatta on the lake.',
    image: '/images/placeholder.png',
  },
  {
    title: 'Yacht Club Torbelo',
    date: '2025-09-01',
    content: 'September highlights from the Torbelo sailing series.',
    image: '/images/placeholder.png',
  },
  {
    title: 'Bodensee Battle Yacht club Bregenz',
    date: '2025-08-01',
    content: 'August notes from the Bodensee battle weekend.',
    image: '/images/placeholder.png',
  },
]

export async function cleanupReports(): Promise<void> {
  const payload = await getPayload({ config: await config })

  for (const report of reportsSeedData) {
    await payload.delete({
      collection: 'reports',
      where: {
        title: {
          equals: report.title,
        },
      },
    })
  }
}

export async function seedReports(): Promise<void> {
  const payload = await getPayload({ config: await config })

  await cleanupReports()

  for (const report of reportsSeedData) {
    await payload.create({
      collection: 'reports',
      data: report,
    })
  }
}
