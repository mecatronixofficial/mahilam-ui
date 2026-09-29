"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlarmClock, ClipboardPlus, Download, LoaderCircle, MessageCircle, Pencil, Phone, Plus } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { useIsAdmin } from "@/store/auth";
import { useCrud } from "@/components/dashboard/useCrud";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDelete, ListToolbar, matches } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { TableSkeleton } from "@/components/states/Skeletons";
import { formatDate, humanize, toDateInput } from "@/lib/media";
import { CLASSES, ENQUIRY_SOURCES, ENQUIRY_STATUSES, STATUS_STYLES, whatsappLink } from "./constants";

type Enquiry = {
  id: string; enquiryNumber: string; parentName: string; studentName: string; studentDob?: string | null; phone: string; whatsapp?: string | null; email?: string | null;
  interestedClass: string; source: string; status: string; assignedStaffId?: string | null; nextFollowUpDate?: string | null; message?: string | null; notes?: string | null; createdAt?: string;
};
type Staff = { id: string; name: string };

const EMPTY_FORM = { parentName: "", studentName: "", studentDob: "", phone: "", whatsapp: "", email: "", interestedClass: "Pre-KG", source: "PHONE", status: "NEW", assignedStaffId: "", nextFollowUpDate: "", message: "", notes: "" };
const FILTERS = [
  { value: "open", label: "Open" },
  { value: "due", label: "Follow-up due" },
  { value: "NEW", label: "New" },
  { value: "VISIT_SCHEDULED", label: "Visit scheduled" },
  { value: "ADMISSION_CONFIRMED", label: "Converted" },
] as const;
const CLOSED = new Set(["ADMISSION_CONFIRMED", "NOT_INTERESTED", "CLOSED"]);

export function EnquiriesClient() {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const crud = useCrud<Enquiry>("/enquiries", "Enquiry", { queryKey: ["enquiries"], invalidate: [["dashboard-report"]] });
  const staffQ = useQuery({ queryKey: ["staff"], queryFn: () => api<{ data: Staff[] }>("/staff") });
  const staff = staffQ.data?.data ?? [];
  const staffName = (id?: string | null) => staff.find((s) => s.id === id)?.name;

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("open");
  const [source, setSource] = useState("");
  const [exporting, setExporting] = useState(false);

  const convert = useMutation({
    mutationFn: async (row: Enquiry) => {
      await api("/admissions", { method: "POST", body: JSON.stringify({ studentName: row.studentName, className: row.interestedClass || "Pre-KG", enquiryId: row.id, status: "APPLICATION" }) });
      await api(`/enquiries/${row.id}`, { method: "PATCH", body: JSON.stringify({ status: "APPLICATION_STARTED" }) });
    },
    onSuccess: () => { toast.success("Application started", { description: "Continue it on the Admissions page." }); qc.invalidateQueries({ queryKey: ["enquiries"] }); qc.invalidateQueries({ queryKey: ["admissions"] }); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  function close() { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }
  function startCreate() { setEditingId(null); setForm(EMPTY_FORM); setOpen(true); }
  function startEdit(row: Enquiry) {
    setEditingId(row.id);
    setForm({ parentName: row.parentName || "", studentName: row.studentName || "", studentDob: toDateInput(row.studentDob), phone: row.phone || "", whatsapp: row.whatsapp || "", email: row.email || "", interestedClass: row.interestedClass || "", source: row.source || "WEBSITE", status: row.status || "NEW", assignedStaffId: row.assignedStaffId || "", nextFollowUpDate: toDateInput(row.nextFollowUpDate), message: row.message || "", notes: row.notes || "" });
    setOpen(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      parentName: form.parentName.trim(), studentName: form.studentName.trim(), studentDob: form.studentDob || null, phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || null, email: form.email.trim() || null, interestedClass: form.interestedClass.trim(), source: form.source, status: form.status,
      assignedStaffId: form.assignedStaffId || null, nextFollowUpDate: form.nextFollowUpDate || null, message: form.message.trim() || null, notes: form.notes.trim() || null,
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: close });
    else crud.create.mutate(payload, { onSuccess: close });
  }

  async function exportCsv() {
    setExporting(true);
    try { await downloadFile("/reports/export/enquiries.csv", "enquiries.csv"); toast.success("Export downloaded"); }
    catch (error) { toast.error(errorMessage(error, "Export failed")); }
    finally { setExporting(false); }
  }

  const today = new Date().toISOString().slice(0, 10);
  const isDue = (row: Enquiry) => Boolean(row.nextFollowUpDate && toDateInput(row.nextFollowUpDate) <= today && !CLOSED.has(row.status));
  const dueCount = crud.rows.filter(isDue).length;

  const rows = crud.rows.filter((row) => {
    const byFilter = filter === "open" ? !CLOSED.has(row.status) : filter === "due" ? isDue(row) : filter ? row.status === filter : true;
    return byFilter && (!source || row.source === source) && matches(search, row.enquiryNumber, row.parentName, row.studentName, row.phone, row.email, row.interestedClass);
  });

  const set = (key: keyof typeof EMPTY_FORM) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: event.target.value });

  return (
    <>
      <ListToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search name, phone, enquiry no…"
        filters={FILTERS.map((f) => (f.value === "due" && dueCount ? { ...f, label: `${f.label} (${dueCount})` } : f))}
        filter={filter}
        onFilter={setFilter}
        count={rows.length}
        actions={
          <div className="flex items-center gap-2">
            <select aria-label="Source" className="input !min-h-10 !w-auto !py-1.5 text-sm" value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">All sources</option>
              {ENQUIRY_SOURCES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
            </select>
            {isAdmin && <button type="button" onClick={exportCsv} disabled={exporting} className="btn-soft !px-3 !py-2 text-sm" title="Export CSV">{exporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}<span className="hidden sm:inline">Export</span></button>}
            <button type="button" onClick={startCreate} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />Add</button>
          </div>
        }
      />

      <QueryState query={crud.list} loading={<TableSkeleton cols={7} />} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No enquiries match", description: "Try another filter or search." } : { title: "No enquiries yet", description: "Website enquiries arrive here automatically. You can also add phone and walk-in enquiries.", action: { label: "Add enquiry", onClick: startCreate } }}>
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead><tr>{["Family", "Class", "Contact", "Assigned", "Follow-up", "Status", ""].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r) => {
                  const wa = whatsappLink(r.whatsapp || r.phone);
                  return (
                    <tr key={r.id} className={isDue(r) ? "bg-amber-50/50" : ""}>
                      <td>
                        <div className="font-extrabold">{r.studentName}</div>
                        <div className="text-xs font-semibold text-slate-500">{r.parentName} · <span className="text-slate-400">{r.enquiryNumber}</span></div>
                        <div className="mt-0.5 text-[11px] font-bold text-slate-400">{humanize(r.source)}{r.createdAt ? ` · ${formatDate(r.createdAt)}` : ""}</div>
                      </td>
                      <td className="whitespace-nowrap font-semibold">{r.interestedClass}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 font-semibold hover:bg-white" title="Call"><Phone className="h-3.5 w-3.5 text-slate-400" />{r.phone}</a>
                          {wa && <a href={wa} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${r.parentName}`} className="rounded-lg p-1.5 text-[#1da851] hover:bg-emerald-50"><MessageCircle className="h-4 w-4" /></a>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-slate-600">{staffName(r.assignedStaffId) || <span className="text-slate-300">—</span>}</td>
                      <td className="whitespace-nowrap">{r.nextFollowUpDate ? <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isDue(r) ? "text-amber-700" : "text-slate-500"}`}>{isDue(r) && <AlarmClock className="h-3.5 w-3.5" />}{formatDate(r.nextFollowUpDate)}</span> : <span className="text-slate-300">—</span>}</td>
                      <td>
                        <select aria-label="Status" className={`chip cursor-pointer border-0 outline-none ${STATUS_STYLES[r.status] || STATUS_STYLES.NEW}`} value={r.status} disabled={crud.patch.isPending} onChange={(e) => crud.patch.mutate({ id: r.id, payload: { status: e.target.value } })}>
                          {ENQUIRY_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          {!CLOSED.has(r.status) && r.status !== "APPLICATION_STARTED" && (
                            <button type="button" onClick={() => convert.mutate(r)} disabled={convert.isPending} title="Start admission application" className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-emerald-700"><ClipboardPlus className="h-4 w-4" /></button>
                          )}
                          <button type="button" onClick={() => startEdit(r)} aria-label="Edit enquiry" className="rounded-lg p-2 text-slate-500 hover:bg-white"><Pencil className="h-4 w-4" /></button>
                          {isAdmin && <ConfirmDelete compact pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} />}
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
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5"><span className="label">Source</span><select className="input" value={form.source} onChange={set("source")}>{ENQUIRY_SOURCES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Status</span><select className="input" value={form.status} onChange={set("status")}>{ENQUIRY_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Assigned to</span><select className="input" value={form.assignedStaffId} onChange={set("assignedStaffId")}><option value="">Unassigned</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            <label className="grid gap-1.5 sm:col-span-2"><span className="label">Next follow-up</span><input className="input" type="date" value={form.nextFollowUpDate} onChange={set("nextFollowUpDate")} /></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Message from parent</span><textarea className="input min-h-20" value={form.message} onChange={set("message")} /></label>
          <label className="grid gap-1.5"><span className="label">Internal notes</span><textarea className="input min-h-20" placeholder="Only visible to staff" value={form.notes} onChange={set("notes")} /></label>
          <div className="sticky bottom-0 -mx-6 -mb-5 flex gap-3 border-t bg-white/80 px-6 py-4 backdrop-blur">
            <button className="btn-primary flex-1" disabled={crud.saving}>{crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{crud.saving ? "Saving…" : editingId ? "Save changes" : "Add enquiry"}</button>
            <button type="button" onClick={close} className="btn-soft">Cancel</button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
