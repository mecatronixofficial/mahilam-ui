# Little Mahilam CRM verification

Date: 17 October 2026 (Asia/Kolkata).

**The complete master-prompt CRM is not finished.** This delivery audits both existing repositories and the configured PostgreSQL schema, implements critical security/integrity/integration repairs, and adds executed regression checks. Missing business workflows remain explicit below and in `CRM_IMPLEMENTATION_CHECKLIST.md`.

## Implemented changes

- Existing JWT cookie authentication now reloads the active account and current role before allowing a protected request. Disabled/deleted accounts and stale elevated role claims are rejected. A database outage is allowed to propagate rather than being incorrectly reported as an invalid session.
- Admission confirmation requires existing ADMIN/SUPER_ADMIN access. Lead creation/editing/follow-ups and application creation/editing cannot set confirmed statuses directly. The existing frontend hides enrolment for staff and prevents selecting confirmed statuses outside approval.
- Application creation and linked enquiry update use one Prisma transaction. The frontend no longer repeats that stage update in a second request. The enquiry is locked and checked for another active application.
- Confirmation locks/rechecks the application and linked enquiry inside the transaction before issuing a student number. It checks selected class/section compatibility, preserves known child DOB and family contacts, creates a guardian link, updates related statuses and writes an approval audit in that transaction. It does not mark fees paid.
- Already enrolled applications cannot be edited/deleted through ordinary application actions. Enquiries with applications cannot be deleted. Lead edits/follow-ups lock the enquiry before preventing backwards transitions from admission confirmation.
- Enquiry assignees must reference an active account. Follow-up authors use the authenticated actor rather than an arbitrary submitted staff name.
- Enquiry list search, source/status/open/due filters and 25-row pagination now run in the existing API, with server totals, stable ordering and navigation controls. Dashboard recent/due lists use separate limited queries; KPI totals stay backend aggregates.
- School dates, date-only report boundaries and monthly grouping use Asia/Kolkata. Explicit timestamp filters remain exact instants. Inverted report ranges are rejected.
- Dashboard/follow-up request failures show retryable errors instead of false empty/success messages. Enquiry/admission mutations invalidate affected lists, dashboards, details and reports.
- Public enquiry validation trims names/email/phone, aligns length limits and accepts formatted Indian/international numbers. The backend forces public source to WEBSITE. Existing layout/styles are retained.
- Login return destinations reject external origins, backslashes, controls, encoded path separators and login loops.
- Both packages expose a `test` command. Backend `bun run test` builds first so HTTP tests use current compiled NestJS code.

## Module re-audit

| Module | Previously | Implemented Changes | Final Status | Tests |
|---|---|---|---|---|
| Public website | PARTIAL / integrations not verified | Shared enquiry validation hardened; existing structure/styles retained | PARTIALLY COMPLETE | Production HTTP smoke: 15 public/login routes; branding tests; browser/visual and real submissions pending |
| Admin authentication | PARTIAL | Active-account/current-role checks; safe return destinations | PARTIALLY COMPLETE | Guard/HTTP denial and redirect tests pass; real account login/refresh/password-change E2E pending |
| Admin dashboard | PARTIAL | Existing CMS cards retained | PARTIALLY COMPLETE | Frontend build; real CMS dashboard data/actions pending |
| CRM dashboard | PARTIAL | Limited recent/due queries, school-day handling, honest errors | PARTIALLY COMPLETE | Typecheck/build and query/date contracts; required additional widgets/filters pending |
| Lead management | PARTIAL | Server search/filter/pagination, assignee validation, protected stages, linked-record retention | PARTIALLY COMPLETE | Pagination/status/assignee contracts pass; real CRUD/assignment and archive/bulk/import/merge pending |
| Lead pipeline | PARTIAL | Confirmation bypass blocked in enquiry selectors and backend | PARTIALLY COMPLETE | Confirmed-stage rejection tests pass; configurable lead Kanban/transitions not implemented |
| Website enquiries | PARTIAL | Trim/phone/length validation and server-owned source | PARTIALLY COMPLETE | Validation/DTO/public-source tests pass; real PostgreSQL capture, consent, events and duplicate handling pending |
| Follow-ups | PARTIAL | Trusted author, locked stage check, school dates and history error display | PARTIALLY COMPLETE | Follow-up/date contracts pass; task lifecycle and durable reminders pending |
| School visits | Enquiry request form only | No booking/calendar model or endpoint added | NOT IMPLEMENTED | Real slot booking, scheduling/rescheduling/outcome tests unavailable |
| Admission applications | PARTIAL / approval and race defects | Admin-only confirmation, transactional creation/conversion/audit, locks, family details and retention | PARTIALLY COMPLETE | Role/status/rollback/duplicate/section contracts and HTTP tests pass; PostgreSQL concurrency, documents/year/review workflow pending |
| Student and parent records | PARTIAL | Enquiry contacts/DOB and guardian link included during conversion | PARTIALLY COMPLETE | Conversion contract passes; existing guardian reuse/sibling identity review and real DB links pending |
| Staff management | PARTIAL | Existing management retained; current role/active state enforced by shared guard | PARTIALLY COMPLETE | Guard/HTTP tests; staff CRUD and six-role permission model pending |
| User permissions | PARTIAL / admission approval hole | Backend and frontend admin-only enrolment; stale privileges rejected | PARTIALLY COMPLETE | Approval/export STAFF 403, anonymous/disabled 401; granular/assigned-only permissions pending |
| Communication | PARTIAL provider adapters/click-to-chat | Existing integrations retained | PARTIALLY COMPLETE | Actual Resend/Meta delivery, consent, templates, retries and opt-out not tested/complete |
| Campaign tracking | PARTIAL source enum | Public source protected | PARTIALLY COMPLETE | Forced website source tested; UTM/events/campaign management/Meta/Google ingestion pending |
| Notifications | PARTIAL admin alert adapters | Existing scheduler retained | PARTIALLY COMPLETE | No per-user inbox, durable follow-up/visit reminders, idempotent outbox or delivery verification |
| Reports and analytics | PARTIAL | Correct school-day range/month grouping and inverted-range validation; invalidation | PARTIALLY COMPLETE | Parameterized SQL/date and HTTP export permission tests pass; real totals and all requested report families pending |
| CRM settings | PARTIAL academic/CMS settings | Existing configuration retained | PARTIALLY COMPLETE | Source/build checks; new CRM settings not implemented |
| Audit logs | PARTIAL asynchronous interceptor | Admission approval audit committed with conversion | PARTIALLY COMPLETE | Transaction-double audit rollback test passes; general transactional history/old values/PII minimization pending |
| Database and migrations | PARTIAL / source-only initial view | Actual schema/index/constraint/migration metadata audited read-only | PARTIALLY COMPLETE | 30 tables, 211 constraints, 80 indexes, six finished migrations; Learning Photos migration unapplied; no DDL executed |
| API integration/security | PARTIAL | Existing routes/contracts retained with auth/status/validation/integrity fixes | PARTIALLY COMPLETE | Real Nest HTTP guards/DTOs with isolated service dependencies pass; production CORS/storage/CSRF deployment review pending |
| Automated testing | Branding tests only | Frontend CRM regressions, backend CRM HTTP/contracts, production route smoke and repeatable scripts | PARTIALLY COMPLETE | Eight frontend + 26 backend tests pass; separate route smoke passes; dedicated DB/browser E2E suite pending |

## Executed verification

Commands ran in their respective repository roots with Bun 1.4.2. The initial sandbox could not execute Bun; authorized elevated execution succeeded. No dependency upgrades were performed.

| Check | Result | Scope/limits |
|---|---|---|
| Frontend `bun run typecheck` | PASS | Strict TypeScript; also the configured `lint` implementation (no separate ESLint script) |
| Backend `bun run typecheck` | PASS | Strict TypeScript, including existing TypeScript tests |
| Frontend `bun run build` | PASS | Next.js 16.3.5 production compilation and route generation |
| Backend `bun run build` | PASS | Existing Prisma 7.10 client generation and NestJS TypeScript compilation; no migration |
| Frontend `bun run test` | PASS: 8 tests; 1 opt-in test skipped | Existing branding and new redirect/date/enquiry validation tests |
| Backend `bun test tests/branding.test.ts tests/branding-http.test.mjs tests/crm-contract.test.mjs` | PASS: 26 tests | Existing branding + CRM business contracts, DTO validation, actual local Nest HTTP guards and export authorization; database/provider dependencies replaced with isolated doubles |
| Opt-in production public/login route smoke | PASS: 1 test checks 15 routes | Set `CRM_PUBLIC_SMOKE=true`, then run `bun test tests/public-routes.test.ts`; temporary server is stopped after checks |
| Read-only PostgreSQL metadata inspection | PASS | Read-only transaction; schema metadata and migration names only; artifact `docs/crm-database-audit.json` |
| Targeted frontend CRM `git diff --check` and backend diff check | PASS | A full frontend check reports unrelated trailing whitespace in `src/components/public/ProgramsDynamic.tsx` at lines 57 and 64; this task did not edit that file. Shell commands followed by other successful commands can hide a nonzero Git exit code, so only the targeted check is claimed here. |

The new report test initially failed because its database double expected a Prisma SQL object while the service uses a tagged template call. The double was corrected to capture template parts and bound values; all 26 backend tests subsequently passed. The first unsuccessful run is not reported as a pass.

## Explicit master-checklist verification

| Required check | Evidence / remaining limitation |
|---|---|
| All original public pages work | HTTP 200 production HTML for `/`, `/about`, `/programs`, `/learning-approach`, `/activities`, `/facilities`, `/gallery`, `/events`, `/admissions`, `/contact`, `/faq`, `/blog`, `/preschool-in-tiruppur`, `/privacy-policy`; `/login` also checked. Published `/blog/[slug]` content not exercised. CMS fallback HTML does not verify real CMS content. |
| Original website/admin design unchanged | No stylesheet, theme, brand, page layout or shell redesign in this work; only functional states/disabled controls/pagination added to existing patterns. Pixel/browser comparison not executed. Pre-existing user changes retained. |
| Original login works | One login system retained; denial/role/redirect regressions pass. Actual account/cookie refresh/login E2E not executed. |
| Existing CMS works | Branding regressions and public HTML smoke pass. Full CMS CRUD not executed; LearningPhoto table/migration gap remains. |
| Public enquiries save and appear in CRM | Existing persistence/API paths reused and contracts tested; actual write-to-PostgreSQL/browser journey not executed. |
| Assignment and pipeline persistence | Active assignee validation/server paging/status restrictions implemented. Actual database/browser mutation tests pending. |
| Follow-up reminders work | NOT IMPLEMENTED as reliable scheduled CRM reminders; existing next-date/history fields are not a reminder service. |
| School visits work | NOT IMPLEMENTED as actual slot booking; free-text enquiry requests remain. |
| Admission applications and related conversion records | Atomic code/row locks and role restrictions implemented; contract/HTTP tests pass. Real PostgreSQL concurrency and relational workflow E2E pending. Existing children without reliable IDs are not automatically merged. |
| Staff permissions enforced | Current three-role guards and admin-only approval/export tested; expanded roles and assigned-only scope incomplete. Password-change access-token revocation before expiry is not added. |
| Reports display real data | Existing aggregate queries retained; date/filter SQL contracts tested. Numerical reconciliation against dedicated test records not executed. |
| Notifications work | Existing new-enquiry provider adapters retained; provider delivery and per-user/scheduled CRM notifications unverified/incomplete. |
| Existing data preserved | Application work ran no school-data mutation, seed, reset or migration. Database audit was metadata-only and explicitly read-only; regression tests use doubles. |
| Frontend/API builds and available tests pass | Both builds/typechecks pass; eight frontend and 26 backend tests pass; public-route smoke passes separately. Full database/browser E2E suite absent. |
| No mock CRM data used as live information | New doubles are confined to tests. Production queries continue using the existing API/Prisma; no fabricated production leads or KPI totals added. |
| No broken actions remain in implemented scope | Source types, contracts and authorization verified; exhaustive browser interaction testing not executed. Enrolled edit/delete/status controls are disabled/hidden consistently with backend rejection. |
| No destructive database changes | No schema or database records changed by this work. Existing unapplied migration was reported, not applied. |

## Remaining dependencies and next work

The current configured database was used only for metadata inspection. There is no `.env.test` supplied in the backend; an explicitly isolated PostgreSQL instance/configuration is needed to execute record-creating integration tests. Production/family records must not be used as fixtures.

Review the existing Learning Photos migration and reconcile deployed/schema state before claiming full CMS readiness. The broader CRM requires additive design/migration work for year-specific applications, lead events/consent/archive, visit slots/bookings, durable notifications/outbox, document tracking, configurable stages and granular permissions. No replacement tables/ORM/auth system were introduced.

Email/WhatsApp delivery, external ad ingestion, cron deployment, secure document storage, backup/recovery and retention/consent policies need actual school/provider configuration and verification. These dependencies are not represented as complete.

The security repair intentionally changes existing behavior: staff can no longer enrol students, callers cannot set confirmed statuses through generic writes, enrolled applications cannot be edited/deleted here, and an enquiry cannot have a second active application through these API paths. Existing records are retained. A class match by name remains a compatibility fallback until academic-year-specific admission/class links are designed.
