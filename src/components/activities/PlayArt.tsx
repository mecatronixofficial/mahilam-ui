import type { CSSProperties } from "react";
import { BRAND } from "@/lib/brand";
import styles from "./activities.module.css";

/**
 * "Adventure Playground" illustrations for the Activities page: slide, swings, seesaw, sandbox, kite,
 * hot-air balloon and one icon per activity. Plain SVG, decorative (aria-hidden), safe in server components.
 */

type Art = { className?: string; style?: CSSProperties };
const INK = BRAND.green[900];

export function Slide({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 200 150" className={className} style={style}>
      <path d="M40 30 V146 M66 30 V146" stroke={BRAND.blue[500]} strokeWidth="7" strokeLinecap="round" />
      {[52, 74, 96, 118].map((y) => <path key={y} d={`M40 ${y} H66`} stroke={BRAND.blue[400]} strokeWidth="5" strokeLinecap="round" />)}
      <rect x="32" y="22" width="44" height="14" rx="7" fill={BRAND.coral[400]} />
      <path d="M70 30 C 110 30, 120 120, 192 128 L 190 144 C 110 138, 98 50, 70 46 Z" fill={BRAND.yellow[400]} />
      <path d="M74 36 C 108 38, 118 118, 190 132" stroke="#fff" strokeOpacity=".55" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Swing set; the two seats sway on their own (CSS). */
export function SwingSet({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 200 150" className={className} style={style}>
      <path d="M20 148 L50 14 L80 148 M120 148 L150 14 L180 148" stroke={BRAND.coral[500]} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M44 16 H156" stroke={BRAND.coral[600]} strokeWidth="8" strokeLinecap="round" />
      <g className={styles.swing} style={{ transformOrigin: "78px 18px" }}>
        <path d="M68 18 V104 M88 18 V104" stroke={INK} strokeWidth="2.5" />
        <rect x="62" y="102" width="32" height="8" rx="4" fill={BRAND.pink[400]} />
      </g>
      <g className={styles.swing} style={{ transformOrigin: "122px 18px", animationDelay: "-1.3s" }}>
        <path d="M112 18 V96 M132 18 V96" stroke={INK} strokeWidth="2.5" />
        <rect x="106" y="94" width="32" height="8" rx="4" fill={BRAND.blue[400]} />
      </g>
    </svg>
  );
}

export function Seesaw({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 200 80" className={className} style={style}>
      <path d="M86 78 L100 44 L114 78 Z" fill={BRAND.green[600]} />
      <g className={styles.seesaw} style={{ transformOrigin: "100px 44px" }}>
        <rect x="14" y="38" width="172" height="10" rx="5" fill={BRAND.yellow[500]} />
        <rect x="22" y="22" width="6" height="18" rx="3" fill={BRAND.coral[500]} />
        <rect x="172" y="22" width="6" height="18" rx="3" fill={BRAND.coral[500]} />
      </g>
    </svg>
  );
}

export function Sandbox({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 180 80" className={className} style={style}>
      <rect x="4" y="34" width="172" height="42" rx="10" fill={BRAND.coral[600]} />
      <path d="M12 40 Q 50 22 90 36 T 168 38 V68 H12 Z" fill={BRAND.yellow[200]} />
      <path d="M40 30 L36 52 H62 L58 30 Z" fill={BRAND.blue[400]} />
      <path d="M38 30 Q49 18 60 30" stroke={BRAND.blue[600]} strokeWidth="2.5" fill="none" />
      <path d="M120 44 L140 20" stroke={BRAND.pink[500]} strokeWidth="4" strokeLinecap="round" />
      <path d="M114 42 Q118 52 128 48 L122 40 Z" fill={BRAND.pink[400]} />
    </svg>
  );
}

export function Kite({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 120 180" className={className} style={style}>
      <path d="M60 4 L100 50 L60 110 L20 50 Z" fill={BRAND.pink[400]} />
      <path d="M60 4 L60 110 M20 50 H100" stroke="#fff" strokeOpacity=".7" strokeWidth="3" />
      <path d="M60 4 L100 50 L60 50 Z" fill={BRAND.yellow[400]} />
      <path d="M60 110 C 50 130, 74 140, 60 160 S 66 176, 58 180" stroke={INK} strokeWidth="2" fill="none" />
      {[128, 148, 166].map((y, i) => <path key={y} d={`M${54 + (i % 2) * 8} ${y} l8 -6 l0 12 z`} fill={[BRAND.blue[400], BRAND.green[400], BRAND.coral[400]][i]} />)}
    </svg>
  );
}

export function HotAirBalloon({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 140 190" className={className} style={style}>
      <path d="M70 6 C 24 6, 4 44, 14 80 C 22 108, 50 124, 56 140 H84 C 90 124, 118 108, 126 80 C 136 44, 116 6, 70 6 Z" fill={BRAND.coral[400]} />
      <path d="M70 6 C 52 6, 40 44, 46 80 C 50 106, 60 124, 62 140 H78 C 80 124, 90 106, 94 80 C 100 44, 88 6, 70 6 Z" fill={BRAND.yellow[400]} />
      <path d="M70 6 C 64 30, 64 110, 70 140 C 76 110, 76 30, 70 6 Z" fill={BRAND.pink[400]} />
      <path d="M58 140 L60 160 M82 140 L80 160" stroke={INK} strokeWidth="2" />
      <rect x="54" y="158" width="32" height="26" rx="5" fill={BRAND.coral[700]} />
      <path d="M54 166 H86" stroke={BRAND.yellow[300]} strokeWidth="3" />
    </svg>
  );
}

/* ---------- One icon per activity (80×80) ---------- */

export type ActivityArt = "art" | "music" | "outdoor" | "story" | "sensory" | "yoga" | "nature" | "building";

export function ActivityIcon({ art, className, style }: Art & { art: ActivityArt }) {
  const common = { "aria-hidden": true, viewBox: "0 0 80 80", className, style } as const;
  switch (art) {
    case "art":
      return (
        <svg {...common}>
          <path d="M40 8 C 18 8 6 24 8 42 C 10 60 28 72 40 64 C 48 58 42 50 50 48 C 64 46 72 42 72 30 C 72 16 58 8 40 8 Z" fill={BRAND.cream[200]} stroke={INK} strokeWidth="3.5" />
          <circle cx="24" cy="30" r="6" fill={BRAND.coral[400]} /><circle cx="38" cy="20" r="6" fill={BRAND.yellow[400]} /><circle cx="54" cy="26" r="6" fill={BRAND.blue[400]} /><circle cx="22" cy="48" r="6" fill={BRAND.green[400]} />
          <path d="M46 72 L74 40" stroke={BRAND.coral[700]} strokeWidth="5" strokeLinecap="round" /><path d="M74 40 L78 34" stroke={BRAND.pink[400]} strokeWidth="7" strokeLinecap="round" />
        </svg>
      );
    case "music":
      return (
        <svg {...common}>
          <ellipse cx="34" cy="36" rx="24" ry="8" fill={BRAND.yellow[300]} stroke={INK} strokeWidth="3" />
          <path d="M10 36 V60 C10 66 58 66 58 60 V36" fill={BRAND.coral[400]} stroke={INK} strokeWidth="3" />
          <path d="M14 44 L26 60 L38 44 L50 60 L56 50" stroke="#fff" strokeWidth="3" fill="none" strokeLinejoin="round" />
          <path d="M20 26 L8 8 M48 26 L60 10" stroke={BRAND.coral[700]} strokeWidth="4" strokeLinecap="round" />
          <path d="M64 30 V12 L76 9 V26" stroke={BRAND.pink[500]} strokeWidth="3.5" fill="none" strokeLinecap="round" /><circle cx="61" cy="31" r="4" fill={BRAND.pink[500]} /><circle cx="73" cy="27" r="4" fill={BRAND.pink[500]} />
        </svg>
      );
    case "outdoor":
      return (
        <svg {...common}>
          <circle cx="38" cy="42" r="26" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <path d="M38 30 L48 37 L44 49 L32 49 L28 37 Z" fill={INK} />
          <path d="M38 16 V30 M48 37 L62 33 M44 49 L52 62 M32 49 L24 62 M28 37 L14 33" stroke={INK} strokeWidth="3" />
          <path d="M60 10 L64 18 L72 19 L66 24 L68 32 L60 28 L52 32 L54 24 L48 19 L56 18 Z" fill={BRAND.yellow[400]} />
        </svg>
      );
    case "story":
      return (
        <svg {...common}>
          <path d="M40 22 C 28 14 14 14 6 18 V62 C 14 58 28 58 40 66 Z" fill={BRAND.blue[300]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M40 22 C 52 14 66 14 74 18 V62 C 66 58 52 58 40 66 Z" fill={BRAND.pink[300]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M14 30 H32 M14 38 H32 M48 30 H66 M48 38 H62" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 2 L43 9 L50 10 L45 15 L46 22 L40 18 L34 22 L35 15 L30 10 L37 9 Z" fill={BRAND.yellow[400]} />
        </svg>
      );
    case "sensory":
      return (
        <svg {...common}>
          <path d="M18 34 L24 72 H56 L62 34 Z" fill={BRAND.green[400]} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M20 34 Q40 22 60 34" fill={BRAND.yellow[200]} stroke={INK} strokeWidth="3" />
          <path d="M22 26 Q40 4 58 26" stroke={INK} strokeWidth="3" fill="none" />
          <circle cx="32" cy="50" r="4" fill="#fff" opacity=".7" /><circle cx="46" cy="58" r="3" fill="#fff" opacity=".7" />
          <path d="M66 12 Q72 22 66 26 Q60 22 66 12 Z" fill={BRAND.blue[400]} /><path d="M10 14 Q15 22 10 25 Q5 22 10 14 Z" fill={BRAND.blue[300]} />
        </svg>
      );
    case "yoga":
      return (
        <svg {...common}>
          <circle cx="40" cy="14" r="8" fill={BRAND.coral[300]} stroke={INK} strokeWidth="3" />
          <path d="M40 22 V48 M40 48 L30 72 M40 48 L52 56 L40 62" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M40 30 L24 8 M40 30 L56 8" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="40" cy="74" rx="26" ry="4" fill={BRAND.pink[200]} />
        </svg>
      );
    case "nature":
      return (
        <svg {...common}>
          <path d="M14 66 C 10 40 24 16 54 12 C 58 42 44 64 14 66 Z" fill={BRAND.green[400]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M14 66 C 26 50 36 36 50 18" stroke={INK} strokeWidth="2.5" fill="none" />
          <circle cx="56" cy="50" r="13" fill={BRAND.blue[100]} fillOpacity=".7" stroke={INK} strokeWidth="3.5" />
          <path d="M65 59 L76 70" stroke={BRAND.coral[500]} strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <rect x="8" y="48" width="28" height="26" rx="4" fill={BRAND.coral[400]} stroke={INK} strokeWidth="3" />
          <rect x="40" y="48" width="28" height="26" rx="4" fill={BRAND.blue[400]} stroke={INK} strokeWidth="3" />
          <rect x="24" y="20" width="28" height="26" rx="4" fill={BRAND.yellow[400]} stroke={INK} strokeWidth="3" />
          <path d="M28 18 L38 4 L48 18 Z" fill={BRAND.green[400]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
  }
}
