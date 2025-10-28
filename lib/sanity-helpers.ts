import { client } from '@/sanity/lib/client'

export async function getSiteSettings(locale: string) {
  const settings = await client.fetch(`*[_type == "siteSettings" && language == $locale][0]`, {
    locale,
  })
  return settings
}
