"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Home, Info, Building2, Images, CalendarDays, Phone, ArrowRight, Smile, GraduationCap,
} from "lucide-react";
import { useState } from "react";

const TINTS = ["#3f7a63", "#f7c85b", "#ef9e8a"];

const links = [
  ["/", "Home", Home],
  ["/about", "About", Info],
  ["/programs", "Programs", GraduationCap],
  ["/gallery", "Gallery", Images],
  ["/events", "Events", CalendarDays],
  ["/contact", "Contact", Phone],
] as const;

const bunting = Array.from({ length: 22 });

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#fffaf0]/95 backdrop-blur-xl">
      <div className="container-pad flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 rotate-3 items-center justify-center rounded-[1.1rem] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950 shadow-md shadow-amber-900/15 transition-transform group-hover:rotate-0">
            <Smile className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-black text-xl leading-tight text-emerald-950">Little Mahilam</span>
            <span className="block text-xs font-bold tracking-wide text-emerald-700">School of Happiness</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 rounded-full border border-emerald-950/5 bg-white/70 p-1.5 text-sm font-bold text-slate-700 shadow-sm">
          {links.map(([href, label, Icon], i) => {
            const active = pathname === href;
            const tint = TINTS[i % TINTS.length];
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                  active ? "bg-[#285744] text-white shadow-sm" : "hover:bg-emerald-950/5 hover:text-emerald-900"
                }`}
              >
                <Icon className="h-4 w-4" style={active ? undefined : { color: tint }} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn-soft">Login</Link>
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a] px-5 py-3 font-extrabold text-emerald-950 shadow-md shadow-amber-900/10 transition-transform hover:scale-[1.03]"
          >
            Enquire Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="rounded-xl border border-emerald-950/10 bg-white p-2 text-emerald-950 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div className="relative h-4 w-full overflow-hidden">
        <div className="absolute inset-x-0 top-1.5 border-t-2 border-dashed border-emerald-950/15" />
        <div className="container-pad flex h-full items-start justify-between px-6">
          {bunting.map((_, i) => (
            <span
              key={i}
              className="h-3 w-2.5 shrink-0"
              style={{
                backgroundColor: TINTS[i % TINTS.length],
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`grid xl:hidden overflow-hidden border-b border-emerald-950/5 bg-white transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="container-pad grid gap-1.5 py-4">
            {links.map(([href, label, Icon], i) => {
              const active = pathname === href;
              const tint = TINTS[i % TINTS.length];
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-colors ${
                    active ? "bg-[#285744] text-white" : "text-slate-700 hover:bg-emerald-950/5"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{ backgroundColor: active ? "rgba(255,255,255,.15)" : `${tint}1a` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: active ? "white" : tint }} />
                  </span>
                  {label}
                </Link>
              );
            })}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-soft">Login</Link>
              <Link
                href="/admissions"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a] px-4 py-3 font-extrabold text-emerald-950"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
