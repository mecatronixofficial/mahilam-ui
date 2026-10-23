# School photo placement and publishing

The 60 photographs in the supplied `Downloads/img.zip` collection are preserved as web assets under `public/images/school/`. Their descriptions, original filenames and dimensions are recorded in `src/data/school-photos.json`.

58 page image positions are mapped in `src/data/website-photo-slots.json`. Classroom photos appear in learning sections, art and cooking photos in hands-on sections, outdoor photos in play and nature sections, and celebration photos in event sections. Offsite farm, library and market photographs are described as visits rather than campus facilities. No supplied photograph has been assigned to a named founder; founder positions show initials until the correct portraits are uploaded through the About editor.

All 60 images are included once across seven default gallery albums: Celebrations, Art and sensory play, Learning beyond the classroom, Nature and outdoor discovery, Family and school life, Classroom learning, and Cooking and life skills.

## CMS controls

- `/admin/photos`: default photo positions across all pages. Select a page, upload a replacement, describe it, then save the section.
- `/admin/home` and `/admin/about`: section copy and dedicated photo overrides, including founder portraits.
- `/admin/learning-approach`: the learning photo group, stored in CMS settings; no LearningPhoto table migration is required for this editor.
- Existing Banners, Programs, Activities, Facilities, Blog, Events and Gallery editors retain their own image controls. Published record images and dedicated section uploads take precedence over default page photos.

Default position uploads are JSON settings at `public.website.photos.<group>`. Each group stores `{ text: {}, images: { "slot-id": { url, alt } } }`. The public shell passes only these photo settings into the photo provider. The image component resolves registered paths to uploaded URLs, retains built-in photos on missing or malformed settings, and supports upload hosts outside the Next.js optimizer allowlist.

## Prepared backend import (awaiting approval)

The read-only preflight succeeded. No storage upload or database import was performed: automatic approval review requires explicit approval to publish the children's photographs to the configured public Cloudflare R2 bucket and update CMS content.

Destination: the school's configured Cloudflare R2 public image host, `pub-71b02c21612843e2a98d8b29de04b3b8.r2.dev`, and the existing CMS database used by the local backend. No credentials are included in source files or reports.

The prepared importer is `scripts/import-school-photos.mjs`. Running it without arguments performs a read-only preflight. After approval, `--apply` will:

1. Upload all 60 supplied photos through the backend's existing StorageService, and verify that each resulting public URL serves an image.
2. Create seven gallery albums and 60 gallery items with descriptive captions and alt text.
3. Save the 58 photo positions in nine CMS settings groups.
4. Replace the images on the existing three banners and seven programs while preserving their text; route the existing default hero photo through its assigned position.
5. Add six facility and six activity entries if the corresponding entries do not exist, or replace only their image if they do. Update the existing cooking activity image.
6. Record the import in the CMS audit log. Existing headings, descriptions, contacts and CRM records are retained.

The importer records a backup of affected public CMS records before database changes, checkpoints uploaded URLs to avoid duplicate uploads on retry, and commits CMS changes as one transaction. It does not delete existing storage objects. Direct import writes become visible through the running backend after its existing public cache expires (normally 60 seconds).

## Verification and review

- `bun test` checks image assets, gallery coverage, URL validation, per-position replacement and public rendering.
- `bun run build` checks the production website and CMS routes.
- `bun tests/page-content-browser.mjs` uses an isolated local fixture API and temporary Chrome profile. It checks upload/save/reload, failure handling, public replacements and desktop/mobile layout without publishing or touching the school database.
- Review screenshots: `docs/school-home-1440.png`, `docs/school-home-390.png`, `docs/school-gallery-1440.png`, `docs/school-gallery-390.png`.
