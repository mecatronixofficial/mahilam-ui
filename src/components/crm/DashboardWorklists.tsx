"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlarmClock, ArrowUpRight, Banknote, CheckCheck, ChevronRight, ClipboardCheck,
  GraduationCap, MessageCircle, Phone, Plus, TrendingUp, Wallet, type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { canAccessPage, isAdminRole, useAuth } from "@/store/auth";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, formatMoney, humanize } from "@/lib/media";
import { canonicalStage } from "./crm-shared";
import { whatsappLink } from "./constants";
import styles from "./dashboard-overview.module.css";

type Lead = {
  id: string; parentName: string; studentName: string; phone: string; whatsapp?: string;
  interestedClass: string; nextFollowUpDate?: string; status: string; createdAt: string;
};
type Finance = { collectedThisMonth: string; outstandingFees: string; pendingFees: number; events: number };
const QUICK: [string, LucideIcon, string][] = [
  ["/crm/enquiries?new=true", Plus, "Add enquiry"],
  ["/crm/admissions", ClipboardCheck, "Applications"],
  ["/crm/fees", Banknote, "Record payment"],
  ["/crm/reports", TrendingUp, "View reports"],
  ["/crm/students", GraduationCap, "Student records"],
];
function WorkLoading() {
  return <div className={styles.workLoading} aria-label="Loading records"><span /><span /><span /></div>;
}

export function DashboardWorklists({ params }: { params: string }) {
  const user = useAuth(state => state.user);
  const filter = new URLSearchParams(params);
  if (filter.has("program")) {
    filter.set("interestedClass", filter.get("program")!);
    filter.delete("program");
  }
  filter.set("purpose", "ADMISSION");
  const listFilter = filter.toString();
  filter.set("limit", "6");
  filter.set("page", "1");
  filter.set("sort", "createdAt");
  filter.set("order", "desc");
  const query = filter.toString();
  const recent = useQuery({
    queryKey: ["crm", "recent-worklist", query, user?.id],
    queryFn: () => api<{ data: Lead[] }>("/enquiries?" + query),
  });
  const due = useQuery({
    queryKey: ["crm", "due-worklist", query, user?.id],
    queryFn: () => api<{ data: Lead[] }>("/enquiries?" + query + "&followUpDue=true"),
  });
  const finance = useQuery({
    queryKey: ["dashboard-report", user?.id],
    queryFn: () => api<{ data: Finance }>("/reports/dashboard"),
    enabled: isAdminRole(user?.role),
  });

  return <>
    <div className={styles.workArea}>
      <section className={styles.card}>
        <div className={styles.cardHeading}>
          <div><h3>Latest enquiries</h3><p>The most recent families to reach out</p></div>
          <Link href={"/crm/enquiries?" + listFilter + "&all=true"}>View all<ChevronRight size={12} /></Link>
        </div>
        <QueryState query={recent} loading={<WorkLoading />}>
          {recent.data?.data.length ? <div className={styles.tableScroll}><table className={styles.recentTable}>
            <thead><tr><th>Child & parent</th><th>Program</th><th>Stage</th></tr></thead>
            <tbody>{recent.data.data.map(row => (
              <tr key={row.id}>
                <td><Link href={"/crm/enquiries/" + row.id}><span className={styles.personIcon}>{row.studentName.charAt(0).toUpperCase()}</span><span className={styles.personText}><strong title={row.studentName}>{row.studentName}</strong><small title={row.parentName}>{row.parentName}</small></span></Link></td>
                <td>{row.interestedClass}</td>
                <td><span className={styles.stagePill} data-enrolled={canonicalStage(row.status) === "ENROLLED"}>{humanize(canonicalStage(row.status))}</span><span className={styles.recentDate}>{formatDate(row.createdAt, { day: "numeric", month: "short" })}</span></td>
              </tr>
            ))}</tbody>
          </table></div> : <div className={styles.workEmpty}><MessageCircle size={22} /><strong>No enquiries here yet</strong><p>New family enquiries will appear here when they match your filters.</p></div>}
        </QueryState>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeading}>
          <div><h3>Follow-ups due{due.data && <span>{due.data.data.length}{due.data.data.length === 6 ? "+" : ""}</span>}</h3><p>A quick call can make a big difference</p></div>
          <Link href={"/crm/enquiries?" + listFilter + "&followUpDue=true"}>View all<ChevronRight size={12} /></Link>
        </div>
        <QueryState query={due} loading={<WorkLoading />}>
          {due.data?.data.length ? <ul className={styles.followList}>{due.data.data.map(row => {
            const whatsapp = whatsappLink(row.whatsapp || row.phone);
            return <li key={row.id}>
              <span className={styles.followIcon}><AlarmClock size={14} /></span>
              <Link className={styles.personText} href={"/crm/enquiries/" + row.id}><strong>{row.parentName}</strong><small>{row.studentName} · Due {formatDate(row.nextFollowUpDate, { day: "numeric", month: "short" })}</small></Link>
              <span className={styles.followActions}><a href={"tel:" + row.phone} aria-label={"Call " + row.parentName}><Phone size={13} /></a>{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={"WhatsApp " + row.parentName}><MessageCircle size={13} /></a>}</span>
            </li>;
          })}</ul> : <div className={styles.workEmpty}><CheckCheck size={24} /><strong>You're all caught up</strong><p>No families are due for contact in this selection.</p></div>}
        </QueryState>
      </section>
    </div>

    <nav className={styles.quickActions} aria-label="Dashboard quick actions">
      <span>Quick actions</span>
      {QUICK.filter(([href]) => canAccessPage(user?.role, href.split("?")[0])).map(([href, Icon, label]) => <Link key={href} href={href}><Icon size={12} />{label}<ArrowUpRight size={10} /></Link>)}
    </nav>

    {isAdminRole(user?.role) && <details className={styles.finance}>
      <summary><Wallet size={13} />School finance snapshot<span>All academic years</span></summary>
      <QueryState query={finance} loading={<WorkLoading />}>
        <div className={styles.financeGrid}>
          <Link href="/crm/fees"><small>Collected this month</small><strong>{formatMoney(finance.data?.data.collectedThisMonth)}</strong></Link>
          <Link href="/crm/fees"><small>Outstanding fees</small><strong>{formatMoney(finance.data?.data.outstandingFees)}</strong></Link>
          <Link href="/crm/fees"><small>Pending fee invoices</small><strong>{finance.data?.data.pendingFees ?? 0}</strong></Link>
          <Link href="/admin/events"><small>Upcoming school events</small><strong>{finance.data?.data.events ?? 0}</strong></Link>
        </div>
      </QueryState>
    </details>}
  </>;
}
