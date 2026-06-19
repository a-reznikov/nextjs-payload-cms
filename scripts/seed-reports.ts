import 'dotenv/config'

import { seedReports } from '../src/seed/reports.js'

async function main() {
  await seedReports()
  console.log('Seeded reports successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
