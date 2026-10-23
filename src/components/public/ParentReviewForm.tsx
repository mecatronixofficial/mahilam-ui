"use client";
import { contentText, type SectionContent } from "@/lib/page-content";


import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send, ShieldCheck, Star, WifiOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingShape } from "@/components/animations/FloatingShape";
import { Drift } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowBubble, MarkedWord, Shape, PALETTE } from "./PlayShapes";

const INITIAL = { parentName: "", location: "", mobile: "", email: "", subject: "", rating: 5, testimonial: "" };
const RATING_LABELS = ["", "Needs work", "Okay", "Good", "Very good", "Wonderful!"];

export function ParentReviewForm({ content }: { content?: SectionContent } = {}) {
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
    <section className="relative overflow-hidden py-16 md:py-24">
      <Drift className="absolute -left-24 bottom-10 hidden w-72 lg:block" y={50} rotate={-14}><Shape name="arch" color={PALETTE.peach} /></Drift>
      <div className="container-pad relative grid grid-cols-1 gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.coral } as React.CSSProperties}>{contentText(content, "eyebrow") || "Share your experience"}</Reveal>
          <AnimatedText className="lm-title mt-4">{contentText(content, "heading") || <>Your story can help another <MarkedWord shape="cloud" color={PALETTE.peach} rotate={6}>family.</MarkedWord></>}</AnimatedText>
          <Reveal as="p" variant="rise" delay={0.2} className="lm-lead mt-6 max-w-lg">{contentText(content, "description") || "Are you a Little Mahilam parent? Tell us what your family values about the school. Reviews are checked before they appear publicly."}</Reveal>
          <Reveal variant="rise" delay={0.3} className="mt-8 flex gap-3 rounded-[24px] bg-little-yellow-100 p-5 text-sm leading-6 text-little-green-900/80">
            <ShieldCheck className="h-5 w-5 shrink-0 text-little-green-900" />
            <p><strong className="text-little-green-900">Privacy note:</strong> your mobile number and email are used only to verify the review and are never shown publicly.</p>
          </Reveal>
        </div>

        <Reveal variant="right" className="min-w-0">
        {status === "success" ? (
          <div className="grid place-items-center gap-4 rounded-[32px] bg-little-blue-100 p-10 text-center" role="status" aria-live="polite">
            <span className="flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-white text-little-green-900"><CheckCircle2 className="h-10 w-10" /></span>
            <h3 className="text-3xl font-extrabold tracking-tight">Thank you for sharing!</h3>
            <p className="max-w-md leading-7 text-little-green-900/75">Your review was sent to the school team. Once approved, it will appear on our website.</p>
            <button type="button" onClick={() => setStatus("idle")} className="lm-btn-light">Write another review<ArrowBubble /></button>
          </div>
        ) : (
          <form onSubmit={submit} className="relative grid min-w-0 gap-5 rounded-[32px] bg-little-blue-100 p-6 md:p-10">
            <div className="absolute -right-5 -top-6 w-16 md:w-20"><FloatingShape name="burst" color={PALETTE.blue} rotate={12} duration={5} /></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className="label mb-2 block">Parent / guardian name *</span><input className="input" autoComplete="name" maxLength={80} value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required /></label>
              <label><span className="label mb-2 block">Area / city *</span><input className="input" autoComplete="address-level2" maxLength={100} placeholder="e.g. Kangayam Road, Tiruppur" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></label>
              <label><span className="label mb-2 block">Mobile number *</span><input className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required /></label>
              <label><span className="label mb-2 block">Email address *</span><input className="input" type="email" autoComplete="email" maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            </div>
            <fieldset className="min-w-0">
              <legend className="label mb-2">Your rating *</legend>
              <div className="flex flex-wrap items-center gap-x-1 gap-y-2" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button key={rating} type="button" onClick={() => setForm({ ...form, rating })} onMouseEnter={() => setHover(rating)} aria-label={`${rating} star${rating > 1 ? "s" : ""}`} aria-pressed={form.rating === rating} className="rounded-xl p-1 transition-transform hover:scale-115">
                    <Star className={`h-8 w-8 transition ${rating <= shown ? "fill-little-coral-300 text-little-green-900" : "text-little-green-900/25"}`} />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-little-green-900/60">{RATING_LABELS[shown]}</span>
              </div>
            </fieldset>
            <label><span className="label mb-2 block">Headline *</span><input className="input" maxLength={120} placeholder="e.g. My daughter loves going to school" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></label>
            <label>
              <span className="label mb-2 block">Your review *</span>
              <textarea className="input min-h-32 resize-y" minLength={10} maxLength={1000} placeholder="What has your family's experience been like?" value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} required />
              <span className={`mt-1 block text-right text-xs ${form.testimonial.length > 950 ? "font-bold text-little-yellow-700" : "text-little-neutral-600"}`}>{form.testimonial.length}/1000</span>
            </label>
            <button type="submit" disabled={status === "sending"} className="lm-btn justify-self-start disabled:opacity-60">{status === "sending" ? "Sending review…" : "Submit my review"}<span aria-hidden className="lm-btn-arrow">{status === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</span></button>
            {(status === "error" || status === "offline") && (
              <div role="alert" className={`flex gap-2 rounded-2xl p-4 text-sm font-bold ${status === "offline" ? "bg-little-yellow-50 text-little-yellow-900" : "bg-little-coral-50 text-little-coral-700"}`}>
                {status === "offline" && <WifiOff className="h-5 w-5 shrink-0" />}
                {status === "offline" ? "You seem to be offline. Your review is still here — try again once you're connected." : message}
              </div>
            )}
          </form>
        )}
        </Reveal>
      </div>
    </section>
  );
}
