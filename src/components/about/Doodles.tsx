import type { CSSProperties } from "react";
import { BRAND } from "@/lib/brand";

/**
 * Hand-drawn style illustrations for the About page's "Learning World". Plain SVG — no client JS —
 * so they can be used from server and client components alike. All are decorative (aria-hidden).
 */

type Doodle = { className?: string; style?: CSSProperties };

/** Round trig results so server (Node) and browser render identical SVG attributes — their Math.cos/sin can differ in the last digits. */
const r2 = (v: number) => Math.round(v * 100) / 100;
type Tinted = Doodle & { color?: string };

/** Section backgrounds, shared so wave/hill edges can blend exactly into the next section. */
export const SECTION_BG = {
  sky: BRAND.blue[50],
  cream: BRAND.cream.base,
  mint: BRAND.green[50],
  peach: BRAND.coral[50],
  butter: BRAND.yellow[50],
  blush: BRAND.pink[50],
} as const;

export function Cloud({ className, style, color = "#fff" }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 120 56" className={className} style={style}>
      <path d="M24 50 Q4 50 6 35 Q8 22 23 24 Q27 7 46 10 Q58 0 72 11 Q91 4 96 22 Q116 21 116 37 Q116 50 99 50 Z" fill={color} />
    </svg>
  );
}

/** Two rolling hills that run the full width of their parent; `front` should match the next section. */
export function Hills({ className = "", back = BRAND.green[200], front = BRAND.green[300] }: Doodle & { back?: string; front?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className={`pointer-events-none block w-full ${className}`}>
      <path d="M0 62 C 200 10 420 18 620 52 S 1040 96 1240 46 S 1440 30 1440 30 V120 H0 Z" fill={back} />
      <path d="M0 92 C 240 50 480 58 720 84 S 1180 108 1440 70 V120 H0 Z" fill={front} />
    </svg>
  );
}

/** Soft wave edge to blend one section into the next. */
export function Wave({ className = "", color, flip = false }: Doodle & { color: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 70" preserveAspectRatio="none" className={`pointer-events-none block w-full ${flip ? "-scale-x-100" : ""} ${className}`}>
      <path d="M0 38 C 180 8 360 8 540 34 S 900 64 1080 38 S 1350 12 1440 30 V70 H0 Z" fill={color} />
    </svg>
  );
}

export function Rainbow({ className, style }: Doodle) {
  const bands = [BRAND.coral[400], BRAND.yellow[400], BRAND.green[400], BRAND.blue[400]];
  return (
    <svg aria-hidden viewBox="0 0 120 64" className={className} style={style} fill="none" strokeLinecap="round">
      {bands.map((color, i) => <path key={color} d={`M${10 + i * 9} 60 A${50 - i * 9} ${50 - i * 9} 0 0 1 ${110 - i * 9} 60`} stroke={color} strokeWidth="8" />)}
      {[14, 106].map((cx) => (
        <g key={cx} fill="#fff">
          <circle cx={cx - 8} cy="58" r="7" /><circle cx={cx} cy="53" r="9" /><circle cx={cx + 8} cy="58" r="7" />
        </g>
      ))}
    </svg>
  );
}

export function SunDoodle({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      {/* Only the rays turn, so the smiley always stays upright. */}
      <g stroke={BRAND.yellow[500]} strokeWidth="6" strokeLinecap="round" className="origin-center animate-[spin_50s_linear_infinite] [transform-box:view-box]">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1={r2(50 + Math.cos(a) * 33)} y1={r2(50 + Math.sin(a) * 33)} x2={r2(50 + Math.cos(a) * 45)} y2={r2(50 + Math.sin(a) * 45)} />;
        })}
      </g>
      <circle cx="50" cy="50" r="24" fill={BRAND.yellow[400]} />
      <circle cx="42" cy="47" r="2.6" fill={BRAND.green[900]} />
      <circle cx="58" cy="47" r="2.6" fill={BRAND.green[900]} />
      <path d="M41 57 Q50 65 59 57" stroke={BRAND.green[900]} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function StarDoodle({ className, style, color = BRAND.yellow[400] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className} style={style}>
      <path d="M20 3 L24.6 14.6 L37 15.4 L27.4 23.4 L30.6 35.6 L20 28.8 L9.4 35.6 L12.6 23.4 L3 15.4 L15.4 14.6 Z" fill={color} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartDoodle({ className, style, color = BRAND.pink[400] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 40 36" className={className} style={style}>
      <path d="M20 34 C 6 24 1 16 3 9.5 C 5 3 14 1 20 9 C 26 1 35 3 37 9.5 C 39 16 34 24 20 34 Z" fill={color} />
      <ellipse cx="11" cy="11" rx="3" ry="2" fill="#fff" opacity=".45" transform="rotate(-30 11 11)" />
    </svg>
  );
}

export function Balloon({ className, style, color = BRAND.coral[400], string = true }: Tinted & { string?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 60 100" className={className} style={style}>
      {string && <path d="M30 66 Q24 78 31 88 T29 100" stroke={BRAND.neutral[400]} strokeWidth="1.5" fill="none" />}
      <ellipse cx="30" cy="32" rx="25" ry="29" fill={color} />
      <ellipse cx="21" cy="21" rx="5" ry="8" fill="#fff" opacity=".4" transform="rotate(20 21 21)" />
      <path d="M26 60 L34 60 L30 67 Z" fill={color} />
    </svg>
  );
}

export function PencilDoodle({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 100 24" className={className} style={style}>
      <rect x="14" y="3" width="70" height="18" rx="3" fill={BRAND.yellow[400]} />
      <rect x="14" y="3" width="70" height="6" rx="2" fill={BRAND.yellow[300]} />
      <rect x="78" y="3" width="10" height="18" fill={BRAND.neutral[300]} />
      <rect x="86" y="3" width="11" height="18" rx="5" fill={BRAND.pink[300]} />
      <path d="M14 3 L1 12 L14 21 Z" fill={BRAND.cream[200]} />
      <path d="M5.5 9 L1 12 L5.5 15 Z" fill={BRAND.green[900]} />
    </svg>
  );
}

export function AbcBlocks({ className, style }: Doodle) {
  const blocks = [
    { x: 4, y: 44, letter: "A", fill: BRAND.coral[400] },
    { x: 46, y: 44, letter: "B", fill: BRAND.blue[400] },
    { x: 25, y: 4, letter: "C", fill: BRAND.green[400] },
  ];
  return (
    <svg aria-hidden viewBox="0 0 90 86" className={className} style={style}>
      {blocks.map((b) => (
        <g key={b.letter}>
          <rect x={b.x} y={b.y + 4} width="38" height="38" rx="8" fill="#000" opacity=".12" />
          <rect x={b.x} y={b.y} width="38" height="38" rx="8" fill={b.fill} />
          <rect x={b.x + 5} y={b.y + 5} width="28" height="28" rx="5" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
          <text x={b.x + 19} y={b.y + 27} textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="var(--font-fredoka), sans-serif">{b.letter}</text>
        </g>
      ))}
    </svg>
  );
}

export function FlowerDoodle({ className, style, color = BRAND.pink[300] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 40 56" className={className} style={style}>
      <path d="M20 26 Q19 42 20 56" stroke={BRAND.green[500]} strokeWidth="3" fill="none" />
      <path d="M20 44 Q28 36 33 40 Q28 48 20 46" fill={BRAND.green[400]} />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={r2(20 + Math.cos(a) * 9)} cy={r2(18 + Math.sin(a) * 9)} r="7.5" fill={color} />;
      })}
      <circle cx="20" cy="18" r="5.5" fill={BRAND.yellow[400]} />
    </svg>
  );
}

export function Butterfly({ className, style, color = BRAND.blue[300] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 48 36" className={className} style={style}>
      <path d="M24 18 C 14 0 0 4 4 16 C 6 22 16 22 24 18 Z" fill={color} />
      <path d="M24 18 C 34 0 48 4 44 16 C 42 22 32 22 24 18 Z" fill={color} />
      <path d="M24 18 C 16 22 10 34 18 32 C 22 31 24 24 24 18 Z" fill={BRAND.pink[300]} />
      <path d="M24 18 C 32 22 38 34 30 32 C 26 31 24 24 24 18 Z" fill={BRAND.pink[300]} />
      <rect x="22.5" y="10" width="3" height="18" rx="1.5" fill={BRAND.green[900]} />
      <path d="M24 11 Q20 4 17 4 M24 11 Q28 4 31 4" stroke={BRAND.green[900]} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BookDoodle({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 64 44" className={className} style={style}>
      <path d="M32 8 C 22 2 10 2 3 6 V40 C 10 36 22 36 32 42 Z" fill={BRAND.blue[300]} />
      <path d="M32 8 C 42 2 54 2 61 6 V40 C 54 36 42 36 32 42 Z" fill={BRAND.coral[300]} />
      <path d="M32 8 C 23 4 13 4 7 7 V37 C 13 34 23 34 32 39 Z" fill="#fff" />
      <path d="M32 8 C 41 4 51 4 57 7 V37 C 51 34 41 34 32 39 Z" fill="#fff" />
      <g stroke={BRAND.neutral[300]} strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 15 H26 M12 21 H26 M12 27 H22 M38 15 H52 M38 21 H52 M38 27 H48" />
      </g>
    </svg>
  );
}

export function House({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 80 72" className={className} style={style}>
      <rect x="14" y="30" width="52" height="40" rx="4" fill={BRAND.yellow[200]} />
      <path d="M6 34 L40 6 L74 34 Z" fill={BRAND.coral[400]} strokeLinejoin="round" stroke={BRAND.coral[400]} strokeWidth="6" />
      <rect x="33" y="46" width="14" height="24" rx="7" fill={BRAND.green[500]} />
      <rect x="20" y="40" width="10" height="10" rx="2" fill={BRAND.blue[300]} />
      <rect x="50" y="40" width="10" height="10" rx="2" fill={BRAND.blue[300]} />
      <circle cx="40" cy="25" r="4" fill="#fff" />
    </svg>
  );
}

export function Tree({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 60 80" className={className} style={style}>
      <rect x="26" y="46" width="8" height="34" rx="3" fill={BRAND.coral[700]} />
      <circle cx="30" cy="30" r="22" fill={BRAND.green[400]} />
      <circle cx="18" cy="40" r="13" fill={BRAND.green[500]} />
      <circle cx="42" cy="40" r="13" fill={BRAND.green[500]} />
      <circle cx="22" cy="24" r="3" fill={BRAND.coral[400]} />
      <circle cx="38" cy="30" r="3" fill={BRAND.coral[400]} />
    </svg>
  );
}

export function Sprout({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className} style={style}>
      <path d="M8 54 Q32 46 56 54 L52 62 H12 Z" fill={BRAND.coral[600]} />
      <path d="M32 50 V26" stroke={BRAND.green[600]} strokeWidth="4" strokeLinecap="round" />
      <path d="M32 32 C 18 32 12 22 14 12 C 26 12 32 20 32 32 Z" fill={BRAND.green[400]} />
      <path d="M32 28 C 44 28 52 18 50 6 C 38 6 32 16 32 28 Z" fill={BRAND.green[500]} />
    </svg>
  );
}

export function PaperPlane({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 120 60" className={className} style={style} fill="none">
      <path d="M4 52 C 30 58 40 30 64 34" stroke={BRAND.neutral[400]} strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
      <path d="M70 30 L116 8 L96 50 L88 36 Z" fill="#fff" stroke={BRAND.blue[500]} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M88 36 L116 8" stroke={BRAND.blue[500]} strokeWidth="2.5" />
    </svg>
  );
}

export function DoodleArrow({ className, style, color = BRAND.coral[500] }: Tinted) {
  return (
    <svg aria-hidden viewBox="0 0 120 60" className={className} style={style} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 45 C 30 5, 70 5, 100 30" stroke={color} strokeWidth="3" strokeDasharray="6 7" />
      <path d="M92 20 L102 31 L88 35" stroke={color} strokeWidth="3" />
    </svg>
  );
}

export function SchoolBus({ className, style }: Doodle) {
  return (
    <svg aria-hidden viewBox="0 0 96 56" className={className} style={style}>
      <rect x="4" y="8" width="84" height="36" rx="10" fill={BRAND.yellow[400]} />
      <path d="M72 8 H80 Q92 8 92 22 V44 H72 Z" fill={BRAND.yellow[500]} />
      {[12, 30, 48].map((x) => <rect key={x} x={x} y="15" width="14" height="12" rx="3" fill={BRAND.blue[200]} />)}
      <rect x="74" y="15" width="12" height="13" rx="3" fill={BRAND.blue[200]} />
      <rect x="4" y="31" width="84" height="4" fill={BRAND.coral[400]} />
      <circle cx="22" cy="46" r="8" fill={BRAND.green[900]} /><circle cx="22" cy="46" r="3" fill={BRAND.neutral[200]} />
      <circle cx="70" cy="46" r="8" fill={BRAND.green[900]} /><circle cx="70" cy="46" r="3" fill={BRAND.neutral[200]} />
      <circle cx="90" cy="38" r="2.5" fill="#fff" />
    </svg>
  );
}

/** A tiny scatter of flowers and grass tufts along the bottom of a section. */
export function Meadow({ className = "" }: Doodle) {
  const items = [
    { left: "4%", color: BRAND.pink[300], h: "h-9" },
    { left: "11%", color: BRAND.yellow[400], h: "h-7" },
    { left: "86%", color: BRAND.blue[300], h: "h-8" },
    { left: "93%", color: BRAND.coral[300], h: "h-10" },
  ];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 ${className}`}>
      {items.map((f) => <FlowerDoodle key={f.left} color={f.color} className={`absolute bottom-0 w-auto ${f.h}`} style={{ left: f.left }} />)}
    </div>
  );
}
