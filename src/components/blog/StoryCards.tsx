import type { CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import type { BlogSummary } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";
import { journal } from "./fonts";
import { PaperCover } from "./JournalArt";
import { storyHref, tone } from "./stories";

/** Cover photo, or a coloured paper page when the post has none. */
export function Cover({ post, sizes, className = "", priority }: { post: BlogSummary; sizes: string; className?: string; priority?: boolean }) {
  const t = tone(post.category);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {post.coverImage
        ? <Image src={post.coverImage} alt="" fill priority={priority} sizes={sizes} unoptimized={!isOptimizable(post.coverImage)} className="object-cover transition-transform duration-700 ease-out group-hover/story:scale-106" />
        : <PaperCover label={post.category} paper={t.paper} ink={t.ink} />}
    </div>
  );
}

export function Kicker({ post, className = "" }: { post: BlogSummary; className?: string }) {
  const t = tone(post.category);
  const date = formatDate(post.publishedAt, { day: "numeric", month: "short", year: "numeric" });
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-extrabold uppercase tracking-[.18em] ${className}`}>
      {post.category && <span className="rounded-sm px-1.5 py-0.5" style={{ background: t.paper, color: t.ink }}>{post.category}</span>}
      {date && <time dateTime={post.publishedAt ?? undefined} className="text-little-neutral-500">{date}</time>}
    </p>
  );
}

function ReadMore({ light = false }: { light?: boolean }) {
  return (
    <span className={`mt-4 inline-flex items-center gap-1 font-display text-sm font-bold ${light ? "text-white" : "text-little-coral-600"}`}>
      Read more <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/story:-translate-y-0.5 group-hover/story:translate-x-0.5" />
    </span>
  );
}

const base = "group/story relative flex h-full animate-fade-up outline-none focus-visible:ring-4 focus-visible:ring-little-pink-300 motion-reduce:animate-none";
const delay = (i: number) => ({ animationDelay: `${(i % 6) * 60}ms` }) as CSSProperties;

/** Big image-led spread: photo with the title set on a paper strip across its foot. */
export function SpreadCard({ post, i = 0 }: { post: BlogSummary; i?: number }) {
  return (
    <Link href={storyHref(post.slug)} className={`${base} min-h-[380px] flex-col justify-end overflow-hidden rounded-[30px] bg-little-cream-100`} style={delay(i)}>
      <Cover post={post} sizes="(min-width: 1024px) 66vw, 92vw" className="absolute inset-0" />
      <div className="relative m-3 rounded-[24px] bg-white/95 p-5 shadow-lg backdrop-blur sm:m-5 sm:max-w-[80%] sm:p-6">
        <Kicker post={post} />
        <h3 className={`${journal.className} mt-2 text-2xl font-bold leading-[1.15] text-little-green-950 sm:text-3xl`}>{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-little-neutral-600">{post.excerpt}</p>}
        <ReadMore />
      </div>
    </Link>
  );
}

/** Compact horizontal card: square thumbnail beside the words. */
export function CompactCard({ post, i = 0 }: { post: BlogSummary; i?: number }) {
  return (
    <Link href={storyHref(post.slug)} className={`${base} items-start gap-4 rounded-[24px] bg-white p-3 pr-4 shadow-[0_14px_28px_-24px_rgba(36,68,32,.7)] ring-1 ring-little-green-900/5`} style={delay(i)}>
      <Cover post={post} sizes="120px" className="aspect-square w-24 shrink-0 rounded-[18px] sm:w-28" />
      <div className="min-w-0 py-1">
        <Kicker post={post} />
        <h3 className={`${journal.className} mt-1.5 line-clamp-3 text-lg font-bold leading-snug text-little-green-950`}>{post.title}</h3>
        <ReadMore />
      </div>
    </Link>
  );
}

/** Quote-style card: the post's own excerpt set as a pull quote on coloured paper. */
export function QuoteCard({ post, i = 0 }: { post: BlogSummary; i?: number }) {
  const t = tone(post.category);
  return (
    <Link href={storyHref(post.slug)} className={`${base} flex-col justify-between rounded-[30px] p-6 sm:p-7`} style={{ ...delay(i), background: t.paper }}>
      <Quote aria-hidden className="h-10 w-10 opacity-60" style={{ color: t.ink }} />
      <p className={`${journal.className} mt-3 line-clamp-6 text-xl font-semibold italic leading-relaxed text-little-green-950`}>{post.excerpt}</p>
      <div className="mt-5 border-t border-little-green-950/15 pt-4">
        <Kicker post={post} />
        <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-little-green-950">{post.title}</h3>
        <ReadMore />
      </div>
    </Link>
  );
}

/** Image-led portrait card with a slight tilt that straightens on hover. */
export function TallCard({ post, i = 0 }: { post: BlogSummary; i?: number }) {
  return (
    <Link href={storyHref(post.slug)} className={`${base} flex-col rounded-[30px] bg-white p-3 shadow-[0_18px_34px_-28px_rgba(36,68,32,.7)] ring-1 ring-little-green-900/5 transition-[rotate] duration-500 hover:rotate-0 ${i % 2 ? "rotate-[.6deg]" : "-rotate-[.6deg]"}`} style={delay(i)}>
      <Cover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 92vw" className="aspect-[4/3.4] rounded-[22px]" />
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <Kicker post={post} />
        <h3 className={`${journal.className} mt-2 text-xl font-bold leading-snug text-little-green-950`}>{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-7 text-little-neutral-600">{post.excerpt}</p>}
        <ReadMore />
      </div>
    </Link>
  );
}

/** The storybook grid's rhythm: spread, quote, tall, compact pair, tall … (quote falls back to tall without an excerpt). */
export function StoryGrid({ posts }: { posts: BlogSummary[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => {
        const slot = i % 6;
        if (slot === 0) return <li key={post.id} className="md:col-span-2"><SpreadCard post={post} i={i} /></li>;
        if (slot === 1 && post.excerpt) return <li key={post.id}><QuoteCard post={post} i={i} /></li>;
        if (slot === 3 || slot === 4) return <li key={post.id}><CompactCard post={post} i={i} /></li>;
        return <li key={post.id}><TallCard post={post} i={i} /></li>;
      })}
    </ul>
  );
}
