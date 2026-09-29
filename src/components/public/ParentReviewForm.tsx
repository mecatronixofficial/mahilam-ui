"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send, ShieldCheck, Star, WifiOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const INITIAL = { parentName: "", location: "", mobile: "", email: "", subject: "", rating: 5, testimonial: "" };
const RATING_LABELS = ["", "Needs work", "Okay", "Good", "Very good", "Wonderful!"];

export function ParentReviewForm() {
  const [form, setForm] = useState(INITIAL);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "offline">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      await api("/cms/public/testimonials", { method: "POST", body: JSON.stringify(form) });
      setForm(INITIAL);
      setStatus("success");
    } catch (error) {
      const offline = error instanceof ApiError && (error.kind === "network" || error.kind === "timeout");
      setStatus(offline ? "offline" : "error");
      setMessage(error instanceof ApiError && error.kind === "rate-limit" ? "You've sent a few reviews already — please try again in a minute." : error instanceof Error ? error.message : "Your review could not be sent. Please try again.");
    }
  }

  const shown = hover || form.rating;

  return (
    <section className="section-tint py-16 md:py-20">
      <div className="container-pad grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <span className="eyebrow">Share your experience</span>
          <h2 className="section-title mt-4 text-emerald-950">Your story can help another family.</h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">Are you a Little Mahilam parent? Tell us what your family values about the school. Reviews are checked before they appear publicly.</p>
          <div className="glass-card mt-6 flex gap-3 p-5 text-sm leading-6 text-slate-600">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" />
            <p><strong className="text-emerald-950">Privacy note:</strong> your mobile number and email are used only to verify the review and are never shown publicly.</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="glass-card grid place-items-center gap-4 p-10 text-center" role="status" aria-live="polite">
            <span className="flex h-20 w-20 animate-pop items-center justify-center rounded-[26px] bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-10 w-10" /></span>
            <h3 className="text-3xl font-bold text-emerald-950">Thank you for sharing!</h3>
            <p className="max-w-md leading-7 text-slate-600">Your review was sent to the school team. Once approved, it will appear on our website.</p>
            <button type="button" onClick={() => setStatus("idle")} className="btn-soft">Write another review</button>
          </div>
        ) : (
          <form onSubmit={submit} className="glass-card grid gap-5 p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className="label mb-2 block">Parent / guardian name *</span><input className="input" autoComplete="name" maxLength={80} value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required /></label>
              <label><span className="label mb-2 block">Area / city *</span><input className="input" autoComplete="address-level2" maxLength={100} placeholder="e.g. Kangayam Road, Tiruppur" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></label>
              <label><span className="label mb-2 block">Mobile number *</span><input className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required /></label>
              <label><span className="label mb-2 block">Email address *</span><input className="input" type="email" autoComplete="email" maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            </div>
            <fieldset>
              <legend className="label mb-2">Your rating *</legend>
              <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button key={rating} type="button" onClick={() => setForm({ ...form, rating })} onMouseEnter={() => setHover(rating)} aria-label={`${rating} star${rating > 1 ? "s" : ""}`} aria-pressed={form.rating === rating} className="rounded-xl p-1 transition-transform hover:scale-115">
                    <Star className={`h-8 w-8 transition ${rating <= shown ? "fill-[#f7c85b] text-[#d6a62d]" : "text-slate-300"}`} />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-slate-500">{RATING_LABELS[shown]}</span>
              </div>
            </fieldset>
            <label><span className="label mb-2 block">Headline *</span><input className="input" maxLength={120} placeholder="e.g. My daughter loves going to school" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></label>
            <label>
              <span className="label mb-2 block">Your review *</span>
              <textarea className="input min-h-32 resize-y" minLength={10} maxLength={1000} placeholder="What has your family's experience been like?" value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} required />
              <span className={`mt-1 block text-right text-xs ${form.testimonial.length > 950 ? "font-bold text-amber-700" : "text-slate-400"}`}>{form.testimonial.length}/1000</span>
            </label>
            <button type="submit" disabled={status === "sending"} className="btn-primary min-h-12">{status === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{status === "sending" ? "Sending review…" : "Submit my review"}</button>
            {(status === "error" || status === "offline") && (
              <div role="alert" className={`flex gap-2 rounded-2xl p-4 text-sm font-bold ${status === "offline" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-700"}`}>
                {status === "offline" && <WifiOff className="h-5 w-5 shrink-0" />}
                {status === "offline" ? "You seem to be offline. Your review is still here — try again once you're connected." : message}
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
