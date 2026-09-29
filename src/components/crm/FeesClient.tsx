"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Banknote, CircleDollarSign, Download, LoaderCircle, Plus, Receipt, Wallet } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { useIsAdmin } from "@/store/auth";
import { Drawer } from "@/components/dashboard/Drawer";
import { ListToolbar, matches } from "@/components/dashboard/ui";
import { StatCard } from "@/components/dashboard/StatCard";
import { QueryState } from "@/components/states/QueryState";
import { TableSkeleton } from "@/components/states/Skeletons";
import { formatDate, formatMoney, humanize } from "@/lib/media";
import { FEE_STATUSES, PAYMENT_METHODS, STATUS_STYLES } from "./constants";

type Fee = {
  id: string; label: string; originalAmount: string | number; discount: string | number; fine: string | number; paid: string | number; status: string; dueDate?: string | null;
  student?: { id?: string; admissionNumber?: string; firstName: string; lastName?: string | null } | null;
};
type Student = { id: string; admissionNumber: string; firstName: string; lastName?: string | null; status: string };

const n = (value: unknown) => Number(value ?? 0) || 0;
const balance = (fee: Fee) => Math.max(0, n(fee.originalAmount) - n(fee.discount) + n(fee.fine) - n(fee.paid));
const today = () => new Date().toISOString().slice(0, 10);

export function FeesClient() {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const q = useQuery({ queryKey: ["fees"], queryFn: () => api<{ data: Fee[] }>("/fees") });
  const studentsQ = useQuery({ queryKey: ["students"], queryFn: () => api<{ data: Student[] }>("/students") });
  const fees = q.data?.data ?? [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paying, setPaying] = useState<Fee | null>(null);
  const [payment, setPayment] = useState({ amount: "", method: "UPI", paidAt: today(), notes: "" });
  const [assigning, setAssigning] = useState(false);
  const [assign, setAssign] = useState({ studentId: "", label: "Term 1 tuition", originalAmount: "", discount: "", dueDate: "" });

  const refresh = () => ["fees", "dashboard-report", "reports-fees"].forEach((key) => qc.invalidateQueries({ queryKey: [key] }));

  const pay = useMutation({
    mutationFn: () => api<{ data?: { receiptNumber?: string } }>("/fees/payments", { method: "POST", body: JSON.stringify({ studentFeeId: paying!.id, amount: Number(payment.amount), method: payment.method, paidAt: payment.paidAt || null, notes: payment.notes.trim() || null }) }),
    onSuccess: (result) => { toast.success("Payment recorded", { description: result.data?.receiptNumber ? `Receipt ${result.data.receiptNumber}` : undefined }); setPaying(null); refresh(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const createFee = useMutation({
    mutationFn: () => api("/fees", { method: "POST", body: JSON.stringify({ studentId: assign.studentId, label: assign.label.trim(), originalAmount: Number(assign.originalAmount), discount: assign.discount ? Number(assign.discount) : undefined, dueDate: assign.dueDate || null }) }),
    onSuccess: () => { toast.success("Fee assigned"); setAssigning(false); setAssign({ studentId: "", label: "Term 1 tuition", originalAmount: "", discount: "", dueDate: "" }); refresh(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  function openPayment(fee: Fee) {
    setPaying(fee);
    setPayment({ amount: String(balance(fee) || ""), method: "UPI", paidAt: today(), notes: "" });
  }

  async function exportCsv(kind: "fees" | "payments") {
    try { await downloadFile(`/reports/export/${kind}.csv`, `${kind}.csv`); toast.success("Export downloaded"); }
    catch (error) { toast.error(errorMessage(error, "Export failed")); }
  }

  const studentName = (fee: Fee) => [fee.student?.firstName, fee.student?.lastName].filter(Boolean).join(" ") || "—";
  const isOverdue = (fee: Fee) => fee.status === "OVERDUE" || (balance(fee) > 0 && Boolean(fee.dueDate) && String(fee.dueDate).slice(0, 10) < today());
  const rows = fees.filter((fee) => (!status || fee.status === status) && matches(search, studentName(fee), fee.student?.admissionNumber, fee.label));

  const billed = fees.reduce((sum, fee) => sum + n(fee.originalAmount) - n(fee.discount) + n(fee.fine), 0);
  const collected = fees.reduce((sum, fee) => sum + n(fee.paid), 0);
  const outstanding = fees.reduce((sum, fee) => sum + balance(fee), 0);
  const overdue = fees.filter(isOverdue).length;
  const payAmount = Number(payment.amount);
  const overpay = paying ? payAmount > balance(paying) + 0.001 : false;

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total billed" icon={Receipt} tint="#6366f1" loading={q.isPending} unavailable={q.isError} value={formatMoney(billed)} />
        <StatCard label="Collected" icon={Wallet} tint="#16a34a" loading={q.isPending} unavailable={q.isError} value={formatMoney(collected)} note={billed ? `${Math.round((collected / billed) * 100)}% of billed` : undefined} />
        <StatCard label="Outstanding" icon={CircleDollarSign} tint="#0e9aa7" loading={q.isPending} unavailable={q.isError} value={formatMoney(outstanding)} />
        <StatCard label="Overdue fees" icon={AlertTriangle} tint="#e11d48" loading={q.isPending} unavailable={q.isError} value={overdue} />
      </div>

      <ListToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search student, admission no, fee…"
        filters={FEE_STATUSES.map((x) => ({ value: x, label: humanize(x) }))}
        filter={status}
        onFilter={setStatus}
        count={rows.length}
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button type="button" onClick={() => exportCsv("fees")} className="btn-soft !px-3 !py-2 text-sm" title="Export fees CSV"><Download className="h-4 w-4" /><span className="hidden sm:inline">Fees</span></button>
                <button type="button" onClick={() => exportCsv("payments")} className="btn-soft !px-3 !py-2 text-sm" title="Export payments CSV"><Download className="h-4 w-4" /><span className="hidden sm:inline">Payments</span></button>
              </>
            )}
            <button type="button" onClick={() => setAssigning(true)} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />Assign fee</button>
          </div>
        }
      />

      <QueryState query={q} loading={<TableSkeleton cols={7} />} isEmpty={rows.length === 0} empty={fees.length ? { title: "No fees match" } : { title: "No fees assigned yet", description: "Assign a fee to a student to start tracking payments.", action: { label: "Assign fee", onClick: () => setAssigning(true) } }}>
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead><tr>{["Student", "Fee", "Payable", "Paid", "Balance", "Due", "Status", ""].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((fee) => {
                  const due = balance(fee);
                  const payable = n(fee.originalAmount) - n(fee.discount) + n(fee.fine);
                  const progress = payable ? Math.min(100, (n(fee.paid) / payable) * 100) : 100;
                  return (
                    <tr key={fee.id} className={isOverdue(fee) ? "bg-rose-50/40" : ""}>
                      <td><div className="font-extrabold">{studentName(fee)}</div><div className="text-xs font-semibold text-slate-400">{fee.student?.admissionNumber}</div></td>
                      <td className="font-semibold">{fee.label}</td>
                      <td className="whitespace-nowrap tabular-nums">{formatMoney(payable)}{n(fee.discount) > 0 && <div className="text-[11px] font-bold text-emerald-600">−{formatMoney(fee.discount)} discount</div>}</td>
                      <td className="min-w-28 tabular-nums">
                        {formatMoney(fee.paid)}
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
                      </td>
                      <td className={`whitespace-nowrap font-extrabold tabular-nums ${due > 0 ? "" : "text-slate-300"}`}>{formatMoney(due)}</td>
                      <td className={`whitespace-nowrap text-xs font-bold ${isOverdue(fee) ? "text-rose-600" : "text-slate-500"}`}>{formatDate(fee.dueDate) || "—"}</td>
                      <td><span className={`chip ${STATUS_STYLES[fee.status] || STATUS_STYLES.PENDING}`}>{humanize(fee.status)}</span></td>
                      <td className="text-right">{due > 0 && fee.status !== "WAIVED" && <button type="button" onClick={() => openPayment(fee)} className="btn-soft whitespace-nowrap !px-3 !py-1.5 !text-xs"><Banknote className="h-3.5 w-3.5" />Record payment</button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </QueryState>

      <Drawer open={Boolean(paying)} onClose={() => setPaying(null)} width="max-w-md" eyebrow="Finance desk" title="Record a payment">
        {paying && (
          <form onSubmit={(e) => { e.preventDefault(); if (!overpay) pay.mutate(); }} className="grid gap-4">
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="font-extrabold">{studentName(paying)}</p>
              <p className="text-sm text-slate-500">{paying.label}</p>
              <p className="mt-2 text-sm font-bold">Balance due: <span className="text-lg">{formatMoney(balance(paying))}</span></p>
            </div>
            <label className="grid gap-1.5"><span className="label">Amount (₹) *</span><input className="input text-lg font-extrabold" type="number" min={0.01} step="0.01" inputMode="decimal" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} required aria-invalid={overpay} />
              {overpay && <span className="text-xs font-bold text-rose-600">That&apos;s more than the balance due.</span>}
            </label>
            <fieldset>
              <legend className="label mb-1.5">Method</legend>
              <div className="flex flex-wrap gap-1.5">{PAYMENT_METHODS.map((m) => <button key={m} type="button" onClick={() => setPayment({ ...payment, method: m })} aria-pressed={payment.method === m} className={`chip border ${payment.method === m ? "dash-nav-active border-transparent" : "bg-white/70 text-slate-600"}`}>{humanize(m)}</button>)}</div>
            </fieldset>
            <label className="grid gap-1.5"><span className="label">Date received</span><input className="input" type="date" max={today()} value={payment.paidAt} onChange={(e) => setPayment({ ...payment, paidAt: e.target.value })} /></label>
            <label className="grid gap-1.5"><span className="label">Notes</span><input className="input" placeholder="UPI ref / cheque no." value={payment.notes} onChange={(e) => setPayment({ ...payment, notes: e.target.value })} /></label>
            <button className="btn-primary" disabled={pay.isPending || overpay || !(payAmount > 0)}>{pay.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}Record {payAmount > 0 ? formatMoney(payAmount) : "payment"}</button>
          </form>
        )}
      </Drawer>

      <Drawer open={assigning} onClose={() => setAssigning(false)} width="max-w-md" eyebrow="Finance desk" title="Assign a fee">
        <form onSubmit={(e) => { e.preventDefault(); createFee.mutate(); }} className="grid gap-4">
          <label className="grid gap-1.5"><span className="label">Student *</span>
            <select className="input" value={assign.studentId} onChange={(e) => setAssign({ ...assign, studentId: e.target.value })} required>
              <option value="">{studentsQ.isPending ? "Loading students…" : "Choose student"}</option>
              {(studentsQ.data?.data ?? []).filter((s) => s.status === "ACTIVE").map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} · {s.admissionNumber}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5"><span className="label">Fee name *</span><input className="input" value={assign.label} onChange={(e) => setAssign({ ...assign, label: e.target.value })} required minLength={2} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5"><span className="label">Amount (₹) *</span><input className="input" type="number" min={0} step="0.01" value={assign.originalAmount} onChange={(e) => setAssign({ ...assign, originalAmount: e.target.value })} required /></label>
            <label className="grid gap-1.5"><span className="label">Discount (₹)</span><input className="input" type="number" min={0} step="0.01" value={assign.discount} onChange={(e) => setAssign({ ...assign, discount: e.target.value })} /></label>
          </div>
          <label className="grid gap-1.5"><span className="label">Due date</span><input className="input" type="date" value={assign.dueDate} onChange={(e) => setAssign({ ...assign, dueDate: e.target.value })} /></label>
          <button className="btn-primary" disabled={createFee.isPending}>{createFee.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Assign fee</button>
        </form>
      </Drawer>
    </>
  );
}
