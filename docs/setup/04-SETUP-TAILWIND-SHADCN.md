# Tailwind CSS + shadcn/ui Setup Guide

This guide covers setting up Tailwind CSS 4 and shadcn/ui for the Kilalo marketing website.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installing Tailwind CSS](#installing-tailwind-css)
4. [Configuring Tailwind](#configuring-tailwind)
5. [Installing shadcn/ui](#installing-shadcnui)
6. [Component Installation](#component-installation)
7. [Dark Mode Setup](#dark-mode-setup)
8. [Custom Theme Configuration](#custom-theme-configuration)
9. [Responsive Design Patterns](#responsive-design-patterns)
10. [Accessibility Considerations](#accessibility-considerations)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [Next Steps](#next-steps)

## Overview

**Tailwind CSS** is a utility-first CSS framework that provides low-level utility classes to build custom designs.

**shadcn/ui** is NOT a component library, but a collection of re-usable components built with Radix UI and Tailwind CSS that you copy into your project.

### Why This Combination?

- **Developer Experience**: Write styles directly in JSX with utility classes
- **Accessibility**: Radix UI primitives are WCAG 2.1 AA compliant out of the box
- **Customization**: Full control over component source code
- **Type Safety**: Full TypeScript support with proper typing
- **Performance**: Only ship CSS that's actually used (tree-shaking)
- **No Runtime**: Zero runtime JavaScript for styling

## Prerequisites

- Next.js 15 project initialized (see [03-SETUP-NEXTJS.md](./03-SETUP-NEXTJS.md))
- Node.js 18+ installed
- TypeScript configured with strict mode

## Installing Tailwind CSS

### Step 1: Install Tailwind Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates:
- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.mjs` - PostCSS configuration

### Step 2: Configure Tailwind Content Paths

Edit `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Step 3: Add Tailwind Directives to Global CSS

Edit `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 4: Verify Tailwind is Working

Create a test component in `src/app/page.tsx`:

```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-primary">
        Tailwind CSS is working!
      </h1>
      <p className="mt-4 text-muted-foreground">
        If you see this styled, Tailwind is configured correctly.
      </p>
    </main>
  );
}
```

Run `npm run dev` and verify styling appears.

## Installing shadcn/ui

### Step 1: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

You'll be prompted with configuration questions:

```
Would you like to use TypeScript (recommended)? yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › src/app/globals.css
Would you like to use CSS variables for colors? › yes
Where is your tailwind.config.js located? › tailwind.config.ts
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › yes
```

This will:
1. Update `tailwind.config.ts` with shadcn/ui settings
2. Create `src/lib/utils.ts` with the `cn()` utility
3. Update `tsconfig.json` with path aliases

### Step 2: Install Required Dependencies

The init command automatically installs:

```bash
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
```

- **tailwindcss-animate**: Animation utilities
- **class-variance-authority**: Create component variants
- **clsx**: Conditional class names
- **tailwind-merge**: Merge Tailwind classes intelligently

### Step 3: Verify components.json

A `components.json` file should be created:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Step 4: Verify Utils File

Check `src/lib/utils.ts` was created:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This `cn()` utility is used throughout shadcn/ui components to merge class names intelligently.

## Component Installation

shadcn/ui components are added individually to your project. Here are commonly needed components:

### Installing Individual Components

```bash
# Button component (most fundamental)
npx shadcn@latest add button

# Form components
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group

# Layout components
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add tabs

# Overlay components
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add popover
npx shadcn@latest add dropdown-menu

# Feedback components
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add badge

# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
```

### Install All Components at Once

```bash
npx shadcn@latest add --all
```

**Warning**: This adds ALL components (~50+). Only do this if you need most components.

### Example: Using the Button Component

After running `npx shadcn@latest add button`, you can use it:

```typescript
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex gap-4">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

### Customizing Components

Since shadcn/ui copies components into your project, you can modify them directly:

```typescript
// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

## Dark Mode Setup

### Step 1: Install next-themes

```bash
npm install next-themes
```

### Step 2: Create Theme Provider

Create `src/components/theme-provider.tsx`:

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Step 3: Wrap App with Theme Provider

Edit `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Kilalo",
  description: "Marketing website with member portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
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
  );
}
```

### Step 4: Create Theme Toggle Component

```bash
npx shadcn@latest add dropdown-menu
```

Create `src/components/theme-toggle.tsx`:

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Step 5: Use Theme Toggle

```typescript
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-2xl font-bold">Kilalo</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

## Custom Theme Configuration

### Customizing Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  /* Update primary color */
  --primary: 220 70% 50%; /* HSL values */
  --primary-foreground: 210 40% 98%;

  /* Update secondary color */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Custom brand colors */
  --brand-blue: 220 70% 50%;
  --brand-green: 142 71% 45%;
}
```

Then extend in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        blue: "hsl(var(--brand-blue))",
        green: "hsl(var(--brand-green))",
      },
    },
  },
},
```

### Customizing Border Radius

```css
:root {
  --radius: 0.5rem; /* Default */
}

/* For sharper design */
:root {
  --radius: 0.25rem;
}

/* For rounder design */
:root {
  --radius: 1rem;
}
```

### Customizing Fonts

In `src/app/layout.tsx`:

```typescript
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

## Responsive Design Patterns

### Responsive Utilities

Tailwind uses mobile-first breakpoints:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Container Component

```typescript
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
```

### Responsive Typography

```typescript
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>
```

### Responsive Spacing

```typescript
<section className="py-8 md:py-12 lg:py-16">
  <div className="space-y-4 md:space-y-6 lg:space-y-8">
    {/* Content */}
  </div>
</section>
```

### Hide/Show Elements

```typescript
<div className="hidden md:block">
  {/* Only visible on tablet and up */}
</div>

<div className="block md:hidden">
  {/* Only visible on mobile */}
</div>
```

## Accessibility Considerations

### Focus Visible States

All shadcn/ui components include proper focus states:

```css
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Screen Reader Support

```typescript
<Button>
  <Icon />
  <span className="sr-only">Accessible label</span>
</Button>
```

### ARIA Attributes

Radix UI primitives include proper ARIA attributes automatically:

```typescript
<Dialog>
  {/* Automatically includes role="dialog", aria-modal, aria-labelledby, etc. */}
</Dialog>
```

### Keyboard Navigation

All interactive components support keyboard navigation:
- `Tab`: Move between elements
- `Enter`/`Space`: Activate buttons
- `Escape`: Close dialogs/dropdowns
- Arrow keys: Navigate menus/selects

### Color Contrast

Ensure CSS variables meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text):

```bash
# Test contrast ratios
npm install -D @adobe/leonardo-contrast-colors
```

## Best Practices

### 1. Use Semantic HTML

```typescript
// Good
<nav>
  <ul>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

// Avoid
<div className="nav">
  <div className="nav-item">
    <span onClick={handleClick}>About</span>
  </div>
</div>
```

### 2. Composition Over Props

```typescript
// Good - Flexible composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid - Too many props
<Card title="Title" content="Content" />
```

### 3. Extract Common Patterns

```typescript
// src/components/page-header.tsx
export function PageHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
```

### 4. Use CSS Variables for Dynamic Values

```typescript
// Good - Respects theme
<div style={{ backgroundColor: "hsl(var(--primary))" }} />

// Avoid - Hardcoded colors
<div style={{ backgroundColor: "#3b82f6" }} />
```

### 5. Prefer Server Components

```typescript
// app/page.tsx - Server Component (default)
import { Button } from "@/components/ui/button";

export default async function Page() {
  const data = await fetchData(); // Direct async/await

  return (
    <div>
      <h1>{data.title}</h1>
      <Button>Static button</Button>
    </div>
  );
}
```

Only use `"use client"` when you need:
- Event handlers
- useState/useEffect hooks
- Browser APIs

### 6. Type Your Component Props

```typescript
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function CustomButton({
  loading,
  children,
  ...props
}: CustomButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? "Loading..." : children}
    </Button>
  );
}
```

### 7. Use the cn() Utility

```typescript
import { cn } from "@/lib/utils";

export function Component({ className }: { className?: string }) {
  return (
    <div className={cn("default-class another-class", className)}>
      {/* Content */}
    </div>
  );
}
```

### 8. Organize Utility Classes Consistently

```typescript
// Order: Layout → Display → Spacing → Sizing → Colors → Typography → Effects
<div className="flex items-center justify-between p-4 w-full bg-primary text-primary-foreground rounded-lg shadow-md">
```

### 9. Use Tailwind's Arbitrary Values Sparingly

```typescript
// Good - Use theme values
<div className="w-64" />

// Use arbitrary values only when necessary
<div className="w-[250px]" /> // Specific design requirement
```

### 10. Leverage Tailwind Plugins

```typescript
// tailwind.config.ts
export default {
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
```

## Troubleshooting

### Issue: Styles Not Applying

**Problem**: Tailwind classes don't apply to components.

**Solution**:
1. Check `content` paths in `tailwind.config.ts` include all component files
2. Restart dev server after config changes
3. Check for typos in class names (Tailwind only generates classes that exist in your files)

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: CSS Variables Not Working

**Problem**: `hsl(var(--primary))` not resolving.

**Solution**:
1. Ensure CSS variables are defined in `globals.css`
2. Verify `:root` and `.dark` selectors exist
3. Check `suppressHydrationWarning` is on `<html>` tag

### Issue: Dark Mode Not Switching

**Problem**: Theme toggle doesn't work.

**Solution**:
1. Verify `next-themes` is installed
2. Check `ThemeProvider` wraps app in `layout.tsx`
3. Ensure `attribute="class"` in `ThemeProvider`
4. Add `suppressHydrationWarning` to `<html>` tag

### Issue: Component Not Found

**Problem**: `Cannot find module '@/components/ui/button'`

**Solution**:
1. Run `npx shadcn@latest add button` to install component
2. Check `tsconfig.json` has correct path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Autocomplete Not Working

**Problem**: Tailwind class autocomplete not working in VSCode.

**Solution**:
1. Install "Tailwind CSS IntelliSense" extension
2. Add to `.vscode/settings.json`:
```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Issue: Build Errors with CSS

**Problem**: Build fails with CSS errors.

**Solution**:
1. Update PostCSS plugins:
```bash
npm install -D postcss@latest autoprefixer@latest
```
2. Check `postcss.config.mjs` syntax:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Issue: Hydration Errors

**Problem**: "Hydration failed" errors in console.

**Solution**:
1. Add `suppressHydrationWarning` to `<html>` (required for next-themes)
2. Ensure no server/client mismatch in rendered HTML
3. Use `useEffect` for browser-only code

### Issue: Components Look Unstyled

**Problem**: shadcn/ui components have no styling.

**Solution**:
1. Verify `@tailwind` directives in `globals.css`
2. Check CSS variables are defined
3. Ensure `globals.css` is imported in `layout.tsx`
4. Clear `.next` cache and rebuild

## Next Steps

After setting up Tailwind and shadcn/ui:

1. **Configure TypeScript + ESLint**: See [05-SETUP-TYPESCRIPT-ESLINT.md](./05-SETUP-TYPESCRIPT-ESLINT.md)
2. **Set Up Testing**: See [06-SETUP-TESTING.md](./06-SETUP-TESTING.md)
3. **Install Common Components**:
```bash
npx shadcn@latest add button card input label form toast navigation-menu
```
4. **Build Your First Feature**: Create a marketing landing page
5. **Add Custom Theme**: Configure brand colors based on Kilalo palette (see [12-COLOR-PALETTE.md](./12-COLOR-PALETTE.md))

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Class Variance Authority](https://cva.style)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
