import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Create the i18n middleware
const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Serve Service Worker directly from public folder
  if (pathname === '/sw.js') {
    const url = request.nextUrl.clone()
    url.pathname = '/sw.js'
    return NextResponse.rewrite(url)
  }

  // Skip i18n routing for Sanity Studio
  if (pathname.startsWith('/studio')) {
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
  // Note: We explicitly handle sw.js in middleware, so don't exclude it here
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/sw.js'],
}
