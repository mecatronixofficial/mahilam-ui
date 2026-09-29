"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Right-hand glass sheet for create/edit forms. Escape or backdrop click closes it. */
export function Drawer({ open, onClose, title, eyebrow, children, width = "max-w-2xl" }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: React.ReactNode; width?: string }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("input, select, textarea")?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-950/35 backdrop-blur-[3px]" />
      <div ref={panel} className={`panel-glass relative flex h-full w-full ${width} animate-fade-up flex-col !rounded-none !bg-white/80 sm:m-3 sm:h-[calc(100%-1.5rem)] sm:!rounded-[28px]`}>
        <header className="flex items-center justify-between gap-3 border-b px-6 py-5">
          <div>
            {eyebrow && <p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">{eyebrow}</p>}
            <h2 className="mt-0.5 text-xl font-extrabold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white/70 text-slate-500 hover:text-slate-900"><X className="h-4 w-4" /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
