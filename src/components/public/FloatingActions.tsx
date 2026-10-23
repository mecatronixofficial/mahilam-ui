"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";
import { BalloonString } from "./BalloonString";
import { BRAND } from "@/lib/brand";

const FLY_AWAY_MS = 550;

export function FloatingActions({ whatsapp }: { whatsapp?: string }) {
  const [showTop, setShowTop] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!leaving) setShowTop(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [leaving]);

  function handleScrollTop() {
    setLeaving(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setShowTop(false);
      setLeaving(false);
    }, FLY_AWAY_MS);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {showTop && (
        <button
          onClick={handleScrollTop}
          disabled={leaving}
          aria-label="Scroll to top"
          className={`relative mb-8 flex h-14 w-12 items-center justify-center transition-all ease-in ${
            leaving
              ? "-translate-y-32 opacity-0 duration-500"
              : "motion-safe:animate-bounce duration-200"
          }`}
        >
          <BalloonString length={28} color="rgba(36,68,32,.4)" className="absolute left-[calc(50%-6px)] top-[calc(100%+5px)]" />
          <span
            className="absolute -bottom-1.5 left-1/2 h-2 w-2.5 -translate-x-1/2"
            style={{ backgroundColor: BRAND.coral[300], clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
          />
          <span
            className="relative flex h-14 w-12 items-center justify-center shadow-lg shadow-little-green-950/25 transition-shadow hover:shadow-xl"
            style={{
              background: "radial-gradient(circle at 33% 28%, var(--color-little-yellow-50), var(--color-little-yellow-400) 45%, var(--color-little-coral-300) 100%)",
              borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%",
            }}
          >
            <ArrowUp className="h-5 w-5 text-little-green-950" strokeWidth={3} />
          </span>
        </button>
      )}

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-little-green-950/25 transition-transform hover:scale-105"
        >
          <span className="motion-safe:animate-ping absolute inset-0 rounded-full bg-[#25D366]/60" />
          <WhatsappIcon className="relative h-7 w-7" />
        </a>
      )}
    </div>
  );
}
