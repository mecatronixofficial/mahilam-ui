import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicResult, type BlogPost } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { readingMinutes, RichText } from "@/lib/rich-text";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

async function loadPost(slug: string) {
  const result = await getPublicResult<BlogPost>(`/blogs/${encodeURIComponent(slug)}`, 0);
  if (result.status === "not-found") notFound();
  // Outage: surface the error boundary (retryable) instead of caching a false 404.
  if (result.status === "error") throw new Error("Blog temporarily unavailable");
  return result.data;
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

  return (
    <PublicShell>
      <JsonLd data={[articleSchema(post), breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])]} />
      <article>
        <header className="relative overflow-hidden bg-[#fffaf0] py-12 md:py-16">
          <div className="container-pad max-w-3xl">
            <div className="flex items-center justify-between gap-4 border-y-4 border-double border-emerald-950 py-2">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.16em] text-emerald-900 hover:underline"><ArrowLeft className="h-3.5 w-3.5" />All articles</Link>
              <span className="font-display text-sm font-bold text-emerald-950 sm:text-base">The Little Mahilam Times</span>
            </div>
            {post.category && <p className="mt-8 w-fit bg-[#f7c85b] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.2em] text-emerald-950">{post.category}</p>}
            <h1 className="mt-4 animate-fade-up font-display text-4xl font-bold leading-[1.08] text-emerald-950 md:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 border-l-4 border-[#e2725b] pl-4 text-xl leading-8 text-slate-600">{post.excerpt}</p>}
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-slate-500">
              {post.author && <span className="flex items-center gap-1.5"><UserRound className="h-4 w-4" />{post.author}</span>}
              {post.publishedAt && <time dateTime={post.publishedAt} className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</time>}
              <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{readingMinutes(post.content)} min read</span>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="container-pad -mt-4 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden border-[10px] border-white shadow-2xl shadow-emerald-950/15">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 1024px) 896px, 92vw" unoptimized={!isOptimizable(post.coverImage)} className="object-cover" />
            </div>
          </div>
        )}

        <div className="container-pad max-w-3xl py-12 md:py-16">
          <div className="relative bg-white p-6 shadow-[0_24px_50px_-30px_rgba(23,60,47,.45)] md:p-10">
            <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-2 bg-[#a7d9c1]/80" />
            <RichText text={post.content} />
          </div>
          {!!post.tags?.length && (
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag, i) => <li key={tag} className="rounded-full px-3 py-1.5 text-sm font-bold text-emerald-950" style={{ backgroundColor: ["#fde9b8", "#dcefe5", "#fbd9cf", "#dbe8f7"][i % 4] }}>#{tag}</li>)}
            </ul>
          )}
        </div>
      </article>
      <AdmissionsCta title="Like what you read? Come visit us." />
    </PublicShell>
  );
}
