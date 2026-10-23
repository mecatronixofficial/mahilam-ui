"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useLookup } from "./crm-shared";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Cake, Download, Eye, LoaderCircle, Mail, MessageCircle, Pencil, Phone, Plus, Trash2, User, Users } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { canManageAdmissions, useAuth, useIsAdmin } from "@/store/auth";
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
  academicYearId?: string | null;
  classLevelId?: string | null; sectionId?: string | null; classLevel?: { name: string } | null; section?: { name: string } | null;
};
type Guardian = { id: string; name: string; relationship: string; mobile: string; whatsapp?: string | null; email?: string | null; occupation?: string | null; address?: string | null; primary: boolean };
type StudentDetail = Student & { guardians: Array<{ primary: boolean; guardian: Omit<Guardian, "primary"> }> };

const EMPTY_FORM = { firstName: "", lastName: "", dob: "", gender: "", bloodGroup: "", photoUrl: "", joiningDate: "", phone: "", whatsapp: "", address: "", emergencyContact: "", notes: "", status: "ACTIVE", classLevelId: "", sectionId: "" };

function age(dob?: string | null) {
  if (!dob) return null;
  const years = (Date.now() - new Date(dob).getTime()) / (365.25 * 86400000);
  return years > 0 ? `${Math.floor(years)} yrs` : null;
}

export function StudentsClient() {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const role = useAuth(state => state.user?.role);
  const canEdit = canManageAdmissions(role);
  const yearsQ = useLookup("years");
  const [yearId, setYearId] = useState("");
  useEffect(() => { const q = new URLSearchParams(window.location.search); setYearId(q.get("academicYearId") ?? ""); if (q.get("status")) setStatus(q.get("status")!); }, []);
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
  const [viewing, setViewing] = useState<Student | null>(null);
  const [guardian, setGuardian] = useState({ name: "", relationship: "Parent", mobile: "", whatsapp: "", email: "", occupation: "", address: "", primary: false });
  const detailQ = useQuery({ queryKey: ["student-detail", viewing?.id], queryFn: () => api<{ data: StudentDetail }>(`/students/${viewing!.id}`), enabled: Boolean(viewing) });
  const addGuardian = useMutation({
    mutationFn: () => api(`/students/${viewing!.id}/guardians`, { method: "POST", body: JSON.stringify({ ...guardian, whatsapp: guardian.whatsapp.trim() || null, email: guardian.email.trim() || null, occupation: guardian.occupation.trim() || null, address: guardian.address.trim() || null }) }),
    onSuccess: () => { toast.success("Guardian added"); setGuardian({ name: "", relationship: "Parent", mobile: "", whatsapp: "", email: "", occupation: "", address: "", primary: false }); detailQ.refetch(); qc.invalidateQueries({ queryKey: ["students"] }); },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const removeGuardian = useMutation({
    mutationFn: (id: string) => api(`/students/${viewing!.id}/guardians/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Guardian removed"); detailQ.refetch(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

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

  const rows = crud.rows.filter((row) => (!yearId || row.academicYearId === yearId) && (!status || row.status === status) && (!classId || row.classLevelId === classId) && matches(search, row.firstName, row.lastName, row.admissionNumber, row.phone));
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
          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Academic year filter" className="input !min-h-10 !w-auto !py-1.5 text-sm" value={yearId} onChange={e => setYearId(e.target.value)}><option value="">All years</option>{yearsQ.data?.data.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select>
            <select aria-label="Class" className="input !min-h-10 !w-auto !py-1.5 text-sm" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">All classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {isAdmin && <button type="button" onClick={exportCsv} disabled={exporting} className="btn-soft !px-3 !py-2 text-sm" title="Export CSV">{exporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}</button>}
            <button type="button" onClick={startCreate} disabled={!canEdit} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />Add</button>
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
                  <h3 className="truncate font-extrabold"><Link className="underline-offset-4 hover:underline" href={`/crm/students/${s.id}`}>{s.firstName} {s.lastName}</Link></h3>
                  <p className="text-xs font-bold text-little-neutral-500">{s.admissionNumber}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.classLevel && <span className="chip bg-little-neutral-200/60 text-little-neutral-700">{s.classLevel.name}{s.section ? ` · ${s.section.name}` : ""}</span>}
                    <select aria-label="Status" className={`chip cursor-pointer border-0 outline-none ${STATUS_STYLES[s.status] || STATUS_STYLES.ACTIVE}`} value={s.status} disabled={crud.patch.isPending || !canEdit} onChange={(e) => crud.patch.mutate({ id: s.id, payload: { status: e.target.value } })}>
                      {STUDENT_STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-1.5 text-xs font-semibold text-little-neutral-500">
                {s.dob && <span className="flex flex-wrap items-center gap-2"><Cake className="h-3.5 w-3.5 text-little-neutral-500" />{formatDate(s.dob)}{age(s.dob) ? ` · ${age(s.dob)}` : ""}</span>}
                {s.phone && <a href={`tel:${s.phone}`} className="flex w-fit items-center gap-2 hover:text-little-neutral-900"><Phone className="h-3.5 w-3.5 text-little-neutral-500" />{s.phone}</a>}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t pt-3">
                <button type="button" onClick={() => setViewing(s)} className="btn-soft !px-3 !py-1.5 !text-xs"><Eye className="h-3.5 w-3.5" /> Full details</button>
                <button type="button" onClick={() => startEdit(s)} disabled={!canEdit} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                {isAdmin && <span className="ml-auto"><ConfirmDelete label="Archive" pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(s.id)} /></span>}
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

      <Drawer open={Boolean(viewing)} onClose={() => setViewing(null)} eyebrow="Complete learner profile" title={viewing ? `${viewing.firstName} ${viewing.lastName || ""}` : "Student details"}>
        {detailQ.isPending ? <div className="grid gap-3"><div className="skeleton h-32" /><div className="skeleton h-48" /></div> : detailQ.data?.data ? (() => {
          const student = detailQ.data.data;
          const guardians = student.guardians.map((link) => ({ ...link.guardian, primary: link.primary }));
          return <div className="grid gap-5">
            <section className="rounded-2xl border bg-white/70 p-4">
              <div className="flex items-center gap-4"><div className="accent-bg flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black">{student.firstName[0]}</div><div><h3 className="text-lg font-extrabold">{student.firstName} {student.lastName}</h3><p className="text-sm font-bold text-little-neutral-500">{student.admissionNumber}</p></div></div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {[["Class", `${student.classLevel?.name || "Unassigned"}${student.section ? ` · ${student.section.name}` : ""}`], ["Date of birth", formatDate(student.dob) || "—"], ["Gender", student.gender || "—"], ["Blood group", student.bloodGroup || "—"], ["Joining date", formatDate(student.joiningDate) || "—"], ["Status", humanize(student.status)]].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wide text-little-neutral-500">{label}</dt><dd className="mt-0.5 font-semibold">{value}</dd></div>)}
              </dl>
              {student.address && <p className="mt-4 border-t pt-3 text-sm leading-6 text-little-neutral-600">{student.address}</p>}
              {student.notes && <p className="mt-3 rounded-xl bg-little-yellow-50 p-3 text-sm text-little-yellow-900">{student.notes}</p>}
            </section>
            <section><div className="flex flex-wrap items-center gap-2"><Users className="h-5 w-5" /><h3 className="font-extrabold">Parents and guardians</h3></div>
              {!guardians.length ? <p className="mt-3 rounded-2xl bg-little-neutral-50 p-5 text-sm text-little-neutral-500">No guardians added yet.</p> : <div className="mt-3 grid gap-3 sm:grid-cols-2">{guardians.map((g) => <article key={g.id} className="rounded-2xl border bg-white/70 p-4"><div className="flex justify-between gap-3"><div><p className="font-extrabold">{g.name}{g.primary && <span className="ml-2 chip bg-little-green-100 text-little-green-800">Primary</span>}</p><p className="text-xs font-bold text-little-neutral-500">{g.relationship}{g.occupation ? ` · ${g.occupation}` : ""}</p></div>{isAdmin && <button type="button" disabled={!canEdit} onClick={() => removeGuardian.mutate(g.id)} aria-label="Remove guardian" className="rounded-lg p-2 text-little-neutral-500 hover:text-little-coral-600"><Trash2 className="h-4 w-4" /></button>}</div><div className="mt-3 grid gap-1 text-sm"><a href={`tel:${g.mobile}`} className="flex flex-wrap items-center gap-2"><Phone className="h-3.5 w-3.5" />{g.mobile}</a>{g.whatsapp && <a href={`https://wa.me/${g.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-little-green-700"><MessageCircle className="h-3.5 w-3.5" />{g.whatsapp}</a>}{g.email && <a href={`mailto:${g.email}`} className="flex flex-wrap items-center gap-2"><Mail className="h-3.5 w-3.5" />{g.email}</a>}</div></article>)}</div>}
            </section>
            <form onSubmit={(event) => { event.preventDefault(); addGuardian.mutate(); }} className="grid gap-3 rounded-2xl border bg-white/60 p-4"><h3 className="font-extrabold">Add parent or guardian</h3><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5"><span className="label">Name *</span><input className="input" value={guardian.name} onChange={(e) => setGuardian({ ...guardian, name: e.target.value })} required /></label><label className="grid gap-1.5"><span className="label">Relationship *</span><input className="input" placeholder="Mother, father, guardian" value={guardian.relationship} onChange={(e) => setGuardian({ ...guardian, relationship: e.target.value })} required /></label><label className="grid gap-1.5"><span className="label">Mobile *</span><input className="input" type="tel" value={guardian.mobile} onChange={(e) => setGuardian({ ...guardian, mobile: e.target.value })} required /></label><label className="grid gap-1.5"><span className="label">WhatsApp</span><input className="input" type="tel" value={guardian.whatsapp} onChange={(e) => setGuardian({ ...guardian, whatsapp: e.target.value })} /></label><label className="grid gap-1.5"><span className="label">Email</span><input className="input" type="email" value={guardian.email} onChange={(e) => setGuardian({ ...guardian, email: e.target.value })} /></label><label className="grid gap-1.5"><span className="label">Occupation</span><input className="input" value={guardian.occupation} onChange={(e) => setGuardian({ ...guardian, occupation: e.target.value })} /></label></div><label className="grid gap-1.5"><span className="label">Address</span><textarea className="input min-h-16" value={guardian.address} onChange={(e) => setGuardian({ ...guardian, address: e.target.value })} /></label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={guardian.primary} onChange={(e) => setGuardian({ ...guardian, primary: e.target.checked })} />Primary contact</label><button className="btn-primary w-fit" disabled={addGuardian.isPending || !canEdit}>{addGuardian.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add guardian</button></form>
          </div>;
        })() : <p className="text-sm text-little-coral-600">Could not load the full student record.</p>}
      </Drawer>
    </>
  );
}
