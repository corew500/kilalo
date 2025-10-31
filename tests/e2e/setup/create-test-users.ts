/**
 * Script to create test users in Supabase for E2E testing
 * Run this once before running authenticated E2E tests
 *
 * Usage:
 *   npx tsx tests/e2e/setup/create-test-users.ts
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { setupTestUsers } from '../helpers/auth'

// Load environment variables from .env.local
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  envFile.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      process.env[key] = valueParts.join('=')
    }
  })
} catch (error) {
  console.error('Could not load .env.local file:', error)
  process.exit(1)
}

async function main() {
  console.log('🔧 Setting up test users for E2E testing...\n')

  try {
    await setupTestUsers()
    console.log('\n✅ Test user setup complete!')
    console.log('\nTest users created:')
    console.log('  - entrepreneur.test@kilalo.local (entrepreneur)')
    console.log('  - mentor.test@kilalo.local (mentor)')
    console.log('  - community.test@kilalo.local (community_member)')
    console.log('\nPassword for all test users: TestPassword123!')
  } catch (error) {
    console.error('\n❌ Test user setup failed:', error)
    process.exit(1)
  }
}

main()
