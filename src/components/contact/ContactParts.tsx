import { useId, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { ArrowRight, Clock3, ExternalLink, Facebook, Heart, Instagram, MapPin, Navigation, Share2, ShieldCheck, Signpost, Youtube } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Cloud, FlowerDoodle, Hills, House, SECTION_BG, StarDoodle, Tree, Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";
import { handwriting } from "@/components/about/fonts";
import { WhatsappIcon } from "@/components/public/WhatsappIcon";

/* ------------------------------------------------------------------ illustrations */

function PhoneDoodle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className}>
      <rect x="18" y="6" width="28" height="52" rx="7" fill={BRAND.green[600]} />
      <rect x="22" y="13" width="20" height="34" rx="3" fill={BRAND.blue[100]} />
      <circle cx="32" cy="52" r="2.5" fill={BRAND.green[100]} />
      <path d="M48 16 Q 56 22 52 32" stroke={BRAND.coral[400]} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M52 10 Q 63 20 57 36" stroke={BRAND.coral[300]} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function EnvelopeDoodle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={className}>
      <rect x="6" y="16" width="52" height="36" rx="6" fill={BRAND.coral[300]} />
      <path d="M8 19 L32 38 L56 19" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <path d="M42 8 C 42 4, 48 4, 48 8 C 48 4, 54 4, 54 8 C 54 12, 48 15, 48 15 C 48 15, 42 12, 42 8 Z" fill={BRAND.pink[400]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ reach-us path */

export type ReachStop = { kind: "call" | "email" | "visit"; label: string; value: string; href?: string; action: string; external?: boolean };

const STOP_LOOKS: Record<ReachStop["kind"], { ring: string; emoji: string; scene: ReactNode }> = {
  call: { ring: BRAND.green[400], emoji: "📞", scene: <PhoneDoodle className="w-16" /> },
  email: { ring: BRAND.coral[300], emoji: "💌", scene: <EnvelopeDoodle className="w-16" /> },
  visit: { ring: BRAND.yellow[400], emoji: "🏫", scene: <House className="w-16" /> },
};

/** Desktop trail through the three stops (x = 200 / 600 / 1000, y = 80 in a 1200×160 box) — same as the About vision path. */
const ROUTE = "M0 128 C 90 128 120 80 200 80 C 320 80 360 140 460 132 C 540 126 550 80 600 80 C 700 80 740 22 830 30 C 920 38 940 80 1000 80 C 1090 80 1120 44 1200 44";
const DRAW = fx({ dur: 2.2, ease: "soft" });

/** Call / Email / Visit as destinations on a dotted adventure path that draws itself on scroll. */
export function ReachPath({ stops }: { stops: ReachStop[] }) {
  const maskId = useId();
  return (
    <section id="reach-us" className="relative scroll-mt-20 overflow-hidden pb-32 pt-8 md:pt-10" style={{ background: SECTION_BG.mint }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute left-[3%] top-10 w-28 animate-drift" />
        <Cloud className="absolute right-[5%] top-28 w-20 animate-drift opacity-80 [--drift:-40px] [animation-delay:-8s]" />
      </div>

      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Reach Us"
          icon={<Signpost className="h-4 w-4" />}
          title={<>Three happy ways to <span className="text-little-pink-500">say hello.</span></>}
          lead="Call our team, write to us, or come and visit — whichever feels easiest for your family."
        />

        <Group className="relative mt-12">
          <svg aria-hidden viewBox="0 0 1200 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 w-full md:block">
            <defs>
              <mask id={maskId}>
                <path d={ROUTE} fill="none" stroke="#fff" strokeWidth="30" pathLength={1} strokeDasharray={1} className="fx-draw" style={DRAW} />
              </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
              <path d={ROUTE} fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d={ROUTE} fill="none" stroke={BRAND.green[600]} strokeOpacity=".55" strokeWidth="3.5" strokeDasharray="2 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            <span
              aria-hidden
              className="fx-grow-y absolute bottom-10 left-[43px] top-10 w-1.5 origin-top rounded-full md:hidden"
              style={{ ...DRAW, backgroundImage: `repeating-linear-gradient(180deg, ${BRAND.green[600]}88 0 4px, transparent 4px 14px)` }}
            />
            {stops.map((stop, i) => {
              const look = STOP_LOOKS[stop.kind];
              return (
                <li
                  key={stop.kind}
                  className="fx relative grid grid-cols-[88px_1fr] items-start gap-4 md:flex md:flex-col md:items-center md:text-center"
                  style={fx({ y: 30, d: 0.3 + i * 0.45, dur: 0.8, ease: "spring" })}
                >
                  <div className="relative grid h-[88px] w-[88px] place-items-center md:mt-1 md:h-36 md:w-36">
                    <div
                      className="fx-hop relative grid h-full w-full place-items-center rounded-full bg-white transition-[scale,rotate] duration-300 ease-(--ease-back) hover:scale-108 hover:-rotate-4"
                      style={{ "--fx-hop": "-7px", "--fx-dur": "2.6s", "--fx-d": `${i * 0.5}s`, boxShadow: `0 0 0 6px ${look.ring}, 0 18px 30px -18px rgba(36,68,32,.6)` } as CSSProperties}
                    >
                      <span className="scale-75 md:scale-110">{look.scene}</span>
                    </div>
                    <span className="absolute -right-1 -top-3 flex items-start md:-top-4 md:right-2">
                      <span className="h-10 w-0.5 rounded bg-little-green-900/70" />
                      <span className="animate-flag rounded-r-md px-1.5 py-0.5 font-display text-xs font-bold text-little-green-950" style={{ background: look.ring, transformOrigin: "left center" }}>0{i + 1}</span>
                    </span>
                  </div>

                  <div className="min-w-0 pt-2 md:pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[.16em] text-little-green-700">Stop 0{i + 1}</span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-little-green-950"><span aria-hidden className="mr-1.5">{look.emoji}</span>{stop.label}</h3>
                    <p className={`mt-1.5 max-w-xs font-display font-bold text-little-green-900 [overflow-wrap:anywhere] md:mx-auto ${stop.kind === "email" ? "text-[15px] sm:text-base lg:text-lg" : "text-lg"}`}>{stop.value}</p>
                    {stop.href && (
                      <a
                        href={stop.href}
                        target={stop.external ? "_blank" : undefined}
                        rel={stop.external ? "noopener noreferrer" : undefined}
                        className="group mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-little-green-900 shadow-sm ring-1 ring-little-green-900/10 transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {stop.action} {stop.external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Group>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="relative">
          {[["6%", BRAND.pink[300]], ["14%", BRAND.yellow[400]], ["79%", BRAND.coral[300]], ["90%", BRAND.blue[300]]].map(([left, color], i) => (
            <FlowerDoodle key={left} color={color} className="absolute bottom-10 h-9 w-auto sm:bottom-14" style={{ left, transform: `rotate(${i % 2 ? 6 : -6}deg)` }} />
          ))}
          <Hills className="h-20 sm:h-28" back={BRAND.green[200]} front={SECTION_BG.cream} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ social playground */

export type Social = { key: string; label: string; url: string };

const SOCIAL_ICONS: Record<string, ComponentType<{ className?: string }>> = { facebook: Facebook, instagram: Instagram, whatsapp: WhatsappIcon, youtube: Youtube };
const SOCIAL_LOOKS = [
  { bg: BRAND.pink[50], tile: BRAND.coral[300], shape: "cloud" as const },
  { bg: BRAND.yellow[100], tile: BRAND.yellow[400], shape: "brick" as const },
  { bg: BRAND.green[100], tile: BRAND.green[400], shape: "puzzle" as const },
  { bg: BRAND.blue[100], tile: BRAND.blue[300], shape: "cloud" as const },
];


function CardShape({ shape, bg }: { shape: "cloud" | "brick" | "puzzle"; bg: string }) {
  const base = "absolute inset-0 rounded-[28px] shadow-[0_22px_44px_-30px_rgba(36,68,32,.55)]";
  if (shape === "cloud") {
    return (
      <span aria-hidden className="pointer-events-none">
        <span className={base} style={{ background: bg }} />
        <span className="absolute -top-5 left-[14%] h-12 w-12 rounded-full" style={{ background: bg }} />
        <span className="absolute -top-7 left-[34%] h-14 w-14 rounded-full" style={{ background: bg }} />
        <span className="absolute -top-4 left-[58%] h-10 w-10 rounded-full" style={{ background: bg }} />
      </span>
    );
  }
  if (shape === "brick") {
    return (
      <span aria-hidden className="pointer-events-none">
        <span className={`${base} rounded-[20px]`} style={{ background: bg, boxShadow: `inset 0 -8px 0 ${BRAND.yellow[300]}, 0 22px 44px -30px rgba(36,68,32,.55)` }} />
        <span className="absolute -top-3 left-[20%] flex w-[60%] gap-[16%]">
          {[0, 1, 2].map((s) => <span key={s} className="h-4 flex-1 rounded-t-xl" style={{ background: bg, boxShadow: `inset 0 -3px 0 ${BRAND.yellow[300]}` }} />)}
        </span>
      </span>
    );
  }
  return (
    <span aria-hidden className="pointer-events-none">
      <span className={base} style={{ background: bg }} />
      <span className="absolute -top-5 left-1/2 h-11 w-11 -translate-x-1/2 rounded-full" style={{ background: bg }} />
      <span className="absolute -left-1 top-1/2 h-10 w-5 -translate-y-1/2 rounded-r-full" style={{ background: SECTION_BG.cream }} />
    </span>
  );
}

/** Social profiles as playground cards (cloud, toy brick, puzzle) that bounce and sparkle on hover. */
export function SocialPlayground({ profiles }: { profiles: Social[] }) {
  if (!profiles.length) return null;
  return (
    <section className="relative overflow-hidden pb-14 pt-6 md:pt-8" style={{ background: SECTION_BG.cream }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Connect with us"
          icon={<Share2 className="h-4 w-4" />}
          title={<>Follow our <span className="text-little-blue-500">happy little moments.</span></>}
          lead="Follow Little Mahilam for school updates, celebrations and happy classroom moments."
        />
        <Group as="ul" className={`mt-12 grid gap-8 sm:grid-cols-2 ${profiles.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {profiles.map((profile, i) => {
            const look = SOCIAL_LOOKS[i % SOCIAL_LOOKS.length];
            const Icon = SOCIAL_ICONS[profile.key.toLowerCase()] || Share2;
            return (
              <li
                key={profile.key}
                className="fx"
                style={fx({ y: 40, d: i * 0.1, dur: 0.9, ease: "spring" })}
              >
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/card relative block rounded-[28px] outline-none transition-[translate,rotate] duration-300 ease-(--ease-back-strong) hover:-translate-y-2 hover:-rotate-[1.5deg] focus-visible:-translate-y-2 focus-visible:ring-4 focus-visible:ring-little-blue-300"
                >
                  <CardShape shape={look.shape} bg={look.bg} />
                  <span className="relative flex flex-col items-center p-6 pt-8 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-[22px] transition-[scale] duration-300 group-hover/card:scale-106 group-hover/card:animate-[fx-boing_.7s_ease-out] text-little-green-950 shadow-[0_12px_22px_-12px_rgba(36,68,32,.6)]" style={{ background: look.tile }}>
                      <Icon className="h-8 w-8" />
                    </span>
                    <span className="mt-4 font-display text-2xl font-bold text-little-green-950">{profile.label}</span>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-little-neutral-500">View profile <ExternalLink className="h-3.5 w-3.5" /></span>
                    {["right-5 bottom-14", "left-[46%] top-2", "left-5 bottom-6"].map((spot, s) => (
                      <span key={spot} aria-hidden className={`pointer-events-none absolute scale-30 opacity-0 transition-[opacity,scale,rotate] duration-300 ease-(--ease-back-strong) group-hover/card:scale-100 group-hover/card:rotate-20 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 ${spot}`} style={{ transitionDelay: `${s * 0.08}s` }}>
                        <StarDoodle className="w-5" color={s === 1 ? BRAND.pink[300] : BRAND.yellow[400]} />
                      </span>
                    ))}
                  </span>
                </a>
              </li>
            );
          })}
        </Group>
      </div>
      <Wave color={SECTION_BG.peach} className="absolute inset-x-0 bottom-0 h-8" />
    </section>
  );
}

/* ------------------------------------------------------------------ map storybook */

/** Each page swings open from the spine (`.fx-flip`, a CSS rotateY). */
const open = (ry: number, d = 0) => ({ ...fx({ d, dur: 1.3, ease: "spring" }), "--fx-ry": `${ry}deg` }) as CSSProperties;

/** "Find us" as an open picture book: the address page on the left, the map on the right; it swings open on scroll. */
export function MapStoryBook({ name, address, hours, mapUrl, mapEmbedUrl }: { name: string; address: string; hours: string; mapUrl: string; mapEmbedUrl: string }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-6 md:pt-8" style={{ background: SECTION_BG.peach }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <StarDoodle className="absolute right-[8%] top-14 w-6 animate-twinkle" />
        <Tree className="absolute bottom-10 left-[2%] hidden w-14 lg:block" />
      </div>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Find us"
          icon={<MapPin className="h-4 w-4 text-little-coral-500" />}
          title={<>Right here in <span className="text-little-pink-500">Tiruppur.</span></>}
          lead="We're in Amarjothi AS Nagar, off Kangayam Road in Valliammai Nagar. If this is your first visit, booking ahead helps us give your family the time and attention you deserve."
        />

        <Group className="relative mx-auto mt-10 max-w-5xl [perspective:1800px]">
          <div aria-hidden className="absolute inset-x-6 -bottom-4 h-10 rounded-[50%] bg-little-green-900/10 blur-xl" />
          <div className="relative grid rounded-[34px] bg-little-blue-400 p-2.5 shadow-[0_40px_70px_-40px_rgba(36,68,32,.6)] sm:p-3.5 md:grid-cols-[.85fr_1.15fr]">
            {/* Left page — the address */}
            <div
              className="fx-flip relative overflow-hidden rounded-t-[26px] bg-[#fffdf7] p-6 sm:p-8 md:rounded-l-[26px] md:rounded-tr-none"
              style={{ ...open(70), transformOrigin: "right center", backgroundImage: "linear-gradient(90deg, transparent 88%, rgba(36,68,32,.07)), repeating-linear-gradient(180deg, transparent 0 31px, rgba(96,197,195,.16) 31px 32px)" }}
            >
              <p className={`${handwriting.className} text-[2rem] font-bold leading-none text-little-coral-500`}>Come find us here…</p>
              <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[.2em] text-little-green-700">{name}</p>
              <address className="mt-2 not-italic">
                {address.split(", ").map((line) => (
                  <span key={line} className="block font-display text-lg font-bold leading-8 text-little-green-950">{line}</span>
                ))}
              </address>
              <div className="mt-5 grid gap-2 text-sm font-bold text-little-neutral-600">
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-little-coral-600" /> {hours}</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-little-green-700" /> Safe, caring campus</span>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fx-press mt-6 h-12 items-center gap-2 rounded-full bg-little-green-900 px-6 text-sm font-extrabold text-white shadow-[0_14px_26px_-16px_rgba(36,68,32,.9)]"
              >
                <Navigation className="h-4 w-4 text-little-yellow-400" /> Get directions
              </a>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold text-little-neutral-400">1</span>
            </div>

            {/* Right page — the map */}
            <div
              className="fx-flip relative overflow-hidden rounded-b-[26px] bg-[#fffdf7] p-3 md:rounded-r-[26px] md:rounded-bl-none"
              style={{ ...open(-70, 0.12), transformOrigin: "left center" }}
            >
              <div className="relative h-full min-h-[320px] overflow-hidden rounded-[20px] md:min-h-[420px]">
                <iframe title={`Map showing ${name}`} src={mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            </div>

            {/* Sticker on the book's top edge, clear of the map controls */}
            <span
              className="fx-hop absolute -top-4 right-[10%] z-10 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-little-coral-500 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md"
              style={{ "--fx-hop": "-4px", "--fx-dur": "1.6s" } as CSSProperties}
            >
              <MapPin className="h-3.5 w-3.5" /> Little Mahilam
            </span>
            <span aria-hidden className="pointer-events-none absolute inset-y-3 left-[42.5%] hidden w-6 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(36,68,32,.14),transparent)] md:block" />
            <span aria-hidden className="absolute -bottom-6 left-[18%] hidden h-16 w-6 bg-little-yellow-400 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] md:block" />
          </div>
        </Group>
      </div>
      <Wave color={SECTION_BG.butter} flip className="absolute inset-x-0 bottom-0 h-8" />
    </section>
  );
}

/* ------------------------------------------------------------------ visit steps */

export const VISIT_STEP_COLORS = [BRAND.yellow[400], BRAND.green[300], BRAND.coral[300]];

export function HeartNote() {
  return (
    <span className="inline-flex items-center gap-2 font-display text-lg font-bold text-little-coral-700"><Heart className="h-5 w-5 animate-beat fill-current" /> We can&apos;t wait to meet you</span>
  );
}
