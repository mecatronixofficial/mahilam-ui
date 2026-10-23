"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarDays, Check, LoaderCircle, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { formatDate, humanize } from "@/lib/media";
import { schoolDate, schoolDateTimeInput, schoolDateTimeIso } from "@/lib/school-date";
import { canManageAdmissions, useAuth } from "@/store/auth";
import { Drawer } from "@/components/dashboard/Drawer";
import { ListToolbar } from "@/components/dashboard/ui";
import type { PageMeta } from "@/components/dashboard/useCrud";
import { QueryState } from "@/components/states/QueryState";
import { InlineNotice } from "@/components/states/StateView";
import { lookupLabel, Pagination, PRIORITIES, queryString, useCrmRefresh, useLookup, WORK_STATUSES } from "./crm-shared";

export type Operation = "follow-ups" | "visits" | "tasks" | "guardians" | "templates" | "communications";
type Row = { id: string } & Record<string, unknown>;
type Field = { name: string; label: string; type?: string; required?: boolean; lookup?: string; options?: readonly string[]; editingOnly?: boolean };
const definitions: Record<Operation, { label: string; fields: Field[]; statuses?: string[]; date?: string }> = {
  "follow-ups": { label: "Follow-up", statuses: WORK_STATUSES, date: "dueAt", fields: [
    { name: "enquiryId", label: "Enquiry", lookup: "enquiries", required: true }, { name: "assignedStaffId", label: "Assigned staff", lookup: "staff", required: true },
    { name: "dueAt", label: "Due at (Asia/Kolkata)", type: "datetime-local", required: true }, { name: "method", label: "Method", options: ["CALL", "WHATSAPP", "EMAIL", "IN_PERSON"], required: true },
    { name: "priority", label: "Priority", options: PRIORITIES }, { name: "notes", label: "Notes", type: "textarea" }, { name: "status", label: "Status", options: WORK_STATUSES, editingOnly: true }, { name: "outcome", label: "Outcome (required when completed)", type: "textarea", editingOnly: true },
  ] },
  visits: { label: "School visit", statuses: ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"], date: "startAt", fields: [
    { name: "enquiryId", label: "Enquiry", lookup: "enquiries", required: true }, { name: "assignedStaffId", label: "Assigned staff", lookup: "staff", required: true }, { name: "slotId", label: "Configured visit slot", lookup: "slots" },
    { name: "startAt", label: "Starts (Asia/Kolkata)", type: "datetime-local", required: true }, { name: "endAt", label: "Ends (Asia/Kolkata)", type: "datetime-local", required: true },
    { name: "status", label: "Status", options: ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"], editingOnly: true }, { name: "feedback", label: "Visit feedback", type: "textarea" },
  ] },
  tasks: { label: "Task", statuses: WORK_STATUSES, date: "dueAt", fields: [
    { name: "title", label: "Title", required: true }, { name: "assignedStaffId", label: "Assigned staff", lookup: "staff", required: true },
    { name: "dueAt", label: "Due at (Asia/Kolkata)", type: "datetime-local", required: true }, { name: "priority", label: "Priority", options: PRIORITIES },
    { name: "enquiryId", label: "Linked enquiry", lookup: "enquiries" }, { name: "admissionId", label: "Linked application", lookup: "applications" },
    { name: "studentId", label: "Linked student", lookup: "students" }, { name: "visitId", label: "Linked school visit", lookup: "visits" },
    { name: "notes", label: "Notes", type: "textarea" }, { name: "status", label: "Status", options: WORK_STATUSES, editingOnly: true },
  ] },
  guardians: { label: "Guardian", fields: [
    { name: "name", label: "Name", required: true }, { name: "relationship", label: "Relationship", required: true }, { name: "mobile", label: "Mobile", type: "tel", required: true },
    { name: "whatsapp", label: "WhatsApp", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "occupation", label: "Occupation" }, { name: "address", label: "Address", type: "textarea" },
    { name: "consent", label: "Consent for storing family contact details", type: "checkbox" },
  ] },
  templates: { label: "Message template", fields: [
    { name: "name", label: "Template name", required: true }, { name: "channel", label: "Channel", options: ["EMAIL", "WHATSAPP", "SMS", "CALL", "IN_PERSON"], required: true },
    { name: "subject", label: "Subject" }, { name: "body", label: "Message", type: "textarea", required: true }, { name: "active", label: "Active", type: "checkbox" },
  ] },
  communications: { label: "Communication record", fields: [
    { name: "enquiryId", label: "Enquiry", lookup: "enquiries", required: true }, { name: "channel", label: "Channel", options: ["EMAIL", "WHATSAPP", "SMS", "CALL", "IN_PERSON"], required: true },
    { name: "subject", label: "Subject" }, { name: "body", label: "Message or conversation", type: "textarea", required: true }, { name: "outcome", label: "Outcome", type: "textarea" },
  ] },
};

export function CrmOperationsClient({ resource, enquiryId, readOnly: externalReadOnly = false }: { resource: Operation; enquiryId?: string; readOnly?: boolean }) {
  const manager = canManageAdmissions(useAuth(state => state.user?.role));
  const base = definitions[resource];
  const spec = { ...base, fields: base.fields.filter(field => field.name !== "studentId" || manager) };
  const user = useAuth(state => state.user);

  const readOnly = externalReadOnly || resource === "guardians" && !manager;
  const refresh = useCrmRefresh();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState("");
  const [context, setContext] = useState({ academicYearId: "", assignedStaffId: "", program: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  useEffect(() => { const q = new URLSearchParams(window.location.search); setStatus(q.get("status") ?? ""); setView(q.get("view") ?? ""); setContext(previous => ({ ...previous, ...Object.fromEntries(Object.keys(previous).filter(key => q.has(key)).map(key => [key, q.get(key)!])) })); }, []);
  const [calendar, setCalendar] = useState(false);
  const [month, setMonth] = useState(schoolDate().slice(0, 7));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const needs = (kind: string) => spec.fields.some(f => f.lookup === kind);
  const enquiries = useLookup("enquiries", needs("enquiries"));
  const staff = useLookup("staff", needs("staff"));
  const slots = useLookup("slots", needs("slots"));
  const applications = useLookup("applications", needs("applications"));
  const students = useLookup("students", needs("students"));
  const visits = useLookup("visits", needs("visits"));
  const defaults = useQuery({ queryKey: ["crm", "defaults"], queryFn: () => api<{ data: { followUpDefaultDays: number } }>("/crm/defaults"), enabled: resource === "follow-ups" });
  const lookups = { enquiries, staff, slots, applications, students, visits };
  const lookupFailures = Object.entries(lookups).filter(([kind, query]) => needs(kind) && query.isError);
  const [year, monthNumber] = month.split("-").map(Number);
  const monthEnd = new Date(Date.UTC(year, monthNumber, 0)).toISOString().slice(0, 10);
  const params = queryString({ ...context, search, status, view: calendar ? undefined : view, enquiryId, page: calendar ? 1 : page, limit: calendar ? 200 : 25, from: calendar ? `${month}-01` : context.from, to: calendar ? monthEnd : context.to });
  const list = useQuery({ queryKey: ["crm", resource, params, user?.id], queryFn: async () => {
    const first = await api<{ data: Row[]; meta?: PageMeta }>(`/crm/${resource}?${params}`);
    if (calendar && first.meta) {
      for (let next = 2; next <= first.meta.pages; next++) {
        const result = await api<{ data: Row[] }>(`/crm/${resource}?${params.replace(/page=\d+/, `page=${next}`)}`);
        first.data.push(...result.data);
      }
      first.meta = undefined;
    }
    return first;
  } });
  const save = useMutation({ mutationFn: ({ id, payload }: { id?: string; payload: object }) => api(`/crm/${resource}${id ? `/${id}` : ""}`, { method: id ? "PATCH" : "POST", body: JSON.stringify(payload) }), onSuccess: () => { refresh(); setOpen(false); toast.success(`${spec.label} saved`); }, onError: error => toast.error(errorMessage(error)) });

  function start(row?: Row, nextStatus?: string) {
    setEditing(row ?? null);
    const values: Record<string, string | boolean> = {};
    spec.fields.forEach(field => {
      const value = row?.[field.name];
      values[field.name] = field.type === "checkbox" ? field.name === "consent" ? Boolean(row?.consentAt) : value === undefined ? true : Boolean(value) : field.type === "datetime-local" ? schoolDateTimeInput(value as string | undefined) : String(value ?? (field.name === "assignedStaffId" ? user?.id ?? "" : field.name === "enquiryId" ? enquiryId ?? "" : field.name === "priority" ? "NORMAL" : field.options?.[0] ?? ""));
    });
    if (!row && resource === "follow-ups") values.dueAt = schoolDateTimeInput(new Date(Date.now() + (defaults.data?.data.followUpDefaultDays ?? 1) * 86400000).toISOString());
    if (nextStatus) values.status = nextStatus;
    setForm(values); setOpen(true);
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const payload: Record<string, unknown> = {};
      spec.fields.filter(f => editing || !f.editingOnly).forEach(field => {
        const value = form[field.name];
        if (field.type === "checkbox") payload[field.name] = Boolean(value);
        else if (field.type === "datetime-local") { if (value) payload[field.name] = schoolDateTimeIso(String(value)); }
        else if (value !== "" && value !== undefined) payload[field.name] = String(value).trim();
        else if (editing && !field.required && !field.options) payload[field.name] = null;
      });
      save.mutate({ id: editing?.id, payload });
    } catch (error) { toast.error(errorMessage(error)); }
  }
  const rows = list.data?.data ?? [];
  const label = (row: Row) => String(row.title ?? row.name ?? (row.enquiry as { studentName?: string } | undefined)?.studentName ?? row.subject ?? row.channel ?? spec.label);
  const date = (row: Row) => String(row[spec.date ?? "createdAt"] ?? "");
  const cards = (items: Row[]) => items.map(row => <article key={row.id} className="panel min-w-0 p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-extrabold">{label(row)}</h3><p className="mt-1 text-xs text-little-neutral-500">{date(row) && formatDate(date(row), { dateStyle: "medium", timeStyle: "short" })}{row.status ? ` · ${humanize(String(row.status))}` : ""}</p></div>{!readOnly && resource !== "communications" && (resource !== "templates" || manager) && <button type="button" onClick={() => start(row)} className="btn-soft !p-2" aria-label={`Edit ${label(row)}`}><Pencil className="h-4 w-4" /></button>}</div>
    {row.priority ? <p className="mt-2 text-xs font-bold">{humanize(String(row.priority))} priority</p> : null}
    {row.assignedStaff ? <p className="mt-2 text-xs text-little-neutral-500">Assigned to {String((row.assignedStaff as { name: string }).name)}</p> : null}
    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-little-neutral-600">{String(row.notes ?? row.feedback ?? row.body ?? row.mobile ?? "")}</p>
    {row.outcome ? <p className="mt-2 text-sm"><strong>Outcome:</strong> {String(row.outcome)}</p> : null}
    <div className="mt-3 flex flex-wrap gap-2">
      {row.enquiryId ? <Link href={`/crm/enquiries/${row.enquiryId}`} className="btn-soft !px-3 !py-1.5 text-xs">Open enquiry</Link> : null}
      {resource === "guardians" && <Link href={`/crm/guardians/${row.id}`} className="btn-soft !px-3 !py-1.5 text-xs">Details & student links</Link>}
      {!readOnly && row.status === "PENDING" && <><button type="button" onClick={() => start(row, "COMPLETED")} className="btn-soft !px-3 !py-1.5 text-xs"><Check className="h-3 w-3" />Complete</button><button type="button" disabled={save.isPending} onClick={() => save.mutate({ id: row.id, payload: { status: "CANCELLED" } })} className="btn-soft !px-3 !py-1.5 text-xs"><X className="h-3 w-3" />Cancel</button></>}
    </div>
  </article>);

  return <>
    {resource === "communications" && <div className="mb-4"><InlineNotice variant="partial">Records document conversations and messages. Delivery is not verified by a messaging provider.</InlineNotice></div>}
    {lookupFailures.length > 0 && <div className="mb-4"><InlineNotice variant="error" onRetry={() => lookupFailures.forEach(([, q]) => q.refetch())}>Some selection lists could not be loaded. Retry before creating or editing a record.</InlineNotice></div>}
    <ListToolbar search={search} onSearch={value => { setSearch(value); setPage(1); }} placeholder={`Search ${resource}…`} count={list.data?.meta?.total ?? rows.length} actions={<div className="flex flex-wrap gap-2">{spec.date && <button type="button" className="btn-soft !p-2.5" onClick={() => setCalendar(value => !value)} aria-pressed={calendar}><CalendarDays className="h-4 w-4" /><span className="sr-only">Toggle calendar</span></button>}{!readOnly && (resource !== "templates" || manager) && <button type="button" className="btn-primary !px-4 !py-2" onClick={() => start()}><Plus className="h-4 w-4" />New {spec.label.toLowerCase()}</button>}</div>} />
    <div className="mb-4 flex flex-wrap gap-3">{spec.statuses && <select aria-label="Status filter" className="input !w-auto" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{spec.statuses.map(value => <option key={value}>{value}</option>)}</select>}{spec.date && !calendar && <select aria-label="Due date filter" className="input !w-auto" value={view} onChange={e => { setView(e.target.value); setPage(1); }}><option value="">All dates</option>{["TODAY", "UPCOMING", "OVERDUE"].map(value => <option key={value}>{value}</option>)}</select>}{calendar && <label className="flex items-center gap-2 text-sm font-bold">Month<input type="month" className="input !w-auto" value={month} onChange={e => { if (e.target.value) setMonth(e.target.value); }} /></label>}</div>
    <QueryState query={list} isEmpty={rows.length === 0} empty={{ title: `No ${resource} found`, description: "Change the filters or create a record to get started." }}>
      {calendar ? <div className="panel overflow-x-auto p-3"><div className="grid min-w-[720px] grid-cols-7 gap-2">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <p key={day} className="p-2 text-center text-xs font-bold">{day}</p>)}{Array.from({ length: new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() }, (_, i) => <div key={`blank-${i}`} />)}{Array.from({ length: Number(monthEnd.slice(-2)) }, (_, i) => { const day = `${month}-${String(i + 1).padStart(2, "0")}`; return <div key={day} className="min-h-28 rounded-xl border bg-white/60 p-2"><p className="mb-2 text-xs font-bold">{i + 1}</p>{rows.filter(row => schoolDate(date(row)) === day).map(row => <button type="button" key={row.id} className="mb-1 w-full rounded-lg bg-little-green-50 p-2 text-left text-xs font-bold" disabled={readOnly} onClick={() => start(row)}>{label(row)}</button>)}</div>; })}</div></div> : <div className="grid gap-3 lg:grid-cols-2">{cards(rows)}</div>}
      {!calendar && <Pagination meta={list.data?.meta} page={page} onPage={setPage} />}
    </QueryState>
    <Drawer open={open} onClose={() => setOpen(false)} title={`${editing ? "Edit" : "New"} ${spec.label.toLowerCase()}`} eyebrow="School operations">
      <form onSubmit={submit} className="grid gap-4">
        {spec.fields.filter(f => editing || !f.editingOnly).map(field => {
          const query = field.lookup ? lookups[field.lookup as keyof typeof lookups] : undefined;
          const options = query?.data?.data.filter(row => row.active !== false) ?? [];
          return <label key={field.name} className="grid gap-1.5"><span className="label">{field.label}{field.required ? " *" : ""}</span>{field.type === "checkbox" ? <input type="checkbox" className="h-5 w-5 accent-green-700" checked={Boolean(form[field.name])} onChange={e => setForm({ ...form, [field.name]: e.target.checked })} /> : field.type === "textarea" ? <textarea className="input min-h-24" required={field.required || field.name === "outcome" && form.status === "COMPLETED"} maxLength={4000} value={String(form[field.name] ?? "")} onChange={e => setForm({ ...form, [field.name]: e.target.value })} /> : field.options || field.lookup ? <select className="input" required={field.required} disabled={Boolean(editing && field.name === "enquiryId")} value={String(form[field.name] ?? "")} onChange={e => {
            const next = { ...form, [field.name]: e.target.value };
            if (field.name === "slotId") { const slot = options.find(row => row.id === e.target.value); if (slot) { next.startAt = schoolDateTimeInput(slot.startAt); next.endAt = schoolDateTimeInput(slot.endAt); } }
            setForm(next);
          }}><option value="">{query?.isPending ? "Loading…" : "Select…"}</option>{field.options?.map(value => <option key={value} value={value}>{humanize(value)}</option>)}{options.map(row => <option key={row.id} value={row.id}>{field.lookup === "slots" ? `${formatDate(row.startAt, { dateStyle: "medium", timeStyle: "short" })} · ${row._count?.visits ?? 0}/${row.capacity} booked` : lookupLabel(row)}</option>)}</select> : <input className="input" type={field.type ?? "text"} required={field.required} maxLength={field.type === "datetime-local" ? undefined : 500} value={String(form[field.name] ?? "")} onChange={e => setForm({ ...form, [field.name]: e.target.value })} />}</label>;
        })}
        <button className="btn-primary" disabled={save.isPending || lookupFailures.length > 0}>{save.isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}Save {spec.label.toLowerCase()}</button>
      </form>
    </Drawer>
  </>;
}
