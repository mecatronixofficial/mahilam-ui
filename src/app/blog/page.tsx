import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Newspaper, PenLine } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { getPublicResult, type BlogSummary } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

const PER_PAGE = 12;

export const metadata: Metadata = pageMetadata({
  title: "Parent Blog — Early Learning Tips & School News",
  description: "Parenting tips, early-learning ideas and news from Little Mahilam Preschool, Tiruppur — helpful reading for families of toddlers and young children.",
  path: "/blog",
  keywords: ["parenting tips Tiruppur", "preschool readiness tips", "early childhood learning blog"],
});

export const revalidate = 300;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const result = await getPublicResult<BlogSummary[]>(`/blogs?page=${page}&limit=${PER_PAGE}`);
  const posts = result.status === "ok" ? result.data : [];
  const meta = result.status === "ok" ? result.meta : undefined;
  const [featured, ...rest] = page === 1 ? posts : [undefined, ...posts];

  return (
    <PublicShell>
      <PageHero eyebrow="Parent blog" title="Stories, tips & school news." description="Ideas for joyful learning at home, updates from our classrooms and answers to the questions parents of young children ask most." crumbs={[{ name: "Blog", path: "/blog" }]} />

      <section className="py-16 md:py-20">
        <div className="container-pad">
          {result.status === "error" ? (
            <Notice icon={Newspaper} title="The blog is taking a short break." copy="We couldn't load articles right now. Please try again in a few minutes." />
          ) : posts.length === 0 ? (
            <Notice icon={PenLine} title="Our first stories are on the way." copy="We're writing helpful articles for parents. Check back soon — or visit us to see school life in person." />
          ) : (
            <>
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="glass-card group mb-8 grid overflow-hidden md:grid-cols-[1.1fr_.9fr]">
                  <div className="relative min-h-64 overflow-hidden bg-emerald-50">
                    <Image src={featured.coverImage || "/imgs/home/kid1.jpg"} alt={featured.title} fill priority sizes="(min-width: 768px) 55vw, 92vw" unoptimized={!isOptimizable(featured.coverImage || "/")} className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center p-7 md:p-10">
                    <span className="eyebrow w-fit">Latest{featured.category ? ` · ${featured.category}` : ""}</span>
                    <h2 className="mt-4 text-3xl font-bold leading-tight text-emerald-950 md:text-4xl">{featured.title}</h2>
                    {featured.excerpt && <p className="mt-4 line-clamp-3 text-lg leading-8 text-slate-600">{featured.excerpt}</p>}
                    <p className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-500"><CalendarDays className="h-4 w-4" />{formatDate(featured.publishedAt, { day: "numeric", month: "long", year: "numeric" })}{featured.author ? ` · ${featured.author}` : ""}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-bold text-emerald-800">Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.filter(Boolean).map((post) => <PostCard key={post!.id} post={post!} />)}
              </div>
              {meta && meta.pages > 1 && (
                <nav aria-label="Blog pages" className="mt-10 flex items-center justify-center gap-3">
                  {page > 1 ? <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`} rel="prev" className="btn-soft"><ChevronLeft className="h-4 w-4" />Newer</Link> : <span />}
                  <span className="text-sm font-bold text-slate-500">Page {page} of {meta.pages}</span>
                  {page < meta.pages ? <Link href={`/blog?page=${page + 1}`} rel="next" className="btn-soft">Older<ChevronRight className="h-4 w-4" /></Link> : <span />}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
      <AdmissionsCta />
    </PublicShell>
  );
}

function PostCard({ post }: { post: BlogSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="glass-card reveal group flex flex-col overflow-hidden transition hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-emerald-50">
        <Image src={post.coverImage || "/imgs/home/kid2.avif"} alt={post.title} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw" unoptimized={!isOptimizable(post.coverImage || "/")} className="object-cover transition duration-700 group-hover:scale-105" />
        {post.category && <span className="glass-chip absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold text-emerald-900">{post.category}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold leading-snug text-emerald-950">{post.title}</h2>
        {post.excerpt && <p className="mt-2 line-clamp-3 flex-1 leading-7 text-slate-600">{post.excerpt}</p>}
        <p className="mt-4 text-xs font-bold text-slate-400">{formatDate(post.publishedAt)}{post.author ? ` · ${post.author}` : ""}</p>
      </div>
    </Link>
  );
}

function Notice({ icon: Icon, title, copy }: { icon: typeof Newspaper; title: string; copy: string }) {
  return (
    <div className="glass-card mx-auto max-w-2xl p-10 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950"><Icon className="h-8 w-8" /></span>
      <h2 className="mt-5 text-2xl font-bold text-emerald-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">{copy}</p>
      <Link href="/contact" className="btn-soft mt-6">Plan a visit</Link>
    </div>
  );
}
