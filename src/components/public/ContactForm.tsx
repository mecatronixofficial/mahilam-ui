"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, RotateCw, Send, WifiOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { telHref } from "@/lib/site";
import { validatePublicEnquiry } from "@/lib/enquiry-validation";

const PROGRAMS = ["Play Group", "Pre-KG", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3"];
const INITIAL = { parentName: "", studentName: "", phone: "", email: "", interestedClass: "Pre-KG", message: "", website: "", consent: false };

type Errors = Partial<Record<keyof typeof INITIAL, string>>;

export function ContactForm({ mode = "visit", phone }: { mode?: "visit" | "admission"; phone?: string }) {
  const [form, setForm] = useState(INITIAL);
  const [programs, setPrograms] = useState(PROGRAMS);
  useEffect(() => {
    let active = true;
    api<{ data: { name: string }[] }>("/cms/public/programs").then(response => {
      const names = [...new Set(response.data.map(program => program.name.trim()).filter(Boolean))];
      if (active && names.length) {
        setPrograms(names);
        setForm(current => names.includes(current.interestedClass) ? current : { ...current, interestedClass: names[0] });
      }
    }).catch(() => { /* Preserve the existing program choices when the public CMS is unavailable. */ });
    return () => { active = false; };
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "success" | "error" | "offline">("idle");
  const [message, setMessage] = useState("");

  function update(field: keyof typeof INITIAL, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next: Errors = validatePublicEnquiry(form);
    if (!form.consent) next.consent = "Please consent to the school contacting you about this request.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    if (form.website) return; // honeypot: bots fill hidden fields
    if (!validate()) return;
    setState("sending");
    setMessage("");
    try {
      const { website: _honeypot, ...payload } = form;
      await api("/enquiries/public", { method: "POST", body: JSON.stringify({ ...payload, parentName: payload.parentName.trim(), studentName: payload.studentName.trim(), phone: payload.phone.trim(), email: payload.email.trim() || undefined, message: payload.message.trim() || undefined, source: "WEBSITE", purpose: mode === "admission" ? "ADMISSION" : "CONTACT" }) });
      setForm({ ...INITIAL, interestedClass: programs.includes("Pre-KG") ? "Pre-KG" : programs[0] });
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
        <span className="flex h-20 w-20 animate-pop items-center justify-center rounded-[26px] bg-little-green-100 text-little-green-700 shadow-lg shadow-little-green-900/10"><CheckCircle2 className="h-10 w-10" /></span>
        <h3 className="text-3xl font-bold text-little-green-950">Thank you!</h3>
        <p className="max-w-md text-lg leading-8 text-little-neutral-600">Your {mode === "admission" ? "admission enquiry" : "visit request"} has reached our team. We&apos;ll call you within one working day.</p>
        {phone && <p className="text-sm font-bold text-little-neutral-500">Need us sooner? Call <a className="text-little-green-800 underline" href={telHref(phone)}>{phone}</a></p>}
        <button type="button" onClick={() => setState("idle")} className="btn-soft mt-2"><RotateCw className="h-4 w-4" />Send another enquiry</button>
      </div>
    );
  }

  const sending = state === "sending";
  return (
    <form onSubmit={submit} noValidate className="glass-card grid gap-5 p-6 md:p-8" aria-describedby="form-note">
      <div>
        <p className="text-xs font-black uppercase tracking-[.15em] text-little-green-700">{mode === "admission" ? "Admission enquiry" : "Plan your visit"}</p>
        <h3 className="mt-2 text-2xl font-bold text-little-green-950 md:text-3xl">{mode === "admission" ? "Start your child's journey" : "Book a campus tour"}</h3>
        <p id="form-note" className="mt-2 text-sm leading-6 text-little-neutral-500">Fields marked * are required. We never share your details.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="parentName" label="Parent / guardian name" required error={errors.parentName}><input id="parentName" className="input" autoComplete="name" value={form.parentName} onChange={(e) => update("parentName", e.target.value)} aria-invalid={Boolean(errors.parentName)} aria-describedby={errors.parentName ? "parentName-error" : undefined} /></Field>
        <Field id="studentName" label="Child's name" required error={errors.studentName}><input id="studentName" className="input" value={form.studentName} onChange={(e) => update("studentName", e.target.value)} aria-invalid={Boolean(errors.studentName)} aria-describedby={errors.studentName ? "studentName-error" : undefined} /></Field>
        <Field id="phone" label="Mobile number" required error={errors.phone}><input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} /></Field>
        <Field id="email" label="Email address" error={errors.email}><input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} /></Field>
      </div>
      <Field id="interestedClass" label="Program of interest" required>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Program of interest">
          {programs.map((program) => (
            <button key={program} type="button" role="radio" aria-checked={form.interestedClass === program} onClick={() => update("interestedClass", program)} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${form.interestedClass === program ? "border-transparent bg-little-green-800 text-white shadow-md" : "border-little-green-900/15 bg-white/70 text-little-neutral-600 hover:bg-white"}`}>
              {program}
            </button>
          ))}
        </div>
      </Field>
      <Field id="message" label="How can we help?"><textarea id="message" className="input min-h-28 resize-y" maxLength={1000} placeholder="Questions, preferred visit day or time…" value={form.message} onChange={(e) => update("message", e.target.value)} /></Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" aria-hidden />
      <label className="flex items-start gap-2 text-xs leading-5 text-little-neutral-600"><input type="checkbox" className="mt-1" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /><span>I consent to Little Mahilam storing my details and contacting me about this request. <Link className="underline" href="/privacy-policy">Privacy policy</Link>{errors.consent && <span className="block text-little-coral-600">{errors.consent}</span>}</span></label>
      <button className="btn-primary min-h-12" type="submit" disabled={sending}>
        {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? "Sending…" : mode === "admission" ? "Submit admission enquiry" : "Request a school visit"}
      </button>
      {(state === "error" || state === "offline") && (
        <div role="alert" className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${state === "offline" ? "bg-little-yellow-50 text-little-yellow-900" : "bg-little-coral-50 text-little-coral-700"}`}>
          {state === "offline" && <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{state === "offline" ? "You seem to be offline. Your details are still here — please try again when you're connected." : message}{phone && <> Or call us on <a className="underline" href={telHref(phone)}>{phone}</a>.</>}</span>
        </div>
      )}
    </form>
  );
}

function Field({ id, label, required = false, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">{label}{required && <span className="text-little-pink-600"> *</span>}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-bold text-little-coral-600">{error}</p>}
    </div>
  );
}
