"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { fx, type FxVars } from "./fx";
import { getMotion, onEnter, scale } from "./motion";

/**
 * - rise / left / right: element (or its `[data-reveal-item]` children) glides in.
 * - drop: falls from above and settles with a small bounce (badges, stickers, chips).
 * - pop: springs up from a small scale (icons, shapes).
 * - tilt: cards start fanned (-3° / 0° / 3°) and straighten as they rise; `[data-pop]` icons pop after.
 * - cards: every card enters with its own height and tilt; `[data-drop]` badges fall in after.
 * - gravity: children tumble down in a shuffled order and bounce to rest.
 * - deal: children are dealt out from the middle like a hand of photos.
 * - panel: a large coloured block grows into place.
 * - clip-up / clip-left: clip-path wipe; `[data-reveal-media]` inside eases from 1.08 to 1.
 *
 * The script only sets CSS variables and a class on each target once; the animation itself is CSS (globals.css).
 */
export type RevealVariant = "rise" | "left" | "right" | "drop" | "pop" | "tilt" | "cards" | "gravity" | "deal" | "panel" | "clip-up" | "clip-left";

type Step = FxVars & { cls?: string; stagger?: number };

/** Where item `i` of `n` starts, per variant. `k` shrinks distances on small screens. */
function stepFor(variant: RevealVariant, i: number, n: number, k: number, mobile: boolean): Step {
  const mid = (n - 1) / 2;
  const bounce = mobile ? "back" : "bounce";
  switch (variant) {
    case "rise": return { y: 44 * k, dur: 0.8 };
    case "left": return { x: -70 * k, dur: 0.9 };
    case "right": return { x: 70 * k, dur: 0.9 };
    case "drop": return { y: -60 * k, r: i % 2 ? 8 : -8, dur: 0.9, ease: bounce };
    case "pop": return { s: 0.3, r: -18, dur: 0.7, ease: "back-strong" };
    case "tilt": return { y: 80 * k, r: (i - mid) * 3, dur: 1, stagger: 0.12 };
    case "cards": return { y: (70 + (i % 3) * 22) * k, r: [-5, 3, -2, 4][i % 4] * k, dur: 0.95, ease: "back" };
    case "gravity": return { y: -180 * k, r: (i % 2 ? 1 : -1) * (14 + (i % 3) * 8), dur: mobile ? 0.8 : 1.15, ease: bounce };
    case "deal": return { y: 150 * k, x: (mid - i) * 90 * k, r: (mid - i) * -14, dur: 1, ease: "back" };
    case "panel": return { y: 60 * k, s: 0.96, dur: 1 };
    case "clip-up": return { cls: "fx-clip", clip: "inset(100% 0% 0% 0%)", dur: 1.15, ease: "expo" };
    case "clip-left": return { cls: "fx-clip", clip: "inset(0% 100% 0% 0%)", dur: 1.15, ease: "expo" };
  }
}

/** Delay slot for item `i`: cards get an uneven rhythm, gravity a shuffled order. */
function slot(variant: RevealVariant, i: number, n: number, stagger: number) {
  if (variant === "cards") return i * 0.09 + (i % 2) * 0.04;
  if (variant === "gravity") return (n % 7 ? (i * 7 + 3) % n : i) * 0.09;
  return i * stagger;
}

function apply(node: HTMLElement, cls: string, vars: FxVars) {
  node.classList.add(cls);
  for (const [key, value] of Object.entries(fx(vars))) node.style.setProperty(key, String(value));
}

export function Reveal({
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  stagger = 0.1,
  start = "top 80%",
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number;
  stagger?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<`data-${string}`, string | number | boolean | undefined>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = getMotion();
    if (m.reduce) {
      el.setAttribute("data-fx-ready", "");
      return;
    }
    const k = scale(m);
    const found = own(el, "[data-reveal-item]");
    const items = found.length ? found : [el];
    const n = items.length;
    let end = 0;

    items.forEach((item, i) => {
      const { cls = "fx", stagger: fixed, ...vars } = stepFor(variant, i, n, k, m.mobile);
      const d = delay + slot(variant, i, n, fixed ?? stagger);
      end = Math.max(end, d + (vars.dur ?? 0.8));
      apply(item, cls, { ...vars, d });
    });
    if (variant === "clip-up" || variant === "clip-left") {
      own(el, "[data-reveal-media]").forEach((media) => apply(media, "fx-zoom", { s: 1.08, d: delay, dur: 1.4, ease: "soft" }));
    }
    if (variant === "tilt") {
      own(el, "[data-pop]").forEach((pop, j) => apply(pop, "fx", { s: 0, o: 1, r: -40, d: end - 0.55 + j * 0.1, dur: 0.7, ease: "back-strong" }));
    }
    if (variant === "cards") {
      own(el, "[data-drop]").forEach((drop, j) => apply(drop, "fx", { y: -46, d: end - 0.6 + j * 0.08, dur: 0.8, ease: m.mobile ? "back" : "bounce" }));
    }

    el.setAttribute("data-fx-group", "");
    el.setAttribute("data-fx-ready", "");
    return onEnter(el, () => el.setAttribute("data-in", ""), start);
  }, [variant, delay, stagger, start]);

  return (
    <Tag ref={ref} data-reveal="" className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/** Matches inside this Reveal only — not inside a nested Reveal, which animates its own items. */
function own(el: HTMLElement, selector: string) {
  return Array.from(el.querySelectorAll<HTMLElement>(selector)).filter((item) => item.parentElement?.closest("[data-reveal]") === el);
}
