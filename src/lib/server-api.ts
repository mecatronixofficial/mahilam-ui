/**
 * Server-side reads of public CMS content. Pages render this data into HTML
 * (good for SEO and first paint) and refresh it in the background via ISR.
 * A backend outage never fails a render: callers get `null` and show fallbacks.
 */

const SERVER_API_URL = process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const REVALIDATE_SECONDS = 300;

export async function getPublic<T>(path: string, revalidate = REVALIDATE_SECONDS): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/cms/public${path}`, {
      next: { revalidate, tags: ["cms"] },
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as { data?: T };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export type PublicResult<T> = { status: "ok"; data: T; meta?: PageMeta } | { status: "not-found" } | { status: "error" };
export type PageMeta = { page: number; limit: number; total: number; pages: number };

/** Like getPublic, but tells "doesn't exist" (404) apart from "API unavailable", so outages never become cached 404s. */
export async function getPublicResult<T>(path: string, revalidate = REVALIDATE_SECONDS): Promise<PublicResult<T>> {
  try {
    const res = await fetch(`${SERVER_API_URL}/cms/public${path}`, { next: { revalidate, tags: ["cms"] }, signal: AbortSignal.timeout(6_000) });
    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) return { status: "error" };
    const payload = (await res.json()) as { data: T; meta?: PageMeta };
    return { status: "ok", data: payload.data, meta: payload.meta };
  } catch {
    return { status: "error" };
  }
}

export type Banner = { id: string; title: string; subtitle?: string | null; desktopImage?: string | null; mobileImage?: string | null; ctaLabel?: string | null; ctaLink?: string | null; secondaryCtaLabel?: string | null; secondaryCtaLink?: string | null; displayOrder?: number; active?: boolean };
export type Announcement = { id: string; title: string; content?: string | null; type?: string; imageUrl?: string | null; ctaLabel?: string | null; ctaUrl?: string | null };
export type Testimonial = { id: string; parentName: string; location?: string | null; subject?: string | null; testimonial: string; rating?: number | null; featured?: boolean };
export type Program = { id: string; name: string; slug?: string; ageGroup?: string | null; description?: string | null; coverImage?: string | null };
export type SchoolEvent = { id: string; title: string; slug?: string; description?: string | null; startDate?: string | null; endDate?: string | null; date?: string | null; startTime?: string | null; endTime?: string | null; venue?: string | null; coverImage?: string | null; featured?: boolean };
export type GalleryAlbum = { id: string; title: string; slug: string; category?: string | null; items: { id: string; imageUrl: string; caption?: string | null; altText?: string | null }[] };
export type BlogSummary = { id: string; title: string; slug: string; excerpt?: string | null; coverImage?: string | null; author?: string | null; category?: string | null; tags?: string[]; publishedAt?: string | null };
export type BlogPost = BlogSummary & { content: string; seoTitle?: string | null; seoDescription?: string | null; updatedAt?: string | null; createdAt?: string | null };
export type HomeData = { announcements?: Announcement[] };
