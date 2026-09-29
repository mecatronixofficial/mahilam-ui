import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ALL_FAQS } from "@/lib/faqs";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQs — Admissions, Age Criteria & Curriculum",
  description: "Answers to common questions about Little Mahilam Preschool, Tiruppur: age criteria for Play Group to Grade 3, the admission process, documents, curriculum and campus visits.",
  path: "/faq",
  keywords: ["preschool age criteria Tamil Nadu", "LKG age limit", "preschool admission documents", "play school FAQ Tiruppur"],
});

export default function FaqPage() {
  const groups = Object.entries(ALL_FAQS);
  return (
    <PublicShell>
      <JsonLd data={faqSchema(groups.flatMap(([, faqs]) => faqs))} />
      <PageHero eyebrow="FAQs" title="Questions parents ask us." description="Everything you'd like to know about admissions, our learning approach and visiting the school. Can't find your answer? We're happy to help." crumbs={[{ name: "FAQs", path: "/faq" }]} />
      <section className="py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <nav aria-label="FAQ topics" className="glass-card p-6 lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Topics</p>
            <ul className="mt-3 grid gap-1">
              {groups.map(([topic, faqs]) => (
                <li key={topic}><a href={`#${topic.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-emerald-950 hover:bg-white/80">{topic}<span className="text-xs text-slate-400">{faqs.length}</span></a></li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-emerald-50/80 p-4">
              <MessageCircleQuestion className="h-6 w-6 text-emerald-700" />
              <p className="mt-2 text-sm font-bold text-emerald-950">Still have a question?</p>
              <Link href="/contact" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Ask our team <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </nav>
          <div className="grid gap-10">
            {groups.map(([topic, faqs]) => (
              <section key={topic} id={topic.toLowerCase().replace(/[^a-z]+/g, "-")} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-emerald-950 md:text-3xl">{topic}</h2>
                <div className="glass-card mt-4 divide-y divide-emerald-950/10 px-6">
                  {faqs.map((faq, index) => (
                    <details key={faq.q} className="group py-5" open={index === 0}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-emerald-950">{faq.q}<span className="text-2xl leading-none text-emerald-700 transition group-open:rotate-45">+</span></summary>
                      <p className="mt-3 leading-8 text-slate-600">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </PublicShell>
  );
}
