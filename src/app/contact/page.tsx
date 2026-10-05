import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock3, ExternalLink, Facebook, Instagram, Mail, MailOpen, MapPin, Navigation, Phone, Share2, ShieldCheck, Smile, Sparkles, Youtube } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { ContactForm } from "@/components/public/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site, telHref, resolvePublicSite } from "@/lib/site";
import { getPublic } from "@/lib/server-api";
import { WhatsappIcon } from "@/components/public/WhatsappIcon";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us & Book a Campus Visit",
  description: `Visit or call Little Mahilam Preschool on Kangayam Road, Tiruppur. Get directions, contact our admissions team and book a campus tour. ${site.fullAddress}.`,
  path: "/contact",
  keywords: ["preschool near me Tiruppur", "Little Mahilam address", "Little Mahilam phone number", "preschool Valliammai Nagar"],
});

const STEPS = [
  ["01", "Meet our educators", "Ask questions and understand our approach.", "#f7c85b"],
  ["02", "Explore the campus", "See the spaces where children learn and play.", "#a7d9c1"],
  ["03", "Find the right program", "Discuss the best next step for your child.", "#ef9e8a"],
] as const;

export default async function ContactPage() {
  const settings = await getPublic<Record<string, unknown>>("/settings", 0);
  const details = resolvePublicSite(settings);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${details.name}, ${details.fullAddress}`)}&output=embed`;
  const socialIcons = { facebook: Facebook, instagram: Instagram, whatsapp: WhatsappIcon, youtube: Youtube };
  const socialProfiles = Object.entries(details.social)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, url]) => ({
      key,
      url,
      label: key.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      icon: socialIcons[key.toLowerCase() as keyof typeof socialIcons] || Share2,
    }));
  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />

      {/* ======================================================
          HERO — postcard
      ====================================================== */}
      <section className="mesh-hero grain relative overflow-hidden py-16 md:py-24">
        <div className="container-pad relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <span className="eyebrow"><Sparkles className="h-3.5 w-3.5 text-[#d6a62d]" /> Come say hello</span>
            <h1 className="mt-5 max-w-3xl animate-fade-up font-display text-5xl font-bold leading-[.98] tracking-tight text-emerald-950 md:text-7xl">
              Let&apos;s begin a <span className="text-[#e2735b]">happy</span> conversation.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Questions about admissions, programs or your child&apos;s first day? Our team in Tiruppur is here to help — and we&apos;d love to welcome your family to our campus.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#visit-form" className="btn-accent">Book a school visit <ArrowRight className="h-4 w-4" /></a>
              <a href={details.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft">Get directions <Navigation className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Postcard */}
          <div className="relative mx-auto w-full max-w-xl rotate-2 bg-[#fffdf6] p-6 shadow-[0_30px_60px_-30px_rgba(23,60,47,.55)] sm:p-8">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="font-display text-2xl font-bold text-[#e2725b]">Dear families,</p>
                <p className="mt-3 font-display text-base leading-7 text-emerald-900/80">We&apos;d love to show you around our School of Happiness. Come meet our teachers and see little learners at play!</p>
                <p className="mt-4 font-display text-base font-bold text-emerald-900">— Little Mahilam</p>
              </div>
              <span aria-hidden className="hidden w-px bg-emerald-950/15 sm:block" />
              <div className="relative">
                {/* Stamp + postmark */}
                <div className="flex items-start justify-end gap-2">
                  <span aria-hidden className="mt-3 flex h-14 w-14 -rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[#e2725b]/60 text-center text-[8px] font-extrabold uppercase leading-3 text-[#e2725b]/80">Tiruppur<br />★<br />641604</span>
                  <span className="flex h-20 w-16 flex-col items-center justify-center bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950" style={{ outline: "3px dashed #fffdf6", outlineOffset: "-5px" }}>
                    <Smile className="h-7 w-7" strokeWidth={2.5} />
                  </span>
                </div>
                <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[.2em] text-emerald-700">{details.name}</p>
                <address className="mt-2 not-italic">
                  {details.fullAddress.split(", ").map((line) => (
                    <span key={line} className="block border-b border-emerald-950/15 py-1 font-display text-sm font-bold text-emerald-950">{line}</span>
                  ))}
                </address>
              </div>
            </div>
            <div className="mt-6 grid gap-3 border-t-2 border-dashed border-emerald-950/10 pt-5 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><ShieldCheck className="h-5 w-5 text-emerald-700" /> Safe, caring campus</div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Clock3 className="h-5 w-5 text-[#df826d]" /> {details.openingHours?.join(" · ") || "Visits by appointment"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT — luggage tags
      ====================================================== */}
      <section className="py-14">
        <div className="container-pad grid gap-8 pt-6 md:grid-cols-3">
          <ContactTag icon={Phone} tint="#3f7a63" label="Call us" value={details.phone || "Call details coming soon"} href={details.phone ? telHref(details.phone) : undefined} action="Speak with our team" rotate="-2deg" />
          <ContactTag icon={Mail} tint="#e58d73" label="Email us" value={details.email || "Email details coming soon"} href={details.email ? `mailto:${details.email}` : undefined} action="Send us a message" rotate="1.5deg" />
          <ContactTag icon={MapPin} tint="#d6a62d" label="Visit us" value={details.fullAddress} href={details.mapUrl} action="Open in Google Maps" external rotate="-1deg" />
        </div>
      </section>

      {socialProfiles.length > 0 && (
        <section className="pb-16">
          <div className="container-pad">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div><span className="eyebrow"><Share2 className="h-4 w-4" /> Connect with us</span><h2 className="mt-3 font-display text-3xl font-bold text-emerald-950">Our social profiles</h2></div>
              <p className="hidden max-w-md text-right text-sm leading-6 text-slate-500 md:block">Follow Little Mahilam for school updates, celebrations and happy classroom moments.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialProfiles.map(({ key, label, url, icon: Icon }, index) => {
                const colors = ["#ef9e8a", "#8cb9e8", "#a7d9c1", "#f7c85b"];
                const tint = colors[index % colors.length];
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[26px] bg-white p-5 shadow-[0_16px_36px_-26px_rgba(23,60,47,.5)] ring-1 ring-emerald-950/5 transition hover:-translate-y-1 hover:shadow-lg">
                    <span aria-hidden className="absolute -right-7 -top-7 h-24 w-24 rounded-full opacity-20" style={{ backgroundColor: tint }} />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-emerald-950" style={{ backgroundColor: tint }}><Icon className="h-6 w-6" /></span>
                    <h3 className="relative mt-4 font-display text-xl font-bold text-emerald-950">{label}</h3>
                    <span className="relative mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-500 transition group-hover:text-emerald-800">View profile <ExternalLink className="h-3.5 w-3.5" /></span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          MAP — folded paper map
      ====================================================== */}
      <section className="section-tint py-16 md:py-20">
        <div className="container-pad">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow"><MapPin className="h-3.5 w-3.5 text-[#e2725b]" /> Find us</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Right here in <span className="text-[#e2725b]">Tiruppur.</span></h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">We&apos;re in Amarjothi AS Nagar, off Kangayam Road in Valliammai Nagar. If this is your first visit, booking ahead helps us give your family the time and attention you deserve.</p>
          </div>
          <div className="relative bg-white p-3 shadow-[0_30px_60px_-34px_rgba(23,60,47,.55)]">
            <iframe title={`Map showing ${details.name}`} src={mapEmbedUrl} className="h-[380px] w-full border-0 md:h-[480px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            {/* Paper folds */}
            <div aria-hidden className="pointer-events-none absolute inset-3 bg-[linear-gradient(90deg,transparent_32.9%,rgba(0,0,0,.07)_33.3%,transparent_34%,transparent_66.3%,rgba(0,0,0,.07)_66.6%,transparent_67.4%)]" />
            <span className="absolute -top-4 left-8 flex -rotate-3 items-center gap-2 rounded-full bg-[#e2725b] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-md"><MapPin className="h-4 w-4" /> Little Mahilam</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          VISIT FORM — stamps + mailbox
      ====================================================== */}
      <section id="visit-form" className="section-mint scroll-mt-28 py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow"><MailOpen className="h-3.5 w-3.5" /> Campus visit</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Come see happiness <span className="text-[#e2725b]">in action.</span></h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">Tell us a little about your family. The school team will contact you to confirm a convenient visit time.</p>
            <ol className="mt-8 grid gap-5">
              {STEPS.map(([number, title, copy, tint], i) => (
                <li key={number} className="flex items-center gap-4">
                  {/* Postage-stamp number */}
                  <span className="flex h-16 w-14 shrink-0 items-center justify-center font-display text-xl font-bold text-emerald-950 shadow-sm" style={{ backgroundColor: tint, outline: "3px dashed #fff", outlineOffset: "-6px", rotate: i % 2 ? "4deg" : "-4deg" }}>{number}</span>
                  <div><h3 className="font-display text-lg font-bold text-emerald-950">{title}</h3><p className="mt-0.5 text-sm leading-6 text-slate-600">{copy}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <ContactForm phone={details.phone} />
        </div>
      </section>

      {/* ======================================================
          NEXT STEP — mailbox
      ====================================================== */}
      <section className="py-16 md:py-20">
        <div className="container-pad">
          <div className="relative mx-auto grid max-w-4xl items-center gap-8 rounded-[36px] bg-white p-8 shadow-[0_24px_50px_-30px_rgba(23,60,47,.45)] md:grid-cols-[auto_1fr] md:p-10">
            {/* Mailbox illustration */}
            <div aria-hidden className="relative mx-auto h-36 w-28">
              <span className="absolute inset-x-0 top-0 h-24 rounded-t-full bg-[#e2725b] shadow-md" />
              <span className="absolute left-1/2 top-10 h-2.5 w-14 -translate-x-1/2 rounded-full bg-emerald-950/70" />
              <span className="absolute -right-2 top-4 h-10 w-2 rounded bg-emerald-900" />
              <span className="absolute -right-2 top-4 h-4 w-6 rounded-sm bg-[#f7c85b]" />
              <span className="absolute bottom-0 left-1/2 h-12 w-4 -translate-x-1/2 bg-[#9c6d3f]" />
            </div>
            <div className="text-center md:text-left">
              <span className="eyebrow">Admissions</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-emerald-950 md:text-4xl">Ready to take the next step?</h2>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">Explore our admission process, programs and everything your little learner needs for a joyful start.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link href="/admissions" className="btn-primary">Start an admission enquiry <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/faq" className="btn-soft">Read the FAQs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

/** Luggage-tag contact card hanging from a string. */
function ContactTag({ icon: Icon, tint, label, value, href, action, external = false, rotate }: { icon: LucideIcon; tint: string; label: string; value: string; href?: string; action: string; external?: boolean; rotate: string }) {
  const content = (
    <>
      <span aria-hidden className="absolute left-1/2 top-4 h-5 w-5 -translate-x-1/2 rounded-full border-4 bg-[#fffaf0]" style={{ borderColor: `${tint}55` }} />
      <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl text-white transition group-hover:-rotate-6" style={{ backgroundColor: tint }}><Icon className="h-6 w-6" /></span>
      <div className="mt-4 text-xs font-extrabold uppercase tracking-[.16em] text-slate-400">{label}</div>
      <div className="mt-1.5 break-words font-display text-xl font-bold text-emerald-950">{value}</div>
      {href && <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: tint }}>{action} {external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}</div>}
    </>
  );
  const className = "group relative flex flex-col items-center bg-white px-6 pb-7 text-center shadow-[0_18px_36px_-22px_rgba(23,60,47,.45)] transition-transform hover:-translate-y-1";
  const style = { rotate, clipPath: "polygon(22% 0, 78% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)", borderBottom: `6px solid ${tint}` };
  return (
    <div className="relative flex flex-col items-center">
      {/* String */}
      <svg aria-hidden viewBox="0 0 40 40" className="-mb-4 h-10 w-10 text-emerald-900/40"><path d="M20 0 C 10 12, 30 22, 20 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      {href
        ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`${className} w-full`} style={style}>{content}</a>
        : <div className={`${className} w-full`} style={style}>{content}</div>}
    </div>
  );
}
