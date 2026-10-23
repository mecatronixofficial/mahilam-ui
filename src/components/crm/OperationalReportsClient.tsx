"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { formatDate, formatMoney, humanize } from "@/lib/media";
import { canManageAdmissions, isAdminRole, useAuth } from "@/store/auth";
import { QueryState } from "@/components/states/QueryState";
import type { PageMeta } from "@/components/dashboard/useCrud";
import { LEAD_STAGES, Pagination, queryString, useLookup } from "./crm-shared";
import { ADMISSION_STATUSES, ENQUIRY_SOURCES } from "./constants";
const COMMON = [["enquiries", "Enquiries"], ["sources", "Enquiry sources"], ["follow-ups", "Follow-ups"], ["counsellors", "Counsellor performance"], ["visits", "School visits"], ["admissions", "Admissions"], ["conversion", "Admission conversion"], ["lost", "Lost enquiries"]];
const SCHOOL = [["students", "Student enrollments"], ["academic-years", "Academic years"], ["attendance", "Attendance"]];
const FINANCE = [["fees", "Fee invoices"], ["payments", "Fee collections"], ["outstanding", "Outstanding payments"]];
type Row = Record<string, unknown>;
function display(value: unknown, key = ""): string {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(item => display(item)).join("; ") || "—";
  if (typeof value === "object") {
    const row = value as Row;
    if (row.name) return String(row.name);
    if (row.firstName) return [row.firstName, row.lastName].filter(Boolean).join(" ");
    if (row.label) return String(row.label) + (row.student ? " · " + display(row.student) : "");
    return Object.entries(row).filter(([k]) => k !== "id").map(([k, v]) => `${humanize(k)}: ${display(v, k)}`).join(" · ");
  }
  if (["amount", "paid", "discount", "fine", "originalAmount"].includes(key)) return formatMoney(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDate(value);
  return String(value);
}
export function OperationalReportsClient() {
  const user = useAuth(state => state.user);
  const admin = isAdminRole(user?.role), manager = canManageAdmissions(user?.role);
  const kinds = user?.role === "TEACHER" ? [["attendance", "Attendance"]] : user?.role === "ACCOUNTANT" ? [...FINANCE, ...SCHOOL.filter(([kind]) => kind !== "attendance")] : manager ? [...COMMON, ...SCHOOL, ...(admin ? FINANCE : [])] : COMMON;
  const [kind, setKind] = useState(kinds[0][0]), [page, setPage] = useState(1), [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "", academicYearId: "", program: "", classLevelId: "", assignedStaffId: "", source: "", status: "" });
  const years = useLookup("years"), classes = useLookup("classes"), staff = useLookup("staff", manager);
  useEffect(() => { const q = new URLSearchParams(window.location.search); const requested = q.get("kind"); if (requested && kinds.some(([name]) => name === requested)) setKind(requested); setFilters(previous => ({ ...previous, ...Object.fromEntries(Object.keys(previous).filter(key => q.has(key)).map(key => [key, q.get(key)!])) })); }, []);
  const params = queryString({ ...filters, page, limit: 25 });
  const report = useQuery({ queryKey: ["crm", "report", kind, params, user?.id], queryFn: () => api<{ data: Row[]; meta?: PageMeta }>(`/crm/reports/${kind}?${params}`) });
  const rows = report.data?.data ?? [];
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))].filter(key => !["id", "studentId", "academicYearId", "classLevelId", "assignedStaffId", "enquiryId", "markedById", "updatedAt", "notes"].includes(key));
  const leadReport = COMMON.some(([name]) => name === kind);
  const statuses = kind === "admissions" ? ADMISSION_STATUSES : kind === "follow-ups" ? ["PENDING", "COMPLETED", "CANCELLED"] : kind === "visits" ? ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"] : kind === "enquiries" ? LEAD_STAGES : [];
  const change = (key: keyof typeof filters, value: string) => { setFilters({ ...filters, [key]: value }); setPage(1); };
  async function exportCsv() { setExporting(true); try { await downloadFile(`/crm/reports/${kind}/export?${queryString(filters)}`, `${kind}.csv`); toast.success("Report downloaded"); } catch (error) { toast.error(errorMessage(error)); } finally { setExporting(false); } }
  const canExport = manager || user?.role === "ACCOUNTANT" || user?.role === "TEACHER";
  return <section className="mb-6">
    <div className="panel mb-5 grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
      <label className="grid gap-1.5"><span className="label">Report</span><select className="input" value={kind} onChange={e => { setKind(e.target.value); setFilters({ ...filters, status: "", classLevelId: "", assignedStaffId: "", source: "" }); setPage(1); }}>{kinds.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="grid gap-1.5"><span className="label">From</span><input className="input" type="date" value={filters.from} onChange={e => change("from", e.target.value)} /></label>
      <label className="grid gap-1.5"><span className="label">To</span><input className="input" type="date" value={filters.to} onChange={e => change("to", e.target.value)} /></label>
      <label className="grid gap-1.5"><span className="label">Academic year</span><select className="input" value={filters.academicYearId} onChange={e => change("academicYearId", e.target.value)}><option value="">All years</option>{years.data?.data.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select></label>
      <label className="grid gap-1.5"><span className="label">Program</span><select className="input" value={filters.program} onChange={e => change("program", e.target.value)}><option value="">All programs</option>{[...new Set(classes.data?.data.map(c => c.name))].map(name => <option key={name}>{name}</option>)}</select></label>
      {kind === "attendance" && <label className="grid gap-1.5"><span className="label">Class</span><select className="input" value={filters.classLevelId} onChange={e => change("classLevelId", e.target.value)}><option value="">All classes</option>{classes.data?.data.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
      {manager && leadReport && <label className="grid gap-1.5"><span className="label">Counsellor</span><select className="input" value={filters.assignedStaffId} onChange={e => change("assignedStaffId", e.target.value)}><option value="">All permitted counsellors</option>{staff.data?.data.filter(s => s.active !== false).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
      {leadReport && <label className="grid gap-1.5"><span className="label">Lead source</span><select className="input" value={filters.source} onChange={e => change("source", e.target.value)}><option value="">All sources</option>{ENQUIRY_SOURCES.map(source => <option key={source}>{source}</option>)}</select></label>}
      {statuses.length > 0 && <label className="grid gap-1.5"><span className="label">Stage / status</span><select className="input" value={filters.status} onChange={e => change("status", e.target.value)}><option value="">All statuses</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>}
      {canExport && <button type="button" className="btn-soft self-end" disabled={exporting} onClick={exportCsv}>{exporting ? "Exporting…" : "Export CSV"}</button>}
    </div>
    <QueryState query={report} isEmpty={!rows.length} empty={{ title: "No records match these filters", description: "Choose a different report or date range." }}>
      <div className="panel overflow-x-auto"><table className="dash-table"><thead><tr>{columns.map(column => <th key={column}>{column === "_count" ? "Record counts" : humanize(column.replace(/([A-Z])/g, "_$1"))}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map((column, ci) => <td key={column} className="max-w-xs break-words">{ci === 0 && row.id && ["enquiries", "lost", "students", "admissions"].includes(kind) ? <Link className="font-bold underline-offset-4 hover:underline" href={`/crm/${kind === "lost" ? "enquiries" : kind}/${row.id}`}>{display(row[column], column)}</Link> : display(row[column], column)}</td>)}</tr>)}</tbody></table></div><Pagination meta={report.data?.meta} page={page} onPage={setPage} />
    </QueryState>
  </section>;
}
