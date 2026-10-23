import type { Metadata } from "next";
import { CalendarDays, Sparkles } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { EventsList } from "@/components/public/EventsList";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type SchoolEvent } from "@/lib/server-api";
import { breadcrumbSchema, eventsSchema, pageMetadata } from "@/lib/seo";

import { Appear, SectionHeading } from "@/components/about/motion";
import { SECTION_BG, Wave } from "@/components/about/Doodles";
import { EventsHero, Bunting } from "@/components/events/EventsHero";
import type { CalendarEvent } from "@/components/events/SchoolCalendar";
import { EventTickets } from "@/components/events/EventTickets";
import { FamilyHeart, HighlightFlipCards, PartyBand } from "@/components/events/EventsExtras";

export const metadata: Metadata = pageMetadata({
  title: "Events & School Calendar",
  description: "Upcoming celebrations, annual day, festival events and family moments at Little Mahilam Preschool, Kangayam Road, Tiruppur.",
  path: "/events",
  keywords: ["preschool events Tiruppur", "school annual day Tiruppur", "kids celebrations Tiruppur"],
});

const eventTypes = [
  { title: "Celebrations", description: "Festivals, birthdays and joyful occasions celebrated together with children." },
  { title: "Performances", description: "Music, dance, storytelling and stage moments that build confidence." },
  { title: "Family Events", description: "Special opportunities for parents and families to be part of school life." },
  { title: "Activity Days", description: "Theme days, creative activities and meaningful learning experiences." },
];

const eventHighlights = [
  {
    title: "Festival Celebrations",
    description: "Children experience traditions, colours, stories and togetherness through age-appropriate celebrations.",
    image: localImage("/images/events/festival.webp", 0),
    tag: "Celebration",
  },
  {
    title: "Creative Activity Days",
    description: "Special days filled with art, craft, music, storytelling and hands-on discovery.",
    image: localImage("/images/events/activity-day.webp", 1),
    tag: "Creativity",
  },
  {
    title: "Family Moments",
    description: "Events that help parents participate, connect and create meaningful school memories.",
    image: localImage("/images/events/family-event.webp", 0),
    tag: "Community",
  },
];

export const revalidate = 0;

/** A date as "YYYY-MM-DD" in school (IST) time — the calendar works in whole school days. */
const schoolDay = (value: string | Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));

function toCalendar(events: SchoolEvent[]): CalendarEvent[] {
  return events.flatMap((e) => {
    const start = e.startDate || e.date;
    if (!start || Number.isNaN(new Date(start).getTime())) return [];
    const end = e.endDate && !Number.isNaN(new Date(e.endDate).getTime()) ? schoolDay(e.endDate) : null;
    return [{ id: e.id, title: e.title, start: schoolDay(start), end, startTime: e.startTime, venue: e.venue }];
  });
}

export default async function Page() {
  // Upcoming events for the list; every active event (past ones too) for the calendar.
  const [events, allEvents] = await Promise.all([getPublic<SchoolEvent[]>("/events?when=upcoming", 0), getPublic<SchoolEvent[]>("/events", 0)]);
  const cover = events?.find((event) => event.coverImage);
  const calendar = { today: schoolDay(new Date()), events: toCalendar(allEvents ?? events ?? []) };

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Events", path: "/events" }])} />
      {events?.length ? <JsonLd data={eventsSchema(events)} /> : null}
        <EventsHero calendar={calendar} photo={cover?.coverImage || localImage("/images/events/kids-celebration.webp", 1)} />

        {/* ======================================================
            INTRO — school life statement
        ====================================================== */}
        <section className="relative overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.cream }}>
          <div className="container-pad grid items-start gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            <Appear>
              <span className="inline-flex items-center gap-2 rounded-full bg-little-yellow-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800"><Sparkles className="h-3.5 w-3.5" /> School Life</span>
              <h2 className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold leading-[1.08] text-little-green-950">
                Every celebration becomes a <span className="text-little-pink-500">beautiful memory.</span>
              </h2>
            </Appear>
            <Appear delay={0.1} className="lg:pt-6">
              <p className="text-lg leading-8 text-little-neutral-700">
                School events give children opportunities to celebrate, participate, perform, create and enjoy meaningful experiences with friends, teachers and families.
              </p>
              <p className="mt-4 leading-8 text-little-neutral-600">
                From festival celebrations to activity days, each event adds colour, confidence and community to a child&apos;s school journey.
              </p>
            </Appear>
          </div>
        </section>

        <EventTickets types={eventTypes} />

        {/* ======================================================
            UPCOMING EVENTS — timeline
        ====================================================== */}
        <section id="upcoming-events" className="relative scroll-mt-24 overflow-hidden pb-8 pt-2 md:pb-10" style={{ background: SECTION_BG.cream }}>
          <Bunting count={14} className="mb-4" />
          <div className="container-pad relative">
            <SectionHeading
              eyebrow="Upcoming Events"
              icon={<CalendarDays className="h-4 w-4 text-little-coral-500" />}
              title={<>What&apos;s happening at <span className="text-little-pink-500">Little Mahilam?</span></>}
              lead="Explore upcoming celebrations, activities and community moments planned for our children and families."
            />
            <div className="mt-10">
              <EventsList events={events} />
            </div>
          </div>
          <Wave color={SECTION_BG.mint} className="absolute inset-x-0 bottom-0 h-6" />
        </section>

        <HighlightFlipCards items={eventHighlights} />
        <FamilyHeart image={localImage("/images/events/family-moment.webp", 1)} />
        <PartyBand />

      <AdmissionsCta />
    </PublicShell>
  );
}
