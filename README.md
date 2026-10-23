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

Development filesystem caching is disabled in `next.config.ts` to work around
Turbopack cache-restore panics. Restarting development may compile more slowly.
If Turbopack still crashes, stop the server and run `bun run dev:webpack`.

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
| Public site | `/`, `/about`, `/programs`, `/learning-approach`, `/activities`, `/facilities`, `/gallery`, `/events`, `/admissions`, `/contact`, `/faq`, `/blog`, `/blog/[slug]`, `/preschool-in-tiruppur`, `/privacy-policy` | Server-rendered live from `/cms/public/*`; falls back gracefully if the API is down |
| Website CMS | `/admin/*` | Administrators and CMS editors (audit log restricted to administrators). Announcements, banners, reviews, programs, activities, facilities, gallery, events, blog, settings, activity log |
| School CRM | `/crm/*` | Role-scoped dashboard, enquiries/pipeline, applications/enrollment, follow-ups, visits, students/guardians, academics, attendance, fees/payments, tasks/calendar, communications/templates, reports/CSV, settings, staff and account |
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

## Home and About content

Use `/admin/home` and `/admin/about` to manage section headings, descriptions and photo uploads through the existing backend. See [Home and About content](docs/page-content.md) for publishing, defaults and API details.

The supplied school photography and website-wide upload controls are documented in [School photo placement](docs/school-photo-placement.md). Use `/admin/photos` for default photo positions across pages.

## Adding photography

Pages reference files like `/images/about/kids-group.webp`. Drop the real photo at `public/images/about/kids-group.webp` and rebuild — no code change needed.

## CRM verification and release

See [SCHOOL_CRM_AUDIT_AND_COMPLETION.md](SCHOOL_CRM_AUDIT_AND_COMPLETION.md) for the initial audit, implementation, resource verification matrix, test results and remaining release work.

Run type checks and tests with Bun:

~~~powershell
bun run typecheck
bun run lint
bun test
bun run build
$env:CRM_PUBLIC_SMOKE='true'
bun test tests/public-routes.test.ts
~~~

The optional Chrome workflow suite uses the actual NestJS API and Prisma database. It requires the sibling backend to be built and a migrated disposable local database containing the synthetic fixtures produced by its PostgreSQL integration test:

~~~powershell
$env:CRM_BROWSER_DATABASE_URL='<local disposable PostgreSQL URL>'
bun tests/crm-browser.mjs
~~~

The database hostname must be localhost/127.0.0.1/::1 and its name must start with mahilam_crm_test_. No fallback to the school database is allowed. The harness creates synthetic test accounts/records, starts isolated temporary API/frontend/Chrome processes, verifies forms/persistence/permissions/responsiveness, writes a JSON report under docs, and closes those processes. Chrome's default path is the Windows installation; CRM_CHROME_PATH and CRM_BACKEND_ROOT can override local locations. Do not run it against a school database.

The school database was inspected read-only. The existing Learning Photos migration and the new complete_school_crm migration remain unapplied there. Release the matching backend and migrations before exposing the new frontend to school staff. The public design and existing navigation are retained.

