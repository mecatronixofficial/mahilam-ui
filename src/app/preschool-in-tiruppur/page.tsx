import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, CheckCircle2, Clock3, Heart, MapPin, MessageCircleQuestion, Navigation, Phone, ShieldCheck, Shapes, Signpost, Sparkles, Users } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageBanner } from "@/components/public/PageBanner";
import { CardSlider } from "@/components/public/CardSlider";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ADMISSION_FAQS, CAMPUS_FAQS } from "@/lib/faqs";
import { localImage } from "@/lib/images";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Preschool & Play School in Tiruppur — Kangayam Road",
  description: "Looking for the best preschool in Tiruppur? Little Mahilam on Kangayam Road offers Play Group, Pre-KG, LKG, UKG and Grades 1–3 with child-centric, play-way learning. Visit us today.",
  path: "/preschool-in-tiruppur",
  keywords: ["preschool in Tiruppur", "play school in Tiruppur", "kindergarten Kangayam Road", "nursery school Valliammai Nagar", "best preschool near me Tiruppur"],
});

const REASONS = [
  { icon: Heart, title: "Child-centric care", copy: "Every child learns at their own pace with warm, attentive teachers who know them by name." },
  { icon: Shapes, title: "Play-way learning", copy: "Stories, songs, art, movement and hands-on activities turn early concepts into joyful discoveries." },
  { icon: Brain, title: "Multiple intelligence", copy: "Language, logic, music, movement, nature and creativity are all valued ways to be smart." },
  { icon: ShieldCheck, title: "Safe, happy campus", copy: "Bright, child-friendly spaces designed for safe exploration and growing independence." },
  { icon: Users, title: "Parent partnership", copy: "Regular communication, events and meetings keep families part of the journey." },
  { icon: CheckCircle2, title: "Play Group to Grade 3", copy: "One familiar school from a child's first classroom through the early primary years." },
];

const SIGN_COLORS = ["#3f7a63", "#e2725b", "#d69e2e", "#4a7fc1", "#8b6fd6", "#2f9e8f"];
const LOCAL_FAQS = [
  { q: "What age group of children are admitted to a playgroup?", a: "Children in a playgroup are usually between two and three years old." },
  { q: "Are preschool and playgroup the same?", a: "No. Preschool offers a more structured early-education programme, while playgroup provides a gentle, informal setting where younger children learn through play and social interaction." },
  { q: "Do playgroups support learning as well as fun activities?", a: "Yes. Playgroups help children build early language, communication and social skills through stories, conversation, music, movement and engaging games." },
  { q: "How can I locate Little Mahilam Preschool in Kangayam Nagar?", a: `Little Mahilam Preschool is located at ${site.fullAddress}. Use the directions link below for an easy route to the campus.` },
  { q: "Does Little Mahilam Preschool have toys and play equipment for children?", a: "Yes. Our child-friendly spaces include age-appropriate toys, learning materials and play equipment chosen to encourage safe exploration, creativity and shared play." },
  { q: "When does Little Mahilam Preschool open and close?", a: "The school is open Monday to Friday from 9:30 am to 5:00 pm and Saturday from 9:30 am to 2:00 pm. The school is closed on Sunday." },
];

const FAQS = [ADMISSION_FAQS[0], CAMPUS_FAQS[0], ADMISSION_FAQS[1], CAMPUS_FAQS[1], ADMISSION_FAQS[4]];

/** A soft street-map texture for the location card. */
const MAP_BG = "bg-[#eef3e6] [background-image:linear-gradient(90deg,transparent_46%,#fff_46%,#fff_54%,transparent_54%),linear-gradient(0deg,transparent_46%,#fff_46%,#fff_54%,transparent_54%),linear-gradient(35deg,transparent_48%,rgba(255,255,255,.8)_48%,rgba(255,255,255,.8)_52%,transparent_52%)] [background-size:140px_140px,140px_140px,260px_260px]";

export default function LocalLandingPage() {
  return (
    <PublicShell>
      <JsonLd data={faqSchema(LOCAL_FAQS)} />
      <PageBanner
        theme="local"
        eyebrow="Preschool in Tiruppur"
        icon={MapPin}
        title="A happy first school for Tiruppur's"
        highlight="little learners."
        description={`Little Mahilam is a child-centric preschool and early primary school on Kangayam Road, Tiruppur — welcoming families from ${site.areasServed.slice(1, 4).join(", ")} and across the city.`}
        crumbs={[{ name: "Preschool in Tiruppur", path: "/preschool-in-tiruppur" }]}
        image={{ src: localImage("/images/banners/local.webp", 0), alt: "Little Mahilam Preschool on Kangayam Road, Tiruppur" }}
      />

      <div className="container-pad relative z-10 -mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/admissions" className="btn-accent shadow-lg">Enquire for admission <ArrowRight className="h-4 w-4" /></Link>
        <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft shadow-lg"><Navigation className="h-4 w-4" />Directions</a>
      </div>

      {/* ======================================================
          WHY — photo inside a map pin
      ====================================================== */}
      <section className="py-16 md:py-24">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="eyebrow"><Heart className="h-4 w-4 text-[#e2725b]" /> Why families choose us</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">More than a <span className="text-[#e2725b]">play school.</span></h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Choosing a preschool in Tiruppur is one of the first big decisions for your child. At Little Mahilam — our <strong className="text-emerald-900">School of Happiness</strong> — children build confidence, curiosity and strong foundations in language and numbers, in a place where they genuinely love to be.
            </p>
            <p className="mt-4 leading-8 text-slate-600">We offer Play Group (2–3 years), Pre-KG (3–4 years), LKG (4–5 years), UKG (5–6 years) and Grades 1 to 3, so your child can grow with teachers and friends they already know.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.programs.map((program, i) => (
                <li key={program.name} className="rounded-full px-4 py-2 text-sm font-extrabold text-white shadow-sm" style={{ backgroundColor: SIGN_COLORS[i % SIGN_COLORS.length] }}>{program.name} · {program.age}</li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[380px]">
            {/* Map pin with photo */}
            <div className="relative mx-auto aspect-[4/5] w-full drop-shadow-[0_30px_30px_rgba(226,114,91,.35)]">
              <div className="absolute inset-0 bg-[#e2725b]" style={{ borderRadius: "50% 50% 50% 0", rotate: "-45deg", scale: ".82", translate: "0 -6%" }} />
              <div className="absolute left-1/2 top-[6%] aspect-square w-[74%] -translate-x-1/2 overflow-hidden rounded-full border-8 border-white">
                <Image src={localImage("/images/local/campus.webp", 0)} alt="Children learning at Little Mahilam, a preschool on Kangayam Road, Tiruppur" fill sizes="300px" className="object-cover" />
              </div>
            </div>
            <span className="mx-auto -mt-2 block h-4 w-28 rounded-[50%] bg-emerald-950/15 blur-[2px]" />
            <span className="absolute -right-2 top-4 flex rotate-6 items-center gap-1.5 rounded-2xl bg-white px-4 py-2 font-display text-sm font-bold text-emerald-950 shadow-lg"><MapPin className="h-4 w-4 text-[#e2725b]" /> You are here!</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          REASONS — signpost card slider
      ====================================================== */}
      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Reasons parents choose us"
            heading={
              <>
                <span className="eyebrow"><Signpost className="h-4 w-4" /> What makes us different</span>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Six reasons parents pick <span className="text-[#e2725b]">Little Mahilam.</span></h2>
              </>
            }
          >
            {REASONS.map(({ icon: Icon, title, copy }, index) => {
              const color = SIGN_COLORS[index % SIGN_COLORS.length];
              return (
                <article key={title} className="flex h-full flex-col items-center">
                  {/* Arrow-shaped sign board */}
                  <div className="w-full px-6 py-5 text-white shadow-[0_14px_26px_-16px_rgba(0,0,0,.5)]" style={{ backgroundColor: color, clipPath: index % 2 ? "polygon(8% 0, 100% 0, 100% 100%, 8% 100%, 0 50%)" : "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" }}>
                    <div className={`flex items-center gap-3 ${index % 2 ? "pl-4" : ""}`}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20"><Icon className="h-5 w-5" /></span>
                      <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
                    </div>
                  </div>
                  <span aria-hidden className="h-6 w-3 bg-[#9c6d3f]" />
                  <p className="w-full flex-1 rounded-[22px] bg-white p-5 text-center leading-7 text-slate-600 shadow-sm">{copy}</p>
                </article>
              );
            })}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          LOCATION — street-map card + quick answers
      ====================================================== */}
      <section className="py-16 md:py-20">
        <div className="container-pad grid gap-8 lg:grid-cols-2">
          <div className={`relative overflow-hidden rounded-[32px] p-2 shadow-[0_24px_50px_-30px_rgba(23,60,47,.5)] ${MAP_BG}`}>
            <div className="relative flex h-full flex-col rounded-[26px] bg-white/85 p-7 backdrop-blur-sm md:p-9">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e2725b] text-white shadow-md"><MapPin className="h-7 w-7" /></span>
              <h2 className="mt-5 font-display text-2xl font-bold text-emerald-950 md:text-3xl">Easy to reach from across Tiruppur</h2>
              <address className="mt-3 not-italic leading-8 text-slate-600">{site.fullAddress}</address>
              {/* Route through the neighbourhoods */}
              <ol className="mt-6 grid gap-0">
                {site.areasServed.map((area, i) => (
                  <li key={area} className="flex gap-3">
                    <span className="flex flex-col items-center">
                      <span className="h-4 w-4 shrink-0 rounded-full border-4 border-white shadow" style={{ backgroundColor: SIGN_COLORS[i % SIGN_COLORS.length] }} />
                      {i < site.areasServed.length - 1 && <span className="h-5 border-l-2 border-dashed border-emerald-900/25" />}
                    </span>
                    <span className="text-sm font-bold leading-4 text-emerald-900">{area}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><Navigation className="h-4 w-4" />Open in Google Maps</a>
                {site.phone && <a href={telHref(site.phone)} className="btn-soft"><Phone className="h-4 w-4" />{site.phone}</a>}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#fde9b8] p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-emerald-950">Quick answers</h2>
            <div className="mt-4 grid gap-3">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-emerald-950">{faq.q}<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fde9b8] text-emerald-800 transition group-open:rotate-45">+</span></summary>
                  <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          ABOUT — local business overview and services
      ====================================================== */}
      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_-38px_rgba(23,60,47,.55)] ring-1 ring-emerald-950/5">
            <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_260px] lg:p-12">
              <div>
                <span className="eyebrow"><Sparkles className="h-4 w-4 text-[#e2725b]" /> About Little Mahilam</span>
                <h2 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Little Mahilam Preschool in <span className="text-[#e2725b]">Kangayam Nagar, Tiruppur</span></h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">Little Mahilam Preschool is one of Tiruppur&apos;s trusted early-learning destinations, welcoming children for Play Group, Pre-KG, LKG, UKG and the early primary grades. Families choose us for child-centred learning, caring teachers and a safe environment where children can learn, play and grow with confidence.</p>

                <h3 className="mt-8 font-display text-2xl font-bold text-emerald-950">Location and overview</h3>
                <p className="mt-3 leading-8 text-slate-600">Established in 1993, Little Mahilam Preschool has built a lasting place in the Tiruppur community. Our team is dedicated to helping every child discover their strengths through purposeful play, warm relationships and age-appropriate learning experiences. Conveniently located near Kangayam Road at Amarjothi AS Nagar, the campus is easy to reach from surrounding neighbourhoods across Tiruppur.</p>

                <h3 className="mt-8 font-display text-2xl font-bold text-emerald-950">Programmes and services offered</h3>
                <p className="mt-3 leading-8 text-slate-600">We offer early-years and primary programmes designed around the changing needs of growing children. Our staff are approachable and happy to answer questions about admissions, class placement, campus visits and your child&apos;s day at school.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Play Group", "Pre-KG", "LKG", "UKG", "Grades 1–3", "Activity-based learning"].map((item, index) => (
                    <span key={item} className="rounded-full px-4 py-2 text-sm font-extrabold text-white" style={{ backgroundColor: SIGN_COLORS[index % SIGN_COLORS.length] }}>{item}</span>
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-[26px] bg-[#fff4d6] p-6">
                <Clock3 className="h-8 w-8 text-[#e2725b]" />
                <h3 className="mt-4 font-display text-xl font-bold text-emerald-950">School hours</h3>
                <dl className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <div><dt className="font-extrabold text-emerald-900">Monday–Friday</dt><dd>9:30 am–5:00 pm</dd></div>
                  <div><dt className="font-extrabold text-emerald-900">Saturday</dt><dd>9:30 am–2:00 pm</dd></div>
                  <div><dt className="font-extrabold text-emerald-900">Sunday</dt><dd>Closed</dd></div>
                </dl>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-extrabold text-emerald-900">Contact the school <ArrowRight className="h-4 w-4" /></Link>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently asked questions from the local listing */}
      <section className="py-16 md:py-20">
        <div className="container-pad mx-auto max-w-5xl">
          <span className="eyebrow"><MessageCircleQuestion className="h-4 w-4" /> Helpful information</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Frequently asked <span className="text-[#e2725b]">questions.</span></h2>
          <div className="mt-8 grid gap-4">
            {LOCAL_FAQS.map((faq, index) => (
              <details key={faq.q} className="group rounded-[24px] bg-white px-6 py-5 shadow-[0_12px_30px_-24px_rgba(23,60,47,.55)] ring-1 ring-emerald-950/5" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-lg font-bold text-emerald-950">
                  <span><span className="mr-2 text-[#e2725b]">{index + 1}.</span>{faq.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fde9b8] text-emerald-900 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 border-t border-emerald-950/5 pt-3 leading-7 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AdmissionsCta title="Visit the School of Happiness this week." />
    </PublicShell>
  );
}
