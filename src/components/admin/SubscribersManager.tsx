"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Copy, Download, MailCheck, MailX, Users } from "lucide-react";
import { useCrud } from "@/components/dashboard/useCrud";
import { ConfirmDelete, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";
import { formatDate, humanize } from "@/lib/media";

type Subscriber = { id: string; email: string; source: string; active: boolean; createdAt: string };

const FILTERS = [
  { value: "active", label: "Subscribed" },
  { value: "inactive", label: "Unsubscribed" },
] as const;

function downloadCsv(rows: Subscriber[]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = ["Email,Status,Source,Joined", ...rows.map((r) => [r.email, r.active ? "Subscribed" : "Unsubscribed", humanize(r.source), r.createdAt.slice(0, 10)].map(escape).join(","))];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv` });
  link.click();
  URL.revokeObjectURL(url);
}

export function SubscribersManager() {
  const crud = useCrud<Subscriber>("/newsletter", "Subscriber", { queryKey: ["newsletter-subscribers"] });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const all = crud.rows;
  const activeRows = all.filter((r) => r.active);
  const rows = all.filter((r) => (!filter || (filter === "active") === r.active) && matches(search, r.email));

  async function copyActive() {
    try {
      await navigator.clipboard.writeText(activeRows.map((r) => r.email).join(", "));
      toast.success(`Copied ${activeRows.length} email${activeRows.length === 1 ? "" : "s"} — paste into BCC`);
    } catch {
      toast.error("Couldn't copy. Use Export CSV instead.");
    }
  }

  const stats = [
    { label: "Total sign-ups", value: all.length, icon: Users, tint: "#6366f1" },
    { label: "Subscribed", value: activeRows.length, icon: MailCheck, tint: "#16a34a" },
    { label: "Unsubscribed", value: all.length - activeRows.length, icon: MailX, tint: "#e2725b" },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="panel flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${tint}1a`, color: tint }}><Icon className="h-5 w-5" /></span>
            <span>
              <span className="block text-2xl font-extrabold">{value}</span>
              <span className="block text-xs font-bold text-slate-500">{label}</span>
            </span>
          </div>
        ))}
      </div>

      <div>
        <ListToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Search emails…"
          filters={FILTERS}
          filter={filter}
          onFilter={setFilter}
          count={rows.length}
          actions={
            <div className="flex gap-2">
              <button type="button" onClick={copyActive} disabled={!activeRows.length} className="btn-soft !px-3 !py-2 !text-xs"><Copy className="h-3.5 w-3.5" /> Copy emails</button>
              <button type="button" onClick={() => downloadCsv(rows)} disabled={!rows.length} className="btn-primary !px-3 !py-2 !text-xs"><Download className="h-3.5 w-3.5" /> Export CSV</button>
            </div>
          }
        />
        <QueryState
          query={crud.list}
          isEmpty={rows.length === 0}
          empty={all.length ? { title: "No matches", description: "Try a different search or filter." } : { title: "No subscribers yet", description: "Sign-ups from the website footer will appear here." }}
        >
          <div className="panel divide-y overflow-hidden p-0">
            {rows.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <a href={`mailto:${r.email}`} className="block truncate font-extrabold hover:underline">{r.email}</a>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Joined {formatDate(r.createdAt)}</span>
                    <span className="chip bg-slate-200/60 text-slate-600">{humanize(r.source)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PublishToggle active={r.active} on="Subscribed" off="Unsubscribed" pending={crud.patch.isPending} onToggle={() => crud.patch.mutate({ id: r.id, payload: { active: !r.active } })} />
                  <ConfirmDelete compact pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} />
                </div>
              </div>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
