"use client";

import { useEffect } from "react";

/** Class set before first paint (see the root layout) so the header glides down with the first frame (CSS). */
export const INTRO_CLASS = "lm-intro";

/** Removes the pre-paint intro class once the header has landed, so later visits to the header never replay it. */
export function HomeIntro() {
  useEffect(() => {
    const root = document.documentElement;
    const done = window.setTimeout(() => root.classList.remove(INTRO_CLASS), 1200);
    return () => {
      window.clearTimeout(done);
      root.classList.remove(INTRO_CLASS);
    };
  }, []);

  return null;
}
