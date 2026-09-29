"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BadgeCheck, CalendarDays, Columns3, LayoutList, LoaderCircle, Pencil, Plus } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { useIsAdmin } from "@/store/auth";
import { useCrud } from "@/components/dashboard/useCrud";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDelete, ListToolbar, matches } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, humanize, toDateInput } from "@/lib/media";
import { ADMISSION_STATUSES, CLASSES, STATUS_STYLES } from "./constants";

type Admission = { id: string; applicationNumber: string; admissionNumber?: string | null; studentName: string; className: string; enquiryId?: string | null; joiningDate?: string | null; status: string; notes?: string | null };
type Enquiry = { id: string; enquiryNumber: string; studentName: string };

const PIPELINE = ["APPLICATION", "DOCUMENT_PENDING", "VERIFICATION", "FEE_PENDING", "CONFIRMED"] as const;
const EMPTY_FORM = { studentName: "", className: "Pre-KG", enquiryId: "", joiningDate: "", status: "APPLICATION", notes: "" };

export function AdmissionsClient() {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const crud = useCrud<Admission>("/admissions", "Application", { queryKey: ["admissions"], invalidate: [["dashboard-report"]] });
  const enquiriesQ = useQuery({ queryKey: ["enquiries"], queryFn: () => api<{ data: Enquiry[] }>("/enquiries") });
  const enquiries = enquiriesQ.data?.data ?? [];

  const [view, setView] = useState<"board" | "list">("board");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const confirm = useMutation({
    mutationFn: (id: string) => api(`/admissions/${id}/confirm`, { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => {
      toast.success("Admission confirmed", { description: "A student record was created automatically." });
      ["admissions", "students", "enquiries", "dashboard-report"].forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  function close() { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }
  function startCreate() { setEditingId(null); setForm(EMPTY_FORM); setOpen(true); }
  function startEdit(row: Admission) {
    setEditingId(row.id);
    setForm({ studentName: row.studentName || "", className: row.className || "Pre-KG", enquiryId: row.enquiryId || "", joiningDate: toDateInput(row.joiningDate), status: row.status || "APPLICATION", notes: row.notes || "" });
    setOpen(true);
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = { studentName: form.studentName.trim(), className: form.className, enquiryId: form.enquiryId || null, joiningDate: form.joiningDate || null, status: form.status, notes: form.notes.trim() || null };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: close });
    else crud.create.mutate(payload, { onSuccess: close });
  }

  const rows = crud.rows.filter((row) => (!status || row.status === status) && matches(search, row.studentName, row.applicationNumber, row.admissionNumber, row.className));

  const card = (r: Admission, compact = false) => (
    <article key={r.id} className={`panel ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-extrabold">{r.studentName}</h3>
          <p className="mt-0.5 text-xs font-bold text-slate-400">{r.applicationNumber} · {r.className}</p>
        </div>
        {!compact && (
          <select aria-label="Status" className={`chip cursor-pointer border-0 outline-none ${STATUS_STYLES[r.status] || STATUS_STYLES.APPLICATION}`} value={r.status} disabled={crud.patch.isPending || Boolean(r.admissionNumber)} onChange={(e) => crud.patch.mutate({ id: r.id, payload: { status: e.target.value } })}>
            {ADMISSION_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}
          </select>
        )}
      </div>
      {(r.joiningDate || r.admissionNumber) && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
          {r.joiningDate && <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Joins {formatDate(r.joiningDate)}</span>}
          {r.admissionNumber && <span className="flex items-center gap-1 text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" />{r.admissionNumber}</span>}
        </div>
      )}
      {r.notes && !compact && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{r.notes}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
        {compact && (
          <select aria-label="Move to" className="input !min-h-8 !w-auto !rounded-lg !px-2 !py-1 text-xs font-bold" value={r.status} disabled={crud.patch.isPending || Boolean(r.admissionNumber)} onChange={(e) => crud.patch.mutate({ id: r.id, payload: { status: e.target.value } })}>
            {ADMISSION_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}
          </select>
        )}
        {!r.admissionNumber && !["REJECTED", "CANCELLED"].includes(r.status) && (
          <button type="button" onClick={() => confirm.mutate(r.id)} disabled={confirm.isPending} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60" title="Confirm and create the student record">
            {confirm.isPending && confirm.variables === r.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <BadgeCheck className="h-3.5 w-3.5" />}Enrol
          </button>
        )}
        <button type="button" onClick={() => startEdit(r)} aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-white"><Pencil className="h-3.5 w-3.5" /></button>
        {isAdmin && <span className="ml-auto"><ConfirmDelete compact pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} /></span>}
      </div>
    </article>
  );

  return (
    <>
      <ListToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search student, application no…"
        filters={view === "list" ? ADMISSION_STATUSES.map((x) => ({ value: x, label: humanize(x) })) : undefined}
        filter={status}
        onFilter={setStatus}
        count={rows.length}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border bg-white/60 p-0.5" role="group" aria-label="View">
              <button type="button" onClick={() => setView("board")} aria-pressed={view === "board"} className={`rounded-lg p-1.5 ${view === "board" ? "bg-white shadow-sm" : "text-slate-400"}`} title="Pipeline board"><Columns3 className="h-4 w-4" /></button>
              <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={`rounded-lg p-1.5 ${view === "list" ? "bg-white shadow-sm" : "text-slate-400"}`} title="List"><LayoutList className="h-4 w-4" /></button>
            </div>
            <button type="button" onClick={startCreate} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />New</button>
          </div>
        }
      />

      <QueryState query={crud.list} isEmpty={crud.rows.length === 0} empty={{ title: "No applications yet", description: "Start one here, or convert an enquiry from the Enquiries page.", action: { label: "New application", onClick: startCreate } }}>
        {view === "board" ? (
          <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {PIPELINE.map((stage) => {
              const stageRows = rows.filter((row) => row.status === stage);
              return (
                <section key={stage} className="flex w-72 shrink-0 flex-col rounded-[22px] bg-white/35 p-3 ring-1 ring-white/60 xl:w-auto xl:flex-1">
                  <header className="mb-3 flex items-center justify-between px-1">
                    <span className={`chip ${STATUS_STYLES[stage]}`}>{humanize(stage)}</span>
                    <span className="text-xs font-black text-slate-400">{stageRows.length}</span>
                  </header>
                  <div className="grid gap-2.5">
                    {stageRows.map((row) => card(row, true))}
                    {!stageRows.length && <p className="rounded-2xl border-2 border-dashed px-3 py-6 text-center text-xs font-bold text-slate-400">Nothing here</p>}
                  </div>
                </section>
              );
            })}
          </div>
        ) : rows.length ? (
          <div className="grid gap-3 md:grid-cols-2">{rows.map((row) => card(row))}</div>
        ) : (
          <p className="panel p-10 text-center text-sm font-bold text-slate-400">No applications match.</p>
        )}
        {view === "board" && rows.some((row) => !PIPELINE.includes(row.status as (typeof PIPELINE)[number])) && (
          <p className="mt-3 text-xs font-bold text-slate-400">Rejected and cancelled applications are hidden on the board — switch to list view to see them.</p>
        )}
      </QueryState>

      <Drawer open={open} onClose={close} width="max-w-lg" eyebrow="Admissions" title={editingId ? "Edit application" : "New application"}>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-1.5"><span className="label">Student name *</span><input className="input" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required minLength={2} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5"><span className="label">Class *</span><select className="input" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{CLASSES.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Status</span><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{ADMISSION_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Joining date</span><input className="input" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Linked enquiry</span><select className="input" value={form.enquiryId} onChange={(e) => setForm({ ...form, enquiryId: e.target.value })}><option value="">None</option>{enquiries.map((e) => <option key={e.id} value={e.id}>{e.enquiryNumber} · {e.studentName}</option>)}</select></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Notes</span><textarea className="input min-h-28" placeholder="Documents received, sibling discount, etc." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          <div className="flex gap-3">
            <button className="btn-primary flex-1" disabled={crud.saving}>{crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? "Save changes" : "Create application"}</button>
            <button type="button" onClick={close} className="btn-soft">Cancel</button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
