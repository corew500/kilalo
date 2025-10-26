# TypeScript Strict Mode + ESLint Setup Guide

This guide covers configuring TypeScript with the strictest possible settings and ESLint with comprehensive rules including accessibility, best practices, and code quality.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [TypeScript Strict Configuration](#typescript-strict-configuration)
4. [ESLint Setup](#eslint-setup)
5. [Accessibility Linting](#accessibility-linting)
6. [Prettier Integration](#prettier-integration)
7. [VSCode Integration](#vscode-integration)
8. [Git Hooks with Husky](#git-hooks-with-husky)
9. [TypeScript Best Practices](#typescript-best-practices)
10. [ESLint Best Practices](#eslint-best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Next Steps](#next-steps)

## Overview

This guide implements:
- **Strictest TypeScript configuration** with all safety checks enabled
- **Comprehensive ESLint rules** for code quality, React, Next.js, and accessibility
- **Automatic code formatting** with Prettier
- **Pre-commit hooks** to enforce standards
- **VSCode integration** for real-time feedback

### Why Strict Configuration?

- **Catch bugs early**: Type errors found at compile time, not runtime
- **Better developer experience**: IntelliSense and autocomplete work better
- **Safer refactoring**: Type system prevents breaking changes
- **Documentation**: Types serve as inline documentation
- **Accessibility**: Catch a11y issues before they reach production

## Prerequisites

- Next.js 15 project initialized (see [03-SETUP-NEXTJS.md](./03-SETUP-NEXTJS.md))
- Node.js 18+ installed
- VSCode recommended (for optimal DX)

## TypeScript Strict Configuration

### Step 1: Update tsconfig.json

Replace your `tsconfig.json` with the strictest configuration:

```json
{
  "compilerOptions": {
    // Type Checking - STRICTEST
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "checkJs": true,

    // Module Resolution
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "moduleDetection": "force",

    // Emit
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "importsNotUsedAsValues": "error",
    "preserveValueImports": true,

    // Interop Constraints
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    // Language and Environment
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "experimentalDecorators": false,
    "emitDecoratorMetadata": false,

    // Projects
    "incremental": true,
    "composite": false,

    // Completeness
    "skipLibCheck": false,

    // Next.js specific
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build"
  ]
}
```

### Step 2: Understanding Strict Options

Here's what each strict option does:

#### Core Strict Flags

```typescript
// strict: true enables all of these:

// 1. noImplicitAny - No implicit 'any' types
function bad(x) { } // ❌ Error: Parameter 'x' implicitly has an 'any' type
function good(x: string) { } // ✅ OK

// 2. strictNullChecks - null and undefined are not assignable to other types
let x: string = null; // ❌ Error
let y: string | null = null; // ✅ OK

// 3. strictFunctionTypes - Function parameters are contravariant
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
let f1: (x: Animal) => void = (x: Dog) => { }; // ❌ Error

// 4. strictBindCallApply - Check bind/call/apply have correct types
function fn(x: string) { return x; }
fn.call(undefined, 123); // ❌ Error: Argument of type 'number' is not assignable

// 5. strictPropertyInitialization - Class properties must be initialized
class Bad {
  x: string; // ❌ Error: Property 'x' has no initializer
}
class Good {
  x: string = ""; // ✅ OK
}

// 6. noImplicitThis - 'this' must have explicit type
function badThis() {
  this.x = 10; // ❌ Error: 'this' implicitly has type 'any'
}

// 7. alwaysStrict - Emit "use strict"
// 8. useUnknownInCatchVariables - Catch variables are 'unknown' instead of 'any'
try {
  throw new Error();
} catch (e) {
  e.message; // ❌ Error: 'e' is unknown
  (e as Error).message; // ✅ OK
}
```

#### Additional Strict Flags

```typescript
// noUncheckedIndexedAccess - Index access returns T | undefined
const arr = [1, 2, 3];
const x = arr[10]; // Type: number | undefined (not just number)
if (x !== undefined) {
  x.toFixed(); // ✅ OK - narrowed to number
}

// noImplicitOverride - Must use 'override' keyword
class Base {
  method() { }
}
class Derived extends Base {
  method() { } // ❌ Error: must use 'override' keyword
  override method() { } // ✅ OK
}

// noPropertyAccessFromIndexSignature - Use bracket notation for index signatures
interface Data {
  [key: string]: string;
}
const data: Data = { name: "John" };
data.name; // ❌ Error: Use bracket notation
data["name"]; // ✅ OK

// exactOptionalPropertyTypes - Optional properties can't be set to undefined
interface User {
  name?: string;
}
const user: User = { name: undefined }; // ❌ Error
const user2: User = {}; // ✅ OK

// noImplicitReturns - All code paths must return a value
function bad(x: number): number {
  if (x > 0) {
    return x;
  }
  // ❌ Error: Not all code paths return a value
}

// noFallthroughCasesInSwitch - No fallthrough in switch statements
switch (x) {
  case 1:
    doSomething();
    // ❌ Error: Fallthrough case in switch
  case 2:
    doSomethingElse();
    break; // ✅ OK
}

// noUnusedLocals - No unused local variables
function bad() {
  const unused = 10; // ❌ Error: 'unused' is declared but never used
}

// noUnusedParameters - No unused function parameters
function bad(used: number, unused: string) { // ❌ Error
  return used;
}
function good(used: number, _unused: string) { // ✅ OK - prefixed with _
  return used;
}
```

### Step 3: Create Global Type Declarations

Create `src/types/global.d.ts`:

```typescript
// Extend global types
declare global {
  // Environment variables (type-safe)
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly NEXT_PUBLIC_SUPABASE_URL: string;
      readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      readonly SUPABASE_SERVICE_ROLE_KEY: string;
      readonly NEXT_PUBLIC_SANITY_PROJECT_ID: string;
      readonly NEXT_PUBLIC_SANITY_DATASET: string;
      readonly SANITY_API_TOKEN: string;
    }
  }
}

// Export to make this a module
export {};
```

Create `src/types/utils.d.ts`:

```typescript
// Utility types for stricter typing

// Non-empty array
export type NonEmptyArray<T> = [T, ...T[]];

// Require at least one property
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Require exactly one property
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// Deep readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Unwrap promise type
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Extract async function return type
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =
  T extends (...args: any[]) => Promise<infer R> ? R : any;
```

### Step 4: Type-Safe Environment Variables

Create `src/lib/env.ts`:

```typescript
// Type-safe environment variable access with validation

function getEnvVar(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  supabaseUrl: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
  sanityProjectId: getEnvVar("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  sanityDataset: getEnvVar("NEXT_PUBLIC_SANITY_DATASET"),
  sanityToken: getEnvVar("SANITY_API_TOKEN"),
} as const;

// Usage:
// import { env } from '@/lib/env'
// const url = env.supabaseUrl // Type: string, validated at runtime
```

## ESLint Setup

### Step 1: Install ESLint Dependencies

```bash
npm install -D eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-config-next
```

### Step 2: Create ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    // TypeScript - STRICTEST
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        "allowString": false,
        "allowNumber": false,
        "allowNullableObject": false
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/array-type": ["error", { "default": "array-simple" }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "typeParameter",
        "format": ["PascalCase"],
        "prefix": ["T"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"]
      },
      {
        "selector": "class",
        "format": ["PascalCase"]
      }
    ],

    // React - Best Practices
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "error",
    "react/jsx-curly-brace-presence": [
      "error",
      { "props": "never", "children": "never" }
    ],
    "react/jsx-boolean-value": ["error", "never"],
    "react/function-component-definition": [
      "error",
      {
        "namedComponents": "function-declaration",
        "unnamedComponents": "arrow-function"
      }
    ],
    "react/jsx-no-leaked-render": ["error", { "validStrategies": ["ternary"] }],
    "react/jsx-key": ["error", { "checkFragmentShorthand": true }],
    "react/no-array-index-key": "warn",
    "react/jsx-no-useless-fragment": "error",

    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",

    // Accessibility - WCAG AA Compliance
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-activedescendant-has-tabindex": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/img-redundant-alt": "error",
    "jsx-a11y/interactive-supports-focus": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/media-has-caption": "error",
    "jsx-a11y/mouse-events-have-key-events": "error",
    "jsx-a11y/no-access-key": "error",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "error",
    "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",
    "jsx-a11y/no-noninteractive-tabindex": "error",
    "jsx-a11y/no-redundant-roles": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/scope": "error",
    "jsx-a11y/tabindex-no-positive": "error",

    // Import - Organization
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type"
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "next/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react", "next"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/no-duplicates": "error",
    "import/no-unused-modules": "warn",
    "import/no-cycle": "error",
    "import/no-self-import": "error",

    // General Best Practices
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
    "prefer-arrow-callback": "error",
    "arrow-body-style": ["error", "as-needed"],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-nested-ternary": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "ignorePatterns": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build",
    "public",
    "*.config.js",
    "*.config.mjs"
  ]
}
```

### Step 3: Add ESLint Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\""
  }
}
```

### Step 4: Test ESLint

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run type-check
```

## Accessibility Linting

The `eslint-plugin-jsx-a11y` plugin catches common accessibility issues:

### Example Violations and Fixes

```typescript
// ❌ Missing alt text
<img src="/logo.png" />

// ✅ Alt text provided
<img src="/logo.png" alt="Company logo" />

// ❌ Click handler on non-interactive element
<div onClick={handleClick}>Click me</div>

// ✅ Button element with proper semantics
<button onClick={handleClick}>Click me</button>

// ❌ Missing label association
<label>Name</label>
<input type="text" />

// ✅ Label properly associated
<label htmlFor="name">Name</label>
<input id="name" type="text" />

// ❌ Missing keyboard support
<div onClick={handleClick}>Interactive</div>

// ✅ Keyboard support added
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  Interactive
</div>

// ❌ Positive tabindex
<div tabIndex={1}>Content</div>

// ✅ Natural tab order
<div tabIndex={0}>Content</div>
```

## Prettier Integration

### Step 1: Install Prettier

```bash
npm install -D prettier eslint-config-prettier
```

### Step 2: Create Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Step 3: Install Tailwind Prettier Plugin

```bash
npm install -D prettier-plugin-tailwindcss
```

This automatically sorts Tailwind classes in the recommended order.

### Step 4: Create .prettierignore

Create `.prettierignore`:

```
.next
node_modules
out
dist
build
public
*.config.js
*.config.mjs
pnpm-lock.yaml
package-lock.json
```

### Step 5: Update ESLint Config

Add to `.eslintrc.json` extends array:

```json
{
  "extends": [
    // ... other configs
    "prettier" // Must be last to override other formatting rules
  ]
}
```

## VSCode Integration

### Step 1: Install Extensions

Install these VSCode extensions:
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Error Lens** (usernamehw.errorlens) - Optional but helpful

### Step 2: Create Workspace Settings

Create `.vscode/settings.json`:

```json
{
  // Editor
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.rulers": [80, 120],

  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.preferTypeOnlyAutoImports": true,

  // ESLint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [{ "mode": "auto" }],

  // Tailwind
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],

  // Files
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  },
  "files.watcherExclude": {
    "**/.next/**": true,
    "**/node_modules/**": true
  },

  // Search
  "search.exclude": {
    "**/.next": true,
    "**/node_modules": true,
    "**/package-lock.json": true,
    "**/pnpm-lock.yaml": true
  }
}
```

### Step 3: Create Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens"
  ]
}
```

## Git Hooks with Husky

### Step 1: Install Husky and lint-staged

```bash
npm install -D husky lint-staged
npx husky init
```

### Step 2: Configure lint-staged

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{md,json}": [
      "prettier --write"
    ]
  }
}
```

### Step 3: Create Pre-commit Hook

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run type checking
npm run type-check
```

### Step 4: Test Pre-commit Hook

```bash
git add .
git commit -m "test: verify pre-commit hook"
```

This will:
1. Run ESLint and Prettier on staged files
2. Run TypeScript type checking
3. Block commit if any errors found

## TypeScript Best Practices

### 1. Avoid Type Assertions

```typescript
// ❌ Avoid
const user = data as User;

// ✅ Use type guards
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof data.name === "string"
  );
}

if (isUser(data)) {
  data.name; // Type: User
}
```

### 2. Use Discriminated Unions

```typescript
// ✅ Excellent for state management
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function render(state: RequestState<User>) {
  switch (state.status) {
    case "idle":
      return <div>Not started</div>;
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return <div>{state.data.name}</div>; // data is available
    case "error":
      return <div>{state.error.message}</div>; // error is available
  }
}
```

### 3. Properly Type React Components

```typescript
// ✅ Function declaration for named components
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ✅ Properly typed props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

// ✅ Generic components
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

### 4. Type Server Actions

```typescript
"use server";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;

export async function login(
  input: LoginInput
): Promise<{ success: boolean; error?: string }> {
  const validated = loginSchema.safeParse(input);

  if (!validated.success) {
    return { success: false, error: "Invalid input" };
  }

  // ... authentication logic
  return { success: true };
}
```

### 5. Use const Assertions

```typescript
// ✅ Narrow types with const assertions
const routes = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
] as const;

type Route = (typeof routes)[number];
// Type: { readonly path: "/" | "/about"; readonly name: "Home" | "About" }
```

## ESLint Best Practices

### 1. Disable Rules Sparingly

```typescript
// ❌ Avoid blanket disables
/* eslint-disable */

// ✅ Disable specific rules with justification
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Third-party library types are incorrect
const data: any = externalLib.getData();
```

### 2. Configure Per-File Overrides

```json
{
  "overrides": [
    {
      "files": ["*.test.ts", "*.test.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### 3. Use Import Order

The configuration enforces this order:
1. React imports
2. Next.js imports
3. External libraries
4. Internal imports (`@/...`)
5. Relative imports
6. Type imports

## Troubleshooting

### Issue: ESLint Performance

**Problem**: ESLint is slow on large codebases.

**Solution**:
1. Use `.eslintignore`:
```
.next
node_modules
out
dist
build
```

2. Disable type-aware rules for faster linting:
```json
{
  "extends": ["next/core-web-vitals"]
}
```

### Issue: Type Errors After Strict Config

**Problem**: Hundreds of type errors after enabling strict mode.

**Solution**:
1. Fix incrementally by file
2. Use `// @ts-expect-error` temporarily with TODOs
3. Start with most critical files first

### Issue: Import Order Conflicts

**Problem**: Prettier and ESLint conflict on import ordering.

**Solution**:
1. Ensure `prettier` is last in `.eslintrc.json` extends
2. Use `eslint-config-prettier` to disable conflicting rules

### Issue: Husky Hooks Not Running

**Problem**: Pre-commit hooks don't execute.

**Solution**:
```bash
# Reinstall husky
rm -rf .husky
npx husky init
chmod +x .husky/pre-commit
```

## Next Steps

After configuring TypeScript and ESLint:

1. **Set up testing**: See [06-SETUP-TESTING.md](./06-SETUP-TESTING.md)
2. **Review accessibility**: See [10-SETUP-ACCESSIBILITY.md](./10-SETUP-ACCESSIBILITY.md)
3. **Fix existing violations**:
```bash
npm run lint:fix
npm run type-check
```
4. **Configure CI/CD**: Add linting to GitHub Actions
5. **Team alignment**: Review rules with team, adjust as needed

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [@typescript-eslint](https://typescript-eslint.io/)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [Prettier Docs](https://prettier.io/docs/en/)
