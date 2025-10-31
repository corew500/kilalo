# Kilalo Website

> A DRC-focused venture studio platform helping Congolese entrepreneurs scale for-profit solutions that address poverty and hunger through the Vision & Structure (V2S) program.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/tests-360%20passing-success)](https://github.com/corew500/kilalo)
[![i18n](https://img.shields.io/badge/i18n-100%25%20covered-success)](https://github.com/corew500/kilalo)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

**Access Points**:

- 🌐 **Website**: http://localhost:3000
- 🎨 **Sanity Studio**: http://localhost:3000/studio
- 👤 **Member Portal**: http://localhost:3000/en/dashboard
- 🇬🇧 **English**: http://localhost:3000/en
- 🇫🇷 **French**: http://localhost:3000/fr

---

## 📚 Documentation

### For Developers

Start here for technical documentation:

**Main Guides**:

- 📖 **[Developer Guide](DEVELOPER_GUIDE.md)** - Complete architecture, features & patterns
- 🏗️ **[Architecture Overview](docs/02-ARCHITECTURE.md)** - System design & data flow
- 👤 **[Member Portal](docs/MEMBER_PORTAL.md)** - Role-based portal documentation
- 🧪 **[Testing Guide](docs/TESTING.md)** - Unit & E2E testing practices
- 🌍 **[Translation Workflow](docs/TRANSLATION_WORKFLOW.md)** - i18n implementation
- 📝 **[Code Conventions](CLAUDE.md)** - Development rules & best practices

**Setup Guides** (in `/docs`):

- [Next.js Setup](docs/03-SETUP-NEXTJS.md)
- [Tailwind + shadcn/ui](docs/04-SETUP-TAILWIND-SHADCN.md)
- [TypeScript + ESLint](docs/05-SETUP-TYPESCRIPT-ESLINT.md)
- [Testing Setup](docs/06-SETUP-TESTING.md)
- [Supabase](docs/07-SETUP-SUPABASE.md)
- [Sanity CMS](docs/08-SETUP-SANITY.md)
- [Internationalization](docs/09-SETUP-I18N.md)
- [Accessibility](docs/10-SETUP-ACCESSIBILITY.md)
- [Deployment](docs/11-SETUP-DEPLOYMENT.md)

### For AI Assistance (Claude Code)

AI-friendly code patterns and examples:

- [Deployment & Environments](.claude/skills/deployment.md)
- [Member Portal Development](.claude/skills/member-portal.md)
- [Sanity Query Patterns](.claude/skills/sanity-query.md)
- [Translation Management](.claude/skills/next-intl-translation.md)
- [Form Validation](.claude/skills/form-validation.md)
- [Supabase Auth](.claude/skills/supabase-auth.md)
- [SEO Metadata](.claude/skills/seo-metadata.md)
- [Component Generation](.claude/skills/component-generation.md)
- [Unit Testing](.claude/skills/vitest-testing.md)
- [E2E Testing](.claude/skills/playwright-e2e.md)

### For Content Editors

- 📝 **[Sanity Workflow](sanity/WORKFLOW.md)** - CMS content management guide

### Project Status

- ✅ **[Current Tasks](tasks/todo.md)** - Active development tasks
- 📊 **[Setup Verification](tasks/setup-verification-report.md)** - Configuration audit
- 🎯 **[Implementation Roadmap](IMPLEMENTATION_ROADMAP.md)** - Feature roadmap

---

## 🏗️ Tech Stack

| Category       | Technology                                                            | Purpose                         |
| -------------- | --------------------------------------------------------------------- | ------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org/)                                     | React framework with App Router |
| **Language**   | [TypeScript 5.9](https://www.typescriptlang.org/)                     | Type-safe JavaScript            |
| **Styling**    | [Tailwind CSS 3.4](https://tailwindcss.com/)                          | Utility-first CSS               |
| **Components** | [shadcn/ui](https://ui.shadcn.com/)                                   | Accessible UI components        |
| **CMS**        | [Sanity](https://www.sanity.io/)                                      | Headless content management     |
| **Database**   | [Supabase](https://supabase.com/)                                     | PostgreSQL + Auth               |
| **i18n**       | [next-intl](https://next-intl-docs.vercel.app/)                       | Internationalization            |
| **Testing**    | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit + E2E tests                |
| **Deployment** | [Vercel](https://vercel.com/)                                         | Hosting & edge functions        |

---

## 📁 Project Structure

```
kilalo/
├── app/                       # Next.js App Router
│   ├── [locale]/              # Localized routes (en, fr)
│   │   ├── (marketing)/       # Public pages
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   └── (member)/          # Protected pages (future)
│   ├── auth/callback/         # Auth callback handler
│   └── studio/                # Embedded Sanity Studio
│
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── marketing/             # Header, Footer, navigation
│   ├── auth/                  # Login, Signup forms
│   └── shared/                # Reusable components
│
├── lib/                       # Utilities
│   ├── supabase/              # Supabase client & helpers
│   ├── forms/                 # Form validation & actions
│   ├── seo/                   # SEO & metadata
│   └── i18n-helpers.ts        # i18n utilities
│
├── sanity/                    # Sanity CMS
│   ├── schemaTypes/           # Content schemas
│   └── lib/                   # Queries & client
│
├── messages/                  # Translations
│   ├── en.json                # English (206 fields)
│   └── fr.json                # French (206 fields)
│
├── i18n/                      # i18n config
├── .claude/skills/            # AI code patterns
└── docs/                      # Documentation
```

---

## 🎨 Brand & Design

### Colors

```typescript
teal: '#215965' // Primary brand color
orange: '#F39200' // CTAs and accents
forest: '#21654f' // Supporting color
navy: '#213765' // Supporting color
```

### Typography

- **Headings**: System font stack
- **Body**: System font stack
- **Responsive**: Mobile-first approach

---

## 🌍 Internationalization

- **Languages**: English (en), French (fr)
- **Coverage**: 100% (206 fields × 2 languages)
- **Implementation**: next-intl with server-side translations
- **Routing**: `/en/...` and `/fr/...` paths

**Add New Translations**:

1. Add to `messages/en.json`:

   ```json
   {
     "ComponentName": {
       "newKey": "English text"
     }
   }
   ```

2. Add to `messages/fr.json`:

   ```json
   {
     "ComponentName": {
       "newKey": "Texte français"
     }
   }
   ```

3. Use in component:
   ```typescript
   const t = useTranslations('ComponentName')
   <p>{t('newKey')}</p>
   ```

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests (Vitest)
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:e2e:ui      # Run E2E with UI

# Sanity
npx sanity@latest typegen generate  # Generate Sanity types
```

---

## 📝 Content Management

### Sanity Studio

Access at **http://localhost:3000/studio**

**Content Types**:

- **Programs**: V2S, workshops, direct support
- **Events**: Hekima Time sessions, webinars
- **Ventures**: Portfolio companies
- **Case Studies**: Venture success stories
- **Blog Posts**: Articles and updates
- **Team Members**: Staff and advisors
- **Impact Metrics**: Dashboard statistics
- **Site Settings**: Global configuration (206 fields)

**Workflow**:

1. Edit content in Studio
2. Save draft (optional)
3. Publish → Triggers webhook → Vercel revalidates

See [Sanity Workflow](sanity/WORKFLOW.md) for details.

---

## 🧪 Testing

### Test Coverage

| Type           | Count          | Status         |
| -------------- | -------------- | -------------- |
| **Unit Tests** | 140            | ✅ Passing     |
| **E2E Tests**  | 138 executions | ✅ Passing     |
| **Total**      | 278            | ✅ All passing |

**Covered Components**: ImpactMetrics, BusinessAssessmentCTA, VentureCard, EventCard, TeamGrid, LoginForm, SignupForm

**E2E Test Suites**: Navigation, Locale Switching, Sanity CMS Integration, Auth Flows

### Running Tests

```bash
# All tests
npm test                       # Run all unit tests

# Unit tests (Vitest)
npm run test:unit              # Run unit tests
npm run test:unit:watch        # Watch mode
npm run test:coverage          # With coverage report

# E2E tests (Playwright)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Interactive UI
npm run test:e2e:debug         # Debug mode
```

**Pre-push Hook**: Tests run automatically before pushing to remote (configured in `.husky/pre-push`)

See [Testing Guide](docs/TESTING.md) for details.

---

## 🚢 Deployment

### Environment Variables

Required for deployment:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Site
NEXT_PUBLIC_SITE_URL=https://kilalo.org
```

### Vercel Deployment

**Status**: ✅ Live

**Automatic Deployments**:

- Push to `main` → Production deployment
- Open PR → Preview deployment
- Sanity publish → ISR revalidation via webhook

See [Deployment Guide](docs/11-SETUP-DEPLOYMENT.md) for details.

---

## 📖 Key Pages

| Page             | Path            | Description                                        |
| ---------------- | --------------- | -------------------------------------------------- |
| **Homepage**     | `/`             | Mission, impact metrics, featured ventures         |
| **About**        | `/about`        | Our story, V2S approach, team                      |
| **Programs**     | `/programs`     | V2S Program (16 weeks, 8 tools), Hekima Time       |
| **Ventures**     | `/ventures`     | Portfolio companies + case studies                 |
| **Community**    | `/community`    | Events, blog, network                              |
| **Work With Us** | `/work-with-us` | Three audiences (Entrepreneurs, Partners, Mentors) |
| **Services**     | `/services`     | Consultation, advisory services                    |
| **Contact**      | `/contact`      | WhatsApp, offices (Goma, Kinshasa)                 |
| **Login**        | `/login`        | User authentication                                |
| **Sign Up**      | `/signup`       | New user registration                              |

---

## 🤝 Contributing

### Development Workflow

1. **Create Branch**: `git checkout -b feature/my-feature`
2. **Make Changes**: Follow [Code Conventions](CLAUDE.md)
3. **Test**: Run `npm test` before committing
4. **Commit**: Use format `type(scope): subject`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Example: `feat(ventures): add filtering by industry`
5. **Push**: `git push origin feature/my-feature`
6. **PR**: Create pull request for review

### Code Standards

- ✅ TypeScript strict mode (0 errors required)
- ✅ ESLint (no errors, warnings acceptable in some files)
- ✅ All tests passing
- ✅ Translations complete (EN + FR)
- ✅ Follows [Code Conventions](CLAUDE.md)

---

## 📧 Contact

- **Email**: hello@kilalo.org
- **Partnerships**: partnerships@kilalo.org
- **GitHub**: [github.com/corew500/kilalo](https://github.com/corew500/kilalo)

**Offices**:

- **Goma**: N°18 Av. Du Lac, Kyeshero, Goma, Nord-Kivu, DRC
- **Kinshasa**: [Address TBD]

---

## 📊 Project Status

| Metric                | Status         |
| --------------------- | -------------- |
| **TypeScript Errors** | 0              |
| **Tests Passing**     | 278/278        |
| **Build Status**      | ✅ Passing     |
| **i18n Coverage**     | 100%           |
| **Deployment**        | ✅ Live        |
| **Authentication**    | ✅ UI Complete |

See [Current Tasks](tasks/todo.md) for active development work.

---

**Built with ❤️ for Congolese entrepreneurs**

For technical documentation, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
