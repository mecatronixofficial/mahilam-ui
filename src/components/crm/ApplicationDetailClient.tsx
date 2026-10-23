"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { formatDate, humanize, toDateInput } from "@/lib/media";
import { canManageAdmissions, isAdminRole, useAuth } from "@/store/auth";
import { QueryState } from "@/components/states/QueryState";
import { InlineNotice } from "@/components/states/StateView";
import { useCrmRefresh, useLookup } from "./crm-shared";

type Document = { id: string; filename: string; type: string; size: number };
type Application = { id: string; applicationNumber: string; admissionNumber?: string; enquiryId?: string; studentId?: string; status: string; requiredDocuments: string[]; documents: Document[]; consentAt?: string; history?: { id: string; action: string; createdAt: string }[] } & Record<string, unknown>;
const fields = ["studentName", "childDob", "parentName", "phone", "alternatePhone", "email", "address", "emergencyContact", "previousSchool", "joiningDate", "notes"];
const required = new Set(["studentName", "childDob", "parentName", "phone", "address", "emergencyContact"]);
export function ApplicationDetailClient({ id }: { id: string }) {
  const user = useAuth(state => state.user);
  const manager = canManageAdmissions(user?.role);
  const refresh = useCrmRefresh();
  const detail = useQuery({ queryKey: ["crm", "application", id], queryFn: () => api<{ data: Application }>(`/admissions/${id}`) });
  const classes = useLookup("classes");
  const years = useLookup("years");
  const guardians = useLookup("guardians", manager);
  const [guardianId, setGuardianId] = useState("");
  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [consent, setConsent] = useState(false);
  const [documentType, setDocumentType] = useState("BIRTH_CERTIFICATE");
  const [file, setFile] = useState<File | null>(null);
  const [reason, setReason] = useState("");
  const [section, setSection] = useState("");
  const [override, setOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const app = detail.data?.data;
  const editable = Boolean(app && ["DRAFT", "APPLICATION", "DOCUMENT_PENDING", "VERIFICATION", "FEE_PENDING"].includes(app.status));
  useEffect(() => {
    if (!app || form) return;
    const values: Record<string, string> = {};
    [...fields, "classLevelId", "academicYearId"].forEach(key => { values[key] = ["childDob", "joiningDate"].includes(key) ? toDateInput(app[key] as string | undefined) : String(app[key] ?? ""); });
    setForm(values); setConsent(Boolean(app.consentAt));
  }, [app, form]);
  const action = useMutation({ mutationFn: ({ path, payload, method = "POST" }: { path: string; payload?: object | FormData; method?: string }) => api(path, { method, body: payload instanceof FormData ? payload : payload ? JSON.stringify(payload) : undefined }), onSuccess: () => { refresh(); detail.refetch(); toast.success("Application saved"); }, onError: error => toast.error(errorMessage(error)) });
  function save(event: React.FormEvent) {
    event.preventDefault(); if (!form) return;
    const level = classes.data?.data.find(level => level.id === form.classLevelId);
    action.mutate({ path: `/admissions/${id}`, method: "PATCH", payload: { ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim() || null])), className: level?.name ?? String(app?.className ?? ""), consent } });
  }
  return <QueryState query={detail}>{app && <>
    <div className="panel mb-5 flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="text-xs font-bold">{app.applicationNumber}</p><h2 className="mt-1 text-2xl font-extrabold">{String(app.studentName)}</h2><p className="mt-2 text-sm">{humanize(app.status)}{app.admissionNumber ? ` · ${app.admissionNumber}` : ""}</p></div><div className="flex flex-wrap gap-2">{app.enquiryId && <Link className="btn-soft !py-2" href={`/crm/enquiries/${app.enquiryId}`}>Original enquiry</Link>}{app.studentId && <Link className="btn-soft !py-2" href={`/crm/students/${app.studentId}`}>Student record</Link>}</div></div>
    <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
      <section className="panel p-5"><h3 className="font-extrabold">Application information</h3>{form && <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map(key => <label key={key} className={`grid gap-1.5 ${["address", "notes"].includes(key) ? "sm:col-span-2" : ""}`}><span className="label">{humanize(key.replace(/([A-Z])/g, "_$1"))}{required.has(key) ? " *" : ""}</span>{["notes", "address"].includes(key) ? <textarea className="input min-h-20" value={form[key]} disabled={!editable} required={key === "studentName"} maxLength={key === "notes" ? 4000 : 500} onChange={e => setForm({ ...form, [key]: e.target.value })} /> : <input className="input" type={["childDob", "joiningDate"].includes(key) ? "date" : key === "email" ? "email" : key.includes("phone") || key === "phone" ? "tel" : "text"} required={key === "studentName"} disabled={!editable} max={key === "childDob" ? toDateInput(new Date().toISOString()) : undefined} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />}</label>)}
        <label className="grid gap-1.5"><span className="label">Academic year *</span><select className="input" value={form.academicYearId} disabled={!editable} onChange={e => setForm({ ...form, academicYearId: e.target.value, classLevelId: "" })}><option value="">Select year…</option>{years.data?.data.filter(y => y.active !== false).map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select></label>
        <label className="grid gap-1.5"><span className="label">Admission class *</span><select className="input" value={form.classLevelId} disabled={!editable} onChange={e => setForm({ ...form, classLevelId: e.target.value })}><option value="">Select class…</option>{classes.data?.data.filter(c => c.active !== false && c.academicYearId === form.academicYearId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label className="flex items-start gap-2 text-sm sm:col-span-2"><input type="checkbox" className="mt-1" checked={consent} disabled={!editable} onChange={e => setConsent(e.target.checked)} /><span>The parent or guardian consents to the school storing and processing these application details and private documents.</span></label>
        {editable && <button className="btn-primary sm:col-span-2" disabled={action.isPending}>Save draft</button>}
      </form>}</section>
      <div className="grid content-start gap-5"><section className="panel p-5"><h3 className="font-extrabold">Private documents</h3><p className="mt-2 text-xs leading-5 text-little-neutral-500">PDF, PNG, JPEG or WebP, up to 5 MB each. Downloads require a school session and application access.</p><ul className="mt-4 grid gap-2 text-sm">{app.requiredDocuments.map(type => <li key={type} className="flex items-center justify-between rounded-xl border p-3"><span>{humanize(type)}</span><span className="text-xs font-bold">{app.documents.some(doc => doc.type === type) ? "Received" : "Required"}</span></li>)}</ul>
        <div className="mt-4 grid gap-3">{app.documents.map(doc => <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/60 p-3"><div className="min-w-0"><p className="break-all text-sm font-bold">{doc.filename}</p><p className="text-xs text-little-neutral-500">{humanize(doc.type)} · {Math.ceil(doc.size / 1024)} KB</p></div><div className="flex gap-2"><button type="button" className="btn-soft !px-3 !py-1.5 text-xs" onClick={() => downloadFile(`/crm/applications/${id}/documents/${doc.id}`, doc.filename).catch(error => toast.error(errorMessage(error)))}>Download</button>{editable && <button type="button" className="btn-soft !px-3 !py-1.5 text-xs" disabled={action.isPending} onClick={() => action.mutate({ path: `/crm/applications/${id}/documents/${doc.id}`, method: "DELETE" })}>Remove</button>}</div></div>)}</div>
        {editable && <form className="mt-4 grid gap-3" onSubmit={event => { event.preventDefault(); if (!file) return; if (file.size > 5 * 1024 * 1024) { toast.error("Choose a document up to 5 MB"); return; } const body = new FormData(); body.set("type", documentType); body.set("file", file); action.mutate({ path: `/crm/applications/${id}/documents`, payload: body }, { onSuccess: () => setFile(null) }); }}><select className="input" aria-label="Document type" value={documentType} onChange={e => setDocumentType(e.target.value)}>{["BIRTH_CERTIFICATE", "CHILD_PHOTO", "ADDRESS_PROOF", "TRANSFER_CERTIFICATE", "OTHER"].map(value => <option key={value}>{value}</option>)}</select><input className="input" type="file" aria-label="Private application document" accept="application/pdf,image/png,image/jpeg,image/webp" required onChange={e => setFile(e.target.files?.[0] ?? null)} /><button className="btn-soft" disabled={action.isPending}>Upload private document</button></form>}
      </section>
      <section className="panel p-5"><h3 className="font-extrabold">Submission, review & enrollment</h3><p className="mt-2 text-sm text-little-neutral-500">Save changes before submitting. Required family fields, consent and documents are checked on the server.</p>
        {editable && <button type="button" className="btn-primary mt-4" disabled={action.isPending} onClick={() => action.mutate({ path: `/admissions/${id}/submit` })}>Submit application</button>}
        {manager && ["SUBMITTED", "WAITLISTED", "APPROVED"].includes(app.status) && <div className="mt-4 grid gap-3"><label className="grid gap-1.5"><span className="label">Decision reason (required for rejection or waitlist)</span><textarea className="input" maxLength={1000} value={reason} onChange={e => setReason(e.target.value)} /></label><div className="flex flex-wrap gap-2">{["APPROVED", "WAITLISTED", "REJECTED"].map(decision => <button key={decision} type="button" className="btn-soft !px-3 !py-2 text-xs" disabled={action.isPending} onClick={() => action.mutate({ path: `/admissions/${id}/review`, payload: { decision, reason: reason || undefined } })}>{humanize(decision)}</button>)}</div></div>}
        {manager && app.status === "APPROVED" && <form className="mt-5 grid gap-3 border-t pt-4" onSubmit={event => { event.preventDefault(); action.mutate({ path: `/admissions/${id}/enroll`, payload: { sectionId: section || undefined, guardianId: guardianId || undefined, capacityOverride: override, overrideReason: overrideReason || undefined } }); }}><label className="grid gap-1.5"><span className="label">Existing primary guardian (optional)</span><select className="input" value={guardianId} onChange={e => setGuardianId(e.target.value)}><option value="">Create guardian from this application</option>{guardians.data?.data.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label><label className="grid gap-1.5"><span className="label">Section</span><select className="input" value={section} onChange={e => setSection(e.target.value)}><option value="">No section</option>{classes.data?.data.find(c => c.id === app.classLevelId)?.sections?.filter(s => s.active !== false).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>{isAdminRole(user?.role) && <><label className="flex gap-2 text-sm"><input type="checkbox" checked={override} onChange={e => setOverride(e.target.checked)} />Authorize capacity override</label>{override && <textarea className="input" aria-label="Capacity override reason" placeholder="Reason for capacity override" required minLength={5} maxLength={500} value={overrideReason} onChange={e => setOverrideReason(e.target.value)} />}</>}<button className="btn-primary" disabled={action.isPending}>Confirm student enrollment</button></form>}
        {!manager && ["SUBMITTED", "WAITLISTED", "APPROVED"].includes(app.status) && <div className="mt-4"><InlineNotice variant="partial">An admission manager or administrator must record the decision and confirm enrollment.</InlineNotice></div>}
      </section></div>
    </div>
    {app.history && <section className="panel mt-5 p-5"><h3 className="font-extrabold">Application history</h3><ol className="mt-4 grid gap-2">{app.history.map(item => <li key={item.id} className="text-sm">{formatDate(item.createdAt, { dateStyle: "medium", timeStyle: "short" })} · {humanize(item.action)}</li>)}</ol></section>}
  </>}</QueryState>;
}
