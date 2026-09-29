"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Percent, Table2, TrendingUp, UserPlus, Wallet, CircleDollarSign, BarChart3 } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { useIsAdmin } from "@/store/auth";
import { StatCard } from "@/components/dashboard/StatCard";
import { ErrorState } from "@/components/states/QueryState";
import { StateView } from "@/components/states/StateView";
import { formatMoney, humanize } from "@/lib/media";

/* Single-series charts: one validated hue (#2a78d6 on the panel surface), no legend, recessive grid. */
const SERIES = "#2a78d6";
const GRID = "rgba(15,23,42,.07)";
const AXIS = "#64748b";

type Monthly = { month: string; count: number; total?: string | number };
type EnquiryReport = { total: number; conversionRate: number; byStatus: { status: string; count: number }[]; bySource: { source: string; count: number }[]; monthly: Monthly[] };
type AdmissionReport = { byStatus: { status: string; count: number }[]; monthly: Monthly[] };
type FeeReport = { billed: string; paid: string; outstanding: string; collectedInRange: { amount: string; payments: number }; byMethod: { method: string; count: number; amount: string }[]; monthly: Monthly[] };

const RANGES = [{ months: 3, label: "3 months" }, { months: 6, label: "6 months" }, { months: 12, label: "12 months" }] as const;
const PIPELINE = ["APPLICATION", "DOCUMENT_PENDING", "VERIFICATION", "FEE_PENDING", "CONFIRMED", "REJECTED", "CANCELLED"];

function fromDate(months: number) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - (months - 1), 1).toISOString().slice(0, 10);
}

/** The API omits months with no rows; fill them so trends don't silently skip gaps. */
function fillMonths(rows: Monthly[], months: number, valueOf: (row?: Monthly) => number) {
  const byMonth = new Map(rows.map((row) => [row.month, row]));
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { key, label: date.toLocaleString("en-IN", { month: "short", year: months > 6 ? "2-digit" : undefined }), value: valueOf(byMonth.get(key)) };
  });
}

function ChartTooltip({ active, payload, label, money }: { active?: boolean; payload?: { value: number }[]; label?: string; money?: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="font-bold text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold text-slate-900">{money ? formatMoney(payload[0].value) : payload[0].value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, rows, money, children }: { title: string; subtitle: string; rows: { label: string; value: number }[]; money?: boolean; children: React.ReactNode }) {
  const [table, setTable] = useState(false);
  const empty = rows.every((row) => !row.value);
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="text-lg font-extrabold">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div>
        <button type="button" onClick={() => setTable((v) => !v)} aria-pressed={table} className="chip border bg-white/70 text-slate-500 hover:bg-white" title="Toggle table view">
          {table ? <BarChart3 className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}{table ? "Chart" : "Table"}
        </button>
      </div>
      <div className="mt-4">
        {empty ? (
          <p className="flex h-56 items-center justify-center rounded-2xl border-2 border-dashed text-sm font-bold text-slate-400">No data for this period yet</p>
        ) : table ? (
          <div className="max-h-64 overflow-y-auto rounded-2xl border bg-white/60">
            <table className="dash-table"><thead><tr><th>{title.includes("month") || title.includes("trend") ? "Month" : "Category"}</th><th className="text-right">Value</th></tr></thead>
              <tbody>{rows.map((row) => <tr key={row.label}><td>{row.label}</td><td className="text-right font-bold tabular-nums">{money ? formatMoney(row.value) : row.value}</td></tr>)}</tbody>
            </table>
          </div>
        ) : (
          <div className="h-64">{children}</div>
        )}
      </div>
    </section>
  );
}

function TrendChart({ data, money }: { data: { label: string; value: number }[]; money?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs><linearGradient id={`fill-${money ? "m" : "c"}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SERIES} stopOpacity={0.28} /><stop offset="100%" stopColor={SERIES} stopOpacity={0.02} /></linearGradient></defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 12 }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 12 }} tickFormatter={(v: number) => (money ? `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}` : String(v))} width={money ? 52 : 36} />
        <Tooltip cursor={{ stroke: AXIS, strokeDasharray: "3 3" }} content={<ChartTooltip money={money} />} />
        <Area type="monotone" dataKey="value" stroke={SERIES} strokeWidth={2} fill={`url(#fill-${money ? "m" : "c"})`} dot={false} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function RankBars({ data, money }: { data: { label: string; value: number }[]; money?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 8, bottom: 0 }} barCategoryGap={6}>
        <CartesianGrid horizontal={false} stroke={GRID} />
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={120} tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }} />
        <Tooltip cursor={{ fill: "rgba(42,120,214,.06)" }} content={<ChartTooltip money={money} />} />
        <Bar dataKey="value" fill={SERIES} radius={[0, 4, 4, 0]} maxBarSize={22}>
          <LabelList dataKey="value" position="right" formatter={(v: unknown) => (money ? formatMoney(v) : String(v))} style={{ fill: "#334155", fontSize: 12, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ReportsClient() {
  const isAdmin = useIsAdmin();
  const [months, setMonths] = useState<number>(6);
  const from = fromDate(months);
  const enquiries = useQuery({ queryKey: ["reports-enquiries", from], queryFn: () => api<{ data: EnquiryReport }>(`/reports/enquiries?from=${from}`) });
  const admissions = useQuery({ queryKey: ["reports-admissions", from], queryFn: () => api<{ data: AdmissionReport }>(`/reports/admissions?from=${from}`) });
  const fees = useQuery({ queryKey: ["reports-fees", from], queryFn: () => api<{ data: FeeReport }>(`/reports/fees?from=${from}`), enabled: isAdmin });

  const e = enquiries.data?.data;
  const a = admissions.data?.data;
  const f = fees.data?.data;

  const enquiryTrend = fillMonths(e?.monthly ?? [], months, (row) => row?.count ?? 0);
  const bySource = [...(e?.bySource ?? [])].sort((x, y) => y.count - x.count).map((row) => ({ label: humanize(row.source), value: row.count }));
  const byStage = PIPELINE.map((status) => ({ label: humanize(status), value: a?.byStatus.find((row) => row.status === status)?.count ?? 0 })).filter((row, index) => index < 5 || row.value > 0);
  const feeTrend = fillMonths(f?.monthly ?? [], months, (row) => Number(row?.total ?? 0));
  const byMethod = [...(f?.byMethod ?? [])].sort((x, y) => Number(y.amount) - Number(x.amount)).map((row) => ({ label: humanize(row.method), value: Number(row.amount) }));

  async function exportCsv(kind: string) {
    try { await downloadFile(`/reports/export/${kind}.csv${kind === "enquiries" || kind === "payments" ? `?from=${from}` : ""}`, `${kind}.csv`); toast.success("Export downloaded"); }
    catch (error) { toast.error(errorMessage(error, "Export failed")); }
  }

  if (enquiries.isError && admissions.isError) return <ErrorState error={enquiries.error} onRetry={() => { enquiries.refetch(); admissions.refetch(); }} />;

  return (
    <div className="grid gap-6">
      <div className="panel flex flex-wrap items-center gap-2 p-3">
        <span className="px-2 text-xs font-black uppercase tracking-[.14em] text-slate-400">Period</span>
        {RANGES.map((range) => (
          <button key={range.months} type="button" onClick={() => setMonths(range.months)} aria-pressed={months === range.months} className={`chip border ${months === range.months ? "dash-nav-active border-transparent" : "bg-white/60 text-slate-500 hover:bg-white"}`}>Last {range.label}</button>
        ))}
        {isAdmin && (
          <div className="ml-auto flex flex-wrap gap-2">
            {["enquiries", "students", "fees", "payments"].map((kind) => (
              <button key={kind} type="button" onClick={() => exportCsv(kind)} className="btn-soft !px-3 !py-1.5 !text-xs"><Download className="h-3.5 w-3.5" />{humanize(kind)} CSV</button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enquiries in period" icon={UserPlus} tint="#0e9aa7" loading={enquiries.isPending} unavailable={enquiries.isError} value={e?.total ?? 0} />
        <StatCard label="Enquiry → admission" icon={Percent} tint="#6366f1" loading={enquiries.isPending} unavailable={enquiries.isError} value={`${e?.conversionRate ?? 0}%`} note="Conversion rate" />
        {isAdmin ? (
          <>
            <StatCard label="Collected in period" icon={Wallet} tint="#16a34a" loading={fees.isPending} unavailable={fees.isError} value={formatMoney(f?.collectedInRange.amount)} note={f ? `${f.collectedInRange.payments} payments` : undefined} />
            <StatCard label="Outstanding fees" icon={CircleDollarSign} tint="#e11d48" loading={fees.isPending} unavailable={fees.isError} value={formatMoney(f?.outstanding)} />
          </>
        ) : (
          <div className="sm:col-span-2"><StateView compact variant="forbidden" title="Finance reports are for administrators" description="Enquiry and admission insights are shown below." /></div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {enquiries.isPending ? <div className="panel skeleton h-80" /> : enquiries.isError ? <ErrorState compact error={enquiries.error} onRetry={() => enquiries.refetch()} /> : (
          <ChartCard title="Enquiries per month" subtitle="New family enquiries from every source" rows={enquiryTrend}><TrendChart data={enquiryTrend} /></ChartCard>
        )}
        {enquiries.isPending ? <div className="panel skeleton h-80" /> : enquiries.isError ? null : (
          <ChartCard title="Where families find us" subtitle="Enquiries by source — invest in what works" rows={bySource}><RankBars data={bySource} /></ChartCard>
        )}
        {admissions.isPending ? <div className="panel skeleton h-80" /> : admissions.isError ? <ErrorState compact error={admissions.error} onRetry={() => admissions.refetch()} /> : (
          <ChartCard title="Admissions pipeline" subtitle="Applications at each stage" rows={byStage}><RankBars data={byStage} /></ChartCard>
        )}
        {isAdmin && (fees.isPending ? <div className="panel skeleton h-80" /> : fees.isError ? <ErrorState compact error={fees.error} onRetry={() => fees.refetch()} /> : (
          <ChartCard title="Fee collections per month" subtitle="Payments received (voided excluded)" rows={feeTrend} money><TrendChart data={feeTrend} money /></ChartCard>
        ))}
        {isAdmin && f && byMethod.length > 0 && (
          <ChartCard title="Collections by payment method" subtitle="Amount received in the period" rows={byMethod} money><RankBars data={byMethod} money /></ChartCard>
        )}
      </div>

      <p className="flex items-center gap-2 text-xs font-semibold text-slate-400"><TrendingUp className="h-3.5 w-3.5" />Figures update live from the school database. Exports contain personal data — store them securely.</p>
    </div>
  );
}
