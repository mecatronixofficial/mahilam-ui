"use client";
import Link from "next/link";
import { Clock3, LogIn } from "lucide-react";

/** Shown over the workspace when the refresh token is gone, so unsaved context stays visible behind it. */
export function SessionExpiredDialog({ next }: { next: string }) {
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="session-title" aria-describedby="session-copy">
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-md" />
      <div className="panel-glass relative w-full max-w-md animate-pop p-8 text-center !bg-white/80">
        <span className="accent-bg mx-auto flex h-16 w-16 items-center justify-center rounded-[22px]"><Clock3 className="h-8 w-8" /></span>
        <h2 id="session-title" className="mt-5 text-2xl font-black">Your session has expired</h2>
        <p id="session-copy" className="mt-2 leading-7 text-slate-500">For your security you were signed out. Sign in again to continue — you&apos;ll come straight back to this page.</p>
        <Link href={`/login?next=${encodeURIComponent(next)}&reason=expired`} className="btn-primary mt-6 w-full" autoFocus>
          <LogIn className="h-4 w-4" /> Sign in again
        </Link>
        <Link href="/" className="mt-3 inline-block text-sm font-bold text-slate-500 hover:text-slate-800">Go to website</Link>
      </div>
    </div>
  );
}
