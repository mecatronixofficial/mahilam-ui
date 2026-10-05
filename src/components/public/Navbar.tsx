"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight, CalendarDays, GraduationCap, Home, Images, Info, Menu, Phone, Sparkles, Star, Sun, X,
} from "lucide-react";
import { BalloonString } from "./BalloonString";
import { BrandLogo } from "./BrandLogo";
import type { PublicSite } from "@/lib/site";
import { telHref } from "@/lib/site";

/** Each link keeps its own crayon colour. */
const links = [
  { href: "/", label: "Home", note: "Start here", icon: Home, tint: "#3f7a63" },
  { href: "/about", label: "About", note: "Our story", icon: Info, tint: "#e2725b" },
  { href: "/programs", label: "Programs", note: "Learning paths", icon: GraduationCap, tint: "#d69e2e" },
  { href: "/gallery", label: "Gallery", note: "Happy moments", icon: Images, tint: "#4a7fc1" },
  { href: "/events", label: "Events", note: "Celebrations", icon: CalendarDays, tint: "#8b6fd6" },
  { href: "/contact", label: "Contact", note: "Say hello", icon: Phone, tint: "#2f9e8f" },
] as const;

const FLAG_TINTS = ["#3f7a63", "#f7c85b", "#ef9e8a", "#8cb9e8", "#c4b5fd"];
const bunting = Array.from({ length: 26 });

export function Navbar({ siteDetails }: { siteDetails: PublicSite }) {
  const [open, setOpen] = useState(false);
  const [closingInstantly, setClosingInstantly] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes (including back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile menu is open: freeze page scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Same-page link: Next won't move, so glide back to the top. New page: snap the menu shut so it doesn't shift layout mid-navigation. */
  function handleNav(href: string) {
    if (href === pathname) window.scrollTo({ top: 0, behavior: "smooth" });
    if (open) {
      setClosingInstantly(true);
      setOpen(false);
      requestAnimationFrame(() => setClosingInstantly(false));
    }
  }

  return (
    <>
    {/* Dimmed page behind the open mobile menu; tap to close. Outside <header> because its backdrop blur would trap `fixed`. */}
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={() => setOpen(false)}
      className={`fixed inset-0 z-45 bg-emerald-950/35 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
    />
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${scrolled || open ? "bg-white/90 shadow-[0_10px_30px_-18px_rgba(23,60,47,.35)]" : "bg-[#fffaf0]/95"}`}>
      <div className="container-pad flex min-h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" onClick={() => handleNav("/")} className="group flex min-w-0 items-center" aria-label="Little Mahilam Pre-school home">
          <BrandLogo priority className="h-[62px] w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-[68px]" />
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-white/80 p-1.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-emerald-950/5 xl:flex">
          {links.map(({ href, label, icon: Icon, tint }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleNav(href)}
                aria-current={active ? "page" : undefined}
                className="group relative flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:text-emerald-950"
                style={{ backgroundColor: active ? `${tint}22` : undefined, color: active ? "#173c2f" : undefined }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                  style={{ backgroundColor: active ? tint : `${tint}1c`, color: active ? "white" : tint }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.4} />
                </span>
                {label}
                {active && <span aria-hidden className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: tint }} />}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {siteDetails.phone && <a href={telHref(siteDetails.phone)} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold text-emerald-900 transition hover:bg-white/80 lg:inline-flex xl:hidden 2xl:inline-flex"><Phone className="h-4 w-4" />{siteDetails.phone}</a>}
          <Link
            href="/admissions"
            onClick={() => handleNav("/admissions")}
            className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a] px-5 py-3 font-extrabold text-emerald-950 shadow-md shadow-amber-900/15 transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 transition-[left] duration-700 group-hover:left-[120%]" />
            <Sparkles className="relative h-4 w-4" />
            <span className="relative">Enquire Now</span>
            <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 transition-colors xl:hidden ${open ? "bg-emerald-900 text-white ring-emerald-900" : "bg-white text-emerald-950 ring-emerald-950/10 hover:bg-emerald-50"}`}
          >
            <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</span>
          </button>
        </div>
      </div>

      {/* Party bunting */}
      <div aria-hidden className="relative h-4 w-full overflow-hidden">
        <div className="absolute inset-x-0 top-1.5 border-t-2 border-dashed border-emerald-950/15" />
        <div className="container-pad flex h-full items-start justify-between px-6">
          {bunting.map((_, i) => (
            <span key={i} className="h-3 w-2.5 shrink-0 max-sm:even:hidden" style={{ backgroundColor: FLAG_TINTS[i % FLAG_TINTS.length], clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`grid overflow-hidden xl:hidden ${closingInstantly ? "" : "transition-[grid-template-rows] duration-300"} ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0">
          <nav aria-label="Main" className="container-pad pb-5 pt-2">
            <div className="mesh-hero relative overflow-hidden rounded-[28px] p-4 ring-1 ring-emerald-950/5 sm:p-5">
              {/* Sticker-board decorations */}
              <span aria-hidden className="pointer-events-none absolute right-4 top-3 flex flex-col items-center">
                <span className="block h-9 w-8 bg-[radial-gradient(circle_at_33%_28%,#fff1cf,#f7c85b_45%,#ef9e8a)] shadow-md [border-radius:50%_50%_50%_50%/58%_58%_42%_42%]" />
                <span className="block h-1.5 w-2 bg-[#ef9e8a] [clip-path:polygon(50%_100%,0_0,100%_0)]" />
                <BalloonString length={14} color="rgba(23,60,47,.35)" />
              </span>
              <Star aria-hidden className="banner-twinkle absolute right-16 top-5 h-3.5 w-3.5 fill-[#f7c85b] text-[#f7c85b]" />

              <p className="flex items-center gap-2 pr-14 font-display text-lg font-bold text-emerald-950">
                <Sun className="h-5 w-5 text-[#d69e2e]" /> Where shall we go today?
              </p>
              <p className="mt-0.5 pr-14 text-xs font-bold text-emerald-800/60">Tap a card to explore Little Mahilam</p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {links.map(({ href, label, note, icon: Icon, tint }, i) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => handleNav(href)}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex flex-col items-start rounded-[22px] border-2 bg-white p-3 transition-[transform,box-shadow] duration-150 active:translate-y-1 active:shadow-none ${open ? "menu-pop" : ""}`}
                      style={{ borderColor: active ? tint : `${tint}33`, backgroundColor: active ? `${tint}14` : "#fff", boxShadow: `0 5px 0 ${tint}${active ? "66" : "2e"}`, animationDelay: `${60 + i * 45}ms` }}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] text-white shadow-sm transition-transform group-hover:-rotate-6" style={{ backgroundColor: tint, rotate: i % 2 ? "4deg" : "-4deg" }}>
                        <Icon className="h-5 w-5" strokeWidth={2.4} />
                      </span>
                      <span className="mt-2.5 font-display text-base font-bold leading-tight text-emerald-950">{label}</span>
                      <span className="text-[11px] font-bold" style={{ color: tint }}>{note}</span>
                      {active && (
                        <span className="absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white" style={{ backgroundColor: tint }}>
                          Here
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/admissions"
                onClick={() => handleNav("/admissions")}
                className={`group relative mt-4 flex w-full items-center justify-between gap-3 overflow-hidden rounded-[22px] bg-emerald-900 p-2 pl-4 text-white shadow-[0_5px_0_#0f2a20] transition-[transform,box-shadow] duration-150 active:translate-y-1 active:shadow-none ${open ? "menu-pop" : ""}`}
                style={{ animationDelay: `${60 + links.length * 45}ms` }}
              >
                <span>
                  <span className="block font-display text-base font-bold">Enquire for admission</span>
                  <span className="block text-[11px] font-bold text-white/60">Play Group to Grade 3</span>
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-5 w-5" strokeWidth={2.6} />
                </span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
