import { contentText, type SectionContent } from "@/lib/page-content";
import type { ReactNode } from "react";
import { Appear as Reveal } from "@/components/animations/Appear";

/** Scroll reveal: rises and fades in once, as it scrolls into view (CSS animation, see globals.css). */
export function Appear({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return <Reveal className={className} d={delay} y={y} dur={0.9}>{children}</Reveal>;
}

/** Section heading block: eyebrow chip, title and optional lead, centred. */
export function SectionHeading({ eyebrow, icon, title, lead, content, className = "" }: { content?: SectionContent; eyebrow: string; icon?: ReactNode; title: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <Appear className={`relative mx-auto max-w-3xl text-center ${className}`}>
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800 shadow-[0_8px_20px_-12px_rgba(36,68,32,.45)]">
        {icon}{contentText(content, "eyebrow") || eyebrow}
      </span>
      <h2 className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] text-little-green-950">{contentText(content, "heading") || title}</h2>
      {lead && <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-8 text-little-neutral-600">{contentText(content, "description") || lead}</p>}
    </Appear>
  );
}
