import type { MetadataRoute } from "next";
import { getPublic, type BlogSummary } from "@/lib/server-api";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/admissions", priority: 0.95, changeFrequency: "weekly" },
  { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
  { path: "/preschool-in-tiruppur", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/learning-approach", priority: 0.7, changeFrequency: "monthly" },
  { path: "/activities", priority: 0.7, changeFrequency: "monthly" },
  { path: "/facilities", priority: 0.7, changeFrequency: "monthly" },
  { path: "/events", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPublic<BlogSummary[]>("/blogs", 3600)) ?? [];
  return [
    ...ROUTES.map(({ path, priority, changeFrequency }) => ({ url: `${SITE_URL}${path}`, changeFrequency, priority })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    })),
  ];
}
