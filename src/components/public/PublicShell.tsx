import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { getPublic } from "@/lib/server-api";
import { resolvePublicSite } from "@/lib/site";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const settings = await getPublic<Record<string, unknown>>("/settings", 0);
  const publicSite = resolvePublicSite(settings);
  return (
    <>
      <div className="site-backdrop" aria-hidden />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar siteDetails={publicSite} />
      <main id="main-content">{children}</main>
      <Footer siteDetails={publicSite} />
      <FloatingActions whatsapp={publicSite.social.whatsapp} />
    </>
  );
}
