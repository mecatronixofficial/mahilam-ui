import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WebSite, WithContext, Event as SchemaEvent, BlogPosting, ItemList } from "schema-dts";
import { absoluteUrl, baseKeywords, sameAs, site } from "./site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string | null;
};

/** Builds consistent metadata: canonical URL, Open Graph, Twitter and page keywords. */
export function pageMetadata({ title, description, path, keywords = [], image, noindex, type = "website", publishedTime }: PageSeo): Metadata {
  const images = image ? [{ url: image, alt: title }] : undefined;
  return {
    title,
    description,
    keywords: [...keywords, ...baseKeywords],
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(images ? { images } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, ...(image ? { images: [image] } : {}) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** The school as both an educational organization and a local business (for Google Maps / local pack). */
export function schoolSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Preschool", "LocalBusiness"],
    "@id": `${site.url}/#school`,
    name: site.name,
    alternateName: [site.shortName, `${site.shortName} ${site.tagline}`],
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    image: [absoluteUrl("/opengraph-image"), absoluteUrl("/imgs/home/kid1.jpg")],
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    ...(site.geo ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng } } : {}),
    hasMap: site.mapUrl,
    ...(site.openingHours?.length ? { openingHours: site.openingHours } : {}),
    areaServed: site.areasServed.map((name) => ({ "@type": "Place", name })),
    ...(sameAs.length ? { sameAs } : {}),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    knowsLanguage: ["en", "ta"],
    audience: { "@type": "EducationalAudience", educationalRole: "student", audienceType: "Children aged 2 to 9" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Programs",
      itemListElement: site.programs.map((program) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Course", name: program.name, description: `${program.name} program for children aged ${program.age} in Tiruppur.`, provider: { "@id": `${site.url}/#school` } },
      })),
    },
  };
}

export function websiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en-IN",
    publisher: { "@id": `${site.url}/#school` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function faqSchema(faqs: readonly { q: string; a: string }[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

export function eventsSchema(events: { title: string; description?: string | null; startDate?: string | null; endDate?: string | null; venue?: string | null; slug?: string; coverImage?: string | null }[]): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events
      .filter((event) => event.startDate)
      .map((event, index) => {
        const item: SchemaEvent = {
          "@type": "Event",
          name: event.title,
          startDate: event.startDate!,
          ...(event.endDate ? { endDate: event.endDate } : {}),
          ...(event.description ? { description: event.description } : {}),
          ...(event.coverImage ? { image: event.coverImage } : {}),
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: event.venue || site.name,
            address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.locality, addressRegion: site.address.region, postalCode: site.address.postalCode, addressCountry: site.address.country },
          },
          organizer: { "@type": "Organization", name: site.name, url: site.url },
        };
        return { "@type": "ListItem", position: index + 1, item };
      }),
  };
}

export function articleSchema(post: { title: string; slug: string; excerpt?: string | null; coverImage?: string | null; author?: string | null; publishedAt?: string | null; updatedAt?: string | null }): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverImage ? { image: post.coverImage } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt || post.publishedAt ? { dateModified: post.updatedAt || post.publishedAt! } : {}),
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: "en-IN",
  };
}
