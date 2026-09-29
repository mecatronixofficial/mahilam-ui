"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, RotateCw, Send, WifiOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { site, telHref } from "@/lib/site";

const PROGRAMS = ["Play Group", "Pre-KG", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3"];
const INITIAL = { parentName: "", studentName: "", phone: "", email: "", interestedClass: "Pre-KG", message: "", website: "" };
/** Indian mobile (optionally +91 / 0 prefixed) or a landline with STD code. */
const PHONE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$|^0\d{2,4}[\s-]?\d{6,8}$/;

type Errors = Partial<Record<keyof typeof INITIAL, string>>;

export function ContactForm({ mode = "visit" }: { mode?: "visit" | "admission" }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "success" | "error" | "offline">("idle");
  const [message, setMessage] = useState("");

  function update(field: keyof typeof INITIAL, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (form.parentName.trim().length < 2) next.parentName = "Please enter your name.";
    if (form.studentName.trim().length < 2) next.studentName = "Please enter your child's name.";
    if (!PHONE.test(form.phone.trim())) next.phone = "Please enter a valid 10-digit mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please check the email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website) return; // honeypot: bots fill hidden fields
    if (!validate()) return;
    setState("sending");
    setMessage("");
    try {
      const { website: _honeypot, ...payload } = form;
      await api("/enquiries/public", { method: "POST", body: JSON.stringify({ ...payload, email: payload.email || undefined, message: payload.message || undefined, source: "WEBSITE" }) });
      setForm(INITIAL);
      setState("success");
    } catch (error) {
      const offline = error instanceof ApiError && (error.kind === "network" || error.kind === "timeout");
      setState(offline ? "offline" : "error");
      setMessage(error instanceof Error ? error.message : "We could not send your request. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="glass-card grid place-items-center gap-4 p-10 text-center" role="status" aria-live="polite">
        <span className="flex h-20 w-20 animate-pop items-center justify-center rounded-[26px] bg-emerald-100 text-emerald-700 shadow-lg shadow-emerald-900/10"><CheckCircle2 className="h-10 w-10" /></span>
        <h3 className="text-3xl font-bold text-emerald-950">Thank you!</h3>
        <p className="max-w-md text-lg leading-8 text-slate-600">Your {mode === "admission" ? "admission enquiry" : "visit request"} has reached our team. We&apos;ll call you within one working day.</p>
        {site.phone && <p className="text-sm font-bold text-slate-500">Need us sooner? Call <a className="text-emerald-800 underline" href={telHref(site.phone)}>{site.phone}</a></p>}
        <button type="button" onClick={() => setState("idle")} className="btn-soft mt-2"><RotateCw className="h-4 w-4" />Send another enquiry</button>
      </div>
    );
  }

  const sending = state === "sending";
  return (
    <form onSubmit={submit} noValidate className="glass-card grid gap-5 p-6 md:p-8" aria-describedby="form-note">
      <div>
        <p className="text-xs font-black uppercase tracking-[.15em] text-emerald-700">{mode === "admission" ? "Admission enquiry" : "Plan your visit"}</p>
        <h3 className="mt-2 text-2xl font-bold text-emerald-950 md:text-3xl">{mode === "admission" ? "Start your child's journey" : "Book a campus tour"}</h3>
        <p id="form-note" className="mt-2 text-sm leading-6 text-slate-500">Fields marked * are required. We never share your details.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="parentName" label="Parent / guardian name" required error={errors.parentName}><input id="parentName" className="input" autoComplete="name" value={form.parentName} onChange={(e) => update("parentName", e.target.value)} aria-invalid={Boolean(errors.parentName)} aria-describedby={errors.parentName ? "parentName-error" : undefined} /></Field>
        <Field id="studentName" label="Child's name" required error={errors.studentName}><input id="studentName" className="input" value={form.studentName} onChange={(e) => update("studentName", e.target.value)} aria-invalid={Boolean(errors.studentName)} aria-describedby={errors.studentName ? "studentName-error" : undefined} /></Field>
        <Field id="phone" label="Mobile number" required error={errors.phone}><input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} /></Field>
        <Field id="email" label="Email address" error={errors.email}><input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} /></Field>
      </div>
      <Field id="interestedClass" label="Program of interest" required>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Program of interest">
          {PROGRAMS.map((program) => (
            <button key={program} type="button" role="radio" aria-checked={form.interestedClass === program} onClick={() => update("interestedClass", program)} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${form.interestedClass === program ? "border-transparent bg-[#285744] text-white shadow-md" : "border-emerald-900/15 bg-white/70 text-slate-600 hover:bg-white"}`}>
              {program}
            </button>
          ))}
        </div>
      </Field>
      <Field id="message" label="How can we help?"><textarea id="message" className="input min-h-28 resize-y" maxLength={1000} placeholder="Questions, preferred visit day or time…" value={form.message} onChange={(e) => update("message", e.target.value)} /></Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" aria-hidden />
      <button className="btn-primary min-h-12" type="submit" disabled={sending}>
        {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? "Sending…" : mode === "admission" ? "Submit admission enquiry" : "Request a school visit"}
      </button>
      {(state === "error" || state === "offline") && (
        <div role="alert" className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${state === "offline" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-700"}`}>
          {state === "offline" && <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{state === "offline" ? "You seem to be offline. Your details are still here — please try again when you're connected." : message}{site.phone && <> Or call us on <a className="underline" href={telHref(site.phone)}>{site.phone}</a>.</>}</span>
        </div>
      )}
    </form>
  );
}

function Field({ id, label, required = false, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">{label}{required && <span className="text-[#d56e58]"> *</span>}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-bold text-rose-600">{error}</p>}
    </div>
  );
}
