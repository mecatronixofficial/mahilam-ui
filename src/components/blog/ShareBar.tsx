"use client";
import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

/** Share links for an article. Plain links to each network's share page (no third-party scripts). */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  // Known only in the browser, so decided after mount (keeps server and client HTML identical).
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  const enc = encodeURIComponent;
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, bg: "#25D366" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, bg: "#1877F2" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, bg: "#111" },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };
  const native = async () => {
    try { await navigator.share({ title, url }); } catch { /* cancelled */ }
  };

  const pill = "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-little-pink-400";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-neutral-500"><Share2 className="h-4 w-4" />Share</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={`${pill} text-white`} style={{ background: l.bg }} aria-label={`Share on ${l.label} (opens in a new tab)`}>{l.label}</a>
      ))}
      <button type="button" onClick={copy} className={`${pill} bg-white text-little-green-950 ring-2 ring-little-green-900/10`}>
        {copied ? <Check className="h-4 w-4 text-little-green-600" /> : <Link2 className="h-4 w-4" />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      {canShare && (
        <button type="button" onClick={native} className={`${pill} bg-little-yellow-300 text-little-green-950 sm:hidden`}>More…</button>
      )}
    </div>
  );
}
