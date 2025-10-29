import { client } from '../sanity/lib/client.js'

async function checkSettings() {
  console.log(`Checking dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`)

  const settings = await client.fetch(`*[_type == "siteSettings"] {
    _id,
    _createdAt,
    _updatedAt,
    language
  } | order(_createdAt asc)`)

  console.log(`Found ${settings.length} Site Settings documents:\n`)

  settings.forEach((doc, index) => {
    console.log(`${index + 1}. ID: ${doc._id}`)
    console.log(`   Language: ${doc.language || 'MISSING'}`)
    console.log(`   Created: ${new Date(doc._createdAt).toLocaleString()}`)
    console.log(`   Updated: ${new Date(doc._updatedAt).toLocaleString()}`)
    console.log('')
  })

  if (settings.length > 2) {
    console.log('⚠️  WARNING: More than 2 documents found!')
    console.log('You should keep only siteSettings-en and siteSettings-fr\n')
  } else if (settings.length === 2) {
    console.log('✅ Correct: 2 documents (EN and FR)')
  }
}

checkSettings().catch(console.error)
