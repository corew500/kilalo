import { createClient } from '@sanity/client'

const projectId = 'rpyau5fm'
const dataset = 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || ''

if (!token) {
  console.error('Error: SANITY_API_WRITE_TOKEN environment variable is required')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function deleteAllSettings() {
  console.log('Fetching all Site Settings documents...\n')

  const settings = await client.fetch(`*[_type == "siteSettings"] {
    _id
  }`)

  console.log(`Found ${settings.length} documents to delete\n`)

  for (const doc of settings) {
    console.log(`Deleting ${doc._id}...`)
    await client.delete(doc._id)
  }

  console.log('\n✅ All Site Settings documents deleted')
  console.log('Now you can import fresh data with the NDJSON file\n')
}

deleteAllSettings().catch(console.error)
