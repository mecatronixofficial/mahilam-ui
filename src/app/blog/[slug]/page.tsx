import type { Metadata } from "next";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ChevronRight, Clock3, UserRound } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicResult, type BlogPost, type BlogSummary } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { readingMinutes, RichText } from "@/lib/rich-text";
import { SITE_URL } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import { journal } from "@/components/blog/fonts";
import { TORN } from "@/components/blog/JournalArt";
import { ShareBar } from "@/components/blog/ShareBar";
import { TallCard } from "@/components/blog/StoryCards";
import { blogHref, tone } from "@/components/blog/stories";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

async function loadPost(slug: string) {
  const result = await getPublicResult<BlogPost>(`/blogs/${encodeURIComponent(slug)}`, 0);
  if (result.status === "not-found") notFound();
  // Outage: surface the error boundary (retryable) instead of caching a false 404.
  if (result.status === "error") throw new Error("Blog temporarily unavailable");
  return result.data;
}

/** Up to three other real posts: same category first, then the latest. */
async function related(post: BlogPost): Promise<BlogSummary[]> {
  const sameTopic = post.category ? await getPublicResult<BlogSummary[]>(`/blogs?page=1&limit=6&category=${encodeURIComponent(post.category)}`, 0) : null;
  const latest = await getPublicResult<BlogSummary[]>("/blogs?page=1&limit=6", 0);
  const pool = [...(sameTopic?.status === "ok" ? sameTopic.data : []), ...(latest.status === "ok" ? latest.data : [])];
  const seen = new Set([post.slug]);
  return pool.filter((p) => !seen.has(p.slug) && seen.add(p.slug)).slice(0, 3);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicResult<BlogPost>(`/blogs/${encodeURIComponent(slug)}`, 0);
  if (result.status !== "ok") return { title: "Blog", robots: { index: false, follow: true } };
  const post = result.data;
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || `${post.title} — from the Little Mahilam Preschool blog, Tiruppur.`,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    keywords: [...(post.tags || []), ...(post.category ? [post.category] : [])],
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await loadPost((await params).slug);
  const more = await related(post);
  const t = tone(post.category);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <PublicShell>
      <JsonLd data={[articleSchema(post), breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])]} />
      <article className="overflow-x-clip">
        <header className="relative overflow-hidden pb-10 pt-6 md:pb-14 md:pt-8" style={{ background: BRAND.cream.base }}>
          <span aria-hidden style={TORN} className="absolute -right-16 top-10 hidden h-72 w-72 rotate-12 lg:block"><span className="block h-full w-full" style={{ background: t.paper }} /></span>
          <div className="container-pad relative max-w-3xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.16em] text-little-neutral-500">
              <Link href="/" className="hover:text-little-green-900">Home</Link>
              <ChevronRight aria-hidden className="h-3.5 w-3.5" />
              <Link href="/blog" className="hover:text-little-green-900">Journal</Link>
              {post.category && (<><ChevronRight aria-hidden className="h-3.5 w-3.5" /><Link href={`${blogHref({ category: post.category })}#stories`} className="hover:text-little-green-900">{post.category}</Link></>)}
            </nav>

            {post.category && <p className="mt-6 w-fit rounded-md px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.2em]" style={{ background: t.paper, color: t.ink }}>{post.category}</p>}
            <h1 className={`${journal.className} mt-4 animate-fade-up text-balance text-[clamp(2.3rem,5.6vw,4rem)] font-extrabold leading-[1.04] text-little-green-950 motion-reduce:animate-none`}>{post.title}</h1>
            {post.excerpt && <p className={`${journal.className} mt-5 text-xl font-semibold italic leading-8 text-little-neutral-600`}>{post.excerpt}</p>}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-dashed border-little-green-950/15 py-3 text-sm font-bold text-little-neutral-500">
              {post.author && <span className="flex items-center gap-1.5"><UserRound className="h-4 w-4" />{post.author}</span>}
              {post.publishedAt && <time dateTime={post.publishedAt} className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</time>}
              <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{readingMinutes(post.content)} min read</span>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="container-pad -mt-4 max-w-4xl">
            <div style={TORN} className="relative aspect-[16/9] bg-white p-2.5 shadow-2xl shadow-little-green-950/15">
              <div className="relative h-full w-full overflow-hidden">
                <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 1024px) 896px, 92vw" unoptimized={!isOptimizable(post.coverImage)} className="object-cover" />
              </div>
            </div>
          </div>
        )}

        <div className="container-pad max-w-3xl py-10 md:py-12">
          <div className={`relative bg-white p-6 shadow-[0_24px_50px_-30px_rgba(36,68,32,.45)] md:p-10`} style={{ borderRadius: "6px 28px 28px 6px" }}>
            <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-2 bg-little-green-200/80" />
            <div className="text-[17px] leading-8">
              <RichText text={post.content} />
            </div>
          </div>

          {!!post.tags?.length && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag, i) => <li key={tag} className="rounded-full px-3 py-1.5 text-sm font-bold text-little-green-950" style={{ backgroundColor: [BRAND.yellow[100], BRAND.green[100], BRAND.coral[100], BRAND.blue[100]][i % 4] }}>#{tag}</li>)}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-dashed border-little-green-950/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <ShareBar url={url} title={post.title} />
            <Link href="/blog" className="inline-flex items-center gap-1.5 font-display font-bold text-little-green-900 hover:underline"><ArrowLeft className="h-4 w-4" />Back to the journal</Link>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-stories" className="pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BRAND.yellow[50] }}>
          <div className="container-pad">
            <h2 id="more-stories" className={`${journal.className} text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-little-green-950`}>More stories <span className="italic text-little-coral-500">you may enjoy</span></h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p, i) => <li key={p.id}><TallCard post={p} i={i} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <AdmissionsCta title="Like what you read? Come visit us." />
    </PublicShell>
  );
}
