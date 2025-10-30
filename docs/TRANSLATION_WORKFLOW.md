# Translation Workflow

Comprehensive guide for managing translations in the Kilalo bilingual website (EN/FR).

## Architecture Overview

Kilalo uses a **single-document per language** approach with Sanity CMS:

- Each language has its own separate Site Settings document
- Document IDs: `site-settings-en` and `site-settings-fr`
- Each document contains all translations for that specific language
- Frontend uses `next-intl` for client-side strings and route localization

### Translation Coverage

- **206 translatable fields** across site settings
- **2 languages** supported (English, French)
- **412 total translations** in Sanity
- **100% translation coverage** achieved

## Adding New Translatable Content

### 1. Add Fields to Sanity Schema

Edit `sanity/schemas/siteSettings.ts`:

```typescript
{
  name: 'newFieldName',
  title: 'New Field Name',
  type: 'string',
}
```

### 2. Update Seed Script

Edit `migrations/seed-site-settings.mjs`:

```javascript
const enSettings = {
  _id: 'site-settings-en',
  language: 'en',
  newFieldName: 'English Value',
  // ... other fields
}

const frSettings = {
  _id: 'site-settings-fr',
  language: 'fr',
  newFieldName: 'Valeur en français',
  // ... other fields
}
```

### 3. Run Seed Script

```bash
node migrations/seed-site-settings.mjs
```

### 4. Verify in Sanity Studio

```bash
cd sanity
npm run dev
```

Navigate to http://localhost:3333 and verify both EN/FR documents have the new field.

## Using Translations in Components

### Server Components (Sanity CMS)

```typescript
import { getSiteSettings } from '@/lib/sanity-helpers'

export default async function Page() {
  const settings = await getSiteSettings('en') // or 'fr'

  return <h1>{settings.newFieldName}</h1>
}
```

### Client Components (next-intl)

Add to `messages/en.json` and `messages/fr.json`:

```json
{
  "Common": {
    "buttonText": "Click Me" // or "Cliquez ici"
  }
}
```

Use in component:

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('Common')
  return <button>{t('buttonText')}</button>
}
```

## Dataset Management

### Development vs Production

- **Development**: `development` dataset (local work)
- **Production**: `production` dataset (live site)

See `sanity/WORKFLOW.md` for safe sync procedures.

### Syncing Datasets

**IMPORTANT**: Always backup before syncing!

```bash
# Export from development
npx sanity dataset export development backup-dev.tar.gz

# Import to production (CAREFUL!)
npx sanity dataset import backup-dev.tar.gz production --replace
```

## Troubleshooting

### Empty Translations in Sanity

**Problem**: Documents exist but fields are empty.

**Solution**:
1. Verify correct project ID in seed script
2. Verify correct dataset (development vs production)
3. Re-run seed script: `node migrations/seed-site-settings.mjs`

### Duplicate Site Settings

**Problem**: Multiple Site Settings documents.

**Solution**:
```bash
# Delete specific document
npx sanity documents delete site-settings-en

# Keep only: site-settings-en and site-settings-fr
```

### Schema Validation Errors

**Common errors**:
- Duplicate field names
- Invalid field names (use camelCase, no spaces)
- Missing required fields

**Fix**: Update `sanity/schemas/siteSettings.ts` and restart Sanity Studio.

## Testing Translations

### Unit Tests

```bash
npm test                 # Run all unit tests
npm test i18n-helpers    # Test translation helpers
```

### E2E Tests

```bash
npm run test:e2e         # Test locale switching
```

### Manual Testing

1. Start dev server: `npm run dev`
2. Visit http://localhost:3000/en
3. Click language toggle
4. Verify French content at http://localhost:3000/fr

## References

- Translation helpers: `lib/i18n-helpers.ts`
- Sanity helpers: `lib/sanity-helpers.ts`
- Seed script: `migrations/seed-site-settings.mjs`
- Dataset management: `sanity/WORKFLOW.md`
- next-intl routing: `i18n/routing.ts`
