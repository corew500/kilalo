# Form Validation & Creation Skill

## Description
Create complete, production-ready forms with React Hook Form, Zod validation, shadcn/ui components, and Server Actions. Includes client-side validation, server-side processing, internationalization, and error handling.

## When to Use
- Creating new forms for the Kilalo website
- Adding form validation schemas
- Implementing Server Actions for form processing
- Building forms with shadcn/ui components

## Input Parameters
- **formName**: Name/purpose of the form (e.g., "Partner Interest", "Event Registration")
- **fields**: Array of form fields with types and validation rules
- **submitAction**: What happens on successful submission
- **integrations**: External services (email, CRM, database)

## Output
Returns complete form implementation with:
1. Zod validation schema
2. Server Action
3. Form component with shadcn/ui
4. Translation keys
5. Usage instructions

## Example Usage

**Input:**
```
Create a Partner Interest form with organization details, contact info, and partnership type
```

**Output:**

### 1. Add Schema to `lib/forms/validation-schemas.ts`:

```typescript
export const partnerInterestSchema = z.object({
  // Organization Information
  organizationName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(150, 'Organization name must be at most 150 characters'),
  organizationType: z.enum(['corporate', 'foundation', 'ngo', 'government', 'investor', 'other'], {
    errorMap: () => ({ message: 'Please select an organization type' }),
  }),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),

  // Contact Information
  contactName: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must be at most 100 characters'),
  contactTitle: z.string().min(2, 'Title is required').max(100, 'Title must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),

  // Partnership Interest
  partnershipType: z.array(z.string()).min(1, 'Please select at least one partnership type'),
  description: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your interest')
    .max(1000, 'Description must be at most 1000 characters'),
  budget: z.string().optional(),

  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
})

export type PartnerInterestData = z.infer<typeof partnerInterestSchema>
```

### 2. Add Server Action to `lib/forms/form-actions.ts`:

```typescript
export async function submitPartnerInterest(
  formData: PartnerInterestData
): Promise<FormResponse<PartnerInterestData>> {
  const t = await getTranslations('PartnerInterest')

  try {
    const validatedData = partnerInterestSchema.parse(formData)

    // TODO: Send notification email
    // await resend.emails.send({
    //   from: 'partnerships@kilalo.org',
    //   to: process.env.PARTNERSHIPS_EMAIL!,
    //   subject: `Partnership Interest: ${validatedData.organizationName}`,
    //   react: PartnerInterestEmail(validatedData),
    // })

    // TODO: Store in database
    // await db.partnershipInquiries.create({ data: validatedData })

    console.log('Partner interest submission:', validatedData)

    return {
      success: true,
      data: validatedData,
      message: t('successMessage'),
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || t('errorMessage'),
      }
    }
    return {
      success: false,
      error: t('errorMessage'),
    }
  }
}
```

### 3. Create Form Component `components/forms/PartnerInterestForm.tsx`:

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { partnerInterestSchema, type PartnerInterestData } from '@/lib/forms/validation-schemas'
import { submitPartnerInterest } from '@/lib/forms/form-actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PartnerInterestForm() {
  const t = useTranslations('PartnerInterest')

  const form = useForm<PartnerInterestData>({
    resolver: zodResolver(partnerInterestSchema),
    defaultValues: {
      organizationName: '',
      organizationType: undefined,
      website: '',
      contactName: '',
      contactTitle: '',
      email: '',
      phone: '',
      partnershipType: [],
      description: '',
      budget: '',
      consent: false,
    },
  })

  async function onSubmit(data: PartnerInterestData) {
    const result = await submitPartnerInterest(data)

    if (result.success) {
      toast.success(result.message)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Organization Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('sections.organization')}</h3>

          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.organizationName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.organizationName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.organizationType')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholders.organizationType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="corporate">{t('organizationTypes.corporate')}</SelectItem>
                    <SelectItem value="foundation">{t('organizationTypes.foundation')}</SelectItem>
                    <SelectItem value="ngo">{t('organizationTypes.ngo')}</SelectItem>
                    <SelectItem value="government">{t('organizationTypes.government')}</SelectItem>
                    <SelectItem value="investor">{t('organizationTypes.investor')}</SelectItem>
                    <SelectItem value="other">{t('organizationTypes.other')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.website')}</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('sections.contact')}</h3>

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.contactName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.contactName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.email')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Partnership Interest */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('sections.partnership')}</h3>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('placeholders.description')}
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t('hints.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Consent */}
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t('fields.consent')}</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? t('submitting') : t('submitButton')}
        </Button>
      </form>
    </Form>
  )
}
```

### 4. Add Translations to `messages/en.json` and `messages/fr.json`:

```json
{
  "PartnerInterest": {
    "title": "Partner With Us",
    "submitButton": "Submit Partnership Inquiry",
    "submitting": "Submitting...",
    "successMessage": "Thank you for your interest! We'll be in touch within 48 hours.",
    "errorMessage": "Failed to submit. Please try again or email partnerships@kilalo.org",
    "sections": {
      "organization": "Organization Information",
      "contact": "Contact Information",
      "partnership": "Partnership Interest"
    },
    "fields": {
      "organizationName": "Organization Name",
      "organizationType": "Organization Type",
      "website": "Website (Optional)",
      "contactName": "Contact Person",
      "contactTitle": "Title/Position",
      "email": "Email Address",
      "phone": "Phone Number",
      "description": "Tell us about your partnership interest",
      "consent": "I agree to the privacy policy and terms of service"
    },
    "organizationTypes": {
      "corporate": "Corporate Partner",
      "foundation": "Foundation",
      "ngo": "NGO/Non-Profit",
      "government": "Government Agency",
      "investor": "Impact Investor",
      "other": "Other"
    }
  }
}
```

### 5. Usage in Page:

```typescript
// app/[locale]/(marketing)/work-with-us/page.tsx
import PartnerInterestForm from '@/components/forms/PartnerInterestForm'
import { getTranslations } from 'next-intl/server'

export default async function PartnershipPage() {
  const t = await getTranslations('PartnerInterest')

  return (
    <section className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
        <PartnerInterestForm />
      </div>
    </section>
  )
}
```

## Best Practices Applied
1. Client-side validation with Zod + React Hook Form
2. Server-side validation in Server Action
3. Internationalized error messages
4. Type-safe form data with TypeScript inference
5. Accessible form fields with shadcn/ui
6. Loading states during submission
7. Toast notifications for feedback
8. Form reset after successful submission

## Required Dependencies
```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "sonner": "^1.x"
}
```

## Common Field Types
- Text: `z.string().min().max()`
- Email: `z.string().email()`
- Phone: `z.string().regex(/^[+]?[\d\s()-]+$/)`
- URL: `z.string().url()`
- Number: `z.number().min().max()`
- Enum: `z.enum(['option1', 'option2'])`
- Checkbox: `z.boolean().refine(val => val === true)`
- Array: `z.array(z.string()).min(1)`
- Optional: `.optional()` or `.optional().or(z.literal(''))`

## Validation Patterns
- Minimum length: `.min(n, 'message')`
- Maximum length: `.max(n, 'message')`
- Pattern matching: `.regex(/pattern/, 'message')`
- Custom validation: `.refine(fn, 'message')`
- Conditional: `.superRefine()`
