# Little Mahilam School CRM audit and completion

Audit started: 22 October 2026, Asia/Kolkata. This report distinguishes source implementation, executed tests, and live deployment. The initial findings below are retained; implementation and executed verification follow in sections C-I.

## A. Existing features discovered

Frontend: Bun, Next.js 16 App Router, React 19, TypeScript, Tailwind 4, TanStack Query, Zustand. Backend: NestJS 11, Prisma 7 PostgreSQL adapter, PostgreSQL, class-validator DTOs, bcrypt, rotating cookie JWT sessions, existing audit interceptor, sequence generator, Resend/Meta notifications, public R2 image storage. Dependencies and existing designs are retained.

CRM routes present at initial inspection: `/crm`, `/crm/enquiries`, `/crm/admissions`, `/crm/students`, `/crm/academics`, `/crm/fees`, `/crm/reports`, `/crm/staff`, `/crm/account`. Admin routes: `/admin`, `/admin/announcements`, `/admin/banners`, `/admin/programs`, `/admin/activities`, `/admin/facilities`, `/admin/learning-approach`, `/admin/gallery`, `/admin/events`, `/admin/blogs`, `/admin/testimonials`, `/admin/subscribers`, `/admin/settings`, `/admin/activity`. Public routes and prior navbar changes are preserved.

Existing API resources under `/api/v1`: `/auth`, `/enquiries` (including public capture and follow-up logs), `/admissions` (including confirmation), `/students` (including student guardians), `/academics/years`, `/academics/classes`, `/academics/sections`, `/fees` (including payments, voids, types and structures), `/reports` (dashboard, enquiries, admissions, fees, CSV exports, audit logs), `/staff`, `/cms`, `/cms/public`, `/newsletter`, `/branding`, `/integrations`, `/tasks/run` (maintenance, not CRM tasks).

Existing models: User, RefreshSession, AcademicYear, ClassLevel, Section, Student, Guardian, StudentGuardian, Enquiry, EnquiryFollowUp, Admission, FeeType, FeeStructure, StudentFee, Payment, Announcement, Banner, Program, Facility, LearningPhoto, Activity, GalleryAlbum, GalleryItem, BlogPost, Testimonial, SchoolEvent, SiteSetting, AuditLog, NewsletterSubscriber, Sequence. Existing relationships include year/classes/sections/students, many-to-many student guardians, student fees/payments, enquiry follow-up logs and gallery albums/items. Enquiry assignment and application enquiry links lack database foreign keys in the initial source.

The earlier `CRM_AUDIT_REPORT.md`, `CRM_FINAL_VERIFICATION.md`, and regression suites are useful historical evidence, not verification of this delivery. Both repositories contain substantial pre-existing changes, which must be retained.

## B. Missing features discovered

| Module | Initial classification | Evidence and necessary work |
|---|---|---|
| Dashboard | PARTIAL | `DashboardClient.tsx`, backend `reports/*`: missing full stage/task/visit counts, year/date/staff filters and card drill-downs. |
| Enquiries | PARTIAL | `EnquiriesClient.tsx`, `enquiries/*`: pagination exists; archive/restore, year, priority, duplicate review, bulk assignment, enforced stage transitions and record scope need extension. |
| Lead details/history | MISSING | Follow-up drawer exists; dedicated route and durable action timeline, notes, communications and visits are missing. |
| Admission pipeline | PARTIAL | Admission board exists; separate enquiry stages, drag/drop, transition policy and rollback are missing. Preserve old enum values for compatibility. |
| Follow-ups | PARTIAL | `EnquiryFollowUp` is a completed conversation log, not a scheduled task. Add scheduled lifecycle without replacing logs. |
| School visits | MISSING | No booking/slot model or API; existing enquiry status is not a booking. |
| Applications | PARTIAL | `admissions/*`: lacks family fields, year/class links, draft/submission/review separation, private documents and checklist. |
| Approval/enrollment | PARTIAL | Transaction and source locks already exist. Missing separate approval, required class/year, capacity checks, durable student link and document validation. |
| Students | PARTIAL | `students/*`: CRUD exists; ordinary delete is destructive, and section changes/capacity/year handling need correction. |
| Guardians | PARTIAL | Existing normalized models and per-student CRUD; missing independent list/detail, existing-guardian links and retention/primary-guardian consistency. |
| Academics | PARTIAL | Existing CRUD/counts; hard deletes, current-year concurrency and capacity validation need repairs. |
| Attendance | MISSING | Historical migration removed attendance. Required daily/monthly entry and reporting must be additive. |
| Fees/payments | PARTIAL | Decimal amounts, locks, partial payment and void exist. Fee deletion destroys void history; concurrent void can subtract twice; assignment can duplicate fees. |
| Tasks/calendar | MISSING | Existing `/tasks/run` performs maintenance only. Add business tasks and calendar. |
| Communications | PARTIAL | Click-to-contact links/admin notifications exist; missing persisted templates/history. Do not claim message delivery without provider evidence. |
| Reports | PARTIAL | Existing database aggregates and CSV; missing operational reports and consistent filters. |
| CMS | PARTIAL | Existing managers and public reads; inspect each contract and migration state before marking complete. |
| Staff/permissions | PARTIAL | Only SUPER_ADMIN/ADMIN/STAFF; existing auth checks account state. Add required roles and enforce module/assigned-record access server-side. |
| Settings/audit | PARTIAL | CMS settings and asynchronous write audit exist. Private CRM settings and transactional business history are missing. |

## C. Implementation completed

The CRM extends the existing Next.js/NestJS/Prisma application and its current panel, drawer, table, notification and query patterns. No CRM dependency was added. Public navigation, branding and page layouts are retained. Public-form changes add consent, distinguish contact requests from admission leads, and read configured CMS programs. Public main content clips decorative horizontal overflow.

Full source inventory: [55 page routes, 191 API endpoints, 41 Prisma models, relationships, indexes, migration names and environment-variable names](docs/crm-source-inventory.json). This inventory includes existing functionality and does not imply that every file was newly written.

| Source | Result |
|---|---|
| Frontend: src/components/crm/DashboardClient.tsx, DashboardWorklists.tsx | Fourteen database metrics; academic-year/date/program/counsellor filters; six charts; card drill-downs. Existing due-call list, phone/WhatsApp links, recent leads, role-filtered quick actions and administrator finance snapshot retained. Global finance snapshot is labelled separately from the filtered admissions cohort. |
| Frontend: EnquiriesClient.tsx, EnquiryDetailClient.tsx, LeadAttachmentsClient.tsx | Server pagination/search/sort, source/program/year/stage/date/staff/purpose filters, bulk assignment, duplicate review, archive/restore, dedicated profile, notes, call outcomes, linked applications, timeline and authenticated private attachments. |
| Frontend: PipelineClient.tsx | Thirteen canonical columns, assignment/year/program filters, drag/drop and accessible stage selectors, protected workflow stages, lost reason, optimistic rollback and saved-state refresh. |
| Frontend: CrmOperationsClient.tsx, crm-shared.tsx | Scheduled follow-ups, visits, tasks, table/card and calendar views; rescheduling and terminal history; assignment; configurable follow-up defaults; task links to leads, applications, visits and students according to role; standalone guardians, message templates and communication records. |
| Frontend: ApplicationDetailClient.tsx, AdmissionsClient.tsx | Existing application board retained; full draft/family/year/class/address/emergency/consent editing; private document checklist; submit/review/waitlist/reject; approved enrollment; section/guardian selection and administrator capacity override with reason. |
| Frontend: StudentsClient.tsx, FamilyRecordClient.tsx, AcademicEditorClient.tsx, AcademicsClient.tsx | Student/year/class filters and profiles; retained admission history; archive; shared guardian/student links, primary guardian and preferences; edit academic years, class/section capacity and configuration. |
| Frontend: AttendanceClient.tsx, FeesClient.tsx, FeeManagementClient.tsx | Daily entry/update, roster/history/monthly report and export; existing fee assignment/manual payments retained; types/structures, idempotent class assignment, partial payment history, receipt view/print, adjustments and authorized void with reasons. Money displays paisa instead of rounding to whole rupees. |
| Frontend: OperationalReportsClient.tsx, ReportsClient.tsx, CrmSettingsClient.tsx | Operational enquiry/source/follow-up/counsellor/visit/conversion/student/year/attendance/collection/outstanding/lost reports, pagination and role-authorized CSV; existing analytics retained; private document/number/follow-up settings and visit slots. |
| Frontend: src/store/auth.ts; dashboard/nav.ts, DashboardShell.tsx, CommandPalette.tsx; login/page.tsx | Required staff roles, role-specific landing pages, matching navigation/action visibility and forbidden screens. Existing login/session refresh preserved. |
| Frontend: dashboard/Drawer.tsx, ui.tsx, StaffClient.tsx | Stable form focus during editing, Tab containment and Escape close; wrapping toolbars; long staff addresses truncate; admissions board scrolling stays inside the page. |
| Backend: src/crm/crm.module.ts, crm.controller.ts, crm.service.ts, crm.dto.ts | Integrated APIs for dashboard, worklists/pipeline, scheduled follow-ups, slots/visits, tasks, guardians/links, attendance, templates, communication history, settings, private files and operational reports/exports. Existing /api/v1 conventions retained. |
| Backend: enquiries/*, admissions/*, students/*, academics/*, fees/*, staff/*, reports/* | Extended the original resources rather than introducing competing record systems. Atomic lead history, duplicate normalization/locking, assignment scope, submission/approval separation, safe enrollment, retention, capacity, fee assignment/void fixes and consistent school-local dates. |
| Backend: common/utils/crm-policy.ts, crm-workflow.ts, enrollment-capacity.ts, private-document.ts, csv.ts | Central module/record permissions; legacy-stage mapping; transition and capacity rules; file signature/size validation; private downloads; spreadsheet-formula-safe CSV. |
| Backend: auth/auth.service.ts; common/guards/roles.guard.ts; common/interceptors/audit.interceptor.ts; prisma/sequence.service.ts | Existing bcrypt/JWT/cookie architecture retained. Failed login and denied module access audited; disabled users cannot reuse roles/sessions; significant enrollment/payment/settings writes audit in the same transaction; recursive PII/password/binary redaction; configurable atomic numbering. |
| Backend: prisma/schema.prisma and migration 20261022090000_complete_school_crm | Eleven additive CRM models, relationships, query indexes and uniqueness/capacity/file constraints. Legacy enums/data retained. Migration is atomic on the supported PostgreSQL version. |
| Tests and diagnostics | Existing suites extended; crm-workflow.test.mjs, crm-postgres.test.mjs and helpers/crm-persistence-checks.mjs added. Frontend tests/crm-browser.mjs uses Chrome and the real isolated NestJS/PostgreSQL API. scripts/crm-readonly-audit.mjs only reads school schema metadata and aggregate compatibility counts. |

New page routes are /crm/pipeline, /crm/enquiries/[id], /crm/follow-ups, /crm/visits, /crm/admissions/[id], /crm/students/[id], /crm/guardians, /crm/guardians/[id], /crm/tasks, /crm/attendance, /crm/communications, /crm/templates and /crm/settings. The original public, CMS, account, staff, academic, fee and report routes remain.

Database additions are EnquiryActivity, FollowUpTask, VisitSlot, SchoolVisit, CrmTask, ApplicationDocument, AttendanceRecord, MessageTemplate, CommunicationLog, CrmSetting and EnquiryAttachment. Enquiry links its assignee/year, activities, contacts, scheduled follow-ups, visits, tasks, communications, attachments and applications. Application links year/class, private documents and a unique enrolled student. Students retain class/year/section, guardians, fees/payments and attendance; a guardian can be shared by siblings. New linked business records use restrictive deletes; ordinary student/lead/family/user removal retains history.

## D. CRUD verification matrix

Evidence key: DB = executed against disposable PostgreSQL; HTTP = real Nest guards/validation/routes; browser = real Chrome actions with requests forwarded to that isolated API, never mocked persistence; source = inspected implementation where an individual UI action was not automated. N/A means the action does not belong to that resource. Combined integration assertions count as one Bun test; the reported test count is not the number of CRUD assertions.

| Module | Create | Read | Update | Delete/archive | Validation | Persistence | Permissions |
|---|---|---|---|---|---|---|---|
| Dashboard | N/A | DB + browser | Mutation refresh / filters | N/A | Query DTO + range checks | DB aggregates | Scoped service + HTTP role samples |
| Enquiries | DB + public browser form | DB + browser | DB assignment/contact/stage | DB archive/restore | DTO, duplicate, phone, transitions | DB | HTTP and assigned-record denial |
| Lead detail/history | DB notes/contact events | DB + browser profile | DB linked events | Retained timeline; attachments archive in source | File signatures and scope | DB timeline; file service tests | HTTP private document matrix |
| Pipeline | Existing leads | DB + browser | DB and browser stage save/rollback | Terminal stages retained | Successful/invalid transitions tested | Browser refresh + DB | Approval bypass rejected |
| Follow-ups | DB + browser form | DB + browser | DB reschedule/complete/cancel tests | Terminal history retained | DTO and outcome checks | DB lifecycle | Scoped policy + service tests |
| Visits | DB | DB + browser | DB completion; service reschedule/cancel/no-show | Status retention | Slot/staff conflict checks | DB | Scoped service + role policy |
| Applications | DB | DB + browser | DB draft/submit/review | Archive service/contract checked; enrolled archive rejected | Required fields/consent/documents | DB | HTTP + counsellor review denial |
| Enrollment | DB transaction | DB links | Idempotent repeat/concurrency | N/A; history retained | Approval/year/class/capacity | DB and forced rollback | Manager/admin checks |
| Students | DB enrollment | DB + browser | Source/service validation | DB archive | DOB/year/class/section checks | DB | Role guards + financial projection |
| Guardians | DB | DB + browser | DB preferences/primary links | DB unlink/archive | DTO + linked-record checks | DB | Manager writes; school-role reads |
| Academics | DB year/class/section | DB + browser | DB current-year/capacity configuration | DB deactivation | Ranges/current year/capacity | DB | Administrator writes |
| Attendance | DB | DB + browser | DB upsert | N/A; history retained | DTO/day/student checks | One record per student/day | HTTP teacher/manager matrix |
| Fees/payments | DB invoices/structures/payment | DB + browser | DB partial payment, concession, void | DB financial-history rejection; unused config removal | Decimal limits/reasons/balance | DB concurrent void | Accountant recording; admin adjustments |
| Tasks/calendar | DB + browser | DB + browser | DB completion; browser refresh | Cancellation retained | DTO/link/assignee checks | DB | Assigned task scope tested |
| Communications | DB template/log | DB + browser | DB template disable | Logs retained | DTO/channel/scope | DB RECORDED status | Role policy + scoped service |
| Reports | N/A | DB + browser | Query filters | N/A | Range/type/role restrictions | Real aggregates/queries | HTTP export samples + module policy |
| Website CMS | DB all existing content types | DB public readers + public-route smoke | DB publish/unpublish and cache refresh | DB delete/unpublish | DTO samples; existing image tests | DB | CMS editor/admin guards; browser login |
| Staff/users | DB role/password account | DB + browser | DB rename/session-aware service | DB deactivation | Password DTO + bcrypt cost | DB | Existing escalation/self-disable restrictions |
| Settings/audit | DB settings/audit rows | DB + browser | DB defaults/number/document config | Audit retained | DTO/number pattern/redaction | Transactional critical audit | HTTP all-role settings samples |

The browser suite is a representative workflow and responsive regression suite, not a claim that every visible button and every possible permission combination was clicked. The matrix distinguishes those limits explicitly.

## E. Admission pipeline verification

Successful path persisted in PostgreSQL:

Website capture -> assignment -> CALL contact -> CONTACTED -> QUALIFIED -> configured school visit -> VISIT_COMPLETED -> DRAFT application -> private documents + consent -> SUBMITTED -> APPROVED -> ENROLLED -> linked student and primary guardian.

The browser separately submits the actual public admission form, verifies its database row, logs in, creates a task/follow-up, changes a stage and reloads saved state. The service integration test covers the complete linked workflow through enrollment.

| Case | Executed result |
|---|---|
| Simultaneous duplicate public submissions | Same enquiry ID, one row |
| Legitimate repeats | Internal duplicate requires explicit override/reason; different child/year remains valid |
| Invalid phone/blank required data/unknown DTO fields | Rejected |
| Invalid stage jumps or generic approval/enrollment writes | Rejected |
| Lost stage without reason | Rejected |
| Counsellor review/enrollment | Rejected |
| Another counsellor's assigned lead | Rejected without exposing the record |
| Missing required documents/consent | Draft retained; submission rejected |
| Visit slot/staff conflict | Rejected |
| Two admins enrolling the same approved application | Both receive the same student; one student/family link |
| Repeated enrolled application request | Returns existing enrollment |
| Full class/section | Rejected; administrator override requires recorded reason |
| Forced PostgreSQL audit trigger failure | Entire enrollment rolled back; no extra student, approved application unchanged |
| Archived enquiry | History still reportable; restore preserves identity |
| Concurrent repeated payment void | Exactly one void succeeds; paid balance adjusted once; payment retained |
| Failed browser stage request | Optimistic card rolls back and database stage remains unchanged |
| Successful browser stage/task mutation followed by refresh | Saved value remains |

Legacy stages NEW/FOLLOW_UP/VISITED/ADMISSION_CONFIRMED/NOT_INTERESTED/CLOSED remain readable and map to the canonical pipeline. No bulk conversion of historical statuses was performed.

## F. Testing results

Executed on 22 October 2026 using Bun 1.4.2, the repository's installed versions, and PostgreSQL 18.6.

| Working directory / exact command | Result |
|---|---|
| Frontend: bun run typecheck | PASS |
| Frontend: bun run lint | PASS; existing lint script runs TypeScript, no separate ESLint script installed |
| Frontend: bun test | 10 pass, 0 fail; production-route smoke intentionally skipped without opt-in; final opt-in bun test run: 11 pass, 0 fail, 0 skipped |
| Frontend: bun run build | PASS, production build generates all registered routes |
| Frontend PowerShell: $env:CRM_PUBLIC_SMOKE='true'; bun test tests/public-routes.test.ts | PASS, all 15 existing public/login routes return production HTML |
| Backend: bun run typecheck | PASS |
| Backend PowerShell: $env:CRM_TEST_DATABASE_URL=<fresh disposable local URL>; bun run test | 43 pass, 0 fail, no skipped PostgreSQL workflow; script includes fresh Prisma generation and backend build |
| Frontend PowerShell: $env:CRM_BROWSER_DATABASE_URL=<the migrated synthetic local URL>; bun tests/crm-browser.mjs | PASS: 71 route/viewport checks at 390/768/1440 px, six real workflow checks, zero page overflows, zero JavaScript exceptions and zero unexpected API failures |
| Backend: bun scripts/crm-readonly-audit.mjs <frontend>/docs/crm-database-verification-2026-10-22.json | PASS, BEGIN READ ONLY; metadata and compatibility counts only |
| Both repositories: git -c core.safecrlf=false diff --check | PASS in both repositories |

The PostgreSQL harness rejects non-local hosts, database names without the mahilam_crm_test_ prefix, and nonempty databases. It never falls back to school DATABASE_URL. Each migration retry used a new empty test database. No reset, seed or fixture write ran against the school database.

No PostgreSQL server was initially installed. A temporary portable PostgreSQL 18.6 runtime from the [official EDB binary distribution](https://www.enterprisedb.com/download-postgresql-binaries) ran on loopback with a generated test credential and unique database. Runtime/data/credentials stayed in TEMP, outside source control. Source tests use the current ORM and real transactions.

Real-database testing exposed a Prisma pg-adapter incompatibility when reading the void result of advisory-lock SELECTs; locks now use executeRaw. Browser checks exposed admissions-board margins, fee-toolbar duplication/wrapping, long staff contacts and decorative home-page overflow; these were corrected without changing the design language.

Synthetic-data previews: [desktop dashboard](docs/crm-desktop-2026-10-22.png), [mobile dashboard](docs/crm-mobile-2026-10-22.png).

Artifacts: [school database metadata](docs/crm-database-verification-2026-10-22.json), [browser results](docs/crm-browser-verification-2026-10-22.json), [complete source inventory](docs/crm-source-inventory.json). Browser API interception forwards to the real isolated API, including password verification and cookie sessions. Intentional 401/403 and injected network failures are distinguished from unexpected server errors. It does not establish production cross-domain cookie/CORS behavior.

## G. Database migration report

School metadata, rechecked read-only on 22 October, shows PostgreSQL 18.6, 29 application tables plus _prisma_migrations, and six applied migrations:

1. 20260915113243_init
2. 20260915170000_add_testimonial_contact_fields
3. 20260918052743_add_announcement_image
4. 20260918181519_remove_attendance
5. 20260929120000_add_sequences_and_indexes
6. 20261001120000_add_newsletter_subscribers

Two local migrations remain **unapplied to the school database**:

7. 20261009120000_add_learning_photos — existing earlier CMS migration.
8. 20261022090000_complete_school_crm — this additive CRM migration.

All eight deploy successfully against a fresh disposable local PostgreSQL database. The new migration adds eleven tables and extends ClassLevel, Student, Guardian, Enquiry, EnquiryFollowUp, Admission and StudentFee. Attendance is reintroduced as AttendanceRecord; historical removed attendance tables are not fabricated or recovered.

Compatibility decisions:

- Preserve old enums, IDs, rows and endpoints. New historical fields are nullable or have conservative defaults.
- Normalize legacy phone values; derive student year only from its explicit existing class relation; link a legacy admission to its student only by an existing matching admission number.
- Do not guess past consent, class/year assignments or missing application documents.
- New assignment/enquiry foreign keys are NOT VALID for legacy rows, while enforcing future writes. Validate these constraints after reconciliation during deployment.
- Unique partial indexes enforce one current year, one active application per enquiry, and one primary guardian per student. Preflight rejects conflicting history instead of deleting/merging it.
- Class/slot intervals, document size/content length, unique student/day attendance, unique assigned structure/student and unique application/student links enforce database invariants.
- The migration runs inside BEGIN/COMMIT so a preflight failure rolls back its schema changes.
- Existing non-CRM cascade rules remain documented in the inventory; ordinary APIs now archive/unlink school records instead of invoking destructive deletes.
- Read-only school preflight: one current academic year; zero conflicting primary-guardian groups; zero conflicting active-application groups; zero orphan assignments; zero orphan application-enquiry links.
- Fresh-database tests do not replace a restored-copy rehearsal on the school's complete historical dataset.

Deployment order: preserve a recoverable school backup; review migration and compatibility output; deploy pending migrations and the matching backend; then release/rebuild the frontend with the correct API URL. Builds intentionally do not migrate. **No school migration or deployment was performed in this task.** Do not run prisma migrate reset or the seed script on the school database to enable this work.

## H. Remaining issues and verification limits

1. **Live rollout remains pending.** The school schema has not received either pending migration. New CRM endpoints require the matched backend/schema before staff can use them against that database.
2. **External delivery is not certified.** The existing Resend/Meta new-enquiry notification services are retained. CRM communications are recorded as RECORDED, never fabricated as DELIVERED. No real parent email/WhatsApp was sent for testing.
3. **Live object storage was not exercised.** CMS image validation/upload behavior is covered by existing image/HTTP tests using storage doubles; real R2 upload/replacement needs deployment configuration verification. Student/application files use private authenticated database storage and do not use public R2 URLs.
4. **Host transport limits still apply.** Local private uploads allow up to 5 MB; Vercel's documented existing request limit in the backend README can be lower. Validate the intended hosting limits before rollout and choose a lower file cap or suitable upload transport when deploying there.
5. **Historic records need factual completion.** Existing draft applications may lack year/class/family/consent/document fields. Review them rather than inventing values. Old confirmed applications remain readable.
6. **Workflow enums are fixed policy.** Admission stages and lead sources remain controlled backend enums with legacy mappings. School profile, academic programs/years, document checklist, number format, fee setup and follow-up defaults use their existing/configurable resources. Arbitrary custom stage/source creation is not implemented.
7. **Coverage is explicit.** The suite verifies real database persistence and representative HTTP/browser workflows. It does not certify production secrets, every production record, every CMS image on a live CDN, every possible browser/device or every action permutation.

No known failing build or automated test remains in the executed suites. The final Chrome run passed 71 route/viewport checks and six workflow checks. Both repositories pass git diff --check. The temporary PostgreSQL server was stopped after verification; its synthetic data remains in TEMP only.

## I. Final checklist

“COMPLETE” below means the scoped source behavior and recorded local verification are complete. It does **not** mean deployed to the school database. A narrower limitation is stated where present.

| Module | Status | Evidence / qualification |
|---|---|---|
| 1. Dashboard | COMPLETE | Real metrics/charts/filtering/drill-downs; existing worklists and shortcuts retained |
| 2. Enquiries | COMPLETE | CRUD/search/pagination/assignment/duplicate/retention; real public capture |
| 3. Lead details/history | COMPLETE | Dedicated profile, actions, timeline, private attachments and linked records |
| 4. Pipeline | COMPLETE | Canonical stages, backend rules, browser rollback and saved refresh |
| 5. Follow-ups | COMPLETE | Scheduled lifecycle, assignment/history/defaults and school-local dates |
| 6. Visits | COMPLETE | Slot/staff capacity and lifecycle/calendar |
| 7. Applications | COMPLETE | Draft, checklist, private files, submission and decisions |
| 8. Approval/enrollment | COMPLETE | Actual PostgreSQL concurrency/idempotency/rollback |
| 9. Students | COMPLETE | Profile/history/class/year, guarded edits and archive |
| 10. Guardians | COMPLETE | Shared student links, primary, preferences and consent |
| 11. Academics | COMPLETE | Current-year uniqueness, capacity, sections and retention |
| 12. Attendance | COMPLETE | Entry/update/history/monthly query/export |
| 13. Fees/payments | COMPLETE | Decimal amounts, structures/assignment, partial/manual payments, receipts, adjustments and retained void history |
| 14. Tasks/calendar | COMPLETE | Assignment, linked records, lifecycle, filters/calendar and persisted browser form |
| 15. Communications | COMPLETE | Templates/history/parent contact recording; provider delivery explicitly unverified |
| 16. Reports | COMPLETE | Real operational queries, role-aware filters and safe CSV |
| 17. Website CMS | PARTIAL | Existing CRUD/public persistence verified; live R2/CDN upload verification pending |
| 18. Staff/permissions | COMPLETE | Roles, live-account checks, assigned-record access, hashed passwords and retained deactivation |
| 19. Settings/audit | COMPLETE | Existing/configurable settings and critical transactional audit; custom enums excluded as stated above |
| Production migration and deployment | BLOCKED | Intentionally not applied to the school database; requires a reviewed release step |
