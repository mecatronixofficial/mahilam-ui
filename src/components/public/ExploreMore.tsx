import { contentText, type SectionContent } from "@/lib/page-content";
import Link from "next/link";
import { ArrowRight, Brain, Building2, CalendarDays, Images } from "lucide-react";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";
import { MarkedWord, Shape, PALETTE, TONES, type ShapeName } from "./PlayShapes";
import { BRAND } from "@/lib/brand";

const ITEMS = [
  ["/learning-approach", Brain, "Learning Approach", "How we make learning joyful and meaningful.", BRAND.green[700]],
  ["/facilities", Building2, "Facilities", "Classrooms, play areas and child-friendly spaces.", BRAND.yellow[600]],
  ["/gallery", Images, "Gallery", "Moments of learning, celebration and discovery.", BRAND.coral[400]],
  ["/events", CalendarDays, "Events", "Celebrations, performances and special days.", BRAND.green[700]],
] as const;

const TILE_SHAPES: ShapeName[] = ["cloud", "burst", "heart", "sun"];

export function ExploreMore({ variant = "default", content }: { content?: SectionContent; variant?: "default" | "playful" }) {
  if (variant === "playful") return <ExploreMorePlayful content={content} />;
  return (
    <section className="section-tint py-16">
      <div className="container-pad">
        <span className="eyebrow">{contentText(content, "eyebrow") || "Discover more"}</span>
        <h2 className="section-title mt-4 text-little-green-950">{contentText(content, "heading") || "Life at Little Mahilam."}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([href, Icon, title, desc, tint]) => (
            <Link key={href} href={href} className="glass-card reveal group p-6 transition-transform hover:-translate-y-1">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: `${tint}1f`, color: tint }}><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-bold text-little-green-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-little-neutral-500">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-little-green-800">Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Homepage version: pastel tiles rise in with their own lean; the corner shapes then drop into place. */
function ExploreMorePlayful({ content }: { content?: SectionContent }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-pad">
        <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.sun } as React.CSSProperties}>{contentText(content, "eyebrow") || "Discover more"}</Reveal>
        <AnimatedText className="lm-title mt-4">{contentText(content, "heading") || <>Life at Little <MarkedWord shape="burst" color={PALETTE.leaf} rotate={10}>Mahilam.</MarkedWord></>}</AnimatedText>
        <Reveal variant="cards" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([href, Icon, title, desc], i) => {
            const tone = TONES[i % TONES.length];
            return (
              <Link key={href} href={href} data-reveal-item className="lm-card group relative flex min-h-75 flex-col overflow-hidden p-7" style={{ "--bg": tone.bg, "--bg-hover": tone.hover, "--lift": `${6 + (i % 3) * 2}px`, "--tilt": `${i % 2 ? 0.7 : -0.7}deg` } as React.CSSProperties}>
                <span data-drop className="absolute -bottom-16 -right-14 w-36">
                  <Shape name={TILE_SHAPES[i]} color={tone.shape} className="w-full transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-12" />
                </span>
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-little-green-900"><Icon className="h-6 w-6" /></span>
                <h3 className="relative mt-6 text-2xl font-extrabold tracking-tight">{title}</h3>
                <p className="relative mt-2 max-w-[16rem] leading-7 text-little-green-900/75">{desc}</p>
                <span className="lm-link relative mt-auto w-fit pt-6 text-sm">Learn more <ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
