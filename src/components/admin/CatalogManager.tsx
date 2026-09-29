"use client";
import { useState } from "react";
import { GripVertical, ImageOff, LoaderCircle, Pencil, Plus } from "lucide-react";
import { slugify, useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

type Field = { key: string; label: string; multiline?: boolean; placeholder?: string; maxLength?: number; rows?: number };

export type CatalogConfig = {
  endpoint: string;
  noun: string;
  titleKey: "name" | "title";
  titleLabel: string;
  hasSlug: boolean;
  imageKey: "coverImage" | "image";
  fields: Field[];
  emptyHint: string;
};

type Row = { id: string; displayOrder: number; active: boolean; slug?: string } & Record<string, unknown>;

const CATALOGS = {
  programs: {
    endpoint: "/cms/programs", noun: "Program", titleKey: "name", titleLabel: "Program name", hasSlug: true, imageKey: "coverImage",
    emptyHint: "Programs appear on the public Programs page and in search results for “LKG admission Tiruppur”.",
    fields: [
      { key: "ageGroup", label: "Age group", placeholder: "3 – 4 years", maxLength: 60 },
      { key: "description", label: "Short description", multiline: true, placeholder: "One or two sentences for program cards", maxLength: 1000, rows: 3 },
      { key: "detailedDescription", label: "Detailed description", multiline: true, placeholder: "Daily routine, learning focus, class size…", maxLength: 20000, rows: 6 },
    ],
  },
  activities: {
    endpoint: "/cms/activities", noun: "Activity", titleKey: "name", titleLabel: "Activity name", hasSlug: true, imageKey: "image",
    emptyHint: "Activities power the public Activities page.",
    fields: [
      { key: "description", label: "Description", multiline: true, maxLength: 2000, rows: 3 },
      { key: "benefits", label: "Benefits for children", multiline: true, placeholder: "Fine motor skills, confidence, teamwork…", maxLength: 2000, rows: 3 },
    ],
  },
  facilities: {
    endpoint: "/cms/facilities", noun: "Facility", titleKey: "title", titleLabel: "Facility name", hasSlug: false, imageKey: "image",
    emptyHint: "Facilities power the public Facilities page.",
    fields: [
      { key: "description", label: "Description", multiline: true, maxLength: 2000, rows: 3 },
      { key: "icon", label: "Icon name (optional)", placeholder: "e.g. book-open", maxLength: 60 },
    ],
  },
} satisfies Record<string, CatalogConfig>;

function emptyForm(config: CatalogConfig) {
  return { title: "", slug: "", image: "", displayOrder: 0, active: true, extra: Object.fromEntries(config.fields.map((f) => [f.key, ""])) as Record<string, string> };
}

export function CatalogManager({ kind }: { kind: keyof typeof CATALOGS }) {
  const config: CatalogConfig = CATALOGS[kind];
  const crud = useCrud<Row>(config.endpoint, config.noun, { queryKey: [config.endpoint] });
  const [form, setForm] = useState(() => emptyForm(config));
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function reset() { setForm(emptyForm(config)); setSlugTouched(false); setEditingId(null); }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload: Record<string, unknown> = {
      [config.titleKey]: form.title.trim(),
      [config.imageKey]: form.image || null,
      displayOrder: Math.max(0, Number(form.displayOrder) || 0),
      active: form.active,
      ...Object.fromEntries(config.fields.map((f) => [f.key, form.extra[f.key]?.trim() || null])),
    };
    if (config.hasSlug) payload.slug = form.slug.trim() || slugify(form.title);
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: reset });
    else crud.create.mutate(payload, { onSuccess: reset });
  }

  function startEdit(row: Row) {
    setEditingId(row.id);
    setSlugTouched(true);
    setForm({
      title: String(row[config.titleKey] ?? ""),
      slug: String(row.slug ?? ""),
      image: String(row[config.imageKey] ?? ""),
      displayOrder: row.displayOrder ?? 0,
      active: row.active !== false,
      extra: Object.fromEntries(config.fields.map((f) => [f.key, String(row[f.key] ?? "")])),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const rows = crud.rows
    .filter((row) => matches(search, row[config.titleKey], ...config.fields.map((f) => row[f.key])))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
      <form onSubmit={submit} className="panel h-fit xl:sticky xl:top-28">
        <FormTitle editing={Boolean(editingId)} create={`New ${config.noun.toLowerCase()}`} edit={`Edit ${config.noun.toLowerCase()}`} onCancel={reset} />
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5"><span className="label">{config.titleLabel}</span><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugTouched ? form.slug : slugify(e.target.value) })} required minLength={2} maxLength={120} /></label>
          {config.hasSlug && <label className="grid gap-1.5"><span className="label">URL slug</span><input className="input" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: e.target.value }); }} required maxLength={120} /></label>}
          {config.fields.map((field) => (
            <label key={field.key} className="grid gap-1.5">
              <span className="label">{field.label}</span>
              {field.multiline
                ? <textarea className="input" style={{ minHeight: `${(field.rows ?? 3) * 1.7 + 1.6}rem` }} placeholder={field.placeholder} maxLength={field.maxLength} value={form.extra[field.key] ?? ""} onChange={(e) => setForm({ ...form, extra: { ...form.extra, [field.key]: e.target.value } })} />
                : <input className="input" placeholder={field.placeholder} maxLength={field.maxLength} value={form.extra[field.key] ?? ""} onChange={(e) => setForm({ ...form, extra: { ...form.extra, [field.key]: e.target.value } })} />}
            </label>
          ))}
          <ImageField label="Image" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          <div className="grid grid-cols-2 items-end gap-3">
            <label className="grid gap-1.5"><span className="label">Display order</span><input className="input" type="number" min={0} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></label>
            <label className="flex min-h-11 items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Published</label>
          </div>
          <button className="btn-primary" disabled={crud.saving}>
            {crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {crud.saving ? "Saving…" : editingId ? `Update ${config.noun.toLowerCase()}` : `Save ${config.noun.toLowerCase()}`}
          </button>
        </div>
      </form>

      <div>
        <ListToolbar search={search} onSearch={setSearch} placeholder={`Search ${config.noun.toLowerCase()}s…`} count={rows.length} />
        <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No matches" } : { title: `No ${config.noun.toLowerCase()}s yet`, description: config.emptyHint }}>
          <div className="grid gap-3">
            {rows.map((row) => {
              const image = row[config.imageKey] as string | null | undefined;
              const subtitle = config.fields.map((f) => row[f.key]).find((value) => typeof value === "string" && value) as string | undefined;
              return (
                <article key={row.id} className={`panel flex items-center gap-4 p-4 ${editingId === row.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                  <span className="hidden items-center gap-1 text-xs font-black text-slate-300 sm:flex"><GripVertical className="h-4 w-4" />{row.displayOrder}</span>
                  {image
                    ? <img src={image} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                    : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-white/50 text-slate-300"><ImageOff className="h-5 w-5" /></div>}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-extrabold">{String(row[config.titleKey] ?? "")}</h3>
                    {subtitle && <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{subtitle}</p>}
                    {row.slug && <p className="mt-1 text-xs font-bold text-slate-400">/{row.slug}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <PublishToggle active={row.active} pending={crud.patch.isPending} onToggle={() => crud.patch.mutate({ id: row.id, payload: { active: !row.active } })} />
                    <button type="button" onClick={() => startEdit(row)} aria-label="Edit" className="rounded-xl p-2 text-slate-500 hover:bg-white"><Pencil className="h-4 w-4" /></button>
                    <ConfirmDelete compact pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(row.id)} />
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
