"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Right-hand glass sheet for create/edit forms. Escape or backdrop click closes it. */
export function Drawer({ open, onClose, title, eyebrow, children, width = "max-w-2xl" }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: React.ReactNode; width?: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const fields = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]');
        if (!fields?.length) return;
        const first = fields[0], last = fields[fields.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("input, select, textarea")?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-little-neutral-950/35 backdrop-blur-[3px]" />
      <div ref={panel} className={`panel-glass relative flex h-full w-full ${width} animate-fade-up flex-col !rounded-none !bg-white/95 shadow-2xl sm:m-3 sm:h-[calc(100%-1.5rem)] sm:!rounded-[28px]`}>
        <header className="flex items-center justify-between gap-3 border-b bg-white/60 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            {eyebrow && <p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">{eyebrow}</p>}
            <h2 className="mt-0.5 text-xl font-extrabold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white/70 text-little-neutral-500 hover:text-little-neutral-900"><X className="h-4 w-4" /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
