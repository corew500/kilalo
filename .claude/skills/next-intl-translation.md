# next-intl Translation Management Skill

## Description
Add or update translations in the Kilalo project's internationalization system (English and French). Ensures consistent message structure, proper namespacing, and type-safe translation keys.

## When to Use
- Adding new UI text that needs translation
- Creating form validation messages
- Adding page-specific content
- Updating existing translations

## Input Parameters
- **namespace**: Component or page namespace (e.g., "ContactForm", "HomePage")
- **key**: Translation key (e.g., "successMessage", "title")
- **englishText**: English translation
- **frenchText**: French translation (optional, can be marked for translation)
- **context**: Where this translation will be used

## Output
Returns updated message structures for both `messages/en.json` and `messages/fr.json` with:
- Proper namespace organization
- Consistent formatting
- Usage example in components

## Example Usage

**Input:**
```
Add translations for a new Business Assessment form with success and error messages
```

**Output:**

**messages/en.json:**
```json
{
  "BusinessAssessment": {
    "title": "Free Business Assessment",
    "subtitle": "Get personalized insights for your venture",
    "submitButton": "Request Assessment",
    "submitting": "Submitting...",
    "successMessage": "Thank you! We'll contact you within 24 hours to schedule your assessment.",
    "errorMessage": "Something went wrong. Please try again or contact us directly.",
    "fields": {
      "fullName": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "businessName": "Business Name",
      "industry": "Industry",
      "stage": "Business Stage",
      "mainChallenge": "What's your biggest challenge right now?",
      "goalDescription": "What do you hope to achieve?"
    },
    "placeholders": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+243 123 456 789",
      "businessName": "Your Company Name",
      "mainChallenge": "Describe your main challenge in detail...",
      "goalDescription": "What are your goals for the next 6-12 months?"
    },
    "stages": {
      "idea": "Idea Stage",
      "early": "Early Stage",
      "growth": "Growth Stage",
      "scale": "Scaling"
    }
  }
}
```

**messages/fr.json:**
```json
{
  "BusinessAssessment": {
    "title": "Évaluation Gratuite de Votre Entreprise",
    "subtitle": "Obtenez des conseils personnalisés pour votre entreprise",
    "submitButton": "Demander une Évaluation",
    "submitting": "Envoi en cours...",
    "successMessage": "Merci ! Nous vous contactons dans 24 heures pour planifier votre évaluation.",
    "errorMessage": "Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.",
    "fields": {
      "fullName": "Nom Complet",
      "email": "Adresse Email",
      "phone": "Numéro de Téléphone",
      "businessName": "Nom de l'Entreprise",
      "industry": "Secteur",
      "stage": "Stade de l'Entreprise",
      "mainChallenge": "Quel est votre plus grand défi actuellement ?",
      "goalDescription": "Que souhaitez-vous réaliser ?"
    },
    "placeholders": {
      "fullName": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "+243 123 456 789",
      "businessName": "Nom de Votre Entreprise",
      "mainChallenge": "Décrivez votre défi principal en détail...",
      "goalDescription": "Quels sont vos objectifs pour les 6-12 prochains mois ?"
    },
    "stages": {
      "idea": "Stade Idée",
      "early": "Stade Initial",
      "growth": "Stade Croissance",
      "scale": "Mise à l'Échelle"
    }
  }
}
```

**Usage in Server Component:**
```typescript
import { getTranslations } from 'next-intl/server'

export default async function BusinessAssessmentPage() {
  const t = await getTranslations('BusinessAssessment')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <BusinessAssessmentForm />
    </div>
  )
}
```

**Usage in Client Component:**
```typescript
'use client'
import { useTranslations } from 'next-intl'

export default function BusinessAssessmentForm() {
  const t = useTranslations('BusinessAssessment')

  return (
    <form>
      <label>{t('fields.fullName')}</label>
      <input placeholder={t('placeholders.fullName')} />

      <button type="submit">
        {isSubmitting ? t('submitting') : t('submitButton')}
      </button>
    </form>
  )
}
```

## Best Practices Applied
1. Use namespaces for logical grouping (page/component level)
2. Nested objects for related translations (fields, placeholders, stages)
3. Consistent key naming (camelCase)
4. Provide context-appropriate translations
5. Include both labels and placeholders for forms
6. Add success/error messages for actions

## Message Organization Patterns
- **Pages**: `HomePage`, `AboutPage`, `ProgramsPage`
- **Forms**: `ContactForm`, `NewsletterForm`, `BusinessAssessment`
- **Components**: `Header`, `Footer`, `VentureCard`
- **Common**: `Common` (shared across app)
- **Metadata**: `Metadata` (SEO titles/descriptions)

## Translation Workflow
1. Add English text first
2. Mark French as `[FR: <english>]` if needs professional translation
3. Use DeepL or professional translator for French
4. Test both languages in UI
5. Verify character limits for UI constraints

## Related Files
- `messages/en.json` - English translations
- `messages/fr.json` - French translations
- `i18n/request.ts` - i18n configuration
- `i18n/routing.ts` - Locale routing
