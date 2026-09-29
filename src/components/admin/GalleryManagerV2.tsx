"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, FolderPlus, ImagePlus, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { slugify } from "@/components/dashboard/useCrud";
import { ConfirmDelete, FormTitle, ImageField, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

type Item = { id: string; imageUrl: string; caption?: string | null; altText?: string | null; active: boolean; displayOrder?: number };
type Album = { id: string; title: string; slug: string; category?: string | null; active: boolean; items?: Item[] };

const EMPTY_ALBUM = { title: "", slug: "", category: "School Life", active: true };
const EMPTY_ITEM = { albumId: "", imageUrl: "", caption: "", altText: "", displayOrder: 0, active: true };

export function GalleryManagerV2() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["gallery"], queryFn: () => api<{ data: Album[] }>("/cms/gallery") });
  const albums = q.data?.data ?? [];

  const [albumForm, setAlbumForm] = useState(EMPTY_ALBUM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [item, setItem] = useState(EMPTY_ITEM);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [search, setSearch] = useState("");

  const refresh = () => { qc.invalidateQueries({ queryKey: ["gallery"] }); qc.invalidateQueries({ queryKey: ["admin-overview"] }); };
  const onError = (error: unknown) => toast.error(errorMessage(error));
  const send = (path: string, method: string, body?: object) => api(path, { method, body: body ? JSON.stringify(body) : undefined });

  const saveAlbum = useMutation({
    mutationFn: () => (editingAlbumId ? send(`/cms/gallery/albums/${editingAlbumId}`, "PATCH", albumForm) : send("/cms/gallery/albums", "POST", { ...albumForm, slug: albumForm.slug || slugify(albumForm.title) })),
    onSuccess: () => { toast.success(editingAlbumId ? "Album updated" : "Album created"); resetAlbum(); refresh(); },
    onError,
  });
  const patchAlbum = useMutation({ mutationFn: ({ id, body }: { id: string; body: object }) => send(`/cms/gallery/albums/${id}`, "PATCH", body), onSuccess: refresh, onError });
  const deleteAlbum = useMutation({ mutationFn: (id: string) => send(`/cms/gallery/albums/${id}`, "DELETE"), onSuccess: () => { toast.success("Album deleted"); refresh(); }, onError });
  const addImage = useMutation({
    mutationFn: () => send("/cms/gallery/items", "POST", item),
    onSuccess: () => { toast.success("Photo added"); setItem((v) => ({ ...EMPTY_ITEM, albumId: v.albumId })); refresh(); },
    onError,
  });
  const patchItem = useMutation({ mutationFn: ({ id, body }: { id: string; body: object }) => send(`/cms/gallery/items/${id}`, "PATCH", body), onSuccess: () => { setEditingItem(null); refresh(); }, onError });
  const deleteItem = useMutation({ mutationFn: (id: string) => send(`/cms/gallery/items/${id}`, "DELETE"), onSuccess: () => { toast.success("Photo removed"); refresh(); }, onError });

  function resetAlbum() { setAlbumForm(EMPTY_ALBUM); setEditingAlbumId(null); setSlugTouched(false); }
  function startEditAlbum(album: Album) {
    setEditingAlbumId(album.id);
    setSlugTouched(true);
    setAlbumForm({ title: album.title || "", slug: album.slug || "", category: album.category || "", active: album.active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const rows = albums.filter((album) => matches(search, album.title, album.category));
  const totalPhotos = albums.reduce((sum, album) => sum + (album.items?.length || 0), 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
      <div className="grid content-start gap-6 xl:sticky xl:top-28 xl:h-fit">
        <form onSubmit={(e) => { e.preventDefault(); saveAlbum.mutate(); }} className="panel">
          <FormTitle editing={Boolean(editingAlbumId)} create="New album" edit="Edit album" onCancel={resetAlbum} />
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5"><span className="label">Album title</span><input className="input" placeholder="Annual Day 2026" value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value, slug: slugTouched ? albumForm.slug : slugify(e.target.value) })} required /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5"><span className="label">Slug</span><input className="input" value={albumForm.slug} onChange={(e) => { setSlugTouched(true); setAlbumForm({ ...albumForm, slug: e.target.value }); }} required /></label>
              <label className="grid gap-1.5"><span className="label">Category</span><input className="input" value={albumForm.category} onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })} /></label>
            </div>
            <label className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={albumForm.active} onChange={(e) => setAlbumForm({ ...albumForm, active: e.target.checked })} />Published</label>
            <button className="btn-primary" disabled={saveAlbum.isPending}>{saveAlbum.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}{editingAlbumId ? "Update album" : "Create album"}</button>
          </div>
        </form>

        <form onSubmit={(e) => { e.preventDefault(); addImage.mutate(); }} className="panel">
          <div><p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">Upload</p><h2 className="mt-1 text-xl font-extrabold">Add a photo</h2></div>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5"><span className="label">Album</span>
              <select className="input" value={item.albumId} onChange={(e) => setItem({ ...item, albumId: e.target.value })} required>
                <option value="">Choose album</option>
                {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </label>
            <ImageField label="Photo" heightClass="h-36" value={item.imageUrl} onChange={(url) => setItem((v) => ({ ...v, imageUrl: url }))} uploadLabel="Upload photo" />
            <label className="grid gap-1.5"><span className="label">Caption</span><input className="input" value={item.caption} onChange={(e) => setItem({ ...item, caption: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Alt text <span className="font-semibold text-slate-400">(describe the photo for screen readers &amp; Google)</span></span><input className="input" placeholder="Children painting with watercolours" value={item.altText} onChange={(e) => setItem({ ...item, altText: e.target.value })} /></label>
            <button className="btn-primary" disabled={addImage.isPending || !item.imageUrl || !item.albumId}>{addImage.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}Add to album</button>
            <p className="text-xs font-semibold text-slate-400">Only share photos that families have consented to publish.</p>
          </div>
        </form>
      </div>

      <div>
        <ListToolbar search={search} onSearch={setSearch} placeholder="Search albums…" count={rows.length} actions={<span className="chip bg-white/70 text-slate-500">{totalPhotos} photos</span>} />
        <QueryState query={q} isEmpty={rows.length === 0} empty={albums.length ? { title: "No matching albums" } : { title: "No albums yet", description: "Create an album, then add photos to fill the public gallery." }}>
          <div className="grid gap-4">
            {rows.map((album) => (
              <section key={album.id} className={`panel p-5 ${editingAlbumId === album.id ? "ring-2 ring-[var(--dash-accent)]" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold">{album.title}</h3>
                    <p className="text-sm font-semibold text-slate-500">{album.category || "Uncategorized"} · {album.items?.length || 0} photos · /gallery#{album.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PublishToggle active={album.active} pending={patchAlbum.isPending} onToggle={() => patchAlbum.mutate({ id: album.id, body: { active: !album.active } })} />
                    <button type="button" onClick={() => startEditAlbum(album)} aria-label="Edit album" className="rounded-xl p-2 text-slate-500 hover:bg-white"><Pencil className="h-4 w-4" /></button>
                    <ConfirmDelete compact label="Delete album" pending={deleteAlbum.isPending} onConfirm={() => deleteAlbum.mutate(album.id)} />
                  </div>
                </div>
                {album.items?.length ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {album.items.map((photo) => (
                      <figure key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                        <img src={photo.imageUrl} alt={photo.altText || photo.caption || album.title} loading="lazy" className={`h-full w-full object-cover transition group-hover:scale-105 ${photo.active ? "" : "opacity-40 grayscale"}`} />
                        {!photo.active && <span className="chip absolute left-1.5 top-1.5 bg-white/90 !px-2 !py-0.5 text-[10px] text-slate-600">Hidden</span>}
                        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                          <button type="button" onClick={() => setEditingItem(photo)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700" aria-label="Edit photo"><Pencil className="h-3 w-3" /></button>
                          <button type="button" onClick={() => patchItem.mutate({ id: photo.id, body: { active: !photo.active } })} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700" aria-label={photo.active ? "Hide photo" : "Show photo"}>{photo.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</button>
                          <button type="button" onClick={() => { if (window.confirm("Delete this photo?")) deleteItem.mutate(photo.id); }} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-600" aria-label="Delete photo"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <button type="button" onClick={() => { setItem((v) => ({ ...v, albumId: album.id })); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-6 text-sm font-bold text-slate-400 hover:bg-white/60">
                    <Plus className="h-4 w-4" /> Add the first photo
                  </button>
                )}
              </section>
            ))}
          </div>
        </QueryState>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Edit photo">
          <button type="button" className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setEditingItem(null)} aria-label="Close" />
          <form onSubmit={(e) => { e.preventDefault(); patchItem.mutate({ id: editingItem.id, body: { caption: editingItem.caption || null, altText: editingItem.altText || null, active: editingItem.active } }); }} className="panel-glass relative w-full max-w-md animate-pop !bg-white/85 p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Edit photo</h2><button type="button" onClick={() => setEditingItem(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
            <img src={editingItem.imageUrl} alt="" className="mt-4 h-44 w-full rounded-2xl object-cover" />
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1.5"><span className="label">Caption</span><input className="input" value={editingItem.caption || ""} onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })} /></label>
              <label className="grid gap-1.5"><span className="label">Alt text</span><input className="input" value={editingItem.altText || ""} onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })} /></label>
              <label className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><input type="checkbox" className="h-4 w-4 rounded" checked={editingItem.active} onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })} />Visible on website</label>
              <button className="btn-primary" disabled={patchItem.isPending}>{patchItem.isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}Save photo</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
