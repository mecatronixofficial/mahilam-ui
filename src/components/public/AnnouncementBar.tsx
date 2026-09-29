"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, X } from "lucide-react";
import type { Announcement } from "@/lib/server-api";

const SEEN_KEY = "announcement-seen";

/** Once-per-session announcement dialog. Content is rendered on the server and passed in. */
export function AnnouncementBar({ announcement }: { announcement?: Announcement | null }) {
  const [open, setOpen] = useState(false);
  const itemKey = announcement ? String(announcement.id ?? announcement.title) : null;

  useEffect(() => {
    if (!itemKey) return;
    let seen: string | null = null;
    try { seen = sessionStorage.getItem(SEEN_KEY); } catch { /* storage blocked */ }
    if (seen === itemKey) return;
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [itemKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    try { if (itemKey) sessionStorage.setItem(SEEN_KEY, itemKey); } catch { /* storage blocked */ }
  }

  if (!announcement || !open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="announcement-title">
      <button type="button" aria-label="Close announcement" onClick={close} className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" />
      <div className="glass relative w-full max-w-md animate-pop overflow-hidden rounded-[32px]">
        <div className="mesh-hero relative p-7 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] shadow-lg"><Megaphone className="h-8 w-8 text-emerald-950" /></span>
          <button type="button" onClick={close} aria-label="Close" className="glass-chip absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-emerald-950"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-7 pt-5 text-center">
          <h2 id="announcement-title" className="text-2xl font-bold text-emerald-950">{announcement.title}</h2>
          {announcement.content && <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{announcement.content}</p>}
          <div className="mt-6 grid gap-2">
            {announcement.ctaLabel && announcement.ctaUrl && <Link href={announcement.ctaUrl} onClick={close} className="btn-accent">{announcement.ctaLabel} <ArrowRight className="h-4 w-4" /></Link>}
            <button type="button" onClick={close} className={announcement.ctaLabel ? "btn-soft" : "btn-primary"}>Got it!</button>
          </div>
        </div>
      </div>
    </div>
  );
}
