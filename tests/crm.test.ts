import { test } from "node:test";
import assert from "node:assert/strict";
import { safeLoginDestination } from "../src/lib/login-destination";
import { schoolDate, schoolMonthStart } from "../src/lib/school-date";
import { formatDate, toDateInput } from "../src/lib/media";
import { validatePublicEnquiry } from "../src/lib/enquiry-validation";

test("login return URLs reject external origins, backslashes, controls and login loops", () => {
  for (const value of [null, "https://evil.example", "//evil.example", "/\\evil.example", "/\tevil.example", "/%2fevil.example", "/%5cevil.example", "/login", "/login?next=/crm", "/crm/../../login", "/LOGIN/", "/crm/..//evil.example", "/%2e%2e//evil.example"]) assert.equal(safeLoginDestination(value), "/crm", String(value));
  for (const value of ["/admin", "/crm/enquiries?page=2", "/crm/admissions#application"]) assert.equal(safeLoginDestination(value), value);
});

test("school dates cross midnight and year boundaries independently of host timezone", () => {
  assert.equal(schoolDate("2026-10-16T18:29:59Z"), "2026-10-16");
  assert.equal(schoolDate("2026-10-16T18:30:00Z"), "2026-10-17");
  assert.equal(toDateInput("2026-12-31T18:30:00Z"), "2027-01-01");
  assert.equal(toDateInput("2026-10-17"), "2026-10-17");
  assert.equal(formatDate("2026-10-16T18:30:00Z", { day: "2-digit", month: "2-digit", year: "numeric" }), "17/10/2026");
  assert.equal(schoolDate("invalid"), "");
  assert.equal(schoolMonthStart(3, new Date("2026-12-31T18:30:00Z")), "2026-11-01");
  assert.equal(schoolMonthStart(6, new Date("2026-10-16T23:00:00Z")), "2026-05-01");
});

const enquiry = { parentName: " Test Parent ", studentName: " Test Child ", phone: "+91 98765 43210", email: " parent@example.com ", interestedClass: "Pre-KG", message: "Hello" };
test("public enquiries accept formatted Indian and international phones and optional email", () => {
  for (const phone of ["98765 43210", "+91 98765 43210", "+44 20 7946 0958", "0421-2345678"]) assert.deepEqual(validatePublicEnquiry({ ...enquiry, phone }), {});
  assert.deepEqual(validatePublicEnquiry({ ...enquiry, email: " " }), {});
});
test("public enquiries reject empty names, excessive input and malformed phone/email", () => {
  for (const phone of ["-------", "+ + 91 9876543210", "123", "1234567890123456", "abc9876543210"]) assert.ok(validatePublicEnquiry({ ...enquiry, phone }).phone, phone);
  assert.ok(validatePublicEnquiry({ ...enquiry, parentName: "  " }).parentName);
  assert.ok(validatePublicEnquiry({ ...enquiry, studentName: "a".repeat(81) }).studentName);
  assert.ok(validatePublicEnquiry({ ...enquiry, email: "bad@@example.com" }).email);
  assert.ok(validatePublicEnquiry({ ...enquiry, message: "a".repeat(2001) }).message);
});

import { schoolDateTimeInput, schoolDateTimeIso } from "../src/lib/school-date";
import { canAccessPage, canManageAdmissions, canUseCms, defaultWorkspace } from "../src/store/auth";
test("CRM date-time fields persist India-local instants and reject impossible calendar values", () => {
  assert.equal(schoolDateTimeIso("2026-10-22T09:30"), "2026-10-22T04:00:00.000Z");
  assert.equal(schoolDateTimeInput("2026-12-31T19:00:00Z"), "2027-01-01T00:30");
  for (const value of ["", "2026-02-31T10:00", "2026-10-22T24:00", "2026-10-22T10:99"]) assert.throws(() => schoolDateTimeIso(value));
});
test("workspace navigation matches school roles and hides unauthorized records", () => {
  assert.equal(defaultWorkspace("TEACHER"), "/crm/attendance");
  assert.equal(defaultWorkspace("ACCOUNTANT"), "/crm/fees");
  assert.equal(defaultWorkspace("CMS_EDITOR"), "/admin");
  assert.equal(canManageAdmissions("COUNSELLOR"), false);
  assert.equal(canManageAdmissions("ADMISSION_MANAGER"), true);
  assert.equal(canUseCms("CMS_EDITOR"), true);
  assert.equal(canAccessPage("COUNSELLOR", "/crm/students/child"), false);
  assert.equal(canAccessPage("COUNSELLOR", "/crm/fees"), false);
  assert.equal(canAccessPage("COUNSELLOR", "/crm/enquiries/lead"), true);
  assert.equal(canAccessPage("ACCOUNTANT", "/crm/admissions"), false);
  assert.equal(canAccessPage("TEACHER", "/crm/attendance"), true);
  assert.equal(canAccessPage("CMS_EDITOR", "/admin/activity"), false);
  assert.equal(canAccessPage("CMS_EDITOR", "/crm/account"), true);
});
