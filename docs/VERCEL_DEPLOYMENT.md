# Vercel Deployment Guide

## Critical: Always Verify Deployments

**NEVER assume a deployment succeeded without verification.** Always use the Vercel CLI to check deployment status after pushing code.

## Verification Workflow

### 1. After pushing code, wait and verify:

```bash
# Wait 60-90 seconds for deployment to start
sleep 90

# Check recent deployments
vercel ls | head -20

# Inspect the latest deployment
vercel inspect <deployment-url>

# Check build logs if there's an error
vercel logs <deployment-url>
```

### 2. Common Issues to Check For

#### Platform-Specific Dependencies

**Problem**: macOS-specific packages (like `@rollup/rollup-darwin-arm64`) get locked in `package-lock.json` and fail on Vercel's Linux build servers.

**Symptoms**:

```
npm error code EBADPLATFORM
npm error notsup Unsupported platform for @rollup/rollup-darwin-arm64
```

**Solution**:

```bash
# Remove platform-specific packages
node << 'EOF'
const fs = require('fs');
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

function removeFromObject(obj, pattern) {
  if (!obj) return;
  Object.keys(obj).forEach(key => {
    if (key.match(pattern)) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (obj[key].optionalDependencies) {
        Object.keys(obj[key].optionalDependencies).forEach(dep => {
          if (dep.match(pattern)) delete obj[key].optionalDependencies[dep];
        });
      }
    }
  });
}

// Remove problematic packages
removeFromObject(lock.packages, /@rollup\/rollup-darwin/);
removeFromObject(lock.dependencies, /@rollup\/rollup-darwin/);

fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2));
console.log('Cleaned package-lock.json');
EOF

# Commit and push
git add package-lock.json
git commit -m "fix: remove platform-specific packages from lock file"
git push
```

#### Build Cache Issues

If deployments keep failing with the same error after fixing the code:

```bash
# Force deployment without cache
vercel --prod --yes --force
```

### 3. Manual Deployment Trigger

If auto-deployments aren't triggering:

```bash
vercel --prod --yes
```

### 4. Check Production Status

```bash
# Check if production site is live
curl -sI https://kilalo.vercel.app/en | head -15

# Verify content
curl -s https://kilalo.vercel.app/en | grep '<title>'
```

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Wait 90 seconds
- [ ] Run `vercel ls` to check deployment status
- [ ] If status shows "● Error", run `vercel inspect <url>` for details
- [ ] If error persists, check build logs with `vercel logs <url>`
- [ ] Verify production site with `curl -sI https://kilalo.vercel.app/en`
- [ ] If multiple consecutive failures, check for platform-specific dependencies

## Prevention

### For macOS Developers

When installing packages that have optional platform-specific dependencies:

```bash
# Option 1: Install without optional dependencies
npm install --no-optional

# Option 2: Use CI environment for lock file generation
# (Use GitHub Actions or Docker with Linux)
```

### Lock File Maintenance

Periodically verify no platform-specific packages are locked:

```bash
grep -E "darwin|win32|win64" package-lock.json | grep -v "esbuild\|swc\|sharp"
```

Packages like `esbuild`, `swc`, and `sharp` are OK (they're used by Next.js/build tools).
Packages like `@rollup/rollup-darwin-*` should NOT be in the lock file.

## Historical Context

**Issue Encountered**: October 30, 2025

- 14+ consecutive deployment failures
- Assumed deployments worked based on `curl` responses (which were serving old successful deployments)
- Actual issue: `@rollup/rollup-darwin-arm64@4.52.5` locked in package-lock.json
- Resolution: Manual removal of platform-specific packages from lock file
- Lesson: Always verify deployments with `vercel ls` and `vercel inspect`
