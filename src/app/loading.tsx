import { Smile } from "lucide-react";

/** Route-transition loader for public pages: brand mark on the page backdrop. */
export default function Loading() {
  return (
    <main className="mesh-hero grid min-h-[70vh] place-items-center px-6" role="status" aria-live="polite" aria-busy="true">
      <div className="glass flex flex-col items-center rounded-[32px] px-10 py-9 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-[22px] border-4 border-emerald-900/10 border-t-[#e58d73]" />
          <Smile className="h-7 w-7 text-emerald-800" strokeWidth={2.5} />
        </span>
        <p className="mt-4 font-display text-lg font-bold text-emerald-950">Loading Little Mahilam…</p>
      </div>
    </main>
  );
}
