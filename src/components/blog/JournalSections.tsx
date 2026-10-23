import Link from "next/link";
import { BookHeart, Lightbulb } from "lucide-react";
import type { BlogSummary } from "@/lib/server-api";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/media";
import { FlowerDoodle, HeartDoodle, StarDoodle } from "@/components/about/Doodles";
import { handwriting } from "@/components/about/fonts";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Appear } from "@/components/animations/Appear";
import { Reveal } from "@/components/animations/Reveal";
import { CtaLink, Eyebrow } from "@/components/public/PageKit";
import { journal } from "./fonts";
import { HighlightsRail } from "./HighlightsRail";
import { Cover, Kicker } from "./StoryCards";
import { storyHref } from "./stories";

/** Curved top & bottom edges in the section's own colour (the storybook "page curl"). */
function Curve({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block h-8 w-full md:h-12 ${flip ? "rotate-180" : ""}`}>
      <path d="M0 60 C 360 0 1080 0 1440 60 Z" fill={color} />
    </svg>
  );
}

/** "Parent's Corner": a warm letter-style spread — one lead story and a numbered reading list, from real parenting posts. */
export function ParentsCorner({ posts }: { posts: BlogSummary[] }) {
  const [lead, ...more] = posts;
  const bg = BRAND.coral[50];
  return (
    <section aria-labelledby="parents-corner" className="relative">
      <Curve color={bg} />
      <div className="relative overflow-hidden py-6 md:py-8" style={{ background: bg }}>
        <FlowerDoodle color={BRAND.pink[300]} className="pointer-events-none absolute left-[3%] top-6 hidden w-8 lg:block" />
        <HeartDoodle className="pointer-events-none absolute bottom-8 right-[4%] hidden w-8 lg:block" />
        <div className="container-pad relative grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <Appear x={-30} y={0}>
            <Eyebrow icon={<BookHeart className="h-4 w-4 text-little-pink-500" />}>Parent&apos;s Corner</Eyebrow>
            <h2 id="parents-corner" className={`${journal.className} mt-5 text-balance text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.05] text-little-green-950`}>
              Gentle ideas for <span className="italic text-little-coral-500">the grown-ups.</span>
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-8 text-little-neutral-600">Practical, reassuring reads for the everyday moments of raising a little one.</p>
            <p className={`${handwriting.className} mt-5 text-2xl font-bold text-little-green-800`}>Pour a cup of tea and read along ♡</p>
          </Appear>

          <div className="grid gap-5 md:grid-cols-[1.1fr_.9fr]">
            <Appear d={0.1} y={30}>
              <Link href={storyHref(lead.slug)} className="group/story block h-full overflow-hidden rounded-[30px] bg-white shadow-[0_20px_40px_-30px_rgba(36,68,32,.7)] outline-none focus-visible:ring-4 focus-visible:ring-little-pink-300">
                <Cover post={lead} sizes="(min-width: 1024px) 380px, 92vw" className="aspect-[4/3]" />
                <div className="p-5">
                  <Kicker post={lead} />
                  <h3 className={`${journal.className} mt-2 text-2xl font-bold leading-snug text-little-green-950`}>{lead.title}</h3>
                  {lead.excerpt && <p className="mt-2 line-clamp-3 text-[15px] leading-7 text-little-neutral-600">{lead.excerpt}</p>}
                </div>
              </Link>
            </Appear>
            {more.length > 0 && (
              <Reveal as="ol" variant="right" stagger={0.1} className="flex flex-col divide-y divide-little-green-950/10 rounded-[30px] bg-white/70 p-2">
                {more.slice(0, 4).map((post, i) => (
                  <li key={post.id} data-reveal-item="">
                    <Link href={storyHref(post.slug)} className="group/story flex gap-4 rounded-[22px] p-4 outline-none transition-colors hover:bg-white focus-visible:ring-4 focus-visible:ring-little-pink-300">
                      <span className={`${journal.className} text-3xl font-extrabold italic leading-none text-little-coral-400`}>{i + 2}</span>
                      <span className="min-w-0">
                        <span className={`${journal.className} block text-lg font-bold leading-snug text-little-green-950 group-hover/story:underline`}>{post.title}</span>
                        {post.publishedAt && <time dateTime={post.publishedAt} className="mt-1 block text-xs font-bold text-little-neutral-500">{formatDate(post.publishedAt)}</time>}
                      </span>
                    </Link>
                  </li>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </div>
      <Curve color={bg} flip />
    </section>
  );
}

/** "Learning Highlights": developmental and early-learning posts on a horizontal rail. */
export function LearningHighlights({ posts }: { posts: BlogSummary[] }) {
  return (
    <section aria-labelledby="learning-highlights" className="relative overflow-hidden py-6 md:py-8">
      <div className="container-pad relative">
        <Appear y={20} className="max-w-2xl">
          <Eyebrow icon={<Lightbulb className="h-4 w-4 text-little-yellow-600" />}>Learning Highlights</Eyebrow>
          <h2 id="learning-highlights" className={`${journal.className} mt-5 text-balance text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.05] text-little-green-950`}>
            How little minds <span className="italic text-little-blue-600">learn and grow.</span>
          </h2>
        </Appear>
        <div className="-mt-4"><HighlightsRail posts={posts} /></div>
      </div>
    </section>
  );
}

/** "Every Story Inspires a Little Mind.": a bookshelf whose spines hop on hover. */
export function ReadingInvite() {
  const spines = [
    { h: "h-28", c: BRAND.coral[400] }, { h: "h-36", c: BRAND.yellow[400] }, { h: "h-32", c: BRAND.blue[400] }, { h: "h-40", c: BRAND.green[400] },
    { h: "h-30", c: BRAND.pink[400] }, { h: "h-36", c: BRAND.coral[300] }, { h: "h-28", c: BRAND.blue[300] }, { h: "h-34", c: BRAND.yellow[300] },
  ];
  return (
    <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BRAND.cream.base }}>
      <div className="container-pad relative">
        <div className="relative overflow-hidden rounded-[40px] bg-little-green-50 px-5 pb-0 pt-9 text-center sm:rounded-[56px] sm:px-10">
          <StarDoodle className="pointer-events-none absolute left-[8%] top-8 w-7 animate-twinkle" />
          <StarDoodle color={BRAND.pink[300]} className="pointer-events-none absolute right-[10%] top-14 w-5 animate-twinkle [animation-delay:-1.2s]" />
          <AnimatedText className={`${journal.className} mx-auto max-w-3xl text-balance text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[1.04] text-little-green-950`}>
            Every Story Inspires a <span className="italic text-little-coral-500">Little Mind.</span>
          </AnimatedText>
          <Appear d={0.2} className="mx-auto mt-4 max-w-xl">
            <p className="text-lg leading-8 text-little-neutral-600">Curious how these ideas come alive in our classrooms? Take a peek inside.</p>
          </Appear>
          <Appear d={0.3} className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <CtaLink href="/learning-approach">Discover Our Learning Approach</CtaLink>
            <CtaLink href="/activities" tone="light">Explore Our Activities</CtaLink>
          </Appear>

          {/* Bookshelf */}
          <div aria-hidden className="relative mx-auto mt-10 max-w-2xl">
            <div className="flex items-end justify-center gap-1.5 px-6">
              {spines.map((s, i) => (
                <span key={i} className={`block w-8 rounded-t-md sm:w-10 ${s.h} transition-transform duration-300 ease-(--ease-back-strong) hover:-translate-y-3 ${i === 5 ? "origin-bottom-left rotate-[8deg]" : ""}`} style={{ background: s.c }}>
                  <span className="mx-auto mt-3 block h-1 w-5 rounded-full bg-white/60" />
                  <span className="mx-auto mt-1.5 block h-1 w-3 rounded-full bg-white/40" />
                </span>
              ))}
            </div>
            <span className="block h-4 rounded-t-lg bg-little-coral-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
