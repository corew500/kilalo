# Staging Environment Guide

**Status**: Active
**Last Updated**: October 31, 2025

---

## Overview

The Kilalo project uses Vercel's built-in deployment environments to manage code promotion from development to production.

### Environment Tiers

| Environment | Branch      | URL                                          | Purpose                | Auto-Deploy |
| ----------- | ----------- | -------------------------------------------- | ---------------------- | ----------- |
| Production  | `main`      | https://kilalo.vercel.app                    | Live production site   | ✅ Yes      |
| Staging     | `staging`   | https://kilalo-git-staging-{org}.vercel.app  | Pre-production testing | ✅ Yes      |
| Preview     | `feature/*` | https://kilalo-git-{branch}-{org}.vercel.app | Feature branch testing | ✅ Yes      |
| Local       | N/A         | http://localhost:3000                        | Local development      | ❌ No       |

---

## Setup Instructions

### 1. Create Staging Branch

```bash
# Create staging branch from main
git checkout main
git pull origin main
git checkout -b staging
git push -u origin staging
```

### 2. Configure Vercel Project Settings

**Via Vercel Dashboard** (https://vercel.com):

1. Go to **Project Settings** → **Git**
2. Under **Production Branch**, ensure `main` is set
3. Under **Deploy Hooks**, optionally add a staging deploy hook

**Branch Configuration**:

- Production Branch: `main`
- All other branches: Automatic preview deployments

### 3. Set Up Environment Variables

#### Production Environment Variables

```bash
# View current production variables
vercel env ls production

# Add production-specific variables (if not already set)
vercel env add NEXT_PUBLIC_SANITY_DATASET production
# Value: production

vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://kilalo.vercel.app
```

#### Staging Environment Variables

```bash
# Add staging-specific variables
vercel env add NEXT_PUBLIC_SANITY_DATASET preview
# Value: development

vercel env add NEXT_PUBLIC_SITE_URL preview
# Value: https://kilalo-git-staging-{your-org}.vercel.app

# For Supabase (if using different staging instance)
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
# Value: {your-staging-supabase-url}

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
# Value: {your-staging-anon-key}
```

**Environment Variable Strategy**:

- **Production**: Uses `production` Sanity dataset and production Supabase
- **Staging/Preview**: Uses `development` Sanity dataset and can use staging Supabase
- **Local**: Uses `.env.local` file (not committed to git)

---

## Deployment Workflow

### Standard Release Process

```
Local Development → Feature Branch → Staging → Production
```

#### 1. Local Development

```bash
# Work on feature branch
git checkout -b feature/new-feature
# Make changes, test locally
npm run dev

# Run tests
npm test
npm run test:e2e

# Commit changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

**Automatic**: Vercel creates preview deployment for feature branch

#### 2. Merge to Staging

```bash
# Create PR from feature branch to staging
gh pr create --base staging --head feature/new-feature \
  --title "feat: add new feature" \
  --body "Testing new feature in staging"

# After review, merge to staging
gh pr merge {pr-number} --squash
```

**Automatic**: Vercel deploys to staging environment

#### 3. Test in Staging

1. Visit staging URL: `https://kilalo-git-staging-{org}.vercel.app`
2. Test all changes thoroughly
3. Verify database migrations (if any)
4. Check analytics, error tracking
5. Run smoke tests

#### 4. Promote to Production

```bash
# Create PR from staging to main
gh pr create --base main --head staging \
  --title "Release: {version} to production" \
  --body "Changes ready for production deployment"

# After final review, merge to main
gh pr merge {pr-number} --squash
```

**Automatic**: Vercel deploys to production

---

## Environment-Specific Configurations

### Sanity CMS

**Production** (`main` branch):

- Uses `production` dataset
- Content editors work here
- Production content visible on live site

**Staging/Preview** (`staging`, `feature/*` branches):

- Uses `development` dataset
- Safe for testing CMS changes
- Can test schema changes without affecting production

**Switching Datasets**:

```bash
# Set via environment variable in Vercel
NEXT_PUBLIC_SANITY_DATASET=development  # Staging/Preview
NEXT_PUBLIC_SANITY_DATASET=production   # Production
```

### Supabase

**Option 1: Shared Database** (Current Setup)

- Production and staging share same Supabase project
- Uses Row Level Security (RLS) for data isolation
- Simple, but requires careful testing

**Option 2: Separate Staging Database** (Recommended for larger teams)

- Create separate Supabase project for staging
- Set different `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Requires data sync process

### Feature Flags

For gradual rollouts, consider using environment variables as feature flags:

```typescript
// lib/features.ts
export const features = {
  newMemberPortal: process.env.NEXT_PUBLIC_ENABLE_NEW_PORTAL === 'true',
  betaFeatures: process.env.NEXT_PUBLIC_ENABLE_BETA === 'true',
}

// In component
if (features.newMemberPortal) {
  return <NewPortal />
}
```

Set in Vercel:

```bash
vercel env add NEXT_PUBLIC_ENABLE_NEW_PORTAL preview
# Value: true (for staging testing)

vercel env add NEXT_PUBLIC_ENABLE_NEW_PORTAL production
# Value: false (keep disabled in production)
```

---

## Testing in Staging

### Pre-Deployment Checklist

Before merging to staging:

- [ ] All unit tests passing (`npm test`)
- [ ] All E2E tests passing (`npm run test:e2e`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in browser
- [ ] Responsive design tested (mobile/tablet/desktop)

### Post-Deployment Verification (Staging)

After deploying to staging:

- [ ] Site loads without errors
- [ ] Authentication works (login/signup/logout)
- [ ] Member portal accessible
- [ ] CMS content displays correctly
- [ ] Forms submit successfully
- [ ] API routes respond correctly
- [ ] Database operations work
- [ ] i18n switching works (EN/FR)
- [ ] Images load correctly
- [ ] No broken links
- [ ] Performance acceptable (Lighthouse check)

### Smoke Tests

```bash
# Run smoke tests against staging URL
PLAYWRIGHT_BASE_URL=https://kilalo-git-staging-{org}.vercel.app \
  npm run test:e2e -- --grep "@smoke"
```

---

## Rollback Strategy

### Rolling Back Staging

```bash
# Revert last commit on staging
git checkout staging
git revert HEAD
git push origin staging
```

### Rolling Back Production

**Option 1: Instant Rollback via Vercel Dashboard**

1. Go to Deployments in Vercel
2. Find previous working deployment
3. Click "Promote to Production"

**Option 2: Git Revert**

```bash
# Revert problematic commit
git checkout main
git revert {commit-hash}
git push origin main
```

**Option 3: Redeploy Previous Version**

```bash
# Redeploy specific commit
vercel --prod --force --yes {commit-hash}
```

---

## Monitoring & Alerts

### Vercel Analytics

- **Production**: Full analytics enabled
- **Staging**: Analytics enabled for testing
- **Preview**: Limited analytics

### Error Tracking

Consider adding environment-specific error tracking:

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  enabled: process.env.NODE_ENV === 'production',
  beforeSend(event) {
    // Don't send errors from preview deployments to production Sentry
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      return null
    }
    return event
  },
})
```

---

## Common Commands

### Vercel CLI

```bash
# Link project to Vercel
vercel link

# Deploy to preview (any branch)
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs {deployment-url}

# Environment variables
vercel env ls                    # List all env vars
vercel env add {name}            # Add env var
vercel env rm {name}             # Remove env var
vercel env pull .env.local       # Pull env vars to local file
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Push and create preview deployment
git push origin feature/my-feature

# Merge to staging
gh pr create --base staging --head feature/my-feature
gh pr merge {pr-number}

# Merge staging to main (production)
gh pr create --base main --head staging
gh pr merge {pr-number}
```

---

## Best Practices

### Branch Strategy

1. **`main`** - Production code, always deployable
2. **`staging`** - Integration branch for testing
3. **`feature/*`** - Individual features, auto-previews
4. **`fix/*`** - Bug fixes
5. **`hotfix/*`** - Emergency production fixes

### Hotfix Process

For urgent production fixes:

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-fix

# Make fix and test locally
# ...

# Deploy to production directly
git checkout main
git merge hotfix/critical-fix
git push origin main

# Backport to staging
git checkout staging
git merge main
git push origin staging
```

### Database Migrations

For schema changes:

1. **Test locally** with development database
2. **Deploy to staging** and run migration
3. **Verify staging** works with new schema
4. **Deploy to production** during low-traffic period
5. **Monitor** for errors

```bash
# Example: Run migration in staging
SUPABASE_DB_URL=$STAGING_DATABASE_URL \
  npx supabase db push

# Run migration in production
SUPABASE_DB_URL=$PRODUCTION_DATABASE_URL \
  npx supabase db push
```

---

## Troubleshooting

### Preview Deployment Not Created

**Issue**: Push to feature branch doesn't create preview
**Solution**:

1. Check Vercel project settings → Git → Ensure deployments enabled
2. Verify branch is pushed to GitHub
3. Check Vercel dashboard for build errors

### Environment Variables Not Applied

**Issue**: Changes to env vars don't take effect
**Solution**:

1. Redeploy: `vercel --force`
2. Check environment scope (production vs preview)
3. Clear cache: Settings → General → Clear Cache

### Staging Shows Production Data

**Issue**: Staging showing production CMS content
**Solution**:

1. Verify `NEXT_PUBLIC_SANITY_DATASET` is set to `development`
2. Check environment variable scope (preview, not production)
3. Redeploy staging: `git push origin staging`

---

## Security Considerations

### Protecting Staging

**Option 1: Vercel Password Protection**

1. Go to Project Settings → Deployment Protection
2. Enable "Password Protection" for Preview deployments
3. Set password

**Option 2: IP Allowlist** (Team/Enterprise plan)

1. Settings → Security → Deploy Protection
2. Add allowed IP addresses

### Secrets Management

- Never commit secrets to git
- Use Vercel environment variables for sensitive data
- Rotate secrets regularly
- Use different credentials for staging and production

---

## Cost Optimization

### Vercel Limits

**Hobby Plan**:

- 100 GB bandwidth/month
- 100 deployments/day
- Unlimited preview deployments

**Tips**:

- Clean up old preview deployments
- Limit long-running preview deployments
- Monitor bandwidth usage

```bash
# Delete old preview deployments
vercel rm {deployment-url} --yes
```

---

## Resources

- [Vercel Environments Documentation](https://vercel.com/docs/concepts/deployments/environments)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Git Branch Strategy](https://nvie.com/posts/a-successful-git-branching-model/)

---

**Maintained By**: Development Team
**Last Review**: October 31, 2025
