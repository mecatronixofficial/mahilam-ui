import Link from "next/link";
import { ExternalLink, Facebook, Heart, Instagram, Mail, MailOpen, MapPin, Phone, Youtube } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";
import { NewsletterForm } from "./NewsletterForm";
import { BrandLogo } from "./BrandLogo";
import type { Branding } from "@/lib/branding";
import { ArrowBubble, Shape, PALETTE } from "./PlayShapes";
import { ShapePile } from "./ShapePile";
import { site, telHref, type PublicSite } from "@/lib/site";

/** Social buttons sit on circles in the logo colours. */
const SOCIAL_COLORS = ["bg-little-blue-400", "bg-little-pink-400", "bg-little-green-400", "bg-little-yellow-400"];

const exploreLinks = [
  ["/", "Home"],
  ["/about", "About"],
  ["/learning-approach", "Learning Approach"],
  ["/programs", "Programs"],
  ["/activities", "Activities"],
  ["/facilities", "Facilities"],
  ["/gallery", "Gallery"],
  ["/events", "Events"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
] as const;

export function Footer({ siteDetails = site, branding }: { siteDetails?: PublicSite; branding?: Branding }) {
  const year = new Date().getFullYear();
  const socialLinks = [
    ["Facebook", siteDetails.social.facebook, Facebook],
    ["Instagram", siteDetails.social.instagram, Instagram],
    ["WhatsApp", siteDetails.social.whatsapp, WhatsappIcon],
    ["YouTube", siteDetails.social.youtube, Youtube],
  ] as const;

  return (
    <footer className="lm-play relative mt-10 px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="relative overflow-hidden rounded-[32px] bg-little-green-900 text-little-cream sm:rounded-[48px]">
        <div className="relative z-10 mx-auto w-full px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          {/* Newsletter card */}
          <section aria-labelledby="newsletter-title" className="relative overflow-hidden rounded-[20px] bg-little-pink-300 p-4 text-little-green-900 sm:rounded-[24px] sm:p-5">
            <Shape name="flower" color={PALETTE.blush} className="pointer-events-none absolute -right-14 -top-16 w-56 rotate-12 sm:w-72" />
            <Shape name="leaf" color={PALETTE.sun} className="pointer-events-none absolute -bottom-10 left-[38%] hidden w-28 -rotate-12 lg:block" />
            <div className="relative grid items-center gap-4 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
              <div className="flex items-start gap-4">
                <span className="relative grid h-12 w-12 shrink-0 place-items-center">
                  <Shape name="pebble" color="#fff" className="absolute inset-0 h-full w-full" />
                  <MailOpen className="relative h-7 w-7" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-sm font-bold text-little-green-900/70">School newsletter</p>
                  <h2 id="newsletter-title" className="mt-1 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">Get happy updates in your inbox</h2>
                  <p className="mt-3 max-w-md leading-7 text-little-green-900/80">Events, holidays, admission dates and little classroom moments — sent straight to you.</p>
                </div>
              </div>
              <NewsletterForm />
            </div>
          </section>

          {/* Main columns */}
          <div className="mt-7 grid gap-7 sm:mt-8 sm:grid-cols-2 lg:grid-cols-[1fr_1.6fr_1.1fr_1fr] lg:gap-6">
            {/* Brand */}
            <div>
              <Link href="/" className="group inline-flex" aria-label="Little Mahilam Pre-school home">
                <BrandLogo branding={branding} className="h-24 w-48 transition-transform duration-300 group-hover:scale-[1.03]" />
              </Link>
              <p className="mt-5 max-w-sm leading-7 text-white/70">Child-centric, play-way learning and multiple intelligence for happy little learners.</p>
              {socialLinks.some(([, url]) => url) && (
                <div className="mt-6 flex items-center gap-2.5">
                  {socialLinks.map(([name, url, Icon], i) =>
                    url ? (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-little-green-950 transition hover:-translate-y-1 hover:scale-105 ${SOCIAL_COLORS[i % SOCIAL_COLORS.length]}`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </a>
                    ) : null,
                  )}
                </div>
              )}
            </div>

            {/* Explore: big bold links */}
            <nav aria-label="Footer">
              <h3 className="text-sm font-bold text-white/55">Explore</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {exploreLinks.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="group relative inline-block text-base font-bold tracking-tight text-white sm:text-lg">
                      {label}
                      <span aria-hidden className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-little-pink-300 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Visit */}
            <div>
              <h3 className="text-sm font-bold text-white/55">Visit us</h3>
              <ul className="mt-4 grid gap-4 text-white/85">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-little-yellow-100" />
                  <span className="leading-6">
                    {siteDetails.fullAddress}
                    <a href={siteDetails.mapUrl} target="_blank" rel="noopener noreferrer" className="lm-link mt-2 w-fit text-sm text-little-yellow-100">
                      View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </span>
                </li>
                {siteDetails.phone && (
                  <li>
                    <a href={telHref(siteDetails.phone)} className="flex w-fit items-center gap-3 font-semibold transition-colors hover:text-white">
                      <Phone className="h-5 w-5 shrink-0 text-little-pink-300" />
                      {siteDetails.phone}
                    </a>
                  </li>
                )}
                {siteDetails.email && (
                  <li>
                    <a href={`mailto:${siteDetails.email}`} className="flex w-fit items-center gap-3 break-all font-semibold transition-colors hover:text-white">
                      <Mail className="h-5 w-5 shrink-0 text-little-blue-100" />
                      {siteDetails.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Admissions */}
            <div className="relative self-start overflow-hidden rounded-[16px] bg-little-yellow-100 p-3 text-little-green-900">
              <Shape name="burst" color={PALETTE.sun} className="pointer-events-none absolute -right-8 -top-8 w-24 rotate-12" />
              <span className="relative inline-flex items-center gap-1.5 rounded-full bg-little-green-900 px-3 py-1 text-xs font-bold text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-little-yellow-100" /> Admissions open
              </span>
              <p className="relative mt-2 text-base font-extrabold leading-tight tracking-tight">Give your little one a happy start</p>
              <p className="relative mt-2 text-xs leading-5 text-little-green-900/75">Enquire about seats for the upcoming session — Play Group to Grade 3.</p>
              <Link href="/admissions" className="lm-btn relative mt-3 !gap-2 !px-3 !py-2 !text-xs [&>.lm-btn-arrow]:!h-6 [&>.lm-btn-arrow]:!w-6 [&_svg]:!h-3.5 [&_svg]:!w-3.5">Enquire Now <ArrowBubble /></Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative mt-7 flex flex-col gap-2 border-t border-white/10 py-4 pr-24 text-xs sm:mt-8 sm:pr-44">
            <span className="flex flex-wrap items-center gap-x-5 gap-y-2 font-bold">
              <Link href="/privacy-policy" className="text-white hover:opacity-70">Privacy</Link>
              <Link href="/login" className="text-white hover:opacity-70">Staff Login</Link>
            </span>
            <span className="text-little-cream-100/50">© {year} Little Mahilam Preschool. All rights reserved.</span>
            <span className="flex items-center gap-1.5 text-little-cream-100/50">
              Made with <Heart className="h-3.5 w-3.5 fill-little-pink-300 text-little-pink-300" /> for little learners in Tiruppur
            </span>
            <ShapePile className="absolute bottom-0 right-0 w-24 sm:w-40" />
          </div>
        </div>

      </div>
    </footer>
  );
}
