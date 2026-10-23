"use client";
import { useCallback, useEffect, useState } from "react";

const SEEN_KEY = "announcement-seen";

/**
 * Opens a popup `delayMs` after mount, at most once per browser session for a given `key`.
 * Returns `[open, close]`; `close` remembers the key so the popup stays dismissed until the tab is closed.
 */
export function useSessionPopup(key: string | null, delayMs = 1200) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!key) return;
    let seen: string | null = null;
    try { seen = sessionStorage.getItem(SEEN_KEY); } catch { /* storage blocked */ }
    if (seen === key) return;
    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [key, delayMs]);

  const close = useCallback(() => {
    setOpen(false);
    try { if (key) sessionStorage.setItem(SEEN_KEY, key); } catch { /* storage blocked */ }
  }, [key]);

  return [open, close] as const;
}
