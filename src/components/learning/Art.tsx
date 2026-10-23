import type { CSSProperties } from "react";
import { BRAND } from "@/lib/brand";

/**
 * "Discovery Playroom" illustrations for the Learning Approach page: chalkboard, crayons, puzzle pieces,
 * letter blocks and little activity icons. Plain SVG (no client JS), all decorative (aria-hidden).
 */

type Art = { className?: string; style?: CSSProperties };
type Tinted = Art & { color?: string };

const INK = BRAND.green[900];

/** A classroom chalkboard with chalk letters, numbers and a doodled star. */
export function Chalkboard({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 220 160" className={className} style={style}>
      <rect x="4" y="8" width="212" height="136" rx="14" fill={BRAND.coral[700]} />
      <rect x="14" y="18" width="192" height="116" rx="8" fill={BRAND.green[800]} />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" opacity=".92">
        {/* A */}
        <path d="M32 70 L44 36 L56 70 M37 58 H51" />
        {/* B */}
        <path d="M66 36 V70 M66 36 H76 Q86 36 86 45 Q86 53 76 53 H66 M76 53 Q88 53 88 61.5 Q88 70 76 70 H66" />
        {/* C */}
        <path d="M118 40 Q110 34 102 38 Q94 44 95 53 Q96 64 105 69 Q113 72 119 66" />
      </g>
      <g fill="none" stroke={BRAND.yellow[300]} strokeLinecap="round" strokeWidth="3" opacity=".95">
        {/* 1 + 2 = 3 */}
        <path d="M34 92 L40 87 V112" />
        <path d="M54 100 H66 M60 94 V106" />
        <path d="M76 92 Q82 85 88 92 Q91 98 76 112 H91" />
        <path d="M102 97 H114 M102 104 H114" />
        <path d="M126 90 Q134 84 139 91 Q141 98 132 100 Q142 101 140 109 Q135 116 125 110" />
      </g>
      <path d="M170 44 L174.6 55.6 L187 56.4 L177.4 64.4 L180.6 76.6 L170 69.8 L159.4 76.6 L162.6 64.4 L153 56.4 L165.4 55.6 Z" fill="none" stroke={BRAND.pink[300]} strokeWidth="3" strokeLinejoin="round" />
      <path d="M152 100 Q164 88 176 100 T200 100" fill="none" stroke={BRAND.blue[200]} strokeWidth="3" strokeLinecap="round" />
      <rect x="40" y="140" width="140" height="8" rx="4" fill={BRAND.coral[800]} />
      <rect x="58" y="134" width="22" height="7" rx="2" fill="#fff" />
      <rect x="140" y="134" width="16" height="7" rx="2" fill={BRAND.yellow[300]} />
    </svg>
  );
}

/** A wax crayon, tip pointing left. */
export function Crayon({ className, style, color = BRAND.coral[400] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 120 28" className={className} style={style}>
      <path d="M22 4 L4 14 L22 24 Z" fill={color} />
      <rect x="20" y="3" width="96" height="22" rx="5" fill={color} />
      <rect x="34" y="3" width="56" height="22" fill="#fff" opacity=".3" />
      <path d="M38 9 H86 M38 19 H86" stroke="#fff" strokeWidth="2" opacity=".75" />
      <path d="M100 3 V25 M106 3 V25" stroke="#000" strokeOpacity=".12" strokeWidth="2" />
    </svg>
  );
}

/** One jigsaw piece (top knob + right knob). */
export function PuzzlePiece({ className, style, color = BRAND.blue[400] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      <path d="M10 22 H36 C36 6 58 6 58 22 H82 V46 C98 46 98 68 82 68 V92 H10 Z" fill={color} />
      <path d="M18 30 H32" stroke="#fff" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** A single chunky letter block, shown in soft 3D. */
export function LetterBlock({ className, style, color = BRAND.yellow[400], letter = "A" }: Tinted & { letter?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M10 14 L20 4 H60 V44 L50 54 Z" fill={color} />
      <path d="M10 14 L20 4 H60 L50 14 Z" fill="#fff" opacity=".35" />
      <path d="M50 14 L60 4 V44 L50 54 Z" fill="#000" opacity=".14" />
      <rect x="4" y="14" width="46" height="46" rx="7" fill={color} />
      <rect x="9" y="19" width="36" height="36" rx="5" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
      <text x="27" y="45" textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff" fontFamily="var(--font-fredoka), sans-serif">{letter}</text>
    </svg>
  );
}

/** A spinning ring of words around a lightbulb — the hero's badge. The text path is fixed, so SSR and browser agree. */
export function IdeaBadge({ className, style, label = "PLAY • EXPLORE • DISCOVER • GROW • " }: Art & { label?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 160" className={className} style={style}>
      <circle cx="80" cy="80" r="78" fill={BRAND.yellow[400]} />
      <defs>
        <path id="lm-idea-ring" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
      </defs>
      <g className="origin-center animate-[spin_22s_linear_infinite] [transform-box:view-box] motion-reduce:animate-none">
        <text fontSize="15.5" fontWeight="800" letterSpacing="2.4" fill={INK} fontFamily="var(--font-fredoka), sans-serif">
          <textPath href="#lm-idea-ring">{label}</textPath>
        </text>
      </g>
      <circle cx="80" cy="80" r="38" fill="#fff" />
      <path d="M80 56 C66 56 60 67 62 76 C64 84 72 86 72 94 H88 C88 86 96 84 98 76 C100 67 94 56 80 56 Z" fill={BRAND.yellow[300]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M73 100 H87 M75 106 H85" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M76 82 L80 74 L84 82" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A small round child face; `hair` picks a style so a group of them looks varied. */
export function KidFace({ className, style, skin = "#f3c9a5", hair = INK, variant = 0 }: Art & { skin?: string; hair?: string; variant?: 0 | 1 | 2 }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      {variant === 1 && <><circle cx="12" cy="30" r="8" fill={hair} /><circle cx="52" cy="30" r="8" fill={hair} /></>}
      <circle cx="32" cy="34" r="22" fill={skin} />
      {variant === 0 && <path d="M10 32 Q10 10 32 10 Q54 10 54 32 Q46 20 32 22 Q18 20 10 32 Z" fill={hair} />}
      {variant === 1 && <path d="M10 30 Q12 12 32 12 Q52 12 54 30 Q40 24 32 18 Q24 26 10 30 Z" fill={hair} />}
      {variant === 2 && <path d="M12 28 Q14 8 34 10 Q52 12 52 28 L46 22 L40 26 L34 20 L28 26 L22 20 Z" fill={hair} />}
      <circle cx="24" cy="36" r="2.6" fill={INK} />
      <circle cx="40" cy="36" r="2.6" fill={INK} />
      <circle cx="19" cy="43" r="3.5" fill={BRAND.pink[300]} opacity=".55" />
      <circle cx="45" cy="43" r="3.5" fill={BRAND.pink[300]} opacity=".55" />
      <path d="M26 44 Q32 50 38 44" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn squiggle used to underline highlighted headline words. `pathLength` lets `.fx-draw` draw it in. */
export function Squiggle({ className, style, color = BRAND.pink[400] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 300 24" preserveAspectRatio="none" className={className} fill="none">
      <path d="M4 16 C 40 4, 70 22, 104 12 S 170 4, 204 14 S 268 20, 296 8" pathLength="1" strokeDasharray="1" stroke={color} strokeWidth="7" strokeLinecap="round" className="fx-draw" style={style} />
    </svg>
  );
}

/* ---------- Activity icons (64×64) for "How Children Learn" ---------- */

export function IconExplore({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <circle cx="26" cy="26" r="17" fill={BRAND.blue[100]} stroke={INK} strokeWidth="4" />
      <path d="M18 22 Q22 15 30 16" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M38 38 L54 54" stroke={BRAND.coral[500]} strokeWidth="8" strokeLinecap="round" />
      <path d="M22 30 Q26 24 30 30 T38 30" stroke={BRAND.green[600]} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconCreate({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M32 6 C14 6 4 20 6 34 C8 48 22 58 32 52 C38 48 34 42 40 40 C50 38 58 36 58 26 C58 14 46 6 32 6 Z" fill={BRAND.cream[200]} stroke={INK} strokeWidth="3.5" />
      <circle cx="20" cy="24" r="5" fill={BRAND.coral[400]} />
      <circle cx="32" cy="17" r="5" fill={BRAND.yellow[400]} />
      <circle cx="45" cy="22" r="5" fill={BRAND.blue[400]} />
      <circle cx="18" cy="38" r="5" fill={BRAND.green[400]} />
      <path d="M36 50 L56 30" stroke={BRAND.pink[500]} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlay({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <circle cx="32" cy="32" r="24" fill={BRAND.coral[300]} stroke={INK} strokeWidth="3.5" />
      <path d="M10 26 Q32 36 54 26 M10 38 Q32 28 54 38" stroke="#fff" strokeWidth="3.5" fill="none" />
      <path d="M32 8 V56" stroke="#fff" strokeWidth="3.5" />
    </svg>
  );
}

export function IconSolve({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M8 18 H24 C24 8 38 8 38 18 H54 V34 C62 34 62 48 54 48 V58 H8 Z" fill={BRAND.green[300]} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="26" cy="38" r="4" fill={INK} />
      <path d="M36 32 L44 40 M44 32 L36 40" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconExpress({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M6 12 H40 Q46 12 46 18 V34 Q46 40 40 40 H22 L12 48 V40 H12 Q6 40 6 34 V18 Q6 12 12 12 Z" fill={BRAND.pink[200]} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M30 30 H52 Q58 30 58 36 V46 Q58 52 52 52 V58 L44 52 H36 Q30 52 30 46 Z" fill={BRAND.yellow[300]} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="16" cy="26" r="2.5" fill={INK} /><circle cx="26" cy="26" r="2.5" fill={INK} /><circle cx="36" cy="26" r="2.5" fill={INK} />
    </svg>
  );
}

export function IconGrow({ className, style }: Art) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M14 50 H50 L46 60 H18 Z" fill={BRAND.coral[500]} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M32 50 V28" stroke={BRAND.green[700]} strokeWidth="4" strokeLinecap="round" />
      <path d="M32 34 C20 34 14 26 16 16 C26 16 32 24 32 34 Z" fill={BRAND.green[400]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 30 C42 30 50 22 48 10 C38 10 32 18 32 30 Z" fill={BRAND.green[300]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M50 4 L52 9 L57 10 L52 12 L50 17 L48 12 L43 10 L48 9 Z" fill={BRAND.yellow[400]} />
    </svg>
  );
}
