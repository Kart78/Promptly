# Indie Hacker Portfolio & Utility Platform

A production-ready Next.js 15 application inspired by Andy Feliciotti's ecosystem design. This platform combines a personal portfolio, product showcase, free online tools, AI utilities, and a SaaS funnel ecosystem.

## Project Architecture

```
indie-hacker-platform/
├── app/                              # Next.js 15 App Router
│   ├── (admin)/                      # Admin dashboard group
│   │   ├── dashboard/                # Dashboard layout
│   │   ├── tools/                    # Tool management
│   │   ├── blog/                     # Blog post management
│   │   └── analytics/                # Analytics dashboard
│   ├── (marketing)/                  # Marketing pages group
│   │   ├── page.tsx                  # Homepage
│   │   ├── blog/                     # Blog listing and posts
│   │   ├── tools/                    # Tools directory
│   │   └── about/                    # About page
│   ├── api/                          # API routes
│   │   ├── tools/                    # Tool APIs
│   │   ├── blog/                     # Blog APIs
│   │   ├── ai/                       # AI generation endpoints
│   │   └── analytics/                # Analytics tracking
│   ├── tools/                        # Utility tool pages
│   │   ├── [toolId]/                 # Dynamic tool page
│   │   ├── ai-blog-generator/        # Specific tools
│   │   ├── youtube-summarizer/
│   │   ├── color-palette/
│   │   ├── image-compressor/
│   │   └── ...
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/                       # Reusable React components
│   ├── ui/                          # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── ...
│   ├── layout/                      # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   ├── tools/                       # Tool-specific components
│   │   ├── ToolCard.tsx
│   │   ├── ToolGrid.tsx
│   │   ├── ToolHeader.tsx
│   │   └── RelatedTools.tsx
│   ├── blog/                        # Blog components
│   │   ├── BlogCard.tsx
│   │   ├── BlogGrid.tsx
│   │   ├── TOC.tsx
│   │   └── RelatedPosts.tsx
│   ├── home/                        # Homepage components
│   │   ├── Hero.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── CurrentlyBuilding.tsx
│   │   ├── UtilityGrid.tsx
│   │   └── TechStack.tsx
│   └── admin/                       # Admin components
│       ├── DashboardWidget.tsx
│       ├── ToolEditor.tsx
│       └── AnalyticsChart.tsx
├── lib/                             # Utility functions and helpers
│   ├── db/                          # Database utilities
│   │   ├── prisma.ts
│   │   └── seed.ts
│   ├── ai/                          # AI integration
│   │   ├── openai.ts
│   │   └── prompts.ts
│   ├── seo/                         # SEO utilities
│   │   ├── metadata.ts
│   │   ├── sitemap.ts
│   │   └── schema.ts
│   ├── utils/                       # General utilities
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   └── validators.ts
│   ├── analytics.ts                 # Analytics wrapper
│   └── constants.ts                 # App-wide constants
├── public/                          # Static assets
│   ├── og-images/                   # OG image templates
│   └── fonts/                       # Custom fonts
├── prisma/                          # Database schema
│   ├── schema.prisma
│   └── migrations/
├── styles/                          # Tailwind and CSS
│   ├── globals.css
│   ├── animations.css
│   └── variables.css
├── types/                           # TypeScript type definitions
│   ├── index.ts
│   ├── tool.ts
│   ├── blog.ts
│   └── user.ts
├── middleware.ts                    # Next.js middleware
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json
├── .env.example
└── README.md
```

## Technology Stack

### Core Framework
- **Next.js 15** - App Router, server components, edge functions
- **TypeScript** - Full type safety
- **React 19** - Latest features

### Database & ORM
- **PostgreSQL** - Primary database
- **Prisma ORM** - Type-safe database client
- **Redis** (optional) - Caching and session management

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **CSS Variables** - Dynamic theming
- **Framer Motion** - Subtle animations
- **Lucide React** - Icon library

### Authentication & Authorization
- **Auth.js (NextAuth)** or **Clerk** - User authentication
- **Session management** - Secure user sessions
- **RBAC** - Role-based access control

### Content & Blog
- **MDX** - Markdown with JSX components
- **remark plugins** - Content processing
- **shiki** - Syntax highlighting

### AI Integration
- **OpenAI API** - GPT-4 Turbo for content generation
- **LangChain** (optional) - AI orchestration

### Infrastructure
- **Vercel** - Primary hosting and deployment
- **Cloudflare CDN** - Edge caching and DDoS protection
- **S3** (optional) - File storage

### Analytics & Monitoring
- **PostHog** or **Plausible** - Privacy-focused analytics
- **Sentry** - Error tracking
- **LogRocket** (optional) - Session replay

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## Key Features

### 1. Homepage & Portfolio
- Hero section with personal introduction
- "Currently Building" section with animated cards
- Featured projects showcase
- Grid of utility tools with quick access
- Tech stack visualization
- Social links and CTA
- Donation/support section

### 2. Utility Tools System
- 15+ pre-built tools
- Reusable tool framework
- SEO-optimized pages
- Dynamic OG images
- Analytics tracking
- Related tools section
- FAQ support
- Share functionality

### 3. Blog System
- MDX support with syntax highlighting
- Automatic table of contents
- Related posts recommendation
- Newsletter integration
- Author profiles
- Reading time estimates
- SEO optimization

### 4. AI Features
- Content generation
- Summarization
- Image captioning
- Metadata auto-generation
- Keyword suggestions
- Blog drafting assistance
- Credit-based usage system

### 5. Admin Dashboard
- Tool management (create/edit/delete)
- Blog post management
- Analytics dashboard with charts
- AI API usage monitoring
- Feature toggles
- User management
- Settings and configuration

### 6. SEO & Performance
- Sitemap generation
- Schema markup (JSON-LD)
- OG image generation
- Meta descriptions
- Canonical URLs
- Core Web Vitals optimization
- Edge caching strategies
- Partial pre-rendering

### 7. Monetization
- Free tier with tool access
- Premium AI credits system
- SaaS subscription options
- Affiliate tracking
- Sponsorship slots
- Donation integration (Stripe)

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  ai_credits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  author_id INT REFERENCES users(id),
  featured_image VARCHAR(500),
  category VARCHAR(100),
  tags VARCHAR(500),
  published_at TIMESTAMP,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tools
CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  category VARCHAR(100),
  tags VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  ai_powered BOOLEAN DEFAULT FALSE,
  ai_model VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100),
  tool_id INT REFERENCES tools(id),
  user_id INT REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Generations
CREATE TABLE ai_generations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  tool_id INT REFERENCES tools(id),
  prompt VARCHAR(2000),
  output TEXT,
  model VARCHAR(100),
  tokens_used INT,
  cost_cents INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscriptions
CREATE TABLE newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  blog_post_id INT REFERENCES blog_posts(id),
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup & Deployment Guide

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- GitHub account (for OAuth)

### Local Development

1. **Clone and install:**
```bash
git clone <repo>
cd indie-hacker-platform
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env.local
# Fill in your environment variables
```

3. **Database setup:**
```bash
npx prisma migrate dev
npx prisma db seed
```

4. **Run development server:**
```bash
npm run dev
# Visit http://localhost:3000
```

### Production Deployment

1. **Vercel deployment:**
```bash
vercel link
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add AUTH_SECRET
vercel deploy --prod
```

2. **Database migrations:**
```bash
npx prisma migrate deploy
```

3. **Configure Cloudflare:**
- Set up CDN caching rules
- Enable edge functions for API routes
- Configure security and DDoS protection

## Performance Optimizations

1. **Edge Rendering** - API routes on Vercel Edge
2. **Image Optimization** - Next.js Image component with srcset
3. **CSS-in-JS** - TailwindCSS utility approach
4. **Code Splitting** - Automatic with Next.js
5. **Route Caching** - ISR and Dynamic Route Segments
6. **Server Components** - RSC for reduced JS bundle
7. **Partial Pre-rendering** - PPR for dynamic pages
8. **Database Caching** - Redis with Prisma
9. **CDN Integration** - Cloudflare for static assets

## Customization

This platform is designed to be highly customizable:

1. **Branding** - Update colors, fonts, and logos in `tailwind.config.ts`
2. **Tools** - Add new tools by creating files in `app/tools/[toolId]/`
3. **Blog** - Add MDX files to content directory
4. **Features** - Toggle features in `lib/constants.ts`
5. **Analytics** - Swap providers in `lib/analytics.ts`

## Support & Resources

- Documentation: See README.md files in each module
- Examples: Check `examples/` directory for usage patterns
- Community: Join the indie hacker community
- Issues: Report bugs on GitHub

## License

MIT - Feel free to use this for personal or commercial projects.
