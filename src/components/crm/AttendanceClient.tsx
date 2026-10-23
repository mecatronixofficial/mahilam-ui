"use client";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { schoolDate } from "@/lib/school-date";
import { QueryState } from "@/components/states/QueryState";
import type { PageMeta } from "@/components/dashboard/useCrud";
import { Pagination, queryString, useCrmRefresh, useLookup } from "./crm-shared";
import { useAuth } from "@/store/auth";
type Entry = { studentId: string; status: string; notes?: string };
type Student = { id: string; firstName: string; lastName?: string; admissionNumber: string };
export function AttendanceClient() {
  const user = useAuth(state => state.user);
  const writable = user?.role !== "ADMISSION_MANAGER";
  const refresh = useCrmRefresh();
  const classes = useLookup("classes");
  const [day, setDay] = useState(schoolDate()), [classId, setClass] = useState(""), [page, setPage] = useState(1);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const roster = useQuery({ queryKey: ["crm", "attendance-roster", classId, page], queryFn: () => api<{ data: Student[]; meta: PageMeta }>(`/students?${queryString({ classLevelId: classId, status: "ACTIVE", page, limit: 25 })}`), enabled: Boolean(classId) });
  const attendance = useQuery({ queryKey: ["crm", "attendance", day, classId], queryFn: async () => {
    const params = queryString({ classLevelId: classId, from: day, to: day, page: 1, limit: 200 });
    const result = await api<{ data: Entry[]; meta: PageMeta }>(`/crm/attendance?${params}`);
    for (let p = 2; p <= result.meta.pages; p++) { const next = await api<{ data: Entry[] }>(`/crm/attendance?${params.replace("page=1", `page=${p}`)}`); result.data.push(...next.data); }
    return result;
  }, enabled: Boolean(classId && day) });
  const save = useMutation({ mutationFn: () => api("/crm/attendance", { method: "POST", body: JSON.stringify({ day, entries: roster.data?.data.map(student => { const entry = entries[student.id] ?? attendance.data?.data.find(row => row.studentId === student.id); return { studentId: student.id, status: entry?.status ?? "PRESENT", notes: entry?.notes || undefined }; }) }) }), onSuccess: () => { refresh(); attendance.refetch(); setEntries({}); toast.success("Attendance saved"); }, onError: e => toast.error(errorMessage(e)) });
  return <><div className="panel mb-5 flex flex-wrap items-end gap-4 p-4"><label className="grid gap-1.5"><span className="label">Class</span><select className="input !w-auto" value={classId} onChange={e => { setClass(e.target.value); setPage(1); setEntries({}); }}><option value="">Select class…</option>{classes.data?.data.filter(c => c.active !== false).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="grid gap-1.5"><span className="label">School date</span><input className="input !w-auto" type="date" max={schoolDate()} value={day} onChange={e => { if (e.target.value) { setDay(e.target.value); setEntries({}); } }} /></label><button type="button" className="btn-soft" onClick={() => downloadFile(`/crm/reports/attendance/export?${queryString({ classLevelId: classId, from: day, to: day })}`, "attendance.csv").catch(e => toast.error(errorMessage(e)))}>Export day</button><Link className="btn-soft" href={`/crm/reports?kind=attendance&from=${day.slice(0, 7)}-01&to=${day}`}>Monthly report</Link></div>
    {!classId ? <p className="panel p-8 text-center text-sm text-little-neutral-500">Choose a class to mark or review attendance.</p> : <QueryState query={roster} isEmpty={!roster.data?.data.length} empty={{ title: "No active students in this class", description: "Check class assignments and student status." }}><QueryState query={attendance}><form onSubmit={e => { e.preventDefault(); save.mutate(); }}><div className="panel overflow-x-auto"><table className="dash-table"><thead><tr><th>Student</th><th>Status</th><th>Notes</th></tr></thead><tbody>{roster.data?.data.map(student => { const row = entries[student.id] ?? attendance.data?.data.find(entry => entry.studentId === student.id) ?? { studentId: student.id, status: "PRESENT" }; return <tr key={student.id}><td><Link className="font-bold underline-offset-4 hover:underline" href={`/crm/students/${student.id}`}>{student.firstName} {student.lastName}</Link><p className="text-xs text-little-neutral-500">{student.admissionNumber}</p></td><td><select className="input !w-auto" aria-label={`Attendance for ${student.firstName}`} value={row.status} disabled={!writable} onChange={e => setEntries({ ...entries, [student.id]: { ...row, status: e.target.value } })}>{["PRESENT", "ABSENT", "LATE", "EXCUSED"].map(value => <option key={value}>{value}</option>)}</select></td><td><input className="input" aria-label={`Attendance notes for ${student.firstName}`} maxLength={500} disabled={!writable} value={row.notes ?? ""} onChange={e => setEntries({ ...entries, [student.id]: { ...row, notes: e.target.value } })} /></td></tr>; })}</tbody></table></div>{writable && <button className="btn-primary mt-4" disabled={save.isPending || attendance.isPending || attendance.isError}>Save attendance for these {roster.data?.data.length} students</button>}<Pagination meta={roster.data?.meta} page={page} onPage={value => { setPage(value); setEntries({}); }} /></form></QueryState></QueryState>}
  </>;
}
