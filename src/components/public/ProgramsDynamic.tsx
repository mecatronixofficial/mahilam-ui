import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Program } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";
import { site } from "@/lib/site";

const TINTS = ["#d6a62d", "#e58d73", "#3f7a63", "#6aa0d8"];

/** CMS programs, or the standard program list when none are published yet. Server-rendered. */
export function ProgramsDynamic({ programs }: { programs: Program[] | null }) {
  const rows: Program[] = programs?.length
    ? programs
    : site.programs.map((program, index) => ({ id: String(index), name: program.name, ageGroup: program.age, description: "Joyful, age-appropriate learning with individual attention." }));

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((program, index) => {
        const tint = TINTS[index % TINTS.length];
        return (
          <article key={program.id || program.name} className="glass-card reveal group overflow-hidden">
            {program.coverImage ? (
              <div className="relative h-44 overflow-hidden">
                <Image src={program.coverImage} alt={`${program.name} class at Little Mahilam`} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" unoptimized={!isOptimizable(program.coverImage)} className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
            ) : (
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${tint}, transparent)` }} />
            )}
            <div className="p-7">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold" style={{ color: tint }}>{String(index + 1).padStart(2, "0")}</span>
                {program.ageGroup && <span className="glass-chip rounded-full px-3 py-1 text-xs font-extrabold text-emerald-900">{program.ageGroup}</span>}
              </div>
              <h3 className="mt-6 text-2xl font-bold text-emerald-950">{program.name}</h3>
              <p className="mt-3 leading-7 text-slate-600">{program.description || "Learning designed around curiosity, play and confidence."}</p>
              <Link href="/admissions" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800">Enquire for {program.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
