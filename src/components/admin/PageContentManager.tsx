"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { contentKey, PAGE_SECTIONS, parseSectionContent, type ContentSection, type PageId } from "@/lib/page-content";
import { ImageField } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

type Setting = { key: string; value: unknown };

export function PageContentManager({ page }: { page: PageId }) {
  const query = useQuery({ queryKey: ["settings"], queryFn: () => api<{ data: Setting[] }>("/cms/settings") });
  const rows = query.data?.data ?? [];
  return <>
    <div className="panel mb-5 p-4 flex flex-wrap items-center justify-between gap-3">
      <p className="max-w-2xl text-sm text-little-neutral-600">Edit each section, upload photos and save to publish. Empty fields use the original website content. Uploading a photo adds it to this form; save the section to show it on the website.</p>
      <a className="btn-soft" href={page === "home" ? "/" : "/about"} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />View page</a>
    </div>
    {page === "home" && <div className="panel mb-5 p-4 flex flex-wrap gap-4 text-sm">
      <Link className="accent-text font-bold underline" href="/admin/banners">Hero slides: headings and images</Link>
      <Link className="accent-text font-bold underline" href="/admin/programs">Program cards: headings and images</Link>
      <Link className="accent-text font-bold underline" href="/admin/gallery">Gallery photos</Link>
      <p className="w-full text-little-neutral-600">Published hero slides replace the default hero below. Happy moments use the selected school photos until you upload section photos.</p>
    </div>}
    <QueryState query={query}>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        {PAGE_SECTIONS[page].map((section) => {
          const saved = rows.find((row) => row.key === contentKey(page, section.id))?.value;
          return <SectionEditor key={`${page}:${section.id}:${JSON.stringify(saved)}`} settingKey={contentKey(page, section.id)} section={section} saved={saved} />;
        })}
      </div>
    </QueryState>
  </>;
}

export function SectionEditor({ settingKey, section, saved }: { settingKey: string; section: ContentSection; saved: unknown }) {
  const client = useQueryClient();
  const initial = parseSectionContent(saved, section);
  const [draft, setDraft] = useState(initial);
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const uploading = Object.values(uploads).some(Boolean);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const save = useMutation({
    mutationFn: () => api("/cms/settings", { method: "POST", body: JSON.stringify({ key: settingKey, value: parseSectionContent(draft, section) }) }),
    onSuccess: async () => { setDraft(parseSectionContent(draft, section)); toast.success(`${section.title} published`); await client.invalidateQueries({ queryKey: ["settings"] }); },
    onError: (error) => toast.error(errorMessage(error, "Couldn't save this section.")),
  });
  return <form className="panel grid gap-4" onSubmit={(event) => { event.preventDefault(); if (!uploading && !save.isPending && dirty) save.mutate(); }}>
    <h2 className="text-lg font-extrabold">{section.title}</h2>
    <fieldset disabled={save.isPending} className="grid min-w-0 gap-4 disabled:opacity-70">
      {section.fields.map((field) => <label key={field.key} className="grid gap-1.5">
        <span className="label">{field.label}</span>
        {field.multiline
          ? <textarea className="input min-h-24" maxLength={5000} placeholder={field.fallback} value={draft.text[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, text: { ...draft.text, [field.key]: event.target.value } })} />
          : <input className="input" maxLength={300} placeholder={field.fallback} value={draft.text[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, text: { ...draft.text, [field.key]: event.target.value } })} />}
      </label>)}
      {section.photos.map((photo) => <div key={photo.key} className="grid gap-3 rounded-xl border p-3">
        {photo.fallback && !draft.images[photo.key]?.url && <div><p className="label mb-2">Built-in photo: {photo.label}</p><img src={photo.fallback} alt={photo.alt} className="h-32 w-full rounded-lg object-cover" loading="lazy" /></div>}
        <ImageField onUploadBusyChange={(busy) => setUploads((current) => ({ ...current, [photo.key]: busy }))} label={photo.label} value={draft.images[photo.key]?.url ?? ""} onChange={(url) => setDraft((current) => ({ ...current, images: { ...current.images, [photo.key]: { url, alt: current.images[photo.key]?.alt ?? "" } } }))} />
        <label className="grid gap-1.5"><span className="label">Photo description</span><input className="input" maxLength={300} disabled={!draft.images[photo.key]?.url} placeholder={photo.alt} value={draft.images[photo.key]?.alt ?? ""} onChange={(event) => setDraft({ ...draft, images: { ...draft.images, [photo.key]: { url: draft.images[photo.key]?.url ?? "", alt: event.target.value } } })} /></label>
      </div>)}
    </fieldset>
    <div className="flex flex-wrap items-center gap-2 border-t pt-3">
      <button className="btn-primary" disabled={!dirty || save.isPending || uploading}>{save.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{uploading ? "Uploading photo…" : save.isPending ? "Saving…" : "Save section"}</button>
      <button type="button" className="btn-soft" disabled={!dirty || save.isPending || uploading} onClick={() => setDraft(initial)}>Discard changes</button>
      <button type="button" className="btn-soft" disabled={save.isPending || uploading || (!Object.keys(draft.text).length && !Object.keys(draft.images).length)} onClick={() => setDraft({ text: {}, images: {} })}>Restore defaults</button>
    </div>
  </form>;
}

