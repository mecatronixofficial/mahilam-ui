"use client";
import { useState } from "react";
import { LoaderCircle, Search, Trash2, X } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

/** Search box + optional filter chips + result count, shown above every list. */
export function ListToolbar({
  search,
  onSearch,
  placeholder = "Search…",
  filters,
  filter,
  onFilter,
  count,
  actions,
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  filters?: readonly { value: string; label: string }[];
  filter?: string;
  onFilter?: (value: string) => void;
  count?: number;
  actions?: React.ReactNode;
}) {
  return (
    <div className="panel mb-4 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
      <label className="relative flex-1">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} className="input !min-h-10 !bg-white/60 !pl-10" />
      </label>
      {filters && onFilter && (
        <div className="hide-scrollbar flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Filter">
          {[{ value: "", label: "All" }, ...filters].map((option) => (
            <button
              key={option.value || "all"}
              type="button"
              role="tab"
              aria-selected={filter === option.value}
              onClick={() => onFilter(option.value)}
              className={`chip shrink-0 border transition ${filter === option.value ? "dash-nav-active border-transparent" : "bg-white/60 text-slate-500 hover:bg-white"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        {typeof count === "number" && <span className="whitespace-nowrap text-xs font-bold text-slate-400">{count} {count === 1 ? "result" : "results"}</span>}
        {actions}
      </div>
    </div>
  );
}

/** Two-step inline delete, so nothing is removed by a single mis-click. */
export function ConfirmDelete({ onConfirm, pending, label = "Delete", compact = false }: { onConfirm: () => void; pending?: boolean; label?: string; compact?: boolean }) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} aria-label={label} title={label} className={`inline-flex items-center gap-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 ${compact ? "p-2" : "px-3 py-1.5"}`}>
        <Trash2 className="h-3.5 w-3.5" />{!compact && label}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold">
      {!compact && <span className="text-slate-500">Are you sure?</span>}
      <button type="button" onClick={onConfirm} disabled={pending} className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-white disabled:opacity-60">
        {pending && <LoaderCircle className="h-3 w-3 animate-spin" />}Delete
      </button>
      <button type="button" onClick={() => setAsking(false)} className="rounded-lg border bg-white/70 px-2.5 py-1.5 text-slate-500">Cancel</button>
    </span>
  );
}

/** Published / hidden pill that toggles on click. */
export function PublishToggle({ active, onToggle, pending, on = "Published", off = "Hidden" }: { active: boolean; onToggle: () => void; pending?: boolean; on?: string; off?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      aria-pressed={active}
      className={`chip shrink-0 transition disabled:opacity-60 ${active ? "bg-emerald-100/80 text-emerald-800 hover:bg-emerald-100" : "bg-slate-200/60 text-slate-500 hover:bg-slate-200"}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />{active ? on : off}
    </button>
  );
}

/** Image preview with remove button, or an uploader when empty. */
export function ImageField({ label, value, onChange, heightClass = "h-40", uploadLabel }: { label: string; value: string; onChange: (url: string) => void; heightClass?: string; uploadLabel?: string }) {
  return (
    <div className="grid gap-1.5">
      <span className="label">{label}</span>
      {value ? (
        <div className="group relative overflow-hidden rounded-2xl border bg-white/60">
          <img src={value} alt="" className={`${heightClass} w-full object-cover`} />
          <button type="button" onClick={() => onChange("")} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow hover:bg-white" aria-label={`Remove ${label.toLowerCase()}`}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <ImageUpload label={uploadLabel ?? `Upload ${label.toLowerCase()}`} onUploaded={onChange} />
      )}
    </div>
  );
}

export function FormTitle({ editing, create, edit, onCancel }: { editing: boolean; create: string; edit: string; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">{editing ? "Editing" : "Create new"}</p>
        <h2 className="mt-1 text-xl font-extrabold">{editing ? edit : create}</h2>
      </div>
      {editing && (
        <button type="button" onClick={onCancel} className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-white/80">
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      )}
    </div>
  );
}

export function matches(query: string, ...values: unknown[]) {
  const q = query.trim().toLowerCase();
  return !q || values.some((value) => String(value ?? "").toLowerCase().includes(q));
}
