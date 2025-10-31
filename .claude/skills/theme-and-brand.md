# Theme and Brand Skill

## Description

Apply Kilalo's design system, brand colors, typography, and visual identity consistently across all components and pages. Ensures brand coherence and accessibility compliance.

## When to Use

- Creating new UI components
- Designing page layouts
- Styling forms and interactive elements
- Writing marketing copy or documentation
- Making design decisions

## Brand Identity

### Mission & Voice

**Mission**: Empowering communities through sustainable development and cultural preservation

**Brand Voice**:

- **Professional**: Clear, credible, evidence-based
- **Compassionate**: Human-centered, empathetic, respectful
- **Inspiring**: Optimistic, action-oriented, solution-focused
- **Authentic**: Transparent, honest, culturally aware

**Tone Guidelines**:

- Use active voice and direct language
- Lead with impact and outcomes
- Highlight community voices and stories
- Avoid jargon, keep language accessible
- Be specific with data and achievements

## Color Palette

### Primary Colors

Based on `tailwind.config.ts`:

```typescript
// Teal (Primary) - Trust, growth, sustainability
teal: {
  DEFAULT: '#215965',  // Main brand color
  50: '#f0f9fa',       // Very light backgrounds
  100: '#d9f0f3',      // Light backgrounds, hover states
  200: '#b8e3e9',      // Subtle highlights
  300: '#89cdd8',      // Interactive elements
  400: '#53aebf',      // Links, accents
  500: '#3891a6',      // Primary buttons
  600: '#2f748c',      // Active states
  700: '#2d5f72',      // Text on light backgrounds
  800: '#2b4f5f',      // Headings
  900: '#284351',      // Dark text
  950: '#152b36',      // Darkest elements
}

// Orange (Secondary) - Energy, action, warmth
orange: {
  DEFAULT: '#F39200',  // Call-to-action color
  50: '#fef8ec',       // Very light backgrounds
  100: '#fceec9',      // Light backgrounds
  200: '#f9db8e',      // Highlights
  300: '#f6c253',      // Interactive elements
  400: '#f3aa2b',      // Hover states
  500: '#ed8613',      // Primary orange
  600: '#d1650d',      // Active states
  700: '#ad460e',      // Darker accents
  800: '#8d3612',      // Text
  900: '#742d12',      // Dark text
  950: '#431506',      // Darkest elements
}
```

### Accent Colors

```typescript
forest: '#21654f',  // Nature, growth, environmental programs
navy: '#213765',    // Trust, stability, education programs
rust: '#652d21',    // Heritage, tradition, cultural programs
purple: '#2d2165',  // Innovation, creativity, youth programs
plum: '#652159',    // Empowerment, dignity, women's programs
```

### Semantic Colors (CSS Variables)

From `app/globals.css`:

**Light Mode:**

```css
--background: 0 0% 100%; /* White */
--foreground: 192 45% 19%; /* Teal-900 */
--primary: 192 51% 26%; /* Teal DEFAULT */
--secondary: 30 100% 48%; /* Orange DEFAULT */
--muted: 192 15% 95%; /* Light gray-teal */
--accent: 192 15% 95%; /* Same as muted */
--destructive: 0 84.2% 60.2%; /* Red for errors */
--border: 192 15% 91%; /* Subtle borders */
```

**Dark Mode:**

```css
--background: 192 50% 8%; /* Deep teal-black */
--foreground: 0 0% 98%; /* Nearly white */
--primary: 192 51% 40%; /* Lighter teal */
--secondary: 30 100% 48%; /* Orange (same) */
--muted: 192 30% 20%; /* Dark gray-teal */
--accent: 192 30% 20%; /* Same as muted */
```

## Typography

### Font Stack

```typescript
// System fonts for optimal performance
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;
```

### Type Scale

```css
/* Headings */
h1: text-4xl md:text-5xl lg:text-6xl font-bold  /* 36-60px */
h2: text-3xl md:text-4xl lg:text-5xl font-bold  /* 30-48px */
h3: text-2xl md:text-3xl lg:text-4xl font-semibold  /* 24-36px */
h4: text-xl md:text-2xl font-semibold  /* 20-24px */
h5: text-lg md:text-xl font-medium  /* 18-20px */
h6: text-base md:text-lg font-medium  /* 16-18px */

/* Body Text */
body: text-base (16px)
large: text-lg (18px)
small: text-sm (14px)
xs: text-xs (12px)

/* Line Height */
Headings: leading-tight (1.25)
Body: leading-relaxed (1.625)
Small text: leading-normal (1.5)
```

### Font Weights

```css
font-normal: 400   /* Body text */
font-medium: 500   /* Emphasis, labels */
font-semibold: 600 /* Subheadings, buttons */
font-bold: 700     /* Headings, strong emphasis */
```

## Spacing & Layout

### Container

```typescript
container: {
  center: true,
  padding: {
    DEFAULT: '1rem',   // 16px mobile
    sm: '2rem',        // 32px tablet
    lg: '4rem',        // 64px laptop
    xl: '5rem',        // 80px desktop
    '2xl': '6rem',     // 96px wide screens
  },
}
```

### Spacing Scale

```css
/* Common spacing values */
gap-2: 0.5rem (8px)   /* Tight spacing */
gap-4: 1rem (16px)    /* Default spacing */
gap-6: 1.5rem (24px)  /* Section spacing */
gap-8: 2rem (32px)    /* Large spacing */
gap-12: 3rem (48px)   /* Section breaks */
gap-16: 4rem (64px)   /* Major sections */
```

### Border Radius

```css
--radius: 0.5rem (8px) rounded-sm: calc(var(--radius) - 4px) /* 4px */
  rounded-md: calc(var(--radius) - 2px) /* 6px */ rounded-lg: var(--radius) /* 8px */
  rounded-xl: 12px rounded-2xl: 16px rounded-full: 9999px;
```

## Component Patterns

### Buttons

```tsx
// Primary CTA
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Get Involved
</Button>

// Secondary Action
<Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
  Learn More
</Button>

// Outline/Ghost
<Button variant="outline">
  Read Story
</Button>

// Destructive
<Button variant="destructive">
  Delete Account
</Button>
```

### Cards

```tsx
<div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
  <h3 className="mb-2 text-xl font-semibold">Card Title</h3>
  <p className="text-muted-foreground">Card content...</p>
</div>
```

### Hero Sections

```tsx
<section className="bg-primary py-20 text-primary-foreground">
  <div className="container">
    <h1 className="mb-6 text-5xl font-bold">Hero Headline</h1>
    <p className="mb-8 max-w-2xl text-xl">Supporting paragraph...</p>
    <Button size="lg" className="bg-secondary hover:bg-secondary/90">
      Call to Action
    </Button>
  </div>
</section>
```

### Content Sections

```tsx
<section className="py-16">
  <div className="container">
    <h2 className="mb-12 text-center text-4xl font-bold">Section Title</h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{/* Content cards */}</div>
  </div>
</section>
```

## Accessibility

### Color Contrast

- Primary teal (#215965) on white: **AAA** (7.5:1)
- Orange (#F39200) on white: **AA** (3.1:1) - use for accents only
- Always test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Focus States

```css
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Reduced Motion

Automatically handled in `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Image Guidelines

### Aspect Ratios

- Hero images: 16:9 or 21:9
- Card images: 4:3 or 16:9
- Profile photos: 1:1 (square)
- Full-width banners: 3:1 or 4:1

### Image Optimization

- Use Next.js `<Image>` component
- Provide width and height
- Use appropriate `sizes` prop
- Enable blur placeholder for better UX

```tsx
<Image
  src={imageUrl}
  alt="Descriptive alt text"
  width={1200}
  height={675}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-lg object-cover"
  priority={isAboveTheFold}
/>
```

## Iconography

### Icon Library

Use [Lucide React](https://lucide.dev/) for consistent, accessible icons:

```tsx
import { Heart, Users, Leaf, BookOpen } from 'lucide-react'

;<Heart className="h-6 w-6 text-primary" />
```

### Icon Sizes

```tsx
h-4 w-4  /* 16px - Inline with text */
h-5 w-5  /* 20px - Small icons */
h-6 w-6  /* 24px - Default icons */
h-8 w-8  /* 32px - Large icons */
h-12 w-12 /* 48px - Hero icons */
```

## Dark Mode

Use `dark:` variant for dark mode styles:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  <h1 className="dark:text-primary-400 text-primary">Title</h1>
  <p className="text-muted-foreground dark:text-gray-400">Content</p>
</div>
```

Enable dark mode toggle in layout or per-page basis.

## Example: Complete Component

```tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Image from 'next/image'

export function ProgramCard({ program }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Image
        src={program.image}
        alt={program.title}
        width={400}
        height={300}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="p-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-secondary">
          <Heart className="h-4 w-4" />
          <span className="font-medium">{program.category}</span>
        </div>
        <h3 className="mb-3 text-xl font-semibold">{program.title}</h3>
        <p className="mb-4 line-clamp-3 text-muted-foreground">{program.description}</p>
        <Button variant="outline" className="w-full">
          Learn More
        </Button>
      </div>
    </Card>
  )
}
```

## Brand Applications

### Program Color Assignments

- **Education**: Navy (#213765) - Knowledge, stability
- **Environment**: Forest (#21654f) - Growth, sustainability
- **Health**: Teal (#215965) - Wellness, care
- **Arts & Culture**: Plum (#652159) - Creativity, heritage
- **Economic Development**: Orange (#F39200) - Energy, prosperity
- **Youth Programs**: Purple (#2d2165) - Innovation, future

### Usage in Code

```tsx
const programColors = {
  education: 'bg-navy text-white',
  environment: 'bg-forest text-white',
  health: 'bg-primary text-primary-foreground',
  culture: 'bg-plum text-white',
  economic: 'bg-secondary text-secondary-foreground',
  youth: 'bg-purple text-white',
}

<div className={programColors[program.type]}>
  {/* Program content */}
</div>
```

## Notes

- Always prioritize accessibility over aesthetics
- Test components in both light and dark mode
- Maintain consistent spacing using Tailwind's scale
- Use semantic color variables (primary, secondary) over hardcoded values
- Ensure all interactive elements have sufficient contrast and focus states
- Keep brand voice authentic and community-focused
