import Link from "next/link";
import { ArrowRight, Brain, Building2, CalendarDays, Images } from "lucide-react";

const ITEMS = [
  ["/learning-approach", Brain, "Learning Approach", "How we make learning joyful and meaningful.", "#3f7a63"],
  ["/facilities", Building2, "Facilities", "Classrooms, play areas and child-friendly spaces.", "#d6a62d"],
  ["/gallery", Images, "Gallery", "Moments of learning, celebration and discovery.", "#e58d73"],
  ["/events", CalendarDays, "Events", "Celebrations, performances and special days.", "#3f7a63"],
] as const;

export function ExploreMore() {
  return (
    <section className="section-tint py-16">
      <div className="container-pad">
        <span className="eyebrow">Discover more</span>
        <h2 className="section-title mt-4 text-emerald-950">Life at Little Mahilam.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([href, Icon, title, desc, tint]) => (
            <Link key={href} href={href} className="glass-card reveal group p-6 transition-transform hover:-translate-y-1">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: `${tint}1f`, color: tint }}><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-bold text-emerald-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
