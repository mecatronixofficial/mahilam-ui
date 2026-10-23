"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { telHref } from "@/lib/site";
import type { Branding } from "@/lib/branding";
import { BrandLogo } from "./BrandLogo";
import { ALL_LINKS, isActive } from "./navLinks";
import styles from "./navbar.module.css";

/**
 * Mobile/tablet menu: a playful drawer that slides in from the right. Links bounce in one after another;
 * Escape, the ✕ or a tap outside closes it, focus moves in on open and Tab stays inside.
 */
export function KidsDrawer({ open, onClose, pathname, phone, branding, onNavigate }: { open: boolean; onClose: () => void; pathname: string; phone?: string; branding?: Branding; onNavigate: (href: string) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key === "Tab" && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>("a, button"));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { root.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-[60] overflow-hidden xl:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Backdrop */}
      <button type="button" tabIndex={-1} aria-label="Close menu" onClick={onClose} className={`absolute inset-0 bg-little-green-950/40 backdrop-blur-[3px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />

      <div
        ref={panel}
        id="kids-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[min(90vw,400px)] flex-col overflow-hidden rounded-l-[36px] bg-white shadow-2xl transition-transform duration-500 ease-(--ease-smooth) motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className={`${styles.drawerHeader} shrink-0 bg-little-cream px-5 pb-5 pt-4`}>
          <div className="flex items-center justify-between gap-4">
            <BrandLogo branding={branding} className={`${styles.drawerLogo} h-16 w-32`} />
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-little-green-200 text-little-green-950 transition-colors hover:bg-little-green-100">
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>
          <p className={`${styles.drawerIntro} mt-3 font-display text-2xl font-medium text-little-green-900`}>A happy place to explore.</p>
          <p className={`${styles.drawerIntro} mt-1 text-xs text-little-neutral-600`}>Discover life at Little Mahilam</p>
        </div>

        {/* Links */}
        <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <ul className="grid gap-1">
            {ALL_LINKS.map(({ href, label, note, icon: Icon, tile, ink }, i) => {
              const active = isActive(pathname, href);
              return (
                <li
                  key={href}
                  className={`transition-[opacity,translate,scale] duration-500 ease-(--ease-back-strong) motion-reduce:transition-none ${open ? "" : "translate-x-8 scale-90 opacity-0"}`}
                  style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
                >
                  <Link
                    href={href}
                    onClick={() => onNavigate(href)}
                    aria-current={active ? "page" : undefined}
                    className={styles.drawerLink}
                  >
                    <span className={styles.linkIcon} style={{ "--tile": tile, "--icon-ink": ink } as CSSProperties}>
                      <Icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1"><span className={styles.linkLabel}>{label}</span><span className={styles.linkNote}>{note}</span></span>
                    {active && <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-little-green-600" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className={`${styles.drawerFooter} shrink-0 space-y-2 border-t border-little-green-950/5 p-4 transition-[opacity,translate] duration-500 ${open ? "delay-500" : "translate-y-4 opacity-0"}`}>
          <Link href="/admissions" onClick={() => onNavigate("/admissions")} className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-little-green-900 py-2 pl-5 pr-2 text-sm font-extrabold text-white transition-colors hover:bg-little-green-800">
            Enquire for admission <span className="grid h-8 w-8 place-items-center rounded-full bg-little-yellow-400 text-little-green-950"><ArrowUpRight aria-hidden className="h-4 w-4" /></span>
          </Link>
          {phone && (
            <a href={telHref(phone)} className="flex h-12 items-center justify-center gap-2 rounded-full bg-little-blue-50 font-display font-bold text-little-blue-800 outline-none focus-visible:ring-3 focus-visible:ring-little-pink-400">
              <Phone className="h-4 w-4" /> {phone}
            </a>
          )}
          <div aria-hidden className="flex justify-center gap-1.5 pt-1">
            {[BRAND.pink[400], BRAND.yellow[400], BRAND.green[400], BRAND.blue[400]].map((c, i) => <span key={c} className="h-1.5 w-6 rounded-full" style={{ background: c, opacity: 0.5 + i * 0.12 }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
