import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, PenLine } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicResult, type BlogSummary } from "@/lib/server-api";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

import { Wave } from "@/components/about/Doodles";
import { Appear } from "@/components/animations/Appear";
import { journal } from "@/components/blog/fonts";
import { FeaturedStory, JournalHero } from "@/components/blog/JournalHero";
import { LearningHighlights, ParentsCorner, ReadingInvite } from "@/components/blog/JournalSections";
import { StoryBrowser } from "@/components/blog/StoryBrowser";
import { StoryGrid } from "@/components/blog/StoryCards";
import { categoriesOf, LEARNING, PARENTING, postsAbout } from "@/components/blog/stories";

const PER_PAGE = 9;
/** Enough recent posts to find real categories and fill the themed sections. */
const RECENT = 100;

export const revalidate = 0;

type Search = { page?: string; category?: string; q?: string };
type Props = { searchParams: Promise<Search> };

function readParams(params: Search) {
  return {
    page: Math.min(Math.max(1, Number(params.page) || 1), 20),
    category: (params.category ?? "").trim().slice(0, 60),
    q: (params.q ?? "").trim().slice(0, 100),
  };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, q, page } = readParams(await searchParams);
  const meta = pageMetadata({
    title: "Parent Blog — Early Learning Tips & School News",
    description: "Parenting tips, early-learning ideas and news from Little Mahilam Preschool, Tiruppur — helpful reading for families of toddlers and young children.",
    path: "/blog",
    keywords: ["parenting tips Tiruppur", "preschool readiness tips", "early childhood learning blog"],
    // Search results and deeper "load more" views are not separate pages for search engines.
    noindex: Boolean(q) || page > 1,
  });
  return category && !q ? { ...meta, alternates: { canonical: `/blog?category=${encodeURIComponent(category)}` } } : meta;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page, category, q } = readParams(await searchParams);
  const filtered = Boolean(category || q);

  const recent = await getPublicResult<BlogSummary[]>(`/blogs?page=1&limit=${RECENT}`, 0);
  const recentPosts = recent.status === "ok" ? recent.data : [];
  const featured = !filtered ? recentPosts[0] : undefined;

  // The grid: filtered results from the API, or everything after the featured story. "Load more" widens the window.
  const params = new URLSearchParams({ page: "1", limit: String(Math.min(PER_PAGE * page + (featured ? 1 : 0), 200)) });
  if (category) params.set("category", category);
  if (q) params.set("search", q);
  const skip = featured ? 1 : 0;
  const ownRequest = filtered || PER_PAGE * page + skip > RECENT;
  const list = ownRequest ? await getPublicResult<BlogSummary[]>(`/blogs?${params}`, 0) : recent;
  const listPosts = list.status === "ok" ? list.data.slice(skip, skip + PER_PAGE * page) : [];
  const total = list.status === "ok" ? Math.max((list.meta?.total ?? list.data.length) - skip, 0) : 0;

  const categories = categoriesOf(recentPosts);
  const parenting = postsAbout(recentPosts, PARENTING);
  const learning = postsAbout(recentPosts, LEARNING).slice(0, 10);
  const error = recent.status === "error" || list.status === "error";

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />
      <div className="overflow-x-clip">
        <JournalHero categories={categories} nextBg={BRAND.yellow[50]} />

        {featured && (
          <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BRAND.yellow[50] }}>
            <div className="container-pad relative"><FeaturedStory post={featured} /></div>
            <Wave color={BRAND.cream.base} flip className="absolute inset-x-0 bottom-0 h-6" />
          </section>
        )}

        <section id="stories" className="relative scroll-mt-24 pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BRAND.cream.base }}>
          <div className="container-pad relative">
            <Appear y={20} className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 className={`${journal.className} text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.05] text-little-green-950`}>
                Explore our <span className="italic text-little-green-700">stories.</span>
              </h2>
            </Appear>

            {error ? (
              <Notice icon={Newspaper} title="The journal is taking a short nap." copy="We couldn't load stories right now. Please try again in a few minutes." />
            ) : recentPosts.length === 0 ? (
              <Notice icon={PenLine} title="Our first stories are being written." copy="Our teachers are putting together helpful reads for parents. Check back soon — or come and see school life in person." />
            ) : (
              <StoryBrowser categories={categories} category={category} q={q} total={total} shown={listPosts.length} page={page}>
                {listPosts.length > 0 ? (
                  <div id="more"><StoryGrid posts={listPosts} /></div>
                ) : (
                  <Notice icon={PenLine} title="No stories match yet." copy="Try another word or topic — or browse all our stories." small />
                )}
              </StoryBrowser>
            )}
          </div>
        </section>

        {!filtered && parenting.length > 0 && <ParentsCorner posts={parenting} />}
        {!filtered && learning.length > 0 && <LearningHighlights posts={learning} />}
        <ReadingInvite />
      </div>
    </PublicShell>
  );
}

function Notice({ icon: Icon, title, copy, small = false }: { icon: typeof Newspaper; title: string; copy: string; small?: boolean }) {
  return (
    <div className={`mx-auto max-w-2xl rounded-[36px] border-2 border-dashed border-little-green-950/15 bg-white text-center ${small ? "p-8" : "p-10"}`}>
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-little-yellow-200 text-little-green-950"><Icon className="h-8 w-8" /></span>
      <h3 className={`${journal.className} mt-5 text-2xl font-bold text-little-green-950`}>{title}</h3>
      <p className="mx-auto mt-2 max-w-md leading-7 text-little-neutral-600">{copy}</p>
      {small
        ? <Link href="/blog#stories" className="mt-5 inline-block font-display font-bold text-little-coral-600 underline decoration-2 underline-offset-4">See all stories</Link>
        : <Link href="/contact" className="mt-5 inline-block font-display font-bold text-little-coral-600 underline decoration-2 underline-offset-4">Plan a visit</Link>}
    </div>
  );
}
