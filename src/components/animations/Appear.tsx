"use client";

import { useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { fx, type FxVars } from "./fx";
import { useReveal } from "./motion";

type Base = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** GSAP-style trigger line, e.g. "top 80%". */
  start?: string;
  /** Play straight away (on load) instead of when scrolled into view. */
  now?: boolean;
};
/** Any other attribute (id, onClick, aria-*, data-*…) is passed to the element. */
type Rest = Omit<HTMLAttributes<HTMLElement>, keyof Base> & Record<`data-${string}`, string | undefined> & { type?: "button" | "submit" };
type Props = Base & FxVars & Rest;

/** Animates in (from the `x/y/s/r/o` offsets) when scrolled into view. Children with `.fx` classes start with it. */
export function Appear({ as: Tag = "div", className = "", style, children, start, now, x, y = 28, s, r, o, d, dur, ease = "spring", clip, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, start, !now);
  return (
    <Tag ref={ref} data-fx-group="" {...(now ? { "data-in": "" } : {})} className={`fx ${className}`} style={{ ...fx({ x, y, s, r, o, d, dur, ease, clip }), ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/** A trigger only: its `.fx*` descendants start together (stagger them with `d`) when it scrolls into view. */
export function Group({ as: Tag = "div", className, style, children, start, now, ...rest }: Base & Rest) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, start, !now);
  return (
    <Tag ref={ref} data-fx-group="" {...(now ? { "data-in": "" } : {})} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
