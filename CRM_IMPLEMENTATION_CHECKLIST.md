# CRM implementation checklist

Date: 17 October 2026. Baseline evidence: `CRM_AUDIT_REPORT.md`. Final executed checks: `CRM_FINAL_VERIFICATION.md`.

## Existing functionality to retain

- [x] Locate and inspect both actual repositories; retain Next.js, NestJS, Prisma and PostgreSQL.
- [x] Identify existing public routes, shared ContactForm, CMS, admin/CRM shells and styles.
- [x] Identify one cookie authentication system, password hashing and rotating refresh sessions.
- [x] Identify existing enquiries, follow-up history, admission conversion and student/guardian APIs.
- [x] Identify existing academic settings, fees, real report aggregations, CSV and audit history.
- [x] Identify current provider adapters and scheduler; do not replace or duplicate them.
- [ ] Verify those existing workflows against an isolated database and through the browser.

## Implemented critical repairs

- [x] Restrict admission confirmation to existing administrators on the backend and frontend (HTTP role tests).
- [x] Reject confirmed status through generic lead/admission/follow-up writes (contract tests).
- [x] Make application creation/stage update transactional; remove duplicate frontend mutation.
- [x] Lock application/enquiry rows before conversion, preserve family details and audit approval transactionally (implemented; PostgreSQL concurrency E2E still pending).
- [x] Recheck current active account and role for protected requests (guard and HTTP tests).
- [x] Validate login destinations against the current origin (redirect regression tests).
- [x] Validate assignee existence/active status and trust the actor for follow-up author (contract tests).
- [x] Connect enquiry search/filter/pagination to existing backend paging with accurate totals (backend contract tested; browser workflow pending).
- [x] Correct school-date boundaries and avoid empty success states for failed queries (date/report tests; browser error-state check pending).
- [x] Align public form validation/lengths and server trimming; prevent public source spoofing (validation/DTO tests).
- [x] Invalidate affected dashboards, lists, details and reports after enquiry/admission mutations (source-reviewed).
- [x] Execute regression tests, frontend/backend typechecks and production builds.
- [x] Smoke-test all 15 public/login routes against a temporary production server.
- [x] Inspect PostgreSQL metadata read-only and record unapplied Learning Photos migration.

## Missing or incomplete functionality

- [ ] Lead archive/restore, bulk assignment/update, validated import and audited merge.
- [ ] Lead profile with full event history and accessible lead Kanban.
- [ ] Reviewed configurable pipeline/status compatibility and protected transitions.
- [ ] Consent, enquiry-event persistence, duplicate review and campaign attribution.
- [ ] Assigned-only access and granular role/permission management.
- [ ] Time-aware follow-up tasks with lifecycle, priorities and durable scheduled reminders.
- [ ] Visit calendar, managed slots, concurrent booking safety and visit outcomes.
- [ ] Year-specific applications, document checklist, review/approval and separate enrolment.
- [ ] Reuse/link existing guardians for siblings and reliable identity review.
- [ ] Durable per-user notifications, read/unread, links and idempotency.
- [ ] Parent email templates, consent/opt-out, outbox retries and true delivery events.
- [ ] Official configured WhatsApp templates and delivery webhook integration; preserve click-to-chat.
- [ ] Campaign management and actual Meta/Google ingestion (pending, not simulated).
- [ ] All twelve requested report types, year/class/staff/date filters, Excel and permission checks.
- [ ] CRM stages/sources/priorities/assignment/templates/reminder settings.
- [ ] Review/apply the existing Learning Photos migration separately; add CRM integrity migrations and verify backup/recovery (current drift inspection completed read-only).
- [ ] Dedicated test PostgreSQL and all nine end-to-end scenarios from the master prompt.
- [ ] Real login, CMS and all public-page/browser regression verification.
- [ ] Production deployment/provider/consent/retention review with the school's configuration.

No unchecked item is covered by a completion claim. No database migration has been applied.
