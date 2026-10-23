"use client";
import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

/** Click or drag-and-drop image uploader. Validates type and size before sending. */
export function ImageUpload({ label = "Upload image", onUploaded, onBusyChange }: { label?: string; onUploaded: (url: string) => void; onBusyChange?: (busy: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File) {
    if (!file || busy) return;
    if (!ACCEPT.includes(file.type)) { setError("Please choose a JPG, PNG, WebP or GIF image."); return; }
    if (file.size > MAX_BYTES) { setError("Images must be 5 MB or smaller."); return; }
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const result = await api<{ data: { url: string } }>("/integrations/uploads/image", { method: "POST", body });
      onUploaded(result.data.url);
      toast.success("Image uploaded");
    } catch (uploadError) {
      setError(errorMessage(uploadError, "Upload failed"));
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <input ref={input} className="hidden" type="file" accept={ACCEPT.join(",")} onChange={(event) => upload(event.target.files?.[0])} />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); upload(event.dataTransfer.files?.[0]); }}
        className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-5 text-sm font-bold transition disabled:cursor-wait ${dragging ? "border-current bg-white accent-text" : "border-little-neutral-300/70 bg-white/50 text-little-neutral-500 hover:bg-white/80"}`}
      >
        {busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
        {busy ? "Uploading…" : label}
        {!busy && <span className="text-[11px] font-semibold text-little-neutral-500">Click or drop · JPG, PNG, WebP · max 5 MB</span>}
      </button>
      {error && <p role="alert" className="mt-2 text-sm font-bold text-little-coral-600">{error}</p>}
    </div>
  );
}
