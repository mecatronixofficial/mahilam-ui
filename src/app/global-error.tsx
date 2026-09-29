"use client";
import { useEffect } from "react";
import "./globals.css";

/** Last-resort boundary (the root layout itself failed), so it can't rely on fonts, providers or the site shell. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html lang="en-IN">
      <body>
        <main className="mesh-hero grid min-h-screen place-items-center px-6 py-20 text-center">
          <div className="glass max-w-lg rounded-[36px] px-8 py-12">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-4xl" aria-hidden>🛠️</span>
            <p className="mt-6 text-7xl font-black tracking-tight text-emerald-950">500</p>
            <h1 className="mt-3 text-2xl font-black text-emerald-950">The website hit a bump.</h1>
            <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-slate-600">A critical error stopped the page from loading. Refreshing usually fixes it.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => reset()} className="btn-primary">Try again</button>
              {/* A plain link: the router may be unusable when the root layout has failed. */}
              <a href="/" className="btn-soft">Back to home</a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
