import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Newspaper, PenLine } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageBanner } from "@/components/public/PageBanner";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { getPublicResult, type BlogSummary } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";
import { localImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const PER_PAGE = 12;
const TINTS = ["#f7c85b", "#a7d9c1", "#ef9e8a", "#8cb9e8", "#c4b5fd"];

export const metadata: Metadata = pageMetadata({
  title: "Parent Blog — Early Learning Tips & School News",
  description: "Parenting tips, early-learning ideas and news from Little Mahilam Preschool, Tiruppur — helpful reading for families of toddlers and young children.",
  path: "/blog",
  keywords: ["parenting tips Tiruppur", "preschool readiness tips", "early childhood learning blog"],
});

export const revalidate = 0;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const result = await getPublicResult<BlogSummary[]>(`/blogs?page=${page}&limit=${PER_PAGE}`, 0);
  const posts = result.status === "ok" ? result.data : [];
  const meta = result.status === "ok" ? result.meta : undefined;
  const [featured, ...rest] = page === 1 ? posts : [undefined, ...posts];
  const today = formatDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <PublicShell>
      <PageBanner
        theme="blog"
        eyebrow="Parent blog"
        icon={BookOpen}
        title="Stories, tips &"
        highlight="school news."
        description="Ideas for joyful learning at home, updates from our classrooms and answers to the questions parents of young children ask most."
        crumbs={[{ name: "Blog", path: "/blog" }]}
        image={{ src: localImage("/images/banners/blog.webp", 1), alt: "Children reading stories at Little Mahilam Preschool" }}
      />

      <section className="py-14 md:py-20">
        <div className="container-pad">
          {/* Newspaper masthead */}
          <header className="mx-auto max-w-5xl border-y-4 border-double border-emerald-950 py-4 text-center">
            <p className="font-display text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">The Little Mahilam Times</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-extrabold uppercase tracking-[.2em] text-slate-500">
              <span>{today}</span>
              <span aria-hidden>•</span>
              <span>Tiruppur edition</span>
              <span aria-hidden>•</span>
              <span>For curious parents</span>
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-5xl">
            {result.status === "error" ? (
              <Notice icon={Newspaper} title="The blog is taking a short break." copy="We couldn't load articles right now. Please try again in a few minutes." />
            ) : posts.length === 0 ? (
              <Notice icon={PenLine} title="Our first stories are on the way." copy="We're writing helpful articles for parents. Check back soon — or visit us to see school life in person." />
            ) : (
              <>
                {featured && (
                  <Link href={`/blog/${featured.slug}`} className="group mb-12 grid gap-8 border-b-2 border-emerald-950/10 pb-12 md:grid-cols-[1.15fr_.85fr]">
                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-[#e2725b] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.2em] text-white">Front page{featured.category ? ` · ${featured.category}` : ""}</span>
                      <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] text-emerald-950 transition group-hover:text-emerald-800 md:text-5xl">{featured.title}</h2>
                      <p className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500">
                        <CalendarDays className="h-4 w-4" />{formatDate(featured.publishedAt, { day: "numeric", month: "long", year: "numeric" })}{featured.author ? ` · By ${featured.author}` : ""}
                      </p>
                      {featured.excerpt && (
                        <p className="mt-5 text-lg leading-8 text-slate-600 first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[.85] first-letter:text-[#e2725b]">{featured.excerpt}</p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-1.5 font-extrabold text-emerald-800">Continue reading <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                    </div>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50 grayscale-[15%] transition group-hover:grayscale-0 md:aspect-[4/5]">
                        <Image src={featured.coverImage || "/imgs/home/kid1.jpg"} alt={featured.title} fill priority sizes="(min-width: 768px) 40vw, 92vw" unoptimized={!isOptimizable(featured.coverImage || "/")} className="object-cover transition duration-700 group-hover:scale-105" />
                      </div>
                      <figcaption className="mt-2 border-l-4 border-[#f7c85b] pl-3 text-xs font-bold italic text-slate-500">From our classrooms in Tiruppur</figcaption>
                    </figure>
                  </Link>
                )}

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.filter(Boolean).map((post, i) => <PostCard key={post!.id} post={post!} tint={TINTS[i % TINTS.length]} />)}
                </div>

                {meta && meta.pages > 1 && (
                  <nav aria-label="Blog pages" className="mt-12 flex items-center justify-center gap-3">
                    {page > 1 ? <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`} rel="prev" className="btn-soft"><ChevronLeft className="h-4 w-4" />Newer</Link> : <span />}
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">Page {page} of {meta.pages}</span>
                    {page < meta.pages ? <Link href={`/blog?page=${page + 1}`} rel="next" className="btn-soft">Older<ChevronRight className="h-4 w-4" /></Link> : <span />}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </PublicShell>
  );
}

/** Article card with a folded top-right corner. */
function PostCard({ post, tint }: { post: BlogSummary; tint: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative flex flex-col bg-white shadow-[0_18px_36px_-26px_rgba(23,60,47,.5)] transition hover:-translate-y-1" style={{ clipPath: "polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)" }}>
      <span aria-hidden className="absolute right-0 top-0 h-[34px] w-[34px]" style={{ background: `linear-gradient(225deg, transparent 50%, ${tint} 50%)` }} />
      <div className="relative m-3 mb-0 h-44 overflow-hidden bg-emerald-50">
        <Image src={post.coverImage || "/imgs/home/kid2.avif"} alt={post.title} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw" unoptimized={!isOptimizable(post.coverImage || "/")} className="object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6 pt-5">
        {post.category && <span className="w-fit px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[.2em] text-emerald-950" style={{ backgroundColor: tint }}>{post.category}</span>}
        <h2 className="mt-3 font-display text-xl font-bold leading-snug text-emerald-950">{post.title}</h2>
        {post.excerpt && <p className="mt-2 line-clamp-3 flex-1 leading-7 text-slate-600">{post.excerpt}</p>}
        <p className="mt-4 border-t border-dashed border-emerald-950/15 pt-3 text-xs font-bold text-slate-400">{formatDate(post.publishedAt)}{post.author ? ` · ${post.author}` : ""}</p>
      </div>
    </Link>
  );
}

function Notice({ icon: Icon, title, copy }: { icon: typeof Newspaper; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-2xl border-2 border-dashed border-emerald-950/20 bg-white p-10 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950"><Icon className="h-8 w-8" /></span>
      <h2 className="mt-5 font-display text-2xl font-bold text-emerald-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">{copy}</p>
      <Link href="/contact" className="btn-soft mt-6">Plan a visit</Link>
    </div>
  );
}
