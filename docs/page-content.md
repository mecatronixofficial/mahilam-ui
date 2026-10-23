# Home and About content

Use **CMS → Home Page** (`/admin/home`) or **CMS → About Page** (`/admin/about`) to edit section headings, labels, descriptions and photos. The About editor includes both hero photos, the story photo, both founder portraits and the values photo. The Home editor includes the default hero, both welcome photos and all four happy-moment photos.

Upload a JPG, PNG, WebP or GIF up to **5 MB**, enter a photo description, then select **Save section**. Uploading alone does not publish the image. Save is disabled while an upload is running. Failed saves retain the form for retry. **Restore defaults** clears the form; select **Save section** to publish that reset. Empty text and image fields use the original website content.

Homepage hero slides and program cards use the existing **Banners** and **Programs** editors, linked from the Home editor. Published banners take precedence over the default hero. Each happy-moment upload overrides its own position; positions without an upload retain the selected school photograph.

Section documents are JSON settings stored by the existing backend:

- Authenticated read: `GET /api/v1/cms/settings`.
- Publish: `POST /api/v1/cms/settings`, body `{ "key": "public.page.about.hero", "value": { "text": { "heading": "Our school" }, "images": { "main": { "url": "https://cdn.example.com/photo.webp", "alt": "Our classroom" } } } }`.
- Upload: `POST /api/v1/integrations/uploads/image`, multipart field `file`.
- Public read: `GET /api/v1/cms/public/settings`.

Keys use `public.page.home.<section>` and `public.page.about.<section>`. The section definitions and supported fields live in `src/lib/page-content.ts`. Each section saves independently. The existing CMS endpoint enforces ADMIN, SUPER_ADMIN or CMS_EDITOR writes, stores values in `SiteSetting`, and clears the public cache after changes. These keys are hidden from the generic advanced-settings editor so they retain their structured JSON format.

No database migration or new backend endpoint is needed. Image storage uses the backend's existing Cloudflare R2 configuration. Public pages read settings without the Next.js page cache; malformed or absent settings fall back to the existing content. Unknown upload hosts render without Next.js optimization, matching existing CMS image behavior.

Validation: `bun run typecheck`, `bun test`, `bun run build`. The isolated browser suite `bun tests/page-content-browser.mjs` uses a local fixture API and a temporary Chrome profile; it never writes to the school database or cloud storage.

