"use client";
import { isPageContentKey } from "@/lib/page-content";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock3, Code2, Globe2, KeyRound, LoaderCircle, MapPin, Phone, Save, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { ConfirmDelete } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { WebsiteBranding } from "./WebsiteBranding";

type Setting = { id: string; key: string; value: unknown; updatedAt?: string };

/** Well-known keys. `school.*`, `site.*`, `social.*` and `public.*` are readable by the public site. */
const GROUPS: { title: string; icon: LucideIcon; fields: { key: string; label: string; placeholder: string; multiline?: boolean }[] }[] = [
  { title: "Contact", icon: Phone, fields: [
    { key: "school.phone", label: "Phone number", placeholder: "+91 98765 43210" },
    { key: "school.whatsapp", label: "WhatsApp number", placeholder: "+91 98765 43210" },
    { key: "school.email", label: "Email address", placeholder: "hello@littlemahilam.in" },
  ] },
  { title: "Timings", icon: Clock3, fields: [
    { key: "school.hours", label: "School hours", placeholder: "Mon–Fri 9:00 AM – 3:30 PM", multiline: true },
    { key: "school.officeHours", label: "Office / visit hours", placeholder: "Mon–Sat 9:30 AM – 1:00 PM" },
  ] },
  { title: "Location", icon: MapPin, fields: [
    { key: "school.address", label: "Address", placeholder: "56/11A, 2nd Street, Kangayam Road, Tiruppur", multiline: true },
    { key: "school.mapUrl", label: "Google Maps link", placeholder: "https://maps.app.goo.gl/…" },
  ] },
  { title: "Social profiles", icon: Share2, fields: [
    { key: "social.instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
    { key: "social.facebook", label: "Facebook", placeholder: "https://facebook.com/…" },
    { key: "social.youtube", label: "YouTube", placeholder: "https://youtube.com/@…" },
  ] },
  { title: "Website", icon: Globe2, fields: [
    { key: "site.admissionsBanner", label: "Admissions status line", placeholder: "Admissions open for 2027–28" },
  ] },
];
const KNOWN = new Set([...GROUPS.flatMap((group) => group.fields.map((field) => field.key)), "branding.logo"]);

const asText = (value: unknown) => (typeof value === "string" ? value : value == null ? "" : JSON.stringify(value));

export function SettingsManager() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["settings"], queryFn: () => api<{ data: Setting[] }>("/cms/settings") });
  const rows = q.data?.data ?? [];
  const [values, setValues] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState({ key: "", value: "" });

  useEffect(() => {
    if (q.data) setValues(Object.fromEntries(q.data.data.map((row) => [row.key, asText(row.value)])));
  }, [q.data]);

  const save = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => api("/cms/settings", { method: "POST", body: JSON.stringify({ key, value }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
  const remove = useMutation({
    mutationFn: (key: string) => api(`/cms/settings/${encodeURIComponent(key)}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Setting removed"); qc.invalidateQueries({ queryKey: ["settings"] }); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  async function saveGroup(keys: string[]) {
    const saved = Object.fromEntries(rows.map((row) => [row.key, asText(row.value)]));
    const changed = keys.filter((key) => (values[key] ?? "") !== (saved[key] ?? "") && (values[key] ?? "").trim());
    if (!changed.length) { toast.info("No changes to save"); return; }
    try {
      await Promise.all(changed.map((key) => save.mutateAsync({ key, value: values[key].trim() })));
      toast.success(`Saved ${changed.length} ${changed.length === 1 ? "setting" : "settings"}`);
    } catch (error) {
      toast.error(errorMessage(error, "Some settings couldn't be saved."));
    }
  }

  const customRows = rows.filter((row) => !KNOWN.has(row.key) && !isPageContentKey(row.key) && !row.key.startsWith("public.website.photos."));

  return (
    <QueryState query={q}>
      <div className="grid gap-5 lg:grid-cols-2">
        <WebsiteBranding />
        {GROUPS.map(({ title, icon: Icon, fields }) => (
          <form key={title} onSubmit={(e) => { e.preventDefault(); saveGroup(fields.map((f) => f.key)); }} className="panel">
            <div className="flex items-center gap-3"><span className="accent-bg flex h-10 w-10 items-center justify-center rounded-xl"><Icon className="h-5 w-5" /></span><h2 className="text-lg font-extrabold">{title}</h2></div>
            <div className="mt-4 grid gap-3">
              {fields.map((field) => (
                <label key={field.key} className="grid gap-1.5">
                  <span className="flex items-center justify-between"><span className="label">{field.label}</span><code className="text-[10px] font-bold text-little-neutral-500">{field.key}</code></span>
                  {field.multiline
                    ? <textarea className="input min-h-20" placeholder={field.placeholder} value={values[field.key] ?? ""} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} />
                    : <input className="input" placeholder={field.placeholder} value={values[field.key] ?? ""} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} />}
                </label>
              ))}
              <button className="btn-primary w-fit" disabled={save.isPending}>{save.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save {title.toLowerCase()}</button>
            </div>
          </form>
        ))}

        <section className="panel overflow-hidden !p-0 lg:col-span-2">
          <div className="flex items-start gap-3 border-b bg-gradient-to-r from-little-neutral-50 to-white px-5 py-5 sm:px-7 sm:py-6">
            <span className="accent-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"><Code2 className="h-5 w-5" /></span>
            <div className="min-w-0"><h2 className="text-lg font-extrabold sm:text-xl">Advanced settings</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-little-neutral-500">Create a custom public setting using a key and value. Use a permitted prefix so the value can safely appear on the website.</p></div>
          </div>

          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <div className="mb-5 flex flex-wrap gap-2 text-[11px] font-bold text-little-neutral-500">
              <span className="rounded-full bg-little-neutral-100 px-3 py-1"><code>school.*</code></span><span className="rounded-full bg-little-neutral-100 px-3 py-1"><code>site.*</code></span><span className="rounded-full bg-little-neutral-100 px-3 py-1"><code>social.*</code></span><span className="rounded-full bg-little-neutral-100 px-3 py-1"><code>public.*</code></span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate({ key: custom.key.trim(), value: custom.value.trim() }, { onSuccess: () => { toast.success("Setting saved"); setCustom({ key: "", value: "" }); }, onError: (error) => toast.error(errorMessage(error)) }); }} className="grid items-end gap-4 lg:grid-cols-[minmax(220px,.8fr)_minmax(300px,1.5fr)_auto]">
              <label className="grid gap-1.5"><span className="label flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5" />Setting key</span><input className="input" placeholder="public.example" value={custom.key} onChange={(e) => setCustom({ ...custom, key: e.target.value })} required pattern="(?:school|site|social|public)\.[A-Za-z0-9._-]+" title="Start with school., site., social. or public." /></label>
              <label className="grid gap-1.5"><span className="label">Setting value</span><input className="input" placeholder="Enter the value shown on the website" value={custom.value} onChange={(e) => setCustom({ ...custom, value: e.target.value })} required /></label>
              <button className="btn-primary min-h-11 justify-center lg:min-w-28" disabled={save.isPending}>{save.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{save.isPending ? "Saving…" : "Save"}</button>
            </form>

            <div className="mt-6 overflow-hidden rounded-2xl border border-little-neutral-200 bg-white/60">
              <div className="border-b bg-little-neutral-50/80 px-4 py-3 text-xs font-extrabold uppercase tracking-[.12em] text-little-neutral-500">Saved custom settings <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-[10px] text-little-neutral-500">{customRows.length}</span></div>
              <div className="divide-y divide-little-neutral-100">
            {customRows.map((row) => (
              <div key={row.id} className="grid items-center gap-2 px-4 py-3.5 sm:grid-cols-[minmax(150px,220px)_1fr_auto] sm:gap-4">
                <code className="min-w-0 truncate rounded-lg bg-little-neutral-100 px-2.5 py-1.5 text-xs font-bold text-little-neutral-700">{row.key}</code>
                <span className="min-w-0 break-words text-sm leading-6 text-little-neutral-500">{asText(row.value)}</span>
                <ConfirmDelete compact pending={remove.isPending} onConfirm={() => remove.mutate(row.key)} />
              </div>
            ))}
            {!customRows.length && <div className="px-5 py-9 text-center"><Code2 className="mx-auto h-7 w-7 text-little-neutral-300" /><p className="mt-2 text-sm font-bold text-little-neutral-500">No custom settings yet</p><p className="mt-1 text-xs text-little-neutral-500">Create one using the form above.</p></div>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </QueryState>
  );
}
