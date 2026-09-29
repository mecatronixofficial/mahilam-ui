import Link from "next/link";
import { ArrowRight, Phone, Smile } from "lucide-react";
import { site, telHref } from "@/lib/site";

export function AdmissionsCta({
  eyebrow = "Admissions open",
  title = "Give your child a happy beginning.",
  description = "Send an enquiry for Play Group, Pre-KG, LKG, UKG or Grades 1–3 and our team will call you back to arrange a campus visit.",
  ctaLabel = "Admission enquiry",
  ctaHref = "/admissions",
}: { eyebrow?: string; title?: string; description?: string; ctaLabel?: string; ctaHref?: string }) {
  return (
    <section className="py-20">
      <div className="container-pad">
        <div className="mesh-dark grain relative overflow-hidden rounded-[36px] p-8 text-white shadow-[0_30px_70px_-30px_rgba(23,60,47,.7)] md:p-14">
          <span aria-hidden className="absolute -right-10 -top-10 h-44 w-36 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,#fff1cf,#f7c85b_45%,#ef9e8a)] opacity-25 [--r:12deg]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold text-[#f7c85b]"><Smile className="h-3.5 w-3.5" /> {eyebrow}</span>
              <h2 className="mt-4 text-3xl font-bold md:text-5xl">{title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/70">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href={ctaHref} className="btn-accent !px-7 !py-4 text-base">{ctaLabel} <ArrowRight size={18} /></Link>
              {site.phone && <a href={telHref(site.phone)} className="glass-dark inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold hover:bg-white/20"><Phone className="h-4 w-4" /> Call {site.phone}</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
