"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlarmClock, ClipboardPlus, Download, History, LoaderCircle, MessageCircle, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { canManageAdmissions, useAuth, useIsAdmin } from "@/store/auth";
import { useCrud } from "@/components/dashboard/useCrud";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDelete, ListToolbar } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { TableSkeleton } from "@/components/states/Skeletons";
import { formatDate, humanize, toDateInput } from "@/lib/media";
import { lookupLabel, PRIORITIES, useLookup } from "./crm-shared";
import { schoolDateTimeInput, schoolDateTimeIso, schoolDate } from "@/lib/school-date";
import { InlineNotice } from "@/components/states/StateView";
import { CLASSES, ENQUIRY_SOURCES, ENQUIRY_STATUSES, STATUS_STYLES, whatsappLink } from "./constants";

type Enquiry = {
  id: string; enquiryNumber: string; parentName: string; studentName: string; studentDob?: string | null; phone: string; whatsapp?: string | null; email?: string | null;
  purpose?: string; academicYearId?: string; alternatePhone?: string; previousSchool?: string; preferredVisitAt?: string; priority?: string; lostReason?: string; archivedAt?: string;
  interestedClass: string; source: string; status: string; assignedStaffId?: string | null; nextFollowUpDate?: string | null; message?: string | null; notes?: string | null; createdAt?: string;
};
type Staff = { id: string; name: string };
type FollowUp = { id: string; contactMethod: string; staffName?: string | null; notes: string; result?: string | null; nextFollowUp?: string | null; createdAt: string };
type EnquiryDetail = Enquiry & { followUps: FollowUp[] };

const EMPTY_FORM = { parentName: "", studentName: "", studentDob: "", phone: "", whatsapp: "", email: "", interestedClass: "Pre-KG", source: "PHONE", status: "NEW", assignedStaffId: "", nextFollowUpDate: "", message: "", notes: "", academicYearId: "", alternatePhone: "", previousSchool: "", preferredVisitAt: "", priority: "NORMAL", lostReason: "", allowDuplicate: "false", duplicateReason: "" };
const FILTERS = [
  { value: "open", label: "Open" },
  { value: "due", label: "Follow-up due" },
  { value: "NEW", label: "New" },
  { value: "VISIT_SCHEDULED", label: "Visit scheduled" },
  { value: "ADMISSION_CONFIRMED", label: "Converted" },
] as const;
const CLOSED = new Set(["ADMISSION_CONFIRMED", "NOT_INTERESTED", "CLOSED", "ENROLLED", "LOST", "REJECTED"]);
const MANAGED = new Set(["ADMISSION_CONFIRMED", "ENROLLED", "APPROVED", "APPLICATION_SUBMITTED", "REJECTED"]);
const FOLLOW_UP_METHODS = ["PHONE", "WHATSAPP", "EMAIL", "IN_PERSON"] as const;

export function EnquiriesClient() {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const me = useAuth(state => state.user);
  const manager = canManageAdmissions(me?.role);
  const yearsQ = useLookup("years"), classesQ = useLookup("classes");
  const programs = classesQ.data?.data.some(c => c.active !== false) ? [...new Set(classesQ.data.data.filter(c => c.active !== false).map(c => c.name!))] : [...CLASSES];
  const [extra, setExtra] = useState({ purpose: "", academicYearId: "", interestedClass: "", assignedStaffId: "", from: "", to: "", archived: "false", sort: "createdAt", order: "desc" });
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkStaff, setBulkStaff] = useState("");
  const [bulkPending, setBulkPending] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("open");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ page: String(page), limit: "25" });
  Object.entries(extra).forEach(([key, value]) => { if (value) params.set(key, value); });
  useEffect(() => { const q = new URLSearchParams(window.location.search); if (q.get("status")) setFilter(q.get("status")!); else if (q.get("all")) setFilter(""); else if (q.get("followUpDue") === "true") setFilter("due"); setExtra(previous => ({ ...previous, ...Object.fromEntries(["purpose", "academicYearId", "interestedClass", "assignedStaffId", "from", "to"].filter(key => q.has(key)).map(key => [key, q.get(key)!])) })); }, []);
  if (search.trim()) params.set("search", search.trim());
  if (source) params.set("source", source);
  if (filter === "open") params.set("openOnly", "true");
  else if (filter === "due") params.set("followUpDue", "true");
  else if (filter) params.set("status", filter);
  const crud = useCrud<Enquiry>("/enquiries", "Enquiry", { listPath: `/enquiries?${params}`, queryKey: ["enquiries", "list", params.toString()], invalidateKey: ["enquiries"], invalidate: [["crm"], ["dashboard-report"], ["reports-enquiries"], ["enquiry-detail"]] });
  useEffect(() => { if (crud.meta && page > Math.max(1, crud.meta.pages)) setPage(Math.max(1, crud.meta.pages)); }, [crud.meta, page]);
  const staffQ = useQuery({ queryKey: ["staff"], queryFn: () => api<{ data: Staff[] }>("/staff") });
  const staff = staffQ.data?.data ?? [];
  const staffName = (id?: string | null) => staff.find((s) => s.id === id)?.name;

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (new URLSearchParams(window.location.search).get("new") === "true") setOpen(true); }, []);
  const [exporting, setExporting] = useState(false);
  const [following, setFollowing] = useState<Enquiry | null>(null);
  const [followForm, setFollowForm] = useState({ contactMethod: "PHONE", notes: "", result: "", nextFollowUp: "", status: "CONTACTED" });
  const detailQ = useQuery({
    queryKey: ["enquiry-detail", following?.id],
    queryFn: () => api<{ data: EnquiryDetail }>(`/enquiries/${following!.id}`),
    enabled: Boolean(following),
  });
  const addFollowUp = useMutation({
    mutationFn: () => api(`/enquiries/${following!.id}/follow-ups`, { method: "POST", body: JSON.stringify({ ...followForm, status: following && MANAGED.has(following.status) ? undefined : followForm.status, result: followForm.result.trim() || null, nextFollowUp: followForm.nextFollowUp || null }) }),
    onSuccess: () => {
      toast.success("Follow-up recorded");
      setFollowForm({ contactMethod: "PHONE", notes: "", result: "", nextFollowUp: "", status: "CONTACTED" });
      detailQ.refetch();
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: ["dashboard-report"] });
      qc.invalidateQueries({ queryKey: ["reports-enquiries"] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const removeFollowUp = useMutation({
    mutationFn: (id: string) => api(`/enquiries/${following!.id}/follow-ups/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Contact entry archived"); detailQ.refetch(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const convert = useMutation({
    mutationFn: async (row: Enquiry) => {
      await api("/admissions", { method: "POST", body: JSON.stringify({ studentName: row.studentName, className: row.interestedClass || "Pre-KG", enquiryId: row.id, status: "APPLICATION" }) });
    },
    onSuccess: () => { toast.success("Application started", { description: "Continue it on the Admissions page." }); ["enquiries", "admissions", "dashboard-report", "reports-enquiries", "reports-admissions"].forEach((key) => qc.invalidateQueries({ queryKey: [key] })); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  function close() { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }
  function startCreate() { setEditingId(null); setForm(EMPTY_FORM); setOpen(true); }
  function startEdit(row: Enquiry) {
    setEditingId(row.id);
    setForm({ ...EMPTY_FORM, academicYearId: row.academicYearId ?? "", alternatePhone: row.alternatePhone ?? "", previousSchool: row.previousSchool ?? "", preferredVisitAt: schoolDateTimeInput(row.preferredVisitAt), priority: row.priority ?? "NORMAL", lostReason: row.lostReason ?? "", parentName: row.parentName || "", studentName: row.studentName || "", studentDob: toDateInput(row.studentDob), phone: row.phone || "", whatsapp: row.whatsapp || "", email: row.email || "", interestedClass: row.interestedClass || "", source: row.source || "WEBSITE", status: row.status || "NEW", assignedStaffId: row.assignedStaffId || "", nextFollowUpDate: toDateInput(row.nextFollowUpDate), message: row.message || "", notes: row.notes || "" });
    setOpen(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      parentName: form.parentName.trim(), studentName: form.studentName.trim(), studentDob: form.studentDob || null, phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || null, email: form.email.trim() || null, interestedClass: form.interestedClass.trim(), source: form.source, status: MANAGED.has(form.status) ? undefined : form.status,
      academicYearId: form.academicYearId || null, alternatePhone: form.alternatePhone || null, previousSchool: form.previousSchool || null, preferredVisitAt: form.preferredVisitAt ? schoolDateTimeIso(form.preferredVisitAt) : null, priority: form.priority, lostReason: form.lostReason || null, allowDuplicate: form.allowDuplicate === "true", duplicateReason: form.duplicateReason || undefined,
      assignedStaffId: form.assignedStaffId || null, nextFollowUpDate: form.nextFollowUpDate || null, message: form.message.trim() || null, notes: form.notes.trim() || null,
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: close });
    else crud.create.mutate(payload, { onSuccess: close });
  }

  async function exportCsv() {
    setExporting(true);
    try { const exportParams = new URLSearchParams(params); ["page", "limit", "sort", "order"].forEach(key => exportParams.delete(key)); if (exportParams.has("interestedClass")) { exportParams.set("program", exportParams.get("interestedClass")!); exportParams.delete("interestedClass"); } await downloadFile(`/crm/reports/enquiries/export?${exportParams}`, "enquiries.csv"); toast.success("Export downloaded"); }
    catch (error) { toast.error(errorMessage(error, "Export failed")); }
    finally { setExporting(false); }
  }

  const today = schoolDate();
  const isDue = (row: Enquiry) => Boolean(row.nextFollowUpDate && toDateInput(row.nextFollowUpDate) <= today && !CLOSED.has(row.status));
  const rows = crud.rows;

  const set = (key: keyof typeof EMPTY_FORM) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: event.target.value });

  return (
    <>
      <ListToolbar
        search={search}
        onSearch={(value) => { setSearch(value); setPage(1); }}
        placeholder="Search name, phone, enquiry no…"
        filters={[...FILTERS]}
        filter={filter}
        onFilter={(value) => { setFilter(value); setPage(1); }}
        count={crud.meta?.total ?? rows.length}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Source" className="input !min-h-10 !w-auto !py-1.5 text-sm" value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}>
              <option value="">All sources</option>
              {ENQUIRY_SOURCES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
            </select>
            {manager && <button type="button" onClick={exportCsv} disabled={exporting} className="btn-soft !px-3 !py-2 text-sm" title="Export CSV">{exporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}<span className="hidden sm:inline">Export</span></button>}
            <button type="button" onClick={startCreate} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />Add</button>
          </div>
        }
      />

      <div className="panel mb-4 grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-4"><select className="input" aria-label="Enquiry purpose" value={extra.purpose} onChange={e => { setExtra({ ...extra, purpose: e.target.value }); setPage(1); }}><option value="">Admissions & contact requests</option><option value="ADMISSION">Admission enquiries</option><option value="CONTACT">Contact / visit requests</option></select><select className="input" aria-label="Academic year filter" value={extra.academicYearId} onChange={e => { setExtra({ ...extra, academicYearId: e.target.value }); setPage(1); }}><option value="">All academic years</option>{yearsQ.data?.data.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select><select className="input" aria-label="Program filter" value={extra.interestedClass} onChange={e => { setExtra({ ...extra, interestedClass: e.target.value }); setPage(1); }}><option value="">All programs</option>{programs.map(p => <option key={p}>{p}</option>)}</select><select className="input" aria-label="Assigned staff filter" value={extra.assignedStaffId} onChange={e => { setExtra({ ...extra, assignedStaffId: e.target.value }); setPage(1); }}><option value="">All permitted staff</option>{staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><select className="input" aria-label="Archive filter" value={extra.archived} onChange={e => { setExtra({ ...extra, archived: e.target.value }); setPage(1); }}><option value="false">Current enquiries</option><option value="true">Archived enquiries</option></select><label className="grid gap-1 text-xs font-bold">From<input className="input" type="date" value={extra.from} onChange={e => { setExtra({ ...extra, from: e.target.value }); setPage(1); }} /></label><label className="grid gap-1 text-xs font-bold">To<input className="input" type="date" value={extra.to} onChange={e => { setExtra({ ...extra, to: e.target.value }); setPage(1); }} /></label><select className="input" aria-label="Sort by" value={extra.sort} onChange={e => setExtra({ ...extra, sort: e.target.value })}>{["createdAt", "updatedAt", "parentName", "studentName", "nextFollowUpDate"].map(value => <option key={value}>{value}</option>)}</select><select className="input" aria-label="Sort direction" value={extra.order} onChange={e => setExtra({ ...extra, order: e.target.value })}><option value="desc">Descending</option><option value="asc">Ascending</option></select></div>
      {manager && <div className="mb-4 flex flex-wrap items-center gap-2"><select className="input !w-auto" aria-label="Bulk assignment staff" value={bulkStaff} onChange={e => setBulkStaff(e.target.value)}><option value="">Assign selected to…</option>{staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><button type="button" className="btn-soft" disabled={!selected.length || !bulkStaff || bulkPending} onClick={async () => { setBulkPending(true); try { await api("/enquiries/bulk-assignment", { method: "PATCH", body: JSON.stringify({ ids: selected, assignedStaffId: bulkStaff }) }); toast.success("Enquiries assigned"); setSelected([]); qc.invalidateQueries({ queryKey: ["enquiries"] }); qc.invalidateQueries({ queryKey: ["crm"] }); } catch (error) { toast.error(errorMessage(error)); } finally { setBulkPending(false); } }}>Assign {selected.length} selected</button></div>}
      <QueryState query={crud.list} loading={<TableSkeleton cols={7} />} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No enquiries match", description: "Try another filter or search." } : { title: "No enquiries yet", description: "Website enquiries arrive here automatically. You can also add phone and walk-in enquiries.", action: { label: "Add enquiry", onClick: startCreate } }}>
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead><tr>{["Family", "Class", "Contact", "Assigned", "Follow-up", "Status", ""].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r) => {
                  const wa = whatsappLink(r.whatsapp || r.phone);
                  return (
                    <tr key={r.id} className={isDue(r) ? "bg-little-yellow-50/50" : ""}>
                      <td>
                        <div className="flex flex-wrap items-center gap-2">{manager && !r.archivedAt && <input type="checkbox" aria-label={`Select ${r.studentName}`} checked={selected.includes(r.id)} onChange={e => setSelected(e.target.checked ? [...selected, r.id] : selected.filter(id => id !== r.id))} />}<Link href={`/crm/enquiries/${r.id}`} className="font-extrabold underline-offset-4 hover:underline">{r.studentName}</Link>{r.purpose === "CONTACT" && <span className="chip bg-little-blue-50 text-little-blue-800">Contact request</span>}</div>
                        <div className="text-xs font-semibold text-little-neutral-500">{r.parentName} · <span className="text-little-neutral-500">{r.enquiryNumber}</span></div>
                        <div className="mt-0.5 text-[11px] font-bold text-little-neutral-500">{humanize(r.source)}{r.createdAt ? ` · ${formatDate(r.createdAt)}` : ""}</div>
                      </td>
                      <td className="whitespace-nowrap font-semibold">{r.interestedClass}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 font-semibold hover:bg-white" title="Call"><Phone className="h-3.5 w-3.5 text-little-neutral-500" />{r.phone}</a>
                          {wa && <a href={wa} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${r.parentName}`} className="rounded-lg p-1.5 text-[#1da851] hover:bg-little-green-50"><MessageCircle className="h-4 w-4" /></a>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-little-neutral-600">{staffName(r.assignedStaffId) || <span className="text-little-neutral-300">—</span>}</td>
                      <td className="whitespace-nowrap">{r.nextFollowUpDate ? <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isDue(r) ? "text-little-yellow-700" : "text-little-neutral-500"}`}>{isDue(r) && <AlarmClock className="h-3.5 w-3.5" />}{formatDate(r.nextFollowUpDate)}</span> : <span className="text-little-neutral-300">—</span>}</td>
                      <td>
                        <select aria-label="Status" className={`chip cursor-pointer border-0 outline-none ${STATUS_STYLES[r.status] || STATUS_STYLES.NEW}`} value={r.status} disabled={crud.patch.isPending || MANAGED.has(r.status) || Boolean(r.archivedAt)} onChange={(e) => crud.patch.mutate({ id: r.id, payload: { status: e.target.value } })}>
                          {ENQUIRY_STATUSES.map((x) => <option key={x} value={x} disabled={MANAGED.has(x) || x === "LOST"}>{humanize(x)}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          {!CLOSED.has(r.status) && r.status !== "APPLICATION_STARTED" && (
                            <button type="button" onClick={() => convert.mutate(r)} disabled={convert.isPending} title="Start admission application" className="rounded-lg p-2 text-little-neutral-500 hover:bg-white hover:text-little-green-700"><ClipboardPlus className="h-4 w-4" /></button>
                          )}
                          <button type="button" onClick={() => { setFollowing(r); setFollowForm((value) => ({ ...value, status: ["NEW", "NEW_ENQUIRY"].includes(r.status) ? "CONTACTED" : r.status })); }} aria-label={`Follow up with ${r.parentName}`} title="Follow-up history" className="rounded-lg p-2 text-little-neutral-500 hover:bg-white hover:text-little-yellow-700"><History className="h-4 w-4" /></button>
                          <button type="button" onClick={() => startEdit(r)} aria-label="Edit enquiry" className="rounded-lg p-2 text-little-neutral-500 hover:bg-white"><Pencil className="h-4 w-4" /></button>
                          {r.archivedAt && manager ? <button type="button" className="btn-soft !p-2 text-xs" onClick={() => api(`/enquiries/${r.id}/restore`, { method: "POST" }).then(() => { qc.invalidateQueries({ queryKey: ["enquiries"] }); qc.invalidateQueries({ queryKey: ["crm"] }); }).catch(e => toast.error(errorMessage(e)))}>Restore</button> : isAdmin && <ConfirmDelete label="Archive" compact pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </QueryState>

      {crud.meta && crud.meta.pages > 1 && <nav className="panel mt-4 flex items-center justify-between gap-3 p-3" aria-label="Enquiry pages">
        <button type="button" className="btn-soft !px-3 !py-2 text-sm" disabled={page <= 1 || crud.list.isFetching} onClick={() => setPage((value) => value - 1)}>Previous</button>
        <p role="status" className="text-sm font-bold text-little-neutral-500">Page {page} of {crud.meta.pages} · {crud.meta.total} enquiries</p>
        <button type="button" className="btn-soft !px-3 !py-2 text-sm" disabled={page >= crud.meta.pages || crud.list.isFetching} onClick={() => setPage((value) => value + 1)}>Next</button>
      </nav>}

      <Drawer open={open} onClose={close} eyebrow={editingId ? "Update family" : "New family"} title={editingId ? "Edit enquiry" : "Add an enquiry"}>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5"><span className="label">Parent name *</span><input className="input" value={form.parentName} onChange={set("parentName")} required /></label>
            <label className="grid gap-1.5"><span className="label">Child&apos;s name *</span><input className="input" value={form.studentName} onChange={set("studentName")} required /></label>
            <label className="grid gap-1.5"><span className="label">Phone *</span><input className="input" type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} required /></label>
            <label className="grid gap-1.5"><span className="label">WhatsApp</span><input className="input" type="tel" inputMode="tel" placeholder="Same as phone" value={form.whatsapp} onChange={set("whatsapp")} /></label>
            <label className="grid gap-1.5"><span className="label">Email</span><input className="input" type="email" value={form.email} onChange={set("email")} /></label>
            <label className="grid gap-1.5"><span className="label">Child&apos;s date of birth</span><input className="input" type="date" value={form.studentDob} onChange={set("studentDob")} /></label>
            <label className="grid gap-1.5"><span className="label">Interested class *</span>
              <select className="input" value={form.interestedClass} onChange={set("interestedClass")} required>
                {!CLASSES.includes(form.interestedClass as (typeof CLASSES)[number]) && form.interestedClass && <option value={form.interestedClass}>{form.interestedClass}</option>}
                {programs.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5"><span className="label">Source</span><select className="input" value={form.source} onChange={set("source")}>{ENQUIRY_SOURCES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Status</span><select className="input" value={form.status} disabled={MANAGED.has(form.status)} onChange={set("status")}>{ENQUIRY_STATUSES.map((x) => <option key={x} value={x} disabled={MANAGED.has(x) || x === "LOST"}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Assigned to</span><select className="input" value={form.assignedStaffId} onChange={set("assignedStaffId")}><option value="">Unassigned</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Academic year</span><select className="input" value={form.academicYearId} onChange={set("academicYearId")}><option value="">Current academic year</option>{yearsQ.data?.data.filter(y => y.active !== false).map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select></label><label className="grid gap-1.5"><span className="label">Priority</span><select className="input" value={form.priority} onChange={set("priority")}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></label><label className="grid gap-1.5"><span className="label">Alternate mobile</span><input className="input" type="tel" value={form.alternatePhone} onChange={set("alternatePhone")} /></label><label className="grid gap-1.5"><span className="label">Previous school</span><input className="input" maxLength={160} value={form.previousSchool} onChange={set("previousSchool")} /></label><label className="grid gap-1.5 sm:col-span-2"><span className="label">Preferred visit (Asia/Kolkata)</span><input className="input" type="datetime-local" value={form.preferredVisitAt} onChange={set("preferredVisitAt")} /></label>
            <label className="grid gap-1.5 sm:col-span-2"><span className="label">Next follow-up</span><input className="input" type="date" value={form.nextFollowUpDate} onChange={set("nextFollowUpDate")} /></label>
          </div>
          {!editingId && <div className="grid gap-2 rounded-xl border p-3"><label className="flex gap-2 text-sm"><input type="checkbox" checked={form.allowDuplicate === "true"} onChange={e => setForm({ ...form, allowDuplicate: String(e.target.checked) })} />This is a legitimate repeat enquiry for the same child and academic year</label>{form.allowDuplicate === "true" && <input className="input" aria-label="Reason for repeat enquiry" required minLength={2} maxLength={500} placeholder="Reason for repeat enquiry" value={form.duplicateReason} onChange={set("duplicateReason")} />}</div>}
          <label className="grid gap-1.5"><span className="label">Message from parent</span><textarea className="input min-h-20" value={form.message} onChange={set("message")} /></label>
          <label className="grid gap-1.5"><span className="label">Internal notes</span><textarea className="input min-h-20" placeholder="Only visible to staff" value={form.notes} onChange={set("notes")} /></label>
          <div className="sticky bottom-0 -mx-6 -mb-5 flex gap-3 border-t bg-white/80 px-6 py-4 backdrop-blur">
            <button className="btn-primary flex-1" disabled={crud.saving}>{crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{crud.saving ? "Saving…" : editingId ? "Save changes" : "Add enquiry"}</button>
            <button type="button" onClick={close} className="btn-soft">Cancel</button>
          </div>
        </form>
      </Drawer>

      <Drawer open={Boolean(following)} onClose={() => setFollowing(null)} eyebrow="Family follow-up" title={following ? `${following.parentName} · ${following.studentName}` : "Follow-up"}>
        <form onSubmit={(event) => { event.preventDefault(); addFollowUp.mutate(); }} className="grid gap-4 rounded-2xl border bg-white/60 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5"><span className="label">Contact method</span><select className="input" value={followForm.contactMethod} onChange={(e) => setFollowForm({ ...followForm, contactMethod: e.target.value })}>{FOLLOW_UP_METHODS.map((method) => <option key={method} value={method}>{humanize(method)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Move to stage</span><select className="input" value={followForm.status} disabled={Boolean(following && MANAGED.has(following.status))} onChange={(e) => setFollowForm({ ...followForm, status: e.target.value })}>{ENQUIRY_STATUSES.map((value) => <option key={value} value={value} disabled={value === "ADMISSION_CONFIRMED"}>{humanize(value)}</option>)}</select></label>
            <label className="grid gap-1.5 sm:col-span-2"><span className="label">Conversation notes *</span><textarea className="input min-h-20" value={followForm.notes} onChange={(e) => setFollowForm({ ...followForm, notes: e.target.value })} required minLength={2} /></label>
            <label className="grid gap-1.5"><span className="label">Result</span><input className="input" placeholder="Interested, callback requested…" value={followForm.result} onChange={(e) => setFollowForm({ ...followForm, result: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Next follow-up</span><input className="input" type="date" value={followForm.nextFollowUp} onChange={(e) => setFollowForm({ ...followForm, nextFollowUp: e.target.value })} /></label>
          </div>
          <button className="btn-primary w-fit" disabled={addFollowUp.isPending}>{addFollowUp.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Record follow-up</button>
        </form>
        <section className="mt-5">
          <h3 className="font-extrabold">Follow-up history</h3>
          {detailQ.isPending ? <div className="skeleton mt-3 h-24" /> : detailQ.isError ? <InlineNotice variant="error" onRetry={() => detailQ.refetch()}>Follow-up history could not be loaded. Please retry.</InlineNotice> : !(detailQ.data?.data.followUps?.length) ? <p className="mt-3 rounded-2xl bg-little-neutral-50 p-5 text-sm text-little-neutral-500">No follow-ups recorded yet.</p> : (
            <ol className="mt-3 grid gap-3">
              {detailQ.data.data.followUps.map((follow) => <li key={follow.id} className="rounded-2xl border bg-white/70 p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold">{humanize(follow.contactMethod)}{follow.result ? ` · ${follow.result}` : ""}</p><p className="text-xs font-semibold text-little-neutral-500">{formatDate(follow.createdAt)}{follow.staffName ? ` · ${follow.staffName}` : ""}</p></div>{isAdmin && <button type="button" onClick={() => removeFollowUp.mutate(follow.id)} aria-label="Archive follow-up" className="rounded-lg p-2 text-little-neutral-500 hover:bg-little-coral-50 hover:text-little-coral-600"><Trash2 className="h-4 w-4" /></button>}</div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-little-neutral-600">{follow.notes}</p>
                {follow.nextFollowUp && <p className="mt-2 text-xs font-bold text-little-yellow-700">Next: {formatDate(follow.nextFollowUp)}</p>}
              </li>)}
            </ol>
          )}
        </section>
      </Drawer>
    </>
  );
}
