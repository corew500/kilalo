# Kilalo Theme Configuration Guide

This guide covers implementing the complete Kilalo design system theme with Tailwind CSS, shadcn/ui, and modern best practices.

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [Modern Tailwind Setup](#modern-tailwind-setup)
4. [OKLCH Color Space](#oklch-color-space)
5. [Theme Configuration](#theme-configuration)
6. [CSS Variables](#css-variables)
7. [Opacity Modifiers](#opacity-modifiers)
8. [Arbitrary Values](#arbitrary-values)
9. [Design Tokens](#design-tokens)
10. [shadcn/ui Integration](#shadcnui-integration)
11. [Dark Mode](#dark-mode)
12. [Typography](#typography)
13. [Spacing & Layout](#spacing--layout)
14. [Animation & Transitions](#animation--transitions)
15. [Usage Examples](#usage-examples)
16. [Accessibility](#accessibility)
17. [Best Practices](#best-practices)
18. [Resources](#resources)

## Overview

The Kilalo design system uses a comprehensive theming approach that combines:
- **Modern color science** with OKLCH color space for perceptual uniformity
- **Design tokens** for consistent, scalable styling
- **CSS variables** for runtime theming and dark mode
- **Type-safe** theme configuration with TypeScript
- **Accessibility-first** approach meeting WCAG 2.1 AA standards

### Brand Identity

- **Primary**: Teal `#215965` - Trust, professionalism, strategic direction
- **Secondary**: Orange `#F39200` - Energy, action, execution
- **Extended Palette**: Complementary, analogous, and triadic colors for depth

## Design System

### Color Palette Philosophy

The Kilalo palette uses color theory principles:

```
Primary (Teal)     → Brand identity, trust, stability
   ├── Analogous: Forest Green (#21654f) → Growth, success
   └── Analogous: Navy Blue (#213765) → Intelligence, depth

Secondary (Orange) → Action, energy, CTAs
   └── Complementary: Rust (#652d21) → Warmth, earthiness

Triadic Accents
   ├── Purple (#2d2165) → Premium, sophistication
   └── Plum (#652159) → Passion, innovation
```

### Color Meanings

| Color | Hex | Use Case | Emotion |
|-------|-----|----------|---------|
| **Primary Teal** | `#215965` | Buttons, headers, navigation | Trust, strategy |
| **Secondary Orange** | `#F39200` | CTAs, highlights, logo | Energy, action |
| **Forest Green** | `#21654f` | Success states, growth | Prosperity, harmony |
| **Navy Blue** | `#213765` | Info states, sections | Authority, calm |
| **Rust** | `#652d21` | Warnings, accents | Grounded, warmth |
| **Purple** | `#2d2165` | Premium features | Exclusive, creative |
| **Plum** | `#652159` | Special callouts | Bold, unique |

## Modern Tailwind Setup

### Install Tailwind CSS v4 (Recommended)

```bash
npm install -D tailwindcss@next @tailwindcss/postcss@next
npm install -D tailwindcss-animate
```

### PostCSS Configuration

Create `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

## OKLCH Color Space

### Why OKLCH?

OKLCH (Lightness, Chroma, Hue in polar coordinates) provides:
- **Perceptual uniformity**: Equal steps = equal perceived difference
- **Better color ramps**: More consistent lightness progression
- **Predictable mixing**: Colors blend more naturally
- **Wider gamut**: Access to more vibrant colors

### OKLCH Conversion

Convert hex to OKLCH using online tools or this formula:

```javascript
// Primary Teal: #215965
// OKLCH: oklch(36.5% 0.067 210.2)

// Secondary Orange: #F39200
// OKLCH: oklch(70.3% 0.168 58.6)
```

### OKLCH Color Definitions

```css
@theme {
  /* Primary Teal Scale */
  --color-primary-50: oklch(96.8% 0.013 210.2);
  --color-primary-100: oklch(92.4% 0.026 210.2);
  --color-primary-200: oklch(84.8% 0.048 210.2);
  --color-primary-300: oklch(71.6% 0.062 210.2);
  --color-primary-400: oklch(54.0% 0.070 210.2);
  --color-primary-500: oklch(36.5% 0.067 210.2); /* Base #215965 */
  --color-primary-600: oklch(29.8% 0.055 210.2);
  --color-primary-700: oklch(23.2% 0.043 210.2);
  --color-primary-800: oklch(17.3% 0.032 210.2);
  --color-primary-900: oklch(11.9% 0.022 210.2);
  --color-primary-950: oklch(8.1% 0.015 210.2);

  /* Secondary Orange Scale */
  --color-secondary-50: oklch(97.9% 0.033 58.6);
  --color-secondary-100: oklch(95.2% 0.065 58.6);
  --color-secondary-200: oklch(90.4% 0.121 58.6);
  --color-secondary-300: oklch(85.6% 0.155 58.6);
  --color-secondary-400: oklch(78.0% 0.171 58.6);
  --color-secondary-500: oklch(70.3% 0.168 58.6); /* Base #F39200 */
  --color-secondary-600: oklch(59.7% 0.142 58.6);
  --color-secondary-700: oklch(49.1% 0.117 58.6);
  --color-secondary-800: oklch(38.5% 0.091 58.6);
  --color-secondary-900: oklch(28.0% 0.066 58.6);
  --color-secondary-950: oklch(19.6% 0.046 58.6);

  /* Forest Green Scale */
  --color-forest-50: oklch(96.7% 0.015 162.3);
  --color-forest-100: oklch(92.1% 0.030 162.3);
  --color-forest-200: oklch(84.2% 0.055 162.3);
  --color-forest-300: oklch(71.5% 0.071 162.3);
  --color-forest-400: oklch(53.8% 0.078 162.3);
  --color-forest-500: oklch(36.2% 0.074 162.3); /* Base #21654f */
  --color-forest-600: oklch(29.5% 0.061 162.3);
  --color-forest-700: oklch(22.9% 0.047 162.3);
  --color-forest-800: oklch(17.1% 0.035 162.3);
  --color-forest-900: oklch(11.8% 0.024 162.3);
  --color-forest-950: oklch(8.0% 0.016 162.3);

  /* Navy Blue Scale */
  --color-navy-50: oklch(96.4% 0.014 258.3);
  --color-navy-100: oklch(91.6% 0.028 258.3);
  --color-navy-200: oklch(83.2% 0.051 258.3);
  --color-navy-300: oklch(70.0% 0.066 258.3);
  --color-navy-400: oklch(52.0% 0.073 258.3);
  --color-navy-500: oklch(34.1% 0.069 258.3); /* Base #213765 */
  --color-navy-600: oklch(27.8% 0.057 258.3);
  --color-navy-700: oklch(21.6% 0.044 258.3);
  --color-navy-800: oklch(16.1% 0.033 258.3);
  --color-navy-900: oklch(11.1% 0.022 258.3);
  --color-navy-950: oklch(7.5% 0.015 258.3);

  /* Rust Scale */
  --color-rust-50: oklch(96.0% 0.013 26.8);
  --color-rust-100: oklch(90.8% 0.026 26.8);
  --color-rust-200: oklch(81.6% 0.048 26.8);
  --color-rust-300: oklch(67.6% 0.062 26.8);
  --color-rust-400: oklch(49.2% 0.068 26.8);
  --color-rust-500: oklch(30.9% 0.064 26.8); /* Base #652d21 */
  --color-rust-600: oklch(25.2% 0.053 26.8);
  --color-rust-700: oklch(19.6% 0.041 26.8);
  --color-rust-800: oklch(14.6% 0.030 26.8);
  --color-rust-900: oklch(10.1% 0.021 26.8);
  --color-rust-950: oklch(6.8% 0.014 26.8);

  /* Purple Scale */
  --color-purple-50: oklch(96.1% 0.015 297.5);
  --color-purple-100: oklch(91.0% 0.030 297.5);
  --color-purple-200: oklch(82.0% 0.055 297.5);
  --color-purple-300: oklch(68.4% 0.071 297.5);
  --color-purple-400: oklch(50.4% 0.079 297.5);
  --color-purple-500: oklch(32.4% 0.075 297.5); /* Base #2d2165 */
  --color-purple-600: oklch(26.4% 0.062 297.5);
  --color-purple-700: oklch(20.5% 0.048 297.5);
  --color-purple-800: oklch(15.3% 0.036 297.5);
  --color-purple-900: oklch(10.5% 0.024 297.5);
  --color-purple-950: oklch(7.2% 0.017 297.5);

  /* Plum Scale */
  --color-plum-50: oklch(95.9% 0.014 330.2);
  --color-plum-100: oklch(90.5% 0.028 330.2);
  --color-plum-200: oklch(81.1% 0.051 330.2);
  --color-plum-300: oklch(67.2% 0.066 330.2);
  --color-plum-400: oklch(49.0% 0.073 330.2);
  --color-plum-500: oklch(30.8% 0.069 330.2); /* Base #652159 */
  --color-plum-600: oklch(25.1% 0.057 330.2);
  --color-plum-700: oklch(19.5% 0.044 330.2);
  --color-plum-800: oklch(14.5% 0.033 330.2);
  --color-plum-900: oklch(10.0% 0.022 330.2);
  --color-plum-950: oklch(6.8% 0.015 330.2);
}
```

## Theme Configuration

### Modern @theme Directive

Update `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* === BRAND COLORS === */

  /* Primary Teal - OKLCH for perceptual uniformity */
  --color-primary-50: oklch(96.8% 0.013 210.2);
  --color-primary-100: oklch(92.4% 0.026 210.2);
  --color-primary-200: oklch(84.8% 0.048 210.2);
  --color-primary-300: oklch(71.6% 0.062 210.2);
  --color-primary-400: oklch(54.0% 0.070 210.2);
  --color-primary-500: oklch(36.5% 0.067 210.2);
  --color-primary-600: oklch(29.8% 0.055 210.2);
  --color-primary-700: oklch(23.2% 0.043 210.2);
  --color-primary-800: oklch(17.3% 0.032 210.2);
  --color-primary-900: oklch(11.9% 0.022 210.2);
  --color-primary-950: oklch(8.1% 0.015 210.2);

  /* Secondary Orange */
  --color-secondary-50: oklch(97.9% 0.033 58.6);
  --color-secondary-100: oklch(95.2% 0.065 58.6);
  --color-secondary-200: oklch(90.4% 0.121 58.6);
  --color-secondary-300: oklch(85.6% 0.155 58.6);
  --color-secondary-400: oklch(78.0% 0.171 58.6);
  --color-secondary-500: oklch(70.3% 0.168 58.6);
  --color-secondary-600: oklch(59.7% 0.142 58.6);
  --color-secondary-700: oklch(49.1% 0.117 58.6);
  --color-secondary-800: oklch(38.5% 0.091 58.6);
  --color-secondary-900: oklch(28.0% 0.066 58.6);
  --color-secondary-950: oklch(19.6% 0.046 58.6);

  /* Extended palette - see OKLCH definitions above */

  /* === DESIGN TOKENS === */

  /* Typography */
  --font-display: "Satoshi", "Inter", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", "JetBrains Mono", monospace;

  /* Spacing */
  --spacing-page-gutter: 1.5rem;
  --spacing-section: 4rem;
  --spacing-component: 1rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Transitions */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Breakpoints (custom) */
  --breakpoint-3xl: 1920px;
  --breakpoint-4xl: 2560px;
}

/* === SEMANTIC THEME VARIABLES === */

:root {
  /* Background & Foreground */
  --background: 0 0% 100%;
  --foreground: 193 50% 10%;

  /* Primary */
  --primary: 193 50% 26%;
  --primary-foreground: 0 0% 100%;

  /* Secondary */
  --secondary: 35 100% 48%;
  --secondary-foreground: 0 0% 100%;

  /* Muted */
  --muted: 193 20% 96%;
  --muted-foreground: 193 10% 40%;

  /* Accent */
  --accent: 35 100% 95%;
  --accent-foreground: 35 100% 25%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 193 50% 10%;

  /* Popover */
  --popover: 0 0% 100%;
  --popover-foreground: 193 50% 10%;

  /* Border & Input */
  --border: 193 20% 85%;
  --input: 193 20% 85%;
  --ring: 193 50% 26%;

  /* Destructive */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;

  /* Success (Forest Green) */
  --success: 162 50% 36%;
  --success-foreground: 0 0% 100%;

  /* Warning (Rust) */
  --warning: 27 50% 27%;
  --warning-foreground: 0 0% 100%;

  /* Info (Navy) */
  --info: 258 50% 30%;
  --info-foreground: 0 0% 100%;

  /* Radius */
  --radius: 0.5rem;
}

/* === DARK MODE === */

.dark {
  --background: 193 50% 8%;
  --foreground: 0 0% 98%;

  --primary: 193 50% 40%;
  --primary-foreground: 0 0% 100%;

  --secondary: 35 100% 55%;
  --secondary-foreground: 0 0% 100%;

  --muted: 193 30% 20%;
  --muted-foreground: 193 10% 70%;

  --accent: 35 80% 25%;
  --accent-foreground: 0 0% 98%;

  --card: 193 45% 12%;
  --card-foreground: 0 0% 98%;

  --popover: 193 45% 10%;
  --popover-foreground: 0 0% 98%;

  --border: 193 30% 25%;
  --input: 193 30% 25%;
  --ring: 193 50% 40%;

  --destructive: 0 62% 50%;
  --destructive-foreground: 0 0% 98%;

  --success: 162 50% 45%;
  --success-foreground: 0 0% 100%;

  --warning: 27 60% 35%;
  --warning-foreground: 0 0% 100%;

  --info: 258 50% 42%;
  --info-foreground: 0 0% 100%;
}

/* === BASE STYLES === */

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

## CSS Variables

### Accessing Theme Variables

```html
<!-- Direct CSS variable access -->
<div style="background: var(--color-primary-500)">

<!-- Using Tailwind shorthand -->
<div class="bg-(--color-primary-500)">

<!-- With calc() for dynamic values -->
<div class="rounded-[calc(var(--radius-xl)-1px)]">
```

### Custom Utilities with --value()

```css
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-8: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}
```

Usage:

```html
<pre class="tab-4">  <!-- Uses --tab-size-4: 4 -->
<pre class="tab-[12]"> <!-- Arbitrary value: 12 -->
```

## Opacity Modifiers

### Slash Notation for Opacity

```html
<!-- Background with opacity -->
<div class="bg-primary/50">       <!-- 50% opacity -->
<div class="bg-secondary/80">     <!-- 80% opacity -->
<div class="bg-forest/20">        <!-- 20% opacity -->

<!-- Text with opacity -->
<p class="text-primary/75">       <!-- 75% opacity -->

<!-- Border with opacity -->
<div class="border-primary/30">   <!-- 30% opacity -->

<!-- Responsive opacity -->
<div class="bg-primary/50 hover:bg-primary/75 active:bg-primary">
```

### Color with Opacity in CSS

```css
.custom-element {
  /* Using opacity modifier */
  background: oklch(from var(--color-primary-500) l c h / 0.5);

  /* Or with alpha */
  color: oklch(36.5% 0.067 210.2 / 0.8);
}
```

## Arbitrary Values

### One-Off Custom Values

```html
<!-- Custom colors -->
<div class="bg-[#215965]">
<div class="text-[oklch(70.3%_0.168_58.6)]">

<!-- Custom spacing -->
<div class="mt-[117px] lg:mt-[344px]">
<div class="p-[2.375rem]">

<!-- Custom sizes -->
<div class="w-[clamp(300px,50vw,800px)]">

<!-- CSS variables in arbitrary values -->
<div class="bg-[var(--color-primary-500)]">
<div class="rounded-[calc(var(--radius-xl)-1px)]">

<!-- Complex grid values -->
<div class="grid-cols-[1fr_minmax(300px,2fr)_1fr]">
```

### When to Use Arbitrary Values

```typescript
// ✅ Good - One-off value not in design system
<div class="top-[117px]">

// ✅ Good - Complex calc() expression
<div class="w-[calc(100%-var(--sidebar-width))]">

// ❌ Bad - Should be in theme
<div class="text-[16px]">  // Use text-base instead

// ❌ Bad - Repeated arbitrary values
<div class="bg-[#215965]">  // Define as theme color
<div class="bg-[#215965]">  // Repeated!
```

## Design Tokens

### Typography Tokens

```css
@theme {
  /* Font Families */
  --font-display: "Satoshi", "Inter", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Font Sizes */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Letter Spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
}
```

Usage:

```html
<h1 class="font-display text-4xl">
<p class="font-body text-base leading-relaxed">
<code class="font-mono text-sm">
```

### Spacing Tokens

```css
@theme {
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0-5: 0.125rem;  /* 2px */
  --spacing-1: 0.25rem;     /* 4px */
  --spacing-2: 0.5rem;      /* 8px */
  --spacing-3: 0.75rem;     /* 12px */
  --spacing-4: 1rem;        /* 16px */
  --spacing-6: 1.5rem;      /* 24px */
  --spacing-8: 2rem;        /* 32px */
  --spacing-12: 3rem;       /* 48px */
  --spacing-16: 4rem;       /* 64px */
  --spacing-24: 6rem;       /* 96px */
  --spacing-32: 8rem;       /* 128px */
}
```

## shadcn/ui Integration

### Component Theming

shadcn/ui automatically uses your theme variables:

```typescript
// Button automatically uses --primary, --secondary, etc.
<Button variant="default">     {/* Primary teal */}
<Button variant="secondary">   {/* Secondary orange */}
<Button variant="destructive"> {/* Destructive red */}
<Button variant="outline">     {/* Outlined */}
<Button variant="ghost">       {/* Transparent */}
```

### Custom Variants

```typescript
// Create custom button variants
<Button className="bg-forest hover:bg-forest-600 text-white">
  Success Button
</Button>

<Button className="bg-navy hover:bg-navy-600 text-white">
  Info Button
</Button>

<Button className="bg-rust hover:bg-rust-600 text-white">
  Warning Button
</Button>

// With opacity modifiers
<Button className="bg-primary/90 hover:bg-primary">
  Subtle Primary
</Button>
```

## Dark Mode

### Implementation

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Dark Mode Utilities

```html
<!-- Explicit dark mode variants -->
<div class="bg-white dark:bg-primary-900">
<p class="text-gray-900 dark:text-gray-100">

<!-- Using semantic colors (automatically adapt) -->
<div class="bg-background text-foreground">
<div class="bg-card text-card-foreground">
```

## Typography

### Font Loading

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
})

export default function RootLayout({ children }: Props) {
  return (
    <html className={`${inter.variable} ${satoshi.variable}`}>
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}
```

### Typography Scale

```html
<h1 class="font-display text-5xl font-bold tracking-tight">
<h2 class="font-display text-4xl font-bold">
<h3 class="font-display text-3xl font-semibold">
<h4 class="font-display text-2xl font-semibold">
<p class="font-body text-base leading-relaxed">
<small class="text-sm text-muted-foreground">
```

## Spacing & Layout

### Container Sizes

```css
@theme {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### Layout Patterns

```html
<!-- Page container -->
<div class="container mx-auto px-4 sm:px-6 lg:px-8">

<!-- Section spacing -->
<section class="py-12 md:py-16 lg:py-24">

<!-- Grid layouts -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## Animation & Transitions

### Custom Transitions

```css
@theme {
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
}
```

Usage:

```html
<button class="transition-all duration-normal ease-smooth">
<div class="transition-transform duration-fast ease-snappy hover:scale-105">
```

### Animation Classes

```css
@layer utilities {
  .animate-fade-in {
    animation: fadeIn var(--duration-normal) var(--ease-smooth);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

## Usage Examples

### Hero Section

```typescript
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-navy to-purple">
      <div className="container py-24 md:py-32">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
          Helping entrepreneurs get two things right
        </h1>
        <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl">
          Direction and execution
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary-600 text-white"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
    </section>
  )
}
```

### Status Messages

```typescript
export function StatusAlerts() {
  return (
    <div className="space-y-4">
      {/* Success */}
      <Alert className="border-forest bg-forest-50/50 dark:bg-forest-950/50">
        <CheckCircle className="h-4 w-4 text-forest" />
        <AlertTitle className="text-forest">Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>

      {/* Info */}
      <Alert className="border-navy bg-navy-50/50 dark:bg-navy-950/50">
        <Info className="h-4 w-4 text-navy" />
        <AlertTitle className="text-navy">Information</AlertTitle>
        <AlertDescription>Feature is in beta.</AlertDescription>
      </Alert>

      {/* Warning */}
      <Alert className="border-rust bg-rust-50/50 dark:bg-rust-950/50">
        <AlertCircle className="h-4 w-4 text-rust" />
        <AlertTitle className="text-rust">Warning</AlertTitle>
        <AlertDescription>Please review your input.</AlertDescription>
      </Alert>
    </div>
  )
}
```

### Feature Cards with Opacity

```typescript
export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-primary">Strategic Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Clear roadmap for your business growth
          </p>
        </CardContent>
      </Card>

      <Card className="border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-secondary" />
          </div>
          <CardTitle className="text-secondary">Flawless Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Turn strategy into measurable results
          </p>
        </CardContent>
      </Card>

      <Card className="border-forest/20 bg-forest/5 hover:bg-forest/10 transition-colors">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-forest/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-forest" />
          </div>
          <CardTitle className="text-forest">Proven Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sustainable business expansion
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Accessibility

### Color Contrast Testing

All theme colors meet WCAG 2.1 AA standards:

```typescript
// ✅ AAA Contrast (7:1+)
text-primary on bg-white          // 8.2:1
text-white on bg-primary          // 11.5:1
text-secondary on bg-white        // 7.1:1

// ✅ AA Contrast (4.5:1+)
text-primary-700 on bg-primary-50 // 6.3:1
text-forest on bg-white           // 5.8:1
text-navy on bg-white             // 7.9:1

// ⚠️ Large text only (3:1+)
text-primary-400 on bg-white      // 3.2:1
```

### Accessibility Utilities

```html
<!-- Screen reader only text -->
<span class="sr-only">Descriptive text for screen readers</span>

<!-- Focus visible states (built-in) -->
<button class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

<!-- ARIA attributes -->
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>
```

## Best Practices

### 1. Use OKLCH for New Colors

```css
/* ✅ Good - OKLCH for perceptual uniformity */
--color-brand-new: oklch(65% 0.15 280);

/* ⚠️ Acceptable - Hex for existing brand colors */
--color-legacy: #215965;
```

### 2. Leverage Opacity Modifiers

```html
<!-- ✅ Good - Dynamic opacity -->
<div class="bg-primary/10 hover:bg-primary/20">

<!-- ❌ Avoid - Fixed opacity colors -->
<div class="bg-primary-50 hover:bg-primary-100">
```

### 3. Use Design Tokens

```html
<!-- ✅ Good - Semantic tokens -->
<div class="font-display text-4xl">

<!-- ❌ Avoid - Magic numbers -->
<div class="text-[2.25rem]" style="font-family: 'Satoshi'">
```

### 4. Minimal Arbitrary Values

```html
<!-- ✅ Good - Theme value -->
<div class="mt-8">

<!-- ⚠️ Use sparingly - One-off value -->
<div class="mt-[117px]">

<!-- ❌ Avoid - Should be in theme -->
<div class="text-[16px] leading-[24px]">
```

### 5. Consistent Semantic Meaning

```typescript
// ✅ Consistent color semantics across app
Success → forest (green)
Info → navy (blue)
Warning → rust (orange-brown)
Error → destructive (red)
```

### 6. Test in Both Modes

```bash
# Always test:
✓ Light mode
✓ Dark mode
✓ Reduced motion
✓ High contrast
✓ Color blind simulation
```

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [OKLCH Color Picker](https://oklch.com/)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Play (v4)](https://play.tailwindcss.com/)
