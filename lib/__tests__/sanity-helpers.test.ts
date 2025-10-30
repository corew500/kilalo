import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSiteSettings } from '../sanity-helpers'
import { client } from '@/sanity/lib/client'

vi.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}))

describe('getSiteSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches English settings with correct query', async () => {
    const mockSettings = {
      _id: 'site-settings-en',
      language: 'en',
      siteTitle: 'Kilalo',
    }

    vi.mocked(client.fetch).mockResolvedValue(mockSettings as never)

    const result = await getSiteSettings('en')

    expect(client.fetch).toHaveBeenCalledWith(
      '*[_type == "siteSettings" && language == $locale][0]',
      { locale: 'en' }
    )
    expect(result).toEqual(mockSettings)
  })

  it('fetches French settings with correct query', async () => {
    const mockSettings = {
      _id: 'site-settings-fr',
      language: 'fr',
      siteTitle: 'Kilalo',
    }

    vi.mocked(client.fetch).mockResolvedValue(mockSettings as never)

    const result = await getSiteSettings('fr')

    expect(client.fetch).toHaveBeenCalledWith(
      '*[_type == "siteSettings" && language == $locale][0]',
      { locale: 'fr' }
    )
    expect(result).toEqual(mockSettings)
  })

  it('returns undefined when no settings found', async () => {
    vi.mocked(client.fetch).mockResolvedValue(undefined as never)

    const result = await getSiteSettings('en')

    expect(result).toBeUndefined()
  })

  it('passes locale parameter correctly', async () => {
    vi.mocked(client.fetch).mockResolvedValue({} as never)

    await getSiteSettings('custom-locale')

    expect(client.fetch).toHaveBeenCalledWith(
      expect.any(String),
      { locale: 'custom-locale' }
    )
  })
})
