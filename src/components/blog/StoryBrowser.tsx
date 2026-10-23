"use client";
import { useEffect, useState, useTransition, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownWideNarrow, LoaderCircle, Plus, Search, X } from "lucide-react";
import { blogHref, tone } from "./stories";
import styles from "./journal.module.css";

/**
 * Filter bar + results for the Journal. Everything is a real link or GET form (works without JS and is crawlable);
 * with JS, navigation happens in a transition so the results dim and re-animate instead of reloading the page.
 */
export function StoryBrowser({ categories, category, q, total, shown, page, children }: { categories: string[]; category: string; q: string; total: number; shown: number; page: number; children: ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);

  const go = (href: string) => start(() => router.push(href, { scroll: false }));
  const follow = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    go(href);
  };

  const chips = [{ label: "All Stories", value: "" }, ...categories.map((c) => ({ label: c, value: c }))];
  const filtered = Boolean(category || q);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-3 shadow-[0_16px_30px_-26px_rgba(36,68,32,.7)] ring-1 ring-little-green-900/5 lg:flex-row lg:items-center lg:justify-between">
        {categories.length > 0 && (
          <nav aria-label="Story categories" className="hide-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 lg:flex-wrap">
            {chips.map((chip) => {
              const on = chip.value.toLowerCase() === category.toLowerCase();
              const t = tone(chip.value || undefined);
              const href = `${blogHref({ category: chip.value, q })}#stories`;
              return (
                <Link
                  key={chip.label}
                  href={href}
                  onClick={follow(href)}
                  aria-current={on ? "page" : undefined}
                  className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold transition-[background-color,color,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400 ${on ? "bg-little-green-900 text-white" : "text-little-green-950 hover:bg-little-cream-100"}`}
                  style={!on && chip.value ? { boxShadow: `inset 0 -3px 0 ${t.paper}` } : undefined}
                >
                  {chip.label}
                </Link>
              );
            })}
          </nav>
        )}

        <form
          role="search"
          action="/blog#stories"
          method="get"
          onSubmit={(e) => { e.preventDefault(); go(`${blogHref({ category, q: text.trim() })}#stories`); }}
          className="flex items-center gap-2 lg:min-w-[320px]"
        >
          {category && <input type="hidden" name="category" value={category} />}
          <label className="relative flex-1">
            <span className="sr-only">Search stories</span>
            <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-little-neutral-400" />
            <input
              type="search"
              name="q"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={100}
              placeholder="Search stories…"
              className="w-full rounded-full border-2 border-little-green-900/10 bg-little-cream py-2.5 pl-10 pr-4 text-sm font-semibold text-little-green-950 outline-none transition focus:border-little-green-700"
            />
          </label>
          <button type="submit" className="rounded-full bg-little-green-900 px-4 py-2.5 font-display text-sm font-bold text-white transition hover:bg-little-green-800 focus-visible:outline-3 focus-visible:outline-little-pink-400">Search</button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-sm font-bold text-little-neutral-500">
        <p aria-live="polite" className="inline-flex items-center gap-2">
          {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {total === 0 ? "No stories found" : `${total} ${total === 1 ? "story" : "stories"}`}
          {q && <> for “<span className="text-little-green-950">{q}</span>”</>}
          {category && <> in <span className="text-little-green-950">{category}</span></>}
          {filtered && (
            <Link href="/blog#stories" onClick={follow("/blog#stories")} className="ml-1 inline-flex items-center gap-1 rounded-full bg-little-cream-100 px-2.5 py-1 text-xs text-little-green-900 hover:bg-little-yellow-100"><X className="h-3 w-3" />Clear</Link>
          )}
        </p>
        <p className="inline-flex items-center gap-1.5"><ArrowDownWideNarrow className="h-4 w-4" />Newest first</p>
      </div>

      <div data-pending={pending ? "" : undefined} aria-busy={pending} className={`mt-5 ${styles.results}`}>
        {children}
      </div>

      {shown < total && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`${blogHref({ category, q, page: page + 1 })}#more`}
            onClick={follow(blogHref({ category, q, page: page + 1 }))}
            rel="next"
            scroll={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display font-bold text-little-green-950 shadow-[0_12px_24px_-18px_rgba(36,68,32,.8)] ring-2 ring-little-green-900/10 transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400"
          >
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Load more stories
          </Link>
        </div>
      )}
    </div>
  );
}
