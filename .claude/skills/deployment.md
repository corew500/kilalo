# Deployment & Environment Management - Claude Skill

**Purpose**: Guide for deploying to Vercel and managing environment-specific configurations.

---

## Quick Reference

### Deployment Environments

| Environment | Branch      | URL Pattern                                  | Auto-Deploy | Dataset       |
| ----------- | ----------- | -------------------------------------------- | ----------- | ------------- |
| Production  | `main`      | https://kilalo.vercel.app                    | ✅ Yes      | `production`  |
| Staging     | `staging`   | https://kilalo-git-staging-{org}.vercel.app  | ✅ Yes      | `development` |
| Preview     | `feature/*` | https://kilalo-git-{branch}-{org}.vercel.app | ✅ Yes      | `development` |
| Local       | Any         | http://localhost:3000                        | ❌ No       | `development` |

### Deployment Flow

```
Local Development → Feature Branch → Staging → Production
     (manual)          (preview)      (staging)  (production)
```

---

## Common Commands

### Vercel CLI

```bash
# Link project (first time setup)
vercel link

# Deploy to preview (current branch)
vercel

# Deploy to production (main branch)
vercel --prod

# View deployments (most recent 20)
vercel ls

# Check deployment status
vercel inspect {deployment-url}
# Status values: ● Building, ● Ready, ● Error

# View deployment logs (only works for Ready deployments)
vercel logs {deployment-url}

# View build errors (works for Error deployments)
vercel inspect {deployment-url} --logs

# Monitor deployment after push
# Wait 10s for deployment to start, then check status
sleep 10 && vercel ls | head -25
# Then inspect specific deployment
vercel inspect {deployment-url}
```

### Environment Variables

```bash
# List all environment variables
vercel env ls

# Add environment variable
vercel env add {VAR_NAME}
# Then select environment: production, preview, or development

# Remove environment variable
vercel env rm {VAR_NAME}
# Then select environment to remove from

# Pull environment variables to local file
vercel env pull .env.local

# Pull for specific environment
vercel env pull .env.production --environment=production
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/my-feature
git push origin feature/my-feature
# → Auto-creates preview deployment

# Merge to staging
git checkout staging
git merge feature/my-feature
git push origin staging
# → Deploys to staging environment

# Merge to production
git checkout main
git merge staging
git push origin main
# → Deploys to production
```

---

## Environment Variables Setup

### Required Variables by Environment

#### Production (`main` branch)

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key

# Site
NEXT_PUBLIC_SITE_URL=https://kilalo.vercel.app
```

#### Preview/Staging (all non-`main` branches)

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=development
SANITY_API_TOKEN=your-write-token

# Supabase (same as production or separate staging instance)
NEXT_PUBLIC_SUPABASE_URL=your-staging-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-key

# Site (use staging branch URL or dynamic preview URL)
NEXT_PUBLIC_SITE_URL=https://kilalo-git-staging-{org}.vercel.app
```

### Adding Variables via CLI

**Interactive mode** (prompts for value):

```bash
vercel env add NEXT_PUBLIC_SITE_URL preview
# Enter value when prompted
```

**Non-interactive mode** (scripted):

```bash
echo "https://kilalo-git-staging-{org}.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL preview
```

**Add to multiple environments**:

```bash
# Add to all environments
vercel env add VAR_NAME
# Select: production, preview, development (all)
```

### Pulling Variables Locally

```bash
# Pull all preview variables to .env.local
vercel env pull .env.local --environment=preview

# Pull production variables
vercel env pull .env.production --environment=production

# Verify variables
cat .env.local
```

---

## Deployment Patterns

### 1. Feature Deployment (Preview)

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Push to GitHub
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Vercel automatically:
# 1. Detects the push
# 2. Runs build
# 3. Creates preview deployment
# 4. Comments on PR with URL (if PR exists)
```

**Preview URL**: `https://kilalo-git-new-feature-{org}.vercel.app`

### 2. Staging Deployment

```bash
# Merge feature to staging
git checkout staging
git pull origin staging
git merge feature/new-feature
git push origin staging

# Vercel automatically deploys to staging URL
```

**Staging URL**: `https://kilalo-git-staging-{org}.vercel.app`

**Test in staging**:

1. Verify functionality
2. Check database operations
3. Test authentication
4. Verify CMS content
5. Run smoke tests

### 3. Production Deployment

```bash
# After staging testing passes
git checkout main
git pull origin main
git merge staging
git push origin main

# Vercel automatically deploys to production
```

**Production URL**: `https://kilalo.vercel.app`

**Post-deployment**:

1. **Check deployment status** (REQUIRED):

   ```bash
   # Wait for deployment to start
   sleep 10 && vercel ls | head -25

   # Get the most recent deployment URL and inspect it
   vercel inspect {deployment-url}

   # If status is ● Error, view build logs
   vercel inspect {deployment-url} --logs
   ```

2. Monitor for errors
3. Check analytics
4. Verify critical paths
5. Monitor database load

---

## Deployment Monitoring (CRITICAL)

**⚠️ ALWAYS check deployment status after pushing to main or staging branches.**

### Monitoring Workflow

```bash
# 1. After git push, wait for deployment to start
sleep 10 && vercel ls | head -25

# 2. Check the status of the most recent deployment
# Look for one of these statuses:
# ● Building - Deployment in progress
# ● Ready - Deployment successful
# ● Error - Deployment failed

# 3. If status is "Building", wait and check again
sleep 30 && vercel inspect {deployment-url}

# 4. If status is "Error", view build logs immediately
vercel inspect {deployment-url} --logs

# 5. If status is "Ready", verify the deployment
curl -I {deployment-url}
```

### Common Deployment Errors

#### Route Conflicts

**Error**: `You cannot have two parallel pages that resolve to the same path`

**Cause**: Multiple pages in different route groups resolve to the same URL

- Example: `app/[locale]/(marketing)/community/page.tsx` and `app/[locale]/(member)/community/page.tsx` both resolve to `/[locale]/community`

**Fix**: Rename one of the pages to a different path

```bash
mv app/[locale]/(member)/community app/[locale]/(member)/hub
```

#### Build Failures

**Error**: Build exits with non-zero status

**Cause**: TypeScript errors, missing dependencies, or build script issues

**Fix**:

1. Run build locally: `npm run build`
2. Fix all TypeScript errors
3. Ensure all dependencies are installed
4. Commit and push fix

#### Missing Environment Variables

**Error**: Runtime errors about missing env vars

**Cause**: Environment variables not configured in Vercel

**Fix**:

```bash
# Add missing variable
vercel env add {VAR_NAME} production
vercel env add {VAR_NAME} preview
```

#### Deployment Protection (401 Unauthorized)

**Error**: E2E tests fail with HTTP 401 when accessing preview deployments

**Cause**: Vercel Deployment Protection is enabled, requiring authentication

**Fix**: Disable protection in Vercel Dashboard

1. Go to: `https://vercel.com/{org}/{project}/settings/deployment-protection`
2. Change from "Vercel Authentication" to "Standard Protection"
3. Or disable protection entirely for public access
4. Verify: `curl -I https://{staging-url}` should return HTTP 200

**Recommended Settings**:

- Production: No protection (public)
- Staging: Standard protection (public but not indexed)
- Feature branches: Vercel authentication (team only)

### Best Practices

1. **Always test builds locally** before pushing:

   ```bash
   npm run build
   ```

2. **Monitor deployments** after every push to main/staging

3. **Check error logs immediately** if deployment fails

4. **Use preview deployments** to test changes before merging to staging

5. **Keep deployment skill updated** with new error patterns and solutions

6. **Verify staging is accessible** for E2E tests:

   ```bash
   curl -I https://kilalo-git-staging-corey-wests-projects.vercel.app/en
   # Should return HTTP 200, not 401

   # Run E2E tests against staging
   TEST_ENV=staging npx playwright test staging-deployment
   ```

---

## Rollback Strategies

### Instant Rollback (Vercel Dashboard)

1. Go to https://vercel.com/project/deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Confirm

**Use when**: Immediate rollback needed, no code changes required

### Git Revert

```bash
# Revert last commit
git revert HEAD
git push origin main

# Revert specific commit
git revert {commit-hash}
git push origin main
```

**Use when**: Need to maintain git history, create revert commit

### Redeploy Previous Commit

```bash
# Deploy specific commit hash
vercel --prod --force {commit-hash}
```

**Use when**: Need to deploy specific version quickly

### Staging Rollback

```bash
# Rollback staging to previous commit
git checkout staging
git reset --hard HEAD~1  # or specific commit
git push --force origin staging
```

**Note**: Force push only on staging, never on main

---

## Database Migrations

### Pattern for Safe Migrations

```bash
# 1. Test locally
SUPABASE_DB_URL=$LOCAL_DB_URL npx supabase db push

# 2. Deploy to staging
git checkout staging
# Migration files included in commit
git push origin staging

# 3. After Vercel builds, run migration on staging DB
SUPABASE_DB_URL=$STAGING_DB_URL npx supabase db push

# 4. Test thoroughly in staging
# ...

# 5. Deploy to production (low-traffic time)
git checkout main
git merge staging
git push origin main

# 6. Run migration on production DB
SUPABASE_DB_URL=$PRODUCTION_DB_URL npx supabase db push

# 7. Monitor for errors
vercel logs --follow
```

### Migration Checklist

- [ ] Backward compatible (doesn't break existing code)
- [ ] Tested locally with realistic data
- [ ] Tested in staging
- [ ] Rollback plan ready
- [ ] Deploy during low-traffic period
- [ ] Monitor logs after deployment

---

## Monitoring & Debugging

### View Deployment Logs

```bash
# Follow logs in real-time
vercel logs --follow

# Logs for specific deployment
vercel logs {deployment-url}

# Filter logs
vercel logs --output raw | grep ERROR
```

### Check Build Status

```bash
# List recent deployments
vercel ls

# Inspect specific deployment
vercel inspect {deployment-url}

# View build logs in dashboard
# https://vercel.com/project/deployments/{deployment-id}
```

### Debug Environment Issues

```bash
# Check which env vars are set
vercel env ls

# Pull env vars to verify locally
vercel env pull .env.test --environment=preview

# Compare environments
vercel env ls | grep DATASET
```

---

## Pre-Deployment Checklist

### Before Merging to Staging

- [ ] All unit tests passing (`npm test`)
- [ ] All E2E tests passing (`npm run test:e2e`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in dev mode
- [ ] Tested in multiple browsers
- [ ] Responsive design verified
- [ ] i18n working (EN/FR)

### Before Merging to Production

- [ ] Tested thoroughly in staging
- [ ] Database migrations successful (if any)
- [ ] No breaking changes in API
- [ ] Performance acceptable (Lighthouse)
- [ ] Analytics tracking working
- [ ] Error monitoring configured
- [ ] Backup plan ready
- [ ] Stakeholders notified (if major release)

---

## Troubleshooting

### Build Failing

**Issue**: Deployment fails during build

**Debug**:

```bash
# Check build logs
vercel logs {deployment-url}

# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Clear cache and rebuild
vercel --force
```

### Environment Variables Not Applied

**Issue**: Changes to env vars don't take effect

**Solution**:

```bash
# Trigger redeploy
vercel --force

# Or via dashboard:
# Deployments → [deployment] → Redeploy
```

**Verify**:

```bash
# In your deployed app, add a test endpoint:
// pages/api/debug-env.ts
export default function handler(req, res) {
  res.json({
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    site: process.env.NEXT_PUBLIC_SITE_URL,
  })
}
```

### Wrong Dataset Showing

**Issue**: Preview shows production data or vice versa

**Debug**:

```bash
# Check env var for preview
vercel env ls | grep NEXT_PUBLIC_SANITY_DATASET

# Should show:
# NEXT_PUBLIC_SANITY_DATASET  ...  Preview  ...
# Value should be "development" for preview
```

**Fix**:

```bash
# Update preview environment
vercel env rm NEXT_PUBLIC_SANITY_DATASET preview
vercel env add NEXT_PUBLIC_SANITY_DATASET preview
# Enter: development
```

---

## CI/CD Integration

### GitHub Actions (Future)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Automated Testing on Deploy

```bash
# Run E2E tests against staging
PLAYWRIGHT_BASE_URL=https://kilalo-git-staging-{org}.vercel.app \
  npm run test:e2e
```

---

## Best Practices

### 1. Never Deploy Directly to Production

Always go through staging first:

```bash
# ❌ Bad: Skip staging
git checkout main
git merge feature/new-feature
git push

# ✅ Good: Go through staging
git checkout staging
git merge feature/new-feature
git push
# Test in staging, then:
git checkout main
git merge staging
git push
```

### 2. Use Descriptive Branch Names

```bash
# ✅ Good
feature/add-mentor-matching
fix/login-redirect-bug
hotfix/critical-security-patch

# ❌ Bad
test
wip
new-stuff
```

### 3. Keep Environment Parity

Staging should mirror production as closely as possible:

- Same Node version
- Same dependencies
- Same build process
- Similar data volume (use seed data)

### 4. Monitor Deployments

```bash
# Set up alerts (future)
# Vercel → Project Settings → Integrations → Slack
# Get notified of deployment status
```

### 5. Document Breaking Changes

```bash
# In PR description
## Breaking Changes
- Auth token format changed
- Requires database migration
- Update .env.local with new variables

## Migration Steps
1. Run: npx supabase db push
2. Update env: NEXT_PUBLIC_NEW_VAR=value
```

---

## Quick Troubleshooting Guide

| Problem              | Quick Fix                             |
| -------------------- | ------------------------------------- |
| Build fails          | `npm run build` locally, check errors |
| Env vars not working | `vercel --force` to redeploy          |
| Wrong data showing   | Check `NEXT_PUBLIC_SANITY_DATASET`    |
| Slow builds          | Check for large dependencies          |
| Preview not created  | Verify branch pushed to GitHub        |
| Auth not working     | Check Supabase URL/keys               |

---

## Useful Vercel Dashboard Links

- **Deployments**: https://vercel.com/{org}/kilalo/deployments
- **Environment Variables**: https://vercel.com/{org}/kilalo/settings/environment-variables
- **Domains**: https://vercel.com/{org}/kilalo/settings/domains
- **Analytics**: https://vercel.com/{org}/kilalo/analytics
- **Logs**: https://vercel.com/{org}/kilalo/logs

---

## Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Staging Environment Guide](../../docs/STAGING_ENVIRONMENT.md)

---

**Last Updated**: October 31, 2025
