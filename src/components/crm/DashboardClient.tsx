"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlarmClock, ArrowRight, Banknote, ClipboardCheck, GraduationCap, MessageCircle, Phone, TrendingUp, UserPlus, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { InlineNotice } from "@/components/states/StateView";
import { formatDate, formatMoney, humanize } from "@/lib/media";
import { STATUS_STYLES, whatsappLink } from "./constants";

type Dashboard = { students: number; enquiries: number; admissions: number; pendingFees: number; events: number; totalEnquiries: number; enquiriesThisMonth: number; followUpsDue: number; collectedThisMonth: string | number; outstandingFees: string | number };
type Enquiry = { id: string; parentName: string; studentName: string; phone: string; whatsapp?: string | null; interestedClass: string; status: string; nextFollowUpDate?: string | null; createdAt?: string };

const CLOSED = new Set(["ADMISSION_CONFIRMED", "NOT_INTERESTED", "CLOSED"]);

export function DashboardClient() {
  const report = useQuery({ queryKey: ["dashboard-report"], queryFn: () => api<{ data: Dashboard }>("/reports/dashboard") });
  const enquiries = useQuery({ queryKey: ["enquiries"], queryFn: () => api<{ data: Enquiry[] }>("/enquiries") });
  const d = report.data?.data;
  const rows = enquiries.data?.data ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const due = rows.filter((row) => row.nextFollowUpDate && row.nextFollowUpDate.slice(0, 10) <= today && !CLOSED.has(row.status)).slice(0, 6);
  const recent = [...rows].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 6);
  const stat = { loading: report.isPending, unavailable: report.isError };

  return (
    <>
      {(report.isError || enquiries.isError) && !(report.isError && enquiries.isError) && (
        <div className="mb-5">
          <InlineNotice variant="partial" onRetry={() => { report.refetch(); enquiries.refetch(); }}>
            Showing partial data — {report.isError ? "school totals" : "the enquiry list"} couldn&apos;t be loaded.
          </InlineNotice>
        </div>
      )}
      {report.isError && enquiries.isError && (
        <div className="mb-5"><InlineNotice variant="error" onRetry={() => { report.refetch(); enquiries.refetch(); }}>We couldn&apos;t load today&apos;s numbers. Check your connection and retry.</InlineNotice></div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard {...stat} label="New enquiries" icon={UserPlus} tint="#0e9aa7" href="/crm/enquiries" value={d?.enquiries ?? 0} note={d ? `${d.enquiriesThisMonth} this month` : undefined} />
        <StatCard {...stat} label="Follow-ups due" icon={AlarmClock} tint="#f59e0b" href="/crm/enquiries" value={d?.followUpsDue ?? 0} note={d?.followUpsDue ? "Call these families today" : "All caught up"} />
        <StatCard {...stat} label="Active students" icon={GraduationCap} tint="#6366f1" href="/crm/students" value={d?.students ?? 0} note={d ? `${d.admissions} confirmed admissions` : undefined} />
        <StatCard {...stat} label="Collected this month" icon={Wallet} tint="#16a34a" href="/crm/fees" value={formatMoney(d?.collectedThisMonth)} note={d ? `${formatMoney(d.outstandingFees)} outstanding` : undefined} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">Today</p>
              <h2 className="mt-1 text-xl font-extrabold">Follow-ups due</h2>
            </div>
            <Link href="/crm/enquiries" className="accent-text inline-flex items-center gap-1 text-sm font-bold">All enquiries <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ul className="mt-4 divide-y">
            {enquiries.isPending && Array.from({ length: 3 }).map((_, i) => <li key={i} className="py-3"><div className="skeleton h-10" /></li>)}
            {!enquiries.isPending && !due.length && <li className="py-8 text-center text-sm font-bold text-slate-400">🎉 No follow-ups due. Great work!</li>}
            {due.map((row) => {
              const wa = whatsappLink(row.whatsapp || row.phone);
              return (
                <li key={row.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-700"><AlarmClock className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{row.parentName} <span className="font-semibold text-slate-400">· {row.studentName}, {row.interestedClass}</span></p>
                    <p className="text-xs font-bold text-amber-700">Due {formatDate(row.nextFollowUpDate)}</p>
                  </div>
                  <a href={`tel:${row.phone}`} aria-label={`Call ${row.parentName}`} className="rounded-xl border bg-white/70 p-2 text-slate-600 hover:bg-white"><Phone className="h-4 w-4" /></a>
                  {wa && <a href={wa} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${row.parentName}`} className="rounded-xl border bg-white/70 p-2 text-[#1da851] hover:bg-white"><MessageCircle className="h-4 w-4" /></a>}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel p-6">
          <p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">Pipeline</p>
          <h2 className="mt-1 text-xl font-extrabold">Latest enquiries</h2>
          <ul className="mt-4 grid gap-2">
            {enquiries.isPending && Array.from({ length: 4 }).map((_, i) => <li key={i}><div className="skeleton h-12" /></li>)}
            {!enquiries.isPending && !recent.length && <li className="py-8 text-center text-sm font-bold text-slate-400">No enquiries yet.</li>}
            {recent.map((row) => (
              <li key={row.id} className="flex items-center gap-3 rounded-2xl bg-white/50 px-3 py-2.5">
                <span className="accent-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">{row.studentName?.[0]}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{row.studentName} <span className="text-slate-400">· {row.interestedClass}</span></p><p className="truncate text-xs text-slate-500">{row.parentName}{row.createdAt ? ` · ${formatDate(row.createdAt)}` : ""}</p></div>
                <span className={`chip ${STATUS_STYLES[row.status] || STATUS_STYLES.NEW}`}>{humanize(row.status)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel-dark mt-6 p-6 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Quick actions</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {([
            ["/crm/enquiries", UserPlus, "Add enquiry"],
            ["/crm/admissions", ClipboardCheck, "Admissions board"],
            ["/crm/fees", Banknote, "Record payment"],
            ["/crm/reports", TrendingUp, "View reports"],
            ["/crm/students", GraduationCap, "Student records"],
          ] as const).map(([href, Icon, label]) => (
            <Link key={href} href={href} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3.5 text-sm font-bold text-white/80 transition hover:bg-white/[.12] hover:text-white">
              <span className="flex items-center gap-2.5"><Icon className="h-4 w-4 text-cyan-300" />{label}</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
