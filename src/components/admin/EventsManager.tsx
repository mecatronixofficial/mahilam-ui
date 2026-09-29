"use client";
import { useState } from "react";
import { CalendarDays, Clock3, ImageOff, LoaderCircle, MapPin, Pencil, Plus, Star } from "lucide-react";
import { slugify, useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, toDateInput } from "@/lib/media";

type SchoolEvent = { id: string; title: string; slug: string; coverImage?: string | null; description?: string | null; startDate: string; endDate?: string | null; startTime?: string | null; venue?: string | null; category?: string | null; active: boolean; featured: boolean };

const EMPTY_FORM = { title: "", slug: "", coverImage: "", description: "", startDate: "", endDate: "", startTime: "", venue: "", category: "", active: true, featured: false };
const WHEN = [{ value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }] as const;

export function EventsManager() {
  const crud = useCrud<SchoolEvent>("/cms/events", "Event", { queryKey: ["events"], invalidate: [["admin-overview"]] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [when, setWhen] = useState("");

  function reset() { setForm(EMPTY_FORM); setSlugTouched(false); setEditingId(null); }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      coverImage: form.coverImage || null,
      description: form.description.trim() || null,
      startDate: form.startDate,
      endDate: form.endDate || null,
      startTime: form.startTime || null,
      venue: form.venue.trim() || null,
      category: form.category.trim() || null,
      active: form.active,
      featured: form.featured,
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: reset });
    else crud.create.mutate(payload, { onSuccess: reset });
  }

  function startEdit(row: SchoolEvent) {
    setEditingId(row.id);
    setSlugTouched(true);
    setForm({ title: row.title || "", slug: row.slug || "", coverImage: row.coverImage || "", description: row.description || "", startDate: toDateInput(row.startDate), endDate: toDateInput(row.endDate), startTime: row.startTime || "", venue: row.venue || "", category: row.category || "", active: row.active !== false, featured: Boolean(row.featured) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const todayKey = new Date().toISOString().slice(0, 10);
  const isPast = (row: SchoolEvent) => toDateInput(row.endDate || row.startDate) < todayKey;
  const rows = crud.rows
    .filter((row) => (!when || (when === "past" ? isPast(row) : !isPast(row))) && matches(search, row.title, row.description, row.venue, row.category))
    .sort((a, b) => (when === "past" ? b.startDate.localeCompare(a.startDate) : a.startDate.localeCompare(b.startDate)));

  return (
    <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
      <form onSubmit={submit} className="panel h-fit xl:sticky xl:top-28">
        <FormTitle editing={Boolean(editingId)} create="Schedule an event" edit="Edit event" onCancel={reset} />
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5"><span className="label">Title</span><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugTouched ? form.slug : slugify(e.target.value) })} required maxLength={160} /></label>
          <label className="grid gap-1.5"><span className="label">URL slug</span><input className="input" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: e.target.value }); }} required /></label>
          <label className="grid gap-1.5"><span className="label">Description</span><textarea className="input min-h-24" placeholder="What's happening and who should attend" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <ImageField label="Cover image" heightClass="h-36" value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} />
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Start date</span><input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></label>
            <label className="grid gap-1.5"><span className="label">End date</span><input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} min={form.startDate || undefined} /></label>
            <label className="grid gap-1.5"><span className="label">Start time</span><input className="input" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Category</span><input className="input" placeholder="Celebration" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Venue</span><input className="input" placeholder="School campus" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></label>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Published</label>
            <label className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured</label>
          </div>
          <button className="btn-primary" disabled={crud.saving}>
            {crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {crud.saving ? "Saving…" : editingId ? "Update event" : "Create event"}
          </button>
        </div>
      </form>

      <div>
        <ListToolbar search={search} onSearch={setSearch} placeholder="Search events…" filters={WHEN} filter={when} onFilter={setWhen} count={rows.length} />
        <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No matching events" } : { title: "No events yet", description: "Scheduled events appear on the public Events page and in Google results." }}>
          <div className="grid gap-3">
            {rows.map((r) => {
              const start = new Date(r.startDate);
              return (
                <article key={r.id} className={`panel p-5 ${isPast(r) ? "opacity-75" : ""} ${editingId === r.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="accent-bg flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl">
                      <span className="text-[10px] font-black uppercase">{start.toLocaleString("en-IN", { month: "short" })}</span>
                      <span className="text-2xl font-extrabold leading-none">{start.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold">{r.title}</h3>
                        {r.category && <span className="chip bg-slate-200/60 text-slate-600">{r.category}</span>}
                        {isPast(r) && <span className="chip bg-slate-200/60 text-slate-500">Past</span>}
                      </div>
                      {r.description && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{r.description}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(r.startDate)}{r.endDate ? ` – ${formatDate(r.endDate)}` : ""}</span>
                        {r.startTime && <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{r.startTime}</span>}
                        {r.venue && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{r.venue}</span>}
                      </div>
                    </div>
                    {r.coverImage
                      ? <img src={r.coverImage} alt="" loading="lazy" className="hidden h-16 w-20 shrink-0 rounded-xl object-cover sm:block" />
                      : <div className="hidden h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed text-slate-300 sm:flex"><ImageOff className="h-4 w-4" /></div>}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                    <button type="button" onClick={() => startEdit(r)} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <button type="button" onClick={() => crud.patch.mutate({ id: r.id, payload: { featured: !r.featured } })} disabled={crud.patch.isPending} aria-pressed={r.featured} className={`chip ${r.featured ? "bg-amber-100/80 text-amber-700" : "bg-slate-200/60 text-slate-500"}`}>
                      <Star className={`h-3.5 w-3.5 ${r.featured ? "fill-amber-500" : ""}`} />{r.featured ? "Featured" : "Feature"}
                    </button>
                    <PublishToggle active={r.active} pending={crud.patch.isPending} onToggle={() => crud.patch.mutate({ id: r.id, payload: { active: !r.active } })} />
                    <span className="ml-auto"><ConfirmDelete pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} /></span>
                  </div>
                </article>
              );
            })}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
