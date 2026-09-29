"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock3, Globe2, LoaderCircle, Mail, MapPin, Phone, Save, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { ConfirmDelete } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

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
const KNOWN = new Set(GROUPS.flatMap((group) => group.fields.map((field) => field.key)));

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

  const customRows = rows.filter((row) => !KNOWN.has(row.key));

  return (
    <QueryState query={q}>
      <div className="grid gap-5 lg:grid-cols-2">
        {GROUPS.map(({ title, icon: Icon, fields }) => (
          <form key={title} onSubmit={(e) => { e.preventDefault(); saveGroup(fields.map((f) => f.key)); }} className="panel">
            <div className="flex items-center gap-3"><span className="accent-bg flex h-10 w-10 items-center justify-center rounded-xl"><Icon className="h-5 w-5" /></span><h2 className="text-lg font-extrabold">{title}</h2></div>
            <div className="mt-4 grid gap-3">
              {fields.map((field) => (
                <label key={field.key} className="grid gap-1.5">
                  <span className="flex items-center justify-between"><span className="label">{field.label}</span><code className="text-[10px] font-bold text-slate-400">{field.key}</code></span>
                  {field.multiline
                    ? <textarea className="input min-h-20" placeholder={field.placeholder} value={values[field.key] ?? ""} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} />
                    : <input className="input" placeholder={field.placeholder} value={values[field.key] ?? ""} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} />}
                </label>
              ))}
              <button className="btn-primary w-fit" disabled={save.isPending}>{save.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save {title.toLowerCase()}</button>
            </div>
          </form>
        ))}

        <section className="panel lg:col-span-2">
          <div className="flex items-center gap-3"><span className="accent-bg flex h-10 w-10 items-center justify-center rounded-xl"><Mail className="h-5 w-5" /></span><div><h2 className="text-lg font-extrabold">Advanced settings</h2><p className="text-sm text-slate-500">Custom keys. Only keys starting with <code>school.</code>, <code>site.</code>, <code>social.</code> or <code>public.</code> are visible to the public website.</p></div></div>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate({ key: custom.key.trim(), value: custom.value }, { onSuccess: () => { toast.success("Setting saved"); setCustom({ key: "", value: "" }); }, onError: (error) => toast.error(errorMessage(error)) }); }} className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input className="input" placeholder="public.key" value={custom.key} onChange={(e) => setCustom({ ...custom, key: e.target.value })} required pattern="[A-Za-z0-9._-]+" title="Letters, numbers, dots, dashes and underscores" />
            <input className="input" placeholder="Value" value={custom.value} onChange={(e) => setCustom({ ...custom, value: e.target.value })} required />
            <button className="btn-primary" disabled={save.isPending}><Save className="h-4 w-4" />Save</button>
          </form>
          <div className="mt-4 divide-y rounded-2xl border bg-white/50">
            {customRows.map((row) => (
              <div key={row.id} className="flex items-center gap-4 px-4 py-3">
                <code className="w-48 shrink-0 truncate text-xs font-bold text-slate-600">{row.key}</code>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-500">{asText(row.value)}</span>
                <ConfirmDelete compact pending={remove.isPending} onConfirm={() => remove.mutate(row.key)} />
              </div>
            ))}
            {!customRows.length && <p className="px-4 py-6 text-center text-sm font-bold text-slate-400">No custom settings.</p>}
          </div>
        </section>
      </div>
    </QueryState>
  );
}
