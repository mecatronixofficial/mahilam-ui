import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, Backpack, CheckCircle2, FileCheck2, Flag, MessageCircle, Phone, School, SearchCheck, Trophy, UserCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageBanner } from "@/components/public/PageBanner";
import { CardSlider } from "@/components/public/CardSlider";
import { ContactForm } from "@/components/public/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { ADMISSION_FAQS } from "@/lib/faqs";
import { localImage } from "@/lib/images";
import { resolvePublicSite, telHref } from "@/lib/site";
import { getPublic } from "@/lib/server-api";
import { BRAND } from "@/lib/brand";

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

/** Board tiles: colour, and on large screens the snake order (row 2 runs right-to-left). */
const TILES = [
  { bg: BRAND.yellow[100], token: BRAND.yellow[700], order: "lg:order-1", arrow: "right" },
  { bg: BRAND.green[100], token: BRAND.green[700], order: "lg:order-2", arrow: "right" },
  { bg: BRAND.coral[100], token: BRAND.coral[500], order: "lg:order-3", arrow: "down" },
  { bg: BRAND.blue[100], token: BRAND.blue[600], order: "lg:order-6", arrow: "left" },
  { bg: BRAND.pink[50], token: BRAND.pink[600], order: "lg:order-5", arrow: "left" },
  { bg: BRAND.pink[100], token: BRAND.pink[600], order: "lg:order-4", arrow: "none" },
] as const;

export default async function AdmissionsPage() {
  const settings = await getPublic<Record<string, unknown>>("/settings", 0);
  const details = resolvePublicSite(settings);
  return (
    <PublicShell>
      <JsonLd data={faqSchema(ADMISSION_FAQS)} />
      <PageBanner
        theme="admissions"
        eyebrow="Admissions"
        icon={Backpack}
        title="A happy beginning"
        highlight="starts here."
        description="From your first question to your child's first day, our team in Tiruppur will guide your family through every step."
        crumbs={[{ name: "Admissions", path: "/admissions" }]}
        image={{ src: localImage("/images/banners/admissions.webp", 1), alt: "Happy children starting school at Little Mahilam, Tiruppur" }}
      />

      {/* Quick actions strip */}
      <div className="container-pad relative z-10 -mt-6 flex flex-wrap justify-center gap-3">
        <a href="#enquire" className="btn-accent shadow-lg">Enquire now <ArrowRight className="h-4 w-4" /></a>
        {details.phone && <a href={telHref(details.phone)} className="btn-soft shadow-lg"><Phone className="h-4 w-4" /> {details.phone}</a>}
      </div>

      {/* ======================================================
          JOURNEY — board-game path
      ====================================================== */}
      <section className="py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Simple &amp; supportive</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-little-green-950 sm:text-4xl lg:text-5xl">Your admission <span className="text-little-pink-600">journey.</span></h2>
            <p className="mt-4 text-lg leading-8 text-little-neutral-600">Clear steps, friendly guidance and space to ask every question along the way.</p>
          </div>

          <ol className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-16">
            {STEPS.map(({ icon: Icon, title, copy }, index) => {
              const tile = TILES[index];
              const first = index === 0;
              const last = index === STEPS.length - 1;
              return (
                <li key={title} className={`relative ${tile.order}`}>
                  <div className="relative h-full rounded-[28px] border-4 border-white p-6 pt-8 shadow-[0_18px_36px_-24px_rgba(36,68,32,.5)]" style={{ backgroundColor: tile.bg }}>
                    {(first || last) && (
                      <span className="absolute -top-4 right-5 flex items-center gap-1.5 rounded-full bg-little-green-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.18em] text-white">
                        {first ? <><Flag className="h-3 w-3" /> Start</> : <><Trophy className="h-3 w-3 text-little-yellow-400" /> Finish</>}
                      </span>
                    )}
                    {/* Game token */}
                    <span className="absolute -left-4 -top-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white font-display text-xl font-bold text-white shadow-md" style={{ backgroundColor: tile.token }}>{index + 1}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm" style={{ color: tile.token }}><Icon className="h-6 w-6" /></span>
                    <h3 className="mt-4 font-display text-xl font-bold text-little-green-950">{title}</h3>
                    <p className="mt-2 leading-7 text-little-green-950/70">{copy}</p>
                  </div>
                  {/* Path arrows: always down on phones; snake direction on large screens */}
                  {!last && (
                    <span aria-hidden className="absolute -bottom-10 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white text-little-green-800 shadow lg:hidden">
                      <ArrowDown className="h-4 w-4" />
                    </span>
                  )}
                  {tile.arrow !== "none" && (
                    <span
                      aria-hidden
                      className={`absolute hidden h-9 w-9 items-center justify-center rounded-full bg-white text-little-green-800 shadow lg:flex ${
                        tile.arrow === "right" ? "-right-12 top-1/2 -translate-y-1/2" : tile.arrow === "left" ? "-left-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2"
                      }`}
                    >
                      {tile.arrow === "right" ? <ArrowRight className="h-4 w-4" /> : tile.arrow === "left" ? <ArrowLeft className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ======================================================
          ENQUIRE — backpack tag + form
      ====================================================== */}
      <section id="enquire" className="section-mint scroll-mt-28 py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Enquire now</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-little-green-950 sm:text-4xl">Tell us about your <span className="text-little-pink-600">little learner.</span></h2>
            <p className="mt-5 text-lg leading-8 text-little-neutral-600">Submit the form and our admissions team will contact you to discuss availability and the best next step.</p>
            {/* Luggage-tag style note hanging from a backpack */}
            <div className="relative mt-8 flex items-start gap-4">
              <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-[18px] rounded-t-[26px] bg-little-coral-600 text-white shadow-md"><Backpack className="h-7 w-7" /></span>
              <div className="relative -rotate-1 rounded-2xl rounded-tl-sm bg-little-yellow-100 p-5 text-sm leading-6 text-little-green-950/80 shadow-md">
                <span aria-hidden className="absolute -left-3 top-3 h-5 w-5 rounded-full border-4 border-little-yellow-100 bg-little-green-100" />
                <strong className="text-little-green-950">Please note:</strong> an enquiry does not guarantee admission. Placement is subject to age eligibility, document verification and seat availability.
              </div>
            </div>
          </div>
          <ContactForm mode="admission" phone={details.phone} />
        </div>
      </section>

      {/* ======================================================
          FAQs — flashcard slider
      ====================================================== */}
      <section className="py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Admission questions"
            heading={
              <>
                <span className="eyebrow">Admission FAQs</span>
                <h2 className="mt-4 font-display text-3xl font-bold text-little-green-950 sm:text-4xl">Questions <span className="text-little-pink-600">parents ask.</span></h2>
                <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 font-bold text-little-green-800 hover:underline">See all FAQs <ArrowRight className="h-4 w-4" /></Link>
              </>
            }
          >
            {ADMISSION_FAQS.map((faq, i) => (
              <article key={faq.q} className="flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_18px_36px_-24px_rgba(36,68,32,.45)] ring-1 ring-little-green-950/5">
                <div className="relative px-6 pb-5 pt-6" style={{ backgroundColor: TILES[i % TILES.length].bg }}>
                  <span className="absolute right-4 top-3 font-display text-5xl font-bold leading-none text-little-green-950/10">Q</span>
                  <h3 className="relative pr-8 font-display text-lg font-bold leading-snug text-little-green-950">{faq.q}</h3>
                </div>
                <p className="flex-1 border-t-2 border-dashed border-little-green-950/10 px-6 py-5 leading-7 text-little-neutral-600">{faq.a}</p>
              </article>
            ))}
          </CardSlider>
        </div>
      </section>
    </PublicShell>
  );
}
