# Kilalo Website Translation Audit Report

**Date:** October 28, 2025
**Purpose:** Document all hardcoded English text and translation issues preventing proper French language support

---

## Executive Summary

The Kilalo website has **extensive hardcoded English text** across nearly all pages and components. While the infrastructure for translations exists (next-intl, Sanity CMS with EN/FR fields, and getLocalizedField helper), the majority of the website content is hardcoded in English rather than using either:

1. Translation files (messages/en.json and messages/fr.json) for UI text
2. Sanity CMS data with getLocalizedField() for content

**Impact:** When users switch to French, the vast majority of content remains in English, creating a poor user experience and limiting accessibility for French-speaking users.

---

## Critical Issues (Homepage)

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/page.tsx`

#### Hero Section (Lines 114-132)

**Issue:** All hero text is hardcoded in English

- **Line 115-117:** Main heading

  ```tsx
  <h1>
    Scaling for-profit solutions to address <span className="text-teal">poverty and hunger</span> in
    the DRC
  </h1>
  ```

  **Fix:** Should use `t('HomePage.heroTitle')` with translations in en.json/fr.json

- **Line 120-122:** Subheading

  ```tsx
  <p>
    A venture studio helping Congolese entrepreneurs bring structure, clarity, and growth to their
    businesses through our proven Vision & Structure system.
  </p>
  ```

  **Fix:** Should use `t('HomePage.heroSubtitle')`

- **Line 126:** CTA button text "Start with Free Assessment"
  **Fix:** Already defined in en.json but not being used. Should use the existing HomePage.heroCta

- **Line 129:** CTA button text "Explore V2S Program"
  **Fix:** Should use `t('HomePage.exploreV2SProgram')`

#### What We Do Section (Lines 142-203)

**Issue:** Entire section is hardcoded

- **Line 146:** Heading "What We Do"
  **Fix:** Should use `t('HomePage.whatWeDoTitle')`

- **Line 148:** Description "Three ways we support Congolese entrepreneurs"
  **Fix:** Should use `t('HomePage.whatWeDoDescription')`

- **Lines 160-166:** Programs card text
  - Title: "Programs"
  - Description: "16-week V2S intensive and monthly Hekima Time webinars"
  - Link: "Explore Programs →"
    **Fix:** Should use translation keys for all three

- **Lines 176-182:** Services card text
  - All hardcoded text needs translation keys

- **Lines 192-198:** Community card text
  - All hardcoded text needs translation keys

#### Success Stories Section (Lines 206-251)

**Issue:** Section titles are hardcoded

- **Line 210:** "Success Stories" - Already exists in en.json as `HomePage.venturesTitle` but not being used
  **Fix:** Use `t('HomePage.venturesTitle')`

- **Line 212:** Description already exists in en.json but not being used
  **Fix:** Use `t('HomePage.venturesDescription')`

- **Line 240:** "Featured ventures coming soon"
  **Fix:** Should use `t('Common.comingSoon')` with context

- **Line 246:** "View All Ventures →" - Already exists as `HomePage.viewAllVentures`
  **Fix:** Use `t('HomePage.viewAllVentures')`

#### How Can We Help Section (Lines 255-313)

**Issue:** Entire section hardcoded

- **Line 259:** "How Can We Help?"
- **Line 261:** Description text
- **Line 272:** "For Entrepreneurs"
- **Line 274:** Description text
- **Line 277:** "Get Free Assessment"
- **Line 287:** "For Partners & Investors"
- **Line 289:** Description text
- **Line 292:** "Explore Partnerships"
- **Line 302:** "For Mentors & Experts"
- **Line 304:** Description text
- **Line 307:** "Join Our Network"

**Fix:** All need translation keys added to en.json/fr.json

---

## Important Issues (Other Pages)

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/about/page.tsx`

**Severity:** HIGH - Entire page is hardcoded in English

#### All Hardcoded Text (Lines 95-318):

- **Line 95:** "About Kilalo"
- **Line 98:** Full description paragraph
- **Line 105:** "Our Story"
- **Lines 108-115:** Three full paragraphs about Kilalo's story
- **Line 123:** "Our Approach: Vision & Structure"
- **Line 125:** Full description paragraph
- **Line 130:** "Vision: Know Where You're Going"
- **Line 132:** Full description paragraph
- **Line 137:** "Structure: Build Systems to Get There"
- **Line 139:** Full description paragraph
- **Line 145:** "The 8 Essential Tools"
- **Lines 148-156:** All 8 tool names (hardcoded array)
- **Line 182:** "Our Mission"
- **Line 186:** Mission statement paragraph
- **Line 193:** "Our Vision"
- **Line 196:** Vision statement paragraph
- **Line 206:** "Meet Our Team"
- **Line 208:** Description paragraph
- **Line 218:** "Team profiles coming soon!"
- **Line 228:** "Partners & Advisors"
- **Line 230:** Description paragraph
- **Line 242:** "Strategic Partners"
- **Line 244:** Description text
- **Line 256:** "Expert Advisors"
- **Line 258:** Description text
- **Line 270:** "Ecosystem Partners"
- **Line 272:** Description text
- **Line 280:** "Interested in partnering with Kilalo?"
- **Line 286:** "Learn about partnership opportunities →"
- **Line 294:** "Our Values"
- **Line 297:** "Excellence" + description
- **Line 304:** "Innovation" + description
- **Line 311:** "Partnership" + description

**Fix:** Entire page needs comprehensive translation keys created and implemented

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/programs/page.tsx`

**Severity:** HIGH - Most UI text is hardcoded

#### Hardcoded Text:

- **Line 134:** "Programs That Transform Businesses"
- **Line 137:** Description paragraph
- **Line 148:** "Flagship Program"
- **Line 197:** "The 8 Essential Tools"
- **Line 221:** "Who Can Apply?"
- **Line 222:** "Eligibility criteria for the V2S Program"
- **Line 242:** "Expected Outcomes"
- **Line 243:** "What you'll achieve in the program"
- **Line 265:** "Hekima Time"
- **Line 267:** Description paragraph
- **Line 275:** "Upcoming Sessions"
- **Line 296:** "Past Sessions"
- **Line 335:** "View All Hekima Time Sessions →"

**Note:** This page DOES use getLocalizedField() for Sanity content (program data), which is correct. The issue is UI text.

**Fix:** Add translation keys for all UI labels and descriptions

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/community/page.tsx`

**Severity:** HIGH - Most content is hardcoded

#### Hardcoded Text:

- **Line 119:** "Kilalo Community"
- **Line 122:** Description paragraph
- **Line 131:** "Hekima Time"
- **Line 134:** "Free Monthly Webinars for Entrepreneurs"
- **Line 137:** Description paragraph
- **Line 145:** "Upcoming Sessions"
- **Line 166:** "Past Sessions & Recordings"
- **Line 187:** "Hekima Time sessions coming soon! Check back for our schedule."
- **Line 197:** "Latest Insights"
- **Line 199:** Description paragraph
- **Line 218:** "Read more →"
- **Line 228:** "View All Posts →"
- **Line 237:** "Join the Kilalo Network"
- **Line 239:** Description paragraph
- **Line 251:** "Entrepreneurs"
- **Line 254:** Description text
- **Line 258:** "Learn More"
- **Line 270:** "Partners & Investors"
- **Line 273:** Description text
- **Line 277:** "Partner With Us"
- **Line 289:** "Mentors & Experts"
- **Line 292:** Description text
- **Line 296:** "Join Network"
- **Line 304:** "Stay Updated"
- **Line 311:** "your@email.com" placeholder
- **Line 315:** "Subscribe"
- **Line 320:** "Get notified about upcoming Hekima Time sessions and new resources"
- **Line 329:** "Questions? Let's Talk"
- **Line 331:** Description paragraph
- **Line 339:** "Chat on WhatsApp"

**Fix:** Comprehensive translation keys needed

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/contact/page.tsx`

**Severity:** MEDIUM - Some UI text is hardcoded

#### Hardcoded Text:

- **Line 65:** "Get in Touch" (already defined in Contact.title but not used)
- **Line 68:** Description paragraph
- **Line 75:** "We typically respond within 24-48 hours"
- **Line 92:** "WhatsApp" (already in Contact.whatsappLabel)
- **Line 109:** "Email" (already in Contact.emailLabel)
- **Line 112:** "hello@kilalo.org"
- **Line 121:** "Our Offices" (already in Contact.officeLabel)
- **Line 125:** "Goma Office"
- **Line 127-130:** Full address
- **Line 133:** "Kinshasa Office"
- **Line 135:** "Address coming soon"
- **Line 143:** "Follow Us"
- **Line 174:** "Need immediate assistance?"
- **Line 176:** Description paragraph

**Fix:** Use existing translation keys from Contact section and add missing ones

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/ventures/page.tsx`

**Severity:** MEDIUM - Page headers are hardcoded

#### Hardcoded Text:

- **Line 50:** "Our Ventures" (exists in Ventures.title)
- **Line 53:** Description paragraph (exists in Ventures.description)
- **Line 85:** "Venture profiles coming soon!"

**Note:** Venture cards correctly use getLocalizedField()

**Fix:** Use `t('Ventures.title')` and `t('Ventures.description')`

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/services/page.tsx`

**Severity:** HIGH - Entire page is hardcoded

#### Hardcoded Text:

- **Lines 13-33:** All service items (titles, descriptions) in array
- **Line 40:** "Direct Support Services"
- **Line 43:** Description paragraph
- **Line 70:** "Schedule a Consultation"
- **Line 78:** "How It Works"
- **Line 84:** "Consultation"
- **Line 86:** Description
- **Line 93:** "Custom Plan"
- **Line 95:** Description
- **Line 102:** "Implementation"
- **Line 104:** Description

**Fix:** Create comprehensive Services section in translation files

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/work-with-us/page.tsx`

**Severity:** HIGH - Entire page is hardcoded

#### Massive Amount of Hardcoded Text:

- **Line 22:** "Let's Build Together"
- **Line 24:** Description paragraph
- **Line 44:** "For Entrepreneurs"
- **Line 45:** "Scale your business with structure and support"
- **Line 49:** Description text
- **Line 53:** "Learn More"
- **Line 66:** "For Partners & Investors"
- **Line 67:** "Invest in impact-driven ventures"
- **Line 71:** Description text
- **Line 88:** "For Mentors & Experts"
- **Line 89:** "Share your expertise with entrepreneurs"
- **Line 93:** Description text
- ... and many more throughout the page (Lines 106-396)

**Fix:** This page needs the most work - comprehensive translation file additions required

---

### File: `/Users/coreywest/Documents/kilalo/app/[locale]/(marketing)/case-studies/[slug]/page.tsx`

**Severity:** MEDIUM - UI labels are hardcoded

#### Hardcoded Text:

- **Line 126:** "Home"
- **Line 129:** "Case Studies"
- **Line 167:** "Impact Highlight"
- **Line 181:** "The Challenge" (exists in CaseStudies.challengeTitle)
- **Line 195:** "The Partnership" (exists in CaseStudies.partnershipTitle)
- **Line 209:** "The Impact" (exists in CaseStudies.impactTitle)
- **Line 223:** "Why It Matters" (exists in CaseStudies.whyItMattersTitle)
- **Line 236:** "Ready to Transform Your Business?"
- **Line 238:** Description paragraph
- **Line 242:** "Get Free Assessment"
- **Line 247:** "Learn More About {name} →"
- **Line 258:** "← Back to All Case Studies"

**Note:** This page DOES correctly use getLocalizedField() for all Sanity content

**Fix:** Use existing CaseStudies translation keys that are already defined but not being used

---

## Component Issues

### File: `/Users/coreywest/Documents/kilalo/components/marketing/Footer.tsx`

**Severity:** MEDIUM - Some items not using translations

#### Issues:

- **Line 38:** "Programs" - hardcoded, should use `t('programs')`
- **Line 46:** "Ventures" - hardcoded, should use `t('ventures')`
- **Line 54:** "Community" - hardcoded, should use `t('community')`

**Note:** Most Footer items DO correctly use the t() function. Just these three are missing.

---

### File: `/Users/coreywest/Documents/kilalo/components/shared/VentureCard.tsx`

**Severity:** LOW - Button text is hardcoded

#### Issues:

- **Line 51:** "Featured" (exists in Ventures.featured but not used)
- **Line 94:** "Read Case Study →" (exists in Common.readCaseStudy)
- **Line 100:** "Learn More →" (exists in Common.learnMore)

**Note:** Card correctly uses localized props passed from parent

**Fix:** Pass locale to component and use `t()` function, or accept translated text as props

---

### File: `/Users/coreywest/Documents/kilalo/components/shared/BusinessAssessmentCTA.tsx`

**Severity:** MEDIUM - All CTA text is hardcoded

#### Issues:

- **Line 16:** "Ready to Scale Your Business?"
- **Line 18:** Description paragraph
- **Line 22:** "Schedule Free Assessment"
- **Line 32:** "Get Your Free Business Evaluation"
- **Line 34:** Description text
- **Line 38:** "Apply Now →"
- **Line 50:** "Start with Free Assessment"

**Fix:** This is a shared component used across many pages. Needs locale prop and translation keys added

---

### File: `/Users/coreywest/Documents/kilalo/components/shared/EventCard.tsx`

**Severity:** LOW - Some UI labels are hardcoded

#### Issues:

- **Line 45:** "Upcoming" (should use translation)
- **Line 51:** "Recorded" (should use translation)
- **Line 61:** "Speakers:" (should use translation)
- **Line 83:** Format display (capitalize and replace)
- **Line 89:** "Register Now" (should use Common.registerNow)
- **Line 98:** "Watch Recording →" (should use Common.watchRecording)

**Note:** Event data itself is correctly localized via getLocalizedField()

**Fix:** Add locale prop and use translation keys for UI labels

---

### File: `/Users/coreywest/Documents/kilalo/components/marketing/ContactForm.tsx`

**Severity:** LOW - Form field labels are hardcoded

#### Issues:

- **Line 46:** "Send us a message" (exists in Contact.formTitle)
- **Line 48:** "Fill out the form below..."
- **Line 55:** "First Name \*"
- **Line 71:** "Last Name \*"
- **Line 88:** "Email \*" (exists in Contact.emailLabel)
- **Line 105:** "Company"
- **Line 109:** "Subject \*"
- **Line 125:** "Message \*" (exists in Contact.messageLabel)
- **Line 142:** "Thank you! Your message has been sent successfully."
- **Line 151:** "Sending..." / "Send Message" (exists in Contact.submitButton)

**Note:** This is a client component, so it needs useTranslations hook

**Fix:** Import and use `useTranslations('Contact')` throughout

---

### File: `/Users/coreywest/Documents/kilalo/components/shared/ImpactMetrics.tsx`

**Severity:** MEDIUM - All labels are hardcoded

#### Issues:

- **Line 25:** "Businesses Supported"
- **Line 31:** "Hekima Sessions"
- **Line 36:** "Regions Served"
- **Line 41:** "Jobs Created"

**Note:** This is a server component fetching data from Sanity

**Fix:** Add locale prop and use translation keys for labels

---

## Missing Translation Keys

The following keys need to be **added to both en.json and fr.json**:

### HomePage Section (needs expansion):

```json
{
  "HomePage": {
    "heroTitle": "Scaling for-profit solutions to address poverty and hunger in the DRC",
    "heroSubtitle": "A venture studio helping Congolese entrepreneurs...",
    "exploreV2SProgram": "Explore V2S Program",
    "whatWeDoTitle": "What We Do",
    "whatWeDoDescription": "Three ways we support Congolese entrepreneurs",
    "programsTitle": "Programs",
    "programsDescription": "16-week V2S intensive and monthly Hekima Time webinars",
    "explorePrograms": "Explore Programs →",
    "servicesTitle": "Services",
    "servicesDescription": "Business structuring, strategy, and hands-on support",
    "exploreServices": "Explore Services →",
    "communityTitle": "Community",
    "communityDescription": "Network of entrepreneurs, free resources, and monthly events",
    "joinCommunity": "Join Community →",
    "howCanWeHelp": "How Can We Help?",
    "howCanWeHelpDescription": "Whether you're an entrepreneur, investor, or expert — there's a place for you",
    "forEntrepreneursTitle": "For Entrepreneurs",
    "forEntrepreneursDescription": "Ready to scale your business? Start with a free evaluation...",
    "getFreeAssessment": "Get Free Assessment",
    "forPartnersTitle": "For Partners & Investors",
    "forPartnersDescription": "Invest in impact. Explore partnership opportunities...",
    "explorePartnerships": "Explore Partnerships",
    "forMentorsTitle": "For Mentors & Experts",
    "forMentorsDescription": "Share your expertise. Contribute to V2S program...",
    "joinNetwork": "Join Our Network"
  }
}
```

### About Section (new section needed):

```json
{
  "About": {
    "pageTitle": "About Kilalo",
    "pageDescription": "A venture studio dedicated to scaling...",
    "ourStoryTitle": "Our Story",
    "ourStoryParagraph1": "Kilalo was born from a simple observation...",
    "ourStoryParagraph2": "We saw talented founders building...",
    "ourStoryParagraph3": "That's why we created Kilalo...",
    "v2sApproachTitle": "Our Approach: Vision & Structure",
    "v2sApproachDescription": "The V2S Program is our proven methodology...",
    "visionTitle": "Vision: Know Where You're Going",
    "visionDescription": "Many businesses fail not because...",
    "structureTitle": "Structure: Build Systems to Get There",
    "structureDescription": "Vision without structure is just a dream...",
    "eightToolsTitle": "The 8 Essential Tools",
    "tool1": "Vision & Mission Clarity",
    "tool2": "Customer Segmentation & Value Proposition",
    "tool3": "Financial Modeling & Unit Economics",
    "tool4": "Sales Process & Pipeline Management",
    "tool5": "Team Structure & Accountability Systems",
    "tool6": "Operational Workflows",
    "tool7": "Market Access & Distribution Strategy",
    "tool8": "Growth Metrics & KPI Tracking",
    "missionTitle": "Our Mission",
    "missionStatement": "To scale for-profit solutions...",
    "visionTitle": "Our Vision",
    "visionStatement": "A thriving ecosystem of Congolese-led businesses...",
    "teamTitle": "Meet Our Team",
    "teamDescription": "Our diverse team brings together...",
    "teamComingSoon": "Team profiles coming soon!",
    "partnersTitle": "Partners & Advisors",
    "partnersDescription": "We work with leading organizations...",
    "strategicPartnersTitle": "Strategic Partners",
    "strategicPartnersDescription": "Organizations supporting our mission...",
    "expertAdvisorsTitle": "Expert Advisors",
    "expertAdvisorsDescription": "Seasoned entrepreneurs and business leaders...",
    "ecosystemPartnersTitle": "Ecosystem Partners",
    "ecosystemPartnersDescription": "Local and international organizations...",
    "partnershipInterest": "Interested in partnering with Kilalo?",
    "learnPartnershipOpportunities": "Learn about partnership opportunities →",
    "valuesTitle": "Our Values",
    "excellenceTitle": "Excellence",
    "excellenceDescription": "We strive for excellence in everything we do...",
    "innovationTitle": "Innovation",
    "innovationDescription": "We embrace innovation and stay ahead...",
    "partnershipTitle": "Partnership",
    "partnershipDescription": "We build lasting partnerships based on trust..."
  }
}
```

### Programs, Services, WorkWithUs, Community sections all need similar comprehensive additions.

---

## Sanity CMS - Data Issues to Check

The following Sanity document types should be verified to have both EN and FR fields populated:

1. **Ventures** - Check that all ventures have:
   - nameEn / nameFr
   - descriptionEn / descriptionFr
   - taglineEn / taglineFr
   - metricsHighlightEn / metricsHighlightFr

2. **Case Studies** - Check that all case studies have:
   - titleEn / titleFr
   - challengeEn / challengeFr
   - partnershipEn / partnershipFr
   - impactEn / impactFr
   - whyItMattersEn / whyItMattersFr
   - impactHighlightEn / impactHighlightFr

3. **Events** - Check that all events have:
   - titleEn / titleFr
   - descriptionEn / descriptionFr
   - keyTakeawaysEn / keyTakeawaysFr

4. **Programs** - Check that programs have:
   - nameEn / nameFr
   - shortDescriptionEn / shortDescriptionFr
   - eligibilityEn / eligibilityFr
   - outcomesEn / outcomesFr
   - curriculum items with toolNameEn/Fr and descriptionEn/Fr

5. **Team Members** - Check that team members have:
   - roleEn / roleFr
   - bioEn / bioFr
   - expertiseEn / expertiseFr

6. **Blog Posts** - Check that posts have:
   - titleEn / titleFr
   - excerptEn / excerptFr
   - contentEn / contentFr

---

## Implementation Priority

### Phase 1: Critical (Homepage)

1. Homepage hero section
2. Homepage "What We Do" section
3. Homepage CTAs
4. Header navigation (already done ✓)
5. Footer links (mostly done, fix 3 items)

### Phase 2: Important (Main Pages)

1. About page (full translation needed)
2. Programs page (UI text)
3. Community page (all sections)
4. Work With Us page (entire page)
5. Contact page (use existing keys)

### Phase 3: Components

1. BusinessAssessmentCTA component
2. VentureCard component
3. EventCard component
4. ContactForm component
5. ImpactMetrics component

### Phase 4: Edge Cases

1. Services page
2. Case study page (use existing keys)
3. Ventures page (use existing keys)
4. Legal pages (if they exist)

---

## Technical Implementation Notes

### For Server Components:

```tsx
import { useTranslations } from 'next-intl'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // For server-side translation, use getTranslations
  const { getTranslations } = await import('next-intl/server')
  const t = await getTranslations('HomePage')

  return <h1>{t('title')}</h1>
}
```

### For Client Components:

```tsx
'use client'
import { useTranslations, useLocale } from 'next-intl'

export function Component() {
  const t = useTranslations('HomePage')
  const locale = useLocale()

  return <h1>{t('title')}</h1>
}
```

### For Sanity Data (Already Working):

```tsx
import { getLocalizedField } from '@/lib/i18n-helpers'

const title = getLocalizedField(item, 'title', locale)
```

---

## Summary Statistics

- **Total Files Audited:** 15
- **Files with Critical Issues:** 3 (Homepage, About, Work With Us)
- **Files with Important Issues:** 5 (Programs, Community, Services, Contact, Ventures)
- **Files with Minor Issues:** 7 (Components and Case Studies)
- **Estimated New Translation Keys Needed:** ~200+
- **Current Translation Keys:** ~90
- **Sanity CMS Integration:** ✓ Working correctly where implemented
- **Translation Infrastructure:** ✓ In place, just needs usage

---

## Recommendations

1. **Create Complete Translation Files First:** Before fixing code, create comprehensive en.json and fr.json with all needed keys

2. **Start with Homepage:** Highest visibility and impact

3. **Update Components:** Shared components affect multiple pages

4. **Verify Sanity Content:** Ensure all Sanity documents have French translations populated

5. **Add TypeScript Types:** Consider creating types for translation keys to prevent typos

6. **Testing Strategy:**
   - Test each page in both EN and FR
   - Verify language switcher works correctly
   - Check that all Sanity content displays in correct language

7. **Future Prevention:** Add ESLint rule or review checklist to catch hardcoded strings in new code
