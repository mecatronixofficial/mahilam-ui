"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LoaderCircle, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { ImageField, PublishToggle } from "@/components/dashboard/ui";
import { QueryState } from "@/components/states/QueryState";

type Photo = { id: string; slot: string; imageUrl: string; altText?: string | null; active: boolean; updatedAt?: string };

/** The fixed photo spots on /learning-approach. Keep the slot ids in sync with the API (LEARNING_PHOTO_SLOTS). */
export const LEARNING_SLOTS = [
  { slot: "hero-main", title: "Hero — classroom window", where: "Large arched photo at the top of the page", shape: "Portrait or square · at least 900 px wide", fallback: "/images/learning-approach/hero-classroom.webp", aspect: "aspect-[4/5]" },
  { slot: "hero-small", title: "Hero — small round photo", where: "Round photo beside the window", shape: "Square, child's face in the centre", fallback: "/images/learning-approach/hero-child.webp", aspect: "aspect-square" },
  { slot: "play-hands-on", title: "Play — Hands-on", where: "“Learning Through Play”, Hands-on button", shape: "Portrait · at least 900 px wide", fallback: "/images/learning-approach/play-hands-on.webp", aspect: "aspect-[4/4.4]" },
  { slot: "play-together", title: "Play — Together", where: "“Learning Through Play”, Together button", shape: "Portrait · at least 900 px wide", fallback: "/images/learning-approach/play-together.webp", aspect: "aspect-[4/4.4]" },
  { slot: "play-imagination", title: "Play — Imagination", where: "“Learning Through Play”, Imagination button", shape: "Portrait · at least 900 px wide", fallback: "/images/learning-approach/play-imagination.webp", aspect: "aspect-[4/4.4]" },
] as const;

type Slot = (typeof LEARNING_SLOTS)[number];
const QUERY_KEY = ["learning-photos"];

/** One card per photo spot: upload, describe, publish — or fall back to the built-in photo. */
export function LearningPhotosManager() {
  const list = useQuery({ queryKey: QUERY_KEY, queryFn: () => api<{ data: Photo[] }>("/cms/learning-photos") });
  const saved = new Map((list.data?.data ?? []).map((p) => [p.slot, p]));

  return (
    <div>
      <div className="panel mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="max-w-2xl text-sm leading-6 text-little-neutral-600">
          Each spot below matches a photo on the public Learning Approach page. Empty or hidden spots show the built-in school photo, so the page never looks broken.
        </p>
        <a href="/learning-approach" target="_blank" rel="noreferrer" className="btn-soft !px-3 !py-1.5 !text-xs"><ExternalLink className="h-3.5 w-3.5" /> View page</a>
      </div>
      <QueryState query={list} isEmpty={false}>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {LEARNING_SLOTS.map((slot) => (
            // Re-mount when the saved photo changes so the form starts from the latest value.
            <SlotCard key={`${slot.slot}:${saved.get(slot.slot)?.updatedAt ?? "none"}`} slot={slot} photo={saved.get(slot.slot)} />
          ))}
        </div>
      </QueryState>
    </div>
  );
}

function SlotCard({ slot, photo }: { slot: Slot; photo?: Photo }) {
  const client = useQueryClient();
  const [imageUrl, setImageUrl] = useState(photo?.imageUrl ?? "");
  const [altText, setAltText] = useState(photo?.altText ?? "");
  const [active, setActive] = useState(photo?.active ?? true);
  const refresh = () => client.invalidateQueries({ queryKey: QUERY_KEY });

  const save = useMutation({
    mutationFn: () => api(`/cms/learning-photos/${slot.slot}`, { method: "PUT", body: JSON.stringify({ imageUrl, altText: altText.trim() || null, active }) }),
    onSuccess: () => { toast.success(`${slot.title} saved`); refresh(); },
    onError: (error) => toast.error(errorMessage(error, "Couldn't save the photo.")),
  });
  const reset = useMutation({
    mutationFn: () => api(`/cms/learning-photos/${slot.slot}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Built-in photo restored"); refresh(); },
    onError: (error) => toast.error(errorMessage(error, "Couldn't reset the photo.")),
  });

  const live = photo && photo.active ? photo.imageUrl : slot.fallback;
  const dirty = imageUrl !== (photo?.imageUrl ?? "") || altText !== (photo?.altText ?? "") || active !== (photo?.active ?? true);

  return (
    <article className="panel flex flex-col overflow-hidden">
      <div className={`relative ${slot.aspect} max-h-64 w-full bg-little-neutral-100`}>
        <img src={live} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className={`chip absolute left-3 top-3 ${photo?.active ? "bg-little-green-100/90 text-little-green-800" : "bg-white/90 text-little-neutral-600"}`}>
          {photo?.active ? "Live: your photo" : photo ? "Live: built-in (yours is hidden)" : "Live: built-in photo"}
        </span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (imageUrl) save.mutate(); }} className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h3 className="font-extrabold">{slot.title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-little-neutral-500">{slot.where} · {slot.shape}</p>
        </div>
        <ImageField label="Photo" heightClass="h-36" value={imageUrl} onChange={setImageUrl} uploadLabel="Upload photo" />
        <label className="grid gap-1.5">
          <span className="label">Describe the photo</span>
          <input className="input" value={altText} maxLength={300} placeholder="e.g. Children building a block tower together" onChange={(e) => setAltText(e.target.value)} />
          <span className="text-[11px] text-little-neutral-500">Read aloud by screen readers and used by search engines.</span>
        </label>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-3">
          <PublishToggle active={active} onToggle={() => setActive((a) => !a)} />
          <button className="btn-primary !px-3 !py-1.5 !text-xs" disabled={!imageUrl || !dirty || save.isPending}>
            {save.isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
          </button>
          {photo && (
            <button type="button" disabled={reset.isPending} onClick={() => { if (window.confirm("Remove this photo and show the built-in one again?")) reset.mutate(); }} className="btn-soft !px-3 !py-1.5 !text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Use built-in
            </button>
          )}
        </div>
      </form>
    </article>
  );
}
