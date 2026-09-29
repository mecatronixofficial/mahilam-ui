"use client";
import { useState } from "react";
import { CheckCircle2, EyeOff, LoaderCircle, Mail, Pencil, Phone, Plus, Star, User } from "lucide-react";
import { useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

type Review = { id: string; parentName: string; location?: string | null; studentReference?: string | null; subject?: string | null; mobile?: string | null; email?: string | null; rating?: number | null; testimonial: string; photo?: string | null; displayOrder?: number; featured: boolean; active: boolean };

const EMPTY_FORM = { parentName: "", location: "", studentReference: "", subject: "", mobile: "", email: "", rating: 5, testimonial: "", photo: "", displayOrder: 0, featured: false, active: true };
const FILTERS = [{ value: "pending", label: "Pending" }, { value: "published", label: "Published" }, { value: "featured", label: "Featured" }] as const;

export function TestimonialsManager() {
  const crud = useCrud<Review>("/cms/testimonials", "Review", { queryKey: ["/cms/testimonials"] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  function reset() { setForm(EMPTY_FORM); setEditingId(null); }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      parentName: form.parentName.trim(),
      location: form.location.trim() || null,
      studentReference: form.studentReference.trim() || null,
      subject: form.subject.trim() || null,
      mobile: form.mobile.trim() || null,
      email: form.email.trim() || null,
      rating: Number(form.rating) || 5,
      testimonial: form.testimonial.trim(),
      photo: form.photo || null,
      displayOrder: Number(form.displayOrder) || 0,
      featured: form.featured,
      active: form.active,
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: reset });
    else crud.create.mutate(payload, { onSuccess: reset });
  }

  function startEdit(row: Review) {
    setEditingId(row.id);
    setForm({ parentName: row.parentName || "", location: row.location || "", studentReference: row.studentReference || "", subject: row.subject || "", mobile: row.mobile || "", email: row.email || "", rating: row.rating ?? 5, testimonial: row.testimonial || "", photo: row.photo || "", displayOrder: row.displayOrder ?? 0, featured: Boolean(row.featured), active: row.active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pending = crud.rows.filter((row) => !row.active).length;
  const rows = crud.rows
    .filter((row) => (filter === "pending" ? !row.active : filter === "published" ? row.active : filter === "featured" ? row.featured : true) && matches(search, row.parentName, row.location, row.subject, row.testimonial))
    .sort((a, b) => Number(a.active) - Number(b.active));

  return (
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <form onSubmit={submit} className="panel h-fit xl:sticky xl:top-28">
        <FormTitle editing={Boolean(editingId)} create="Add a review" edit="Edit review" onCancel={reset} />
        <div className="mt-5 grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Parent name</span><input className="input" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required /></label>
            <label className="grid gap-1.5"><span className="label">Location</span><input className="input" placeholder="Area / city" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Student reference</span><input className="input" placeholder="Child / class" value={form.studentReference} onChange={(e) => setForm({ ...form, studentReference: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Headline</span><input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Review</span><textarea className="input min-h-28" value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} required /></label>
          <fieldset>
            <legend className="label mb-1.5">Rating</legend>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-label={`${n} stars`} aria-pressed={form.rating === n} onClick={() => setForm({ ...form, rating: n })} className="rounded-lg p-1 transition hover:scale-110"><Star className={`h-6 w-6 ${n <= form.rating ? "fill-[#f7c85b] text-[#d6a62d]" : "text-slate-300"}`} /></button>)}</div>
          </fieldset>
          <ImageField label="Photo" heightClass="h-28" value={form.photo} onChange={(url) => setForm((f) => ({ ...f, photo: url }))} />
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Mobile (private)</span><input className="input" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Email (private)</span><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          </div>
          <div className="grid grid-cols-2 items-end gap-3">
            <label className="grid gap-1.5"><span className="label">Display order</span><input className="input" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></label>
            <div className="flex min-h-11 flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Published</label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured</label>
            </div>
          </div>
          <button className="btn-primary" disabled={crud.saving}>
            {crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {crud.saving ? "Saving…" : editingId ? "Update review" : "Add review"}
          </button>
        </div>
      </form>

      <div>
        {pending > 0 && (
          <div className="panel mb-4 flex items-center gap-3 !border-amber-200/70 !bg-amber-50/80 p-4 text-sm font-bold text-amber-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100"><Star className="h-4 w-4" /></span>
            {pending} {pending === 1 ? "review is" : "reviews are"} waiting for approval.
            <button type="button" onClick={() => setFilter("pending")} className="ml-auto rounded-lg bg-white/80 px-3 py-1.5 text-xs font-black">Show</button>
          </div>
        )}
        <ListToolbar search={search} onSearch={setSearch} placeholder="Search reviews…" filters={FILTERS} filter={filter} onFilter={setFilter} count={rows.length} />
        <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No matching reviews" } : { title: "No parent reviews yet", description: "Reviews submitted on the homepage arrive here for approval." }}>
          <div className="grid gap-4">
            {rows.map((review) => (
              <article key={review.id} className={`panel p-6 ${!review.active ? "!border-amber-200/80" : ""} ${editingId === review.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {review.photo
                      ? <img src={review.photo} alt="" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                      : <div className="accent-bg flex h-12 w-12 items-center justify-center rounded-full"><User className="h-5 w-5" /></div>}
                    <div>
                      <div className="font-extrabold">{review.parentName}{review.location ? <span className="font-bold text-slate-400"> · {review.location}</span> : null}</div>
                      {review.studentReference && <div className="text-xs font-bold text-slate-400">{review.studentReference}</div>}
                      <div className="mt-1 flex gap-0.5" aria-label={`${review.rating || 0} out of 5`}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < (review.rating || 0) ? "fill-[#f7c85b] text-[#d6a62d]" : "text-slate-200"}`} />)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => crud.patch.mutate({ id: review.id, payload: { featured: !review.featured } })} disabled={crud.patch.isPending} aria-pressed={review.featured} aria-label={review.featured ? "Unfeature" : "Feature"} className={`rounded-full p-2 ${review.featured ? "bg-amber-100/80 text-amber-600" : "bg-slate-200/60 text-slate-400"}`}>
                      <Star className={`h-4 w-4 ${review.featured ? "fill-amber-500" : ""}`} />
                    </button>
                    <span className={`chip ${review.active ? "bg-emerald-100/80 text-emerald-800" : "bg-amber-100/80 text-amber-800"}`}>{review.active ? "Published" : "Pending"}</span>
                  </div>
                </div>
                {review.subject && <h3 className="mt-4 font-extrabold">{review.subject}</h3>}
                <p className="mt-1.5 leading-7 text-slate-600">“{review.testimonial}”</p>
                {(review.mobile || review.email) && (
                  <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-white/60 px-3 py-2 text-xs font-bold text-slate-500">
                    {review.mobile && <a href={`tel:${review.mobile}`} className="flex items-center gap-1.5 hover:text-slate-800"><Phone className="h-3.5 w-3.5" />{review.mobile}</a>}
                    {review.email && <a href={`mailto:${review.email}`} className="flex items-center gap-1.5 hover:text-slate-800"><Mail className="h-3.5 w-3.5" />{review.email}</a>}
                    <span className="text-slate-400">Private — used only to verify the parent</span>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                  <button type="button" disabled={crud.patch.isPending} onClick={() => crud.patch.mutate({ id: review.id, payload: { active: !review.active } })} className={`${review.active ? "btn-soft" : "btn-primary"} !px-3 !py-1.5 !text-xs`}>
                    {review.active ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Approve &amp; publish</>}
                  </button>
                  <button type="button" onClick={() => startEdit(review)} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                  <span className="ml-auto"><ConfirmDelete pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(review.id)} /></span>
                </div>
              </article>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
