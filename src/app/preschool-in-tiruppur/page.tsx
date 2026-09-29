import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, CheckCircle2, Heart, MapPin, Navigation, Phone, ShieldCheck, Shapes, Users } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ADMISSION_FAQS, CAMPUS_FAQS } from "@/lib/faqs";
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

const FAQS = [ADMISSION_FAQS[0], CAMPUS_FAQS[0], ADMISSION_FAQS[1], CAMPUS_FAQS[1], ADMISSION_FAQS[4]];

export default function LocalLandingPage() {
  return (
    <PublicShell>
      <JsonLd data={faqSchema(FAQS)} />
      <PageHero eyebrow="Preschool in Tiruppur" title="A happy first school for Tiruppur's little learners." description={`Little Mahilam is a child-centric preschool and early primary school on Kangayam Road, Tiruppur — welcoming families from ${site.areasServed.slice(1, 4).join(", ")} and across the city.`} crumbs={[{ name: "Preschool in Tiruppur", path: "/preschool-in-tiruppur" }]}>
        <Link href="/admissions" className="btn-accent">Enquire for admission <ArrowRight className="h-4 w-4" /></Link>
        <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft"><Navigation className="h-4 w-4" />Directions</a>
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Why families choose us</span>
            <h2 className="section-title mt-4 text-emerald-950">More than a play school.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Choosing a preschool in Tiruppur is one of the first big decisions for your child. At Little Mahilam — our <strong className="text-emerald-900">School of Happiness</strong> — children build confidence, curiosity and strong foundations in language and numbers, in a place where they genuinely love to be.
            </p>
            <p className="mt-4 leading-8 text-slate-600">We offer Play Group (2–3 years), Pre-KG (3–4 years), LKG (4–5 years), UKG (5–6 years) and Grades 1 to 3, so your child can grow with teachers and friends they already know.</p>
          </div>
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px] overflow-hidden rounded-[48px_110px_48px_110px] border-8 border-white/80 shadow-2xl shadow-emerald-950/15">
            <Image src="/imgs/home/kid1.jpg" alt="Children learning at Little Mahilam, a preschool on Kangayam Road, Tiruppur" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <div className="max-w-2xl"><span className="eyebrow">What makes us different</span><h2 className="section-title mt-4 text-emerald-950">Six reasons parents pick Little Mahilam.</h2></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="glass-card reveal p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${["#3f7a63", "#e58d73", "#d6a62d"][index % 3]}1f`, color: ["#3f7a63", "#e58d73", "#d6a62d"][index % 3] }}><Icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-bold text-emerald-950">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-pad grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="glass-card p-7 md:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e58d73]/15 text-[#e2735b]"><MapPin className="h-6 w-6" /></span>
            <h2 className="mt-5 text-2xl font-bold text-emerald-950 md:text-3xl">Easy to reach from across Tiruppur</h2>
            <address className="mt-3 not-italic leading-8 text-slate-600">{site.fullAddress}</address>
            <ul className="mt-5 flex flex-wrap gap-2">{site.areasServed.map((area) => <li key={area} className="glass-chip rounded-full px-3 py-1.5 text-sm font-bold text-emerald-900">{area}</li>)}</ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><Navigation className="h-4 w-4" />Open in Google Maps</a>
              {site.phone && <a href={telHref(site.phone)} className="btn-soft"><Phone className="h-4 w-4" />{site.phone}</a>}
            </div>
          </div>
          <div className="glass-card px-6 py-2">
            <h2 className="pt-5 text-2xl font-bold text-emerald-950">Quick answers</h2>
            <div className="divide-y divide-emerald-950/10">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-emerald-950">{faq.q}<span className="text-xl text-emerald-700 transition group-open:rotate-45">+</span></summary>
                  <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta title="Visit the School of Happiness this week." />
    </PublicShell>
  );
}
