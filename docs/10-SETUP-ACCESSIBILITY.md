# WCAG 2.1 AA Accessibility Setup Guide

This guide covers implementing WCAG 2.1 Level AA compliance for the Kilalo marketing website.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Semantic HTML](#semantic-html)
4. [ARIA Attributes](#aria-attributes)
5. [Keyboard Navigation](#keyboard-navigation)
6. [Focus Management](#focus-management)
7. [Screen Reader Testing](#screen-reader-testing)
8. [Color Contrast](#color-contrast)
9. [Form Accessibility](#form-accessibility)
10. [Image Accessibility](#image-accessibility)
11. [Skip Links](#skip-links)
12. [Testing Tools](#testing-tools)
13. [Accessibility Checklist](#accessibility-checklist)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Next Steps](#next-steps)

## Overview

**WCAG 2.1 Level AA** is the international standard for web accessibility, ensuring your website is usable by people with disabilities.

### Why Accessibility Matters

- **Legal Compliance**: Required by law in many jurisdictions (ADA, AODA, etc.)
- **Broader Audience**: 15% of the global population has some form of disability
- **Better UX**: Accessible sites are better for everyone
- **SEO Benefits**: Semantic HTML improves search rankings
- **Brand Reputation**: Shows commitment to inclusion

### WCAG Principles (POUR)

1. **Perceivable**: Information must be presentable to users
2. **Operable**: UI components must be operable
3. **Understandable**: Information must be understandable
4. **Robust**: Content must be robust enough for assistive technologies

## Prerequisites

- Next.js 15 project with TypeScript (see [03-SETUP-NEXTJS.md](./03-SETUP-NEXTJS.md))
- ESLint with jsx-a11y configured (see [05-SETUP-TYPESCRIPT-ESLINT.md](./05-SETUP-TYPESCRIPT-ESLINT.md))
- Playwright testing setup (see [06-SETUP-TESTING.md](./06-SETUP-TESTING.md))

## Semantic HTML

### Use Proper HTML Elements

```typescript
// ✅ Good - Semantic HTML
<header>
  <nav>
    <ul>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>&copy; 2024 Kilalo</p>
</footer>

// ❌ Bad - Generic divs
<div className="header">
  <div className="nav">
    <div className="link">About</div>
  </div>
</div>
```

### Heading Hierarchy

```typescript
// ✅ Good - Proper hierarchy
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>

// ❌ Bad - Skipping levels
<h1>Page Title</h1>
  <h4>Section</h4> {/* Don't skip h2, h3 */}
```

### Landmark Regions

```typescript
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">
          {/* Navigation links */}
        </nav>
      </header>

      <main id="main-content">
        {children}
      </main>

      <aside aria-label="Related content">
        {/* Sidebar */}
      </aside>

      <footer>
        {/* Footer content */}
      </footer>
    </>
  )
}
```

## ARIA Attributes

### Aria Labels

```typescript
// Button with icon only
<button aria-label="Close dialog">
  <XIcon />
</button>

// Navigation with multiple navs
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>

// Form with multiple search inputs
<form aria-label="Site search">...</form>
<form aria-label="Blog search">...</form>
```

### Aria Described By

```typescript
export function PasswordInput() {
  return (
    <div>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        aria-describedby="password-requirements"
      />
      <p id="password-requirements">
        Must be at least 8 characters with a number and special character
      </p>
    </div>
  )
}
```

### Aria Live Regions

```typescript
'use client'

import { useState } from 'react'

export function FormWithStatus() {
  const [status, setStatus] = useState('')

  return (
    <form>
      {/* Form fields */}

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {status}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault()
          setStatus('Form submitted successfully')
        }}
      >
        Submit
      </button>
    </form>
  )
}
```

### Aria Expanded

```typescript
'use client'

import { useState } from 'react'

export function Accordion() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls="accordion-content"
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle Content
      </button>

      <div id="accordion-content" hidden={!isOpen}>
        <p>Accordion content</p>
      </div>
    </div>
  )
}
```

## Keyboard Navigation

### Focusable Interactive Elements

```typescript
// ✅ Good - Native button (keyboard accessible by default)
<button onClick={handleClick}>Click me</button>

// ❌ Bad - Div with onClick (not keyboard accessible)
<div onClick={handleClick}>Click me</div>

// ⚠️ Acceptable - Div with full keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Click me
</div>
```

### Tab Order

```typescript
// ✅ Good - Natural tab order
<form>
  <input name="first" />
  <input name="second" />
  <input name="third" />
  <button type="submit">Submit</button>
</form>

// ❌ Bad - Positive tabIndex (avoid)
<form>
  <input name="first" tabIndex={3} />
  <input name="second" tabIndex={1} />
  <input name="third" tabIndex={2} />
</form>

// ✅ Good - Remove from tab order
<div tabIndex={-1}>Not keyboard accessible</div>
```

### Keyboard Shortcuts

```typescript
'use client'

import { useEffect } from 'react'

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in input
      if (e.target instanceof HTMLInputElement) return

      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        document.getElementById('search')?.focus()
      }

      if (e.key === 'Escape') {
        // Close modals, dropdowns, etc.
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}
```

## Focus Management

### Focus Visible Styles

```css
/* globals.css */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Remove default outline */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Focus Trap in Modals

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { Dialog } from '@/components/ui/dialog'

export function AccessibleDialog({ open, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      // Focus close button when dialog opens
      closeButtonRef.current?.focus()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <h2 id="dialog-title">Dialog Title</h2>

        <p>Dialog content</p>

        <button ref={closeButtonRef} onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  )
}
```

### Managing Focus After Actions

```typescript
'use client'

import { useRef } from 'react'

export function DeleteButton({ onDelete }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleDelete = async () => {
    await onDelete()

    // Return focus to trigger after deletion
    triggerRef.current?.focus()
  }

  return (
    <button ref={triggerRef} onClick={handleDelete}>
      Delete
    </button>
  )
}
```

## Screen Reader Testing

### Screen Reader Only Text

```css
/* globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Usage:

```typescript
<button>
  <TrashIcon />
  <span className="sr-only">Delete item</span>
</button>
```

### Testing with Screen Readers

**macOS - VoiceOver**:
```bash
# Turn on: Cmd + F5
# Navigate: Control + Option + Arrow keys
# Read: Control + Option + A (read all)
```

**Windows - NVDA** (free):
```bash
# Download: https://www.nvaccess.org/download/
# Turn on: Control + Alt + N
# Navigate: Arrow keys
# Read: Insert + Down Arrow (read all)
```

**Windows - JAWS** (paid):
```bash
# Navigate: Arrow keys
# Read: Insert + Down Arrow (read all)
```

### Common Screen Reader Tests

```typescript
// 1. Logo/heading announces correctly
<h1>
  <a href="/">
    <img src="/logo.png" alt="Kilalo - Home" />
  </a>
</h1>

// 2. Form fields have labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// 3. Buttons describe action
<button>Submit form</button> {/* Not just "Submit" */}

// 4. Links describe destination
<a href="/services">View our services</a> {/* Not "Click here" */}

// 5. Images have alt text
<img src="/team.jpg" alt="The Kilalo team at our 2024 retreat" />
```

## Color Contrast

### WCAG AA Requirements

- **Normal text** (< 18pt): 4.5:1 contrast ratio
- **Large text** (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### Checking Contrast

Use browser DevTools or online tools:

```bash
# Chrome DevTools
1. Inspect element
2. Check "Accessibility" tab
3. Look for "Contrast" section
```

### Tailwind Color Contrast

```typescript
// ✅ Good - High contrast
<p className="text-gray-900 dark:text-gray-100">
  High contrast text
</p>

// ❌ Bad - Low contrast
<p className="text-gray-400">
  Low contrast text on white background
</p>

// ✅ Good - Ensure background/foreground pairs meet standards
<div className="bg-primary text-primary-foreground">
  Uses CSS variables with verified contrast
</div>
```

### Testing Tools

Install browser extensions:
- **axe DevTools** (Chrome/Firefox)
- **WAVE** (Chrome/Firefox)
- **Lighthouse** (built into Chrome)

## Form Accessibility

### Accessible Form Component

```typescript
export function AccessibleForm() {
  return (
    <form>
      <div>
        <label htmlFor="name">
          Full Name <span aria-label="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          aria-required="true"
          aria-invalid="false"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          aria-describedby="email-format"
        />
        <p id="email-format" className="text-sm text-muted-foreground">
          We'll never share your email
        </p>
      </div>

      <fieldset>
        <legend>Preferred contact method</legend>
        <div>
          <input type="radio" id="contact-email" name="contact" value="email" />
          <label htmlFor="contact-email">Email</label>
        </div>
        <div>
          <input type="radio" id="contact-phone" name="contact" value="phone" />
          <label htmlFor="contact-phone">Phone</label>
        </div>
      </fieldset>

      <button type="submit">Submit form</button>
    </form>
  )
}
```

### Error Messages

```typescript
'use client'

import { useState } from 'react'

export function FormWithValidation() {
  const [emailError, setEmailError] = useState('')

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        aria-invalid={emailError ? 'true' : 'false'}
        aria-describedby={emailError ? 'email-error' : undefined}
      />
      {emailError && (
        <p id="email-error" role="alert" className="text-destructive">
          {emailError}
        </p>
      )}
    </div>
  )
}
```

## Image Accessibility

### Alt Text Guidelines

```typescript
// ✅ Good - Descriptive alt text
<img
  src="/team.jpg"
  alt="Five team members smiling in front of the Kilalo office"
/>

// ✅ Good - Decorative image (empty alt)
<img
  src="/decorative-line.svg"
  alt=""
  role="presentation"
/>

// ❌ Bad - No alt attribute
<img src="/team.jpg" />

// ❌ Bad - Redundant alt text
<img src="/logo.png" alt="Logo image" />
```

### Complex Images

```typescript
<figure>
  <img
    src="/chart.png"
    alt="Bar chart showing growth"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">
    Revenue increased from $1M in 2022 to $3M in 2023,
    representing 200% growth year-over-year.
  </figcaption>
</figure>
```

### Next.js Image Component

```typescript
import Image from 'next/image'

export function AccessibleImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Modern office space with collaborative work areas"
      width={1200}
      height={630}
      priority
    />
  )
}
```

## Skip Links

### Create Skip Link Component

```typescript
// src/components/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
    >
      Skip to main content
    </a>
  )
}
```

### Use in Layout

```typescript
// src/app/[locale]/layout.tsx
import { SkipLink } from '@/components/skip-link'

export default function Layout({ children }: Props) {
  return (
    <html>
      <body>
        <SkipLink />

        <header>
          <nav>...</nav>
        </header>

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <footer>...</footer>
      </body>
    </html>
  )
}
```

## Testing Tools

### Automated Testing with axe

See [06-SETUP-TESTING.md](./06-SETUP-TESTING.md) for Playwright + axe setup.

### Manual Testing Checklist

```bash
# 1. Keyboard navigation
- Tab through entire page
- Verify focus indicators visible
- Test all interactive elements
- Check tab order is logical

# 2. Screen reader
- Navigate with screen reader
- Verify all content announced
- Check form labels
- Test image alt text

# 3. Zoom/magnification
- Zoom to 200%
- Verify no horizontal scroll
- Check text doesn't overlap
- Test responsive behavior

# 4. Color/contrast
- Use grayscale mode
- Verify information not color-only
- Check contrast ratios
- Test dark mode

# 5. Forms
- Test without mouse
- Verify error messages
- Check required field indicators
- Test validation feedback
```

### Browser Extensions

Install these extensions for testing:

1. **axe DevTools** - Automated accessibility testing
2. **WAVE** - Visual accessibility evaluation
3. **Lighthouse** - Performance and accessibility audit
4. **Screen Reader** - Test with real assistive technology

## Accessibility Checklist

### WCAG 2.1 AA Compliance

- [ ] All images have alt text
- [ ] Color contrast meets 4.5:1 (normal text) or 3:1 (large text)
- [ ] All functionality keyboard accessible
- [ ] Focus indicators visible
- [ ] Form labels properly associated
- [ ] Headings in logical order (h1, h2, h3...)
- [ ] Skip link provided
- [ ] ARIA attributes used correctly
- [ ] No keyboard traps
- [ ] Page title describes content
- [ ] Language specified in HTML tag
- [ ] Error messages clear and helpful
- [ ] Time limits can be extended
- [ ] No flashing content (seizure risk)
- [ ] Responsive at 200% zoom
- [ ] Link text describes destination

## Best Practices

### 1. Test Early and Often

Run accessibility tests during development, not just at the end.

### 2. Use Semantic HTML First

Before reaching for ARIA, check if semantic HTML solves the problem.

### 3. Don't Rely on Color Alone

```typescript
// ❌ Bad - Color only
<span className="text-red-500">Error</span>

// ✅ Good - Icon + text + color
<span className="text-destructive flex items-center gap-2">
  <AlertIcon />
  Error: Invalid input
</span>
```

### 4. Provide Text Alternatives

All non-text content needs a text alternative.

### 5. Make Interactive Elements Obvious

Ensure buttons, links, and inputs are clearly identifiable.

### 6. Test with Real Users

Automated tools catch ~30-40% of issues. Test with people who use assistive technology.

## Troubleshooting

### Issue: Focus Outline Not Visible

**Solution**: Ensure you're using `:focus-visible` not `:focus`:

```css
button:focus-visible {
  outline: 2px solid hsl(var(--ring));
}
```

### Issue: Screen Reader Not Announcing Changes

**Solution**: Use `aria-live` regions for dynamic content.

### Issue: Keyboard Trap in Modal

**Solution**: Implement focus trap with proper focus management.

## Next Steps

1. **Run automated tests**: See [06-SETUP-TESTING.md](./06-SETUP-TESTING.md)
2. **Manual keyboard testing**: Tab through entire site
3. **Screen reader testing**: Test with VoiceOver/NVDA
4. **Color contrast audit**: Check all text/background pairs
5. **User testing**: Test with people who use assistive technology

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [a11y Project](https://www.a11yproject.com/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
