"use client";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, FilePlus2, FileX2, History, PencilLine } from "lucide-react";
import { api } from "@/lib/api";
import { QueryState } from "@/components/states/QueryState";
import { TableSkeleton } from "@/components/states/Skeletons";
import { humanize } from "@/lib/media";

type Log = { id: string; action: string; module: string; entityId?: string | null; createdAt: string; ip?: string | null; user?: { name: string; email: string } | null };
type Page = { data: Log[]; meta?: { page: number; pages: number; total: number } };

const MODULES = ["", "cms", "enquiries", "admissions", "students", "fees", "staff", "academics", "integrations"];

/** Actions are stored as "<METHOD> <route>", e.g. "PATCH /api/v1/cms/banners/:id". */
function describe(action: string) {
  const [method = "", route = ""] = action.split(" ");
  const parts = route.replace(/^\/?api\/v1\//, "").split("/").filter((part) => part && !part.startsWith(":"));
  const subject = humanize((parts.length > 1 ? parts.slice(1) : parts).join(" ").replace(/-/g, " ")).toLowerCase() || "record";
  if (method === "DELETE" || route.endsWith("/void")) return { verb: "deleted", subject, icon: FileX2, className: "bg-rose-100/80 text-rose-700" };
  if (method === "POST") return { verb: "created", subject, icon: FilePlus2, className: "bg-emerald-100/80 text-emerald-700" };
  return { verb: "updated", subject, icon: PencilLine, className: "bg-sky-100/80 text-sky-700" };
}

function relative(value: string) {
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export function AuditLog() {
  const [page, setPage] = useState(1);
  const [module, setModule] = useState("");
  const q = useQuery({
    queryKey: ["audit-logs", page, module],
    queryFn: () => api<Page>(`/reports/audit-logs?page=${page}&limit=30${module ? `&module=${module}` : ""}`),
    placeholderData: keepPreviousData,
  });
  const rows = q.data?.data ?? [];
  const meta = q.data?.meta;

  return (
    <div>
      <div className="panel mb-4 flex flex-wrap items-center gap-1.5 p-3">
        {MODULES.map((value) => (
          <button key={value || "all"} type="button" onClick={() => { setModule(value); setPage(1); }} className={`chip border ${module === value ? "dash-nav-active border-transparent" : "bg-white/60 text-slate-500 hover:bg-white"}`}>
            {value ? humanize(value) : "All modules"}
          </button>
        ))}
        {meta && <span className="ml-auto text-xs font-bold text-slate-400">{meta.total} entries</span>}
      </div>
      <QueryState query={q} isEmpty={rows.length === 0} loading={<TableSkeleton rows={8} cols={4} />} empty={{ title: "No activity recorded", description: "Changes made by staff will appear here." }}>
        <div className={`panel overflow-hidden transition-opacity ${q.isPlaceholderData ? "opacity-60" : ""}`}>
          <ol className="divide-y">
            {rows.map((log) => {
              const { icon: Icon, className, verb, subject } = describe(log.action);
              return (
                <li key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/50">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${className}`}><Icon className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm"><strong className="font-extrabold">{log.user?.name || "System"}</strong> <span className="text-slate-600">{verb} {subject}</span> <span className="chip ml-1 bg-slate-200/60 !py-0.5 text-slate-600">{humanize(log.module)}</span></p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">{[log.user?.email, log.entityId && `#${log.entityId.slice(0, 8)}`, log.ip].filter(Boolean).join(" · ")}</p>
                  </div>
                  <time dateTime={log.createdAt} title={new Date(log.createdAt).toLocaleString("en-IN")} className="shrink-0 text-xs font-bold text-slate-400">{relative(log.createdAt)}</time>
                </li>
              );
            })}
          </ol>
          {meta && meta.pages > 1 && (
            <div className="flex items-center justify-between border-t px-5 py-3">
              <button type="button" className="btn-soft !px-3 !py-1.5 !text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" />Newer</button>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><History className="h-3.5 w-3.5" />Page {meta.page} of {meta.pages}</span>
              <button type="button" className="btn-soft !px-3 !py-1.5 !text-xs" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>Older<ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </QueryState>
    </div>
  );
}
