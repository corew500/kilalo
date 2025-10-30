import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImpactMetrics } from '../ImpactMetrics'

// Mock Sanity client
vi.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}))

// Mock sanity-helpers
vi.mock('@/lib/sanity-helpers', () => ({
  getSiteSettings: vi.fn(),
}))

import { client } from '@/sanity/lib/client'
import { getSiteSettings } from '@/lib/sanity-helpers'

const mockFetch = client.fetch as ReturnType<typeof vi.fn>
const mockGetSiteSettings = getSiteSettings as ReturnType<typeof vi.fn>

describe('ImpactMetrics', () => {
  const mockMetrics = {
    businessesSupported: 150,
    hekimaSessions: 250,
    regionsServed: 5,
    jobsCreated: 1200,
  }

  const mockSettings = {
    componentImpactBusinessesSupported: 'Businesses Supported',
    componentImpactHekimaSessions: 'Hekima Sessions',
    componentImpactRegionsServed: 'Regions Served',
    componentImpactJobsCreated: 'Jobs Created',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no metrics found', async () => {
    mockFetch.mockResolvedValue(null)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    expect(result).toBeNull()
  })

  it('renders all 4 metrics when data is available', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    render(result as never)

    expect(screen.getByText('150', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1200', { exact: false })).toBeInTheDocument()
  })

  it('displays metric labels from Sanity settings', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    render(result as never)

    expect(screen.getByText('Businesses Supported')).toBeInTheDocument()
    expect(screen.getByText('Hekima Sessions')).toBeInTheDocument()
    expect(screen.getByText('Regions Served')).toBeInTheDocument()
    expect(screen.getByText('Jobs Created')).toBeInTheDocument()
  })

  it('displays + suffix for businesses supported', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const businessesText = container.querySelector('.text-teal')
    expect(businessesText?.textContent).toContain('150+')
  })

  it('displays + suffix for jobs created', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const metricsWithPlus = Array.from(container.querySelectorAll('.text-teal')).filter((el) =>
      el.textContent?.includes('+')
    )
    expect(metricsWithPlus.length).toBe(2)
  })

  it('does not display + suffix for hekima sessions', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const hekimaMetric = Array.from(container.querySelectorAll('.text-teal')).find(
      (el) => el.textContent === '250'
    )
    expect(hekimaMetric).toBeInTheDocument()
  })

  it('does not display + suffix for regions served', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const regionsMetric = Array.from(container.querySelectorAll('.text-teal')).find(
      (el) => el.textContent === '5'
    )
    expect(regionsMetric).toBeInTheDocument()
  })

  it('falls back to English labels when settings missing', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue({})

    const result = await ImpactMetrics({ locale: 'en' })
    render(result as never)

    expect(screen.getByText('Businesses Supported')).toBeInTheDocument()
    expect(screen.getByText('Hekima Sessions')).toBeInTheDocument()
    expect(screen.getByText('Regions Served')).toBeInTheDocument()
    expect(screen.getByText('Jobs Created')).toBeInTheDocument()
  })

  it('handles zero values correctly', async () => {
    const zeroMetrics = {
      businessesSupported: 0,
      hekimaSessions: 0,
      regionsServed: 0,
      jobsCreated: 0,
    }
    mockFetch.mockResolvedValue(zeroMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const zeroValues = Array.from(container.querySelectorAll('.text-teal')).filter(
      (el) => el.textContent === '0' || el.textContent === '0+'
    )
    expect(zeroValues.length).toBe(4)
  })

  it('handles missing metric values with fallback to 0', async () => {
    const incompleteMetrics = {
      businessesSupported: 150,
    }
    mockFetch.mockResolvedValue(incompleteMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    render(result as never)

    expect(screen.getByText('150', { exact: false })).toBeInTheDocument()
    const zeroValues = screen.getAllByText('0')
    expect(zeroValues.length).toBeGreaterThan(0)
  })

  it('uses correct locale parameter for settings', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    await ImpactMetrics({ locale: 'fr' })

    expect(mockGetSiteSettings).toHaveBeenCalledWith('fr')
  })

  it('renders metrics in grid layout', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid?.classList.contains('grid-cols-2')).toBe(true)
    expect(grid?.classList.contains('md:grid-cols-4')).toBe(true)
  })

  it('applies gradient background to metric cards', async () => {
    mockFetch.mockResolvedValue(mockMetrics)
    mockGetSiteSettings.mockResolvedValue(mockSettings)

    const result = await ImpactMetrics({ locale: 'en' })
    const { container } = render(result as never)

    const gradientCards = container.querySelectorAll('.bg-gradient-to-br')
    expect(gradientCards.length).toBe(4)
  })
})
