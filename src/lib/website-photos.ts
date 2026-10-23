import { safeContentImage } from "./page-content";
import { schoolPhoto, WEBSITE_PHOTO_SLOTS, websitePhotoKey } from "./school-photos";

type Settings = Record<string, unknown>;
const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

export function websitePhotoSettings(settings?: Settings | null): Settings {
  return Object.fromEntries(Object.entries(settings ?? {}).filter(([key]) => key.startsWith("public.website.photos.")));
}

export function resolveWebsitePhoto(settings: Settings, src: string, alt = "") {
  const slot = WEBSITE_PHOTO_SLOTS.find((slot) => slot.sourcePath === src);
  if (!slot) return { src, alt };
  const saved = object(object(object(settings[websitePhotoKey(slot.group)]).images)[slot.id]);
  const url = safeContentImage(saved.url);
  const photo = schoolPhoto(slot.photoId);
  return { src: url || slot.sourcePath, alt: url && typeof saved.alt === "string" && saved.alt.trim() ? saved.alt.trim().slice(0, 300) : photo.alt, slot: slot.id, position: slot.position };
}

