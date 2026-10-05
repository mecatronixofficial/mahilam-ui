import Link from "next/link";
import { ArrowRight, ExternalLink, Facebook, Heart, Instagram, Mail, MailOpen, MapPin, Phone, Star, Youtube } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";
import { NewsletterForm } from "./NewsletterForm";
import { BrandLogo } from "./BrandLogo";
import { site, telHref, type PublicSite } from "@/lib/site";

const TINTS = ["#f7c85b", "#ef9e8a", "#a7d9c1", "#8cb9e8", "#c4b5fd"];

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

const bunting = Array.from({ length: 26 });

export function Footer({ siteDetails = site }: { siteDetails?: PublicSite }) {
  const year = new Date().getFullYear();
  const socialLinks = [
    ["Facebook", siteDetails.social.facebook, Facebook],
    ["Instagram", siteDetails.social.instagram, Instagram],
    ["WhatsApp", siteDetails.social.whatsapp, WhatsappIcon],
    ["YouTube", siteDetails.social.youtube, Youtube],
  ] as const;

  return (
    <footer className="relative mt-24 text-white">
      {/* Cloud-scalloped top edge */}
      <div aria-hidden className="h-6 w-full bg-[radial-gradient(circle_at_22px_24px,#173c2f_22px,transparent_23px)] bg-[length:44px_24px] bg-repeat-x" />

      <div className="relative overflow-hidden bg-[#173c2f]">
        {/* Soft glows and doodles */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#f7c85b]/10 blur-3xl" />
          <span className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#ef9e8a]/10 blur-3xl" />
          <span className="absolute inset-0 opacity-[.06] [background-image:radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:22px_22px]" />
          <Star className="banner-twinkle absolute left-[3%] top-[60%] hidden h-4 w-4 xl:block fill-[#f7c85b] text-[#f7c85b]" />
          <Star className="banner-twinkle absolute right-[30%] top-[40%] h-3 w-3 fill-[#ef9e8a] text-[#ef9e8a] [animation-delay:-1.2s]" />
          <Heart className="banner-twinkle absolute bottom-[18%] right-[6%] h-4 w-4 fill-[#ef9e8a] text-[#ef9e8a] [animation-delay:-.6s]" />
        </div>

        {/* Party bunting */}
        <div aria-hidden className="relative h-4 w-full overflow-hidden">
          <div className="absolute inset-x-0 top-1.5 border-t-2 border-dashed border-white/15" />
          <div className="container-pad flex h-full items-start justify-between px-6">
            {bunting.map((_, i) => (
              <span key={i} className="h-3 w-2.5 shrink-0 max-sm:even:hidden" style={{ backgroundColor: TINTS[i % TINTS.length], clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
            ))}
          </div>
        </div>

        <div className="container-pad relative pb-10 pt-10">
          {/* Newsletter card */}
          <section aria-labelledby="newsletter-title" className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(120deg,#f7c85b,#f4b98a_55%,#ef9e8a)] p-6 text-emerald-950 shadow-[0_24px_50px_-24px_rgba(0,0,0,.6)] sm:p-8">
            <span aria-hidden className="absolute -right-10 -top-12 h-44 w-44 rounded-full border-[18px] border-white/25" />
            <span aria-hidden className="absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-white/15" />
            <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 -rotate-6 items-center justify-center rounded-[20px] bg-white text-[#e2725b] shadow-md">
                  <MailOpen className="h-7 w-7" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-emerald-950/60">School newsletter</p>
                  <h2 id="newsletter-title" className="mt-1 font-display text-2xl font-bold leading-tight sm:text-[1.75rem]">Get happy updates in your inbox</h2>
                  <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-emerald-950/75">Events, holidays, admission dates and little classroom moments — sent straight to you.</p>
                </div>
              </div>
              <NewsletterForm />
            </div>
          </section>

          {/* Main columns */}
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.1fr_1fr]">
            {/* Brand */}
            <div>
              <Link href="/" className="group inline-flex" aria-label="Little Mahilam Pre-school home">
                <BrandLogo className="h-auto w-52 transition-transform duration-300 group-hover:scale-[1.03]" />
              </Link>
              <p className="mt-4 max-w-sm leading-7 text-white/70">Child-centric, play-way learning and multiple intelligence for happy little learners.</p>
              {socialLinks.some(([, url]) => url) && (
                <div className="mt-5 flex items-center gap-2">
                  {socialLinks.map(([name, url, Icon], i) =>
                    url ? (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10 transition hover:-translate-y-1 hover:-rotate-6 hover:bg-[var(--tint)] hover:text-emerald-950"
                        style={{ ["--tint" as string]: TINTS[i % TINTS.length] }}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </a>
                    ) : null,
                  )}
                </div>
              )}
            </div>

            {/* Explore */}
            <nav aria-label="Footer">
              <h3 className="font-display text-lg font-bold">Explore</h3>
              <span aria-hidden className="mt-1.5 block h-1 w-10 rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a]" />
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {exploreLinks.map(([href, label], i) => (
                  <li key={href}>
                    <Link href={href} className="group inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white">
                      <span className="h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: TINTS[i % TINTS.length] }} />
                      <span className="transition-transform group-hover:translate-x-0.5">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Visit */}
            <div>
              <h3 className="font-display text-lg font-bold">Visit us</h3>
              <span aria-hidden className="mt-1.5 block h-1 w-10 rounded-full bg-gradient-to-r from-[#a7d9c1] to-[#8cb9e8]" />
              <ul className="mt-4 grid gap-3 text-white/75">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f7c85b]/15"><MapPin className="h-4 w-4 text-[#f7c85b]" /></span>
                  <span className="text-sm leading-6">
                    {siteDetails.fullAddress}
                    <a href={siteDetails.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 flex w-fit items-center gap-1.5 font-bold text-[#f7c85b] hover:underline">
                      View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </span>
                </li>
                {siteDetails.phone && (
                  <li>
                    <a href={telHref(siteDetails.phone)} className="flex w-fit items-center gap-3 transition-colors hover:text-white">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ef9e8a]/15"><Phone className="h-4 w-4 text-[#ef9e8a]" /></span>
                      {siteDetails.phone}
                    </a>
                  </li>
                )}
                {siteDetails.email && (
                  <li>
                    <a href={`mailto:${siteDetails.email}`} className="flex w-fit items-center gap-3 break-all transition-colors hover:text-white">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#8cb9e8]/15"><Mail className="h-4 w-4 text-[#8cb9e8]" /></span>
                      {siteDetails.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Admissions */}
            <div className="relative self-start overflow-hidden rounded-[28px] border border-white/10 bg-white/[.06] p-6">
              <span aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#f7c85b]/15" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7c85b] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-950">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-900" /> Admissions open
              </span>
              <p className="mt-3 font-display text-lg font-bold leading-snug">Give your little one a happy start</p>
              <p className="mt-1.5 text-sm leading-6 text-white/65">Enquire about seats for the upcoming session — Play Group to Grade 3.</p>
              <Link
                href="/admissions"
                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a] px-5 py-2.5 font-extrabold text-emerald-950 shadow-[0_4px_0_rgba(0,0,0,.25)] transition-[transform,box-shadow] active:translate-y-1 active:shadow-none"
              >
                Enquire Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/10">
          <div className="container-pad flex flex-col items-center justify-between gap-3 py-5 text-sm text-white/55 md:flex-row">
            <span>© {year} Little Mahilam Preschool. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Made with <Heart className="h-3.5 w-3.5 fill-[#ef9e8a] text-[#ef9e8a]" /> for little learners in Tiruppur
            </span>
            <span className="flex items-center gap-4 font-bold">
              <Link href="/privacy-policy" className="text-white/70 hover:text-white">Privacy</Link>
              <Link href="/login" className="text-white/70 hover:text-white">Staff Login</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
