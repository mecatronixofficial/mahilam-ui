import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock3, ExternalLink, Mail, MapPin, Navigation, Phone, ShieldCheck, Smile, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { ContactForm } from "@/components/public/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(`${site.name}, ${site.fullAddress}`)}&output=embed`;

export const metadata: Metadata = pageMetadata({
  title: "Contact Us & Book a Campus Visit",
  description: `Visit or call Little Mahilam Preschool on Kangayam Road, Tiruppur. Get directions, contact our admissions team and book a campus tour. ${site.fullAddress}.`,
  path: "/contact",
  keywords: ["preschool near me Tiruppur", "Little Mahilam address", "Little Mahilam phone number", "preschool Valliammai Nagar"],
});

export default function ContactPage() {
  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <section className="mesh-hero grain relative overflow-hidden py-16 md:py-24">
        <div className="container-pad relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow"><Sparkles className="h-3.5 w-3.5 text-[#d6a62d]" /> Come say hello</span>
            <h1 className="mt-5 max-w-3xl animate-fade-up font-display text-5xl font-bold leading-[.98] tracking-tight text-emerald-950 md:text-7xl">
              Let&apos;s begin a <span className="text-[#e2735b]">happy</span> conversation.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Questions about admissions, programs or your child&apos;s first day? Our team in Tiruppur is here to help — and we&apos;d love to welcome your family to our campus.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#visit-form" className="btn-accent">Book a school visit <ArrowRight className="h-4 w-4" /></a>
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft">Get directions <Navigation className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="glass relative overflow-hidden rounded-[32px] p-7 md:p-9">
            <span className="flex h-14 w-14 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950"><Smile className="h-7 w-7" strokeWidth={2.5} /></span>
            <p className="mt-6 text-xs font-black uppercase tracking-[.18em] text-emerald-700">{site.name}</p>
            <address className="mt-3 max-w-md font-display text-xl font-bold not-italic leading-8 text-emerald-950">{site.fullAddress}</address>
            <div className="mt-6 grid gap-3 border-t border-emerald-950/10 pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><ShieldCheck className="h-5 w-5 text-emerald-700" /> Safe, caring campus</div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Clock3 className="h-5 w-5 text-[#df826d]" /> {site.openingHours?.join(" · ") || "Visits by appointment"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-pad grid gap-4 md:grid-cols-3">
          <ContactCard icon={Phone} tint="#3f7a63" label="Call us" value={site.phone || "Call details coming soon"} href={site.phone ? telHref(site.phone) : undefined} action="Speak with our team" />
          <ContactCard icon={Mail} tint="#e58d73" label="Email us" value={site.email || "Email details coming soon"} href={site.email ? `mailto:${site.email}` : undefined} action="Send us a message" />
          <ContactCard icon={MapPin} tint="#d6a62d" label="Visit us" value="Kangayam Road, Tiruppur" href={site.mapUrl} action="Open in Google Maps" external />
        </div>
      </section>

      <section className="section-tint py-16 md:py-20">
        <div className="container-pad">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Find us</span>
            <h2 className="section-title mt-4 text-emerald-950">Right here in Tiruppur.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">We&apos;re in Amarjothi AS Nagar, off Kangayam Road in Valliammai Nagar. If this is your first visit, booking ahead helps us give your family the time and attention you deserve.</p>
          </div>
          <div className="glass-card overflow-hidden p-2">
            <iframe title={`Map showing ${site.name}`} src={MAP_EMBED_URL} className="h-[380px] w-full rounded-[22px] border-0 md:h-[480px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>

      <section id="visit-form" className="section-mint scroll-mt-28 py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow">Campus visit</span>
            <h2 className="section-title mt-4 text-emerald-950">Come see happiness in action.</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">Tell us a little about your family. The school team will contact you to confirm a convenient visit time.</p>
            <ol className="mt-8 grid gap-4">
              {[
                ["01", "Meet our educators", "Ask questions and understand our approach."],
                ["02", "Explore the campus", "See the spaces where children learn and play."],
                ["03", "Find the right program", "Discuss the best next step for your child."],
              ].map(([number, title, copy]) => (
                <li key={number} className="flex gap-4">
                  <span className="glass-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-sm font-bold text-emerald-800">{number}</span>
                  <div><h3 className="font-bold text-emerald-950">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="py-16 text-center md:py-20">
        <div className="container-pad">
          <span className="eyebrow">Admissions</span>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-emerald-950 md:text-5xl">Ready to take the next step?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Explore our admission process, programs and everything your little learner needs for a joyful start.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/admissions" className="btn-primary">Start an admission enquiry <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/faq" className="btn-soft">Read the FAQs</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function ContactCard({ icon: Icon, tint, label, value, href, action, external = false }: { icon: LucideIcon; tint: string; label: string; value: string; href?: string; action: string; external?: boolean }) {
  const content = (
    <>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: `${tint}1f`, color: tint }}><Icon className="h-6 w-6" /></span>
      <div className="mt-5 text-xs font-black uppercase tracking-[.14em] text-slate-400">{label}</div>
      <div className="mt-2 break-words font-display text-xl font-bold text-emerald-950">{value}</div>
      {href && <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800">{action} {external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}</div>}
    </>
  );
  return href
    ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="glass-card group p-6 transition-transform hover:-translate-y-1">{content}</a>
    : <div className="glass-card p-6">{content}</div>;
}
