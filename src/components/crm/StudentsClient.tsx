"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Cake, Download, LoaderCircle, Pencil, Phone, Plus, User } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { useIsAdmin } from "@/store/auth";
import { useCrud } from "@/components/dashboard/useCrud";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDelete, ImageField, ListToolbar, matches } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, humanize, toDateInput } from "@/lib/media";
import { STATUS_STYLES, STUDENT_STATUSES } from "./constants";

type ClassLevel = { id: string; name: string; sections?: { id: string; name: string }[] };
type Student = {
  id: string; admissionNumber: string; firstName: string; lastName?: string | null; dob?: string | null; gender?: string | null; bloodGroup?: string | null; photoUrl?: string | null;
  joiningDate?: string | null; phone?: string | null; whatsapp?: string | null; address?: string | null; emergencyContact?: string | null; notes?: string | null; status: string;
  classLevelId?: string | null; sectionId?: string | null; classLevel?: { name: string } | null; section?: { name: string } | null;
};

const EMPTY_FORM = { firstName: "", lastName: "", dob: "", gender: "", bloodGroup: "", photoUrl: "", joiningDate: "", phone: "", whatsapp: "", address: "", emergencyContact: "", notes: "", status: "ACTIVE", classLevelId: "", sectionId: "" };

function age(dob?: string | null) {
  if (!dob) return null;
  const years = (Date.now() - new Date(dob).getTime()) / (365.25 * 86400000);
  return years > 0 ? `${Math.floor(years)} yrs` : null;
}

export function StudentsClient() {
  const isAdmin = useIsAdmin();
  const crud = useCrud<Student>("/students", "Student", { queryKey: ["students"], invalidate: [["dashboard-report"]] });
  const classesQ = useQuery({ queryKey: ["academics-classes"], queryFn: () => api<{ data: ClassLevel[] }>("/academics/classes") });
  const classes = classesQ.data?.data ?? [];

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [classId, setClassId] = useState("");
  const [exporting, setExporting] = useState(false);

  const sections = classes.find((c) => c.id === form.classLevelId)?.sections ?? [];

  function close() { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); }
  function startCreate() { setEditingId(null); setForm(EMPTY_FORM); setOpen(true); }
  function startEdit(row: Student) {
    setEditingId(row.id);
    setForm({ firstName: row.firstName || "", lastName: row.lastName || "", dob: toDateInput(row.dob), gender: row.gender || "", bloodGroup: row.bloodGroup || "", photoUrl: row.photoUrl || "", joiningDate: toDateInput(row.joiningDate), phone: row.phone || "", whatsapp: row.whatsapp || "", address: row.address || "", emergencyContact: row.emergencyContact || "", notes: row.notes || "", status: row.status || "ACTIVE", classLevelId: row.classLevelId || "", sectionId: row.sectionId || "" });
    setOpen(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      firstName: form.firstName.trim(), lastName: form.lastName.trim() || null, dob: form.dob || null, gender: form.gender || null, bloodGroup: form.bloodGroup.trim() || null,
      photoUrl: form.photoUrl || null, joiningDate: form.joiningDate || null, phone: form.phone.trim() || null, whatsapp: form.whatsapp.trim() || null, address: form.address.trim() || null,
      emergencyContact: form.emergencyContact.trim() || null, notes: form.notes.trim() || null, status: form.status, classLevelId: form.classLevelId || null, sectionId: form.sectionId || null,
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: close });
    else crud.create.mutate(payload, { onSuccess: close });
  }

  async function exportCsv() {
    setExporting(true);
    try { await downloadFile("/reports/export/students.csv", "students.csv"); toast.success("Export downloaded"); }
    catch (error) { toast.error(errorMessage(error, "Export failed")); }
    finally { setExporting(false); }
  }

  const rows = crud.rows.filter((row) => (!status || row.status === status) && (!classId || row.classLevelId === classId) && matches(search, row.firstName, row.lastName, row.admissionNumber, row.phone));
  const set = (key: keyof typeof EMPTY_FORM) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: event.target.value });

  return (
    <>
      <ListToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search name, admission no, phone…"
        filters={STUDENT_STATUSES.map((x) => ({ value: x, label: humanize(x) }))}
        filter={status}
        onFilter={setStatus}
        count={rows.length}
        actions={
          <div className="flex items-center gap-2">
            <select aria-label="Class" className="input !min-h-10 !w-auto !py-1.5 text-sm" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">All classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {isAdmin && <button type="button" onClick={exportCsv} disabled={exporting} className="btn-soft !px-3 !py-2 text-sm" title="Export CSV">{exporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}</button>}
            <button type="button" onClick={startCreate} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />Add</button>
          </div>
        }
      />

      <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No students match", description: "Adjust the class, status or search." } : { title: "No students yet", description: "Students are created automatically when an admission is confirmed, or you can add one here.", action: { label: "Add student", onClick: startCreate } }}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((s) => (
            <article key={s.id} className="panel p-5">
              <div className="flex items-start gap-4">
                {s.photoUrl
                  ? <img src={s.photoUrl} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                  : <div className="accent-bg flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold">{s.firstName?.[0] ?? <User className="h-5 w-5" />}</div>}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-extrabold">{s.firstName} {s.lastName}</h3>
                  <p className="text-xs font-bold text-slate-400">{s.admissionNumber}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.classLevel && <span className="chip bg-slate-200/60 text-slate-700">{s.classLevel.name}{s.section ? ` · ${s.section.name}` : ""}</span>}
                    <select aria-label="Status" className={`chip cursor-pointer border-0 outline-none ${STATUS_STYLES[s.status] || STATUS_STYLES.ACTIVE}`} value={s.status} disabled={crud.patch.isPending} onChange={(e) => crud.patch.mutate({ id: s.id, payload: { status: e.target.value } })}>
                      {STUDENT_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-1.5 text-xs font-semibold text-slate-500">
                {s.dob && <span className="flex items-center gap-2"><Cake className="h-3.5 w-3.5 text-slate-400" />{formatDate(s.dob)}{age(s.dob) ? ` · ${age(s.dob)}` : ""}</span>}
                {s.phone && <a href={`tel:${s.phone}`} className="flex w-fit items-center gap-2 hover:text-slate-900"><Phone className="h-3.5 w-3.5 text-slate-400" />{s.phone}</a>}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t pt-3">
                <button type="button" onClick={() => startEdit(s)} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                {isAdmin && <span className="ml-auto"><ConfirmDelete pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(s.id)} /></span>}
              </div>
            </article>
          ))}
        </div>
      </QueryState>

      <Drawer open={open} onClose={close} eyebrow="Learner record" title={editingId ? "Edit student" : "Add a student"}>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5"><span className="label">First name *</span><input className="input" value={form.firstName} onChange={set("firstName")} required /></label>
            <label className="grid gap-1.5"><span className="label">Last name</span><input className="input" value={form.lastName} onChange={set("lastName")} /></label>
            <label className="grid gap-1.5"><span className="label">Date of birth</span><input className="input" type="date" value={form.dob} onChange={set("dob")} /></label>
            <label className="grid gap-1.5"><span className="label">Gender</span><select className="input" value={form.gender} onChange={set("gender")}><option value="">Select</option>{["Male", "Female", "Other"].map((g) => <option key={g}>{g}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Class</span><select className="input" value={form.classLevelId} onChange={(e) => setForm({ ...form, classLevelId: e.target.value, sectionId: "" })}><option value="">Unassigned</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Section</span><select className="input" value={form.sectionId} onChange={set("sectionId")} disabled={!form.classLevelId}><option value="">Unassigned</option>{sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Status</span><select className="input" value={form.status} onChange={set("status")}>{STUDENT_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Blood group</span><input className="input" placeholder="O+" value={form.bloodGroup} onChange={set("bloodGroup")} /></label>
            <label className="grid gap-1.5"><span className="label">Phone</span><input className="input" type="tel" value={form.phone} onChange={set("phone")} /></label>
            <label className="grid gap-1.5"><span className="label">WhatsApp</span><input className="input" type="tel" value={form.whatsapp} onChange={set("whatsapp")} /></label>
            <label className="grid gap-1.5"><span className="label">Emergency contact</span><input className="input" value={form.emergencyContact} onChange={set("emergencyContact")} /></label>
            <label className="grid gap-1.5"><span className="label">Joining date</span><input className="input" type="date" value={form.joiningDate} onChange={set("joiningDate")} /></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Address</span><textarea className="input min-h-16" value={form.address} onChange={set("address")} /></label>
          <label className="grid gap-1.5"><span className="label">Notes</span><textarea className="input min-h-16" placeholder="Allergies, pickup arrangements…" value={form.notes} onChange={set("notes")} /></label>
          <ImageField label="Photo" heightClass="h-32" value={form.photoUrl} onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))} />
          <div className="sticky bottom-0 -mx-6 -mb-5 flex gap-3 border-t bg-white/80 px-6 py-4 backdrop-blur">
            <button className="btn-primary flex-1" disabled={crud.saving}>{crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? "Save changes" : "Add student"}</button>
            <button type="button" onClick={close} className="btn-soft">Cancel</button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
