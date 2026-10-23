import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { CalendarDays, Camera, Music2, PartyPopper, Ticket, Users, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SECTION_BG, Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";

export type EventType = { title: string; description: string };

const LOOKS: { icon: LucideIcon; tint: string; ink: string }[] = [
  { icon: PartyPopper, tint: BRAND.yellow[300], ink: BRAND.yellow[800] },
  { icon: Music2, tint: BRAND.coral[200], ink: BRAND.coral[700] },
  { icon: Users, tint: BRAND.green[200], ink: BRAND.green[800] },
  { icon: Camera, tint: BRAND.blue[200], ink: BRAND.blue[800] },
];


/** "So many reasons to celebrate together": admission tickets whose stubs tear and get stamped on hover. */
export function EventTickets({ types }: { types: EventType[] }) {
  return (
    <section className="relative overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.peach }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Our School Calendar"
          icon={<CalendarDays className="h-4 w-4 text-little-coral-500" />}
          title={<>So many reasons to <span className="text-little-pink-500">celebrate together.</span></>}
          lead="Events are designed to give children joyful experiences beyond their everyday classroom routine."
        />

        <Group as="ul" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((item, i) => {
            const look = LOOKS[i % LOOKS.length];
            const Icon = look.icon;
            return (
              <li
                key={item.title}
                className="fx flex"
                style={fx({ y: 40, r: i % 2 ? 4 : -4, d: i * 0.08, dur: 0.9, ease: "back" })}
              >
                <article className="group/ticket relative flex transition-[translate,rotate] duration-300 ease-(--ease-back-strong) hover:-translate-y-2 hover:-rotate-[1.5deg] active:-translate-y-2 w-full cursor-pointer flex-col drop-shadow-[0_18px_22px_rgba(36,68,32,.18)]">
                  {/* Main ticket */}
                  <div className="relative flex-1 overflow-hidden rounded-t-[24px] bg-white">
                    <div className="relative flex items-center gap-4 px-5 py-6" style={{ background: look.tint }}>
                      <span className="grid h-14 w-14 group-hover/ticket:animate-[fx-jiggle_.6s_ease-in-out] shrink-0 place-items-center rounded-2xl bg-white text-little-green-950 shadow-sm">
                        <Icon className="h-7 w-7" />
                      </span>
                      <span>
                        <span className="block text-[10px] font-extrabold uppercase tracking-[.2em] text-little-green-950/55">Admit all</span>
                        <span className="block font-display text-2xl font-bold leading-tight text-little-green-950">{item.title}</span>
                      </span>
                      {/* Stamp */}
                      <span aria-hidden className="absolute right-3 top-3 -rotate-30 scale-220 opacity-0 transition-[opacity,scale,rotate] duration-300 ease-(--ease-back) group-hover/ticket:-rotate-14 group-hover/ticket:scale-100 group-hover/ticket:opacity-100 group-active/ticket:opacity-100 rounded-lg border-[3px] px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest" style={{ borderColor: look.ink, color: look.ink }}>
                        Admit all ✓
                      </span>
                    </div>
                    <p className="px-5 pb-5 pt-4 text-sm leading-7 text-little-neutral-600">{item.description}</p>
                  </div>
                  {/* Perforation with notches */}
                  <div aria-hidden className="relative h-0">
                    <span className="absolute -left-3 -top-3 z-10 h-6 w-6 rounded-full" style={{ background: SECTION_BG.peach }} />
                    <span className="absolute -right-3 -top-3 z-10 h-6 w-6 rounded-full" style={{ background: SECTION_BG.peach }} />
                    <span className="absolute inset-x-4 top-0 border-t-2 border-dashed border-little-neutral-200" />
                  </div>
                  {/* Stub */}
                  <div className="flex origin-top-left transition-[translate,rotate] duration-500 ease-(--ease-back-strong) group-hover/ticket:translate-y-2.5 group-hover/ticket:rotate-7 items-center justify-between rounded-b-[24px] bg-white px-5 py-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-little-neutral-500">
                    <span className="flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5" style={{ color: look.ink }} /> No. {String(i + 1).padStart(3, "0")}</span>
                    <span>Little Mahilam</span>
                  </div>
                </article>
              </li>
            );
          })}
        </Group>
      </div>

      <Wave color={SECTION_BG.cream} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}
