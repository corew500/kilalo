export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

// Validate that required env vars are set (will warn but not crash during build)
if (typeof window === 'undefined' && (!projectId || !dataset)) {
  console.warn(
    'Warning: Sanity environment variables not fully configured.',
    'NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required.'
  )
}
