# AI Orbit Companies

A complete **Companies discovery module** built as a full-stack Next.js application, inspired by the design language and aesthetic of [AI Orbit](https://aiorbit.club/). It delivers an end-to-end experience for discovering, filtering, and exploring the world's leading AI companies — from a live searchable catalog through to rich individual company detail pages.

This project was developed as the **Companies module** for a Full Stack module assignment.

---

## Module Scope

The assigned module is **Companies**. The implementation covers the full end-to-end lifecycle including:

- Companies listing page
- Company detail pages
- Live search
- Category filtering
- Advanced filtering (Sector, AI Native, Profitability)
- Sorting
- Grid / List view toggle
- Pagination
- Bookmarking (client + backend)
- Canonical URL sharing
- Submit Company modal interface
- Login interface
- Loading, empty, error, and not-found states
- Fully responsive layouts (Desktop, Tablet, Mobile)

---

## Features

### Companies Listing

The catalog listing page (`/` and `/companies`) provides:

- **List (Table) View** — A high-density sortable table showing company logo initials, name, verified badge, country, valuation, valuation per employee, AI Native badge, profitability badge, sector chip, models count, tools count, share action, and bookmark action.
- **Grid View** — Modern dark card layout showing logo, name, sector badge, AI Native indicator, tagline, and a 3-metric footer (Valuation, Team size, Models).
- **Search** — Full-text search across company names, taglines, descriptions, sectors, countries, and products. Includes an inline clear button.
- **Category Pills** — Horizontal scrollable filter pills: Foundation Models, AI Model Providers, Infrastructure, Developer Tools, Generative AI, Open Source, AI Native, Unicorns, and more.
- **Quick Filters** — One-click preset chips: Trending, Foundation Models, Unicorns ($1B+), AI Native, Open Source.
- **Advanced Filters Drawer** — Toggle-able panel supporting Sector dropdown, AI Native toggle, and Profitability toggle with a Reset All Filters action.
- **Sorting** — Sort by Newest Founded, Oldest Founded, Highest Valuation, Lowest Valuation, Most Employees, Most Models, Most Tools.
- **Pagination** — Page controls with per-page counts, Previous / Next navigation, and smooth scroll-to-catalog on page change.

### Company Detail Page (`/companies/[slug]`)

Each company page includes:

- **Company Identity** — Logo initials badge with brand tone colour, company name, Verified checkmark badge, AI Native badge, Profitable badge, tagline, country, founded year, and primary sector.
- **Action Bar** — Bookmark button, Share button with clipboard copy feedback, and direct external website link.
- **7-Key Metrics Stats Grid** — Valuation, Employees, Valuation per Employee, Models count, Tools & APIs, AI Native status, Profitable status.
- **About Section** — Full company description with category tags.
- **Products & Models** — Grid of official products and models, each linking externally to the company website.
- **Company Overview** — Technical information table: Company type, Headquarters, Founded year, Primary sector, Total models, Total tools, Website.
- **Related Companies** — Dynamically recommended companies from the same sector with quick navigation links.

### Bookmarking

Bookmarks are persisted through a **dual-layer mechanism**:

1. **Client-side (localStorage)** — Bookmarks are saved immediately to `localStorage` under the key `aiorbit_saved_companies`. This ensures instant, offline-resilient state with no latency.
2. **Backend/API persistence** — The `BookmarkButton` component also calls `/api/bookmarks/[slug]` (GET to check state on load, POST to save, DELETE to remove). When PostgreSQL is available, bookmarks are stored in the `company_bookmarks` database table and associated with the visitor via a long-lived cookie (`aiorbit-visitor`).

### Share

Clicking the **Share** button on either the listing or detail page copies the canonical company URL (`https://[your-domain]/companies/[slug]`) to the clipboard using the browser Clipboard API. Visual feedback is shown with an icon switch and text confirmation.

### Submit Company

Users can access the **Submit Company** modal from the site header.

The modal provides:
- Company Name (required text input)
- Website URL (required URL input)
- Sector / Category (dropdown select)
- A Submit for Review button with confirmation feedback toast
- A Cancel / close action

> **Important:** The Submit Company flow is **currently a frontend/mock submission experience**. It does not insert submitted companies into the PostgreSQL database. The UI provides full interaction feedback for demonstration purposes.

### Login Interface

The **Log In** button in the site header opens a modal presenting GitHub and Google authentication options.

> **Important:** The Login modal is **currently a frontend/mock experience** for user interface alignment with the AI Orbit design. No real OAuth provider (NextAuth, Clerk, Supabase Auth, etc.) or session backend is configured.

---

## Database & Backend Architecture

### Database

- **PostgreSQL** is used as the primary database.
- **Drizzle ORM** (`drizzle-orm/node-postgres`) is used for type-safe query building and schema management.
- The database connection string is read from the `DATABASE_URL` environment variable. **Never hard-code credentials.**

### API Routes

The backend is exposed through Next.js API route handlers:

| Route | Method | Description |
|---|---|---|
| `/api/companies` | `GET` | Fetches paginated, filtered, sorted companies from PostgreSQL or mock fallback |
| `/api/bookmarks/[slug]` | `GET` | Checks if visitor has bookmarked a company |
| `/api/bookmarks/[slug]` | `POST` | Creates a bookmark for the current visitor |
| `/api/bookmarks/[slug]` | `DELETE` | Removes a bookmark for the current visitor |

### Database Tables

#### `companies`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `slug` | text (unique) | URL-safe identifier |
| `name` | text | Company display name |
| `logo` | text | Logo initials string |
| `tagline` | text | Short descriptor |
| `description` | text | Full company description |
| `country` | text | Headquarters country |
| `foundedYear` | integer | Year of founding |
| `valuation` | integer | Valuation in $M |
| `employees` | integer | Headcount |
| `valuationPerEmployee` | numeric | Computed ratio |
| `aiNative` | boolean | Whether primarily AI-driven |
| `profitable` | boolean | Profitability status |
| `sector` | text | Primary sector |
| `category` | text | Primary category |
| `modelsCount` | integer | Number of AI models |
| `toolsCount` | integer | Number of tools/APIs |
| `website` | text | Official website URL |
| `products` | text[] | Array of product/model names |
| `verified` | boolean | Editorial verification status |
| `createdAt` | timestamp | Record creation timestamp |
| `updatedAt` | timestamp | Last updated timestamp |

#### `company_bookmarks`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `visitor_id` | text | Anonymous visitor identifier (from cookie) |
| `company_slug` | text | References the bookmarked company slug |
| `created_at` | timestamp | When the bookmark was created |

### Mock Data Fallback

When `DATABASE_URL` is not configured or PostgreSQL is unreachable (common in local development), the application **gracefully falls back** to a curated in-memory dataset defined in `lib/mock-data.ts`. This dataset contains **22 premier AI companies** (OpenAI, Anthropic, DeepSeek, Mistral AI, xAI, Perplexity AI, Cohere, Cursor/Anysphere, Scale AI, Hugging Face, ElevenLabs, Runway, Midjourney, Groq, Together AI, Harvey, Cognition, Synthesia, Figure AI, Character.ai, Insilico Medicine, Databricks) with complete fields.

This ensures the module is **fully functional and browsable** without any database setup.

---

## Tech Stack

| Technology | Version / Notes |
|---|---|
| [Next.js](https://nextjs.org/) | 16.3.3 (App Router, Turbopack) |
| [React](https://react.dev/) | 19 |
| [TypeScript](https://www.typescriptlang.org/) | 5.7.3 |
| [Tailwind CSS](https://tailwindcss.com/) | v4.3 |
| [Drizzle ORM](https://orm.drizzle.team/) | 0.45.2 |
| [PostgreSQL (`pg`)](https://node-postgres.com/) | 8.x |
| [SWR](https://swr.vercel.app/) | 2.5 |
| [Lucide React](https://lucide.dev/) | 1.16 |
| [class-variance-authority](https://cva.style/) | 0.7 |
| [clsx](https://github.com/lukeed/clsx) | 2.1 |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.3 |
| [@base-ui/react](https://base-ui.com/) | 1.5 |
| [tw-animate-css](https://github.com/hsuanyi-chou/tailwindcss-animate) | 1.4 |
| [@vercel/analytics](https://vercel.com/analytics) | 1.6 |
| [shadcn](https://ui.shadcn.com/) | 4.x (config only) |

---

## UI / Design

The visual direction strictly follows the **AI Orbit** design language ([https://aiorbit.club/](https://aiorbit.club/)) as a primary reference. The goal was to extend the existing visual language rather than introduce an unrelated design system.

Key design principles applied:

- **Dark/black background** — Deep oklch slate (`oklch(.105 .012 275)`) as the primary background.
- **White/light typography** — High contrast foreground text (`oklch(.95 .01 275)`).
- **Premium minimal interface** — Clean layout with generous whitespace and precise component sizing.
- **Sharp subtle borders** — Low-opacity border lines (`oklch(1 0 0 / 11%)`) separating layout regions and cards.
- **Dark cards and components** — Card backgrounds (`oklch(.145 .016 275)`) sit above the page layer.
- **Monospace accents** — Geist Mono for metric labels, identifiers, and the brand logo.
- **Subtle hover and interaction states** — Border colour lifts to violet accent on hover; buttons scale subtly on active press.
- **Violet accent colour** — `oklch(.71 .18 292)` used consistently for primary actions, active states, verified badges, and focus rings.
- **Grid / List presentation** — Both a high-density data table and a responsive card grid are supported.

---

## Responsive Design

| Breakpoint | Behaviour |
|---|---|
| **Desktop** (≥ 1024px) | Full-width 11-column table view, 7-card metrics grid, dual-column detail layout, sticky header with full navigation bar. |
| **Tablet** (768px – 1023px) | Horizontal scrollable table, 2-column grid cards, compact action rows. |
| **Mobile** (< 768px) | Table switches to touch-friendly compact card rows showing logo, name, sector, country, valuation, and model count. No horizontal overflow. Full-width search and filter controls. |

---

## UI States

| State | Implementation |
|---|---|
| **Loading / Skeleton** | `TableSkeleton`, `GridSkeleton`, and `DetailSkeleton` components render dark shimmer placeholders during data fetch. Powered by SWR's `keepPreviousData`. |
| **Empty state** | Shown when zero companies match the current filters, with a search icon, explanatory message, and "Reset All Filters" action button. |
| **No search results** | Same empty state, triggered when a keyword search returns no matches. |
| **Error state** | `app/error.tsx` — Next.js error boundary with a retry button and a return-to-index link. |
| **Company not found / 404** | `app/not-found.tsx` — Custom 404 page shown when `/companies/[slug]` does not resolve to a known company. |

---

## Project Structure

```
ai-orbit-companies-module/
├── app/
│   ├── api/
│   │   ├── bookmarks/[slug]/route.ts   # Bookmark GET / POST / DELETE
│   │   └── companies/route.ts          # Companies GET with filters & pagination
│   ├── companies/
│   │   ├── [slug]/page.tsx             # Company detail page
│   │   └── page.tsx                    # Companies catalog at /companies
│   ├── error.tsx                       # Next.js error boundary
│   ├── globals.css                     # Global styles, design tokens, logo tones
│   ├── layout.tsx                      # Root layout with fonts & analytics
│   ├── loading.tsx                     # Root Suspense loading state
│   ├── not-found.tsx                   # 404 page
│   └── page.tsx                        # Root page (/ renders catalog)
├── components/
│   ├── bookmark-button.tsx             # Dual-layer bookmark toggle
│   ├── companies-view.tsx              # Main client controller (search, filter, views)
│   ├── company-card.tsx                # Grid card component
│   ├── company-table.tsx               # Table/list component with mobile fallback
│   ├── module-nav.tsx                  # AI Orbit horizontal module bar
│   ├── share-company-button.tsx        # Clipboard share with feedback
│   ├── site-header.tsx                 # Sticky header, Submit & Login modals
│   ├── skeletons.tsx                   # Table, Grid, and Detail skeleton loaders
│   └── ui/
│       └── button.tsx                  # Base UI button component (CVA variants)
├── lib/
│   ├── companies.ts                    # Data service: Drizzle ORM + mock fallback
│   ├── company-format.ts               # Shared Company type, formatValuation, formatNumber
│   ├── mock-data.ts                    # In-memory curated dataset (22 companies)
│   ├── utils.ts                        # cn() utility
│   └── db/
│       ├── index.ts                    # Drizzle + pg.Pool initialisation
│       └── schema.ts                   # companiesTable + companyBookmarks schema
├── public/                             # Static assets
├── .gitignore
├── components.json                     # shadcn config
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/keerthiR508/ai-orbit-companies.git
cd ai-orbit-companies
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=your_postgresql_connection_string
```

> **If `DATABASE_URL` is not set**, the application automatically falls back to the curated in-memory mock dataset. All listing, filtering, searching, and detail pages remain fully functional without any database.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Optional | PostgreSQL connection string (e.g. `postgresql://user:password@host:5432/dbname`). When absent, mock data is used automatically. |

> **Never commit real credentials.** Use `.env.local` (which is `.gitignore`d) for all secret values.

---

## Running the Project

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

---

## Build & Verification

```bash
# Production build verification
npm run build

# TypeScript type check (zero errors expected)
npx tsc --noEmit
```

The module was fully verified for:
- Listing / detail page navigation
- Search, category filtering, advanced filtering
- Sorting and pagination
- Bookmarking and sharing
- Submit Company modal UI
- Responsive layouts (Desktop, Tablet, Mobile)
- Loading, empty, error, and not-found states

---

## Assignment Context

This project fulfils the **Full Stack assignment requirement** for one complete module end-to-end. The assigned module is **Companies**.

The implementation includes:

- **Listing page** — Searchable, filterable, sortable catalog with Grid and List views
- **Detail page** — Rich individual company pages with metrics, about, products, and related companies
- **Relevant UI screens** — Submit Company modal, Login modal, empty state, 404, error boundary
- **States** — Loading skeleton, empty state, no-results state, error state, not-found state
- **Interactions** — Search, category pills, quick filters, advanced filter drawer, sort, pagination, view toggle, bookmark, share
- **Backend / API** — Next.js API routes for companies and bookmarks
- **Database integration** — PostgreSQL via Drizzle ORM with graceful mock fallback
- **Responsive UI** — Mobile, tablet, and desktop layouts

---

## Design Reference

The visual direction is inspired by **[AI Orbit](https://aiorbit.club/)** as the primary design reference.

> This is **not** an official AI Orbit product. AI Orbit is referenced solely as a visual and UX design guide. The goal was to build a module that feels native to the AI Orbit design language — matching its dark aesthetic, colour palette, typography, spacing system, card style, and interaction patterns — rather than introducing an unrelated design system.

---

## Important Implementation Notes

| Area | Status |
|---|---|
| **PostgreSQL + Drizzle ORM** | ✅ Implemented — full schema and query layer for `companies` and `company_bookmarks` tables |
| **Mock data fallback** | ✅ Implemented — 22-company curated dataset auto-activates when `DATABASE_URL` is absent |
| **Bookmark backend persistence** | ✅ Implemented — `/api/bookmarks/[slug]` stores and retrieves bookmarks from PostgreSQL via visitor cookies |
| **Bookmark client persistence** | ✅ Implemented — Immediate `localStorage` sync for offline-resilient UX |
| **Submit Company** | ⚠️ Frontend/mock only — Modal UI and feedback are implemented; form data is **not** persisted to PostgreSQL |
| **Login / Authentication** | ⚠️ Frontend/mock only — Modal UI with GitHub and Google options is implemented; no real OAuth backend is configured |
