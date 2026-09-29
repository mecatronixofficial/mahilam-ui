import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseKeywords, site, SITE_URL } from "@/lib/site";
import { schoolSchema, websiteSchema } from "@/lib/seo";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", preload: false });

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fffaf0" }, { color: "#173c2f" }],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Little Mahilam Preschool, Tiruppur | Play School on Kangayam Road",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: baseKeywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  category: "education",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: "Little Mahilam Preschool | A School of Happiness in Tiruppur",
    description: "Child-centric, play-way learning for Play Group to Grade 3 on Kangayam Road, Tiruppur.",
  },
  twitter: { card: "summary_large_image", title: "Little Mahilam Preschool, Tiruppur", description: "A School of Happiness — joyful, child-centric learning in Tiruppur." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    ...(site.googleVerification ? { google: site.googleVerification } : {}),
    ...(site.bingVerification ? { other: { "msvalidate.01": site.bingVerification } } : {}),
  },
  other: {
    // Local SEO geo tags.
    "geo.region": site.address.regionCode,
    "geo.placename": `${site.address.locality}, ${site.address.region}`,
    ...(site.geo ? { "geo.position": `${site.geo.lat};${site.geo.lng}`, ICBM: `${site.geo.lat}, ${site.geo.lng}` } : {}),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${nunito.variable} ${fredoka.variable} ${jakarta.variable}`}>
      <body>
        <JsonLd data={[schoolSchema(), websiteSchema()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
