#!/bin/bash

# Sanity Development to Production Sync Script
# This script safely syncs content from development to production dataset

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Sanity Production Sync"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -f "sanity.config.ts" ]; then
    echo -e "${RED}Error: Must be run from project root${NC}"
    exit 1
fi

# Create backups directory if it doesn't exist
mkdir -p sanity/backups

# Show current status
echo -e "${YELLOW}📊 Checking current status...${NC}"
echo ""

echo "Development last updated:"
npx sanity documents query '*[_type == "siteSettings"] | order(_updatedAt desc)[0] {_id, _updatedAt}' --dataset development --pretty

echo ""
echo "Production last updated:"
npx sanity documents query '*[_type == "siteSettings"] | order(_updatedAt desc)[0] {_id, _updatedAt}' --dataset production --pretty

echo ""
echo -e "${RED}⚠️  WARNING: This will overwrite PRODUCTION data!${NC}"
echo ""
echo "This script will:"
echo "  1. Backup production dataset"
echo "  2. Clean up duplicate Site Settings in production"
echo "  3. Export Site Settings from development"
echo "  4. Import to production"
echo ""
echo -e "${YELLOW}Have you reviewed the changes in development? (yes/no)${NC}"
read -r review_confirmation

if [ "$review_confirmation" != "yes" ]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Type 'SYNC TO PRODUCTION' to continue:${NC}"
read -r confirmation

if [ "$confirmation" != "SYNC TO PRODUCTION" ]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Confirmed. Proceeding with sync...${NC}"
echo ""

# Step 1: Backup production
BACKUP_FILE="sanity/backups/production-$(date +%Y%m%d-%H%M%S).tar.gz"
echo -e "${YELLOW}📦 Backing up production dataset...${NC}"
npx sanity dataset export production "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup saved to: $BACKUP_FILE${NC}"
echo ""

# Step 2: Clean up old duplicates in production
echo -e "${YELLOW}🧹 Cleaning up duplicate Site Settings in production...${NC}"
npx sanity documents delete site-settings-en site-settings-fr --dataset production || echo "Documents may not exist, continuing..."
echo -e "${GREEN}✓ Duplicates cleaned${NC}"
echo ""

# Step 3: Export from development
EXPORT_FILE="sanity/backups/dev-export-$(date +%Y%m%d-%H%M%S).ndjson"
echo -e "${YELLOW}📤 Exporting Site Settings from development...${NC}"
npx sanity documents query '*[_type == "siteSettings"]' --dataset development > "$EXPORT_FILE"
echo -e "${GREEN}✓ Exported to: $EXPORT_FILE${NC}"
echo ""

# Step 4: Import to production
echo -e "${YELLOW}📥 Importing to production...${NC}"
npx sanity dataset import "$EXPORT_FILE" production --replace
echo -e "${GREEN}✓ Import complete${NC}"
echo ""

# Verify
echo -e "${YELLOW}🔍 Verifying sync...${NC}"
echo ""
echo "Production Site Settings:"
npx sanity documents query '*[_type == "siteSettings"] {_id, language, _updatedAt}' --dataset production --pretty

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Sync Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "  1. Verify content at your production Sanity Studio"
echo "  2. Check your production website for correct translations"
echo "  3. If something went wrong, restore from: $BACKUP_FILE"
echo ""
echo "To restore from backup:"
echo "  npx sanity dataset import $BACKUP_FILE production --replace"
echo ""
