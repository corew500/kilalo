# Kilalo Project Implementation Plan

**Last Updated**: 2025-10-25
**Project**: Kilalo Marketing Website with Member Portal
**Tech Stack**: Next.js 15, Supabase, Sanity.io, Tailwind CSS, shadcn/ui

---

## Phase 1: Prerequisites & Account Setup

Before any code implementation, these accounts and services must be set up:

### 1.1 Required Service Signups

- [ ] **Vercel Account**
  - URL: https://vercel.com/signup
  - Action: Sign up with GitHub account
  - Purpose: Application deployment and hosting
  - Plan: Start with Hobby (Free), upgrade to Pro ($20/mo) for production
  - Note: Save project URL after creation

- [ ] **Supabase Account**
  - URL: https://supabase.com
  - Action: Create account and two projects
  - Projects needed:
    - [ ] Kilalo Development (for local dev and Vercel preview deployments)
    - [ ] Kilalo Production (for live site)
  - For each project, save:
    - [ ] Project URL (https://xxx.supabase.co)
    - [ ] Anon/Public Key
    - [ ] Service Role Key (keep secret!)
    - [ ] Database Password
  - Plan: Start Free, upgrade to Pro ($25/mo) when scaling
  - Region: Choose closest to target users
  - Note: Development environment will be shared between local and preview deployments

- [ ] **Sanity.io Account**
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

- [ ] **GitHub Repository**
  - Action: Create repository for Kilalo project
  - Name: kilalo (or preferred name)
  - Visibility: Private (recommended) or Public
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

- [ ] **Node.js 20 LTS**
  - Check: Run `node --version` (should be v20.x.x+)
  - Install: https://nodejs.org or use nvm

- [ ] **Package Manager**
  - npm (included with Node.js) - recommended
  - Or pnpm/yarn if preferred

- [ ] **Git**
  - Check: Run `git --version`
  - Install: https://git-scm.com

- [ ] **Code Editor**
  - Recommended: VS Code with extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - TypeScript extension

---

## Phase 2: Project Foundation Setup

### 2.1 Initialize Next.js Project

- [ ] Navigate to project directory
- [ ] Run Next.js initialization:
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
- [ ] Verify installation successful
- [ ] Test dev server: `npm run dev`
- [ ] Commit initial setup to Git

### 2.2 Install Core Dependencies

- [ ] Install Supabase packages:
  ```bash
  npm install @supabase/ssr @supabase/supabase-js
  ```

- [ ] Install Sanity packages:
  ```bash
  npm install next-sanity sanity @sanity/vision @sanity/image-url
  ```

- [ ] Install i18n package:
  ```bash
  npm install next-intl
  ```

- [ ] Install utility packages:
  ```bash
  npm install zod date-fns clsx tailwind-merge
  ```

- [ ] Install dev dependencies:
  ```bash
  npm install -D @types/node @playwright/test vitest \
    @vitejs/plugin-react @testing-library/react \
    @testing-library/jest-dom @axe-core/react \
    eslint-plugin-jsx-a11y prettier prettier-plugin-tailwindcss
  ```

- [ ] Verify all packages installed
- [ ] Commit package.json and package-lock.json

### 2.3 Configure TypeScript (Strict Mode)

- [ ] Update tsconfig.json with strict settings
- [ ] Enable all strict type-checking options:
  - [ ] `strict: true`
  - [ ] `noUncheckedIndexedAccess: true`
  - [ ] `noImplicitOverride: true`
  - [ ] `noUnusedLocals: true`
  - [ ] `noUnusedParameters: true`
  - [ ] `noFallthroughCasesInSwitch: true`
  - [ ] `noImplicitReturns: true`
  - [ ] `exactOptionalPropertyTypes: true`
- [ ] Verify TypeScript compilation works
- [ ] Commit tsconfig.json

### 2.4 Create Project Structure

- [ ] Create directory structure:
  ```bash
  mkdir -p app/{api,[locale]/{(marketing),(auth),(member)}}
  mkdir -p components/{ui,marketing,member,auth,shared}
  mkdir -p lib/{supabase,sanity,validations}
  mkdir -p hooks messages sanity/schemas/{documents,objects}
  mkdir -p tests/{e2e,unit,fixtures} types
  mkdir -p public/{images,icons}
  ```
- [ ] Verify directory structure
- [ ] Create .gitkeep files in empty directories
- [ ] Commit structure

---

## Phase 3: Styling & UI Components

### 3.1 Configure Tailwind CSS

- [ ] Update tailwind.config.ts with custom theme
- [ ] Implement Kilalo color palette:
  - [ ] Primary Teal (#215965)
  - [ ] Secondary Orange (#F39200)
  - [ ] Forest Green (#21654f)
  - [ ] Navy Blue (#213765)
  - [ ] Rust (#652d21)
  - [ ] Purple (#2d2165)
  - [ ] Plum (#652159)
- [ ] Configure dark mode support
- [ ] Set up custom fonts (Inter, Satoshi)
- [ ] Test Tailwind classes working
- [ ] Commit tailwind.config.ts

### 3.2 Install shadcn/ui

- [ ] Initialize shadcn/ui:
  ```bash
  npx shadcn@latest init
  ```
- [ ] Install essential components:
  - [ ] Button: `npx shadcn@latest add button`
  - [ ] Card: `npx shadcn@latest add card`
  - [ ] Form: `npx shadcn@latest add form`
  - [ ] Input: `npx shadcn@latest add input`
  - [ ] Label: `npx shadcn@latest add label`
  - [ ] Dialog: `npx shadcn@latest add dialog`
  - [ ] Dropdown Menu: `npx shadcn@latest add dropdown-menu`
  - [ ] Toast: `npx shadcn@latest add toast`
- [ ] Create lib/utils.ts with cn() helper
- [ ] Test components render correctly
- [ ] Commit components/ui/

### 3.3 Set Up Global Styles

- [ ] Update app/globals.css with:
  - [ ] Tailwind directives
  - [ ] CSS custom properties
  - [ ] Base styles
  - [ ] OKLCH color space support
- [ ] Implement theme provider for dark mode
- [ ] Test theme switching
- [ ] Commit globals.css

---

## Phase 4: Internationalization (i18n)

### 4.1 Configure next-intl

- [ ] Create lib/i18n/routing.ts
- [ ] Configure supported locales (en, fr)
- [ ] Set default locale (en)
- [ ] Create middleware.ts for i18n routing
- [ ] Test locale routing works
- [ ] Commit i18n configuration

### 4.2 Create Translation Files

- [ ] Create messages/en.json:
  - [ ] Navigation translations
  - [ ] HomePage translations
  - [ ] Auth translations
  - [ ] Common translations
  - [ ] Error messages
- [ ] Create messages/fr.json:
  - [ ] Mirror English structure
  - [ ] Translate all strings
  - [ ] Verify translation completeness
- [ ] Commit translation files

### 4.3 Set Up Locale Layouts

- [ ] Create app/layout.tsx (root layout)
- [ ] Create app/[locale]/layout.tsx (locale-specific)
- [ ] Implement NextIntlClientProvider
- [ ] Create language switcher component
- [ ] Test switching between en/fr
- [ ] Commit layout files

---

## Phase 5: Supabase Integration

### 5.1 Environment Variables Setup

- [ ] Create .env.local file
- [ ] Add Supabase environment variables:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] Create .env.local.example (without values)
- [ ] Verify .env.local is in .gitignore
- [ ] Test environment variables load
- [ ] Commit .env.local.example only

### 5.2 Create Supabase Clients

- [ ] Create lib/supabase/config.ts
- [ ] Create lib/supabase/server.ts (Server Component client)
- [ ] Create lib/supabase/client.ts (Client Component client)
- [ ] Create lib/supabase/middleware.ts (Middleware client)
- [ ] Create lib/supabase/admin.ts (Admin client - server only)
- [ ] Test clients connect successfully
- [ ] Commit Supabase utilities

### 5.3 Database Schema Setup

- [ ] Create profiles table in Supabase:
  - [ ] id (uuid, primary key, references auth.users)
  - [ ] email (text, unique)
  - [ ] full_name (text)
  - [ ] avatar_url (text)
  - [ ] bio (text)
  - [ ] website (text)
  - [ ] preferred_language (text, default 'en')
  - [ ] created_at, updated_at (timestamps)
- [ ] Create handle_new_user() trigger function
- [ ] Create on_auth_user_created trigger
- [ ] Create handle_updated_at() function
- [ ] Create indexes on profiles table
- [ ] Test profile creation on signup
- [ ] Document schema in docs/

### 5.4 Row Level Security (RLS)

- [ ] Enable RLS on profiles table
- [ ] Create RLS policy: "Profiles are viewable by everyone"
- [ ] Create RLS policy: "Users can update own profile"
- [ ] Create RLS policy: "Users can insert own profile"
- [ ] Test RLS policies work correctly
- [ ] Document RLS policies

### 5.5 Authentication Setup

- [ ] Configure email authentication in Supabase Dashboard
- [ ] Customize email templates:
  - [ ] Confirm signup template
  - [ ] Magic link template
  - [ ] Reset password template
- [ ] Configure URL settings in Supabase:
  - [ ] Site URL
  - [ ] Redirect URLs (localhost, production, Vercel previews)
- [ ] Create app/actions/auth.ts:
  - [ ] signUp() server action
  - [ ] signIn() server action
  - [ ] signOut() server action
- [ ] Create components/auth/login-form.tsx
- [ ] Create components/auth/signup-form.tsx
- [ ] Create app/[locale]/(auth)/login/page.tsx
- [ ] Create app/[locale]/(auth)/signup/page.tsx
- [ ] Create app/api/auth/callback/route.ts
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Commit auth implementation

### 5.6 OAuth Providers (Optional)

- [ ] Configure Google OAuth in Supabase
- [ ] Configure GitHub OAuth in Supabase
- [ ] Create components/auth/oauth-buttons.tsx
- [ ] Add OAuth buttons to login/signup pages
- [ ] Test Google sign-in
- [ ] Test GitHub sign-in
- [ ] Commit OAuth implementation

### 5.7 Protected Routes

- [ ] Update middleware.ts for auth checks
- [ ] Create lib/supabase/queries.ts:
  - [ ] getCurrentUser()
  - [ ] getCurrentUserProfile()
  - [ ] requireAuth()
- [ ] Create app/[locale]/(member)/dashboard/page.tsx
- [ ] Create app/[locale]/(member)/profile/page.tsx
- [ ] Test protected route redirection
- [ ] Test authenticated access
- [ ] Commit protected routes

### 5.8 Type Generation

- [ ] Install Supabase CLI: `npm install -D supabase`
- [ ] Login to Supabase CLI: `npx supabase login`
- [ ] Link project: `npx supabase link --project-ref [ID]`
- [ ] Generate types: `npx supabase gen types typescript --linked > types/supabase.ts`
- [ ] Add npm script: `"db:types": "npx supabase gen types typescript --linked > types/supabase.ts"`
- [ ] Test type-safe queries
- [ ] Commit generated types

---

## Phase 6: Sanity CMS Integration

### 6.1 Initialize Sanity Project

- [ ] Run Sanity initialization: `npx sanity@latest init`
- [ ] Select "Create new project"
- [ ] Name: "Kilalo"
- [ ] Use default dataset: Yes
- [ ] Template: Clean project
- [ ] Package manager: npm
- [ ] Verify sanity.config.ts created
- [ ] Commit Sanity configuration

### 6.2 Environment Variables

- [ ] Add to .env.local:
  - [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
  - [ ] NEXT_PUBLIC_SANITY_DATASET
  - [ ] SANITY_API_TOKEN
  - [ ] SANITY_WEBHOOK_SECRET
- [ ] Get API token from Sanity Dashboard
- [ ] Update .env.local.example
- [ ] Test environment variables
- [ ] Commit .env.local.example

### 6.3 Sanity Client Setup

- [ ] Create src/sanity/lib/client.ts
- [ ] Create src/sanity/lib/image.ts (image URL builder)
- [ ] Configure client with:
  - [ ] projectId, dataset, apiVersion
  - [ ] useCdn: false (for ISR)
  - [ ] perspective: 'published'
- [ ] Test client connection
- [ ] Commit Sanity utilities

### 6.4 Embed Sanity Studio

- [ ] Create src/app/studio/[[...tool]]/page.tsx
- [ ] Configure metadata and viewport
- [ ] Import sanity.config.ts
- [ ] Set dynamic = 'force-static'
- [ ] Test Studio loads at /studio
- [ ] Verify can create content
- [ ] Commit Studio integration

### 6.5 Create Content Schemas

- [ ] Create sanity/schemas/documents/post.ts:
  - [ ] title, slug, author (reference)
  - [ ] mainImage, categories, publishedAt
  - [ ] excerpt, body (blockContent)
- [ ] Create sanity/schemas/documents/page.ts:
  - [ ] title, slug, body
  - [ ] seo metadata fields
- [ ] Create sanity/schemas/documents/author.ts:
  - [ ] name, slug, image, bio
- [ ] Create sanity/schemas/documents/category.ts:
  - [ ] title, slug, description
- [ ] Create sanity/schemas/objects/blockContent.ts:
  - [ ] Rich text configuration
  - [ ] Headings, lists, links, images
- [ ] Update sanity.config.ts with all schemas
- [ ] Test schemas in Studio
- [ ] Commit all schemas

### 6.6 Internationalization Setup

- [ ] Install i18n plugin: `npm install @sanity/document-internationalization`
- [ ] Configure in sanity.config.ts:
  - [ ] supportedLanguages: en, fr
  - [ ] schemaTypes: post, page
- [ ] Update schemas for localized fields
- [ ] Test creating content in both languages
- [ ] Commit i18n configuration

### 6.7 GROQ Queries

- [ ] Create src/sanity/lib/queries.ts:
  - [ ] POSTS_QUERY (all posts)
  - [ ] POST_QUERY (single post by slug)
  - [ ] POST_SLUGS_QUERY (for static generation)
  - [ ] PAGE_QUERY (page by slug)
  - [ ] PAGES_QUERY (all pages)
- [ ] Test queries in Studio Vision tool
- [ ] Commit query definitions

### 6.8 Type Generation

- [ ] Create sanity-typegen.json
- [ ] Add npm scripts:
  - [ ] "predev": "npm run typegen"
  - [ ] "prebuild": "npm run typegen"
  - [ ] "typegen": "sanity schema extract && sanity typegen generate"
- [ ] Run type generation: `npm run typegen`
- [ ] Verify types generated in src/sanity/types.ts
- [ ] Test type-safe queries
- [ ] Commit type configuration

### 6.9 Webhooks for ISR

- [ ] Create src/app/api/revalidate/route.ts
- [ ] Implement webhook handler with signature validation
- [ ] Implement tag-based revalidation
- [ ] Generate webhook secret
- [ ] Configure webhook in Sanity Dashboard:
  - [ ] URL: https://your-domain.com/api/revalidate
  - [ ] Dataset: production
  - [ ] Events: Create, Update, Delete
  - [ ] Filter: _type == "post" || _type == "page"
- [ ] Add SANITY_WEBHOOK_SECRET to .env.local
- [ ] Test webhook triggers revalidation
- [ ] Commit webhook implementation

---

## Phase 7: Content & Pages Implementation

### 7.1 Marketing Layout

- [ ] Create app/[locale]/(marketing)/layout.tsx
- [ ] Create components/marketing/header.tsx:
  - [ ] Logo, navigation links
  - [ ] Language switcher
  - [ ] Sign in/Sign up buttons
  - [ ] Mobile menu
- [ ] Create components/marketing/footer.tsx:
  - [ ] Site links, social media
  - [ ] Legal links (privacy, terms)
  - [ ] Newsletter signup (optional)
- [ ] Style with Tailwind and brand colors
- [ ] Test responsive design
- [ ] Commit marketing layout

### 7.2 Homepage

- [ ] Create app/[locale]/(marketing)/page.tsx
- [ ] Create components/marketing/hero.tsx
- [ ] Create components/marketing/features.tsx
- [ ] Create components/marketing/testimonials.tsx
- [ ] Create components/marketing/cta.tsx
- [ ] Fetch content from Sanity
- [ ] Implement SEO metadata
- [ ] Test ISR revalidation
- [ ] Commit homepage

### 7.3 About Page

- [ ] Create app/[locale]/(marketing)/about/page.tsx
- [ ] Fetch content from Sanity
- [ ] Implement team section
- [ ] Implement mission/vision
- [ ] Add SEO metadata
- [ ] Commit about page

### 7.4 Services Pages

- [ ] Create app/[locale]/(marketing)/services/page.tsx (listing)
- [ ] Create app/[locale]/(marketing)/services/[slug]/page.tsx
- [ ] Implement generateStaticParams
- [ ] Fetch services from Sanity
- [ ] Create service detail template
- [ ] Add SEO metadata per service
- [ ] Commit services pages

### 7.5 Blog

- [ ] Create app/[locale]/(marketing)/blog/page.tsx:
  - [ ] Fetch posts from Sanity
  - [ ] Implement pagination
  - [ ] Add category filtering
  - [ ] Add search (optional)
- [ ] Create app/[locale]/(marketing)/blog/[slug]/page.tsx:
  - [ ] Fetch post by slug
  - [ ] Render Portable Text body
  - [ ] Show author info
  - [ ] Related posts section
  - [ ] Social sharing (optional)
- [ ] Implement generateStaticParams for all posts
- [ ] Add SEO metadata per post
- [ ] Test ISR with tag revalidation
- [ ] Commit blog implementation

### 7.6 Contact Page

- [ ] Create app/[locale]/(marketing)/contact/page.tsx
- [ ] Create components/marketing/contact-form.tsx
- [ ] Create app/api/contact/route.ts:
  - [ ] Validate form with Zod
  - [ ] Send email (Resend or similar)
  - [ ] Store submission in Supabase (optional)
- [ ] Add form validation and error handling
- [ ] Add success message
- [ ] Test form submission
- [ ] Commit contact page

### 7.7 Legal Pages

- [ ] Create app/[locale]/(marketing)/legal/privacy/page.tsx
- [ ] Create app/[locale]/(marketing)/legal/terms/page.tsx
- [ ] Fetch content from Sanity or use static content
- [ ] Add last updated dates
- [ ] Commit legal pages

---

## Phase 8: Member Portal

### 8.1 Member Layout

- [ ] Create app/[locale]/(member)/layout.tsx
- [ ] Create components/member/dashboard-nav.tsx:
  - [ ] Navigation links
  - [ ] User profile dropdown
  - [ ] Logout button
- [ ] Create components/member/sidebar.tsx (optional)
- [ ] Style member portal theme
- [ ] Commit member layout

### 8.2 Dashboard

- [ ] Create app/[locale]/(member)/dashboard/page.tsx:
  - [ ] Welcome message with user name
  - [ ] Quick stats/overview
  - [ ] Recent activity
  - [ ] Quick actions
- [ ] Fetch user-specific data from Supabase
- [ ] Implement loading states
- [ ] Test with authenticated user
- [ ] Commit dashboard

### 8.3 Profile Management

- [ ] Create app/[locale]/(member)/profile/page.tsx (view)
- [ ] Create app/[locale]/(member)/profile/edit/page.tsx:
  - [ ] Form to update profile fields
  - [ ] Avatar upload
  - [ ] Language preference
- [ ] Create app/actions/profile.ts:
  - [ ] updateProfile() server action
  - [ ] uploadAvatar() server action
- [ ] Implement form validation
- [ ] Test profile updates
- [ ] Commit profile pages

### 8.4 Settings

- [ ] Create app/[locale]/(member)/settings/page.tsx:
  - [ ] Account settings
  - [ ] Email preferences
  - [ ] Password change
  - [ ] Delete account (optional)
- [ ] Create app/actions/settings.ts
- [ ] Implement password change flow
- [ ] Test all settings
- [ ] Commit settings page

### 8.5 Classes/Learning (Future - Placeholder)

- [ ] Create app/[locale]/(member)/classes/page.tsx:
  - [ ] "Coming soon" message
  - [ ] Or basic course listing from Sanity
- [ ] Create app/[locale]/(member)/classes/[id]/page.tsx (placeholder)
- [ ] Document future LMS integration approach
- [ ] Commit placeholder pages

---

## Phase 9: Testing & Quality Assurance

### 9.1 ESLint Configuration

- [ ] Update eslint.config.mjs:
  - [ ] next/core-web-vitals rules
  - [ ] @typescript-eslint rules
  - [ ] jsx-a11y accessibility rules
  - [ ] Import ordering rules
- [ ] Fix all ESLint errors
- [ ] Add npm script: `"lint": "next lint"`
- [ ] Test linting works
- [ ] Commit ESLint config

### 9.2 Prettier Setup

- [ ] Create prettier.config.mjs
- [ ] Configure Prettier with Tailwind plugin
- [ ] Add npm script: `"format": "prettier --write ."`
- [ ] Format entire codebase
- [ ] Commit Prettier config

### 9.3 Husky Pre-commit Hooks

- [ ] Install Husky: `npm install -D husky lint-staged`
- [ ] Initialize Husky: `npx husky init`
- [ ] Create pre-commit hook:
  - [ ] Run lint-staged
  - [ ] Run type checking
  - [ ] Run linting
- [ ] Configure lint-staged in package.json
- [ ] Test pre-commit hook
- [ ] Commit Husky configuration

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

## Phase 11: Vercel Deployment

### 11.1 Prepare for Deployment

- [ ] Create production build locally: `npm run build`
- [ ] Fix any build errors
- [ ] Test production build: `npm run start`
- [ ] Verify all pages render correctly
- [ ] Run full test suite
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
- [ ] Add all production environment variables:
  - [ ] Supabase variables
  - [ ] Sanity variables
  - [ ] App URL
- [ ] Set variables for different environments:
  - [ ] Production
  - [ ] Preview
  - [ ] Development (optional)
- [ ] Redeploy to apply variables
- [ ] Test environment variables work

### 11.4 Custom Domain Setup

- [ ] Go to Project Settings → Domains
- [ ] Add domain: kilalo.com
- [ ] Add www subdomain: www.kilalo.com
- [ ] Configure DNS:
  - [ ] Option A: Use Vercel nameservers (recommended)
  - [ ] Option B: Add A and CNAME records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate issued
- [ ] Set www to redirect to root domain
- [ ] Test domain works

### 11.5 Configure Sanity Webhook

- [ ] Update Sanity webhook URL to production domain
- [ ] Test webhook triggers revalidation
- [ ] Verify content updates propagate

### 11.6 Configure Supabase Redirect URLs

- [ ] Add production domain to Supabase redirect URLs
- [ ] Add Vercel preview domain pattern
- [ ] Test authentication flows on production

### 11.7 Enable Analytics

- [ ] Install Vercel Analytics: `npm install @vercel/analytics`
- [ ] Add Analytics component to layout
- [ ] Install Speed Insights: `npm install @vercel/speed-insights`
- [ ] Add SpeedInsights component to layout
- [ ] Deploy updates
- [ ] Verify analytics tracking

### 11.8 Production Verification

- [ ] Test all pages load on production
- [ ] Test authentication flows
- [ ] Test form submissions
- [ ] Test content updates from Sanity
- [ ] Run Lighthouse audit
- [ ] Check Web Vitals scores
- [ ] Verify no console errors
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

## Success Criteria

### Technical Requirements
- [ ] All pages load in < 2 seconds
- [ ] Lighthouse scores > 90 for all metrics
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] 100% test coverage for critical paths
- [ ] WCAG 2.1 AA compliant
- [ ] Works on all modern browsers
- [ ] Fully responsive (mobile, tablet, desktop)

### Functional Requirements
- [ ] User can sign up with email
- [ ] User can log in with email/password
- [ ] User can reset password
- [ ] User can update profile
- [ ] User can access member dashboard
- [ ] Content updates from Sanity appear within 5 minutes
- [ ] Site available in English and French
- [ ] All forms validate and submit correctly
- [ ] Protected routes require authentication

### Business Requirements
- [ ] Production site is live at kilalo.com
- [ ] SSL certificate is valid
- [ ] Analytics are tracking correctly
- [ ] Content team can manage content independently
- [ ] Staging environment is available for testing
- [ ] Documentation is complete and accessible

---

## Notes & Decisions Log

### Technology Decisions
- **Framework**: Next.js 15 App Router chosen for SEO, performance, and Vercel integration
- **Styling**: Tailwind CSS + shadcn/ui chosen over MUI for custom branding flexibility
- **Backend**: Supabase chosen for integrated auth, database, and storage
- **CMS**: Sanity.io chosen for structured content and real-time collaboration
- **i18n**: next-intl chosen for Next.js App Router compatibility
- **Testing**: Playwright + Vitest for comprehensive testing strategy

### Deferred Features
- **LMS Integration**: Deferred to future phase; using custom learning features with Supabase for MVP
- **Advanced Analytics**: Starting with Vercel Analytics; can add more later
- **Email Service**: Will decide on Resend, SendGrid, or similar during contact form implementation

### Risk Mitigation
- **Separate environments**: Dev, Staging, Production to prevent production issues
- **Type safety**: Strict TypeScript to catch errors early
- **Testing**: Comprehensive test suite for confidence in changes
- **Monitoring**: Multiple layers of monitoring for early issue detection
- **Rollback capability**: Vercel instant rollback for quick recovery

---

## Contact & Support

**Project Owner**: Corey West
**Repository**: [GitHub URL]
**Production URL**: https://kilalo.com (when live)
**Staging URL**: https://staging.kilalo.com (when live)
**Sanity Studio**: https://kilalo.com/studio

---

**Last Updated**: 2025-10-25
**Plan Version**: 1.0
