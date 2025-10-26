# Kilalo Documentation

Comprehensive documentation for the Kilalo marketing website with member portal.

## 📚 Table of Contents

### Planning & Architecture

1. **[Tech Stack Evaluation](./01-TECH-STACK-EVALUATION.md)**
   - Technology selection and justification
   - Critical recommendations and trade-offs
   - Budget and timeline implications

2. **[Architecture](./02-ARCHITECTURE.md)**
   - System architecture and data flow
   - Security architecture with RLS
   - Performance and caching strategy
   - Deployment architecture

### Setup Guides

3. **[Next.js Setup](./03-SETUP-NEXTJS.md)** ✅ COMPLETE
   - Next.js 16 with App Router
   - TypeScript strict configuration
   - Project structure and conventions

4. **[Tailwind + shadcn/ui](./04-SETUP-TAILWIND-SHADCN.md)** ✅ COMPLETE
   - Tailwind CSS 3.4 configuration
   - shadcn/ui component installation
   - Dark mode and theming

5. **[TypeScript + ESLint](./05-SETUP-TYPESCRIPT-ESLINT.md)**
   - Strictest TypeScript settings
   - ESLint with accessibility rules
   - Pre-commit hooks with Husky

6. **[Testing](./06-SETUP-TESTING.md)**
   - Vitest for unit/component testing
   - Playwright for E2E testing
   - Accessibility testing with axe

7. **[Supabase](./07-SETUP-SUPABASE.md)**
   - Authentication setup
   - Database schema and migrations
   - Row Level Security policies
   - Real-time subscriptions

8. **[Sanity CMS](./08-SETUP-SANITY.md)**
   - Sanity Studio embedding
   - Schema creation
   - GROQ queries and TypeScript types
   - Webhook integration for ISR

9. **[Internationalization](./09-SETUP-I18N.md)**
   - next-intl configuration
   - French/English bilingual support
   - Localized routing and metadata
   - Integration with Sanity

10. **[Accessibility](./10-SETUP-ACCESSIBILITY.md)**
    - WCAG 2.1 AA compliance
    - Semantic HTML and ARIA
    - Keyboard navigation
    - Screen reader testing

11. **[Deployment](./11-SETUP-DEPLOYMENT.md)**
    - Vercel deployment
    - Environment variables
    - Custom domains and SSL
    - Preview deployments and rollback

12. **[Theme](./12-THEME.md)**
    - Complete design system
    - OKLCH color space
    - Design tokens and CSS variables
    - Dark mode theming

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Git repository initialized
- Package manager (npm, pnpm, or yarn)

### Installation Order

Follow these guides in sequence:

```bash
# 1. Initialize Next.js project
# See: 03-SETUP-NEXTJS.md

# 2. Set up Tailwind CSS and shadcn/ui
# See: 04-SETUP-TAILWIND-SHADCN.md

# 3. Configure TypeScript and ESLint
# See: 05-SETUP-TYPESCRIPT-ESLINT.md

# 4. Set up testing framework
# See: 06-SETUP-TESTING.md

# 5. Configure Supabase
# See: 07-SETUP-SUPABASE.md

# 6. Set up Sanity CMS
# See: 08-SETUP-SANITY.md

# 7. Configure internationalization
# See: 09-SETUP-I18N.md

# 8. Implement theme
# See: 12-THEME.md

# 9. Deploy to Vercel
# See: 11-SETUP-DEPLOYMENT.md
```

## 🎨 Design System

### Brand Colors

| Color | Hex | Use Case |
|-------|-----|----------|
| **Primary Teal** | `#215965` | Buttons, headers, navigation |
| **Secondary Orange** | `#F39200` | CTAs, highlights, logo |
| **Forest Green** | `#21654f` | Success states, growth |
| **Navy Blue** | `#213765` | Info states, sections |
| **Rust** | `#652d21` | Warnings, accents |
| **Purple** | `#2d2165` | Premium features |
| **Plum** | `#652159` | Special callouts |

See [12-THEME.md](./12-THEME.md) for complete design system.

### Typography

- **Display Font**: Satoshi (or Inter fallback)
- **Body Font**: Inter
- **Monospace**: Fira Code

### Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Language**: TypeScript (strict mode)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **CMS**: Sanity.io
- **i18n**: next-intl (French/English)
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## 📖 Documentation Structure

### By Category

#### Frontend

- [Next.js Setup](./03-SETUP-NEXTJS.md)
- [Tailwind + shadcn/ui](./04-SETUP-TAILWIND-SHADCN.md)
- [Theme](./12-THEME.md)
- [Internationalization](./09-SETUP-I18N.md)
- [Accessibility](./10-SETUP-ACCESSIBILITY.md)

#### Backend

- [Supabase](./07-SETUP-SUPABASE.md)
- [Sanity CMS](./08-SETUP-SANITY.md)

#### Quality Assurance

- [TypeScript + ESLint](./05-SETUP-TYPESCRIPT-ESLINT.md)
- [Testing](./06-SETUP-TESTING.md)
- [Accessibility](./10-SETUP-ACCESSIBILITY.md)

#### DevOps

- [Deployment](./11-SETUP-DEPLOYMENT.md)
- [Architecture](./02-ARCHITECTURE.md)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │   Next.js App (React 19 + TypeScript)             │ │
│  │   - Server Components (SSR/SSG)                    │ │
│  │   - Client Components (Interactive)                │ │
│  │   - Tailwind CSS + shadcn/ui                       │ │
│  │   - next-intl (French/English)                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Network (CDN)                   │
│  - Global distribution                                   │
│  - Middleware (locale detection, auth checks)            │
│  - Edge Functions                                        │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │Supabase │    │ Sanity   │    │  Vercel  │
    │         │    │          │    │Functions │
    │- Auth   │    │- CMS     │    │- API     │
    │- DB     │    │- Studio  │    │- Webhooks│
    │- Storage│    │- CDN     │    └──────────┘
    │- RLS    │    │- GROQ    │
    └─────────┘    └──────────┘
```

See [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) for detailed architecture.

## 🔐 Security

### Authentication

- **Provider**: Supabase Auth
- **Methods**: Email/password, OAuth (Google, GitHub)
- **Session Management**: Server-side with secure cookies
- **Protected Routes**: Middleware-based authentication

### Database Security

- **Row Level Security (RLS)**: All tables protected
- **API Keys**: Anon key for client, service role for server
- **SQL Injection**: Parameterized queries via Supabase client

### Content Security

- **Sanity**: API tokens with read/write permissions
- **Webhooks**: Secret validation for ISR revalidation

See [07-SETUP-SUPABASE.md](./07-SETUP-SUPABASE.md) for security details.

## 🌍 Internationalization

### Supported Languages

- **English** (`en`) - Default
- **French** (`fr`)

### i18n Features

- Locale-based routing (`/en/about`, `/fr/a-propos`)
- Localized pathnames
- Server-side translations (zero client bundle)
- Type-safe translation keys
- Integration with Sanity CMS for content localization

See [09-SETUP-I18N.md](./09-SETUP-I18N.md) for implementation.

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- ✅ Color contrast ratios tested and verified
- ✅ Keyboard navigation for all interactive elements
- ✅ Screen reader support with ARIA attributes
- ✅ Semantic HTML structure
- ✅ Focus management in modals and overlays
- ✅ Automated accessibility testing with Playwright + axe

See [10-SETUP-ACCESSIBILITY.md](./10-SETUP-ACCESSIBILITY.md) for guidelines.

## 🧪 Testing Strategy

### Unit/Component Testing (Vitest)

```bash
npm test              # Run tests
npm run test:coverage # Generate coverage report
```

### E2E Testing (Playwright)

```bash
npm run test:e2e       # Run E2E tests
npm run test:e2e:ui    # Run with UI mode
```

### Accessibility Testing

```bash
npx playwright test e2e/accessibility.spec.ts
```

See [06-SETUP-TESTING.md](./06-SETUP-TESTING.md) for testing guides.

## 🚢 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Required environment variables for production:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
SANITY_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

See [11-SETUP-DEPLOYMENT.md](./11-SETUP-DEPLOYMENT.md) for deployment guide.

## 📝 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test
```

### Code Quality

- **TypeScript**: Strict mode with all safety checks
- **ESLint**: Comprehensive rules including accessibility
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality gates

### Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature

# Make changes, commit
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push origin feature/new-feature
```

## 🎯 Project Goals

### Marketing Website

- **SEO-optimized**: SSG/ISR for best search rankings
- **Performance**: Core Web Vitals scores > 90
- **Accessibility**: WCAG 2.1 AA compliant
- **Bilingual**: French and English support
- **CMS-managed**: Content editable via Sanity Studio

### Member Portal

- **Secure authentication**: Supabase Auth
- **Protected routes**: Server-side session validation
- **Real-time features**: Live updates via Supabase
- **Dashboard**: Personalized member dashboard
- **Content access**: Premium content for members

## 📚 Additional Resources

### Official Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Sanity.io Docs](https://www.sanity.io/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)

### Tools

- [OKLCH Color Picker](https://oklch.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Play](https://play.tailwindcss.com/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

## 🤝 Contributing

### Documentation Updates

If you find errors or want to improve documentation:

1. Create a feature branch
2. Make your changes
3. Test examples and code snippets
4. Submit a pull request

### Code Style

- Follow ESLint configuration
- Use TypeScript strict mode
- Write tests for new features
- Ensure accessibility compliance

## 📄 License

This documentation is part of the Kilalo project.

## 🆘 Support

For questions or issues:

1. Check the relevant guide in this documentation
2. Review the [Troubleshooting](#troubleshooting) sections
3. Consult official documentation for specific technologies
4. Contact the development team

---

**Last Updated**: 2024-10-25

**Documentation Version**: 1.0.0
