# Little Mahilam Frontend

Next.js 16 (App Router, Turbopack) + Tailwind CSS v4 + TanStack Query.

## Run

```bash
bun install
cp .env.example .env.local   # fill in the values — see comments in the file
bun run dev                  # http://localhost:3000
bun run build && bun run start
bun run typecheck
```

`NEXT_PUBLIC_API_URL` must point at the Little Mahilam backend (default port 4000).

## Deploying to Vercel

`vercel.json` builds with Bun and the Next.js preset. Import this folder as its own Vercel project (the backend is a separate project) and set these environment variables for Production:

- `NEXT_PUBLIC_SITE_URL`: the public https domain, e.g. `https://littlemahilam.in`. `robots.txt` only allows indexing for an https URL.
- `NEXT_PUBLIC_API_URL`: the deployed backend, e.g. `https://api.littlemahilam.in/api/v1`.
- `NEXT_PUBLIC_IMAGE_HOSTS`: the R2/CDN hostname(s) for CMS images.
- The contact, social and verification values from `.env.example`.

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them. On the backend, set `FRONTEND_URL` to this site's URL (comma-separate extra origins such as the `vercel.app` URL) so CORS allows it.

Put the site and the API on the same registrable domain (e.g. `littlemahilam.in` and `api.littlemahilam.in`). Sign-in cookies are `SameSite=Lax`, and two `*.vercel.app` URLs count as different sites, so the admin/CRM login only works once both have custom domains. The public pages work either way.

## What's where

| Area | Routes | Notes |
|---|---|---|
| Public site | `/`, `/about`, `/programs`, `/learning-approach`, `/activities`, `/facilities`, `/gallery`, `/events`, `/admissions`, `/contact`, `/faq`, `/blog`, `/blog/[slug]`, `/preschool-in-tiruppur`, `/privacy-policy` | Server-rendered from `/cms/public/*` with 5-minute ISR; falls back gracefully if the API is down |
| Website CMS | `/admin/*` | Admins only. Announcements, banners, reviews, programs, activities, facilities, gallery, events, blog, settings, activity log |
| School CRM | `/crm/*` | Enquiries, admissions board, students, fees & payments, reports + CSV exports, staff, my account |
| Status screens | `/offline`, `/forbidden`, `/session-expired`, 404/500 | Plus in-app loading, empty, error, partial-data and session-expired states |

## Key building blocks

- `src/lib/site.ts` — school name, address, contact, keywords (single source for SEO + footer)
- `src/lib/seo.ts` — `pageMetadata()` and JSON-LD builders (Preschool/LocalBusiness, FAQ, events, articles, breadcrumbs)
- `src/lib/api.ts` — browser API client: typed `ApiError`, token refresh, session-expiry event, CSV downloads
- `src/lib/server-api.ts` — server-side public CMS reads with ISR
- `src/lib/images.ts` — `localImage()` serves a real photo until the intended file exists in `/public/images/...`
- `src/components/states/*` — `StateView`, `QueryState`, skeletons, offline banner
- `src/components/dashboard/*` — glass workspace shell, `useCrud`, toolbar, drawer, command palette (Ctrl/⌘ K)
- `public/sw.js` — shows an offline page when navigation fails with no connection (production only)

## Adding photography

Pages reference files like `/images/about/kids-group.webp`. Drop the real photo at `public/images/about/kids-group.webp` and rebuild — no code change needed.
