import type { Metadata } from "next";
import { MailOpen } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { ContactForm } from "@/components/public/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site, telHref, resolvePublicSite } from "@/lib/site";
import { getPublic } from "@/lib/server-api";
import { localImage } from "@/lib/images";

import { Appear } from "@/components/about/motion";
import { Butterfly, SECTION_BG, StarDoodle } from "@/components/about/Doodles";
import { ContactHero } from "@/components/contact/ContactHero";
import { HeartNote, MapStoryBook, ReachPath, SocialPlayground, VISIT_STEP_COLORS, type ReachStop, type Social } from "@/components/contact/ContactParts";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us & Book a Campus Visit",
  description: `Visit or call Little Mahilam Preschool on Kangayam Road, Tiruppur. Get directions, contact our admissions team and book a campus tour. ${site.fullAddress}.`,
  path: "/contact",
  keywords: ["preschool near me Tiruppur", "Little Mahilam address", "Little Mahilam phone number", "preschool Valliammai Nagar"],
});

const STEPS = [
  ["01", "Meet our educators", "Ask questions and understand our approach."],
  ["02", "Explore the campus", "See the spaces where children learn and play."],
  ["03", "Find the right program", "Discuss the best next step for your child."],
] as const;

/**
 * Contact in the About page's "Learning World" style:
 * Hero → Reach-us adventure path → Social playground → Map storybook → Visit form.
 */
export default async function ContactPage() {
  const settings = await getPublic<Record<string, unknown>>("/settings", 0);
  const details = resolvePublicSite(settings);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${details.name}, ${details.fullAddress}`)}&output=embed`;
  const socials: Social[] = Object.entries(details.social)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, url]) => ({ key, url, label: key.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) }));

  const stops: ReachStop[] = [
    { kind: "call", label: "Call us", value: details.phone || "Call details coming soon", href: details.phone ? telHref(details.phone) : undefined, action: "Speak with our team" },
    { kind: "email", label: "Email us", value: details.email || "Email details coming soon", href: details.email ? `mailto:${details.email}` : undefined, action: "Send us a message" },
    { kind: "visit", label: "Visit us", value: details.fullAddress, href: details.mapUrl, action: "Open in Google Maps", external: true },
  ];

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
        <ContactHero
          image={localImage("/images/contact/campus.webp", 0)}
          secondImage={localImage("/images/contact/kids-welcome.webp", 1)}
          mapUrl={details.mapUrl}
        />
        <ReachPath stops={stops} />
        <SocialPlayground profiles={socials} />
        <MapStoryBook
          name={details.name}
          address={details.fullAddress}
          hours={details.openingHours?.join(" · ") || "Visits by appointment"}
          mapUrl={details.mapUrl}
          mapEmbedUrl={mapEmbedUrl}
        />

        {/* ======================================================
            VISIT FORM — steps as numbered stops + the form card
        ====================================================== */}
        <section id="visit-form" className="relative scroll-mt-28 overflow-hidden pb-14 pt-6 md:pt-8" style={{ background: SECTION_BG.butter }}>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Butterfly className="absolute left-[4%] top-12 w-11 animate-float" />
            <Butterfly color="#f9bbd9" className="absolute right-[5%] top-24 hidden w-10 animate-float [animation-delay:-2s] lg:block" />
            <StarDoodle className="absolute bottom-24 left-[10%] w-5 animate-twinkle" />
          </div>
          <div className="container-pad relative grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <Appear>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800 shadow-[0_8px_20px_-12px_rgba(36,68,32,.45)]"><MailOpen className="h-4 w-4" /> Campus visit</span>
                <h2 className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] text-little-green-950">Come see happiness <span className="text-little-pink-500">in action.</span></h2>
                <p className="mt-4 max-w-lg text-[17px] leading-8 text-little-neutral-600">Tell us a little about your family. The school team will contact you to confirm a convenient visit time.</p>
              </Appear>
              <ol className="relative mt-8 grid gap-6">
                <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-1 rounded-full" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(36,68,32,.3) 0 4px, transparent 4px 12px)" }} />
                {STEPS.map(([number, title, copy], i) => (
                  <li key={number}>
                    <Appear delay={0.1 + i * 0.12} className="group relative flex items-center gap-4">
                      <span
                        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-[5px] border-white font-display text-lg font-bold text-little-green-950 shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                        style={{ backgroundColor: VISIT_STEP_COLORS[i] }}
                      >
                        {number}
                      </span>
                      <div><h3 className="font-display text-lg font-bold text-little-green-950">{title}</h3><p className="mt-0.5 text-sm leading-6 text-little-neutral-600">{copy}</p></div>
                    </Appear>
                  </li>
                ))}
              </ol>
              <Appear delay={0.5} className="mt-8"><HeartNote /></Appear>
            </div>
            <Appear delay={0.1} className="relative">
              <span aria-hidden className="absolute -top-3 left-10 z-10 h-7 w-28 -rotate-6 bg-little-yellow-300/80" />
              <span aria-hidden className="absolute -top-3 right-10 z-10 h-7 w-24 rotate-6 bg-little-pink-200/80" />
              <ContactForm phone={details.phone} />
            </Appear>
          </div>
        </section>
    </PublicShell>
  );
}
