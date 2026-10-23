"use client";

import Link from "next/link";
import Image from "@/components/media/SchoolImage";
import { BrandLogo } from "@/components/public/BrandLogo";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3, Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { BRAND } from "@/lib/brand";
import { canAccessPage, defaultWorkspace, type AuthUser } from "@/store/auth";
import { safeLoginDestination } from "@/lib/login-destination";

/** Only same-site paths are allowed as a post-login destination. */
function safeNext(value: string | null) {
  return safeLoginDestination(value);
}

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh overflow-hidden bg-little-cream-100 lg:grid-cols-[.9fr_1.1fr]">
      <BrandPanel />
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-6 sm:px-8 lg:px-12">
        <span aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[28px] border-little-yellow-400/50" />
        <span aria-hidden className="absolute bottom-10 left-8 h-12 w-12 rotate-12 rounded-2xl bg-little-green-200/60" />
        <span aria-hidden className="absolute right-[12%] top-[16%] hidden -rotate-12 font-display text-2xl font-black text-little-coral-600/35 sm:block">A B C</span>
        <Suspense fallback={<div className="h-[500px] w-full max-w-md animate-pulse rounded-[36px] bg-white/70" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <section className="relative hidden min-h-[680px] overflow-hidden bg-little-green-950 text-white lg:block">
      <Image src="/images/home/hero.webp" alt="Children learning happily at Little Mahilam Pre-school" fill priority sizes="45vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,37,29,.18),rgba(35,37,29,.35)_40%,rgba(35,37,29,.95)_100%)]" />
      <div aria-hidden className="absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

      <Link href="/" className="absolute left-8 top-7 z-10 flex w-fit rounded-[22px] bg-white/95 px-3 py-1 shadow-xl backdrop-blur focus-visible:outline-white xl:left-12 xl:top-10" aria-label="Little Mahilam Pre-school home">
        <BrandLogo priority className="h-auto w-44 xl:w-52" />
      </Link>

      <span aria-hidden className="absolute right-8 top-12 z-10 rotate-6 rounded-full bg-little-yellow-400 px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-little-green-950 shadow-lg">Play · Learn · Grow</span>

      <div className="absolute inset-x-7 bottom-7 z-10 max-w-xl rounded-[32px] rounded-bl-[10px] border border-white/15 bg-little-green-950/88 p-6 shadow-2xl backdrop-blur-md xl:inset-x-10 xl:bottom-10 xl:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-little-yellow-400"><Sparkles className="h-3.5 w-3.5" /> Secure school workspace</span>
        <h1 className="mt-4 font-display text-3xl font-bold leading-[1.04] xl:text-4xl">Everything your school team needs, in one happy place.</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/70 xl:text-base">Manage families, admissions and website content through one secure, connected workspace.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            [GraduationCap, "School CRM", "Enquiries, admissions, students & fees.", BRAND.yellow[400]],
            [Sparkles, "Website CMS", "Banners, gallery, events, blog & more.", BRAND.coral[300]],
          ].map(([Icon, title, copy, color]) => {
            const I = Icon as typeof Sparkles;
            return (
              <div key={title as string} className="rounded-[20px] border border-white/10 bg-white/[.08] p-3.5">
                <I className="h-5 w-5" style={{ color: color as string }} />
                <div className="mt-2 text-sm font-extrabold">{title as string}</div>
                <p className="mt-1 text-xs leading-5 text-white/55">{copy as string}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[.16em] text-white/40">Authorised team members only</p>
      </div>
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
    api<{ data: AuthUser }>("/auth/me").then(response => router.replace(canAccessPage(response.data.role, next) ? next : defaultWorkspace(response.data.role))).catch(() => setCheckingSession(false));
  }, [router, next, expired]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api<{ data: AuthUser }>("/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
      router.replace(canAccessPage(response.data.role, next) ? next : defaultWorkspace(response.data.role));
    } catch (requestError) {
      const offline = requestError instanceof ApiError && (requestError.kind === "network" || requestError.kind === "timeout");
      const message = requestError instanceof ApiError && requestError.status === 401 ? "That email and password don't match. Please try again." : requestError instanceof Error ? requestError.message : "Unable to sign in. Please try again.";
      setError({ message, offline });
      setLoading(false);
    }
  }

  if (checkingSession) {
    return <div className="glass flex h-[520px] w-full max-w-md items-center justify-center rounded-[32px]" role="status" aria-live="polite"><LoaderCircle className="h-8 w-8 animate-spin text-little-green-700" /><span className="sr-only">Checking your session…</span></div>;
  }

  return (
    <div className="relative z-10 w-full max-w-md animate-fade-up">
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <Link href="/" aria-label="Little Mahilam Pre-school home"><BrandLogo priority className="h-auto w-32" /></Link>
        <Link href="/" aria-label="Back to website" className="glass-chip flex h-10 w-10 items-center justify-center rounded-full text-little-green-950"><ArrowLeft className="h-4 w-4" /></Link>
      </div>

      <div className="relative rounded-[34px] border-4 border-white bg-white/90 p-5 shadow-[10px_12px_0_var(--color-little-yellow-400)] backdrop-blur-md sm:p-7">
        <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-little-coral-300/70" />
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 rotate-3 items-center justify-center rounded-2xl bg-little-green-900 text-white"><LockKeyhole className="h-5 w-5" /></span>
          <div><h2 className="font-display text-2xl font-bold text-little-green-950 sm:text-3xl">Welcome back!</h2><p className="mt-0.5 text-sm text-little-neutral-500">Sign in with your staff account.</p></div>
        </div>

        {expired && (
          <div role="status" className="mt-4 flex items-start gap-3 rounded-2xl border border-little-blue-200/70 bg-little-blue-50/80 px-4 py-2.5 text-xs font-bold text-little-blue-900">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />Your session expired. Sign in again and we&apos;ll take you back where you were.
          </div>
        )}

        <form onSubmit={submit} className="mt-5 grid gap-3.5">
          <label>
            <span className="label mb-1.5 block">Email address</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-little-neutral-500" />
              <input className="input min-h-12 !pl-11" type="email" inputMode="email" autoComplete="username" placeholder="you@littlemahilam.in" maxLength={160} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required autoFocus />
            </span>
          </label>
          <label>
            <span className="label mb-1.5 block">Password</span>
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-little-neutral-500" />
              <input className="input min-h-12 !px-11" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))} onBlur={() => setCapsLock(false)} disabled={loading} required aria-invalid={Boolean(error) && !error?.offline} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-little-neutral-500 hover:bg-little-neutral-100 hover:text-little-green-800" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
          </label>
          {capsLock && <p role="status" className="-mt-3 text-xs font-bold text-little-yellow-700">Caps Lock is on.</p>}
          {error && (
            <div role="alert" className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-bold ${error.offline ? "border-little-yellow-200 bg-little-yellow-50/90 text-little-yellow-900" : "border-little-coral-100 bg-little-coral-50/90 text-little-coral-700"}`}>
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

        <div className="mt-4 flex items-start gap-2.5 border-t border-little-green-950/10 pt-3 text-[11px] leading-4 text-little-neutral-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-little-green-700" />
          <span><strong className="text-little-green-800">Secure staff access.</strong> Sessions use protected HTTP-only cookies with automatic renewal.</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-little-green-800 hover:text-little-green-950"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
        <span className="text-little-neutral-500">Forgot password? Ask an administrator.</span>
      </div>
    </div>
  );
}
