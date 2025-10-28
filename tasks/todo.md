# Kilalo Project Implementation Plan

**Last Updated**: 2025-10-27
**Current Task**: Fix ESLint `@typescript-eslint/no-explicit-any` Warnings

---

## ESLint TypeScript Fixes (IN PROGRESS)

### Fix `any` Type Warnings Across Codebase

- [ ] 1. Fix app/[locale]/(marketing)/about/page.tsx (line 83) - Define TeamMember interface
- [ ] 2. Fix app/[locale]/(marketing)/blog/page.tsx (lines 9, 52) - Define Post interface
- [ ] 3. Fix app/[locale]/(marketing)/case-studies/page.tsx (line 56) - Define CaseStudy interface
- [ ] 4. Fix app/[locale]/(marketing)/community/page.tsx (lines 147, 168, 204) - Define Event and Post interfaces
- [ ] 5. Fix app/[locale]/(marketing)/page.tsx (line 218) - Define Venture interface
- [ ] 6. Fix app/[locale]/(marketing)/programs/page.tsx (lines 199, 277, 298) - Define Program, Event interfaces
- [ ] 7. Fix app/[locale]/(marketing)/ventures/[slug]/page.tsx (line 48) - Fix generateStaticParams return type
- [ ] 8. Fix app/[locale]/(marketing)/ventures/page.tsx (line 62) - Define Venture interface
- [ ] 9. Fix app/[locale]/layout.tsx (line 44) - Fix locale type assertion
- [ ] 10. Fix components/shared/TeamGrid.tsx (lines 12, 21) - Fix urlFor parameter type
- [ ] 11. Fix components/shared/VentureCard.tsx (lines 10, 22) - Fix urlFor parameter type
- [ ] 12. Fix i18n/request.ts (line 9) - Fix locale type check
- [ ] 13. Fix lib/i18n-helpers.ts (line 10) - Replace Record<string, any> with proper type
- [ ] 14. Run TypeScript compilation check (npx tsc --noEmit)
- [ ] 15. Run ESLint to verify all warnings resolved

---

## Accessibility Fixes (COMPLETE) ✅

### Critical Accessibility Issues Fixed
- [x] 1. Add Skip Link to Main Layout (app/[locale]/(marketing)/layout.tsx)
- [x] 2. Fix Mobile Menu Button ARIA Labels (components/marketing/Header.tsx)
- [x] 3. Fix Language Switcher ARIA Labels (components/marketing/Header.tsx)
- [x] 4. Add aria-hidden to decorative SVGs in home page (app/[locale]/(marketing)/page.tsx)
- [x] 5. Add aria-hidden to decorative SVGs in about page (app/[locale]/(marketing)/about/page.tsx)
- [x] 6. Add aria-hidden to decorative SVGs in programs page (app/[locale]/(marketing)/programs/page.tsx)
- [x] 7. Add aria-hidden to decorative SVGs in contact page (app/[locale]/(marketing)/contact/page.tsx)
- [x] 8. Fix Contact Form Accessibility (app/[locale]/(marketing)/contact/page.tsx)
- [x] 9. Fix TeamGrid Keyboard Accessibility (components/shared/TeamGrid.tsx)
- [x] 10. Fix Footer Heading Hierarchy (components/marketing/Footer.tsx)
- [x] 11. Add ARIA Labels to Social Media Links in contact page (app/[locale]/(marketing)/contact/page.tsx)
- [x] 12. Add "Opens in New Tab" Indicators (components/shared/EventCard.tsx)
- [x] 13. Add Reduced Motion Support (app/globals.css)
- [x] 14. Improve Image Alt Text (components/shared/VentureCard.tsx)
- [x] 15. Test TypeScript compilation

## SEO Implementation Plan (COMPLETE) ✅

### Phase A: SEO Configuration & Base Setup
- [x] 1. Create lib/seo.ts with site configuration (name, description EN/FR, URL, OG image, Twitter handle, locale mappings)
- [x] 2. Update app/[locale]/layout.tsx with base metadata (metadataBase, robots, verification placeholder)

### Phase B: Page-Level Metadata Enhancement
- [x] 3. Add generateMetadata to app/[locale]/(marketing)/page.tsx (homepage) with full OG and Twitter tags
- [x] 4. Add generateMetadata to app/[locale]/(marketing)/about/page.tsx with full OG and Twitter tags
- [x] 5. Add generateMetadata to app/[locale]/(marketing)/programs/page.tsx with full OG and Twitter tags
- [x] 6. Add generateMetadata to app/[locale]/(marketing)/community/page.tsx with full OG and Twitter tags
- [x] 7. Add generateMetadata to app/[locale]/(marketing)/contact/page.tsx with full OG and Twitter tags
- [x] 8. Verify and enhance app/[locale]/(marketing)/ventures/[slug]/page.tsx metadata with full OG and Twitter tags
- [x] 9. Verify and enhance app/[locale]/(marketing)/case-studies/[slug]/page.tsx metadata with full OG and Twitter tags

### Phase C: Structured Data & Sitemaps
- [x] 10. Add JSON-LD Organization schema to app/[locale]/(marketing)/layout.tsx
- [x] 11. Create app/sitemap.ts for automatic sitemap generation with EN/FR routes
- [x] 12. Create app/robots.ts for robots.txt generation (allow all except /studio/ and /api/)

### Phase D: Testing & Verification
- [x] 13. Run TypeScript compilation check (npx tsc --noEmit) - All SEO files pass, pre-existing validation-schemas.ts errors unrelated
- [ ] 14. Verify all metadata renders correctly in browser (manual testing recommended)
- [ ] 15. Test bilingual metadata (EN/FR) for all pages (manual testing recommended)
- [x] 16. Document all SEO features added in summary

---
**Tech Stack**: Next.js 16, Supabase, Sanity.io, Tailwind CSS, shadcn/ui

**PRIORITY SHIFT**: Focus on completing marketing site for deployment. Member portal and authentication (Phase 5b, Phase 8) deferred to post-launch.

---

## Phase 1: Prerequisites & Account Setup ✅ COMPLETE

Before any code implementation, these accounts and services must be set up:

### 1.1 Required Service Signups

- [x] **Vercel Account**
  - URL: https://vercel.com/signup
  - Action: Sign up with GitHub account
  - Purpose: Application deployment and hosting
  - Plan: Start with Hobby (Free), upgrade to Pro ($20/mo) for production
  - Note: Save project URL after creation

- [x] **Supabase Account**
  - URL: https://supabase.com
  - Action: Create account and two projects
  - Projects needed:
    - [x] Kilalo Development (for local dev and Vercel preview deployments)
    - [x] Kilalo Production (for live site)
  - For each project, save:
    - [ ] Project URL (https://xxx.supabase.co)
    - [ ] Anon/Public Key
    - [ ] Service Role Key (keep secret!)
    - [ ] Database Password
  - Plan: Start Free, upgrade to Pro ($25/mo) when scaling
  - Region: Choose closest to target users
  - Note: Development environment will be shared between local and preview deployments

- [x] **Sanity.io Account**
  - URL: https://sanity.io
  - Action: Create account
  - Purpose: Headless CMS for content management
  - Projects needed:
    - [ ] Kilalo CMS (create during setup)
  - Save:
    - [ ] Project ID
    - [ ] Dataset name (production)
    - [ ] API Token (Editor permissions)
  - Plan: Start Free, upgrade to Growth ($99/mo) if needed

- [x] **GitHub Repository**
  - Action: Create repository for Kilalo project
  - Name: kilalo
  - URL: https://github.com/corew500/kilalo
  - Visibility: Public
  - Initialize with: .gitignore (Node)
  - Purpose: Version control and CI/CD integration

### 1.2 Optional Service Signups

- [ ] **Google Cloud Console** (for Google OAuth)
  - URL: https://console.cloud.google.com
  - Action: Create OAuth 2.0 credentials
  - Purpose: "Sign in with Google" functionality
  - Save: Client ID and Client Secret

- [ ] **GitHub OAuth Apps** (for GitHub OAuth)
  - URL: https://github.com/settings/developers
  - Action: Create new OAuth App
  - Purpose: "Sign in with GitHub" functionality
  - Save: Client ID and Client Secret

- [ ] **Sentry** (for error tracking - optional)
  - URL: https://sentry.io
  - Purpose: Production error monitoring
  - Plan: Developer (Free) tier available

### 1.3 Domain Setup

- [ ] **Purchase Domain** (if not already owned)
  - Recommended: kilalo.com
  - Registrar: Namecheap, Google Domains, or Vercel
  - Action: Register domain

- [ ] **DNS Planning**
  - Decision: Use Vercel nameservers (recommended) or external DNS
  - If using Vercel DNS: Will configure in Phase 8

### 1.4 Local Development Environment

- [x] **Node.js 20 LTS**
  - Check: Run `node --version` (v22.14.0 ✅)
  - Install: https://nodejs.org or use nvm

- [x] **Package Manager**
  - npm (included with Node.js) - recommended
  - Or pnpm/yarn if preferred

- [x] **Git**
  - Check: Run `git --version` (v2.50.1 ✅)
  - Install: https://git-scm.com

- [x] **Vercel CLI**
  - Installed globally: v48.6.0 ✅

- [x] **Code Editor**
  - Recommended: VS Code with extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - TypeScript extension

---

## Phase 2: Project Foundation Setup ✅ COMPLETE

### 2.1 Initialize Next.js Project

- [x] Navigate to project directory
- [x] Run Next.js initialization (Next.js 16.0.0):
  ```bash
  npx create-next-app@latest . \
    --typescript \
    --eslint \
    --app \
    --no-src-dir \
    --import-alias "@/*" \
    --tailwind \
    --turbopack
  ```
- [x] Verify installation successful
- [x] Test dev server: `npm run dev` ✅
- [x] Commit initial setup to Git

### 2.2 Install Core Dependencies

- [x] Install Supabase packages:
  ```bash
  npm install @supabase/ssr @supabase/supabase-js
  ```

- [x] Install Sanity packages:
  ```bash
  npm install next-sanity sanity @sanity/vision @sanity/image-url
  ```

- [x] Install i18n package:
  ```bash
  npm install next-intl
  ```

- [x] Install utility packages:
  ```bash
  npm install clsx tailwind-merge
  ```
  - [ ] zod (not installed - add when needed for form validation)
  - [ ] date-fns (not installed - add when needed)

- [ ] Install dev dependencies (DEFERRED - not needed for MVP):
  ```bash
  npm install -D @playwright/test vitest \
    @vitejs/plugin-react @testing-library/react \
    @testing-library/jest-dom @axe-core/react \
    eslint-plugin-jsx-a11y prettier prettier-plugin-tailwindcss
  ```

- [x] Verify all packages installed
- [x] Commit package.json and package-lock.json

### 2.3 Configure TypeScript (Strict Mode) ✅ COMPLETE

- [x] Update tsconfig.json with strict settings
- [x] Enable strict type-checking options:
  - [x] `strict: true` ✅
  - [x] `noUncheckedIndexedAccess: true` ✅
  - [x] `noImplicitOverride: true` ✅
  - [x] `noUnusedLocals: true` ✅
  - [x] `noUnusedParameters: true` ✅
  - [x] `noFallthroughCasesInSwitch: true` ✅
  - [x] `noImplicitReturns: true` ✅
  - [x] `exactOptionalPropertyTypes: true` ✅
- [x] Fixed all TypeScript errors (3 errors resolved):
  - [x] Removed unused `nextEvent` variable in homepage
  - [x] Removed unused `Link` import in EventCard
  - [x] Fixed Sanity CLI config type issue with non-null assertions
- [x] Verify TypeScript compilation works (npx tsc --noEmit passes)
- [x] Commit tsconfig.json

### 2.4 Create Project Structure

- [x] Create directory structure:
  ```bash
  mkdir -p app/{api,[locale]/{(marketing),(auth),(member)}}
  mkdir -p components/{ui,marketing,member,auth,shared}
  mkdir -p lib/{supabase,sanity,validations}
  mkdir -p hooks messages sanity/schemas/{documents,objects}
  mkdir -p types
  ```
  - [x] app/[locale]/(marketing) ✅
  - [x] components/ui, marketing, shared ✅
  - [x] lib/supabase ✅
  - [x] messages/ ✅
  - [x] sanity/schemaTypes/ ✅
  - [x] i18n/ ✅
  - [ ] tests/ (deferred - not needed for MVP)
  - [ ] public/images, icons (will add as needed)
- [x] Verify directory structure
- [x] Commit structure

---

## Phase 3: Styling & UI Components ✅ COMPLETE

### 3.1 Configure Tailwind CSS

- [x] Update tailwind.config.ts with custom theme
- [x] Implement Kilalo color palette:
  - [x] Primary Teal (#215965)
  - [x] Secondary Orange (#F39200)
  - [x] Forest Green (#21654f)
  - [x] Navy Blue (#213765)
  - [x] Rust (#652d21)
  - [x] Purple (#2d2165)
  - [x] Plum (#652159)
- [x] Configure dark mode support
- [ ] Set up custom fonts (Inter, Satoshi) - Deferred
- [x] Test Tailwind classes working
- [x] Commit tailwind.config.ts

### 3.2 Install shadcn/ui

- [x] Initialize shadcn/ui (components.json created)
- [x] Install essential components:
  - [x] Button: `npx shadcn@latest add button`
  - [x] Card: `npx shadcn@latest add card`
  - [x] Input: `npx shadcn@latest add input`
  - [x] Label: `npx shadcn@latest add label`
  - [x] Dialog: `npx shadcn@latest add dialog`
  - [x] Textarea: `npx shadcn@latest add textarea`
  - [ ] Form, Dropdown, Toast - Install as needed later
- [x] Create lib/utils.ts with cn() helper
- [x] Test components render correctly
- [x] Commit components/ui/

### 3.3 Set Up Global Styles

- [x] Update app/globals.css with:
  - [x] Tailwind directives
  - [x] CSS custom properties
  - [x] Base styles
  - [ ] OKLCH color space support - Using HSL for now
- [x] CSS variables for light/dark mode
- [x] Updated homepage with theme showcase
- [x] Commit globals.css

---

## Phase 4: Internationalization (i18n) ✅ COMPLETE

**Status**: All schemas have explicit EN/FR fields. UI translations complete in messages/. Migration scripts successfully translated all existing content.

### 4.1 Configure next-intl

- [x] Create i18n/routing.ts (updated path)
- [x] Configure supported locales (en, fr)
- [x] Set default locale (en)
- [x] Create middleware.ts for i18n routing
- [x] Integrated with Supabase auth in middleware
- [x] Test locale routing works
- [x] Commit i18n configuration

### 4.2 Create Translation Files

- [x] Create messages/en.json:
  - [x] Navigation translations
  - [x] HomePage translations
  - [x] Common translations
  - [x] NotFound translations
  - [ ] Auth translations (deferred to Phase 5b)
- [x] Create messages/fr.json:
  - [x] Mirror English structure
  - [x] Translate all strings
  - [x] Verify translation completeness
- [x] Commit translation files

### 4.3 Set Up Locale Layouts

- [x] Create app/[locale]/layout.tsx (locale-specific)
- [x] Implement NextIntlClientProvider
- [x] Update homepage to use translations
- [ ] Create language switcher component
- [ ] Test switching between en/fr
- [ ] Commit layout files

---

## Phase 5: Supabase Integration ✅ PHASE 5a COMPLETE | 🔜 PHASE 5b DEFERRED

**Status**: Basic Supabase setup complete. Authentication and profile management deferred to post-launch.

### 5.1 Environment Variables Setup

- [x] Create .env.local file
- [x] Add Supabase environment variables:
  - [x] NEXT_PUBLIC_SUPABASE_URL
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY (to be added when needed)
- [x] Create .env.local.example (without values)
- [x] Verify .env.local is in .gitignore
- [x] Test environment variables load
- [x] Commit .env.local.example only

### 5.2 Create Supabase Clients

- [x] Create lib/supabase/server.ts (Server Component client)
- [x] Create lib/supabase/client.ts (Client Component client)
- [x] Integrated Supabase auth in middleware.ts (combined with i18n)
- [x] Test clients connect successfully (connection verified)
- [x] Commit Supabase utilities
- [ ] Create lib/supabase/admin.ts (Admin client - deferred until needed)

### 5.3-5.8 Authentication & Member Features 🔜 DEFERRED TO POST-LAUNCH

**Rationale**: Focus on marketing site completion and deployment first. Authentication and member portal will be implemented after initial launch.

Deferred items:
- Database schema setup (profiles table)
- Row Level Security (RLS) policies
- Authentication flows (signup, login, password reset)
- OAuth providers (Google, GitHub)
- Protected routes and member dashboard
- Type generation for Supabase

---

## Phase 6: Sanity CMS Integration ✅ COMPLETE

**Status**: Sanity Studio embedded and working. All content schemas created with explicit EN/FR fields. Content successfully migrated.

### Implementation Summary

- [x] Sanity initialized and embedded at /studio
- [x] All content schemas created with bilingual fields:
  - [x] venture.ts (company portfolio)
  - [x] program.ts (V2S, Hekima Time)
  - [x] event.ts (community events)
  - [x] caseStudy.ts (impact stories)
  - [x] teamMember.ts (team profiles)
  - [x] impactMetrics.ts (yearly metrics)
  - [x] siteSettings.ts (UI translations - NEW)
- [x] Migration scripts created and executed
- [x] All existing content translated to EN/FR
- [x] Studio accessible and functional

---

## Phase 7: Content & Pages Implementation ✅ COMPLETE

**Status**: All marketing pages created with localized content from Sanity!

### 7.1 Marketing Layout ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/layout.tsx
- [x] Create components/marketing/Header.tsx:
  - [x] Logo, navigation links
  - [x] Language switcher
  - [x] Removed Sign in/Sign up buttons (auth deferred)
  - [x] Mobile menu
- [x] Create components/marketing/Footer.tsx:
  - [x] Site links, social media
  - [x] Legal links (privacy, terms)
- [x] Style with Tailwind and brand colors
- [x] Test responsive design
- [x] Commit marketing layout

### 7.2 Homepage ✅ COMPLETE

- [x] Update app/[locale]/(marketing)/page.tsx
- [x] Hero section with DRC focus
- [x] "What We Do" section (Programs, Services, Community)
- [x] Featured Ventures showcase with VentureCard component
- [x] Three-audience CTA (Entrepreneurs, Partners, Mentors)
- [x] Fetch content from Sanity (ventures, events)
- [x] Implement SEO metadata
- [x] Test bilingual content with getLocalizedField()
- [x] Commit homepage

### 7.3 About Page ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/about/page.tsx
- [x] Our Story section (hardcoded - can move to Sanity later)
- [x] V2S Approach section with 8 Essential Tools
- [x] Implement team section with localized TeamGrid component
- [x] Mission & Vision cards
- [x] Partners & Advisors section
- [x] Values section
- [x] Add SEO metadata
- [x] Commit about page

### 7.4 Programs Page ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/programs/page.tsx
- [x] Fetch V2S program with localized fields from Sanity
- [x] Display curriculum (8 tools) with localized content
- [x] Show eligibility and outcomes
- [x] Display Hekima Time upcoming events
- [x] Show past events with recordings
- [x] Add Business Assessment CTA
- [x] Add SEO metadata
- [x] Commit programs page

### 7.5 Ventures Pages ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/ventures/page.tsx (portfolio)
- [x] Create app/[locale]/(marketing)/ventures/[slug]/page.tsx
- [x] Implement generateStaticParams for ventures
- [x] Display venture details with localized content
- [x] Show metrics and case study links
- [x] Add SEO metadata per venture
- [x] Commit ventures pages

### 7.6 Case Studies Pages ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/case-studies/page.tsx (listing)
- [x] Create app/[locale]/(marketing)/case-studies/[slug]/page.tsx
- [x] Implement generateStaticParams for case studies
- [x] Display challenge, partnership, impact, why it matters
- [x] Link to related venture
- [x] Add SEO metadata per case study
- [x] Commit case studies pages

### 7.7 Community Page ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/community/page.tsx
- [x] Display upcoming and past events (exists)
- [x] Add event registration links (exists)
- [x] Add Hekima Time event listings (exists)
- [x] Commit community page

### 7.8 Contact Page ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/contact/page.tsx (exists)
- [ ] Contact form functionality (basic version exists, API route pending)
  - [ ] Validate form with Zod (can add when implementing)
  - [ ] Send email (can add when implementing)
- [x] Commit contact page

### 7.9 Legal Pages ✅ COMPLETE

- [x] Create app/[locale]/(marketing)/legal/privacy/page.tsx
- [x] Create app/[locale]/(marketing)/legal/terms/page.tsx
- [x] Static content placeholders
- [x] Commit legal pages

### Additional Pages Created

- [x] app/[locale]/(marketing)/services/page.tsx
- [x] app/[locale]/(marketing)/blog/page.tsx
- [x] app/[locale]/(marketing)/work-with-us/page.tsx

---

## Phase 8: Member Portal 🔜 DEFERRED TO POST-LAUNCH

**Status**: Deferred until after marketing site launch. Will implement authentication and member features in Phase 2 of development.

**Future Scope**:
- Member dashboard with personalized content
- Profile management with avatar upload
- Account settings and preferences
- Learning platform integration (courses, progress tracking)
- Community features (comments, discussions)

This phase will be revisited after successful deployment of the marketing site.

---

## Phase 9: Testing & Quality Assurance

### 9.1 ESLint Configuration ✅ COMPLETE

- [x] Created eslint.config.mjs with typescript-eslint flat config
- [x] Configured @typescript-eslint recommended rules
- [x] Added custom rules for no-console, no-var, prefer-const
- [x] Fixed TypeScript integration with project reference
- [x] Added npm scripts: `lint` and `lint:fix`
- [x] Tested linting (found 60+ warnings - mostly `any` types in migration scripts)
- [x] Committed ESLint config

### 9.2 Prettier Setup ✅ COMPLETE

- [x] Created .prettierrc.mjs
- [x] Configured Prettier with Tailwind plugin (prettier-plugin-tailwindcss)
- [x] Created .prettierignore
- [x] Added npm scripts: `format` and `format:check`
- [x] Configured tailwind functions: clsx, cn
- [x] Committed Prettier config

### 9.3 Husky Pre-commit Hooks ✅ COMPLETE

- [x] Installed Husky and lint-staged: `npm install -D husky lint-staged`
- [x] Initialized Husky: `npx husky init`
- [x] Created .husky/pre-commit hook with `npx lint-staged`
- [x] Made pre-commit hook executable
- [x] Configured lint-staged in package.json:
  - [x] Run ESLint --fix on TS/JS files
  - [x] Run Prettier --write on TS/JS files
  - [x] Run Prettier on JSON/MD/CSS files
- [x] Committed Husky configuration

### 9.4 Vitest Setup

- [ ] Create vitest.config.ts
- [ ] Add npm scripts:
  - [ ] `"test": "vitest"`
  - [ ] `"test:coverage": "vitest --coverage"`
- [ ] Create tests/unit/ directory
- [ ] Write unit tests for:
  - [ ] lib/utils.ts functions
  - [ ] Validation schemas
  - [ ] Helper functions
- [ ] Run tests and verify passing
- [ ] Commit test configuration

### 9.5 Playwright E2E Setup

- [ ] Create playwright.config.ts
- [ ] Install browsers: `npx playwright install`
- [ ] Add npm scripts:
  - [ ] `"test:e2e": "playwright test"`
  - [ ] `"test:e2e:ui": "playwright test --ui"`
- [ ] Create tests/e2e/ directory
- [ ] Write E2E tests for:
  - [ ] Homepage loads
  - [ ] Navigation works
  - [ ] Sign up flow
  - [ ] Login flow
  - [ ] Protected route access
  - [ ] Blog post viewing
- [ ] Run tests and verify passing
- [ ] Commit E2E tests

### 9.6 Accessibility Testing

- [ ] Install axe: `npm install -D @axe-core/playwright`
- [ ] Create tests/e2e/accessibility.spec.ts
- [ ] Test all major pages for WCAG violations
- [ ] Fix any accessibility issues found
- [ ] Run axe tests and verify passing
- [ ] Commit accessibility tests

### 9.7 Manual Testing Checklist

- [ ] Test all pages in both English and French
- [ ] Test all forms with valid/invalid data
- [ ] Test authentication flows
- [ ] Test protected routes
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Test dark mode (if implemented)
- [ ] Test performance with Lighthouse
- [ ] Document any issues found

---

## Phase 10: Performance Optimization

### 10.1 Image Optimization

- [ ] Audit all images in project
- [ ] Convert to Next.js Image component
- [ ] Set proper width/height
- [ ] Add priority to above-fold images
- [ ] Optimize images in Sanity
- [ ] Test image loading performance
- [ ] Commit optimizations

### 10.2 Code Splitting

- [ ] Identify large client components
- [ ] Implement dynamic imports where appropriate
- [ ] Use React.lazy for heavy components
- [ ] Test bundle size reduction
- [ ] Commit code splitting

### 10.3 Bundle Analysis

- [ ] Install bundle analyzer: `npm install -D @next/bundle-analyzer`
- [ ] Configure in next.config.ts
- [ ] Run analysis: `ANALYZE=true npm run build`
- [ ] Review bundle sizes
- [ ] Optimize largest bundles
- [ ] Document bundle size metrics
- [ ] Commit optimizations

### 10.4 Font Optimization

- [ ] Use next/font for Google Fonts
- [ ] Configure font loading strategy
- [ ] Add font-display: swap
- [ ] Preload critical fonts
- [ ] Test font loading performance
- [ ] Commit font optimization

### 10.5 Caching Strategy

- [ ] Configure ISR revalidation times:
  - [ ] Homepage: 3600 (1 hour)
  - [ ] Blog posts: On-demand (webhook)
  - [ ] Static pages: 86400 (1 day)
- [ ] Implement cache tags for granular revalidation
- [ ] Test cache behavior
- [ ] Document caching strategy
- [ ] Commit caching configuration

---

## Phase 11: Vercel Deployment ⚡ PRIORITY AFTER PHASE 7

**Status**: Ready to execute once marketing pages are complete.

### 11.1 Prepare for Deployment

- [ ] Create production build locally: `npm run build`
- [ ] Fix any build errors
- [ ] Test production build: `npm run start`
- [ ] Verify all marketing pages render correctly
- [ ] Run ESLint and type checking
- [ ] Commit all changes

### 11.2 Initial Vercel Deployment

- [ ] Push code to GitHub repository
- [ ] Login to Vercel Dashboard
- [ ] Import GitHub repository
- [ ] Verify auto-detected settings
- [ ] Deploy to Vercel
- [ ] Verify deployment successful
- [ ] Note preview URL

### 11.3 Environment Variables in Vercel

- [ ] Go to Project Settings → Environment Variables
- [ ] Add production environment variables:
  - [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
  - [ ] NEXT_PUBLIC_SANITY_DATASET
  - [ ] SANITY_API_TOKEN
  - [ ] NEXT_PUBLIC_SITE_URL
  - [ ] (Supabase vars not needed yet - auth deferred)
- [ ] Set variables for different environments:
  - [ ] Production
  - [ ] Preview
- [ ] Redeploy to apply variables
- [ ] Test environment variables work

### 11.4 Custom Domain Setup

- [ ] Go to Project Settings → Domains
- [ ] Add domain: kilalo.com (or staging subdomain first)
- [ ] Add www subdomain: www.kilalo.com
- [ ] Configure DNS:
  - [ ] Option A: Use Vercel nameservers (recommended)
  - [ ] Option B: Add A and CNAME records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate issued
- [ ] Set www to redirect to root domain
- [ ] Test domain works

### 11.5 Configure Sanity for Production

- [ ] Add production domain to Sanity CORS origins
- [ ] Create webhook for production (optional - ISR can work without)
- [ ] Test content updates from Sanity Studio
- [ ] Verify content appears on production

### 11.6 Enable Analytics

- [ ] Install Vercel Analytics: `npm install @vercel/analytics`
- [ ] Add Analytics component to root layout
- [ ] Install Speed Insights: `npm install @vercel/speed-insights`
- [ ] Add SpeedInsights component to root layout
- [ ] Deploy updates
- [ ] Verify analytics tracking in Vercel dashboard

### 11.7 Production Verification

- [ ] Test all pages load on production (both EN and FR)
- [ ] Test navigation and language switching
- [ ] Test contact form submission
- [ ] Test content updates from Sanity
- [ ] Run Lighthouse audit (target: 90+ all metrics)
- [ ] Check Web Vitals scores
- [ ] Verify no console errors
- [ ] Test on mobile, tablet, desktop
- [ ] Document production URL

---

## Phase 12: Staging Environment (Optional)

### 12.1 Create Staging Branch

- [ ] Create staging branch: `git checkout -b staging`
- [ ] Push to GitHub: `git push origin staging`
- [ ] Configure branch protection rules

### 12.2 Staging Deployment

- [ ] Create new Vercel project or configure existing
- [ ] Link staging branch
- [ ] Set up staging subdomain: staging.kilalo.com
- [ ] Configure staging environment variables
- [ ] Deploy staging branch
- [ ] Verify staging deployment

### 12.3 Staging Workflow

- [ ] Document staging workflow:
  - [ ] Feature branches → PR to staging
  - [ ] Test on staging
  - [ ] Staging → PR to main
  - [ ] Deploy to production
- [ ] Train team on workflow
- [ ] Add workflow to documentation

---

## Phase 13: Documentation & Handoff

### 13.1 Project Documentation

- [ ] Update README.md:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Getting started
  - [ ] Development workflow
  - [ ] Deployment process
  - [ ] Environment variables
- [ ] Create CONTRIBUTING.md (if open to contributions)
- [ ] Document all npm scripts
- [ ] Document folder structure
- [ ] Commit documentation

### 13.2 API Documentation

- [ ] Document all API routes
- [ ] Document server actions
- [ ] Document Supabase queries
- [ ] Document Sanity GROQ queries
- [ ] Create API reference document

### 13.3 Content Management Guide

- [ ] Create guide for content editors:
  - [ ] How to access Sanity Studio
  - [ ] How to create blog posts
  - [ ] How to update pages
  - [ ] Image best practices
  - [ ] SEO guidelines
- [ ] Create video tutorials (optional)
- [ ] Train content team

### 13.4 Deployment Runbook

- [ ] Document deployment process
- [ ] Document rollback procedures
- [ ] Document environment variables
- [ ] Document common issues and solutions
- [ ] Create incident response plan

---

## Phase 14: Monitoring & Maintenance

### 14.1 Set Up Monitoring

- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure uptime monitoring
- [ ] Set up performance budgets
- [ ] Configure alerts for:
  - [ ] Deployment failures
  - [ ] Error rate spikes
  - [ ] Performance degradation

### 14.2 Regular Maintenance Tasks

- [ ] Schedule weekly dependency updates
- [ ] Schedule monthly security audits
- [ ] Schedule quarterly performance reviews
- [ ] Plan content audit schedule
- [ ] Plan feature roadmap reviews

### 14.3 Backup Strategy

- [ ] Document Supabase backup strategy
- [ ] Document Sanity backup/export process
- [ ] Set up automated database backups
- [ ] Test restore procedures
- [ ] Document backup locations

---

## 🎯 IMMEDIATE ROADMAP TO LAUNCH

### Current Status
- ✅ Phase 1-3: Foundation, styling, UI components complete
- ✅ Phase 4: Internationalization complete (explicit EN/FR fields)
- ✅ Phase 5a: Basic Supabase setup complete
- ✅ Phase 6: Sanity CMS integration complete with all content migrated
- 🎯 **NEXT**: Phase 7 - Complete marketing pages
- 🎯 **THEN**: Phase 11 - Deploy to Vercel

### What's Needed for Launch
1. **Marketing Layout** (header, footer, navigation)
2. **Core Pages**:
   - Homepage (hero, impact metrics, venture showcase)
   - About page (story, team, mission)
   - Programs pages (V2S, Hekima Time)
   - Ventures portfolio
   - Case studies
   - Community/Events
   - Contact page
   - Legal pages (privacy, terms)
3. **SEO & Performance**:
   - Metadata for all pages
   - Image optimization
   - Basic performance testing
4. **Deployment**:
   - Vercel setup
   - Domain configuration
   - Analytics integration

### Post-Launch (Phase 2)
- Authentication and user management
- Member portal and dashboard
- Learning platform features
- Advanced community features

---

## Success Criteria (MVP Launch)

### Technical Requirements
- [ ] All pages load in < 2 seconds
- [ ] Lighthouse scores > 85 for all metrics (target 90+)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] Works on all modern browsers
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Accessible (basic WCAG compliance)

### Functional Requirements
- [ ] Site available in English and French
- [ ] Language switching works correctly
- [ ] Contact form validates and submits
- [ ] Content updates from Sanity appear correctly
- [ ] All navigation links work
- [ ] All images load and are optimized

### Business Requirements
- [ ] Production site is live at domain
- [ ] SSL certificate is valid
- [ ] Analytics are tracking correctly
- [ ] Content team can manage content via Sanity Studio
- [ ] Site performs well on mobile devices
- [ ] Basic documentation is available

---

## Notes & Decisions Log

### Technology Decisions
- **Framework**: Next.js 16 App Router with Turbopack for SEO, performance, and Vercel integration
- **Styling**: Tailwind CSS + shadcn/ui chosen over MUI for custom branding flexibility
- **Backend**: Supabase chosen for integrated auth, database, and storage (auth deferred to Phase 2)
- **CMS**: Sanity.io chosen for structured content and real-time collaboration
- **i18n**: next-intl + explicit EN/FR fields (abandoned plugin approach due to RSC incompatibility)
- **Testing**: Playwright + Vitest for comprehensive testing strategy (TBD)

### Recent Decisions (Oct 2024)
- **Internationalization Approach**: Switched from `sanity-plugin-internationalized-array` to explicit field naming (fieldEn/fieldFr) due to React Server Components incompatibility with React 19
- **React Version**: Kept React 19.2.0 (Sanity v4.11.0 supports it); fixed Studio error by adding `'use client'` directive
- **UI Translations**: Created `siteSettings` schema in Sanity for CMS-managed UI text (alternative to JSON files)
- **Launch Strategy**: Prioritizing marketing site completion and deployment; deferring authentication and member portal to post-launch Phase 2

### Deferred to Post-Launch
- **Authentication**: Email/password login, OAuth providers (Google, GitHub)
- **Member Portal**: Dashboard, profile management, settings, learning platform
- **LMS Integration**: Course management, progress tracking, member-only content
- **Advanced Testing**: Full Playwright E2E suite, accessibility testing, unit tests
- **Email Service**: Contact form will use simple approach; full email service for later

### Phase 1 MVP Focus
- Complete marketing website with bilingual content
- Core pages: Home, About, Programs, Ventures, Case Studies, Community, Contact
- Content management via Sanity Studio
- Deploy to Vercel with custom domain
- Basic analytics and performance monitoring

### Risk Mitigation
- **Type safety**: Strict TypeScript to catch errors early
- **Incremental deployment**: Launch marketing site first, add features in Phase 2
- **Content migration**: All content successfully migrated to bilingual format
- **Monitoring**: Vercel Analytics and Speed Insights for performance tracking
- **Rollback capability**: Vercel instant rollback for quick recovery

---

## Contact & Support

**Project Owner**: Corey West
**Repository**: [GitHub URL]
**Production URL**: https://kilalo.com (when live)
**Staging URL**: https://staging.kilalo.com (when live)
**Sanity Studio**: https://kilalo.com/studio

---

**Last Updated**: 2025-10-27
**Plan Version**: 1.2 - ESLint TypeScript Fixes
