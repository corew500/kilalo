import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { siteConfig } from '@/lib/seo'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description.en,
    sameAs: [
      siteConfig.social.linkedin,
      `https://twitter.com/${siteConfig.social.twitter.replace('@', '')}`,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Goma',
      addressRegion: 'Nord-Kivu',
      addressCountry: 'CD',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-teal focus:text-white focus:px-4 focus:py-2 focus:top-4 focus:left-4 focus:rounded"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
