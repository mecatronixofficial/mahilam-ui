"use client";
import { useState } from "react";
import { LoaderCircle, Mail, PartyPopper, Send } from "lucide-react";
import { api, errorMessage } from "@/lib/api";

type Status = "idle" | "sending" | "done" | "error";

/** Footer newsletter sign-up. Saves the email via POST /newsletter/subscribe. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await api<{ message?: string }>("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email: email.trim(), website: website || undefined }) });
      setStatus("done");
      setMessage(res.message || "Thank you for subscribing!");
    } catch (error) {
      setStatus("error");
      setMessage(errorMessage(error, "Couldn't subscribe right now. Please try again."));
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="flex animate-pop items-center gap-3 rounded-[22px] bg-emerald-950 px-4 py-3.5 text-white shadow-lg">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950">
          <PartyPopper className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-base font-bold">You&apos;re on the list!</span>
          <span className="block text-sm text-white/70">{message}</span>
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <div className="flex flex-col gap-2 rounded-[22px] bg-white p-2 shadow-[0_10px_30px_-12px_rgba(23,60,47,.45)] sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Email address</span>
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-emerald-700/60" />
          <input
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            inputMode="email"
            placeholder="parent@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
            aria-invalid={status === "error"}
            aria-describedby="newsletter-message"
            className="w-full rounded-2xl bg-transparent py-3 pl-10 pr-3 font-semibold text-emerald-950 outline-none placeholder:font-medium placeholder:text-slate-400 focus-visible:bg-emerald-50/60"
          />
        </label>
        {/* Honeypot: invisible to people, tempting to bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" />
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-extrabold text-white shadow-[0_4px_0_#0f2a20] transition-[transform,box-shadow,background-color] duration-150 hover:bg-emerald-800 active:translate-y-1 active:shadow-none disabled:opacity-70"
        >
          {status === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p id="newsletter-message" role={status === "error" ? "alert" : undefined} className={`mt-2 min-h-5 px-2 text-xs font-bold ${status === "error" ? "text-rose-800" : "text-emerald-950/60"}`}>
        {status === "error" ? message : "Only school news — no spam, ever."}
      </p>
    </form>
  );
}
