"use client";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { ArrowUpRight, CalendarDays, CheckCircle2, GraduationCap, Images, Megaphone, Newspaper, Plus, Settings, Star } from "lucide-react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { InlineNotice } from "@/components/states/StateView";

type Row = { active?: boolean; status?: string; startDate?: string; items?: unknown[] };

const RESOURCES = [
  { key: "announcements", endpoint: "/cms/announcements", label: "Live announcements", icon: Megaphone, tint: "#e2725b", href: "/admin/announcements", count: (rows: Row[]) => rows.filter((r) => r.active !== false).length },
  { key: "banners", endpoint: "/cms/banners", label: "Homepage banners", icon: Images, tint: "#0e9aa7", href: "/admin/banners", count: (rows: Row[]) => rows.filter((r) => r.active !== false).length },
  { key: "gallery", endpoint: "/cms/gallery", label: "Gallery photos", icon: Images, tint: "#d69e2e", href: "/admin/gallery", count: (rows: Row[]) => rows.reduce((sum, r) => sum + (r.items?.length || 0), 0) },
  { key: "events", endpoint: "/cms/events", label: "Upcoming events", icon: CalendarDays, tint: "#6366f1", href: "/admin/events", count: (rows: Row[]) => rows.filter((r) => r.startDate && r.startDate.slice(0, 10) >= new Date().toISOString().slice(0, 10)).length },
  { key: "testimonials", endpoint: "/cms/testimonials", label: "Reviews to approve", icon: Star, tint: "#f59e0b", href: "/admin/testimonials", count: (rows: Row[]) => rows.filter((r) => !r.active).length },
  { key: "blogs", endpoint: "/cms/blogs", label: "Published posts", icon: Newspaper, tint: "#16a34a", href: "/admin/blogs", count: (rows: Row[]) => rows.filter((r) => r.status === "PUBLISHED").length },
] as const;

const QUICK = [
  ["/admin/announcements", "New announcement", Megaphone],
  ["/admin/banners", "Create banner", Images],
  ["/admin/gallery", "Upload photos", Images],
  ["/admin/events", "Schedule event", CalendarDays],
  ["/admin/blogs", "Write a blog post", Newspaper],
  ["/admin/programs", "Update programs", GraduationCap],
] as const;

export function AdminDashboard() {
  const results = useQueries({
    queries: RESOURCES.map((resource) => ({ queryKey: ["admin-overview", resource.endpoint], queryFn: () => api<{ data: Row[] }>(resource.endpoint) })),
  });
  const failed = RESOURCES.filter((_, index) => results[index].isError);
  const pendingReviews = results[4].data ? RESOURCES[4].count(results[4].data.data) : 0;

  return (
    <>
      {failed.length > 0 && failed.length < RESOURCES.length && (
        <div className="mb-5">
          <InlineNotice variant="partial" onRetry={() => results.forEach((r) => r.isError && r.refetch())}>
            Showing partial data — {failed.map((f) => f.label.toLowerCase()).join(", ")} couldn&apos;t be loaded.
          </InlineNotice>
        </div>
      )}
      {failed.length === RESOURCES.length && (
        <div className="mb-5"><InlineNotice variant="error" onRetry={() => results.forEach((r) => r.refetch())}>Dashboard numbers are unavailable right now. Each CMS section still works independently.</InlineNotice></div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {RESOURCES.map((resource, index) => {
          const result = results[index];
          return (
            <StatCard
              key={resource.key}
              label={resource.label}
              icon={resource.icon}
              tint={resource.tint}
              href={resource.href}
              loading={result.isPending}
              unavailable={result.isError}
              value={result.data ? resource.count(result.data.data) : 0}
            />
          );
        })}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="panel-dark p-7 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#f7c85b]">Quick create</p>
              <h3 className="mt-2 text-2xl font-extrabold">What would you like to publish today?</h3>
            </div>
            <Plus className="hidden h-12 w-12 text-white/10 sm:block" />
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK.map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.06] px-4 py-4 font-bold text-white/80 backdrop-blur transition hover:bg-white/[.12] hover:text-white">
                <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-[#ef9e8a]" />{label}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <section className="panel p-7">
          <p className="accent-text text-xs font-black uppercase tracking-[.18em]">Content checklist</p>
          <h3 className="mt-2 text-xl font-extrabold">Keep the website fresh</h3>
          <ul className="mt-5 grid gap-3">
            {[
              [Star, pendingReviews ? `Approve ${pendingReviews} parent review${pendingReviews > 1 ? "s" : ""}` : "Parent reviews are up to date", "/admin/testimonials", pendingReviews === 0],
              [CalendarDays, "Check the upcoming event calendar", "/admin/events", false],
              [Newspaper, "Post a parenting tip this month (great for Google)", "/admin/blogs", false],
              [Settings, "Verify phone, hours & map details", "/admin/settings", false],
            ].map(([Icon, label, href, done]) => {
              const I = Icon as typeof Star;
              return (
                <li key={href as string}>
                  <Link href={href as string} className="group flex items-center gap-3 rounded-2xl p-2 text-sm font-bold text-slate-600 hover:bg-white/70 hover:text-slate-900">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${done ? "bg-emerald-100/80 text-emerald-700" : "accent-bg"}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : <I className="h-4 w-4" />}</span>
                    <span className="flex-1">{label as string}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
