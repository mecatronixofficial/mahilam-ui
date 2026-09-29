import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Little Mahilam Preschool collects, uses and protects the personal information families share through our website.",
  path: "/privacy-policy",
});

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  { title: "Information we collect", body: <p>When you send an admission enquiry, book a visit or submit a parent review, we collect the details you enter — such as your name, your child&apos;s name, phone number, email address, the program you&apos;re interested in and your message. We also keep standard technical logs (like IP address and browser type) to keep the website secure.</p> },
  { title: "How we use it", body: <ul><li>To respond to your enquiry and arrange campus visits.</li><li>To manage admissions and communicate with enrolled families.</li><li>To verify parent reviews before they are published. Your phone number and email are never shown publicly.</li><li>To keep our website safe and working well.</li></ul> },
  { title: "Photos of children", body: <p>Photos in our gallery are shared thoughtfully and only after appropriate review. If you would like a photo of your child removed, please contact us and we will act promptly.</p> },
  { title: "Sharing", body: <p>We do not sell or rent your information. It is accessible only to authorised school staff and to service providers who help us run the website and school systems, under confidentiality obligations.</p> },
  { title: "Retention & security", body: <p>We keep enquiry and admission records only as long as needed for school administration or as required by law, and protect them with access controls and secure, encrypted connections.</p> },
  { title: "Your choices", body: <p>You can ask us to access, correct or delete the information you have shared with us. Contact us using the details below.</p> },
];

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Privacy" title="Your family's privacy matters." description="A plain-language explanation of how we handle the information you share with Little Mahilam Preschool." crumbs={[{ name: "Privacy policy", path: "/privacy-policy" }]} />
      <section className="py-16">
        <div className="container-pad max-w-3xl">
          <div className="glass-card prose-school p-7 md:p-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body}
              </section>
            ))}
            <h2>Contact</h2>
            <p>
              {site.name}, {site.fullAddress}.
              {site.email && <> Email: <a className="font-bold text-emerald-800 underline" href={`mailto:${site.email}`}>{site.email}</a>.</>}
              {site.phone && <> Phone: {site.phone}.</>}
              {" "}Or use our <Link className="font-bold text-emerald-800 underline" href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
