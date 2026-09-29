"use client";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, Mail, Pencil, Plus, ShieldCheck } from "lucide-react";
import { useAuth, useIsAdmin } from "@/store/auth";
import { useCrud } from "@/components/dashboard/useCrud";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDelete, ListToolbar, matches, PublishToggle } from "@/components/dashboard/ui";
import { InlineNotice } from "@/components/states/StateView";
import { QueryState } from "@/components/states/QueryState";
import { humanize } from "@/lib/media";

type Staff = { id: string; name: string; email: string; role: "SUPER_ADMIN" | "ADMIN" | "STAFF"; active: boolean };

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: "bg-violet-100/80 text-violet-800",
  ADMIN: "bg-sky-100/80 text-sky-800",
  STAFF: "bg-slate-200/60 text-slate-600",
};
const EMPTY_FORM = { name: "", email: "", password: "", role: "STAFF" as "STAFF" | "ADMIN" };
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/;

export function StaffClient() {
  const me = useAuth((state) => state.user);
  const isAdmin = useIsAdmin();
  const crud = useCrud<Staff>("/staff", "Staff account", { queryKey: ["staff"] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");

  function close() { setOpen(false); setEditingId(null); setForm(EMPTY_FORM); setShowPassword(false); }
  function startEdit(row: Staff) { setEditingId(row.id); setForm({ name: row.name, email: row.email, password: "", role: row.role === "ADMIN" ? "ADMIN" : "STAFF" }); setOpen(true); }

  const passwordInvalid = Boolean(form.password) && !PASSWORD_RULE.test(form.password);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (passwordInvalid) return;
    if (editingId) {
      const payload: Record<string, string> = { name: form.name.trim(), email: form.email.trim(), role: form.role };
      if (form.password) payload.password = form.password;
      crud.update.mutate({ id: editingId, payload }, { onSuccess: close });
    } else {
      crud.create.mutate({ name: form.name.trim(), email: form.email.trim(), password: form.password }, { onSuccess: close });
    }
  }

  const rows = crud.rows.filter((row) => matches(search, row.name, row.email, row.role));

  return (
    <>
      {!isAdmin && <div className="mb-4"><InlineNotice variant="forbidden">You can view the team, but only administrators can add or change staff accounts.</InlineNotice></div>}
      <ListToolbar search={search} onSearch={setSearch} placeholder="Search team…" count={rows.length} actions={isAdmin ? <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setOpen(true); }} className="btn-primary !px-4 !py-2 text-sm"><Plus className="h-4 w-4" />Add staff</button> : undefined} />

      <QueryState query={crud.list} isEmpty={rows.length === 0} empty={{ title: "No staff accounts", description: "Create logins for teachers and office staff." }}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const isMe = r.id === me?.id;
            return (
              <article key={r.id} className={`panel p-5 ${r.active ? "" : "opacity-70"}`}>
                <div className="flex items-start gap-4">
                  <span className="accent-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold">{r.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-extrabold">{r.name}{isMe && <span className="ml-1.5 text-xs font-bold text-slate-400">(you)</span>}</h3>
                    <a href={`mailto:${r.email}`} className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-slate-500 hover:text-slate-800"><Mail className="h-3.5 w-3.5 shrink-0" />{r.email}</a>
                    <span className={`chip mt-2 ${ROLE_STYLES[r.role] || ROLE_STYLES.STAFF}`}>{r.role !== "STAFF" && <ShieldCheck className="h-3 w-3" />}{humanize(r.role)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t pt-3">
                  {isAdmin && !isMe ? (
                    <>
                      <PublishToggle active={r.active} on="Active" off="Disabled" pending={crud.patch.isPending} onToggle={() => crud.patch.mutate({ id: r.id, payload: { active: !r.active } })} />
                      <button type="button" onClick={() => startEdit(r)} aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-white"><Pencil className="h-4 w-4" /></button>
                      <span className="ml-auto"><ConfirmDelete compact pending={crud.remove.isPending} onConfirm={() => crud.remove.mutate(r.id)} /></span>
                    </>
                  ) : (
                    <span className={`chip ${r.active ? "bg-emerald-100/80 text-emerald-800" : "bg-slate-200/60 text-slate-500"}`}>{r.active ? "Active" : "Disabled"}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </QueryState>

      <Drawer open={open} onClose={close} width="max-w-md" eyebrow="Team access" title={editingId ? "Edit staff login" : "Create staff login"}>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-1.5"><span className="label">Full name *</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="grid gap-1.5"><span className="label">Email *</span><input className="input" type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          {editingId && (
            <label className="grid gap-1.5"><span className="label">Role</span><select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "STAFF" | "ADMIN" })}><option value="STAFF">Staff — CRM only</option><option value="ADMIN">Admin — CRM + website CMS</option></select></label>
          )}
          <label className="grid gap-1.5">
            <span className="label">{editingId ? "Reset password (optional)" : "Temporary password *"}</span>
            <span className="relative">
              <input className="input !pr-11" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} aria-invalid={passwordInvalid} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
            <span className={`text-xs font-semibold ${passwordInvalid ? "text-rose-600" : "text-slate-400"}`}>At least 8 characters with a letter and a number. Share it privately; they can change it under My Account.</span>
          </label>
          <div className="flex gap-3">
            <button className="btn-primary flex-1" disabled={crud.saving || passwordInvalid}>{crud.saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? "Save changes" : "Create login"}</button>
            <button type="button" onClick={close} className="btn-soft">Cancel</button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
