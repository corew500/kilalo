import { describe, it, expect } from 'vitest'
import { getLocalizedField, groqProjectFields, groqProjectLocale } from '../i18n-helpers'

describe('getLocalizedField', () => {
  it('returns English value when locale is en', () => {
    const content = { titleEn: 'Hello', titleFr: 'Bonjour' }
    expect(getLocalizedField(content, 'title', 'en')).toBe('Hello')
  })

  it('returns French value when locale is fr', () => {
    const content = { titleEn: 'Hello', titleFr: 'Bonjour' }
    expect(getLocalizedField(content, 'title', 'fr')).toBe('Bonjour')
  })

  it('falls back to English when French is missing', () => {
    const content = { titleEn: 'Hello' }
    expect(getLocalizedField(content, 'title', 'fr')).toBe('Hello')
  })

  it('falls back to English when French is empty string', () => {
    const content = { titleEn: 'Hello', titleFr: '' }
    expect(getLocalizedField(content, 'title', 'fr')).toBe('Hello')
  })

  it('returns empty string when content is undefined', () => {
    expect(getLocalizedField(undefined, 'title', 'en')).toBe('')
  })

  it('returns empty string when field does not exist', () => {
    const content = { otherField: 'value' }
    expect(getLocalizedField(content, 'title', 'en')).toBe('')
  })

  it('returns empty string when value is not a string', () => {
    const content = { titleEn: 123, titleFr: true }
    expect(getLocalizedField(content, 'title', 'en')).toBe('')
  })

  it('handles custom fallback locale', () => {
    const content = { titleFr: 'Bonjour' }
    expect(getLocalizedField(content, 'title', 'es', 'fr')).toBe('Bonjour')
  })

  it('works with different field names', () => {
    const content = { descriptionEn: 'Description', descriptionFr: 'Description en français' }
    expect(getLocalizedField(content, 'description', 'fr')).toBe('Description en français')
  })

  it('capitalizes locale correctly for field name', () => {
    const content = { nameEn: 'Name', nameFr: 'Nom' }
    expect(getLocalizedField(content, 'name', 'fr')).toBe('Nom')
  })
})

describe('groqProjectFields', () => {
  it('projects single field for both locales', () => {
    expect(groqProjectFields(['title'])).toBe('titleEn, titleFr')
  })

  it('projects multiple fields for both locales', () => {
    expect(groqProjectFields(['title', 'description'])).toBe(
      'titleEn, titleFr, descriptionEn, descriptionFr'
    )
  })

  it('returns empty string for empty array', () => {
    expect(groqProjectFields([])).toBe('')
  })

  it('handles three fields correctly', () => {
    expect(groqProjectFields(['name', 'tagline', 'description'])).toBe(
      'nameEn, nameFr, taglineEn, taglineFr, descriptionEn, descriptionFr'
    )
  })
})

describe('groqProjectLocale', () => {
  it('projects English fields with aliases', () => {
    expect(groqProjectLocale(['title', 'description'], 'en')).toBe(
      '"title": titleEn, "description": descriptionEn'
    )
  })

  it('projects French fields with aliases', () => {
    expect(groqProjectLocale(['title', 'description'], 'fr')).toBe(
      '"title": titleFr, "description": descriptionFr'
    )
  })

  it('returns empty string for empty array', () => {
    expect(groqProjectLocale([], 'en')).toBe('')
  })

  it('handles single field', () => {
    expect(groqProjectLocale(['name'], 'fr')).toBe('"name": nameFr')
  })

  it('capitalizes locale suffix correctly', () => {
    expect(groqProjectLocale(['title'], 'en')).toContain('titleEn')
    expect(groqProjectLocale(['title'], 'fr')).toContain('titleFr')
  })
})
