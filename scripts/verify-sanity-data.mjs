import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

async function verifyData() {
  console.log('Fetching siteSettings documents from production...\n')

  const settings = await client.fetch(`*[_type == "siteSettings"] {
    _id,
    language,
    aboutPageTitle,
    programsPageTitle,
    communityPageTitle,
    servicesPageTitle,
    workWithUsPageTitle,
    contactPageTitle,
    venturesPageTitle
  }`)

  console.log(`Found ${settings.length} documents:\n`)

  settings.forEach(doc => {
    console.log(`Document ID: ${doc._id}`)
    console.log(`Language: ${doc.language}`)
    console.log(`About Title: ${doc.aboutPageTitle}`)
    console.log(`Programs Title: ${doc.programsPageTitle}`)
    console.log(`Community Title: ${doc.communityPageTitle}`)
    console.log(`Services Title: ${doc.servicesPageTitle}`)
    console.log(`Work With Us Title: ${doc.workWithUsPageTitle}`)
    console.log(`Contact Title: ${doc.contactPageTitle}`)
    console.log(`Ventures Title: ${doc.venturesPageTitle}`)
    console.log('---\n')
  })
}

verifyData().catch(console.error)
