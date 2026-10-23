import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Program } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";
import { site } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import { Shape, type ShapeName } from "./PlayShapes";
import { RiseIn, TiltCard } from "@/components/programs/Fx";

/** Ticket colours: soft face, bold accent, and a pattern shape for cards without a photo. */
const LOOKS: { face: string; accent: string; ink: string; shape: ShapeName }[] = [
  { face: BRAND.yellow[100], accent: BRAND.yellow[400], ink: BRAND.yellow[800], shape: "sun" },
  { face: BRAND.coral[100], accent: BRAND.coral[300], ink: BRAND.coral[700], shape: "flower" },
  { face: BRAND.green[100], accent: BRAND.green[300], ink: BRAND.green[700], shape: "cloud" },
  { face: BRAND.blue[100], accent: BRAND.blue[300], ink: BRAND.blue[700], shape: "blob" },
  { face: BRAND.pink[50], accent: BRAND.pink[200], ink: BRAND.pink[700], shape: "heart" },
];

/** CMS programs as "admission tickets", or the standard program list when none are published yet. Server-rendered. */
export function ProgramsDynamic({ programs }: { programs: Program[] | null }) {
  const rows: Program[] = programs?.length
    ? programs
    : site.programs.map((program, index) => ({ id: String(index), name: program.name, ageGroup: program.age, coverImage: `/images/programs/${index === 0 ? "play-group" : index === 1 ? "pre-kg" : index < 4 ? "kindergarten" : "primary"}.webp`, description: "Joyful, age-appropriate learning with individual attention." }));

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((program, index) => {
        const look = LOOKS[index % LOOKS.length];
        return (
          <RiseIn key={program.id || program.name} index={index} className="h-full">
            <TiltCard max={6} className="h-full rounded-[30px]">
              <article
                className="group relative flex h-full flex-col rounded-[30px] bg-white shadow-[0_22px_44px_-30px_rgba(36,68,32,.55)] ring-1 ring-black/5 transition-[translate,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[0_34px_60px_-30px_rgba(36,68,32,.6)]"
              >
                {/* Ticket head: photo, or a patterned colour block */}
                <div className="relative h-44 overflow-hidden rounded-t-[30px]" style={{ background: look.face }}>
                  {program.coverImage ? (
                    <Image src={program.coverImage} alt={`${program.name} class at Little Mahilam`} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" unoptimized={!isOptimizable(program.coverImage)} className="object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <>
                      <Shape name={look.shape} color={look.accent} className="absolute -right-8 -top-8 h-44 w-44 transition-transform duration-700 group-hover:rotate-45" />
                      <Shape name="pebble" color="#ffffff" className="absolute -bottom-10 left-6 h-28 w-28 opacity-60" />
                      <span aria-hidden className="absolute bottom-3 left-5 font-display text-[5.5rem] font-bold leading-none" style={{ color: look.accent }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </>
                  )}
                  {/* Light sweep on hover */}
                  <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
                  {program.ageGroup && (
                    <span className="absolute right-4 top-4 -rotate-3 rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" style={{ color: look.ink }}>
                      {program.ageGroup}
                    </span>
                  )}
                </div>

                {/* Perforated tear line with notches */}
                <div aria-hidden className="relative h-0">
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-little-cream" />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-little-cream" />
                  <span className="absolute inset-x-5 top-0 border-t-2 border-dashed border-little-neutral-200" />
                </div>

                <div className="flex flex-1 flex-col p-6 pt-6">
                  <span className="text-xs font-extrabold uppercase tracking-[.16em]" style={{ color: look.ink }}>Program {String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1.5 font-display text-2xl font-bold text-little-green-950">{program.name}</h3>
                  <p className="mt-2.5 flex-1 leading-7 text-little-neutral-600">{program.description || "Learning designed around curiosity, play and confidence."}</p>
                  <Link
                    href="/admissions"
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-full py-2 pl-4 pr-2 text-sm font-extrabold text-little-green-950 transition"
                    style={{ background: look.face }}
                  >
                    Enquire for {program.name}
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-little-green-900 text-white transition group-hover:translate-x-1"><ArrowRight className="h-3.5 w-3.5" /></span>
                  </Link>
                </div>
              </article>
            </TiltCard>
          </RiseIn>
        );
      })}
    </div>
  );
}
