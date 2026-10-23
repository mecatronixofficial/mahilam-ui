"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity, AlarmClock, ArrowDownRight, ArrowUpRight, CalendarDays, CheckCheck,
  ChevronRight, ClipboardCheck, Filter, GraduationCap, LayoutGrid,
  ListTodo, MessageCircle, Phone, Plus, RefreshCw, Sparkles, Target,
  UserPlus, Users, X, type LucideIcon,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { BRAND } from "@/lib/brand";
import { humanize } from "@/lib/media";
import { SCHOOL_TIME_ZONE, schoolDate } from "@/lib/school-date";
import { useAuth } from "@/store/auth";
import { QueryState } from "@/components/states/QueryState";
import { DashboardWorklists } from "./DashboardWorklists";
import { queryString, useCrmRefresh, useLookup } from "./crm-shared";
import styles from "./dashboard-overview.module.css";

type ChartDatum = { name: string; count: number };
type Dashboard = {
  metrics: Record<string, number>;
  monthly: { month: string; count: number }[];
  bySource: ChartDatum[];
  byProgram: ChartDatum[];
  byStage: ChartDatum[];
  counsellors: { id: string; name: string; enquiries: number; enrolled: number }[];
  conversionRate: number;
  conversionDefinition: string;
};
type Metric = {
  key: string; label: string; href: string; filter: string;
  icon: LucideIcon; tone: string; detail?: string;
};
const PRIMARY: Metric[] = [
  { key: "totalEnquiries", label: "Total enquiries", href: "/crm/enquiries", filter: "all=true", icon: Users, tone: "teal", detail: "Admission enquiries in this selection" },
  { key: "pendingFollowUps", label: "Pending follow-ups", href: "/crm/follow-ups", filter: "status=PENDING", icon: Phone, tone: "yellow", detail: "Families waiting to hear from us" },
  { key: "visitsScheduled", label: "School visits", href: "/crm/visits", filter: "status=SCHEDULED", icon: CalendarDays, tone: "pink", detail: "Scheduled visits to our school" },
  { key: "confirmedEnrollments", label: "Confirmed enrollments", href: "/crm/admissions", filter: "status=ENROLLED", icon: GraduationCap, tone: "green", detail: "Applications converted to students" },
];
const SECONDARY: Metric[] = [
  { key: "newEnquiries", label: "New enquiries", href: "/crm/enquiries", filter: "status=NEW_ENQUIRY", icon: UserPlus, tone: "teal" },
  { key: "todayEnquiries", label: "Today's enquiries", href: "/crm/enquiries", filter: "today=true", icon: Sparkles, tone: "yellow" },
  { key: "contactedLeads", label: "Contacted leads", href: "/crm/enquiries", filter: "status=CONTACTED", icon: MessageCircle, tone: "teal" },
  { key: "qualifiedLeads", label: "Qualified leads", href: "/crm/enquiries", filter: "status=QUALIFIED", icon: Target, tone: "green" },
  { key: "overdueFollowUps", label: "Overdue follow-ups", href: "/crm/follow-ups", filter: "view=OVERDUE&status=PENDING", icon: AlarmClock, tone: "coral" },
  { key: "applicationsSubmitted", label: "Applications submitted", href: "/crm/admissions", filter: "status=SUBMITTED", icon: ClipboardCheck, tone: "teal" },
  { key: "approvedAdmissions", label: "Approved admissions", href: "/crm/admissions", filter: "status=APPROVED", icon: CheckCheck, tone: "green" },
  { key: "lostLeads", label: "Lost leads", href: "/crm/enquiries", filter: "status=LOST", icon: ArrowDownRight, tone: "pink" },
  { key: "totalEnrolledStudents", label: "Enrolled students", href: "/crm/students", filter: "status=ACTIVE", icon: GraduationCap, tone: "green" },
  { key: "todayTasks", label: "Today's tasks", href: "/crm/tasks", filter: "view=TODAY&status=PENDING", icon: ListTodo, tone: "yellow" },
];
const number = new Intl.NumberFormat("en-IN");
const tooltipStyle = { borderRadius: 10, border: "1px solid " + BRAND.neutral[200], fontSize: 11, boxShadow: "0 6px 20px #24442010" };
const axisTick = { fontSize: 10, fill: BRAND.neutral[500] };

function MetricCard({ metric, value, href, loading, unavailable, compact = false }: {
  metric: Metric; value: number; href: string; loading: boolean; unavailable: boolean; compact?: boolean;
}) {
  const Icon = metric.icon;
  return (
    <Link href={href} className={compact ? styles.miniMetric : styles.metric} data-tone={metric.tone}>
      <span className={styles.metricIcon}><Icon size={compact ? 15 : 18} strokeWidth={1.8} /></span>
      <div className={styles.metricBody}>
        <span className={styles.metricLabel}>{metric.label}</span>
        <strong className={styles.metricValue}>
          {loading ? <span className={styles.numberSkeleton} /> : unavailable ? <span title="Data unavailable">—</span> : number.format(value)}
        </strong>
        {!compact && <span className={styles.metricDetail}>{metric.detail}</span>}
      </div>
      <ArrowUpRight className={styles.metricArrow} size={13} aria-hidden />
    </Link>
  );
}

function SmallChart({ title, subtitle, data, colour }: {
  title: string; subtitle: string; data: ChartDatum[]; colour: string;
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeading}><div><h3>{title}</h3><p>{subtitle}</p></div><span className={styles.chartMarker} style={{ background: colour }} /></div>
      {data.length ? <div className={styles.smallChart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 3, left: -25, bottom: 14 }}>
            <CartesianGrid vertical={false} stroke={BRAND.neutral[200]} strokeDasharray="3 4" />
            <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={value => String(value).length > 13 ? String(value).slice(0, 12) + "…" : String(value)} />
            <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: BRAND.neutral[50] }} />
            <Bar dataKey="count" name="Count" fill={colour} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div> : <div className={styles.emptyChart}><Activity size={20} /><p>No records in this selection</p></div>}
    </section>
  );
}

export function DashboardClient() {
  const user = useAuth(state => state.user);
  const refresh = useCrmRefresh();
  const years = useLookup("years"), classes = useLookup("classes"), staff = useLookup("staff");
  const [filters, setFilters] = useState({ academicYearId: "", from: "", to: "", program: "", assignedStaffId: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const params = queryString(filters);
  const report = useQuery({
    queryKey: ["crm", "dashboard", params, user?.id],
    queryFn: () => api<{ data: Dashboard }>("/crm/dashboard?" + params),
  });
  const data = report.data?.data;
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const change = (key: keyof typeof filters, value: string) => setFilters(current => ({ ...current, [key]: value }));
  const updated = report.dataUpdatedAt ? new Intl.DateTimeFormat("en-IN", { timeZone: SCHOOL_TIME_ZONE, hour: "numeric", minute: "2-digit" }).format(report.dataUpdatedAt) : "";
  const lookupErrors = [years, classes, staff].filter(query => query.isError);

  function drill(path: string, filter: string) {
    const p = new URLSearchParams(params);
    if (path === "/crm/enquiries") {
      p.set("purpose", "ADMISSION");
      if (filters.program) { p.delete("program"); p.set("interestedClass", filters.program); }
    }
    if (filter === "today=true") { p.set("from", schoolDate()); p.set("to", schoolDate()); }
    else new URLSearchParams(filter).forEach((value, key) => p.set(key, value));
    return path + "?" + p;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeading}>
        <div><p className={styles.eyebrow}><LayoutGrid size={12} /> Your school, at a glance</p><h2>School overview<span className={styles.titleDot} /></h2><p className={styles.pageDescription}>A little clarity for a happy, productive school day.</p></div>
        <div className={styles.headingActions}>
          <button type="button" className={styles.iconButton} onClick={refresh} disabled={report.isFetching} aria-label="Refresh dashboard" title="Refresh dashboard"><RefreshCw size={15} className={report.isFetching ? styles.spinning : undefined} /></button>
          <Link className={styles.outlineButton} href="/crm/pipeline">View pipeline<ChevronRight size={13} /></Link>
          <Link className={styles.primaryButton} href="/crm/enquiries?new=true"><Plus size={15} />New enquiry</Link>
        </div>
      </header>

      <section className={styles.filters} aria-label="Dashboard filters">
        <div className={styles.filterSummary}>
          <span><Filter size={13} />Filter overview{activeFilters > 0 && <b>{activeFilters}</b>}</span>
          <span className={styles.dataStatus} data-error={report.isError} role="status"><i />{report.isError ? "Data unavailable" : report.isFetching ? "Updating…" : updated ? "Updated " + updated : "Loading…"}</span>
          <button type="button" className={styles.filterToggle} aria-expanded={filtersOpen} aria-controls="overview-filter-fields" onClick={() => setFiltersOpen(open => !open)}>{filtersOpen ? "Hide" : "Show"} filters<ChevronRight size={12} /></button>
        </div>
        <div id="overview-filter-fields" className={styles.filterFields} data-open={filtersOpen}>
          <label><span>Academic year</span><select value={filters.academicYearId} onChange={e => change("academicYearId", e.target.value)}><option value="">All academic years</option>{years.data?.data.map(year => <option key={year.id} value={year.id}>{year.name}</option>)}</select></label>
          <label><span>Program</span><select value={filters.program} onChange={e => change("program", e.target.value)}><option value="">All programs</option>{[...new Set(classes.data?.data.map(level => level.name))].map(name => <option key={name}>{name}</option>)}</select></label>
          <label><span>Counsellor</span><select value={filters.assignedStaffId} onChange={e => change("assignedStaffId", e.target.value)}><option value="">All permitted staff</option>{staff.data?.data.filter(member => member.active !== false).map(member => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
          <label><span>From date</span><input type="date" value={filters.from} onChange={e => change("from", e.target.value)} /></label>
          <label><span>To date</span><input type="date" value={filters.to} onChange={e => change("to", e.target.value)} /></label>
          <button type="button" className={styles.resetFilters} aria-label="Reset filters" title="Reset filters" disabled={!activeFilters} onClick={() => setFilters({ academicYearId: "", from: "", to: "", program: "", assignedStaffId: "" })}><X size={14} /></button>
        </div>
        {lookupErrors.length > 0 && <p className={styles.filterError}>Some filter options could not load. <button type="button" onClick={() => lookupErrors.forEach(query => query.refetch())}>Retry</button></p>}
      </section>

      <div className={styles.primaryMetrics}>{PRIMARY.map(metric => <MetricCard key={metric.key} metric={metric} href={drill(metric.href, metric.filter)} value={data?.metrics[metric.key] ?? 0} loading={report.isPending} unavailable={report.isError} />)}</div>
      <div className={styles.secondaryMetrics} aria-label="More school metrics">{SECONDARY.map(metric => <MetricCard key={metric.key} metric={metric} href={drill(metric.href, metric.filter)} value={data?.metrics[metric.key] ?? 0} loading={report.isPending} unavailable={report.isError} compact />)}</div>

      <DashboardWorklists params={params} />

      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>The bigger picture</span><h2>Admissions insights</h2></div><Link href="/crm/reports">Explore reports<ArrowUpRight size={13} /></Link></div>
      <QueryState query={report} loading={<div className={styles.chartLoading}><span /><span /></div>}>
        {data && <>
          <div className={styles.analyticsTop}>
            <section className={styles.card}>
              <div className={styles.cardHeading}><div><h3>Enquiry activity</h3><p>Admission enquiries created by month</p></div><span className={styles.legend}><i />Enquiries</span></div>
              {data.monthly.length ? <div className={styles.activityChart}><ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthly} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                  <defs><linearGradient id="overview-enquiries-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BRAND.blue[400]} stopOpacity={0.35} /><stop offset="100%" stopColor={BRAND.blue[400]} stopOpacity={0.02} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke={BRAND.neutral[200]} strokeDasharray="3 4" />
                  <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={value => { const [year, month] = String(value).split("-"); return month ? new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1))) : String(value); }} />
                  <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="count" name="Enquiries" stroke={BRAND.blue[600]} strokeWidth={2.5} fill="url(#overview-enquiries-fill)" dot={{ r: 3, fill: BRAND.blue[600], strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer></div> : <div className={styles.emptyChart}><Activity size={20} /><p>No enquiries in this selection</p></div>}
            </section>
            <section className={styles.conversion}>
              <div className={styles.cardHeading}><div><h3>Enrollment conversion</h3><p>From first hello to first school day</p></div><GraduationCap size={19} /></div>
              <div className={styles.conversionBody}>
                <div className={styles.conversionRing} style={{ "--progress": Math.max(0, Math.min(100, data.conversionRate)) + "%" } as CSSProperties}><div><strong>{data.conversionRate}%</strong><span>conversion</span></div></div>
                <div><span className={styles.conversionCount}>{data.byStage.find(stage => stage.name === "ENROLLED")?.count ?? 0}<small> / {data.metrics.totalEnquiries ?? 0}</small></span><p>enquiries enrolled</p><Link href={drill("/crm/enquiries", "status=ENROLLED")}>View enrolled leads<ArrowUpRight size={12} /></Link></div>
              </div><p className={styles.conversionFootnote}>{data.conversionDefinition}</p>
            </section>
          </div>
          <div className={styles.analyticsGrid}>
            <SmallChart title="Enquiry sources" subtitle="Where families find our school" data={data.bySource.map(row => ({ ...row, name: humanize(row.name) }))} colour={BRAND.blue[500]} />
            <SmallChart title="Applications by program" subtitle="Programs chosen by our families" data={data.byProgram} colour={BRAND.pink[400]} />
            <SmallChart title="Pipeline stages" subtitle="How admissions are progressing" data={data.byStage.map(row => ({ ...row, name: humanize(row.name) }))} colour={BRAND.yellow[500]} />
            <section className={styles.card}>
              <div className={styles.cardHeading}><div><h3>Counsellor performance</h3><p>Assigned enquiries and enrolled leads</p></div><span className={styles.staffLegend}><i />Enquiries<i />Enrolled</span></div>
              {data.counsellors.length ? <div className={styles.smallChart}><ResponsiveContainer width="100%" height="100%"><BarChart data={data.counsellors} margin={{ top: 5, right: 3, left: -25, bottom: 14 }}><CartesianGrid vertical={false} stroke={BRAND.neutral[200]} strokeDasharray="3 4" /><XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: BRAND.neutral[50] }} /><Bar dataKey="enquiries" name="Enquiries" fill={BRAND.blue[400]} radius={[3, 3, 0, 0]} maxBarSize={22} /><Bar dataKey="enrolled" name="Enrolled" fill={BRAND.green[500]} radius={[3, 3, 0, 0]} maxBarSize={22} /></BarChart></ResponsiveContainer></div> : <div className={styles.emptyChart}><Users size={20} /><p>No assigned enquiries in this selection</p></div>}
            </section>
          </div>
        </>}
      </QueryState>
    </div>
  );
}
