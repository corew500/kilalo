# Sanity Content Management Workflow

## Overview

This document outlines the workflow for safely managing content between development and production datasets in Sanity.

## Current Setup

- **Development Dataset**: Used for testing content changes and schema updates
- **Production Dataset**: Live content used by the production website
- **Studio Environment**: Points to the dataset specified in `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`

## Important Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=ofg1uvc2
NEXT_PUBLIC_SANITY_DATASET=development  # or 'production'
SANITY_API_TOKEN=<your-token-with-write-permissions>
```

## Content Types in Sanity

### 1. Site Settings (siteSettings)

- **Purpose**: Global site content and translations (206 fields × 2 languages)
- **Documents**:
  - `siteSettings-en` (English)
  - `siteSettings-fr` (French)
- **How to Update**: Edit in Sanity Studio or use seed script

### 2. Other Content Types

- **Programs**: V2S Program, Hekima Time
- **Ventures**: Portfolio companies
- **Case Studies**: Success stories
- **Team Members**: Staff profiles
- **Blog Posts**: Articles and insights
- **Events**: Hekima Time sessions
- **Impact Metrics**: Annual metrics

## Safe Deployment Workflow

### Step 1: Make Changes in Development

```bash
# Ensure you're pointing to development dataset
grep NEXT_PUBLIC_SANITY_DATASET .env.local
# Should show: NEXT_PUBLIC_SANITY_DATASET=development

# Start dev server and make changes in Studio
npm run dev
# Open http://localhost:3000/studio
```

### Step 2: Export Development Data

```bash
# Export entire dataset to backup file
npx sanity dataset export development sanity-backup-$(date +%Y%m%d-%H%M%S).tar.gz

# Or export specific document types
npx sanity documents query '*[_type == "siteSettings"]' --dataset development > siteSettings-export.json
```

### Step 3: Test Locally

```bash
# Test with development dataset
npm run dev
# Verify all pages load correctly with new content
```

### Step 4: Check Production Before Overwriting

```bash
# Export current production data as backup
npx sanity dataset export production prod-backup-$(date +%Y%m%d-%H%M%S).tar.gz

# Compare production vs development (optional)
npx sanity documents query '*[_type == "siteSettings"] {_id, _updatedAt}' --dataset production
npx sanity documents query '*[_type == "siteSettings"] {_id, _updatedAt}' --dataset development
```

### Step 5: Copy Development to Production

**IMPORTANT**: This will overwrite production data. Always backup first!

```bash
# Option A: Full dataset copy (nuclear option - use with caution!)
npx sanity dataset copy development production

# Option B: Selective document import (safer)
# 1. Export from development
npx sanity documents query '*[_type == "siteSettings"]' --dataset development > temp-export.ndjson

# 2. Import to production
npx sanity dataset import temp-export.ndjson production --replace

# Option C: Manual sync via Studio
# 1. Switch .env.local to production dataset
# 2. Manually copy-paste content in Studio UI
# 3. Switch back to development when done
```

## Protecting Production Data

### Prevent Accidental Overwrites

1. **Use separate API tokens** with different permissions:

   ```bash
   # Development token (read/write)
   SANITY_DEV_TOKEN=...

   # Production token (read-only for most users)
   SANITY_PROD_TOKEN=...
   ```

2. **Add confirmation prompts** to deployment scripts:

   ```bash
   #!/bin/bash
   # scripts/sync-to-prod.sh

   echo "⚠️  WARNING: This will overwrite PRODUCTION data!"
   echo "Have you backed up production? (yes/no)"
   read confirmation

   if [ "$confirmation" != "yes" ]; then
     echo "Aborted."
     exit 1
   fi

   # Backup production first
   echo "Backing up production..."
   npx sanity dataset export production "backups/prod-$(date +%Y%m%d-%H%M%S).tar.gz"

   # Copy development to production
   echo "Copying development to production..."
   npx sanity dataset copy development production

   echo "✅ Sync complete!"
   ```

3. **Check timestamps before syncing**:

   ```bash
   # Compare update times to see which is newer
   echo "Production last updated:"
   npx sanity documents query '*[_type == "siteSettings"][0]._updatedAt' --dataset production

   echo "Development last updated:"
   npx sanity documents query '*[_type == "siteSettings"][0]._updatedAt' --dataset development
   ```

## Vercel Deployment Integration

Your Vercel deployments should use the **production** dataset:

```bash
# Set in Vercel environment variables
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<production-token>
```

Your local development should use the **development** dataset:

```bash
# .env.local (not committed to git)
NEXT_PUBLIC_SANITY_DATASET=development
SANITY_API_TOKEN=<dev-token>
```

## Schema Updates

When updating schemas (e.g., adding new fields):

1. **Deploy schema changes first** (these apply to all datasets):

   ```bash
   npx sanity deploy
   ```

2. **Add content to development dataset** and test

3. **Copy to production** when ready

## Emergency Rollback

If you accidentally overwrite production:

```bash
# List available backups
ls -lah backups/

# Restore from backup
npx sanity dataset import backups/prod-YYYYMMDD-HHMMSS.tar.gz production --replace
```

## Best Practices

1. ✅ **Always backup production before syncing**
2. ✅ **Test changes in development first**
3. ✅ **Use version control for schema changes**
4. ✅ **Document breaking changes in migration files**
5. ✅ **Keep separate API tokens for dev/prod**
6. ✅ **Never commit `.env.local` to git**
7. ✅ **Use NDJSON exports for selective syncing**
8. ❌ **Never sync production to development** (can lose work-in-progress)
9. ❌ **Never use `--replace` without a backup**

## Current Content Status

### Development Dataset

- ✅ Site Settings: English + French (206 fields each)
- ✅ 5 Case Studies (Butasoya, Coproad, Justice Bot, NNP, Provapac)
- ✅ 5 Ventures
- ✅ 2 Programs (V2S, Hekima Time)
- ✅ 4 Events (Hekima sessions)
- ✅ 1 Team Member
- ✅ 1 Impact Metrics

### Production Dataset

⚠️ Status unknown - needs verification

## Questions?

See [CLAUDE.md](../CLAUDE.md) for general project rules or check Sanity documentation at https://www.sanity.io/docs
