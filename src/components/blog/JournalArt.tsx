import type { CSSProperties } from "react";
import { BookOpen } from "lucide-react";
import { BRAND } from "@/lib/brand";
import styles from "./journal.module.css";

/** Storybook illustrations for the Journal. Decorative SVG/CSS only. */

type Art = { className?: string; style?: CSSProperties };
const INK = BRAND.green[900];

/** Torn-paper silhouette for frames and panels. */
export const TORN: CSSProperties = {
  clipPath: "polygon(0 2%, 6% 0, 14% 1.5%, 23% 0, 33% 1.8%, 44% .4%, 55% 2%, 66% .2%, 77% 1.6%, 88% 0, 100% 1.4%, 99% 14%, 100% 30%, 98.6% 46%, 100% 62%, 98.8% 78%, 100% 98%, 90% 100%, 79% 98.4%, 67% 100%, 55% 98.2%, 43% 100%, 31% 98.6%, 20% 100%, 9% 98.4%, 0 100%, 1.2% 84%, 0 68%, 1.4% 52%, 0 36%, 1.2% 20%)",
};

/** An open storybook whose right page keeps turning (CSS, off for reduced motion). */
export function Storybook({ className, style }: Art) {
  return (
    <div aria-hidden className={`relative [perspective:900px] ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 240 150" className="relative w-full">
        <path d="M120 22 C 92 6 40 4 8 16 V140 C 40 128 92 130 120 146 Z" fill={BRAND.coral[400]} />
        <path d="M120 22 C 148 6 200 4 232 16 V140 C 200 128 148 130 120 146 Z" fill={BRAND.coral[500]} />
        <path d="M120 26 C 94 12 46 12 16 22 V132 C 46 122 94 124 120 138 Z" fill="#fff" />
        <path d="M120 26 C 146 12 194 12 224 22 V132 C 194 122 146 124 120 138 Z" fill={BRAND.cream[100]} />
        <g stroke={BRAND.neutral[300]} strokeWidth="3" strokeLinecap="round">
          <path d="M34 48 H98 M34 62 H98 M34 76 H86 M34 90 H98 M34 104 H76" />
        </g>
        <circle cx="170" cy="62" r="18" fill={BRAND.yellow[300]} />
        <path d="M142 116 Q 160 86 178 104 T 210 96 V122 H142 Z" fill={BRAND.green[300]} />
      </svg>
      {/* Turning page */}
      <span className={`${styles.page} absolute left-1/2 top-[15%] h-[76%] w-[44%] origin-left rounded-r-[40%_8%] bg-white shadow-[inset_8px_0_14px_-10px_rgba(0,0,0,.25)] backface-hidden motion-reduce:hidden`} />
    </div>
  );
}

/** A child curled up with a book. */
export function ReadingChild({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 160 150" className={className} style={style}>
      <ellipse cx="80" cy="142" rx="64" ry="7" fill={INK} opacity=".1" />
      <path d="M40 140 C 36 104 54 84 80 84 C 106 84 124 104 120 140 Z" fill={BRAND.blue[400]} />
      <circle cx="80" cy="56" r="30" fill="#f1c39b" />
      <path d="M50 54 Q 50 24 80 24 Q 110 24 110 54 Q 98 38 80 40 Q 62 38 50 54 Z" fill={INK} />
      <circle cx="70" cy="62" r="3" fill={INK} /><circle cx="90" cy="62" r="3" fill={INK} />
      <path d="M72 72 Q 80 78 88 72" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M80 100 C 66 92 46 92 34 98 V128 C 46 122 66 122 80 130 Z" fill={BRAND.yellow[400]} />
      <path d="M80 100 C 94 92 114 92 126 98 V128 C 114 122 94 122 80 130 Z" fill={BRAND.pink[300]} />
      <circle cx="40" cy="116" r="8" fill="#f1c39b" /><circle cx="120" cy="116" r="8" fill="#f1c39b" />
    </svg>
  );
}

/** Stand-in for a post without a cover photo: a paper page with the topic's colour — never a fake photo. */
export function PaperCover({ label, paper, ink, className = "" }: { label?: string | null; paper: string; ink: string; className?: string }) {
  return (
    <div aria-hidden className={`relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden ${className}`} style={{ background: paper }}>
      <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/35" />
      <span className="absolute -bottom-8 right-4 h-28 w-28 rounded-[40%] bg-white/25" />
      <BookOpen className="relative h-10 w-10" style={{ color: ink }} strokeWidth={1.8} />
      {label && <span className="relative max-w-[80%] truncate text-xs font-extrabold uppercase tracking-[.2em]" style={{ color: ink }}>{label}</span>}
    </div>
  );
}
