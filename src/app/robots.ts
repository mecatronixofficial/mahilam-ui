import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction = SITE_URL.startsWith("https://") && !SITE_URL.includes("localhost");
  return {
    // Keep staging/preview hosts out of search results entirely.
    rules: isProduction
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/crm", "/login", "/offline", "/forbidden", "/session-expired"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
