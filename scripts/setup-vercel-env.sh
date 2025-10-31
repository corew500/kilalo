#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps configure environment variables for preview/staging deployments

set -e

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Link to project if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking to Vercel project..."
    vercel link
    echo ""
fi

echo "📋 Current environment variables:"
echo ""
vercel env ls
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_value=$2
    local environment=$3

    echo "Adding $var_name to $environment environment..."
    echo "$var_value" | vercel env add "$var_name" "$environment" --yes 2>/dev/null || true
}

echo "🔧 Setting up preview environment variables..."
echo ""

# NEXT_PUBLIC_SITE_URL for preview
echo "Setting NEXT_PUBLIC_SITE_URL for preview deployments..."
echo "Note: This will be the staging branch URL"
echo "Default: https://kilalo-git-staging-corey-wests-projects.vercel.app"
read -p "Press Enter to use default or type custom URL: " SITE_URL
SITE_URL=${SITE_URL:-"https://kilalo-git-staging-corey-wests-projects.vercel.app"}

# Check if variable already exists
if vercel env ls | grep -q "NEXT_PUBLIC_SITE_URL.*Preview"; then
    echo "ℹ️  NEXT_PUBLIC_SITE_URL already exists for Preview"
    read -p "Do you want to update it? (y/N): " UPDATE
    if [[ $UPDATE =~ ^[Yy]$ ]]; then
        vercel env rm NEXT_PUBLIC_SITE_URL preview --yes || true
        add_env_var "NEXT_PUBLIC_SITE_URL" "$SITE_URL" "preview"
    fi
else
    add_env_var "NEXT_PUBLIC_SITE_URL" "$SITE_URL" "preview"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Summary:"
echo "   - Preview environment uses NEXT_PUBLIC_SANITY_DATASET=development"
echo "   - Preview environment uses NEXT_PUBLIC_SITE_URL=$SITE_URL"
echo ""
echo "🔍 Verify your environment variables:"
echo "   vercel env ls"
echo ""
echo "🚀 Next steps:"
echo "   1. Push to staging branch: git push origin staging"
echo "   2. Vercel will auto-deploy to: $SITE_URL"
echo "   3. Test your staging deployment"
echo ""
