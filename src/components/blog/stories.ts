import type { BlogSummary } from "@/lib/server-api";
import { BRAND } from "@/lib/brand";

/** Preferred order for the categories the school writes about; any other real category follows alphabetically. */
const PREFERRED = ["parenting tips", "early learning", "school activities", "child development", "school news"];

/** Distinct categories that actually appear on published posts. */
export function categoriesOf(posts: BlogSummary[]) {
  const seen = new Map<string, string>();
  posts.forEach((p) => { const c = p.category?.trim(); if (c && !seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c); });
  return Array.from(seen.entries())
    .sort(([a], [b]) => {
      const ia = PREFERRED.indexOf(a);
      const ib = PREFERRED.indexOf(b);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return a.localeCompare(b);
    })
    .map(([, label]) => label);
}

/** Posts whose category or tags match — used to fill themed sections from real content only. */
export function postsAbout(posts: BlogSummary[], pattern: RegExp) {
  return posts.filter((p) => pattern.test(p.category ?? "") || (p.tags ?? []).some((t) => pattern.test(t)));
}

export const PARENTING = /parent/i;
export const LEARNING = /learn|develop|educat|early|activit|play|phonic|literacy|numeracy/i;

/** A steady pastel per category, so the same topic always wears the same colour. */
const PAPERS = [BRAND.yellow[200], BRAND.pink[100], BRAND.blue[100], BRAND.green[100], BRAND.coral[100]];
const INKS = [BRAND.yellow[800], BRAND.pink[700], BRAND.blue[700], BRAND.green[700], BRAND.coral[700]];
export function tone(category?: string | null) {
  let h = 0;
  for (const ch of (category ?? "story").toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const i = Math.abs(h) % PAPERS.length;
  return { paper: PAPERS[i], ink: INKS[i] };
}

export const storyHref = (slug: string) => `/blog/${slug}`;

/** /blog URL with the given filters (page 1 and empty values dropped). */
export function blogHref({ category, q, page }: { category?: string; q?: string; page?: number }) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}
