"use client";
import { useState } from "react";
import { CalendarDays, ImageOff, Link2, LoaderCircle, Pencil, Plus } from "lucide-react";
import { useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, humanize, toDateInput } from "@/lib/media";

const TYPES = ["GENERAL", "ADMISSION", "HOLIDAY", "EVENT", "IMPORTANT"] as const;

const TYPE_STYLES: Record<string, string> = {
  GENERAL: "bg-slate-200/60 text-slate-700",
  ADMISSION: "bg-emerald-100/80 text-emerald-800",
  HOLIDAY: "bg-amber-100/80 text-amber-800",
  EVENT: "bg-sky-100/80 text-sky-800",
  IMPORTANT: "bg-rose-100/80 text-rose-700",
};

type Announcement = { id: string; title: string; content: string; type: string; priority: number; imageUrl?: string | null; ctaLabel?: string | null; ctaUrl?: string | null; startDate?: string | null; endDate?: string | null; active: boolean };

const EMPTY_FORM = { title: "", content: "", type: "GENERAL", priority: 0, imageUrl: "", ctaLabel: "", ctaUrl: "", startDate: "", endDate: "", active: true };

export function AnnouncementsManager() {
  const crud = useCrud<Announcement>("/cms/announcements", "Announcement", { queryKey: ["announcements"], invalidate: [["admin-overview"]] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  function reset() { setForm(EMPTY_FORM); setEditingId(null); }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
      priority: Number(form.priority) || 0,
      imageUrl: form.imageUrl || null,
      ctaLabel: form.ctaLabel.trim() || null,
      ctaUrl: form.ctaUrl.trim() || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      active: form.active,
    };
    const done = { onSuccess: reset };
    if (editingId) crud.update.mutate({ id: editingId, payload }, done);
    else crud.create.mutate(payload, done);
  }

  function startEdit(row: Announcement) {
    setEditingId(row.id);
    setForm({ title: row.title || "", content: row.content || "", type: row.type || "GENERAL", priority: row.priority ?? 0, imageUrl: row.imageUrl || "", ctaLabel: row.ctaLabel || "", ctaUrl: row.ctaUrl || "", startDate: toDateInput(row.startDate), endDate: toDateInput(row.endDate), active: row.active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const rows = crud.rows.filter((row) => (!type || row.type === type) && matches(search, row.title, row.content));

  return (
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <form onSubmit={submit} className="panel h-fit xl:sticky xl:top-28">
        <FormTitle editing={Boolean(editingId)} create="New announcement" edit="Edit announcement" onCancel={reset} />
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5"><span className="label">Title</span><input className="input" placeholder="e.g. Admissions open for 2027" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={160} /></label>
          <label className="grid gap-1.5"><span className="label">Message</span><textarea className="input min-h-28" placeholder="What families need to know" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></label>
          <ImageField label="Image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Type</span><select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Priority</span><input className="input" type="number" min={0} value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Button label</span><input className="input" placeholder="Apply now" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Button link</span><input className="input" placeholder="/admissions" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Show from</span><input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Until</span><input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} min={form.startDate || undefined} /></label>
          </div>
          <label className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded accent-current" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Published (visible on website)</label>
          <button className="btn-primary" disabled={crud.saving}>
            {crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {crud.saving ? "Saving…" : editingId ? "Update announcement" : "Publish announcement"}
          </button>
        </div>
      </form>

      <div>
        <ListToolbar search={search} onSearch={setSearch} placeholder="Search announcements…" filters={TYPES.map((x) => ({ value: x, label: humanize(x) }))} filter={type} onFilter={setType} count={rows.length} />
        <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No matches", description: "Try a different search or filter." } : { title: "No announcements yet", description: "Publish your first notice using the form." }}>
          <div className="grid gap-3">
            {rows.map((r) => (
              <article key={r.id} className={`panel p-5 transition ${editingId === r.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-4">
                    {r.imageUrl
                      ? <img src={r.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" loading="lazy" />
                      : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-white/50 text-slate-300"><ImageOff className="h-5 w-5" /></div>}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold">{r.title}</h3>
                        <span className={`chip ${TYPE_STYLES[r.type] || TYPE_STYLES.GENERAL}`}>{humanize(r.type)}</span>
                        {r.priority > 0 && <span className="chip bg-slate-200/60 text-slate-600">Priority {r.priority}</span>}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{r.content}</p>
                      {(r.startDate || r.endDate || r.ctaLabel) && (
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                          {(r.startDate || r.endDate) && <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(r.startDate)}{r.endDate ? ` – ${formatDate(r.endDate)}` : ""}</span>}
                          {r.ctaLabel && <span className="accent-text flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" />{r.ctaLabel}{r.ctaUrl ? ` → ${r.ctaUrl}` : ""}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <PublishToggle active={r.active} pending={crud.patch.isPending} onToggle={() => crud.patch.mutate({ id: r.id, payload: { active: !r.active } })} />
                </div>
                <div className="mt-4 flex items-center gap-2 border-t pt-3">
                  <button type="button" onClick={() => startEdit(r)} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                  <ConfirmDelete pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} />
                </div>
              </article>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
