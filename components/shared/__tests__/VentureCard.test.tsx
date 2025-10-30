import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VentureCard } from '../VentureCard'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      readCaseStudy: 'Read Case Study',
      learnMore: 'Learn More',
    }
    return translations[key] || key
  },
}))

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string
    alt: string
    width: number
    height: number
  }) => <img src={src} alt={alt} width={width} height={height} />,
}))

// Mock Sanity image builder
vi.mock('@sanity/image-url', () => ({
  default: () => ({
    image: () => ({
      width: () => ({
        height: () => ({
          fit: () => ({
            url: () => 'https://example.com/image.jpg',
          }),
        }),
      }),
    }),
  }),
}))

vi.mock('@/sanity/lib/client', () => ({
  client: {},
}))

describe('VentureCard', () => {
  const baseProps = {
    name: 'Test Venture',
    slug: 'test-venture',
    description: 'A test venture description',
    tagline: 'Test tagline',
    locale: 'en',
  }

  it('renders venture name and tagline', () => {
    render(<VentureCard {...baseProps} />)
    expect(screen.getByText('Test Venture')).toBeInTheDocument()
    expect(screen.getByText('Test tagline')).toBeInTheDocument()
  })

  it('renders venture description', () => {
    render(<VentureCard {...baseProps} />)
    expect(screen.getByText('A test venture description')).toBeInTheDocument()
  })

  it('renders sector when provided', () => {
    render(<VentureCard {...baseProps} sector="technology" />)
    expect(screen.getByText('technology')).toBeInTheDocument()
  })

  it('replaces hyphens with spaces in sector', () => {
    render(<VentureCard {...baseProps} sector="financial-services" />)
    expect(screen.getByText('financial services')).toBeInTheDocument()
  })

  it('renders location when provided', () => {
    render(<VentureCard {...baseProps} location="Kinshasa" />)
    expect(screen.getByText('Kinshasa')).toBeInTheDocument()
  })

  it('renders both sector and location with separator', () => {
    render(<VentureCard {...baseProps} sector="technology" location="Kinshasa" />)
    expect(screen.getByText('technology')).toBeInTheDocument()
    expect(screen.getByText('Kinshasa')).toBeInTheDocument()
    expect(screen.getByText('•')).toBeInTheDocument()
  })

  it('renders featured badge when featured is true', () => {
    render(<VentureCard {...baseProps} featured={true} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not render featured badge when featured is false', () => {
    render(<VentureCard {...baseProps} featured={false} />)
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('does not render featured badge when featured is undefined', () => {
    render(<VentureCard {...baseProps} />)
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('renders metrics highlight when provided', () => {
    render(<VentureCard {...baseProps} metricsHighlight="$1M+ Revenue" />)
    expect(screen.getByText('$1M+ Revenue')).toBeInTheDocument()
  })

  it('renders logo image when provided', () => {
    const logo = { _type: 'image' as const, alt: 'Company Logo' }
    render(<VentureCard {...baseProps} logo={logo} />)
    const img = screen.getByAltText('Company Logo')
    expect(img).toBeInTheDocument()
  })

  it('uses venture name as fallback alt text when logo has no alt', () => {
    const logo = { _type: 'image' as const }
    render(<VentureCard {...baseProps} logo={logo} />)
    const img = screen.getByAltText('Test Venture company logo')
    expect(img).toBeInTheDocument()
  })

  it('renders case study link when caseStudy is provided', () => {
    const caseStudy = {
      _id: '123',
      title: 'Success Story',
      slug: { current: 'success-story' },
    }
    render(<VentureCard {...baseProps} caseStudy={caseStudy} locale="en" />)
    const link = screen.getByText('Read Case Study →')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/en/case-studies/success-story')
  })

  it('renders learn more link when no caseStudy', () => {
    render(<VentureCard {...baseProps} />)
    const link = screen.getByText('Learn More →')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/en/ventures/test-venture')
  })

  it('uses correct locale in case study link', () => {
    const caseStudy = {
      _id: '123',
      title: 'Success Story',
      slug: { current: 'success-story' },
    }
    render(<VentureCard {...baseProps} caseStudy={caseStudy} locale="fr" />)
    const link = screen.getByText('Read Case Study →')
    expect(link.closest('a')).toHaveAttribute('href', '/fr/case-studies/success-story')
  })

  it('uses correct locale in learn more link', () => {
    render(<VentureCard {...baseProps} locale="fr" />)
    const link = screen.getByText('Learn More →')
    expect(link.closest('a')).toHaveAttribute('href', '/fr/ventures/test-venture')
  })

  it('renders all optional props together', () => {
    const caseStudy = {
      _id: '123',
      title: 'Success Story',
      slug: { current: 'success-story' },
    }
    const logo = { _type: 'image' as const, alt: 'Logo' }

    render(
      <VentureCard
        {...baseProps}
        sector="technology"
        location="Kinshasa"
        featured={true}
        metricsHighlight="$1M+ Revenue"
        logo={logo}
        caseStudy={caseStudy}
      />
    )

    expect(screen.getByText('Test Venture')).toBeInTheDocument()
    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByText('technology')).toBeInTheDocument()
    expect(screen.getByText('Kinshasa')).toBeInTheDocument()
    expect(screen.getByText('$1M+ Revenue')).toBeInTheDocument()
    expect(screen.getByText('Read Case Study →')).toBeInTheDocument()
  })
})
