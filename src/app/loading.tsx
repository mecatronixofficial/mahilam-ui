import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { BRAND } from "@/lib/brand";

const BLOCKS = [
  { letter: "A", color: BRAND.yellow[400], delay: "0s", tilt: "-8deg" },
  { letter: "B", color: BRAND.coral[300], delay: ".15s", tilt: "6deg" },
  { letter: "C", color: BRAND.green[700], delay: ".3s", tilt: "-6deg" },
];

/** Route-transition loader for public pages: bouncing A-B-C toy blocks on the cream backdrop. */
export default function Loading() {
  return (
    <main className="mesh-hero grid min-h-svh place-items-center px-4 py-10" role="status" aria-live="polite" aria-busy="true">
      <div className="text-center">
        <div aria-hidden className="flex items-end justify-center gap-3 pt-8">
          {BLOCKS.map(({ letter, color, delay, tilt }) => (
            <div key={letter} style={{ "--block": color, "--delay": delay, "--tilt": tilt } as CSSProperties}>
              <span className="loader-block">{letter}</span>
              <span className="loader-shadow block" />
            </div>
          ))}
        </div>

        <BrandLogo priority className="mx-auto mt-5 h-auto w-44" />
        <p className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-little-green-900/70">
          Let&apos;s play & learn
          <span aria-hidden className="flex items-end gap-1 pt-1">
            <span className="loader-dot h-1.5 w-1.5 rounded-full bg-little-yellow-400" />
            <span className="loader-dot h-1.5 w-1.5 rounded-full bg-little-coral-300" />
            <span className="loader-dot h-1.5 w-1.5 rounded-full bg-little-green-600" />
          </span>
        </p>
        <span className="sr-only">Loading Little Mahilam…</span>
      </div>
    </main>
  );
}
