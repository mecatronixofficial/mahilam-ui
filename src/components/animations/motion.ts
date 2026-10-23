"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Tiny, dependency-free motion helpers. Animations themselves are CSS (see "Motion kit" in globals.css);
 * JavaScript only decides *when* they start — by setting `data-in` on an element as it scrolls into view.
 */

/** True for mouse/trackpad users (no hover effects on touch screens). */
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type Motion = { desktop: boolean; tablet: boolean; mobile: boolean; reduce: boolean };

/** Current breakpoint, read once when an animation is set up. */
export function getMotion(): Motion {
  const reduce = prefersReducedMotion();
  const width = typeof window === "undefined" ? 1280 : window.innerWidth;
  return { reduce, desktop: !reduce && width >= 1024, tablet: !reduce && width >= 640 && width < 1024, mobile: !reduce && width < 640 };
}

/** Distance multiplier: full on desktop, softer on tablet, small on phones. */
export const scale = (m: Motion) => (m.desktop ? 1 : m.tablet ? 0.7 : 0.45);

type Callback = (entry: IntersectionObserverEntry) => void;
const pool = new Map<string, { io: IntersectionObserver; callbacks: Map<Element, Callback> }>();

/** One shared IntersectionObserver per trigger line, however many elements use it. */
function observe(el: Element, callback: Callback, rootMargin: string, threshold: number) {
  const key = `${rootMargin}|${threshold}`;
  let entry = pool.get(key);
  if (!entry) {
    const callbacks = new Map<Element, Callback>();
    const io = new IntersectionObserver((list) => list.forEach((item) => callbacks.get(item.target)?.(item)), { rootMargin, threshold });
    entry = { io, callbacks };
    pool.set(key, entry);
  }
  const { io, callbacks } = entry;
  callbacks.set(el, callback);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}

/**
 * Calls `callback` once, when the element's top passes `start` (GSAP-style "top 80%": 80% down the viewport),
 * or straight away if the page has already been scrolled past it.
 */
export function onEnter(el: Element, callback: () => void, start = "top 85%") {
  const percent = Number(/(\d+(?:\.\d+)?)%/.exec(start)?.[1] ?? 85);
  let stop = () => {};
  stop = observe(el, (entry) => {
    if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
      stop();
      callback();
    }
  }, `0px 0px -${100 - percent}% 0px`, 0);
  return () => stop();
}

/** Marks the element with `data-in` the first time it scrolls into view. No React re-render. */
export function useReveal<T extends Element>(ref: RefObject<T | null>, start = "top 85%", enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-in", "");
      return;
    }
    return onEnter(el, () => el.setAttribute("data-in", ""), start);
  }, [ref, start, enabled]);
}

/** In-view state for components whose *logic* depends on visibility. `once: false` keeps tracking. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = true, margin = "0px" }: { once?: boolean; margin?: string } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let stop = () => {};
    stop = observe(el, (entry) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) stop();
    }, margin, 0);
    return () => stop();
  }, [ref, once, margin]);
  return inView;
}

/** Ref + reveal in one call. */
export function useRevealRef<T extends Element>(start?: string) {
  const ref = useRef<T>(null);
  useReveal(ref, start);
  return ref;
}
