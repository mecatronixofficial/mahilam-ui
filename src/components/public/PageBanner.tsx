import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import {
  Backpack, BookOpen, Camera, ChevronRight, Cloud, GraduationCap, Heart, Home, Lightbulb, Lock, MapPin, MessageCircleQuestion, Music2,
  Navigation, Palette, Pencil, Puzzle, Send, ShieldCheck, Sparkles, Star, Sun, TreeDeciduous, type LucideIcon,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Bunting } from "./Bunting";
import { BalloonString } from "./BalloonString";
import { breadcrumbSchema } from "@/lib/seo";
import { isOptimizable } from "@/lib/media";
import { BRAND } from "@/lib/brand";

type Crumb = { name: string; path: string };
export type BannerTheme = "programs" | "gallery" | "events" | "about" | "admissions" | "approach" | "activities" | "facilities" | "blog" | "faq" | "local" | "privacy";

/** Balloon gradients: [highlight, body, shade]. "sun" matches the scroll-to-top balloon. */
const BALLOONS = {
  sun: [BRAND.yellow[50], BRAND.yellow[400], BRAND.coral[300]],
  mint: [BRAND.green[50], BRAND.green[200], BRAND.green[700]],
  coral: [BRAND.coral[50], BRAND.coral[300], BRAND.coral[500]],
  sky: [BRAND.blue[50], BRAND.blue[300], BRAND.blue[600]],
  lilac: [BRAND.pink[50], BRAND.pink[200], BRAND.pink[600]],
} as const;

const BALLOON_SIZES = { sm: "h-10 w-9", md: "h-14 w-12", lg: "h-16 w-14" } as const;

/** Same balloon as the scroll-to-top button: glossy body, knot and a wiggling thread, gently swaying. Pass display via `className` (e.g. "hidden md:flex"). */
function Balloon({ color, size = "md", string = 48, delay = "0s", className }: { color: keyof typeof BALLOONS; size?: keyof typeof BALLOON_SIZES; string?: number; delay?: string; className: string }) {
  const [light, body, shade] = BALLOONS[color];
  return (
    <span className={`banner-sway absolute flex-col items-center ${className}`} style={{ animationDelay: delay }}>
      <span
        className={`relative block shadow-lg shadow-little-green-950/30 ${BALLOON_SIZES[size]}`}
        style={{ background: `radial-gradient(circle at 33% 28%, ${light}, ${body} 45%, ${shade} 100%)`, borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%" }}
      />
      <span className="-mt-px block h-2 w-2.5" style={{ backgroundColor: shade, clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
      <BalloonString length={string} className="-mt-px" style={{ animationDelay: delay }} />
    </span>
  );
}

function Twinkle({ className, color = BRAND.yellow[400], delay = "0s" }: { className: string; color?: string; delay?: string }) {
  return <Star className={`banner-twinkle absolute ${className}`} style={{ color, fill: color, animationDelay: delay }} />;
}

function Block({ letter, color, className }: { letter: string; color: string; className: string }) {
  return (
    <span className={`absolute h-10 w-10 place-items-center rounded-xl font-display text-xl font-bold text-white shadow-[inset_0_-4px_0_rgba(0,0,0,.15),inset_0_2px_0_rgba(255,255,255,.35),0_10px_18px_-10px_rgba(0,0,0,.6)] ${className}`} style={{ backgroundColor: color }}>
      {letter}
    </span>
  );
}

function Polaroid({ color, className }: { color: string; className: string }) {
  return (
    <span className={`absolute rounded-md bg-white p-1.5 pb-4 shadow-xl ${className}`}>
      <span className="block h-11 w-14 rounded-sm" style={{ background: `linear-gradient(135deg, ${color}, var(--color-little-yellow-50))` }} />
    </span>
  );
}

function Confetti({ className, color, round = false }: { className: string; color: string; round?: boolean }) {
  return <span className={`banner-twinkle absolute block ${round ? "h-2 w-2 rounded-full" : "h-3 w-1.5 rounded-sm"} ${className}`} style={{ backgroundColor: color }} />;
}

/** Page-specific play-school doodles, so every banner feels different. Decorative only. */
function Decorations({ theme }: { theme: BannerTheme }) {
  switch (theme) {
    case "programs":
      return (
        <>
          <Balloon color="sun" className="left-[4%] top-[12%] hidden md:flex" string={64} />
          <Balloon color="mint" size="sm" delay="-1.8s" className="left-[10%] top-[30%] hidden lg:flex" />
          <Block letter="A" color={BRAND.yellow[400]} className="bottom-[22%] right-[13%] hidden -rotate-12 md:grid" />
          <Block letter="B" color={BRAND.coral[300]} className="bottom-[22%] right-[8%] hidden rotate-6 md:grid" />
          <Block letter="C" color={BRAND.green[700]} className="bottom-[36%] right-[10.5%] hidden -rotate-3 md:grid" />
          <Pencil className="absolute right-[6%] top-[16%] hidden h-9 w-9 rotate-12 text-little-yellow-400/80 md:block" />
          <Twinkle className="left-[22%] top-[20%] h-4 w-4" />
          <Twinkle className="right-[24%] top-[24%] h-3.5 w-3.5" color="#ffffff" delay="-1s" />
        </>
      );
    case "gallery":
      return (
        <>
          <Balloon color="sky" className="right-[5%] top-[10%] hidden md:flex" string={64} />
          <Balloon color="coral" size="sm" delay="-2s" className="right-[11%] top-[28%] hidden lg:flex" />
          <Polaroid color={BRAND.yellow[400]} className="left-[5%] top-[18%] hidden -rotate-12 md:block" />
          <Polaroid color={BRAND.blue[300]} className="bottom-[20%] left-[10%] hidden rotate-6 lg:block" />
          <Camera className="absolute bottom-[22%] right-[7%] hidden h-9 w-9 -rotate-12 text-white/70 md:block" />
          <Heart className="banner-twinkle absolute left-[24%] top-[18%] h-4 w-4 fill-little-coral-300 text-little-coral-300" />
          <Heart className="banner-twinkle absolute right-[22%] bottom-[30%] h-3.5 w-3.5 fill-white text-white [animation-delay:-1.3s]" />
        </>
      );
    case "events":
      return (
        <>
          <Bunting className="absolute inset-x-0 top-0 text-white" />
          {/* Balloon bunch on the left, a pair on the right */}
          <Balloon color="coral" className="left-[4%] top-[18%] hidden md:flex" string={64} />
          <Balloon color="sun" delay="-1.2s" className="left-[8%] top-[10%] hidden md:flex" string={80} />
          <Balloon color="lilac" size="sm" delay="-2.4s" className="left-[12%] top-[24%] hidden lg:flex" string={56} />
          <Balloon color="mint" delay="-.6s" className="right-[5%] top-[16%] hidden md:flex" string={64} />
          <Balloon color="sky" size="sm" delay="-1.8s" className="right-[10%] top-[26%] hidden lg:flex" />
          <Confetti className="left-[22%] top-[26%] rotate-12" color={BRAND.yellow[400]} />
          <Confetti className="left-[30%] bottom-[28%] -rotate-12" color={BRAND.coral[300]} round />
          <Confetti className="right-[24%] top-[20%] rotate-45 [animation-delay:-.7s]" color={BRAND.green[200]} />
          <Confetti className="right-[18%] bottom-[30%] [animation-delay:-1.4s]" color={BRAND.pink[200]} round />
          <Music2 className="banner-twinkle absolute right-[28%] bottom-[22%] hidden h-5 w-5 text-little-yellow-400 [animation-delay:-2s] md:block" />
        </>
      );
    case "about":
      return (
        <>
          <Sun className="absolute left-[5%] top-[14%] hidden h-16 w-16 animate-[spin_30s_linear_infinite] fill-little-yellow-400/40 text-little-yellow-400 md:block" />
          <span className="absolute bottom-[18%] left-[8%] hidden h-14 w-28 bg-[radial-gradient(circle_at_50%_100%,transparent_38%,var(--color-little-blue-300)_38%_48%,var(--color-little-green-200)_48%_58%,var(--color-little-yellow-400)_58%_68%,var(--color-little-coral-300)_68%_78%,transparent_78%)] opacity-90 lg:block" />
          <Balloon color="coral" className="right-[6%] top-[12%] hidden md:flex" string={80} />
          <Cloud className="absolute right-[13%] top-[18%] hidden h-10 w-10 fill-white/80 text-white/80 lg:block" />
          <Cloud className="absolute left-[20%] top-[10%] hidden h-7 w-7 fill-white/60 text-white/60 lg:block" />
          <Heart className="banner-twinkle absolute right-[12%] bottom-[26%] h-5 w-5 fill-little-coral-300 text-little-coral-300" />
          <Twinkle className="left-[26%] bottom-[30%] h-3.5 w-3.5" color="#ffffff" delay="-1.2s" />
        </>
      );
    case "admissions":
      return (
        <>
          <Balloon color="sun" className="left-[5%] top-[14%] hidden md:flex" string={72} />
          <Balloon color="coral" size="sm" delay="-1.6s" className="left-[10%] top-[26%] hidden lg:flex" />
          <span className="absolute bottom-[20%] right-[7%] hidden h-16 w-16 -rotate-12 items-center justify-center rounded-[22px] bg-little-coral-600 text-white shadow-lg md:flex"><Backpack className="h-8 w-8" /></span>
          <GraduationCap className="absolute right-[12%] top-[16%] hidden h-11 w-11 rotate-12 text-little-yellow-400 md:block" />
          <Twinkle className="left-[24%] bottom-[26%] h-4 w-4" />
          <Twinkle className="right-[24%] top-[26%] h-3.5 w-3.5" color="#ffffff" delay="-.9s" />
        </>
      );
    case "approach":
      return (
        <>
          <span className="absolute left-[6%] top-[16%] hidden md:block">
            <span className="absolute -inset-4 rounded-full bg-little-yellow-400/30 blur-xl" />
            <Lightbulb className="relative h-14 w-14 fill-little-yellow-400/60 text-little-yellow-400" />
          </span>
          <Puzzle className="absolute bottom-[22%] left-[11%] hidden h-10 w-10 -rotate-12 text-little-green-200 lg:block" />
          <Puzzle className="absolute right-[8%] top-[18%] hidden h-12 w-12 rotate-12 text-little-coral-300 md:block" />
          <Balloon color="mint" size="sm" delay="-1s" className="bottom-[16%] right-[14%] hidden lg:flex" string={42} />
          <Twinkle className="left-[26%] top-[22%] h-4 w-4" />
          <Twinkle className="right-[22%] bottom-[28%] h-3.5 w-3.5" color="#ffffff" delay="-1.4s" />
        </>
      );
    case "activities":
      return (
        <>
          {[["left-[5%] top-[18%] h-16 w-16", BRAND.yellow[400]], ["left-[12%] bottom-[18%] h-10 w-10", BRAND.blue[300]], ["right-[6%] bottom-[22%] h-14 w-14", BRAND.coral[300]], ["right-[14%] top-[14%] h-8 w-8", BRAND.pink[200]]].map(([pos, color]) => (
            <span key={pos} className={`absolute hidden opacity-80 md:block ${pos}`} style={{ backgroundColor: color, borderRadius: "58% 42% 63% 37% / 45% 55% 45% 55%" }} />
          ))}
          <Palette className="absolute left-[7%] top-[20%] hidden h-10 w-10 text-little-green-950/70 md:block" />
          <Music2 className="banner-twinkle absolute right-[22%] top-[24%] hidden h-7 w-7 text-little-yellow-400 md:block" />
          <Music2 className="banner-twinkle absolute left-[24%] bottom-[24%] h-5 w-5 text-white [animation-delay:-1.2s]" />
          <Balloon color="lilac" className="right-[5%] top-[10%] hidden lg:flex" string={56} />
        </>
      );
    case "facilities":
      return (
        <>
          <span className="absolute left-[5%] top-[14%] hidden h-20 w-24 md:block">
            <span className="absolute inset-x-0 bottom-0 h-12 rounded-md bg-little-yellow-100" />
            <span className="absolute inset-x-[-6px] top-0 h-10 bg-little-coral-300" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            <span className="absolute bottom-0 left-1/2 h-7 w-5 -translate-x-1/2 rounded-t-md bg-little-green-700" />
          </span>
          <TreeDeciduous className="absolute bottom-[18%] left-[12%] hidden h-12 w-12 fill-little-green-200/60 text-little-green-200 lg:block" />
          <TreeDeciduous className="absolute bottom-[20%] right-[9%] hidden h-14 w-14 fill-little-green-200/60 text-little-green-200 md:block" />
          <Sun className="absolute right-[8%] top-[12%] hidden h-12 w-12 animate-[spin_30s_linear_infinite] fill-little-yellow-400/50 text-little-yellow-400 md:block" />
          <Cloud className="absolute right-[18%] top-[20%] hidden h-8 w-8 fill-white/70 text-white/70 lg:block" />
          <Twinkle className="left-[26%] top-[20%] h-3.5 w-3.5" color="#ffffff" />
        </>
      );
    case "blog":
      return (
        <>
          <BookOpen className="absolute left-[6%] top-[18%] hidden h-14 w-14 -rotate-6 text-little-yellow-400 md:block" />
          <Pencil className="absolute bottom-[22%] left-[12%] hidden h-9 w-9 rotate-12 text-little-coral-300 lg:block" />
          <span className="absolute right-[8%] top-[16%] hidden md:block">
            <Send className="h-10 w-10 -rotate-12 text-white" />
            <svg viewBox="0 0 90 40" className="absolute right-8 top-6 h-8 w-20 text-white/60"><path d="M88 4 C 60 10, 40 36, 2 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" /></svg>
          </span>
          <Balloon color="sky" size="sm" delay="-.8s" className="bottom-[14%] right-[12%] hidden lg:flex" string={42} />
          <Twinkle className="left-[24%] top-[26%] h-4 w-4" />
        </>
      );
    case "faq":
      return (
        <>
          {[["left-[6%] top-[16%] text-6xl rotate-[-12deg]", BRAND.yellow[400]], ["left-[13%] bottom-[20%] text-4xl rotate-[8deg]", BRAND.green[200]], ["right-[7%] top-[14%] text-5xl rotate-[10deg]", BRAND.coral[300]], ["right-[15%] bottom-[22%] text-3xl rotate-[-8deg]", BRAND.pink[200]]].map(([pos, color]) => (
            <span key={pos} className={`absolute hidden font-display font-bold md:block ${pos}`} style={{ color }}>?</span>
          ))}
          <MessageCircleQuestion className="absolute bottom-[26%] left-[22%] hidden h-9 w-9 text-white/80 lg:block" />
          <Balloon color="coral" size="sm" delay="-1.3s" className="right-[4%] bottom-[12%] hidden lg:flex" string={42} />
          <Twinkle className="right-[26%] top-[24%] h-3.5 w-3.5" color="#ffffff" />
        </>
      );
    case "local":
      return (
        <>
          <svg className="absolute inset-x-0 bottom-[18%] hidden h-24 w-full md:block" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0 70 C 150 20, 250 100, 400 60 S 700 10, 1000 50" fill="none" stroke="#ffffff" strokeOpacity=".3" strokeWidth="3" strokeDasharray="10 12" strokeLinecap="round" />
          </svg>
          <MapPin className="absolute left-[7%] top-[20%] hidden h-12 w-12 fill-little-coral-300 text-white md:block" />
          <MapPin className="absolute bottom-[26%] right-[10%] hidden h-10 w-10 fill-little-yellow-400 text-white md:block" />
          <Navigation className="absolute right-[18%] top-[16%] hidden h-8 w-8 rotate-12 text-little-green-200 lg:block" />
          <Balloon color="mint" size="sm" className="left-[14%] bottom-[14%] hidden lg:flex" string={42} />
          <Twinkle className="left-[26%] top-[18%] h-4 w-4" />
        </>
      );
    case "privacy":
      return (
        <>
          <ShieldCheck className="absolute left-[6%] top-[18%] hidden h-14 w-14 fill-little-green-200/30 text-little-green-200 md:block" />
          <Lock className="absolute bottom-[22%] right-[8%] hidden h-10 w-10 text-little-yellow-400 md:block" />
          <Heart className="banner-twinkle absolute right-[14%] top-[18%] h-5 w-5 fill-little-coral-300 text-little-coral-300" />
          <Cloud className="absolute left-[14%] bottom-[20%] hidden h-9 w-9 fill-white/60 text-white/60 lg:block" />
          <Twinkle className="left-[26%] top-[24%] h-3.5 w-3.5" color="#ffffff" />
        </>
      );
  }
}

/** Per-theme corner glows over the photo tint. */
const GLOWS: Record<BannerTheme, string> = {
  programs: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(240,206,52,.35),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(63,116,50,.45),transparent_65%)]",
  gallery: "bg-[radial-gradient(30rem_18rem_at_100%_0%,rgba(134,213,212,.35),transparent_65%),radial-gradient(28rem_18rem_at_0%_100%,rgba(247,159,145,.35),transparent_65%)]",
  events: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(247,159,145,.4),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(249,187,217,.35),transparent_65%)]",
  about: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(240,206,52,.4),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(201,230,187,.35),transparent_65%)]",
  admissions: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(240,206,52,.4),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(247,159,145,.4),transparent_65%)]",
  approach: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(240,206,52,.45),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(134,213,212,.3),transparent_65%)]",
  activities: "bg-[radial-gradient(30rem_18rem_at_100%_0%,rgba(249,187,217,.35),transparent_65%),radial-gradient(28rem_18rem_at_0%_100%,rgba(240,206,52,.35),transparent_65%)]",
  facilities: "bg-[radial-gradient(30rem_18rem_at_100%_0%,rgba(240,206,52,.35),transparent_65%),radial-gradient(28rem_18rem_at_0%_100%,rgba(201,230,187,.4),transparent_65%)]",
  blog: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(134,213,212,.35),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(240,206,52,.3),transparent_65%)]",
  faq: "bg-[radial-gradient(30rem_18rem_at_100%_0%,rgba(247,159,145,.35),transparent_65%),radial-gradient(28rem_18rem_at_0%_100%,rgba(249,187,217,.3),transparent_65%)]",
  local: "bg-[radial-gradient(30rem_18rem_at_0%_100%,rgba(247,159,145,.35),transparent_65%),radial-gradient(28rem_18rem_at_100%_0%,rgba(201,230,187,.35),transparent_65%)]",
  privacy: "bg-[radial-gradient(30rem_18rem_at_0%_0%,rgba(201,230,187,.35),transparent_65%),radial-gradient(28rem_18rem_at_100%_100%,rgba(134,213,212,.3),transparent_65%)]",
};

/**
 * Full-width photo banner for inner pages: tinted photo, page-specific play-school doodles,
 * centered title with a crayon squiggle under the `highlight` words, breadcrumb pill,
 * and a cloud-scalloped bottom edge. Emits BreadcrumbList structured data.
 */
export function PageBanner({ theme, eyebrow, icon: Icon = Sparkles, title, highlight, description, crumbs, image }: {
  theme: BannerTheme;
  eyebrow: string;
  icon?: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  crumbs: Crumb[];
  image: { src: string; alt: string };
}) {
  return (
    <section className="banner-scallop relative isolate overflow-hidden bg-little-green-950 text-white">
      <JsonLd data={breadcrumbSchema(crumbs)} />

      {/* Photo + brand tint */}
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover" unoptimized={!isOptimizable(image.src)} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(35,37,29,.66),rgba(35,37,29,.84))]" />
      <div aria-hidden className={`absolute inset-0 -z-10 ${GLOWS[theme]}`} />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Decorations theme={theme} />
      </div>

      {/* Content */}
      <div className="container-pad relative flex min-h-[260px] flex-col items-center justify-center pb-14 pt-10 text-center sm:min-h-[290px] lg:min-h-[320px]">
        <span className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3.5 text-[11px] font-extrabold uppercase tracking-[.2em] text-little-yellow-100 ring-1 ring-white/15 backdrop-blur-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-little-yellow-400 to-little-coral-300 text-little-green-950">
            <Icon className="h-4 w-4" strokeWidth={2.4} />
          </span>
          {eyebrow}
        </span>

        <h1 className="mt-4 max-w-4xl animate-fade-up font-display text-[clamp(1.9rem,4.6vw,3.25rem)] font-bold leading-[1.08] tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,.35)]">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="relative inline-block whitespace-nowrap text-little-yellow-400">
                {highlight}
                <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                  <path d="M2 8 C 30 2, 50 12, 80 6 S 130 2, 160 7 S 190 9, 198 4" fill="none" stroke={BRAND.coral[300]} strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </>
          )}
        </h1>

        <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-white/80 sm:text-base">{description}</p>

        <nav aria-label="Breadcrumb" className="glass-dark mt-5 inline-flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full px-4 py-1.5 text-sm font-bold text-white/70">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white"><Home className="h-3.5 w-3.5" />Home</Link>
          {crumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-1.5 whitespace-nowrap">
              <ChevronRight className="h-3.5 w-3.5 text-little-yellow-400" />
              {index === crumbs.length - 1 ? <span aria-current="page" className="text-white">{crumb.name}</span> : <Link href={crumb.path} className="hover:text-white">{crumb.name}</Link>}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
