/**
 * Migration script to convert old single-language fields to new EN/FR fields
 * Run with: npx sanity exec sanity/migrations/migrateVentureFields.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const OLD_TO_NEW_FIELDS = {
  name: 'nameEn',
  description: 'descriptionEn',
  tagline: 'taglineEn',
  metricsHighlight: 'metricsHighlightEn',
}

async function migrateVentures() {
  // Fetch all venture documents
  const ventures = await client.fetch('*[_type == "venture"]')

  console.log(`Found ${ventures.length} venture documents to migrate`)

  for (const venture of ventures) {
    const patches: any = {}
    let needsUpdate = false

    // Check for old field names and prepare patches
    for (const [oldField, newField] of Object.entries(OLD_TO_NEW_FIELDS)) {
      if (venture[oldField] && !venture[newField]) {
        patches[newField] = venture[oldField]
        needsUpdate = true
        console.log(`  - ${venture._id}: Migrating ${oldField} -> ${newField}`)
      }
    }

    if (needsUpdate) {
      // Update the document with new fields
      await client
        .patch(venture._id)
        .set(patches)
        .commit()

      console.log(`  ✓ Updated ${venture._id}`)

      // Unset old fields
      await client
        .patch(venture._id)
        .unset(Object.keys(OLD_TO_NEW_FIELDS))
        .commit()

      console.log(`  ✓ Removed old fields from ${venture._id}`)
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('\nNext steps:')
  console.log('1. Go to Sanity Studio')
  console.log('2. Add French translations for each venture')
  console.log('3. Verify all data looks correct')
}

migrateVentures()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
