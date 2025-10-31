import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

// Create the i18n middleware
const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Skip i18n routing for Sanity Studio
  if (request.nextUrl.pathname.startsWith('/studio')) {
    return updateSession(request)
  }

  // Handle i18n routing first
  const response = handleI18nRouting(request)

  // Update Supabase session
  await updateSession(request)

  return response
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
