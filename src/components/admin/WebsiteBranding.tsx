"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { LOGO_TYPES, validateLogo, type Branding } from "@/lib/branding";
import { BrandLogo } from "@/components/public/BrandLogo";

export function WebsiteBranding() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["branding"], queryFn: () => api<{ data: Branding }>("/branding", { cache: "no-store" }) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const selection = useRef(0);
  useEffect(() => { if (!file) { setPreview(""); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  function cancel() { selection.current++; setFile(null); setError(""); if (input.current) input.current.value = ""; }
  async function select(next?: File) {
    const version = ++selection.current;
    setFile(null); setError("");
    if (!next) return;
    try { await validateLogo(next); if (version === selection.current) setFile(next); }
    catch (e) { if (version === selection.current) { setError(errorMessage(e)); if (input.current) input.current.value = ""; } }
  }
  async function save(restore = false) {
    if (!restore && !file) return;
    setBusy(true); setError("");
    try {
      const body = new FormData(); if (file) body.append("file", file);
      const result = await api<{ data: Branding }>("/admin/branding/logo", { method: restore ? "DELETE" : "POST", ...(!restore ? { body } : {}) });
      qc.setQueryData(["branding"], result);
      await qc.invalidateQueries({ queryKey: ["settings"] });
      cancel(); toast.success(restore ? "Default logo restored" : "Website logo saved");
    } catch (e) { setError(errorMessage(e)); toast.error(errorMessage(e)); }
    finally { setBusy(false); }
  }
  return <section className="panel lg:col-span-2">
    <h2 className="text-lg font-extrabold">Website Branding</h2>
    <p className="mt-1 text-sm text-little-neutral-500">Manage the logo shown in the website header and footer.</p>
    {query.isError && <p role="alert" className="mt-3 text-sm text-little-coral-600">Could not load current branding. <button type="button" onClick={() => query.refetch()} className="underline">Retry</button></p>}
    <div className="mt-4 flex flex-wrap gap-8">
      <div><p className="label mb-2">Current header logo</p>{query.isPending ? <p>Loading…</p> : <BrandLogo branding={query.data?.data} className="h-[68px] w-[136px]" />}</div>
      {preview && <div><p className="label mb-2">New logo preview</p><img src={preview} alt="Selected logo preview" className="h-[68px] w-[136px] object-contain" /></div>}
    </div>
    <label className="mt-5 grid gap-2"><span className="label">Upload or replace logo</span><input ref={input} type="file" accept={LOGO_TYPES.join(",")} disabled={busy} onChange={(e) => select(e.target.files?.[0])} /><span className="text-xs text-little-neutral-500">PNG, JPEG or WebP · maximum 2 MB · SVG is rejected</span></label>
    {error && <p role="alert" className="mt-3 text-sm text-little-coral-600">{error}</p>}
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" className="btn-primary" disabled={busy || !file} onClick={() => save()}>{busy ? "Saving…" : "Save branding"}</button>
      <button type="button" className="btn-secondary" disabled={busy || !file} onClick={cancel}>Cancel</button>
      <button type="button" className="btn-secondary" disabled={busy || !query.data?.data.logoUrl} onClick={() => save(true)}>Restore default logo</button>
    </div>
    <p className="mt-3 text-xs text-little-neutral-500">Changes appear on the public website after refresh.</p>
  </section>;
}
