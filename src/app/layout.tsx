import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fredoka, Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseKeywords, site, SITE_URL } from "@/lib/site";
import { schoolSchema, websiteSchema } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", preload: false });
// Grotesk used only by the homepage and footer (`.lm-play` scope).
const grotesk = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-grotesk", display: "swap", preload: false });

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: BRAND.cream.base }, { color: BRAND.green[900] }],
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
    // data-scroll-behavior lets Next turn off the global smooth scroll while it jumps to the top of a new page;
    // without it the jump animates and gets cut short, leaving visitors mid-page.
    // suppressHydrationWarning: the homepage intro script below adds a class to <html> before React hydrates.
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${nunito.variable} ${fredoka.variable} ${jakarta.variable} ${grotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Homepage only: the header glides in with the first paint (CSS). */}
        <script dangerouslySetInnerHTML={{ __html: `if(location.pathname==="/"&&matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("lm-intro")` }} />
        {/* Scroll reveals wait (hidden) for a script to start them; without JavaScript, just show everything. */}
        <noscript><style>{".fx,.fx-clip,.fx-zoom,.fx-draw,.fx-fade,.fx-grow-x,.fx-grow-y,.fx-flip,[data-words] .lm-mark>svg{animation:none!important}[data-reveal] *,[data-reveal]{opacity:1!important}"}</style></noscript>
      </head>
      <body>
        <JsonLd data={[schoolSchema(), websiteSchema()]} />
        <ScrollToTop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
