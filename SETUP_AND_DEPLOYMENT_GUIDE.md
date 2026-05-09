# Complete Setup & Deployment Guide

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Git
- OpenAI API key ([Get one](https://platform.openai.com/api-keys))
- GitHub account (for OAuth - optional)

### 2. Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd indie-hacker-platform

# Install dependencies
npm install

# Or with yarn
yarn install
```

### 3. Database Setup

```bash
# Copy environment template
cp .env.example .env.local

# Update .env.local with your settings
# DATABASE_URL=postgresql://username:password@localhost:5432/indie_tools

# Create database (if not exists)
createdb indie_tools

# Run migrations
npx prisma migrate dev

# Seed sample data (optional)
npx prisma db seed

# Open Prisma Studio to view data
npx prisma studio
```

### 4. Environment Configuration

Edit `.env.local` and configure:

```env
# Application
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/indie_tools

# Authentication (choose one method)
# Option A: GitHub OAuth
AUTH_GITHUB_ID=your_github_oauth_id
AUTH_GITHUB_SECRET=your_github_secret

# Option B: Google OAuth
AUTH_GOOGLE_ID=your_google_oauth_id
AUTH_GOOGLE_SECRET=your_google_secret

# Required for Auth.js
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=http://localhost:3000

# OpenAI API
OPENAI_API_KEY=sk-your-key-here

# (Optional) Stripe for payments
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 5. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Create Admin Account

```bash
# Use the app to sign up normally
# Then manually update the database to set role to 'ADMIN':

npx prisma studio
# Navigate to users table
# Change role from 'USER' to 'ADMIN'
# Or via SQL:
# UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Project Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed sample data
npm run db:studio       # Open Prisma Studio UI

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
```

## Vercel Deployment

### Step 1: Prepare Repository

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Vercel Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
vercel link

# Or visit https://vercel.com/new and connect GitHub repo
```

### Step 3: Add Environment Variables

Option A - Via Vercel CLI:
```bash
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add AUTH_SECRET
# ... add others as needed
```

Option B - Via Vercel Dashboard:
1. Go to project Settings → Environment Variables
2. Add all variables from `.env.example`

### Step 4: Deploy

```bash
# Deploy to production
vercel --prod

# Or just push to main - Vercel auto-deploys
git push origin main
```

### Step 5: Post-Deployment

```bash
# Run migrations on production database
vercel env pull  # Download production env vars
npx prisma migrate deploy

# Create admin user on production database
# Use Prisma Studio or direct SQL query
```

## PostgreSQL Database Setup

### Local PostgreSQL (macOS)

```bash
# Install with Homebrew
brew install postgresql@15

# Start service
brew services start postgresql@15

# Create database
createdb indie_tools

# Connect to database
psql indie_tools

# Verify connection
\l  # List databases
\dt # List tables
```

### Railway.app (Recommended for Hobby Projects)

1. Sign up at [Railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy database connection string
4. Add to `vercel env add DATABASE_URL`

### PlanetScale (MySQL Alternative)

```bash
# Create free MySQL database
# Visit https://planetscale.com

# Get connection string
# Add to environment
```

### Supabase (PostgreSQL Hosting)

1. Sign up at [Supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Add to environment

## OpenAI API Setup

### 1. Create API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Go to API Keys → Create new secret key
3. Copy and save securely
4. Add to `.env.local` and Vercel

### 2. Set Usage Limits

1. Go to Billing → Usage limits
2. Set monthly limit (e.g., $20)
3. Set soft limit alerts

### 3. Monitor Usage

```bash
# Check usage programmatically
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Cloudflare CDN Setup (Optional)

### 1. Add Domain to Cloudflare

1. Sign up at [Cloudflare.com](https://cloudflare.com)
2. Add site → Enter your domain
3. Update nameservers at your registrar

### 2. Configure Caching

In Cloudflare Dashboard:
1. Caching → Cache Rules
2. Create rule to cache static assets
3. Set cache TTL (24 hours for statics)

### 3. Page Rules

```
Pattern: yourdomain.com/api/*
Settings: Bypass Cache

Pattern: yourdomain.com/static/*
Settings: Cache Level - Cache Everything
Browser Cache TTL - 1 month
```

## GitHub OAuth Setup

### Create OAuth Application

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
   - Application name: "Indie Tools"
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
3. Copy Client ID and Client Secret
4. Add to environment variables:
   ```env
   AUTH_GITHUB_ID=your-id
   AUTH_GITHUB_SECRET=your-secret
   ```

## Stripe Payment Setup (Optional)

### 1. Create Stripe Account

1. Sign up at [Stripe.com](https://stripe.com)
2. Verify email and activate account

### 2. Get API Keys

1. Go to Developers → API Keys
2. Copy Publishable and Secret keys
3. Add to environment:
   ```env
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### 3. Setup Webhooks

1. Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Listen to events: `payment_intent.succeeded`, `invoice.payment_succeeded`
4. Copy webhook secret
5. Add to environment:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Email Setup (Newsletter)

### Using Resend (Recommended for Next.js)

```bash
# Install Resend
npm install resend

# Create account at https://resend.com
# Get API key from dashboard
# Add to environment
RESEND_API_KEY=re_...
```

### Using SendGrid

```bash
# Create account at https://sendgrid.com
# Get API key
# Add to environment
SENDGRID_API_KEY=SG...
```

## Analytics Setup (Optional)

### PostHog

1. Sign up at [PostHog.com](https://posthog.com)
2. Create new project
3. Copy API key and host
4. Add to environment:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=your-key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

### Plausible

1. Sign up at [Plausible.io](https://plausible.io)
2. Add your domain
3. Get tracking script
4. Add to app layout

## Performance Optimization

### 1. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/image.png"
  alt="Description"
  width={800}
  height={600}
  priority
  quality={85}
/>
```

### 2. Code Splitting

```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
})
```

### 3. Monitoring Core Web Vitals

```typescript
// pages/_app.tsx
import { useReportWebVitals } from 'next/web-vitals'

export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics
}
```

## Database Backups

### Automated Backups (Railway.app)

Railways includes automated daily backups.

### Manual Backups

```bash
# Export PostgreSQL database
pg_dump postgresql://user:pass@host/dbname > backup.sql

# Import backup
psql postgresql://user:pass@host/dbname < backup.sql
```

## Monitoring & Logging

### Sentry Setup (Error Tracking)

```bash
npm install @sentry/nextjs

# Sign up at https://sentry.io
# Get DSN from project settings
```

In `next.config.js`:
```javascript
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "your-project",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### Log Rocket (Session Replay)

```bash
npm install logrocket

# In app initialization
import LogRocket from 'logrocket'
LogRocket.init('your-app-id')
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:pass@host/dbname

# Check Prisma connection
npx prisma db execute --stdin < query.sql

# View connection string
echo $DATABASE_URL
```

### Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build

# Check TypeScript
npm run type-check

# Check for circular dependencies
npm run lint
```

### OpenAI API Errors

```bash
# Check API key validity
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check usage and limits
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Production Checklist

- [ ] Database backups configured
- [ ] Environment variables set (all required)
- [ ] Email service configured
- [ ] Analytics installed
- [ ] Error tracking (Sentry) enabled
- [ ] CDN configured
- [ ] Security headers verified
- [ ] SSL certificate installed
- [ ] Admin account created
- [ ] Default tools seeded
- [ ] Blog content migrated
- [ ] Social links configured
- [ ] Newsletter signup tested
- [ ] Payment system configured (if needed)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database indexed for queries
- [ ] Monitoring dashboards set up

## Custom Domain Setup

### With Vercel

1. Go to project Settings → Domains
2. Add your domain
3. Update nameservers at registrar, OR
4. Add CNAME to your registrar pointing to Vercel

### SSL Certificate

Vercel automatically provisions Let's Encrypt certificates.

## Scaling Considerations

As your project grows:

1. **Database**: Upgrade to larger instance
2. **Redis**: Add caching layer (optional)
3. **CDN**: Increase bandwidth limits
4. **API Rate Limiting**: Implement stricter limits
5. **Database Replication**: Add read replicas
6. **Background Jobs**: Implement job queue (Bull, Inngest)
7. **Monitoring**: Expand monitoring and alerting

## Getting Help

- Documentation: Check README.md files
- Issues: GitHub Issues for bug reports
- Discussions: GitHub Discussions for questions
- Community: Indie Hacker communities

---

**Last updated:** 2024
**Version:** 1.0.0
