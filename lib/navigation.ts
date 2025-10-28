/**
 * Type-safe navigation APIs for next-intl
 *
 * Provides locale-aware Link, redirect, usePathname, useRouter, and getPathname.
 * These components automatically handle user locale and pathnames.
 */

import { createNavigation } from 'next-intl/navigation'
import { routing } from '@/i18n/routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
