/**
 * Add French translations to all content
 * Run with: npx sanity exec sanity/migrations/addFrenchTranslations.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const VENTURE_TRANSLATIONS = {
  'venture-butasoya': {
    nameFr: 'Butasoya',
    taglineFr: 'Réinventer la consommation de soja',
    descriptionFr: 'Produits alimentaires et boissons à base de soja adaptés localement, avec une image de marque forte et des campagnes d\'éducation communautaire sur les bienfaits nutritionnels. A atteint plus de 5 000 consommateurs avec 8 gammes de produits.',
    metricsHighlightFr: 'Plus de 5 000 consommateurs atteints',
  },
  'venture-coproad': {
    nameFr: 'Coproad',
    taglineFr: 'Renforcer les coopératives de producteurs de cacao',
    descriptionFr: 'Coopérative de producteurs établie avec certification de qualité, pouvoir de négociation collective et relations directes avec les fabricants de chocolat équitable. A organisé 180 agriculteurs et réalisé une augmentation de prix de 40%.',
    metricsHighlightFr: 'Augmentation de prix de 40% pour les agriculteurs',
  },
  'venture-justice-bot': {
    nameFr: 'Justice Bot',
    taglineFr: 'Accès juridique alimenté par l\'IA',
    descriptionFr: 'Chatbot alimenté par l\'IA fournissant des informations juridiques en français et en swahili, guidant les utilisateurs à travers les processus juridiques courants et les mettant en relation avec des services d\'aide juridique. A servi plus de 10 000 utilisateurs avec une note de satisfaction de 4,5/5.',
    metricsHighlightFr: 'Plus de 10 000 utilisateurs servis',
  },
  'venture-nnp': {
    nameFr: 'NNP_DRC',
    taglineFr: 'Narration multimédia pour la croissance des entreprises',
    descriptionFr: 'Studio de contenu multimédia spécialisé dans la narration authentique pour les entreprises congolaises à travers la vidéo, la photographie et le contenu des médias sociaux. A réalisé une croissance des revenus de 3x en 12 mois.',
    metricsHighlightFr: 'Croissance des revenus de 3x',
  },
  'venture-provapac': {
    nameFr: 'Provapac Agro-Food',
    taglineFr: 'Renforcer les chaînes d\'approvisionnement alimentaire locales',
    descriptionFr: 'Développement d\'une chaîne d\'approvisionnement intégrée reliant les agriculteurs aux transformateurs et détaillants, avec infrastructure de stockage frigorifique et systèmes de contrôle qualité. A augmenté le revenu des agriculteurs de 45% et réduit les pertes après récolte de 60%.',
    metricsHighlightFr: 'Augmentation de 45% du revenu des agriculteurs',
  },
}

const EVENT_TRANSLATIONS = {
  'hekima-nov-2024': {
    titleFr: 'Introduction à la Stratégie Commerciale',
    descriptionFr: 'Session inaugurale présentant le programme Hekima Time et couvrant les fondamentaux de la réflexion stratégique pour les entrepreneurs congolais.',
  },
  'hekima-dec-2024': {
    titleFr: 'Étude de Marché et Validation Client',
    descriptionFr: 'Apprendre des méthodes pratiques pour comprendre votre marché, valider les besoins des clients et affiner votre proposition de valeur.',
  },
  'hekima-jan-2025': {
    titleFr: 'Modélisation Financière pour les Startups',
    descriptionFr: 'Modélisation financière pratique et prévisions adaptées au contexte congolais, incluant les revenus, les coûts et les projections de trésorerie.',
  },
  'hekima-feb-2025': {
    titleFr: 'Stratégies de Croissance Évolutives',
    descriptionFr: 'Explorer les stratégies pour faire évoluer votre entreprise de manière durable, de l\'embauche à la croissance des revenus et à l\'expansion du marché.',
  },
}

const PROGRAM_TRANSLATIONS = {
  'v2s-program': {
    nameFr: 'Programme V2S',
    shortDescriptionFr: 'Intensif de 16 semaines transformant les idées en entreprises structurées et investissables',
  },
  'hekima-time': {
    nameFr: 'Hekima Time',
    shortDescriptionFr: 'Webinaires mensuels gratuits sur des sujets de stratégie commerciale pour les entrepreneurs congolais',
  },
}

async function addTranslations() {
  console.log('🚀 Adding French translations...\n')

  // Ventures
  console.log('📦 Translating Ventures...')
  for (const [id, translations] of Object.entries(VENTURE_TRANSLATIONS)) {
    await client.patch(id).set(translations).commit()
    console.log(`  ✓ ${id}`)
  }

  // Events
  console.log('\n📅 Translating Events...')
  for (const [id, translations] of Object.entries(EVENT_TRANSLATIONS)) {
    await client.patch(id).set(translations).commit()
    console.log(`  ✓ ${id}`)
  }

  // Programs
  console.log('\n🎓 Translating Programs...')
  for (const [id, translations] of Object.entries(PROGRAM_TRANSLATIONS)) {
    await client.patch(id).set(translations).commit()
    console.log(`  ✓ ${id}`)
  }

  console.log('\n✅ All French translations added!')
  console.log('\n📝 Note: Case Studies and Team Members need manual translation in Studio')
}

addTranslations()
  .catch((err) => {
    console.error('❌ Translation failed:', err)
    process.exit(1)
  })
