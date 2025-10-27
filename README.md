# Kilalo Website

A DRC-focused venture studio platform helping Congolese entrepreneurs scale for-profit solutions that address poverty and hunger through the Vision & Structure (V2S) program.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Sanity account and project

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file with your credentials
cp .env.example .env.local

# Run development server
npm run dev
```

### Access Points

- **Main Website**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19, Tailwind CSS 3.4, shadcn/ui
- **CMS**: Sanity Studio (embedded)
- **Database**: Supabase (PostgreSQL + Auth)
- **i18n**: next-intl (English/French)
- **Language**: TypeScript 5.9.3 (strict mode)

## 📁 Project Structure

```
kilalo/
├── app/
│   ├── [locale]/
│   │   └── (marketing)/         # Public pages
│   │       ├── page.tsx          # Homepage
│   │       ├── about/            # About page
│   │       ├── programs/         # V2S Program
│   │       ├── ventures/         # Portfolio & case studies
│   │       ├── community/        # Events & network
│   │       ├── work-with-us/     # Conversion page
│   │       ├── blog/             # Blog
│   │       └── contact/          # Contact
│   └── studio/                   # Sanity Studio (embedded)
├── components/
│   ├── marketing/                # Header, Footer
│   ├── shared/                   # Reusable components
│   └── ui/                       # shadcn/ui components
├── sanity/
│   └── schemaTypes/              # Content schemas
├── messages/                     # i18n translations
└── docs/                         # 📚 Comprehensive documentation
```

## 🎨 Brand Colors

```typescript
teal: '#215965'      // Primary
orange: '#F39200'    // CTAs
forest: '#21654f'    // Accent
navy: '#213765'      // Accent
```

## 🌍 Internationalization

- **English**: `/en` (default)
- **French**: `/fr`

Translation files in `messages/en.json` and `messages/fr.json`

## 📝 Content Management

Access Sanity Studio at **http://localhost:3000/studio**

### Content Types:
- Programs (V2S, Hekima Time)
- Events (sessions, webinars)
- Case Studies (venture success stories)
- Impact Metrics (dashboard data)
- Portfolio Companies
- Site Settings (hero text, etc.)
- Blog Posts
- Team Members

## 🔧 Development

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📚 Documentation

Comprehensive documentation available in `/docs`:

- **[Complete Documentation Index](./docs/README.md)** - Start here
- **[Tech Stack Evaluation](./docs/01-TECH-STACK-EVALUATION.md)**
- **[Architecture](./docs/02-ARCHITECTURE.md)**
- **[Next.js Setup](./docs/03-SETUP-NEXTJS.md)**
- **[Tailwind + shadcn/ui](./docs/04-SETUP-TAILWIND-SHADCN.md)**
- **[Supabase](./docs/07-SETUP-SUPABASE.md)**
- **[Sanity CMS](./docs/08-SETUP-SANITY.md)**
- **[Internationalization](./docs/09-SETUP-I18N.md)**
- **[Deployment](./docs/11-SETUP-DEPLOYMENT.md)**
- **[Theme](./docs/12-THEME.md)**

### Additional Guides

- **[Development Guidelines](./CLAUDE.md)** - Coding conventions
- **[Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)** - Feature roadmap
- **[Supabase Migrations](./supabase/CLAUDE.md)** - Database procedures

## 🚢 Deployment

### Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

### Build & Deploy

```bash
npm run build
npm run start
```

For Vercel deployment, see [Deployment Guide](./docs/11-SETUP-DEPLOYMENT.md)

## 📖 Key Pages

- **Homepage**: DRC mission, impact metrics, V2S spotlight, ventures
- **Programs**: V2S Program (16 weeks, 8 tools), Hekima Time
- **Ventures**: Portfolio companies + case studies
- **Community**: Events, blog, network
- **Work With Us**: Three audiences (Entrepreneurs, Partners, Mentors)
- **About**: Our story, V2S approach, team, partners
- **Contact**: WhatsApp, offices (Goma, Kinshasa)

## 🤝 Contributing

1. Follow conventions in [CLAUDE.md](./CLAUDE.md)
2. Use V2S mindset: Vision (clarity) + Structure (systems)
3. Commit format: `type(scope): subject`
4. Keep changes simple and focused

## 📧 Contact

- **General**: hello@kilalo.org
- **Partnerships**: partnerships@kilalo.org
- **Goma Office**: N°18 Av. Du Lac, Kyeshero, Goma, Nord-Kivu, DRC

---

**Built with ❤️ for Congolese entrepreneurs**

For detailed technical documentation, see [docs/README.md](./docs/README.md)
