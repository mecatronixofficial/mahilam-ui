# Website logo management

Admins and super admins can use **Settings → Website Branding** to select, preview, save, replace or restore the default logo. Header and footer share the saved branding. Cancel discards the local selection without uploading. Fetch-based uploads show a saving indicator rather than percentage progress. Refresh the public page to see an update; no further deployment is needed for logo changes.

## Implementation files

Frontend additions:
- `src/lib/branding.ts`: safe URL handling, shared limits, signature and decoded dimension checks.
- `src/components/admin/WebsiteBranding.tsx`: active logo, local preview, Save/Cancel/Restore, notifications and query updates.
- `tests/branding.test.tsx`: validation and rendered logo checks.

Frontend modifications:
- `src/components/admin/SettingsManager.tsx`: branding section; hides the reserved branding record from advanced settings.
- `src/lib/server-api.ts`: live, uncached branding read with default fallback.
- `src/components/public/PublicShell.tsx` and `PublicShellView.tsx`: pass branding to header and footer.
- `src/components/public/Navbar.tsx`, `Footer.tsx`, `BrandLogo.tsx`: contain the logo in fixed responsive slots; use stored dimensions; recover from broken custom URLs.

Backend repository: `D:/Mecatronix Projects/Mahilam School/Server/mahilam-server`.

Backend additions:
- `src/branding/branding.module.ts`
- `src/branding/branding.controller.ts`
- `src/branding/branding.service.ts`
- `src/branding/logo-image.ts`
- `tests/branding.test.ts`
- `tests/branding-http.test.mjs`

Backend modifications:
- `src/app.module.ts`: registers the branding module.
- `src/integrations/storage.service.ts`: R2 logo upload, public URL verification and deletion limited to generated branding keys.
- `src/cms/cms.service.ts`: prevents generic settings writes/deletes bypassing branding validation and cleanup.
- `package.json` and `bun.lock`: adds Sharp for full image decoding and lossless WebP encoding.

Existing unrelated working tree edits were preserved.

## API and database

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/v1/branding` | Public; `Cache-Control: no-store` |
| POST | `/api/v1/admin/branding/logo` | Existing admin/super admin cookie authentication; multipart `file` |
| DELETE | `/api/v1/admin/branding/logo` | Existing admin/super admin cookie authentication |

Both writes use a 10 requests/minute throttle through the existing global throttler. Existing global audit interception records successful writes. Controllers omit the global prefix so `/api/v1` is applied once.

Response: `{ success: true, data: { logoUrl, width, height, updatedAt } }`. No custom logo means `logoUrl: null` and the frontend renders `/logo/mahilam.png`.

Uses the existing Prisma `SiteSetting` model and its unique `key`, reserving `branding.logo`. Its JSON value stores public URL, generated R2 key, sanitized original filename, output MIME type, width and height; the existing `updatedAt` column supplies the timestamp. No schema change or migration is required for branding. No binaries are stored in the database. Other settings are unaffected.

PostgreSQL transaction advisory locking serializes upload/reset writes across serverless instances. Public reads bypass the existing process-local CMS cache to avoid stale branding across Vercel instances.

## Validation and failure handling

PNG, JPEG and static WebP only, maximum 2 MiB. SVG and animated images are rejected. Width must be 32–4096px and height 16–4096px, with a 16 megapixel decoding limit. Client checks MIME, signature, file size and decoded dimensions. Backend independently validates type and size, checks decoded format/dimensions, then fully decodes and losslessly re-encodes to WebP. This preserves raster transparency and strips source metadata. See [Sharp metadata](https://sharp.pixelplumbing.com/api-input/) and [output encoding](https://sharp.pixelplumbing.com/api-output/).

New files use immutable, unique `branding/logos/<uuid>.webp` keys. R2 public accessibility is checked before the database update. A failed verification or database write cleans up the candidate and retains the previous active logo. Only after a successful commit is the previous generated logo eligible for deletion. Default and general CMS keys cannot be deleted through this path. Restore is idempotent.

Cleanup failures are logged and do not reverse a successful save/reset. Maintenance should compare R2 `branding/logos/` objects against the active `branding.logo` key and retry deletion of confirmed inactive objects; do not delete default assets or active keys. No automatic scheduled orphan cleanup is introduced.

## Configuration and deployment

Reuse the existing backend environment variables:
- `DATABASE_URL` and existing authentication configuration, including `JWT_ACCESS_SECRET`.
- `CLOUDFLARE_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`: publicly accessible HTTPS bucket/CDN base URL.

Reuse the existing frontend variables:
- `NEXT_PUBLIC_API_URL`: backend base URL including `/api/v1` exactly once.
- `API_URL_INTERNAL`: optional server-side backend URL, also including `/api/v1`.
- `NEXT_PUBLIC_IMAGE_HOSTS`: comma-separated R2/CDN hostnames permitted by the existing Next.js image configuration. This enables optimization; other HTTPS upload URLs render unoptimized.

No new credential names or storage provider are required. Keep all R2 credentials on the backend. Configure the existing bucket for public reads through its CDN/custom domain and authenticated server-side object writes/deletes. The backend token must have object upload/delete access for the bucket; public visitors must have no write/delete permissions. Verify the CDN returns `image/webp` for uploaded objects and supports HEAD requests. Browser-to-R2 upload CORS is unnecessary because uploads go through the authenticated backend.

For initial rollout, commit the relevant frontend and backend changes to their respective repositories, deploy the backend first with the updated dependency lockfile, then deploy the frontend. Existing Vercel build commands remain `bun run build`; backend installation remains `bun install --frozen-lockfile`. Sharp must be installed for Vercel's target platform through that installation, rather than copying Windows native binaries. Branding needs no migration; handle any separate pre-existing migrations according to the project's normal release process. Verify a public GET returns 200, sign in as admin and upload a logo, then refresh public pages. Subsequent logo uploads/reset require no deployment.

## Actual verification results

- Frontend `bun run typecheck`: passed.
- Backend `bun run typecheck`: passed.
- Frontend `bun run build`: passed; public pages render dynamically.
- Backend `bun run build`: passed, including Prisma generation.
- Frontend `bun test tests/branding.test.tsx`: 4 passed, 0 failed.
- Backend `bun test tests/branding.test.ts`: 12 passed, 0 failed.
- Backend `bun test tests/branding-http.test.mjs`: 1 passed, 0 failed. Covers real compiled Nest controllers, cookie JWT and role guards, multipart upload parsing, supported formats, MIME mismatch, corrupt input, SVG rejection, oversized 413 response, replacement and restore through HTTP.

Failure tests simulate storage, URL verification, database and cleanup errors. HTTP tests isolate persistence/storage; they do not change the live database or R2 bucket. Real browser file selection, mobile/desktop visual appearance, cross-instance PostgreSQL concurrency, live R2 operations and deployment smoke tests remain unverified. Tests do not assert production credentials or deployment readiness.

The HTTP test imports compiled `dist` files: run `bun run build` before `bun test tests/branding-http.test.mjs`.
