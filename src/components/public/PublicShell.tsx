import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="site-backdrop" aria-hidden />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
