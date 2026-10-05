"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, CalendarDays, LoaderCircle, Plus, School, Users } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { useIsAdmin } from "@/store/auth";
import { QueryState } from "@/components/states/QueryState";
import { InlineNotice } from "@/components/states/StateView";

type Year = { id: string; name: string; startDate: string; endDate: string; current: boolean; active: boolean };
type Section = { id: string; name: string; capacity?: number | null; room?: string | null; active: boolean; _count?: { students: number } };
type ClassLevel = { id: string; name: string; code: string; displayOrder: number; active: boolean; academicYearId?: string | null; sections: Section[]; _count?: { students: number } };

export function AcademicsClient() {
  const isAdmin = useIsAdmin();
  const qc = useQueryClient();
  const yearsQ = useQuery({ queryKey: ["academics-years"], queryFn: () => api<{ data: Year[] }>("/academics/years") });
  const classesQ = useQuery({ queryKey: ["academics-classes"], queryFn: () => api<{ data: ClassLevel[] }>("/academics/classes") });
  const [year, setYear] = useState({ name: "", startDate: "", endDate: "", current: false, active: true });
  const [classForm, setClassForm] = useState({ name: "", code: "", displayOrder: 0, academicYearId: "", active: true });
  const [section, setSection] = useState({ classLevelId: "", name: "", capacity: "", room: "", active: true });

  const refresh = () => { qc.invalidateQueries({ queryKey: ["academics-years"] }); qc.invalidateQueries({ queryKey: ["academics-classes"] }); };
  const fail = (error: unknown) => toast.error(errorMessage(error));
  const createYear = useMutation({ mutationFn: () => api("/academics/years", { method: "POST", body: JSON.stringify(year) }), onSuccess: () => { toast.success("Academic year added"); setYear({ name: "", startDate: "", endDate: "", current: false, active: true }); refresh(); }, onError: fail });
  const createClass = useMutation({ mutationFn: () => api("/academics/classes", { method: "POST", body: JSON.stringify({ ...classForm, code: classForm.code.trim().toUpperCase().replace(/\s+/g, "-"), academicYearId: classForm.academicYearId || null }) }), onSuccess: () => { toast.success("Class added"); setClassForm({ name: "", code: "", displayOrder: 0, academicYearId: "", active: true }); refresh(); }, onError: fail });
  const createSection = useMutation({ mutationFn: () => api("/academics/sections", { method: "POST", body: JSON.stringify({ ...section, capacity: section.capacity ? Number(section.capacity) : null, room: section.room.trim() || null }) }), onSuccess: () => { toast.success("Section added"); setSection({ classLevelId: "", name: "", capacity: "", room: "", active: true }); refresh(); }, onError: fail });

  const years = yearsQ.data?.data ?? [];
  const classes = classesQ.data?.data ?? [];
  return <>
    {!isAdmin && <div className="mb-5"><InlineNotice variant="forbidden">Academic setup is read-only for staff. Administrators can create years, classes and sections.</InlineNotice></div>}
    {isAdmin && <div className="mb-6 grid gap-4 xl:grid-cols-3">
      <form onSubmit={(e) => { e.preventDefault(); createYear.mutate(); }} className="panel grid gap-3"><h2 className="flex items-center gap-2 font-extrabold"><CalendarDays className="h-5 w-5" />Academic year</h2><input className="input" placeholder="2026-2027" pattern="\d{4}-\d{4}" value={year.name} onChange={(e) => setYear({ ...year, name: e.target.value })} required /><div className="grid grid-cols-2 gap-2"><label className="grid gap-1"><span className="label">Starts</span><input className="input" type="date" value={year.startDate} onChange={(e) => setYear({ ...year, startDate: e.target.value })} required /></label><label className="grid gap-1"><span className="label">Ends</span><input className="input" type="date" value={year.endDate} onChange={(e) => setYear({ ...year, endDate: e.target.value })} required /></label></div><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={year.current} onChange={(e) => setYear({ ...year, current: e.target.checked })} />Set as current year</label><button className="btn-primary" disabled={createYear.isPending}>{createYear.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add year</button></form>
      <form onSubmit={(e) => { e.preventDefault(); createClass.mutate(); }} className="panel grid gap-3"><h2 className="flex items-center gap-2 font-extrabold"><BookOpen className="h-5 w-5" />Class</h2><div className="grid grid-cols-2 gap-2"><input className="input" placeholder="Class name" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} required /><input className="input" placeholder="Code, e.g. LKG" value={classForm.code} onChange={(e) => setClassForm({ ...classForm, code: e.target.value })} required /></div><select className="input" value={classForm.academicYearId} onChange={(e) => setClassForm({ ...classForm, academicYearId: e.target.value })}><option value="">No academic year</option>{years.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><input className="input" type="number" min={0} placeholder="Display order" value={classForm.displayOrder} onChange={(e) => setClassForm({ ...classForm, displayOrder: Number(e.target.value) })} /><button className="btn-primary" disabled={createClass.isPending}>{createClass.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add class</button></form>
      <form onSubmit={(e) => { e.preventDefault(); createSection.mutate(); }} className="panel grid gap-3"><h2 className="flex items-center gap-2 font-extrabold"><School className="h-5 w-5" />Section</h2><select className="input" value={section.classLevelId} onChange={(e) => setSection({ ...section, classLevelId: e.target.value })} required><option value="">Choose class</option>{classes.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><div className="grid grid-cols-2 gap-2"><input className="input" placeholder="Section name" value={section.name} onChange={(e) => setSection({ ...section, name: e.target.value })} required /><input className="input" placeholder="Room" value={section.room} onChange={(e) => setSection({ ...section, room: e.target.value })} /></div><input className="input" type="number" min={1} max={500} placeholder="Capacity" value={section.capacity} onChange={(e) => setSection({ ...section, capacity: e.target.value })} /><button className="btn-primary" disabled={createSection.isPending}>{createSection.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add section</button></form>
    </div>}
    <QueryState query={classesQ} isEmpty={!classes.length} empty={{ title: "No classes configured", description: "Add an academic year and the school's classes to organise student records." }}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{classes.map((row) => <article key={row.id} className="panel p-5"><div className="flex items-start justify-between"><div><h3 className="text-lg font-extrabold">{row.name}</h3><p className="text-xs font-bold text-slate-400">{row.code}</p></div><span className="chip bg-indigo-100 text-indigo-800"><Users className="h-3.5 w-3.5" />{row._count?.students ?? 0}</span></div><div className="mt-4 grid gap-2">{row.sections.length ? row.sections.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-sm"><span className="font-bold">Section {item.name}{item.room ? ` · ${item.room}` : ""}</span><span className="text-xs text-slate-500">{item._count?.students ?? 0}{item.capacity ? ` / ${item.capacity}` : ""}</span></div>) : <p className="text-sm text-slate-400">No sections</p>}</div></article>)}</div>
    </QueryState>
  </>;
}
