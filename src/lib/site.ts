/**
 * Single source of truth for school details used by SEO metadata, JSON-LD,
 * the footer and contact pages. Values that must be verified before launch
 * (phone, email, hours, map coordinates) come from env so nothing is invented.
 */

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : undefined);

export const SITE_URL = (env(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "Little Mahilam Preschool",
  shortName: "Little Mahilam",
  tagline: "School of Happiness",
  description:
    "Little Mahilam is a child-centric preschool on Kangayam Road, Tiruppur offering joyful play-way learning for Play Group, Pre-KG, LKG, UKG and Grades 1–3.",
  url: SITE_URL,
  locale: "en_IN",
  phone: env(process.env.NEXT_PUBLIC_PHONE),
  email: env(process.env.NEXT_PUBLIC_EMAIL),
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_URL),
  address: {
    street: "56/11A, 2nd Street, Amarjothi AS Nagar, Kangayam Road, Valliammai Nagar",
    locality: "Tiruppur",
    region: "Tamil Nadu",
    regionCode: "IN-TN",
    postalCode: "641604",
    country: "IN",
  },
  fullAddress: "56/11A, 2nd Street, Amarjothi AS Nagar, Kangayam Road, Valliammai Nagar, Tiruppur, Tamil Nadu 641604",
  mapUrl: "https://maps.app.goo.gl/3qtZGG2wR8unUM7U7",
  /** Set NEXT_PUBLIC_GEO_LAT / NEXT_PUBLIC_GEO_LNG from the Google Business Profile pin. */
  geo: env(process.env.NEXT_PUBLIC_GEO_LAT) && env(process.env.NEXT_PUBLIC_GEO_LNG)
    ? { lat: Number(process.env.NEXT_PUBLIC_GEO_LAT), lng: Number(process.env.NEXT_PUBLIC_GEO_LNG) }
    : undefined,
  /** schema.org openingHours format, e.g. "Mo-Fr 09:00-15:30, Sa 09:00-12:30". */
  openingHours: env(process.env.NEXT_PUBLIC_OPENING_HOURS)?.split(",").map((part) => part.trim()).filter(Boolean),
  areasServed: ["Tiruppur", "Kangayam Road", "Valliammai Nagar", "Amarjothi AS Nagar", "Tiruppur District"],
  programs: [
    { name: "Play Group", age: "2 – 3 years" },
    { name: "Pre-KG", age: "3 – 4 years" },
    { name: "LKG", age: "4 – 5 years" },
    { name: "UKG", age: "5 – 6 years" },
    { name: "Grade 1 – 3", age: "6+ years" },
  ],
  social: {
    facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    youtube: env(process.env.NEXT_PUBLIC_YOUTUBE_URL),
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_URL),
  },
  googleVerification: env(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
  bingVerification: env(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION),
} as const;

/** Core keyword set, weighted toward what Tiruppur parents actually search for. */
export const baseKeywords = [
  "Little Mahilam",
  "Little Mahilam Preschool",
  "preschool in Tiruppur",
  "best preschool in Tiruppur",
  "play school in Tiruppur",
  "kindergarten in Tiruppur",
  "nursery school Tiruppur",
  "preschool near Kangayam Road",
  "play school Kangayam Road Tiruppur",
  "LKG UKG admission Tiruppur",
  "Pre-KG admission Tiruppur",
  "play group Tiruppur",
  "primary school Tiruppur Grade 1 to 3",
  "play-way learning",
  "child-centric preschool",
  "multiple intelligence school",
  "திருப்பூர் மழலையர் பள்ளி",
  "திருப்பூர் ப்ளே ஸ்கூல்",
];

export const sameAs = Object.values(site.social).filter((url): url is string => Boolean(url));

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
