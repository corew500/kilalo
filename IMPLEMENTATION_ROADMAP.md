# Kilalo Website Transformation - Implementation Roadmap

## ✅ Phase 1: Foundation (COMPLETE)
- [x] Created 4 new Sanity schemas:
  - Program (V2S, workshops, direct support)
  - Event (Hekima Time sessions)
  - Case Study (detailed venture stories)
  - Impact Metrics (business dashboard)

## 🚀 Phase 2: Core Components (NEXT - Priority 1)

### Reusable Components to Build
Location: `/components/shared/`

1. **ImpactMetrics.tsx** - Dashboard display pulling from Sanity
2. **EventCard.tsx** - Hekima Time session cards
3. **BusinessAssessmentCTA.tsx** - Reusable "Free Assessment" button
4. **NewsletterSignup.tsx** - Email capture form
5. **VentureCard.tsx** - Enhanced portfolio company cards

## 📄 Phase 3: Critical Pages (Priority 2)

### 1. Homepage Overhaul
**File:** `/app/[locale]/(marketing)/page.tsx`

**Changes:**
- Replace Hero with DRC-focused messaging
- Add Impact Metrics dashboard section
- Add Featured Ventures section (not all)
- Add Hekima Time spotlight
- Add three-audience CTA section
- Remove generic features cards

### 2. Programs Page (NEW)
**File:** `/app/[locale]/(marketing)/programs/page.tsx`

**Sections:**
- Vision & Structure Program (V2S) hero
- 16-week breakdown + 8 tools grid
- Hekima Time series spotlight
- Direct Support Services
- Application CTA

**Replaces:** Current Services page

### 3. Ventures Pages Upgrade
**Changes:**
- Rename `/portfolio` → `/ventures`
- Update listing page with filters (sector, stage)
- Create detail pages: `/ventures/[slug]/page.tsx`
- Individual case studies with problem/solution/results

## 📄 Phase 4: Engagement Pages (Priority 3)

### 4. Community Page (NEW)
**File:** `/app/[locale]/(marketing)/community/page.tsx`

**Sections:**
- Hekima Time series (upcoming + past sessions)
- News & Updates (from blog)
- Join the Network (newsletter + forms)

### 5. Work With Us Page (NEW)
**File:** `/app/[locale]/(marketing)/work-with-us/page.tsx`

**Three Audience Paths:**
- For Entrepreneurs (Free Assessment CTA)
- For Partners & Investors (Partnership info)
- For Mentors & Experts (Join network)

## 📄 Phase 5: Updates (Priority 4)

### 6. About Page Enhancement
**File:** `/app/[locale]/(marketing)/about/page.tsx`

**Add:**
- Our Story section
- Our Approach: V2S explanation
- Partners & Advisors (separate from portfolio)

### 7. Contact Page Update
**File:** `/app/[locale]/(marketing)/contact/page.tsx`

**Add:**
- WhatsApp button
- Office locations (Goma, Kinshasa)
- Response time expectations

## 🗺️ Phase 6: Navigation & Cleanup (Priority 5)

### Navigation Structure
**Current:** Home | About | Services | Portfolio | Blog | Contact
**New:** Home | About | **Programs** | **Ventures** | **Community** | Contact

### Changes:
1. Update Header navigation
2. Update Footer with new page links
3. Add "Work With Us" button in mobile menu
4. Remove/deprecate old Services page

### Translations
**Add to messages/en.json and messages/fr.json:**
- Programs page content
- Community page content
- Work With Us content
- V2S terminology
- Hekima Time descriptions
- Impact metrics labels
- Office location info

## 📊 Phase 7: Content Population (Priority 6)

### Sanity Studio Content Needed:
1. **Impact Metrics** - Current year stats
2. **Programs** - V2S full description with 8 tools
3. **Events** - 3-5 past Hekima Time sessions
4. **Events** - 1-2 upcoming Hekima Time sessions
5. **Case Studies** - 5 venture stories:
   - Provapac Agro-Food
   - Butasoya
   - Justice Bot
   - NNP_DRC
   - Coproad

6. **Blog Posts**:
   - "Introducing the Vision & Structure Program"
   - "How Provapac Scaled with Kilalo"
   - "Hekima Time: Finance as Foundation Highlights"

## 🔧 Technical Integrations Needed

1. **Email Service** (Mailchimp/ConvertKit/Resend)
   - Newsletter signups
   - Event registrations

2. **Form Handling**
   - Free Business Assessment form
   - Partner interest form
   - Mentor application form
   - Contact form submission

3. **Calendar/Booking** (Optional)
   - Calendly embed for assessments
   - Event registration system

4. **Video Hosting**
   - YouTube/Vimeo embeds for Hekima Time recordings

## 📝 Quick Reference: File Structure

```
app/[locale]/(marketing)/
├── page.tsx (Homepage - OVERHAUL)
├── about/page.tsx (UPDATE)
├── programs/page.tsx (NEW - replaces services)
│   └── [slug]/page.tsx (Individual program details - optional)
├── ventures/ (RENAME from portfolio)
│   ├── page.tsx (UPDATE with filters)
│   └── [slug]/page.tsx (NEW - case study details)
├── community/page.tsx (NEW)
├── work-with-us/page.tsx (NEW)
├── blog/page.tsx (keep)
├── contact/page.tsx (UPDATE)
└── legal/ (keep)

components/
├── marketing/
│   ├── Header.tsx (UPDATE nav)
│   ├── Footer.tsx (UPDATE links)
│   ├── Hero.tsx (UPDATE messaging)
│   └── Features.tsx (REPLACE with new sections)
└── shared/ (NEW)
    ├── ImpactMetrics.tsx
    ├── EventCard.tsx
    ├── BusinessAssessmentCTA.tsx
    ├── NewsletterSignup.tsx
    └── VentureCard.tsx
```

## 🎯 Implementation Priority Summary

**Week 1 (Critical Path):**
1. Build shared components
2. Homepage overhaul
3. Programs page
4. Ventures detail pages

**Week 2 (High Value):**
5. Community page
6. Work With Us page
7. About page updates
8. Navigation changes

**Week 3 (Polish):**
9. Contact updates
10. Translations
11. Content population
12. Integrations setup

## 📋 Immediate Next Steps

1. ✅ Sanity schemas created
2. **YOU ARE HERE** → Build shared components
3. Overhaul homepage with new messaging
4. Create Programs page
5. Upgrade Ventures with case studies

---

**Note:** This is a comprehensive transformation. We can implement incrementally and test at each phase. Focus on getting the messaging right first (homepage + programs), then build out the supporting pages.
