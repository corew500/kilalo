import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Create the i18n middleware
const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Skip i18n routing for Sanity Studio
  if (request.nextUrl.pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  // Handle i18n routing
  const response = handleI18nRouting(request)

  // Note: Supabase auth middleware will be added when auth features are implemented
  // For now, just handle i18n routing

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
