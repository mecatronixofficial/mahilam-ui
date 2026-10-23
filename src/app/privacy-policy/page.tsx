import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Camera, ClipboardList, Hand, Lock, Mail, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageBanner } from "@/components/public/PageBanner";
import { localImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Little Mahilam Preschool collects, uses and protects the personal information families share through our website.",
  path: "/privacy-policy",
});

const SECTIONS: { title: string; icon: LucideIcon; tint: string; body: React.ReactNode }[] = [
  { title: "Information we collect", icon: ClipboardList, tint: BRAND.yellow[400], body: <p>When you send an admission enquiry, book a visit or submit a parent review, we collect the details you enter — such as your name, your child&apos;s name, phone number, email address, the program you&apos;re interested in and your message. We also keep standard technical logs (like IP address and browser type) to keep the website secure.</p> },
  { title: "How we use it", icon: Sparkles, tint: BRAND.green[200], body: <ul><li>To respond to your enquiry and arrange campus visits.</li><li>To manage admissions and communicate with enrolled families.</li><li>To verify parent reviews before they are published. Your phone number and email are never shown publicly.</li><li>To keep our website safe and working well.</li></ul> },
  { title: "Photos of children", icon: Camera, tint: BRAND.coral[300], body: <p>Photos in our gallery are shared thoughtfully and only after appropriate review. If you would like a photo of your child removed, please contact us and we will act promptly.</p> },
  { title: "Sharing", icon: Share2, tint: BRAND.blue[300], body: <p>We do not sell or rent your information. It is accessible only to authorised school staff and to service providers who help us run the website and school systems, under confidentiality obligations.</p> },
  { title: "Retention & security", icon: Lock, tint: BRAND.pink[200], body: <p>We keep enquiry and admission records only as long as needed for school administration or as required by law, and protect them with access controls and secure, encrypted connections.</p> },
  { title: "Your choices", icon: Hand, tint: BRAND.pink[300], body: <p>You can ask us to access, correct or delete the information you have shared with us. Contact us using the details below.</p> },
];

const anchor = (title: string) => title.toLowerCase().replace(/[^a-z]+/g, "-");

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <PageBanner
        theme="privacy"
        eyebrow="Privacy"
        icon={ShieldCheck}
        title="Your family's privacy"
        highlight="matters."
        description="A plain-language explanation of how we handle the information you share with Little Mahilam Preschool."
        crumbs={[{ name: "Privacy policy", path: "/privacy-policy" }]}
        image={{ src: localImage("/images/banners/privacy.webp", 1), alt: "Children safe and happy at Little Mahilam Preschool" }}
      />

      <section className="py-14 md:py-20">
        <div className="container-pad">
          {/* Topic chips */}
          <nav aria-label="Privacy topics" className="flex flex-wrap justify-center gap-2">
            {SECTIONS.map(({ title, icon: Icon, tint }) => (
              <a key={title} href={`#${anchor(title)}`} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-little-green-950 shadow-sm ring-1 ring-little-green-950/5 transition hover:-translate-y-0.5">
                <Icon className="h-4 w-4" style={{ color: tint === BRAND.yellow[400] ? BRAND.yellow[600] : tint }} /> {title}
              </a>
            ))}
          </nav>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            {SECTIONS.map(({ title, icon: Icon, tint, body }, i) => (
              <section key={title} id={anchor(title)} className="relative scroll-mt-32 overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_18px_40px_-28px_rgba(36,68,32,.5)] ring-1 ring-little-green-950/5">
                <span aria-hidden className="absolute right-5 top-3 font-display text-6xl font-bold text-little-green-950/[.05]">{String(i + 1).padStart(2, "0")}</span>
                {/* Padlock badge */}
                <span className="relative flex h-14 w-12 flex-col items-center">
                  <span className="h-5 w-8 rounded-t-full border-[5px] border-b-0" style={{ borderColor: tint }} />
                  <span className="-mt-0.5 flex h-9 w-12 items-center justify-center rounded-lg text-little-green-950" style={{ backgroundColor: tint }}><Icon className="h-4.5 w-4.5" /></span>
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-little-green-950">{title}</h2>
                <div className="prose-school mt-3 !text-base [&_li]:mt-1.5">{body}</div>
              </section>
            ))}
          </div>

          {/* Contact */}
          <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-5 rounded-[32px] bg-little-green-900 p-7 text-white md:flex-row md:items-center md:p-9">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10"><Mail className="h-7 w-7 text-little-yellow-400" /></span>
            <div className="flex-1 leading-7 text-white/80">
              <h2 className="font-display text-xl font-bold text-white">Contact</h2>
              <p className="mt-1">
                {site.name}, {site.fullAddress}.
                {site.email && <> Email: <a className="font-bold text-little-yellow-400 underline" href={`mailto:${site.email}`}>{site.email}</a>.</>}
                {site.phone && <> Phone: {site.phone}.</>}
              </p>
            </div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-little-yellow-400 px-6 py-3 font-extrabold text-little-green-950">Contact page</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
