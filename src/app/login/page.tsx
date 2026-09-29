"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3, Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Smile, Sparkles, WifiOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";

/** Only same-site paths are allowed as a post-login destination. */
function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/login") ? value : "/crm";
}

export default function LoginPage() {
  return (
    <main className="mesh-hero grain relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <BrandPanel />
      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <Suspense fallback={<div className="glass h-[520px] w-full max-w-md animate-pulse rounded-[32px]" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <section className="mesh-dark relative hidden overflow-hidden p-12 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:p-16">
      <span aria-hidden className="absolute -right-10 top-24 h-24 w-20 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,#fff1cf,#f7c85b_45%,#ef9e8a)] opacity-70 [--r:8deg]" />
      <Link href="/" className="relative flex w-fit items-center gap-3 rounded-full focus-visible:outline-white">
        <span className="flex h-12 w-12 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950 shadow-lg shadow-black/20"><Smile className="h-6 w-6" strokeWidth={2.5} /></span>
        <span><span className="block font-display text-xl font-bold leading-tight">Little Mahilam</span><span className="block text-xs font-bold text-white/60">School of Happiness</span></span>
      </Link>

      <div className="relative max-w-xl py-12">
        <span className="glass-dark inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold text-[#f7c85b]"><Sparkles className="h-3.5 w-3.5" /> School workspace</span>
        <h1 className="mt-6 text-5xl font-bold leading-[1.02] xl:text-6xl">Everything your school team needs, in one happy place.</h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/65">Manage enquiries, admissions, students, fees and website content through one secure, connected workspace.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            [GraduationCap, "School CRM", "Enquiries, admissions, students & fees.", "#f7c85b"],
            [Sparkles, "Website CMS", "Banners, gallery, events, blog & more.", "#ef9e8a"],
          ].map(([Icon, title, copy, color]) => {
            const I = Icon as typeof Sparkles;
            return (
              <div key={title as string} className="glass-dark rounded-3xl p-5">
                <I className="h-6 w-6" style={{ color: color as string }} />
                <div className="mt-4 font-extrabold">{title as string}</div>
                <p className="mt-1 text-sm leading-6 text-white/55">{copy as string}</p>
              </div>
            );
          })}
        </div>
      </div>
      <p className="relative text-sm text-white/40">Authorised Little Mahilam team members only.</p>
    </section>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const expired = params.get("reason") === "expired";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState<{ message: string; offline?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(!expired);

  useEffect(() => {
    if (expired) return;
    // Already signed in? Skip the form. Any failure (signed out, offline) just shows it.
    api("/auth/me").then(() => router.replace(next)).catch(() => setCheckingSession(false));
  }, [router, next, expired]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
      router.replace(next);
    } catch (requestError) {
      const offline = requestError instanceof ApiError && (requestError.kind === "network" || requestError.kind === "timeout");
      const message = requestError instanceof ApiError && requestError.status === 401 ? "That email and password don't match. Please try again." : requestError instanceof Error ? requestError.message : "Unable to sign in. Please try again.";
      setError({ message, offline });
      setLoading(false);
    }
  }

  if (checkingSession) {
    return <div className="glass flex h-[520px] w-full max-w-md items-center justify-center rounded-[32px]" role="status" aria-live="polite"><LoaderCircle className="h-8 w-8 animate-spin text-emerald-700" /><span className="sr-only">Checking your session…</span></div>;
  }

  return (
    <div className="relative w-full max-w-md animate-fade-up">
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-emerald-950"><span className="flex h-10 w-10 rotate-3 items-center justify-center rounded-xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a]"><Smile className="h-5 w-5" /></span>Little Mahilam</Link>
        <Link href="/" aria-label="Back to website" className="glass-chip flex h-10 w-10 items-center justify-center rounded-full text-emerald-950"><ArrowLeft className="h-4 w-4" /></Link>
      </div>

      <div className="glass rounded-[32px] p-7 sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><LockKeyhole className="h-6 w-6" /></span>
        <h2 className="mt-6 text-3xl font-bold text-emerald-950">Welcome back</h2>
        <p className="mt-2 leading-7 text-slate-500">Sign in with your staff account to continue.</p>

        {expired && (
          <div role="status" className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-200/70 bg-sky-50/80 px-4 py-3 text-sm font-bold text-sky-900">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />Your session expired. Sign in again and we&apos;ll take you back where you were.
          </div>
        )}

        <form onSubmit={submit} className="mt-7 grid gap-5">
          <label>
            <span className="label mb-2 block">Email address</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input min-h-12 !pl-11" type="email" inputMode="email" autoComplete="username" placeholder="you@littlemahilam.in" maxLength={160} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required autoFocus />
            </span>
          </label>
          <label>
            <span className="label mb-2 block">Password</span>
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input min-h-12 !px-11" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))} onBlur={() => setCapsLock(false)} disabled={loading} required aria-invalid={Boolean(error) && !error?.offline} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-emerald-800" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
          </label>
          {capsLock && <p role="status" className="-mt-3 text-xs font-bold text-amber-700">Caps Lock is on.</p>}
          {error && (
            <div role="alert" className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-bold ${error.offline ? "border-amber-200 bg-amber-50/90 text-amber-900" : "border-rose-100 bg-rose-50/90 text-rose-700"}`}>
              {error.offline && <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />}
              {error.offline ? "We can't reach the school server. Check your internet connection and try again." : error.message}
            </div>
          )}
          <button disabled={loading || !email || !password} className="btn-primary min-h-12 w-full" type="submit">
            {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            {loading ? "Signing in…" : "Secure sign in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2.5 border-t border-emerald-950/10 pt-5 text-xs leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <span><strong className="text-emerald-800">Secure staff access.</strong> Sessions use protected HTTP-only cookies with automatic renewal.</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center text-sm sm:flex-row sm:text-left">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-emerald-800 hover:text-emerald-950"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
        <span className="text-slate-500">Forgot password? Ask an administrator.</span>
      </div>
    </div>
  );
}
