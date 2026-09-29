import Link from "next/link";
import { MapPin, ExternalLink, Smile, ArrowRight, Facebook, Instagram, Youtube, Phone, Mail } from "lucide-react";
import { WhatsappIcon } from "./WhatsappIcon";

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63"];

const socialLinks = [
  ["Facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL, Facebook],
  ["Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL, Instagram],
  ["WhatsApp", process.env.NEXT_PUBLIC_WHATSAPP_URL, WhatsappIcon],
  ["YouTube", process.env.NEXT_PUBLIC_YOUTUBE_URL, Youtube],
] as const;

const exploreLinks = [
  ["/", "Home"],
  ["/about", "About"],
  ["/learning-approach", "Learning Approach"],
  ["/programs", "Programs"],
  ["/activities", "Activities"],
  ["/facilities", "Facilities"],
  ["/gallery", "Gallery"],
  ["/events", "Events"],
  ["/contact", "Contact"],
] as const;

const bunting = Array.from({ length: 22 });

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#173c2f] text-white">
      <div className="relative h-4 w-full overflow-hidden">
        <div className="absolute inset-x-0 top-1.5 border-t-2 border-dashed border-white/15" />
        <div className="container-pad flex h-full items-start justify-between px-6">
          {bunting.map((_, i) => (
            <span
              key={i}
              className="h-3 w-2.5 shrink-0"
              style={{
                backgroundColor: TINTS[i % TINTS.length],
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container-pad grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 -rotate-3 items-center justify-center rounded-[1.1rem] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950 shadow-md shadow-black/20">
              <Smile className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <div>
              <div className="text-xl font-black leading-tight">Little Mahilam</div>
              <div className="text-xs font-bold text-white/60">School of Happiness</div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-white/70">
            Child-centric, play-way learning and multiple intelligence for happy little learners.
          </p>
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
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[var(--tint)] hover:text-emerald-950"
                    style={{ ["--tint" as string]: TINTS[i % TINTS.length] }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>

        <div>
          <div className="font-bold">Explore</div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {exploreLinks.map(([href, label], i) => (
              <Link
                key={href}
                href={href}
                className="inline-flex w-fit items-center gap-2 text-white/75 transition-colors hover:text-white"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: TINTS[i % TINTS.length] }} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 font-bold">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${TINTS[0]}26` }}
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: TINTS[0] }} />
            </span>
            Visit
          </div>
          <p className="mt-3 text-white/70">
            56/11A, 2nd Street, Amarjothi AS Nagar, Kangayam Rd, Valliammai Nagar, Tiruppur, Tamil Nadu 641604
          </p>
          <a
            className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#f7c85b] hover:text-[#f7c85b]/80"
            href="https://maps.app.goo.gl/3qtZGG2wR8unUM7U7"
            target="_blank"
          >
            View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <div className="mt-4 grid gap-2">
            {process.env.NEXT_PUBLIC_PHONE && (
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE.replace(/\s+/g, "")}`}
                className="inline-flex w-fit items-center gap-2 text-white/75 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" style={{ color: TINTS[0] }} /> {process.env.NEXT_PUBLIC_PHONE}
              </a>
            )}
            {process.env.NEXT_PUBLIC_EMAIL && (
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                className="inline-flex w-fit items-center gap-2 text-white/75 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" style={{ color: TINTS[0] }} /> {process.env.NEXT_PUBLIC_EMAIL}
              </a>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="font-bold">Admissions Open</div>
          <p className="mt-2 text-sm text-white/70">
            Give your little one a happy start — enquire about seats for the upcoming session.
          </p>
          <Link
            href="/admissions"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7c85b] to-[#ef9e8a] px-5 py-2.5 font-extrabold text-emerald-950 transition-transform hover:scale-[1.03]"
          >
            Enquire Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pad flex flex-col-reverse items-center justify-between gap-3 py-5 text-sm text-white/60 sm:flex-row">
          <span>© {year} Little Mahilam Preschool. All rights reserved.</span>
          <Link href="/login" className="font-bold text-white/70 hover:text-white">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
