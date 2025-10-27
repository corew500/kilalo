/**
 * Migration script to convert all old single-language fields to new EN/FR fields
 * Run with: npx sanity exec sanity/migrations/migrateAllFields.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const MIGRATIONS = {
  venture: {
    name: 'nameEn',
    description: 'descriptionEn',
    tagline: 'taglineEn',
    metricsHighlight: 'metricsHighlightEn',
  },
  event: {
    title: 'titleEn',
    description: 'descriptionEn',
  },
  post: {
    title: 'titleEn',
    excerpt: 'excerptEn',
    content: 'contentEn',
  },
  program: {
    name: 'nameEn',
    shortDescription: 'shortDescriptionEn',
    fullDescription: 'fullDescriptionEn',
  },
  caseStudy: {
    title: 'titleEn',
  },
  teamMember: {
    role: 'roleEn',
    bio: 'bioEn',
    expertise: 'expertiseEn',
  },
}

async function migrateDocuments(docType: string, fieldMap: Record<string, string>) {
  const docs = await client.fetch(`*[_type == "${docType}"]`)

  console.log(`\n📦 Migrating ${docs.length} ${docType} documents...`)

  for (const doc of docs) {
    const patches: any = {}
    let needsUpdate = false

    // Check for old field names and prepare patches
    for (const [oldField, newField] of Object.entries(fieldMap)) {
      if (doc[oldField] !== undefined && !doc[newField]) {
        patches[newField] = doc[oldField]
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      // Update the document with new fields
      await client.patch(doc._id).set(patches).commit()

      console.log(`  ✓ Updated ${doc._id}`)

      // Unset old fields
      await client.patch(doc._id).unset(Object.keys(fieldMap)).commit()

      console.log(`  ✓ Removed old fields from ${doc._id}`)
    } else {
      console.log(`  ⊘ ${doc._id} already migrated or has no old fields`)
    }
  }
}

async function migrateAll() {
  console.log('🚀 Starting migration of all content types...')

  for (const [docType, fieldMap] of Object.entries(MIGRATIONS)) {
    try {
      await migrateDocuments(docType, fieldMap)
    } catch (err) {
      console.error(`❌ Failed to migrate ${docType}:`, err)
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Go to Sanity Studio')
  console.log('2. Add French translations for all migrated content')
  console.log('3. Review each document type to verify data integrity')
}

migrateAll()
  .catch((err) => {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  })
