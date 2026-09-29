"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Eye, EyeOff, KeyRound, LoaderCircle, Mail, ShieldCheck, X } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { InlineNotice } from "@/components/states/StateView";
import { humanize } from "@/lib/media";

const RULES = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "Contains a letter", test: (value: string) => /[A-Za-z]/.test(value) },
  { label: "Contains a number", test: (value: string) => /\d/.test(value) },
];

export function AccountClient() {
  const user = useAuth((state) => state.user);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  const change = useMutation({
    mutationFn: () => api("/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) }),
    onSuccess: () => { toast.success("Password updated"); setDone(true); setForm({ currentPassword: "", newPassword: "", confirm: "" }); },
    onError: (error) => toast.error(errorMessage(error, "Couldn't change your password.")),
  });

  const valid = RULES.every((rule) => rule.test(form.newPassword));
  const mismatch = Boolean(form.confirm) && form.confirm !== form.newPassword;
  const same = Boolean(form.newPassword) && form.newPassword === form.currentPassword;
  const initials = user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "LM";

  return (
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <section className="panel-dark h-fit p-7">
        <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-xl font-extrabold text-slate-900">{initials}</span>
        <h2 className="mt-5 text-2xl font-extrabold">{user?.name}</h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-white/70"><Mail className="h-4 w-4" />{user?.email}</p>
        <span className="chip mt-4 bg-white/10 text-white"><ShieldCheck className="h-3.5 w-3.5" />{humanize(user?.role)}</span>
        <p className="mt-6 text-sm leading-6 text-white/60">
          {user?.role === "STAFF" ? "You can use the School CRM. Ask an administrator for website CMS access." : "You can use both the School CRM and the Website CMS."}
        </p>
      </section>

      <form onSubmit={(e) => { e.preventDefault(); if (valid && !mismatch && !same) change.mutate(); }} className="panel">
        <div className="flex items-center gap-3"><span className="accent-bg flex h-10 w-10 items-center justify-center rounded-xl"><KeyRound className="h-5 w-5" /></span><div><h2 className="text-lg font-extrabold">Change password</h2><p className="text-sm text-slate-500">Use a password you don&apos;t use anywhere else.</p></div></div>
        {done && <div className="mt-4"><InlineNotice variant="success">Your password was changed. Use the new one next time you sign in.</InlineNotice></div>}
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5"><span className="label">Current password</span><input className="input" type={show ? "text" : "password"} autoComplete="current-password" value={form.currentPassword} onChange={(e) => { setDone(false); setForm({ ...form, currentPassword: e.target.value }); }} required /></label>
          <label className="grid gap-1.5">
            <span className="label">New password</span>
            <span className="relative">
              <input className="input !pr-11" type={show ? "text" : "password"} autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required maxLength={128} aria-invalid={Boolean(form.newPassword) && !valid} />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide passwords" : "Show passwords"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-700">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
          </label>
          <ul className="grid gap-1 sm:grid-cols-3" aria-label="Password requirements">
            {RULES.map((rule) => {
              const ok = rule.test(form.newPassword);
              return <li key={rule.label} className={`flex items-center gap-1.5 text-xs font-bold ${ok ? "text-emerald-700" : "text-slate-400"}`}>{ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{rule.label}</li>;
            })}
          </ul>
          <label className="grid gap-1.5"><span className="label">Confirm new password</span><input className="input" type={show ? "text" : "password"} autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required aria-invalid={mismatch} />
            {mismatch && <span className="text-xs font-bold text-rose-600">Passwords don&apos;t match.</span>}
            {same && <span className="text-xs font-bold text-rose-600">Choose a password different from your current one.</span>}
          </label>
          <button className="btn-primary w-fit" disabled={change.isPending || !valid || mismatch || same || !form.confirm}>{change.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}Update password</button>
        </div>
      </form>
    </div>
  );
}
