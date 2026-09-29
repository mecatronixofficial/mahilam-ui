"use client";
import { useState } from "react";
import { ArrowRight, ImageOff, LoaderCircle, Pencil, Plus } from "lucide-react";
import { useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

type Banner = { id: string; title: string; subtitle?: string | null; desktopImage?: string | null; mobileImage?: string | null; ctaLabel?: string | null; ctaLink?: string | null; secondaryCtaLabel?: string | null; secondaryCtaLink?: string | null; displayOrder: number; active: boolean };

const EMPTY_FORM = { title: "", subtitle: "", desktopImage: "", mobileImage: "", ctaLabel: "Admissions", ctaLink: "/admissions", secondaryCtaLabel: "", secondaryCtaLink: "", displayOrder: 0, active: true };

export function BannersManager() {
  const crud = useCrud<Banner>("/cms/banners", "Banner", { queryKey: ["banners"], invalidate: [["admin-overview"]] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function reset() { setForm(EMPTY_FORM); setEditingId(null); }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      desktopImage: form.desktopImage || null,
      mobileImage: form.mobileImage || null,
      ctaLabel: form.ctaLabel.trim() || null,
      ctaLink: form.ctaLink.trim() || null,
      secondaryCtaLabel: form.secondaryCtaLabel.trim() || null,
      secondaryCtaLink: form.secondaryCtaLink.trim() || null,
      displayOrder: Number(form.displayOrder) || 0,
      active: form.active,
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: reset });
    else crud.create.mutate(payload, { onSuccess: reset });
  }

  function startEdit(row: Banner) {
    setEditingId(row.id);
    setForm({ title: row.title || "", subtitle: row.subtitle || "", desktopImage: row.desktopImage || "", mobileImage: row.mobileImage || "", ctaLabel: row.ctaLabel || "", ctaLink: row.ctaLink || "", secondaryCtaLabel: row.secondaryCtaLabel || "", secondaryCtaLink: row.secondaryCtaLink || "", displayOrder: row.displayOrder ?? 0, active: row.active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const rows = crud.rows.filter((row) => matches(search, row.title, row.subtitle)).sort((a, b) => a.displayOrder - b.displayOrder);
  const preview = form.desktopImage || form.mobileImage;

  return (
    <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
      <form onSubmit={submit} className="panel h-fit xl:sticky xl:top-28">
        <FormTitle editing={Boolean(editingId)} create="New homepage banner" edit="Edit banner" onCancel={reset} />

        <div className="relative mt-5 flex aspect-[16/7] items-end overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-700 p-4 text-white">
          {preview && <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-white/60">Live preview</p>
            <p className="mt-1 line-clamp-2 text-lg font-extrabold leading-tight">{form.title || "Your headline appears here"}</p>
            {form.subtitle && <p className="mt-1 line-clamp-1 text-xs text-white/80">{form.subtitle}</p>}
            {form.ctaLabel && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a] px-3 py-1 text-xs font-black text-emerald-950">{form.ctaLabel} <ArrowRight className="h-3 w-3" /></span>}
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5"><span className="label">Headline</span><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={160} /></label>
          <label className="grid gap-1.5"><span className="label">Supporting line</span><input className="input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <ImageField label="Desktop image" heightClass="h-24" value={form.desktopImage} onChange={(url) => setForm((f) => ({ ...f, desktopImage: url }))} />
            <ImageField label="Mobile image" heightClass="h-24" value={form.mobileImage} onChange={(url) => setForm((f) => ({ ...f, mobileImage: url }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Button label</span><input className="input" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Button link</span><input className="input" placeholder="/admissions" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Second button</span><input className="input" placeholder="Optional" value={form.secondaryCtaLabel} onChange={(e) => setForm({ ...form, secondaryCtaLabel: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Second link</span><input className="input" placeholder="Optional" value={form.secondaryCtaLink} onChange={(e) => setForm({ ...form, secondaryCtaLink: e.target.value })} /></label>
          </div>
          <div className="grid grid-cols-2 items-end gap-3">
            <label className="grid gap-1.5"><span className="label">Display order</span><input className="input" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></label>
            <label className="flex min-h-11 items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Published</label>
          </div>
          <button className="btn-primary" disabled={crud.saving}>
            {crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {crud.saving ? "Saving…" : editingId ? "Update banner" : "Save banner"}
          </button>
        </div>
      </form>

      <div>
        <ListToolbar search={search} onSearch={setSearch} placeholder="Search banners…" count={rows.length} />
        <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No matches" } : { title: "No banners yet", description: "Without banners the homepage shows its built-in welcome hero." }}>
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((r) => (
              <article key={r.id} className={`panel overflow-hidden ${editingId === r.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                <div className="relative aspect-[16/8] bg-slate-100">
                  {r.desktopImage || r.mobileImage
                    ? <img src={(r.desktopImage || r.mobileImage)!} alt="" loading="lazy" className="h-full w-full object-cover" />
                    : <div className="flex h-full items-center justify-center text-slate-300"><ImageOff className="h-6 w-6" /></div>}
                  <span className="chip absolute left-3 top-3 bg-white/85 text-slate-700">#{r.displayOrder}</span>
                  <div className="absolute right-3 top-3"><PublishToggle active={r.active} pending={crud.patch.isPending} onToggle={() => crud.patch.mutate({ id: r.id, payload: { active: !r.active } })} /></div>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-extrabold">{r.title}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">{r.subtitle || "No supporting line"}</p>
                  {r.ctaLabel && <p className="accent-text mt-2 truncate text-xs font-bold">{r.ctaLabel} → {r.ctaLink}</p>}
                  <div className="mt-3 flex items-center gap-2 border-t pt-3">
                    <button type="button" onClick={() => startEdit(r)} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <ConfirmDelete pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
