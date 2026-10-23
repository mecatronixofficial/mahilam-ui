"use client";

import { useState, type ReactNode } from "react";
import { Burst } from "@/components/programs/Fx";
import { prefersReducedMotion } from "@/components/animations/motion";

/** Pops a small confetti burst when a mouse enters (or keyboard focus reaches) its contents. Only rendered after interaction, so SSR stays deterministic. */
export function Celebrate({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [shot, setShot] = useState(0);
  const fire = () => { if (!prefersReducedMotion()) setShot((n) => n + 1); };
  return (
    <span
      className={`relative inline-flex ${className}`}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") fire(); }}
      onFocus={fire}
    >
      {children}
      {shot > 0 && <Burst key={shot} count={16} spread={110} />}
    </span>
  );
}
