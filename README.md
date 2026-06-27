# Promptly — Build in Public Community

A Skool-inspired community platform for builders, indie developers, and creators.

## What was fixed

| Bug ID | Issue | Fix |
|--------|-------|-----|
| BUG-01 | Post edit/delete not available to author | PATCH + DELETE API routes; author-only context menu in PostCard |
| BUG-02 | Clicking post card does nothing | Post card is now clickable; navigates to `/post/[id]` detail page with hover state |
| BUG-03 | Classroom returns 404 | Classroom page created with "coming soon" placeholder |
| BUG-04 | About page returns 404 | Full About page with community info, guidelines, and team |
| BUG-05 | No auth state in nav | Navbar shows user avatar + dropdown when logged in |
| BUG-06 | Feed shows "no posts" but profile shows 1 post | Feed query fixed — no accidental filters on the default "All" view |
| BUG-07 | Calendar page empty | Calendar page shows all upcoming events from DB |
| UX-01 | Post cards no hover state | `post-card` CSS class adds `cursor-pointer` + hover background |
| UX-02 | Active nav tab invisible | Navbar reads `pathname` and applies `bg-brand-50 font-semibold` to active link |
| UX-03 | Category pills no active state | CategoryFilter fills active pill with `bg-brand-600 text-white` |
| UX-04 | Timestamp has no absolute tooltip | `title` attribute added to all timestamp elements |
| UX-05 | No admin/mod ring on avatar | Avatar component adds `ring-2 ring-brand-500` for ADMIN role |
| UX-06 | Leaderboard renders entry twice | Single data fetch, single render — no duplicate blocks |
| FEAT-01 | No rich text editor | Tiptap editor with bold/italic/code/quote/lists in PostComposer |
| FEAT-02 | No likes on posts | Like button on PostCard with optimistic toggle + like API |
| FEAT-03 | No comments | CommentSection on post detail with threaded replies |
| FEAT-04 | No search | *(planned — see below)* |
| FEAT-05 | No notifications | Notification model + creation on like/comment/follow events |
| FEAT-06 | Follow button no feedback | Optimistic UI toggle + toast on follow/unfollow |

---

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** ORM
- **PostgreSQL** (Neon, Supabase, or local)
- **NextAuth v5** (credentials + GitHub + Google OAuth)
- **Tiptap** rich text editor
- **react-hot-toast**

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/Kart78/Promptly.git
cd Promptly
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/promptly"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Optional OAuth (get from GitHub/Google developer console)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Set up the database

```bash
npx prisma db push       # create all tables
npm run db:seed          # seed admin user + sample post + event
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default admin login:**
- Email: `karthi@promptly.dev`
- Password: `password123`

---

## Git commands — push to GitHub

```bash
# First time setup (from inside the project folder)
git init
git add .
git commit -m "fix: all QA issues — post edit, click, auth, comments, likes, nav, 404 pages"
git branch -M main
git remote add origin https://github.com/Kart78/Promptly.git
git push -u origin main
```

**Subsequent pushes:**

```bash
git add .
git commit -m "your message here"
git push
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set these environment variables in the Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL          # set to your vercel domain e.g. https://promptly.vercel.app
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

After first deploy, run migrations:

```bash
npx prisma db push    # from local, pointing at the production DATABASE_URL
```

---

## Planned (next sprint)

- [ ] Full-text search across posts and members
- [ ] Notification bell dropdown in navbar
- [ ] Profile avatar upload (Cloudinary / Uploadthing)
- [ ] Direct messaging
- [ ] Classroom course modules
