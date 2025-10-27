/**
 * Complete French translations for remaining content
 * Run with: npx sanity exec sanity/migrations/translateRemaining.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const TEAM_MEMBER_TRANSLATIONS = {
  'c46ab810-bcce-434d-aa92-53b671c1b419': {
    roleFr: 'Fondateur',
    bioFr: `Butoto Mahinduzi est un entrepreneur et investisseur basé en République Démocratique du Congo. Il a dirigé des investissements dans 13 petites entreprises dans l'est du Congo, principalement dans l'alimentation et l'agriculture, notamment Café Kivu et Grenaldi Food. Il a également été l'un des premiers investisseurs dans Nuru, aujourd'hui la plus grande entreprise soutenue par du capital-risque en RDC.

Avant de fonder Kilalo, Butoto a occupé le poste de Directeur des Opérations pour une entreprise alimentaire internationale, supervisant les opérations nationales en RDC.

Aujourd'hui, Butoto dirige Kilalo, une entreprise qui combine capital-risque et accélération d'entreprise pour soutenir des entreprises prometteuses dans l'alimentation et l'agriculture au Congo. Kilalo est conçu pour fournir du capital patient et des systèmes opérationnels, aidant les petites et moyennes entreprises à croître de manière responsable et durable.`,
    expertiseFr: ['Capital-risque', 'Agriculture', 'Opérations', 'Stratégie commerciale'],
  },
}

const CASE_STUDY_TRANSLATIONS = {
  'case-study-coproad': {
    titleFr: 'Coproad — Renforcer la Vision et Stimuler la Croissance dans l\'Est de la RDC',
  },
  'case-study-nnp': {
    titleFr: 'NNP_DRC — Amplifier les Voix à Travers les Médias et la Narration',
  },
}

async function translateRemaining() {
  console.log('🚀 Adding remaining French translations...\n')

  // Team Members
  console.log('👥 Translating Team Members...')
  for (const [id, translations] of Object.entries(TEAM_MEMBER_TRANSLATIONS)) {
    await client.patch(id).set(translations).commit()
    console.log(`  ✓ ${id}`)
  }

  // Case Studies (titles only - content needs manual translation)
  console.log('\n📚 Translating Case Study Titles...')
  for (const [id, translations] of Object.entries(CASE_STUDY_TRANSLATIONS)) {
    await client.patch(id).set(translations).commit()
    console.log(`  ✓ ${id}`)
  }

  console.log('\n✅ All remaining translations added!')
  console.log('\n📝 Note: Case Study detailed content (challenge, partnership, impact, etc.) should be added manually in Studio')
}

translateRemaining()
  .catch((err) => {
    console.error('❌ Translation failed:', err)
    process.exit(1)
  })
