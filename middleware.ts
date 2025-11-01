import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import type { Database } from '@/types/supabase'

// Create the i18n middleware
const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Handle i18n routing first (this also handles /studio)
  const i18nResponse = handleI18nRouting(request)

  // Create Supabase client and refresh session
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  // Merge Supabase cookies into i18n response (if any were set)
  const supabaseCookies = supabaseResponse.cookies.getAll()
  if (supabaseCookies.length > 0) {
    supabaseCookies.forEach((cookie) => {
      i18nResponse.cookies.set(cookie)
    })
  }

  return i18nResponse
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - /studio (Sanity Studio)
  // - Files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
}
