import { WebsitePhotoProvider } from "@/components/media/SchoolImage";
import { websitePhotoSettings } from "@/lib/website-photos";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { site, type PublicSite } from "@/lib/site";
import type { Branding } from "@/lib/branding";

/** Synchronous shell for error boundaries, which cannot fetch server CMS data. */
export function PublicShellView({ children, siteDetails = site, branding, photoSettings }: { children: React.ReactNode; siteDetails?: PublicSite; branding?: Branding; photoSettings?: Record<string, unknown> }) {
  return (
    <WebsitePhotoProvider settings={websitePhotoSettings(photoSettings)}>
      <div className="site-backdrop" aria-hidden />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar siteDetails={siteDetails} branding={branding} />
      <main id="main-content" className="overflow-x-clip">{children}</main>
      <Footer siteDetails={siteDetails} branding={branding} />
      <FloatingActions whatsapp={siteDetails.social.whatsapp} />
    </WebsitePhotoProvider>
  );
}
