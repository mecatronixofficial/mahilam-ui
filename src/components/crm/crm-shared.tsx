"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import type { PageMeta } from "@/components/dashboard/useCrud";

export type Lookup = { id: string; name?: string; firstName?: string; lastName?: string; studentName?: string; parentName?: string; enquiryNumber?: string; admissionNumber?: string; applicationNumber?: string; academicYearId?: string; current?: boolean; active?: boolean; startAt?: string; endAt?: string; capacity?: number; _count?: { visits: number }; enquiry?: { studentName: string }; sections?: Lookup[] };
export const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];
export const WORK_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"];
export const LEAD_STAGES = ["NEW_ENQUIRY", "CONTACTED", "QUALIFIED", "VISIT_SCHEDULED", "VISIT_COMPLETED", "APPLICATION_STARTED", "DOCUMENTS_PENDING", "APPLICATION_SUBMITTED", "APPROVED", "ENROLLED", "WAITLISTED", "REJECTED", "LOST"];
export const canonicalStage = (stage: string) => ({ NEW: "NEW_ENQUIRY", FOLLOW_UP: "CONTACTED", VISITED: "VISIT_COMPLETED", ADMISSION_CONFIRMED: "ENROLLED", NOT_INTERESTED: "LOST", CLOSED: "LOST" } as Record<string, string>)[stage] ?? stage;

export function queryString(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  return params.toString();
}

export function useCrmRefresh() {
  const client = useQueryClient();
  return () => { ["crm", "enquiries", "enquiry-detail", "admissions", "students", "dashboard-report", "reports-enquiries", "reports-admissions", "academic-years", "class-levels"].forEach(key => client.invalidateQueries({ queryKey: [key] })); };
}

export function useLookup(kind: string, enabled = true) {
  const user = useAuth(state => state.user);
  const paths: Record<string, string> = { enquiries: "/enquiries", staff: "/staff", students: "/students", years: "/academics/years", classes: "/academics/classes", slots: "/crm/visit-slots", visits: "/crm/visits", applications: "/admissions", guardians: "/crm/guardians?limit=200" };
  return useQuery({ queryKey: ["crm", "lookup", kind, user?.id], queryFn: async () => { const result = await api<{ data: Lookup[]; meta?: PageMeta }>(paths[kind]); if (result.meta) { const [path, query] = paths[kind].split("?"); const params = new URLSearchParams(query); for (let page = 2; page <= result.meta.pages; page++) { params.set("page", String(page)); const next = await api<{ data: Lookup[] }>(`${path}?${params}`); result.data.push(...next.data); } } return result; }, enabled: enabled && Boolean(user) && Boolean(paths[kind]) });
}

export function lookupLabel(row: Lookup) {
  return row.name ?? (row.enquiry ? [row.enquiry.studentName, row.startAt?.slice(0,10)].filter(Boolean).join(" · ") : undefined) ?? [row.enquiryNumber ?? row.admissionNumber ?? row.applicationNumber, row.studentName ?? [row.firstName, row.lastName].filter(Boolean).join(" ")].filter(Boolean).join(" · ");
}

export function Pagination({ meta, page, onPage }: { meta?: PageMeta; page: number; onPage: (page: number) => void }) {
  if (!meta) return null;
  return <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><span className="text-little-neutral-500">{meta.total} records · Page {page} of {Math.max(1, meta.pages)}</span><div className="flex gap-2"><button type="button" className="btn-soft !py-2" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button><button type="button" className="btn-soft !py-2" disabled={page >= meta.pages} onClick={() => onPage(page + 1)}>Next</button></div></div>;
}
