import { createClient } from '@sanity/client'

const projectId = 'rpyau5fm'
const dataset = 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || ''

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function listSettings() {
  console.log('Fetching all Site Settings documents...\n')

  const settings = await client.fetch(`*[_type == "siteSettings"] {
    _id,
    _createdAt,
    _updatedAt,
    language,
    "fieldCount": count(*)
  } | order(_createdAt asc)`)

  console.log(`Found ${settings.length} documents:\n`)

  settings.forEach((doc, index) => {
    console.log(`${index + 1}. Document ID: ${doc._id}`)
    console.log(`   Language: ${doc.language}`)
    console.log(`   Created: ${new Date(doc._createdAt).toLocaleString()}`)
    console.log(`   Updated: ${new Date(doc._updatedAt).toLocaleString()}`)
    console.log('')
  })

  console.log('\n✅ KEEP these documents:')
  console.log('   - siteSettings-en (English)')
  console.log('   - siteSettings-fr (French)\n')

  console.log('❌ DELETE any others (drafts or duplicates)\n')
}

listSettings().catch(console.error)
