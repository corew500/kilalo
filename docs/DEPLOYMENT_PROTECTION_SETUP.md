# Deployment Protection Setup Guide

This guide explains how to configure Vercel Deployment Protection with automation bypass for secure E2E testing.

## Overview

**Protection Bypass for Automation** allows you to:

- ✅ Keep deployments protected from public access
- ✅ Allow E2E tests to bypass protection with a secret header
- ✅ More secure than disabling protection entirely

## Setup Instructions

### 1. Configure Deployment Protection in Vercel

1. Go to: https://vercel.com/corey-wests-projects/kilalo/settings/deployment-protection

2. **Set protection levels:**
   - **Production Deployments (main branch)**: `No Protection` (public)
   - **Preview Deployments (all other branches)**: `Vercel Authentication` (protected)

3. **Enable Protection Bypass:**
   - Scroll to "Protection Bypass for Automation"
   - Click "Add Secret"
   - Vercel will generate a bypass token (e.g., `lX9HNiPxL2oqfrQnA9ADUodmE3J2YBAB`)
   - Copy the secret

### 2. Add Secret to Local Environment

Add the secret to `.env.local`:

```bash
# Vercel Deployment Protection Bypass for E2E Tests
# Generated from: https://vercel.com/corey-wests-projects/kilalo/settings/deployment-protection
VERCEL_AUTOMATION_BYPASS_SECRET=your-secret-here
```

**Important:** Never commit this secret to git. It's already in `.gitignore` via `.env.local`.

### 3. Add Secret to CI/CD (GitHub Actions)

For automated testing in CI/CD:

1. Go to: https://github.com/corew500/kilalo/settings/secrets/actions
2. Click "New repository secret"
3. Name: `VERCEL_AUTOMATION_BYPASS_SECRET`
4. Value: Paste the bypass secret from Vercel
5. Click "Add secret"

Update your GitHub Actions workflow to use it:

```yaml
- name: Run E2E Tests
  env:
    VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
  run: npm run test:e2e
```

## How It Works

### Playwright Tests Automatically Use Bypass Header

The E2E tests in `tests/e2e/staging-deployment.spec.ts` automatically add the bypass header:

```typescript
// Set bypass header for protected deployments
test.beforeEach(async ({ page }) => {
  if (BYPASS_SECRET) {
    await page.setExtraHTTPHeaders({
      'x-vercel-protection-bypass': BYPASS_SECRET,
    })
  }
})
```

When the `VERCEL_AUTOMATION_BYPASS_SECRET` environment variable is set, all requests will include the bypass header.

### Manual Testing with curl

You can also test protected deployments manually:

```bash
# Without bypass header (will get 401 if protected)
curl -I https://kilalo-git-staging-corey-wests-projects.vercel.app/en

# With bypass header (will get 200)
curl -I -H "x-vercel-protection-bypass: lX9HNiPxL2oqfrQnA9ADUodmE3J2YBAB" \
  https://kilalo-git-staging-corey-wests-projects.vercel.app/en
```

## Running E2E Tests

### Against Staging (Protected)

```bash
# Tests will use bypass secret from .env.local
TEST_ENV=staging npx playwright test staging-deployment --project=chromium
```

### Against Production (Public)

```bash
# No bypass needed for production
TEST_ENV=production npx playwright test staging-deployment --project=chromium
```

### Against Localhost

```bash
# No bypass needed for local development
npm run test:e2e
```

## Verification

After setup, verify everything works:

### 1. Test Protection is Enabled

```bash
# Should return 401 Unauthorized
curl -I https://kilalo-git-staging-corey-wests-projects.vercel.app/en
```

### 2. Test Bypass Works

```bash
# Should return 200 OK
curl -I -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" \
  https://kilalo-git-staging-corey-wests-projects.vercel.app/en
```

### 3. Run E2E Tests

```bash
# Should pass all tests
TEST_ENV=staging npx playwright test staging-deployment --project=chromium --reporter=list
```

## Security Best Practices

### ✅ Do:

- Keep the bypass secret in `.env.local` (not committed)
- Store secret in GitHub Actions secrets for CI/CD
- Rotate the secret periodically (regenerate in Vercel dashboard)
- Use Vercel Authentication for preview deployments
- Keep production public (no protection needed)

### ❌ Don't:

- Commit the bypass secret to git
- Share the secret publicly
- Use the same secret across multiple projects
- Disable protection entirely if you need E2E testing

## Troubleshooting

### E2E Tests Fail with 401

**Cause**: Bypass secret not set or incorrect

**Fix**:

1. Verify secret is in `.env.local`
2. Check secret matches Vercel dashboard
3. Ensure environment variable is exported: `echo $VERCEL_AUTOMATION_BYPASS_SECRET`

### Bypass Header Not Working

**Cause**: Secret was regenerated or expired

**Fix**:

1. Go to Vercel dashboard → Deployment Protection
2. Regenerate the bypass secret
3. Update `.env.local` and GitHub Actions secrets
4. Rerun tests

### Protection Not Applied

**Cause**: Wrong environment selected in Vercel dashboard

**Fix**:

1. Verify "Preview Deployments" is set to "Vercel Authentication"
2. Check "Production Deployments" is set to "No Protection"
3. Test with curl to confirm protection status

## Related Documentation

- [Staging Environment Setup](./STAGING_ENVIRONMENT.md)
- [Deployment Skill](./.claude/skills/deployment.md)
- [Vercel Deployment Protection Docs](https://vercel.com/docs/security/deployment-protection)

## Current Configuration

### Environment Variables

| Variable                          | Location               | Purpose                  |
| --------------------------------- | ---------------------- | ------------------------ |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | `.env.local`           | Local E2E testing bypass |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | GitHub Actions secrets | CI/CD E2E testing bypass |

### Deployment Protection

| Environment | Branch      | Protection    | Bypass Secret |
| ----------- | ----------- | ------------- | ------------- |
| Production  | `main`      | None (public) | Not needed    |
| Staging     | `staging`   | Vercel Auth   | ✅ Required   |
| Preview     | `feature/*` | Vercel Auth   | ✅ Required   |
| Local       | Any         | None          | Not needed    |

### Test Execution

```bash
# Local against protected staging
TEST_ENV=staging npx playwright test staging-deployment

# CI/CD (GitHub Actions)
# Secret automatically loaded from repository secrets
npm run test:e2e:staging
```

---

**Last Updated**: 2025-10-31
**Bypass Secret Generated**: 2025-10-31
**Secret Expires**: Never (until regenerated manually)
