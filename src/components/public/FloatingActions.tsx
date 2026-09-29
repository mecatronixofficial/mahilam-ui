"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL;
const FLY_AWAY_MS = 550;

export function FloatingActions() {
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
          className={`relative mb-2 flex h-14 w-12 items-center justify-center transition-all ease-in ${
            leaving
              ? "-translate-y-32 opacity-0 duration-500"
              : "motion-safe:animate-bounce duration-200"
          }`}
        >
          <span className="absolute -bottom-3 left-1/2 h-4 w-px -translate-x-1/2 bg-emerald-950/25" />
          <span
            className="absolute -bottom-1.5 left-1/2 h-2 w-2.5 -translate-x-1/2"
            style={{ backgroundColor: "#ef9e8a", clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
          />
          <span
            className="relative flex h-14 w-12 items-center justify-center shadow-lg shadow-emerald-950/25 transition-shadow hover:shadow-xl"
            style={{
              background: "radial-gradient(circle at 33% 28%, #fff1cf, #f7c85b 45%, #ef9e8a 100%)",
              borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%",
            }}
          >
            <ArrowUp className="h-5 w-5 text-emerald-950" strokeWidth={3} />
          </span>
        </button>
      )}

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-950/25 transition-transform hover:scale-105"
        >
          <span className="motion-safe:animate-ping absolute inset-0 rounded-full bg-[#25D366]/60" />
          <WhatsappIcon className="relative h-7 w-7" />
        </a>
      )}
    </div>
  );
}
