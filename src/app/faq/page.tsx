import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, Smile, UserRound } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageBanner } from "@/components/public/PageBanner";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ALL_FAQS } from "@/lib/faqs";
import { localImage } from "@/lib/images";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQs — Admissions, Age Criteria & Curriculum",
  description: "Answers to common questions about Little Mahilam Preschool, Tiruppur: age criteria for Play Group to Grade 3, the admission process, documents, curriculum and campus visits.",
  path: "/faq",
  keywords: ["preschool age criteria Tamil Nadu", "LKG age limit", "preschool admission documents", "play school FAQ Tiruppur"],
});

const TOPIC_TINTS = ["#f7c85b", "#a7d9c1", "#ef9e8a", "#8cb9e8", "#c4b5fd"];
const slug = (topic: string) => topic.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqPage() {
  const groups = Object.entries(ALL_FAQS);
  return (
    <PublicShell>
      <JsonLd data={faqSchema(groups.flatMap(([, faqs]) => faqs))} />
      <PageBanner
        theme="faq"
        eyebrow="FAQs"
        icon={MessageCircleQuestion}
        title="Questions parents"
        highlight="ask us."
        description="Everything you'd like to know about admissions, our learning approach and visiting the school. Can't find your answer? We're happy to help."
        crumbs={[{ name: "FAQs", path: "/faq" }]}
        image={{ src: localImage("/images/banners/faq.webp", 0), alt: "Parents and children at Little Mahilam Preschool" }}
      />

      {/* Topic tabs */}
      <nav aria-label="FAQ topics" className="sticky top-[96px] z-30 border-b border-emerald-950/5 bg-[#fffaf0]/90 backdrop-blur-md">
        <div className="container-pad hide-scrollbar flex gap-2 overflow-x-auto py-3">
          {groups.map(([topic, faqs], i) => (
            <a key={topic} href={`#${slug(topic)}`} className="flex shrink-0 items-center gap-2 rounded-full border-2 bg-white px-4 py-2 text-sm font-extrabold text-emerald-950 transition hover:-translate-y-0.5" style={{ borderColor: TOPIC_TINTS[i % TOPIC_TINTS.length] }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TOPIC_TINTS[i % TOPIC_TINTS.length] }} />
              {topic}
              <span className="rounded-full bg-emerald-950/5 px-1.5 text-xs text-slate-500">{faqs.length}</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="py-14 md:py-20">
        <div className="container-pad mx-auto grid max-w-4xl gap-16">
          {groups.map(([topic, faqs], g) => {
            const tint = TOPIC_TINTS[g % TOPIC_TINTS.length];
            return (
              <section key={topic} id={slug(topic)} className="scroll-mt-44">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-2 rounded-full" style={{ backgroundColor: tint }} />
                  <h2 className="font-display text-2xl font-bold text-emerald-950 md:text-3xl">{topic}</h2>
                </div>
                <div className="mt-6 grid gap-4">
                  {faqs.map((faq, index) => (
                    <details key={faq.q} className="group" open={index === 0}>
                      {/* Parent's question: right-aligned bubble */}
                      <summary className="flex cursor-pointer list-none items-end justify-end gap-3">
                        <span className="max-w-[88%] rounded-[24px] rounded-br-md px-5 py-4 text-right font-display text-lg font-bold leading-snug text-emerald-950 shadow-sm transition group-open:shadow-md" style={{ backgroundColor: `${tint}66` }}>
                          {faq.q}
                          <span className="ml-2 inline-block text-emerald-800 transition group-open:rotate-45">+</span>
                        </span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"><UserRound className="h-4 w-4" /></span>
                      </summary>
                      {/* School's answer: left-aligned bubble */}
                      <div className="mt-3 flex items-end gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950 shadow-sm"><Smile className="h-5 w-5" /></span>
                        <p className="max-w-[88%] rounded-[24px] rounded-bl-md bg-white px-5 py-4 leading-8 text-slate-600 shadow-[0_12px_30px_-20px_rgba(23,60,47,.45)] ring-1 ring-emerald-950/5">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="flex flex-col items-center gap-4 rounded-[32px] bg-emerald-900 p-8 text-center text-white md:flex-row md:text-left">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10"><MessageCircleQuestion className="h-7 w-7 text-[#f7c85b]" /></span>
            <div className="flex-1">
              <p className="font-display text-xl font-bold">Still have a question?</p>
              <p className="mt-1 text-white/70">Our team is happy to chat — ask us anything about your child&apos;s first school.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#f7c85b] px-6 py-3 font-extrabold text-emerald-950">Ask our team <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </PublicShell>
  );
}
