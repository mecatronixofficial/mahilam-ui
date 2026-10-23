"use client";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/media";
import { QueryState } from "@/components/states/QueryState";
import { useCrmRefresh } from "./crm-shared";
export function LeadAttachmentsClient({ enquiryId, readOnly }: { enquiryId: string; readOnly?: boolean }) {
  const refresh = useCrmRefresh();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const list = useQuery({ queryKey: ["crm", "attachments", enquiryId], queryFn: () => api<{ data: { id: string; filename: string; size: number; createdAt: string }[] }>(`/crm/enquiries/${enquiryId}/attachments`) });
  const save = useMutation({ mutationFn: ({ id }: { id?: string }) => {
    if (id) return api(`/crm/enquiries/${enquiryId}/attachments/${id}`, { method: "DELETE" });
    if (!file) throw new Error("Choose a document.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Choose a document up to 5 MB.");
    const body = new FormData(); body.set("file", file);
    return api(`/crm/enquiries/${enquiryId}/attachments`, { method: "POST", body });
  }, onSuccess: () => { refresh(); setFile(null); if (input.current) input.current.value = ""; toast.success("Private attachment saved"); }, onError: e => toast.error(errorMessage(e)) });
  return <section className="panel p-5"><h3 className="font-extrabold">Private enquiry attachments</h3><p className="mt-2 text-xs leading-5 text-little-neutral-500">PDF, PNG, JPEG or WebP, up to 5 MB each. Record parent privacy consent in Edit details before uploading. Files require an authorized school session.</p>{!readOnly && <form className="mt-4 flex flex-wrap gap-3" onSubmit={e => { e.preventDefault(); save.mutate({}); }}><input ref={input} className="input !w-auto max-w-full" type="file" aria-label="Private enquiry attachment" required accept="application/pdf,image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] ?? null)} /><button className="btn-primary" disabled={save.isPending}>Upload private attachment</button></form>}<div className="mt-5"><QueryState query={list} isEmpty={!list.data?.data.length} empty={{ title: "No attachments", description: "Private documents added to this enquiry will appear here." }}><ul className="grid gap-3">{list.data?.data.map(doc => <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"><div className="min-w-0"><p className="break-all text-sm font-bold">{doc.filename}</p><p className="mt-1 text-xs text-little-neutral-500">{Math.ceil(doc.size / 1024)} KB · {formatDate(doc.createdAt)}</p></div><div className="flex gap-2"><button type="button" className="btn-soft !px-3 !py-2 text-xs" onClick={() => downloadFile(`/crm/enquiries/${enquiryId}/attachments/${doc.id}`, doc.filename).catch(e => toast.error(errorMessage(e)))}>Download</button>{!readOnly && <button type="button" className="btn-soft !px-3 !py-2 text-xs" disabled={save.isPending} onClick={() => save.mutate({ id: doc.id })}>Archive</button>}</div></li>)}</ul></QueryState></div></section>;
}
