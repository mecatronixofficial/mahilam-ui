"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function toTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

/**
 * Opens every page at the top: on link navigation (Next skips its own scroll when the old
 * position still shows the new page's top) and on refresh (browsers restore the old position).
 * Back/forward keep the browser's remembered position, and #hash links still jump to their target.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => { isHistoryNavigation.current = true; };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    if (window.location.hash) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (entry?.type !== "reload") return;
      toTop();
      // The browser may restore the old position after hydration; reset once more after that.
      requestAnimationFrame(toTop);
      return;
    }

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }
    toTop();
    // Next's own scroll handler runs after this in the same commit; reset again before the frame paints.
    const frame = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
