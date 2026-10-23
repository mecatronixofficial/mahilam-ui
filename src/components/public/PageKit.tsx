import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/programs/Fx";

/** A page photo: an admin upload (may need `unoptimized` if its host isn't configured for next/image) or a local file. */
export type Photo = { src: string; alt: string; unoptimized?: boolean };

/** Small white label chip that opens each section. */
export function Eyebrow({ icon, children, className = "" }: { icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800 shadow-[0_8px_20px_-12px_rgba(36,68,32,.45)] ${className}`}>
      {icon}{children}
    </span>
  );
}

/** Pill link with an arrow bubble that slides on hover; pulled gently toward the cursor on desktop. */
export function CtaLink({ href, children, tone = "ink" }: { href: string; children: ReactNode; tone?: "ink" | "light" | "pink" }) {
  const tones = {
    ink: { pill: "bg-little-green-900 text-white hover:bg-little-green-800", bubble: "bg-little-yellow-400 text-little-green-950" },
    light: { pill: "bg-white text-little-green-950 ring-2 ring-little-green-900/10 hover:bg-little-cream-100", bubble: "bg-little-green-900 text-white" },
    pink: { pill: "bg-little-pink-500 text-white hover:bg-little-pink-600", bubble: "bg-white text-little-pink-600" },
  }[tone];
  return (
    <Magnetic strength={0.18}>
      <Link
        href={href}
        className={`group/cta inline-flex min-h-13 items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 font-display text-base font-bold shadow-[0_14px_28px_-18px_rgba(36,68,32,.8)] transition-[background-color,scale] duration-300 active:scale-97 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-little-pink-400 ${tones.pill}`}
      >
        {children}
        <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-full transition-transform duration-300 ease-(--ease-back) group-hover/cta:translate-x-1 group-hover/cta:-rotate-12 ${tones.bubble}`}>
          <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
        </span>
      </Link>
    </Magnetic>
  );
}
