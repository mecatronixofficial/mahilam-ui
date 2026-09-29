"use client";
import { useState } from "react";
import { ExternalLink, ImageOff, LoaderCircle, Pencil, Plus } from "lucide-react";
import { slugify, useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, humanize, toDateInput } from "@/lib/media";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-200/60 text-slate-600",
  PUBLISHED: "bg-emerald-100/80 text-emerald-800",
  ARCHIVED: "bg-amber-100/80 text-amber-800",
};

type Blog = { id: string; title: string; slug: string; excerpt?: string | null; content: string; coverImage?: string | null; author?: string | null; category?: string | null; tags?: string[]; seoTitle?: string | null; seoDescription?: string | null; status: Status; publishedAt?: string | null };

const EMPTY_FORM = { title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "", category: "", tags: "", seoTitle: "", seoDescription: "", status: "DRAFT" as Status, publishedAt: "" };
const today = () => new Date().toISOString().slice(0, 10);

export function BlogsManager() {
  const crud = useCrud<Blog>("/cms/blogs", "Post", { queryKey: ["blogs"] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  function reset() { setForm(EMPTY_FORM); setSlugTouched(false); setEditingId(null); }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      coverImage: form.coverImage || null,
      author: form.author.trim() || null,
      category: form.category.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      seoTitle: form.seoTitle.trim() || null,
      seoDescription: form.seoDescription.trim() || null,
      status: form.status,
      publishedAt: form.publishedAt || (form.status === "PUBLISHED" ? today() : null),
    };
    if (editingId) crud.update.mutate({ id: editingId, payload }, { onSuccess: reset });
    else crud.create.mutate(payload, { onSuccess: reset });
  }

  function startEdit(row: Blog) {
    setEditingId(row.id);
    setSlugTouched(true);
    setForm({ title: row.title || "", slug: row.slug || "", excerpt: row.excerpt || "", content: row.content || "", coverImage: row.coverImage || "", author: row.author || "", category: row.category || "", tags: (row.tags || []).join(", "), seoTitle: row.seoTitle || "", seoDescription: row.seoDescription || "", status: row.status || "DRAFT", publishedAt: toDateInput(row.publishedAt) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const rows = crud.rows.filter((row) => (!status || row.status === status) && matches(search, row.title, row.excerpt, row.category, row.author, ...(row.tags || [])));
  const words = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const seoTitle = form.seoTitle || form.title;
  const seoDescription = form.seoDescription || form.excerpt;

  return (
    <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
      <form onSubmit={submit} className="panel h-fit">
        <FormTitle editing={Boolean(editingId)} create="Write a new post" edit="Edit post" onCancel={reset} />
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5"><span className="label">Title</span><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugTouched ? form.slug : slugify(e.target.value) })} required maxLength={200} /></label>
          <label className="grid gap-1.5"><span className="label">URL slug</span>
            <div className="flex items-center overflow-hidden rounded-[14px] border bg-white/70"><span className="whitespace-nowrap border-r px-3 text-xs font-bold text-slate-400">/blog/</span><input className="input !rounded-none !border-0 !bg-transparent !shadow-none" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: slugify(e.target.value) || e.target.value }); }} required /></div>
          </label>
          <label className="grid gap-1.5"><span className="label">Excerpt</span><textarea className="input min-h-16" placeholder="One or two sentences shown on the blog list" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} maxLength={300} /></label>
          <label className="grid gap-1.5">
            <span className="flex justify-between"><span className="label">Content</span><span className="text-xs font-bold text-slate-400">{words} words · ~{Math.max(1, Math.round(words / 200))} min read</span></span>
            <textarea className="input min-h-56 leading-7" placeholder={"Write the article. Leave a blank line between paragraphs.\n\n## Use two hashes for a subheading\n- Start a line with a dash for a bullet"} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </label>
          <ImageField label="Cover image" value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} />
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Author</span><input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Category</span><input className="input" placeholder="Parenting tips" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Tags</span><input className="input" placeholder="admissions, early learning, tiruppur" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Status</span><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>{STATUSES.map((x) => <option key={x} value={x}>{humanize(x)}</option>)}</select></label>
            <label className="grid gap-1.5"><span className="label">Publish date</span><input className="input" type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} /></label>
          </div>

          <details className="rounded-2xl border bg-white/50 p-4" open={Boolean(form.seoTitle || form.seoDescription)}>
            <summary className="cursor-pointer text-sm font-extrabold">Search engine preview</summary>
            <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
              <p className="truncate text-xs text-emerald-700">littlemahilam · blog › {form.slug || "your-post"}</p>
              <p className="mt-1 line-clamp-1 text-lg font-medium text-[#1a0dab]">{seoTitle || "Post title"} | Little Mahilam Preschool</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{seoDescription || "Add an excerpt or SEO description so Google shows a helpful summary."}</p>
            </div>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1.5"><span className="flex justify-between"><span className="label">SEO title</span><span className={`text-xs font-bold ${seoTitle.length > 60 ? "text-rose-600" : "text-slate-400"}`}>{seoTitle.length}/60</span></span><input className="input" value={form.seoTitle} placeholder="Defaults to the post title" onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></label>
              <label className="grid gap-1.5"><span className="flex justify-between"><span className="label">SEO description</span><span className={`text-xs font-bold ${seoDescription.length > 160 ? "text-rose-600" : "text-slate-400"}`}>{seoDescription.length}/160</span></span><textarea className="input min-h-16" value={form.seoDescription} placeholder="Defaults to the excerpt" onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></label>
            </div>
          </details>

          <button className="btn-primary" disabled={crud.saving}>
            {crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {crud.saving ? "Saving…" : editingId ? "Update post" : form.status === "PUBLISHED" ? "Publish post" : "Save draft"}
          </button>
        </div>
      </form>

      <div>
        <ListToolbar search={search} onSearch={setSearch} placeholder="Search posts, tags, authors…" filters={STATUSES.map((x) => ({ value: x, label: humanize(x) }))} filter={status} onFilter={setStatus} count={rows.length} />
        <QueryState query={crud.list} isEmpty={rows.length === 0} empty={crud.rows.length ? { title: "No matches" } : { title: "No posts yet", description: "Helpful articles for parents boost your Google ranking. Write your first one!" }}>
          <div className="grid gap-3">
            {rows.map((r) => (
              <article key={r.id} className={`panel p-5 ${editingId === r.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                <div className="flex gap-4">
                  {r.coverImage
                    ? <img src={r.coverImage} alt="" loading="lazy" className="h-20 w-24 shrink-0 rounded-2xl object-cover" />
                    : <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-white/50 text-slate-300"><ImageOff className="h-5 w-5" /></div>}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold">{r.title}</h3>
                      <span className={`chip ${STATUS_STYLES[r.status] || STATUS_STYLES.DRAFT}`}>{humanize(r.status)}</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-400">{[r.author, r.category, formatDate(r.publishedAt)].filter(Boolean).join(" · ") || "No author"}</p>
                    {r.excerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{r.excerpt}</p>}
                    {!!r.tags?.length && <div className="mt-2 flex flex-wrap gap-1.5">{r.tags.map((t) => <span key={t} className="chip bg-slate-200/50 !py-0.5 text-slate-500">#{t}</span>)}</div>}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                  <button type="button" onClick={() => startEdit(r)} className="btn-soft !px-3 !py-1.5 !text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                  <button type="button" disabled={crud.patch.isPending} onClick={() => crud.patch.mutate({ id: r.id, payload: r.status === "PUBLISHED" ? { status: "DRAFT" } : { status: "PUBLISHED", publishedAt: r.publishedAt ? undefined : today() } })} className="btn-soft !px-3 !py-1.5 !text-xs">
                    {r.status === "PUBLISHED" ? "Unpublish" : "Publish now"}
                  </button>
                  {r.status === "PUBLISHED" && <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer" className="accent-text inline-flex items-center gap-1 px-2 text-xs font-bold">View <ExternalLink className="h-3 w-3" /></a>}
                  <span className="ml-auto"><ConfirmDelete pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} /></span>
                </div>
              </article>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
