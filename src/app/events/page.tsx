import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Camera,
  Gift,
  Heart,
  Music2,
  PartyPopper,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageHero } from "@/components/public/PageHero";
import { EventsList } from "@/components/public/EventsList";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type SchoolEvent } from "@/lib/server-api";
import { eventsSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Events & School Calendar",
  description: "Upcoming celebrations, annual day, festival events and family moments at Little Mahilam Preschool, Kangayam Road, Tiruppur.",
  path: "/events",
  keywords: ["preschool events Tiruppur", "school annual day Tiruppur", "kids celebrations Tiruppur"],
});

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63", "#8cb9e8"];

const eventTypes = [
  {
    icon: PartyPopper,
    title: "Celebrations",
    description:
      "Festivals, birthdays and joyful occasions celebrated together with children.",
  },
  {
    icon: Music2,
    title: "Performances",
    description:
      "Music, dance, storytelling and stage moments that build confidence.",
  },
  {
    icon: Users,
    title: "Family Events",
    description:
      "Special opportunities for parents and families to be part of school life.",
  },
  {
    icon: Camera,
    title: "Activity Days",
    description:
      "Theme days, creative activities and meaningful learning experiences.",
  },
];

const eventHighlights = [
  {
    title: "Festival Celebrations",
    description:
      "Children experience traditions, colours, stories and togetherness through age-appropriate celebrations.",
    image: localImage("/images/events/festival.webp", 0),
    tag: "Celebration",
  },
  {
    title: "Creative Activity Days",
    description:
      "Special days filled with art, craft, music, storytelling and hands-on discovery.",
    image: localImage("/images/events/activity-day.webp", 1),
    tag: "Creativity",
  },
  {
    title: "Family Moments",
    description:
      "Events that help parents participate, connect and create meaningful school memories.",
    image: localImage("/images/events/family-event.webp", 0),
    tag: "Community",
  },
];

export const revalidate = 300;

export default async function Page() {
  const events = await getPublic<SchoolEvent[]>("/events?when=upcoming");
  return (
    <PublicShell>
      <PageHero
        eyebrow="School calendar"
        title="Moments we share together."
        description="Celebrations, learning experiences and family connections make our school community special."
        crumbs={[{ name: "Events", path: "/events" }]}
      />
      {events?.length ? <JsonLd data={eventsSchema(events)} /> : null}

      {/* ======================================================
          EVENTS INTRO
      ====================================================== */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-yellow-200/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="container-pad relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="eyebrow">
                <Sparkles className="h-4 w-4" />
                School Life
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-black leading-[1.15] tracking-tight text-emerald-950 sm:text-4xl lg:text-[46px]">
                Every celebration becomes a
                <span className="text-[#ef9e8a]"> beautiful memory.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                School events give children opportunities to celebrate,
                participate, perform, create and enjoy meaningful experiences
                with friends, teachers and families.
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                From festival celebrations to activity days, each event adds
                colour, confidence and community to a child's school journey.
              </p>

              <Link
                href="#upcoming-events"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900"
              >
                View Upcoming Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-[590px] pb-14">
              <div className="relative h-[440px] overflow-hidden rounded-[80px_30px_80px_30px] border-[7px] border-white shadow-2xl sm:h-[520px]">
                <Image
                  src={localImage("/images/events/kids-celebration.webp", 1)}
                  alt="Children celebrating a school event"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-2 right-0 h-40 w-40 overflow-hidden rounded-[35px] border-[6px] border-white shadow-xl sm:-right-5 sm:h-52 sm:w-52">
                <Image
                  src={localImage("/images/events/kids-performance.webp", 0)}
                  alt="Children participating in school performance"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              <div className="absolute -left-2 top-12 rounded-[25px] bg-yellow-300 px-5 py-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                    <PartyPopper className="h-5 w-5 text-pink-500" />
                  </span>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                      Celebrate
                    </div>

                    <div className="font-black text-slate-900">
                      Learn • Share • Smile
                    </div>
                  </div>
                </div>
              </div>

              <span className="absolute -right-3 top-8 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-[#ef9e8a] shadow-lg">
                <Star className="h-6 w-6 fill-white text-white" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          EVENT TYPES
      ====================================================== */}

      <section className="py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <CalendarDays className="h-4 w-4" />
              Our School Calendar
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
              So many reasons to
              <span className="text-[#ef9e8a]"> celebrate together.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">
              Events are designed to give children joyful experiences beyond
              their everyday classroom routine.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {eventTypes.map((item, i) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[32px] glass-card p-6 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10"
                    style={{
                      backgroundColor: TINTS[i % TINTS.length],
                    }}
                  />

                  <span
                    className="relative flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                    style={{
                      backgroundColor: `${TINTS[i % TINTS.length]}22`,
                      color: TINTS[i % TINTS.length],
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>

                  <h3 className="relative mt-5 text-xl font-black text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="relative mt-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          DYNAMIC EVENTS
      ====================================================== */}

      <section
        id="upcoming-events"
        className="relative overflow-hidden section-tint py-16 md:py-20"
      >
        <div className="absolute left-[4%] top-12 hidden rotate-12 text-4xl text-yellow-300/50 lg:block">
          ★
        </div>

        <div className="absolute right-[5%] bottom-16 hidden text-4xl text-pink-300/40 lg:block">
          ♥
        </div>

        <div className="container-pad relative">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">
                <CalendarDays className="h-4 w-4" />
                Upcoming Events
              </span>

              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                What's happening at
                <span className="text-[#ef9e8a]"> Little Mahilam?</span>
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-slate-600">
                Explore upcoming celebrations, activities and community moments
                planned for our children and families.
              </p>
            </div>
          </div>

          <EventsList events={events} />
        </div>
      </section>

      {/* ======================================================
          EVENT HIGHLIGHTS
      ====================================================== */}

      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <Camera className="h-4 w-4" />
              Event Highlights
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
              Learning becomes even more special
              <span className="text-[#ef9e8a]"> when we celebrate it.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {eventHighlights.map((item, i) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[34px] bg-white shadow-[0_15px_50px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent" />

                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black text-slate-900 shadow-sm"
                    style={{
                      backgroundColor: TINTS[i % TINTS.length],
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FAMILY COMMUNITY
      ====================================================== */}

      <section className="overflow-hidden section-tint py-16 md:py-20">
        <div className="container-pad">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative mx-auto w-full max-w-[560px] py-5">
              <div className="relative h-[470px] overflow-hidden rounded-[100px_35px_100px_35px] border-[7px] border-white shadow-2xl">
                <Image
                  src={localImage("/images/events/family-moment.webp", 1)}
                  alt="Families participating in school event"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -bottom-2 right-0 flex max-w-[230px] items-center gap-3 rounded-[26px] bg-[#ef9e8a] px-5 py-4 text-white shadow-xl sm:-right-5">
                <Heart className="h-7 w-7 shrink-0 fill-white" />

                <div>
                  <div className="text-xs font-semibold text-white/70">
                    Together we create
                  </div>

                  <div className="font-black">Happy Memories</div>
                </div>
              </div>
            </div>

            <div>
              <span className="eyebrow">
                <Users className="h-4 w-4" />
                Family & Community
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">
                School becomes stronger when
                <span className="text-[#ef9e8a]">
                  {" "}
                  families are part of the journey.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Family participation helps children feel supported and creates
                stronger connections between home and school.
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                Our community events give parents opportunities to participate,
                interact and enjoy memorable moments alongside their children.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900"
              >
                Connect With Our School
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="py-14">
        <div className="container-pad">
          <div className="relative overflow-hidden rounded-[40px] mesh-dark grain px-7 py-10 text-white md:px-12 md:py-12">
            <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-yellow-300/10" />
            <div className="absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-pink-300/10" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  Be Part Of Our Community
                </span>

                <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight sm:text-3xl">
                  Your family's journey can start
                  <span className="text-yellow-300"> here.</span>
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-white/60">
                  Visit Little Mahilam and discover a learning community filled
                  with joyful experiences, celebrations and happy childhood
                  memories.
                </p>
              </div>

              <Link
                href="/admissions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-7 py-4 text-sm font-black text-emerald-950 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Explore Admissions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta
        eyebrow="Join our community"
        title="Your family's journey can start here."
      />
    </PublicShell>
  );
}