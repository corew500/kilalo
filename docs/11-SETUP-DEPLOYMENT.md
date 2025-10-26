# Vercel Deployment Guide

This guide covers deploying the Kilalo Next.js application to Vercel with production-ready configuration.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Deployment](#initial-deployment)
4. [GitHub Integration](#github-integration)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Preview Deployments](#preview-deployments)
8. [Edge Configuration](#edge-configuration)
9. [ISR and Revalidation](#isr-and-revalidation)
10. [Analytics and Monitoring](#analytics-and-monitoring)
11. [Performance Optimization](#performance-optimization)
12. [Rollback Procedures](#rollback-procedures)
13. [Multi-Environment Setup](#multi-environment-setup)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Next Steps](#next-steps)

## Overview

**Vercel** is the platform for frontend frameworks, created by the makers of Next.js, offering:

- **Zero Configuration**: Deploy Next.js with no configuration
- **Edge Network**: Global CDN for optimal performance
- **Preview Deployments**: Automatic deployment for every PR
- **Serverless Functions**: Auto-scaling backend functions
- **Analytics**: Real User Monitoring (RUM) and Web Vitals
- **DDoS Protection**: Built-in security features

## Prerequisites

- Next.js 15 application ready to deploy
- GitHub account with repository
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- Environment variables documented

## Initial Deployment

### Step 1: Create Vercel Account

1. Visit [vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 2: Import Project

**Via Vercel Dashboard**:

1. Click "Add New..." → "Project"
2. Import your Git repository
3. Vercel auto-detects Next.js configuration
4. Click "Deploy"

**Via Vercel CLI**:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? kilalo
# - In which directory is your code? ./
# - Want to override settings? No
```

### Step 3: Verify Deployment

After deployment, you'll receive:
- **Production URL**: `https://kilalo.vercel.app`
- **Deployment logs**: Build and runtime logs
- **Deployment status**: Success or error details

## GitHub Integration

### Automatic Deployments

Once connected, Vercel automatically:

1. **Production**: Deploys `main` branch to production
2. **Preview**: Deploys PR branches to preview URLs
3. **Comments**: Adds deployment URL to PR comments

### Configure Git Integration

1. Go to Project Settings → Git
2. Select **Production Branch**: `main`
3. Enable **Automatic Deployments**
4. Enable **Comments on Pull Requests**

### Branch Protection Rules

In GitHub repository settings:

```yaml
# .github/branch-protection.yml
branches:
  main:
    protection:
      required_status_checks:
        - Vercel Production Deployment
      required_pull_request_reviews:
        required_approving_review_count: 1
      enforce_admins: true
```

## Environment Variables

### Step 1: Add Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add variables for each environment

**Production Environment**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxx...
SANITY_WEBHOOK_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=https://kilalo.com
NODE_ENV=production
```

**Preview Environment**:

```bash
# Sanity uses different dataset for previews
NEXT_PUBLIC_SANITY_DATASET=preview

# Supabase uses same instance (with RLS)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Development Environment**:

```bash
# Local development only
NEXT_PUBLIC_SANITY_DATASET=development
```

### Step 2: Create .env.example

Create `.env.example` in your repository:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
SANITY_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

### Step 3: Sensitive Variables

**Never commit**:
- API tokens
- Service role keys
- Webhook secrets
- Private keys

**Safe to commit** (public):
- `NEXT_PUBLIC_*` variables (exposed to browser)
- Project IDs
- Dataset names

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `kilalo.com`
4. Add `www.kilalo.com` (recommended)

### Step 2: Configure DNS

**Option A: Use Vercel Nameservers** (Recommended)

1. Vercel provides nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
2. Update nameservers at your domain registrar
3. Vercel manages all DNS records

**Option B: Use External DNS**

Add these records to your DNS provider:

```
# A Record
Type: A
Name: @
Value: 76.76.21.21

# CNAME Record
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate

Vercel automatically provisions SSL certificates:
- Uses Let's Encrypt
- Auto-renews before expiration
- Supports both domain and www subdomain

### Step 4: Redirect www to Root

In Vercel Dashboard:

1. Project Settings → Domains
2. Click on `www.kilalo.com`
3. Select "Redirect to kilalo.com"

## Preview Deployments

### How Preview Deployments Work

Every git push to a branch creates a unique preview URL:

```
https://kilalo-git-feature-new-homepage-team.vercel.app
```

### Benefits

- **Test before merge**: Review changes in production-like environment
- **Collaboration**: Share URL with team/clients
- **No interference**: Doesn't affect production

### Access Preview Deployments

**Via PR Comment**:
GitHub shows preview URL in PR comments automatically.

**Via Vercel Dashboard**:
1. Go to Deployments tab
2. Find your branch deployment
3. Click "Visit" to open preview

### Password Protect Previews

For sensitive projects:

1. Project Settings → Deployment Protection
2. Enable "Vercel Authentication"
3. Only team members can access previews

## Edge Configuration

### Middleware on the Edge

Your `middleware.ts` runs on Vercel's Edge Network:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
  // Custom logic runs on the edge (globally)
  const response = intlMiddleware(request)

  // Add custom headers
  response.headers.set('x-custom-header', 'value')

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

### Edge Runtime for API Routes

```typescript
// src/app/api/hello/route.ts
export const runtime = 'edge' // Runs on Edge Network (faster)

export async function GET() {
  return Response.json({ message: 'Hello from the edge!' })
}
```

### Region Configuration

For server-side rendering:

```typescript
// src/app/layout.tsx or page.tsx
export const runtime = 'nodejs' // Default
export const dynamic = 'force-dynamic'

// Specify preferred region (closest to your database)
export const preferredRegion = 'iad1' // US East (Virginia)
// or 'fra1' for Frankfurt
```

## ISR and Revalidation

### Incremental Static Regeneration

```typescript
// src/app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: Props) {
  const post = await fetchPost(params.slug)

  return <article>...</article>
}

export const revalidate = 3600 // Revalidate every hour
```

### On-Demand Revalidation

Already set up in [08-SETUP-SANITY.md](./08-SETUP-SANITY.md):

```typescript
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  const body = await req.json()

  // Revalidate specific tag
  revalidateTag(`post:${body.slug}`)

  return Response.json({ revalidated: true })
}
```

### Vercel Cache Behavior

```typescript
// Different caching strategies

// 1. Static (cached indefinitely)
export const dynamic = 'force-static'

// 2. ISR (cached with revalidation)
export const revalidate = 60 // seconds

// 3. Dynamic (never cached)
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 4. Tagged caching (revalidate on-demand)
fetch(url, {
  next: {
    tags: ['posts'],
    revalidate: 3600,
  },
})
```

## Analytics and Monitoring

### Enable Vercel Analytics

1. Go to Project Settings → Analytics
2. Click "Enable Analytics"
3. Add to your app:

```typescript
// src/app/[locale]/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

Install package:

```bash
npm install @vercel/analytics
```

### Enable Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// src/app/[locale]/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Monitoring Features

- **Web Vitals**: LCP, FID, CLS, FCP, TTFB
- **Real User Monitoring**: Actual user experience data
- **Page Performance**: Load times per route
- **Visitor Analytics**: Traffic, geography, devices

## Performance Optimization

### Image Optimization

Next.js Image component automatically optimized on Vercel:

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority // Preload above-the-fold images
/>
```

Vercel automatically:
- Resizes images on-demand
- Converts to WebP/AVIF
- Serves from CDN
- Lazy loads below-the-fold images

### Compression

Enable in `next.config.ts`:

```typescript
const nextConfig = {
  compress: true, // Enable gzip compression (default: true)
}
```

### Bundle Analysis

```bash
npm install @next/bundle-analyzer
```

```typescript
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
```

Run analysis:

```bash
ANALYZE=true npm run build
```

### Caching Headers

Vercel automatically sets optimal caching headers for:
- Static assets (CSS, JS, images): `Cache-Control: public, max-age=31536000, immutable`
- HTML pages: Based on your `revalidate` config
- API routes: Based on your response headers

## Rollback Procedures

### Instant Rollback

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"
4. Confirm rollback

**Effect**: Instant switch to previous deployment (< 10 seconds)

### Rollback via CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

### Rollback via Git

```bash
# Revert last commit
git revert HEAD

# Push to main
git push origin main

# Vercel automatically deploys reverted code
```

## Multi-Environment Setup

### Environment Structure

```
Production: main branch → kilalo.com
Staging: staging branch → staging.kilalo.com
Development: Local only
```

### Create Staging Environment

1. Create `staging` branch:
```bash
git checkout -b staging
git push origin staging
```

2. In Vercel Dashboard:
   - Create new project or use same project
   - Link `staging` branch
   - Add staging subdomain: `staging.kilalo.com`
   - Use separate environment variables

3. Configure GitHub to protect staging:
```yaml
# Only allow merges from feature branches
branches:
  staging:
    protection:
      required_status_checks:
        - Vercel Preview Deployment
```

### Workflow

```bash
# 1. Develop on feature branch
git checkout -b feature/new-homepage
git push origin feature/new-homepage

# 2. PR to staging (Vercel creates preview)
# Review preview URL

# 3. Merge to staging (deploys to staging.kilalo.com)
# QA tests on staging

# 4. PR from staging to main
# Final review

# 5. Merge to main (deploys to kilalo.com)
# Live in production
```

## Best Practices

### 1. Use Environment Variables

Never hardcode:
- API keys
- Database URLs
- External service endpoints

### 2. Enable Preview Deployments

Review all changes before merging to production.

### 3. Monitor Performance

Regularly check:
- Web Vitals scores
- Page load times
- Error rates

### 4. Set Up Alerts

Configure alerts for:
- Deployment failures
- Performance degradation
- Error spikes

### 5. Use ISR for Dynamic Content

Balance between static and dynamic:
- Blog posts: ISR with 1-hour revalidation
- User dashboards: Dynamic
- Marketing pages: Static

### 6. Optimize Images

Always use Next.js `Image` component for automatic optimization.

### 7. Test Before Deploying

```bash
# Build locally first
npm run build

# Test production build
npm run start
```

## Troubleshooting

### Issue: Build Fails

**Problem**: Deployment fails during build.

**Solution**:
1. Check build logs in Vercel Dashboard
2. Run `npm run build` locally
3. Fix TypeScript/ESLint errors
4. Ensure all dependencies are in `package.json`

### Issue: Environment Variables Not Working

**Problem**: App can't access environment variables.

**Solution**:
1. Verify variables are set in Vercel Dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. For client-side, ensure `NEXT_PUBLIC_` prefix

### Issue: Custom Domain Not Working

**Problem**: Domain shows Vercel error page.

**Solution**:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check SSL certificate status in Vercel
4. Ensure domain is verified

### Issue: Slow Page Loads

**Problem**: Pages load slowly.

**Solution**:
1. Check Web Vitals in Analytics
2. Optimize images with Next.js Image
3. Enable ISR for dynamic content
4. Review bundle size with analyzer
5. Use Edge Runtime for API routes

### Issue: Deployment Quota Exceeded

**Problem**: Free tier limits reached.

**Solution**:
1. Review usage in Billing section
2. Upgrade to Pro plan ($20/month)
3. Optimize builds (reduce deployment frequency)
4. Use `vercel --prod` only for production deployments

## Next Steps

After successful deployment:

1. **Set up monitoring**: Configure alerts for errors/performance
2. **Custom domain**: Point your domain to Vercel
3. **Analytics**: Review traffic and performance data
4. **Optimization**: Analyze and optimize bundle size
5. **Staging environment**: Create staging workflow
6. **Backups**: Document rollback procedures
7. **Team access**: Invite team members to Vercel project

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Platform Limits](https://vercel.com/docs/concepts/limits/overview)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
