import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, MessageCircle, Phone, School, SearchCheck, UserCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { ContactForm } from "@/components/public/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { ADMISSION_FAQS } from "@/lib/faqs";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Admissions Open — Play Group to Grade 3",
  description: "Apply to Little Mahilam Preschool, Tiruppur. Simple admission process for Play Group, Pre-KG, LKG, UKG and Grades 1–3. Send an enquiry and book a campus visit today.",
  path: "/admissions",
  keywords: ["preschool admission Tiruppur", "LKG admission Tiruppur", "UKG admission Tiruppur", "play school admission near me"],
});

const STEPS = [
  { icon: MessageCircle, title: "Send an enquiry", copy: "Share your contact details and the program you are considering." },
  { icon: UserCheck, title: "Speak with our team", copy: "We answer your questions and understand what your family needs." },
  { icon: School, title: "Visit the school", copy: "Meet the educators and experience the Little Mahilam environment." },
  { icon: FileCheck2, title: "Complete the application", copy: "Submit the application and the required supporting documents." },
  { icon: SearchCheck, title: "Review & confirmation", copy: "The school reviews availability and confirms the next steps." },
  { icon: CheckCircle2, title: "Welcome to the family", copy: "Complete the fee process and get ready for a happy first day." },
] as const;

const TINTS = ["#3f7a63", "#d6a62d", "#e58d73"];

export default function AdmissionsPage() {
  return (
    <PublicShell>
      <JsonLd data={faqSchema(ADMISSION_FAQS)} />
      <PageHero eyebrow="Admissions" title="A happy beginning starts here." description="From your first question to your child's first day, our team in Tiruppur will guide your family through every step." crumbs={[{ name: "Admissions", path: "/admissions" }]}>
        <a href="#enquire" className="btn-accent">Enquire now <ArrowRight className="h-4 w-4" /></a>
        {site.phone && <a href={telHref(site.phone)} className="btn-soft"><Phone className="h-4 w-4" /> {site.phone}</a>}
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="container-pad">
          <div className="max-w-2xl">
            <span className="eyebrow">Simple &amp; supportive</span>
            <h2 className="section-title mt-4 text-emerald-950">Your admission journey.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Clear steps, friendly guidance and space to ask every question along the way.</p>
          </div>
          <ol className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, copy }, index) => (
              <li key={title} className="glass-card reveal relative overflow-hidden p-6">
                <span aria-hidden className="absolute -right-3 -top-4 font-display text-8xl font-bold text-emerald-950/[.05]">{index + 1}</span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${TINTS[index % 3]}1f`, color: TINTS[index % 3] }}><Icon className="h-5 w-5" /></span>
                <p className="relative mt-5 text-xs font-black uppercase tracking-[.14em] text-slate-400">Step {index + 1}</p>
                <h3 className="relative mt-1 text-xl font-bold text-emerald-950">{title}</h3>
                <p className="relative mt-2 leading-7 text-slate-600">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="enquire" className="section-mint scroll-mt-28 py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Enquire now</span>
            <h2 className="section-title mt-4 text-emerald-950">Tell us about your little learner.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Submit the form and our admissions team will contact you to discuss availability and the best next step.</p>
            <div className="glass-card mt-6 p-5 text-sm leading-6 text-slate-600"><strong className="text-emerald-950">Please note:</strong> an enquiry does not guarantee admission. Placement is subject to age eligibility, document verification and seat availability.</div>
          </div>
          <ContactForm mode="admission" />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Admission FAQs</span>
            <h2 className="section-title mt-4 text-emerald-950">Questions parents ask.</h2>
            <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 font-bold text-emerald-800">See all FAQs <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="glass-card divide-y divide-emerald-950/10 px-6">
            {ADMISSION_FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-emerald-950">{faq.q}<span className="text-2xl leading-none text-emerald-700 transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 leading-7 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
