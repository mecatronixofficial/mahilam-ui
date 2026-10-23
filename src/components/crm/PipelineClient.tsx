"use client";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { humanize } from "@/lib/media";
import { useAuth } from "@/store/auth";
import { QueryState } from "@/components/states/QueryState";
import { ListToolbar } from "@/components/dashboard/ui";
import { Drawer } from "@/components/dashboard/Drawer";
import { canonicalStage, LEAD_STAGES, queryString, useCrmRefresh, useLookup } from "./crm-shared";
type Lead = { id: string; studentName: string; parentName: string; enquiryNumber: string; interestedClass: string; status: string; assignedStaff?: { name: string }; priority: string };
type Pipeline = { data: Lead[]; meta?: { pages: number } };
const managed = new Set(["APPLICATION_SUBMITTED", "APPROVED", "ENROLLED", "REJECTED"]);
export function PipelineClient() {
  const user = useAuth(state => state.user);
  const qc = useQueryClient();
  const refresh = useCrmRefresh();
  const [search, setSearch] = useState("");
  const [academicYearId, setYear] = useState("");
  const [program, setProgram] = useState("");
  const [assignee, setAssignee] = useState("");
  const [lost, setLost] = useState<{ id: string; reason: string } | null>(null);
  const years = useLookup("years"), classes = useLookup("classes"), staff = useLookup("staff");
  const params = queryString({ search, academicYearId, interestedClass: program, assignedStaffId: assignee, page: 1, limit: 200 });
  const key = ["crm", "pipeline", params, user?.id] as const;
  const query = useQuery({ queryKey: key, queryFn: async () => {
    const result = await api<Pipeline>(`/crm/pipeline?${params}`);
    for (let page = 2; page <= (result.meta?.pages ?? 1); page++) { const next = await api<Pipeline>(`/crm/pipeline?${params.replace("page=1", `page=${page}`)}`); result.data.push(...next.data); }
    return result;
  } });
  const move = useMutation({
    mutationFn: ({ id, status, lostReason }: { id: string; status: string; lostReason?: string }) => api(`/enquiries/${id}/stage`, { method: "PATCH", body: JSON.stringify({ status, lostReason }) }),
    onMutate: async variables => { await qc.cancelQueries({ queryKey: key }); const previous = qc.getQueryData<Pipeline>(key); qc.setQueryData<Pipeline>(key, old => old ? { ...old, data: old.data.map(row => row.id === variables.id ? { ...row, status: variables.status } : row) } : old); return { previous }; },
    onError: (error, _, context) => { if (context?.previous) qc.setQueryData(key, context.previous); toast.error(errorMessage(error)); },
    onSuccess: () => { setLost(null); toast.success("Pipeline stage saved"); }, onSettled: refresh,
  });
  function requestMove(id: string, status: string) {
    if (move.isPending) return;
    if (managed.has(status)) { toast.info("Use the application submission, review or enrollment action for this stage."); return; }
    if (status === "LOST") setLost({ id, reason: "" });
    else move.mutate({ id, status });
  }
  return <>
    <ListToolbar search={search} onSearch={setSearch} placeholder="Search families or enquiry number…" count={query.data?.data.length} />
    <div className="mb-5 grid gap-3 sm:grid-cols-3"><select className="input" aria-label="Academic year" value={academicYearId} onChange={e => setYear(e.target.value)}><option value="">All academic years</option>{years.data?.data.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select><select className="input" aria-label="Program" value={program} onChange={e => setProgram(e.target.value)}><option value="">All programs</option>{[...new Set(classes.data?.data.map(c => c.name))].map(name => <option key={name}>{name}</option>)}</select><select className="input" aria-label="Counsellor" value={assignee} onChange={e => setAssignee(e.target.value)}><option value="">All permitted counsellors</option>{staff.data?.data.filter(s => s.active !== false).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
    <p className="mb-4 text-xs text-little-neutral-500">Drag a card or use its stage selector. Application submission, approval and enrollment use the dedicated application workflow.</p>
    <QueryState query={query} isEmpty={!query.data?.data.length} empty={{ title: "No enquiries in this pipeline", description: "Change the filters or add an enquiry." }}>
      <div className="flex max-w-full gap-4 overflow-x-auto pb-5" aria-label="Admission pipeline">
        {LEAD_STAGES.map(stage => { const rows = query.data?.data.filter(row => canonicalStage(row.status) === stage) ?? []; return <section key={stage} aria-label={humanize(stage)} className="w-72 shrink-0 rounded-[22px] border bg-white/40 p-3" onDragOver={event => { if (!managed.has(stage) && !move.isPending) event.preventDefault(); }} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData("text/plain"); if (query.data?.data.some(row => row.id === id)) requestMove(id, stage); }}><div className="mb-3 flex items-center justify-between gap-2 px-1"><h2 className="text-xs font-extrabold">{humanize(stage)}</h2><span className="chip bg-white">{rows.length}</span></div><div className="grid gap-3">{rows.map(row => <article key={row.id} className="panel p-4" draggable={!move.isPending && !managed.has(canonicalStage(row.status))} onDragStart={event => event.dataTransfer.setData("text/plain", row.id)}><Link href={`/crm/enquiries/${row.id}`} className="font-extrabold underline-offset-4 hover:underline">{row.studentName}</Link><p className="mt-1 text-xs text-little-neutral-500">{row.enquiryNumber} · {row.interestedClass}</p><p className="mt-2 text-sm">{row.parentName}</p><p className="mt-1 text-xs text-little-neutral-500">{row.assignedStaff?.name ?? "Unassigned"} · {humanize(row.priority)}</p><select aria-label={`Move ${row.studentName} to stage`} className="input mt-3 !min-h-9 !py-1 text-xs" disabled={move.isPending || managed.has(canonicalStage(row.status))} value={canonicalStage(row.status)} onChange={event => requestMove(row.id, event.target.value)}>{LEAD_STAGES.map(value => <option key={value} value={value} disabled={managed.has(value)}>{humanize(value)}</option>)}</select></article>)}{!rows.length && <p className="rounded-2xl border-2 border-dashed p-5 text-center text-xs text-little-neutral-500">No enquiries</p>}</div></section>; })}
      </div>
    </QueryState>
    <Drawer open={Boolean(lost)} onClose={() => setLost(null)} title="Record a lost enquiry" eyebrow="Pipeline"><form onSubmit={event => { event.preventDefault(); if (lost) move.mutate({ id: lost.id, status: "LOST", lostReason: lost.reason }); }} className="grid gap-4"><label className="grid gap-2"><span className="label">Reason *</span><textarea className="input min-h-28" required minLength={2} maxLength={500} value={lost?.reason ?? ""} onChange={event => { if (lost) setLost({ ...lost, reason: event.target.value }); }} /></label><button className="btn-primary" disabled={move.isPending}>Save outcome</button></form></Drawer>
  </>;
}
