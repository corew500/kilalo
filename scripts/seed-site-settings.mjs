import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'ofg1uvc2',
  dataset: process.env.SANITY_DATASET || 'development',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-05-01',
  useCdn: false,
})

const englishSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings-en',
  language: 'en',

  // Navigation
  navHome: 'Home',
  navAbout: 'About',
  navPrograms: 'Programs',
  navServices: 'Services',
  navVentures: 'Ventures',
  navCommunity: 'Community',
  navWorkWithUs: 'Work With Us',
  navContact: 'Contact',
  signIn: 'Sign In',
  signUp: 'Sign Up',

  // Footer
  footerTagline: 'Building scalable businesses in the DRC',
  footerQuickLinks: 'Quick Links',
  footerLegal: 'Legal',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerConnect: 'Connect With Us',
  footerRights: 'All rights reserved.',

  // Common UI
  readMore: 'Read more',
  learnMore: 'Learn More',
  contactUs: 'Contact Us',
  applyNow: 'Apply Now',
  viewCaseStudy: 'View Case Study',
  readCaseStudy: 'Read Case Study',
  comingSoon: 'Coming soon',
  registerNow: 'Register Now',
  watchRecording: 'Watch Recording',

  // Homepage
  heroTitle: 'Scaling for-profit solutions to address poverty and hunger in the DRC',
  heroSubtitle: 'A venture studio helping Congolese entrepreneurs bring structure, clarity, and growth to their businesses through our proven Vision & Structure system.',
  heroCtaPrimary: 'Start with Free Assessment',
  heroCtaSecondary: 'Explore V2S Program',
  whatWeDoTitle: 'What We Do',
  whatWeDoSubtitle: 'Three ways we support Congolese entrepreneurs',
  programsTitle: 'Programs',
  programsDescription: '16-week V2S intensive and monthly Hekima Time webinars',
  programsCta: 'Explore Programs →',
  servicesTitle: 'Services',
  servicesDescription: 'Business structuring, strategy, and hands-on support',
  servicesCta: 'Explore Services →',
  communityTitle: 'Community',
  communityDescription: 'Network of entrepreneurs, free resources, and monthly events',
  communityCta: 'Join Community →',
  successStoriesTitle: 'Success Stories',
  successStoriesSubtitle: 'Congolese businesses creating measurable social and economic impact',
  venturesComingSoon: 'Featured ventures coming soon',
  viewAllVentures: 'View All Ventures →',
  howCanWeHelpTitle: 'How Can We Help?',
  howCanWeHelpSubtitle: 'Whether you\'re an entrepreneur, investor, or expert — there\'s a place for you',
  forEntrepreneursTitle: 'For Entrepreneurs',
  forEntrepreneursDescription: 'Ready to scale your business? Start with a free evaluation to see if V2S is right for you.',
  forEntrepreneursCta: 'Get Free Assessment',
  forPartnersTitle: 'For Partners & Investors',
  forPartnersDescription: 'Invest in impact. Explore partnership opportunities and co-investment models.',
  forPartnersCta: 'Explore Partnerships',
  forMentorsTitle: 'For Mentors & Experts',
  forMentorsDescription: 'Share your expertise. Contribute to V2S program or speak at Hekima Time.',
  forMentorsCta: 'Join Our Network',
}

const frenchSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings-fr',
  language: 'fr',

  // Navigation
  navHome: 'Accueil',
  navAbout: 'À propos',
  navPrograms: 'Programmes',
  navServices: 'Services',
  navVentures: 'Entreprises',
  navCommunity: 'Communauté',
  navWorkWithUs: 'Travailler Avec Nous',
  navContact: 'Contact',
  signIn: 'Se connecter',
  signUp: 'S\'inscrire',

  // Footer
  footerTagline: 'Construire des entreprises évolutives en RDC',
  footerQuickLinks: 'Liens Rapides',
  footerLegal: 'Légal',
  footerPrivacy: 'Politique de Confidentialité',
  footerTerms: 'Conditions d\'Utilisation',
  footerConnect: 'Connectez-vous Avec Nous',
  footerRights: 'Tous droits réservés.',

  // Common UI
  readMore: 'Lire la suite',
  learnMore: 'En savoir plus',
  contactUs: 'Nous Contacter',
  applyNow: 'Postuler Maintenant',
  viewCaseStudy: 'Voir l\'Étude de Cas',
  readCaseStudy: 'Lire l\'Étude de Cas',
  comingSoon: 'Bientôt disponible',
  registerNow: 'S\'inscrire Maintenant',
  watchRecording: 'Regarder l\'Enregistrement',

  // Homepage
  heroTitle: 'Développer des solutions à but lucratif pour lutter contre la pauvreté et la faim en RDC',
  heroSubtitle: 'Un studio de venture aidant les entrepreneurs congolais à apporter structure, clarté et croissance à leurs entreprises grâce à notre système Vision & Structure éprouvé.',
  heroCtaPrimary: 'Commencer avec une évaluation gratuite',
  heroCtaSecondary: 'Explorer le programme V2S',
  whatWeDoTitle: 'Ce que nous faisons',
  whatWeDoSubtitle: 'Trois façons dont nous soutenons les entrepreneurs congolais',
  programsTitle: 'Programmes',
  programsDescription: 'Programme intensif V2S de 16 semaines et webinaires mensuels Hekima Time',
  programsCta: 'Explorer les programmes →',
  servicesTitle: 'Services',
  servicesDescription: 'Structuration d\'entreprise, stratégie et soutien pratique',
  servicesCta: 'Explorer les services →',
  communityTitle: 'Communauté',
  communityDescription: 'Réseau d\'entrepreneurs, ressources gratuites et événements mensuels',
  communityCta: 'Rejoindre la communauté →',
  successStoriesTitle: 'Histoires de réussite',
  successStoriesSubtitle: 'Des entreprises congolaises créant un impact social et économique mesurable',
  venturesComingSoon: 'Entreprises en vedette à venir',
  viewAllVentures: 'Voir toutes les entreprises →',
  howCanWeHelpTitle: 'Comment pouvons-nous vous aider ?',
  howCanWeHelpSubtitle: 'Que vous soyez un entrepreneur, un investisseur ou un expert — il y a une place pour vous',
  forEntrepreneursTitle: 'Pour les entrepreneurs',
  forEntrepreneursDescription: 'Prêt à développer votre entreprise ? Commencez par une évaluation gratuite pour voir si V2S vous convient.',
  forEntrepreneursCta: 'Obtenir une évaluation gratuite',
  forPartnersTitle: 'Pour les partenaires et investisseurs',
  forPartnersDescription: 'Investir dans l\'impact. Explorer les opportunités de partenariat et les modèles de co-investissement.',
  forPartnersCta: 'Explorer les partenariats',
  forMentorsTitle: 'Pour les mentors et experts',
  forMentorsDescription: 'Partagez votre expertise. Contribuez au programme V2S ou intervenez lors de Hekima Time.',
  forMentorsCta: 'Rejoindre notre réseau',
}

async function seedSettings() {
  console.log('🌱 Seeding site settings...')

  try {
    console.log('Creating English site settings...')
    await client.createOrReplace(englishSettings)
    console.log('✅ English settings created')

    console.log('Creating French site settings...')
    await client.createOrReplace(frenchSettings)
    console.log('✅ French settings created')

    console.log('🎉 Site settings seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding settings:', error)
    process.exit(1)
  }
}

seedSettings()
