import { client } from '@/sanity/lib/client'

export async function getSiteSettings(locale: string) {
  const data = await client.fetch(
    `*[_type == "siteSettings" && language == $locale][0] {
      language,
      navHome,
      navAbout,
      navPrograms,
      navServices,
      navVentures,
      navCommunity,
      navWorkWithUs,
      navContact,
      signIn,
      signUp,
      footerTagline,
      footerQuickLinks,
      footerLegal,
      footerPrivacy,
      footerTerms,
      footerConnect,
      footerRights,
      readMore,
      learnMore,
      contactUs,
      applyNow,
      viewCaseStudy,
      readCaseStudy,
      comingSoon,
      registerNow,
      watchRecording,
      heroTitle,
      heroSubtitle,
      ourStory,
      v2sApproach,
      mission,
      vision,
      whatsapp,
      email,
      emailPartnerships,
      addressGoma,
      addressKinshasa,
      linkedin,
      twitter,
      instagram,
      facebook
    }`,
    { locale }
  )

  return data
}
