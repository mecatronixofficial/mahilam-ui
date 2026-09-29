"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Globe2, Search } from "lucide-react";
import { NAV, type NavItem } from "./nav";

type Entry = Pick<NavItem, "href" | "label" | "helper" | "icon"> & { section: string };

/** Ctrl/⌘ + K quick-jump across both workspaces the user can access. */
export function CommandPalette({ open, onClose, canUseCms }: { open: boolean; onClose: () => void; canUseCms: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const entries = useMemo<Entry[]>(() => [
    ...NAV.crm.map((item) => ({ ...item, section: "School CRM" })),
    ...(canUseCms ? NAV.admin.map((item) => ({ ...item, section: "Website CMS" })) : []),
    { href: "/", label: "Public website", helper: "Open the school website", icon: Globe2, section: "Website" },
  ], [canUseCms]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? entries.filter((entry) => `${entry.label} ${entry.helper} ${entry.section}`.toLowerCase().includes(q)) : entries;
  }, [entries, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  function go(entry?: Entry) {
    if (!entry) return;
    onClose();
    router.push(entry.href);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Quick navigation">
      <button type="button" aria-label="Close quick navigation" onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="panel-glass relative w-full max-w-xl animate-fade-up overflow-hidden !bg-white/80">
        <div className="flex items-center gap-3 border-b px-5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
              if (event.key === "ArrowDown") { event.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
              if (event.key === "ArrowUp") { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
              if (event.key === "Enter") go(results[active]);
            }}
            placeholder="Jump to a page…"
            className="h-14 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-slate-400"
            aria-label="Search pages"
          />
          <span className="kbd">Esc</span>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {results.map((entry, index) => {
            const Icon = entry.icon;
            return (
              <li key={`${entry.section}-${entry.href}`} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(entry)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${index === active ? "bg-slate-900/[.06]" : ""}`}
                >
                  <span className="accent-bg flex h-9 w-9 items-center justify-center rounded-xl"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{entry.label}</span>
                    <span className="block truncate text-xs text-slate-500">{entry.section} · {entry.helper}</span>
                  </span>
                  {index === active && <CornerDownLeft className="h-4 w-4 text-slate-400" />}
                </button>
              </li>
            );
          })}
          {results.length === 0 && <li className="px-4 py-10 text-center text-sm font-bold text-slate-400">No pages match “{query}”.</li>}
        </ul>
      </div>
    </div>
  );
}
