import Link from "next/link";
import { ArrowDown, CalendarDays, UserRound } from "lucide-react";
import type { BlogSummary } from "@/lib/server-api";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/media";
import { FlowerDoodle, HeartDoodle, PencilDoodle, StarDoodle, Wave } from "@/components/about/Doodles";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Appear } from "@/components/animations/Appear";
import { Float } from "@/components/animations/FloatingShape";
import { fx } from "@/components/animations/fx";
import { CtaLink } from "@/components/public/PageKit";
import { journal } from "./fonts";
import { ReadingChild, Storybook, TORN } from "./JournalArt";
import { Cover } from "./StoryCards";
import { blogHref, storyHref, tone } from "./stories";
import styles from "./journal.module.css";

const rise = (d: number) => fx({ y: 24, d, dur: 0.9, ease: "spring" });

/** Magazine cover: masthead, big serif headline, real "inside" topics, and a storybook cover illustration on torn paper. */
export function JournalHero({ categories, nextBg }: { categories: string[]; nextBg: string }) {
  return (
    <section className="relative overflow-hidden" style={{ background: BRAND.cream.base }}>
      <div data-in="" className="container-pad relative grid items-center gap-8 pb-12 pt-6 lg:grid-cols-[1.12fr_.88fr] lg:gap-10 lg:pb-14 lg:pt-8">
        <div className="relative z-10">
          {/* Masthead */}
          <div style={rise(0)} className="fx flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-y-[3px] border-double border-little-green-950/80 py-2">
            <span className={`${journal.className} text-xl font-bold italic text-little-green-950 sm:text-2xl`}>The Little Mahilam Journal</span>
            <span className="text-[11px] font-extrabold uppercase tracking-[.2em] text-little-neutral-500">For curious families · Tiruppur</span>
          </div>

          <AnimatedText as="h1" trigger="load" delay={0.1} className={`${journal.className} mt-6 text-balance text-[clamp(2.9rem,7.6vw,6.2rem)] font-extrabold leading-[.95] tracking-[-.03em] text-little-green-950`}>
            Little Stories. <span className="italic text-little-coral-500">Big</span> <span className="italic text-little-coral-500">Discoveries.</span>
          </AnimatedText>

          <p style={rise(0.45)} className="fx mt-5 max-w-xl text-lg leading-8 text-little-neutral-700 sm:text-xl">
            A happy corner filled with parenting ideas, playful learning tips, and wonderful childhood moments.
          </p>

          {categories.length > 0 && (
            <nav aria-label="Topics in the journal" style={rise(0.55)} className="fx mt-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-little-neutral-500">Inside this journal</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((c) => {
                  const t = tone(c);
                  return (
                    <li key={c}>
                      <Link href={`${blogHref({ category: c })}#stories`} className="inline-block rounded-md px-2.5 py-1 text-sm font-extrabold transition-[translate,rotate] duration-300 hover:-translate-y-0.5 hover:-rotate-2 focus-visible:outline-3 focus-visible:outline-little-pink-400" style={{ background: t.paper, color: t.ink }}>{c}</Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div style={rise(0.65)} className="fx mt-7">
            <CtaLink href="#stories">Start Reading</CtaLink>
          </div>
        </div>

        {/* Cover art */}
        <div className="relative mx-auto w-full max-w-[460px]">
          <span aria-hidden style={{ ...TORN, ...fx({ r: -12, s: 0.9, d: 0.1, dur: 1 }) }} className="fx absolute inset-[4%_-4%_-2%_8%] rotate-6 bg-little-pink-100" />
          <span aria-hidden style={{ ...TORN, ...fx({ r: 10, s: 0.9, d: 0.2, dur: 1 }) }} className="fx absolute inset-[-3%_8%_6%_-5%] -rotate-3 bg-little-yellow-100" />
          <div style={{ ...TORN, ...fx({ y: 50, r: 4, d: 0.3, dur: 1, ease: "spring" }) }} className={`fx relative rotate-1 bg-white px-7 pb-8 pt-10 ${styles.lined}`}>
            <span aria-hidden className="absolute bottom-0 left-10 top-0 w-0.5 bg-little-pink-300/60" />
            <p className={`${journal.className} relative pl-6 text-sm font-bold italic text-little-coral-600`}>Once upon a school day…</p>
            <Storybook className="relative mx-auto mt-4 w-[86%]" />
            <ReadingChild className="relative mx-auto -mt-6 w-[46%]" />
          </div>
          <Float className="absolute -left-6 top-[12%] w-24" amp={8} rotate={-32}><PencilDoodle className="w-full" /></Float>
          <Float className="absolute -right-3 top-[44%] w-9" amp={10} duration={6}><FlowerDoodle color={BRAND.pink[300]} className="w-full" /></Float>
          <Float className="absolute bottom-[8%] left-[-4%] w-8" amp={7}><HeartDoodle className="w-full" /></Float>
          <StarDoodle className="pointer-events-none absolute -top-3 right-[18%] w-8 animate-twinkle" />
          <StarDoodle color={BRAND.blue[300]} className="pointer-events-none absolute bottom-[24%] right-[-2%] w-5 animate-twinkle [animation-delay:-1.4s]" />
        </div>

        <a href="#stories" aria-label="Skip to the stories" className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-little-green-900/50 lg:block"><ArrowDown className="h-5 w-5 animate-bounce" /></a>
      </div>
      <Wave color={nextBg} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}

/** Full-width featured story: torn-paper photo spread with the latest real post. */
export function FeaturedStory({ post }: { post: BlogSummary }) {
  const t = tone(post.category);
  const date = formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" });
  return (
    <article className="group/story relative grid items-center gap-6 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
      <Appear y={40} r={-2} dur={1} className="relative">
        <span aria-hidden style={TORN} className="absolute inset-[3%_-2%_-3%_3%] rotate-2" >
          <span className="block h-full w-full" style={{ background: t.paper }} />
        </span>
        <Link href={storyHref(post.slug)} tabIndex={-1} aria-hidden style={TORN} className="relative block -rotate-1 bg-white p-3">
          <Cover post={post} priority sizes="(min-width: 1024px) 680px, 92vw" className="aspect-[16/10.5]" />
        </Link>
        <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-little-yellow-300/80" />
      </Appear>

      <Appear d={0.15} x={40} y={0} className="relative">
        <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-little-coral-600">Featured story{post.category ? <span style={{ color: t.ink }}> · {post.category}</span> : null}</p>
        <h2 className={`${journal.className} mt-3 text-balance text-[clamp(2rem,4.2vw,3.4rem)] font-extrabold leading-[1.04] text-little-green-950`}>
          <Link href={storyHref(post.slug)} className="outline-none transition-colors hover:text-little-green-800 focus-visible:underline">{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="mt-4 text-lg leading-8 text-little-neutral-700 first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:font-bold first-letter:leading-[.85] first-letter:text-little-coral-500">{post.excerpt}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-little-neutral-500">
          {date && <time dateTime={post.publishedAt ?? undefined} className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{date}</time>}
          {post.author && <span className="inline-flex items-center gap-1.5"><UserRound className="h-4 w-4" />{post.author}</span>}
        </div>
        <div className="mt-6"><CtaLink href={storyHref(post.slug)} tone="pink">Read Story</CtaLink></div>
      </Appear>
    </article>
  );
}
