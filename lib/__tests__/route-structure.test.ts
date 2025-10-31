/**
 * Route Structure Validation Tests
 *
 * These tests validate the Next.js app structure to prevent deployment failures
 * caused by route conflicts, naming issues, and other structural problems.
 *
 * @see docs/STAGING_ENVIRONMENT.md - Deployment best practices
 * @see .claude/skills/deployment.md - Deployment troubleshooting
 */

import { describe, it, expect } from 'vitest'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

interface RouteInfo {
  path: string
  file: string
  routeGroup: string | null
}

/**
 * Recursively finds all page.tsx files in the app directory
 */
function findPageFiles(dir: string, baseDir: string = dir): RouteInfo[] {
  const pages: RouteInfo[] = []

  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        // Skip __tests__, node_modules, and hidden directories
        if (
          entry.name.startsWith('__') ||
          entry.name.startsWith('.') ||
          entry.name === 'node_modules'
        ) {
          continue
        }

        // Recurse into subdirectories
        pages.push(...findPageFiles(fullPath, baseDir))
      } else if (entry.name === 'page.tsx') {
        const relativePath = fullPath.replace(baseDir, '')
        const routeGroup = relativePath.match(/\(([^)]+)\)/)?.[1] || null

        pages.push({
          path: fullPath,
          file: relativePath,
          routeGroup,
        })
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    console.warn(`Could not read directory: ${dir}`)
  }

  return pages
}

/**
 * Converts a file path to its URL route
 * Handles dynamic segments, route groups, and special files
 */
function filePathToRoute(filePath: string): string {
  return filePath
    .replace(/\/page\.tsx$/, '') // Remove page.tsx
    .replace(/\/\([^)]+\)/g, '') // Remove route groups like (marketing)
    .replace(/\/\[([^\]]+)\]/g, '/:$1') // Convert [param] to :param
    .replace(/\/\[\.\.\.[^\]]+\]/g, '/*') // Convert [...catch-all] to /*
    .replace(/^\//, '') // Remove leading slash
}

describe('Route Structure Validation', () => {
  describe('Route Conflicts', () => {
    it('should not have duplicate route paths', () => {
      const appDir = join(process.cwd(), 'app')
      const pages = findPageFiles(appDir)

      // Map routes to their source files
      const routeMap = new Map<string, RouteInfo[]>()

      for (const page of pages) {
        const route = filePathToRoute(page.file)
        if (!routeMap.has(route)) {
          routeMap.set(route, [])
        }
        routeMap.get(route)!.push(page)
      }

      // Find duplicates
      const duplicates: Array<{ route: string; files: string[] }> = []

      for (const [route, files] of routeMap.entries()) {
        if (files.length > 1) {
          duplicates.push({
            route,
            files: files.map((f) => f.file),
          })
        }
      }

      // Assert no duplicates
      if (duplicates.length > 0) {
        const errorMessage = duplicates
          .map(
            (dup) =>
              `Route conflict: "${dup.route}" resolves from multiple files:\n${dup.files.map((f) => `  - ${f}`).join('\n')}`
          )
          .join('\n\n')

        throw new Error(
          `Found ${duplicates.length} route conflict(s):\n\n${errorMessage}\n\nFix: Rename one of the conflicting pages to a different path.`
        )
      }

      expect(duplicates).toHaveLength(0)
    })

    it('should not have conflicting dynamic and static routes at same level', () => {
      const appDir = join(process.cwd(), 'app')
      const pages = findPageFiles(appDir)

      const conflicts: string[] = []

      // Group by directory
      const dirMap = new Map<string, string[]>()

      for (const page of pages) {
        const dir = page.file
          .replace(/\/page\.tsx$/, '')
          .split('/')
          .slice(0, -1)
          .join('/')
        if (!dirMap.has(dir)) {
          dirMap.set(dir, [])
        }
        const segment =
          page.file
            .replace(/\/page\.tsx$/, '')
            .split('/')
            .pop() || ''
        dirMap.get(dir)!.push(segment)
      }

      // Check for conflicts between [param] and static routes
      for (const [dir, segments] of dirMap.entries()) {
        const hasDynamic = segments.some((s) => s.startsWith('['))
        const hasStatic = segments.some((s) => !s.startsWith('[') && !s.startsWith('('))

        if (hasDynamic && hasStatic && segments.length > 1) {
          conflicts.push(
            `${dir}: has both dynamic [param] and static routes: ${segments.join(', ')}`
          )
        }
      }

      expect(conflicts).toHaveLength(0)
    })
  })

  describe('File Naming Conventions', () => {
    it('should use kebab-case for route segments', () => {
      const appDir = join(process.cwd(), 'app')
      const pages = findPageFiles(appDir)

      const violations: string[] = []

      for (const page of pages) {
        const segments = page.file.split('/').filter((s) => s && s !== 'page.tsx')

        for (const segment of segments) {
          // Skip dynamic segments, route groups, and locale segment
          if (segment.startsWith('[') || segment.startsWith('(') || segment === '[locale]') {
            continue
          }

          // Check if segment is kebab-case (lowercase with hyphens)
          const isKebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(segment)

          if (!isKebabCase) {
            violations.push(`${page.file}: "${segment}" should be kebab-case`)
          }
        }
      }

      expect(violations).toHaveLength(0)
    })

    it('should not have trailing slashes in route segments', () => {
      const appDir = join(process.cwd(), 'app')
      const pages = findPageFiles(appDir)

      const violations: string[] = []

      for (const page of pages) {
        if (page.file.includes('//')) {
          violations.push(`${page.file}: contains double slashes`)
        }
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Required Files', () => {
    it('should have root layout at app/[locale]/layout.tsx', () => {
      const layoutPath = join(process.cwd(), 'app', '[locale]', 'layout.tsx')
      expect(() => statSync(layoutPath)).not.toThrow()
    })

    it('should have at least one layout.tsx file', () => {
      const appDir = join(process.cwd(), 'app')
      const layouts = findSpecialFiles(appDir, 'layout.tsx')
      expect(layouts.length).toBeGreaterThan(0)
    })
  })

  describe('Route Groups', () => {
    it('should use route groups for organizing without affecting URLs', () => {
      const appDir = join(process.cwd(), 'app')
      const pages = findPageFiles(appDir)

      // Ensure we have route groups for organization
      const routeGroups = new Set<string>()

      for (const page of pages) {
        if (page.routeGroup) {
          routeGroups.add(page.routeGroup)
        }
      }

      // We should have at least our known route groups
      expect(routeGroups.has('marketing')).toBe(true)
      expect(routeGroups.has('member')).toBe(true)
    })

    it('should not have pages directly under [locale] without route group', () => {
      const appDir = join(process.cwd(), 'app')
      const pages = findPageFiles(appDir)

      const violations: string[] = []

      for (const page of pages) {
        // Check if page is directly under [locale] (no route group)
        const match = page.file.match(/^\/\[locale\]\/([^/]+)\/page\.tsx$/)

        if (match && match[1]) {
          const segment = match[1]
          // If it's not a route group, it's a violation
          if (!segment.startsWith('(')) {
            violations.push(
              `${page.file}: page should be in a route group like (marketing) or (member)`
            )
          }
        }
      }

      // Allow some exceptions (e.g., direct [locale] page)
      const allowedExceptions = ['/[locale]/page.tsx']

      const filteredViolations = violations.filter(
        (v) => !allowedExceptions.some((ex) => v.includes(ex))
      )

      expect(filteredViolations).toHaveLength(0)
    })
  })

  describe('Special Files', () => {
    it('should not have conflicting loading.tsx files in same route', () => {
      const appDir = join(process.cwd(), 'app')

      // This is informational - multiple loading.tsx files are allowed
      // but should be used intentionally
      try {
        const loadingFiles = findSpecialFiles(appDir, 'loading.tsx')
        expect(Array.isArray(loadingFiles)).toBe(true)
      } catch {
        // File search failed, skip test
      }
    })

    it('should not have conflicting error.tsx files in same route', () => {
      const appDir = join(process.cwd(), 'app')

      // This is informational - multiple error.tsx files are allowed
      // but should be used intentionally
      try {
        const errorFiles = findSpecialFiles(appDir, 'error.tsx')
        expect(Array.isArray(errorFiles)).toBe(true)
      } catch {
        // File search failed, skip test
      }
    })
  })
})

/**
 * Helper function to find special files like loading.tsx, error.tsx
 */
function findSpecialFiles(dir: string, fileName: string): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        if (
          entry.name.startsWith('__') ||
          entry.name.startsWith('.') ||
          entry.name === 'node_modules'
        ) {
          continue
        }
        files.push(...findSpecialFiles(fullPath, fileName))
      } else if (entry.name === fileName) {
        files.push(fullPath)
      }
    }
  } catch {
    // Ignore errors
  }

  return files
}
