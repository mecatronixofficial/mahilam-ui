"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, CalendarClock, Flag, GraduationCap, Hourglass, Megaphone, PartyPopper, TreePalm, TriangleAlert, X, type LucideIcon } from "lucide-react";
import type { Announcement } from "@/lib/server-api";
import { formatDate, humanize } from "@/lib/media";
import { Lion } from "./HeroAnimals";
import { BRAND } from "@/lib/brand";
import { useSessionPopup } from "@/lib/use-session-popup";

// Loaded on demand so Framer Motion only ships when an admissions notice is live.
const AdmissionsGamePopup = dynamic(() => import("./AdmissionsGamePopup").then((mod) => mod.AdmissionsGamePopup), { ssr: false });
const DAY_MS = 86_400_000;

/** Per-type colours: `tint` for soft backgrounds, `ink` for icons and accents. */
const TYPE_META: Record<string, { icon: LucideIcon; tint: string; ink: string }> = {
  GENERAL: { icon: Megaphone, tint: BRAND.blue[50], ink: BRAND.blue[700] },
  ADMISSION: { icon: GraduationCap, tint: BRAND.green[100], ink: BRAND.green[700] },
  HOLIDAY: { icon: TreePalm, tint: BRAND.yellow[100], ink: BRAND.coral[600] },
  EVENT: { icon: PartyPopper, tint: BRAND.pink[50], ink: BRAND.pink[800] },
  IMPORTANT: { icon: TriangleAlert, tint: BRAND.coral[50], ink: BRAND.coral[700] },
};

const CONFETTI = [
  { left: "8%", top: "18%", color: BRAND.yellow[400], size: 10, round: true },
  { left: "22%", top: "70%", color: BRAND.coral[300], size: 8, round: false },
  { left: "78%", top: "22%", color: BRAND.green[200], size: 12, round: true },
  { left: "90%", top: "62%", color: BRAND.yellow[400], size: 7, round: false },
  { left: "60%", top: "80%", color: BRAND.pink[200], size: 9, round: true },
];

const isAdmissionNotice = (a: Announcement) => a.type === "ADMISSION" || /admission/i.test(a.title);
/** Picks "2026–27" out of a title like "Admissions Open 2026-27". */
const yearFrom = (title: string) => title.match(/\b(20\d{2})\s*[-–/]\s*(\d{2,4})\b/)?.slice(1, 3).join("–");

/** Once-per-session announcement dialog. Content is rendered on the server and passed in. */
export function AnnouncementBar({ announcement }: { announcement?: Announcement | null }) {
  if (!announcement) return null;
  if (isAdmissionNotice(announcement)) {
    return (
      <AdmissionsGamePopup
        sessionKey={String(announcement.id ?? announcement.title)}
        academicYear={yearFrom(announcement.title)}
        details={announcement.content}
        applyHref={announcement.ctaUrl || "/admissions"}
        applyLabel={announcement.ctaLabel || undefined}
      />
    );
  }
  return <NoticeCard announcement={announcement} />;
}

/** The classic notice card, used for holidays, events and other non-admission announcements. */
function NoticeCard({ announcement }: { announcement: Announcement }) {
  const [open, close] = useSessionPopup(String(announcement.id ?? announcement.title));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const type = announcement.type && TYPE_META[announcement.type] ? announcement.type : "GENERAL";
  const meta = TYPE_META[type];
  const TypeIcon = meta.icon;
  const daysLeft = announcement.endDate ? Math.ceil((new Date(announcement.endDate).getTime() - Date.now()) / DAY_MS) : null;
  const hasCta = Boolean(announcement.ctaLabel && announcement.ctaUrl);

  const chips = [
    { icon: CalendarClock, label: "From", value: formatDate(announcement.startDate) },
    { icon: CalendarCheck2, label: "Until", value: formatDate(announcement.endDate) },
    { icon: Hourglass, label: "", value: daysLeft === null || daysLeft < 0 ? "" : daysLeft === 0 ? "Ends today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left` },
    { icon: Flag, label: "Priority", value: announcement.priority && announcement.priority > 0 ? String(announcement.priority) : "" },
  ].filter((chip) => chip.value);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 pt-16" role="dialog" aria-modal="true" aria-labelledby="announcement-title" aria-describedby="announcement-content">
      <button type="button" aria-label="Close announcement" onClick={close} className="absolute inset-0 bg-little-green-950/55 backdrop-blur-sm" />

      <div className="relative w-full max-w-md animate-pop">
        {/* Lion peeking over the card */}
        <Lion className="pointer-events-none absolute -top-14 left-6 z-0 w-24 -rotate-6 drop-shadow-lg" />

        <div className="relative z-10 max-h-[84dvh] overflow-y-auto rounded-[32px] border-4 border-white bg-little-cream shadow-[0_40px_90px_-30px_rgba(21,23,17,.75)] hide-scrollbar">
          {/* Coloured header with confetti */}
          <div className="relative overflow-hidden px-6 pb-10 pt-6" style={{ background: meta.tint }}>
            <div aria-hidden className="absolute inset-0">
              {CONFETTI.map((dot, i) => <span key={i} className={`absolute ${dot.round ? "rounded-full" : "rotate-12 rounded-[3px]"}`} style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size, background: dot.color }} />)}
            </div>
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 -rotate-6 items-center justify-center rounded-2xl bg-white shadow-md" style={{ color: meta.ink }}><TypeIcon className="h-6 w-6" /></span>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.2em]" style={{ color: meta.ink }}>{humanize(type)} notice</p>
                  <p className="text-xs font-bold text-little-neutral-500">{formatDate(announcement.createdAt) ? `Posted ${formatDate(announcement.createdAt)}` : "Little Mahilam"}</p>
                </div>
              </div>
              <button type="button" onClick={close} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-little-neutral-600 shadow-md transition hover:rotate-90 hover:text-little-neutral-900"><X className="h-4 w-4" /></button>
            </div>
            {/* Scalloped bottom edge */}
            <svg aria-hidden className="absolute inset-x-0 -bottom-px h-5 w-full text-little-cream" viewBox="0 0 400 20" preserveAspectRatio="none"><path d="M0 20 V10 Q12.5 0 25 10 T50 10 T75 10 T100 10 T125 10 T150 10 T175 10 T200 10 T225 10 T250 10 T275 10 T300 10 T325 10 T350 10 T375 10 T400 10 V20 Z" fill="currentColor" /></svg>
          </div>

          <div className="px-6 pb-6 sm:px-7 sm:pb-7">
            {/* Taped polaroid photo */}
            {announcement.imageUrl && (
              <div className="relative mx-auto -mt-4 mb-5 w-[88%] rotate-[-1.5deg] rounded-2xl bg-white p-2 pb-3 shadow-lg">
                <span aria-hidden className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 rotate-2 rounded-sm bg-little-yellow-400/70" />
                <img src={announcement.imageUrl} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" />
              </div>
            )}

            <h2 id="announcement-title" className="text-balance font-display text-2xl font-bold leading-tight text-little-green-950 sm:text-[1.7rem]">{announcement.title}</h2>
            {announcement.content && <p id="announcement-content" className="mt-3 whitespace-pre-line text-[15px] leading-7 text-little-neutral-600">{announcement.content}</p>}

            {chips.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {chips.map(({ icon: Icon, label, value }) => (
                  <li key={label + value} className="inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-xs font-bold text-little-neutral-700" style={{ borderColor: meta.ink + "55", background: meta.tint + "99" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: meta.ink }} />{label && <span className="text-little-neutral-500">{label}</span>}{value}
                  </li>
                ))}
              </ul>
            )}

            <div className={`mt-6 grid gap-2.5 ${hasCta ? "sm:grid-cols-[1.3fr_1fr]" : ""}`}>
              {hasCta && (
                <Link href={announcement.ctaUrl!} onClick={close} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-little-green-900 px-6 text-sm font-extrabold text-white shadow-[0_14px_28px_-14px_rgba(36,68,32,.8)] transition hover:-translate-y-0.5">
                  {announcement.ctaLabel}<ArrowRight className="h-4 w-4 text-little-yellow-400 transition group-hover:translate-x-0.5" />
                </Link>
              )}
              <button type="button" onClick={close} className="inline-flex h-12 items-center justify-center rounded-full bg-little-yellow-400 px-6 text-sm font-extrabold text-little-green-950 transition hover:-translate-y-0.5 hover:bg-little-yellow-300">Got it! 👍</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
