import photos from "@/data/school-photos.json";
import slots from "@/data/website-photo-slots.json";
import type { GalleryAlbum } from "./server-api";

export const SCHOOL_PHOTOS = photos;
export const WEBSITE_PHOTO_SLOTS = slots;
export const PHOTO_GROUP_LABELS: Record<string, string> = { home: "Home page", about: "About page", programs: "Programs", learning: "Learning approach", activities: "Activities", facilities: "Facilities", gallery: "Gallery", events: "Events", other: "Contact, admissions and other pages" };
export const websitePhotoKey = (group: string) => `public.website.photos.${group}`;

export function schoolPhoto(id: string) {
  const photo = SCHOOL_PHOTOS.find((photo) => photo.id === id);
  if (!photo) throw new Error(`Unknown school photo: ${id}`);
  return photo;
}

/** Real supplied photographs remain available even before the CMS is reachable. */
export function schoolAlbums(): GalleryAlbum[] {
  return [...new Set(SCHOOL_PHOTOS.map((photo) => photo.category))].map((category) => ({
    id: `school-${category}`, title: category, category,
    slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    items: SCHOOL_PHOTOS.filter((photo) => photo.category === category).map((photo) => ({ id: photo.id, imageUrl: photo.src, caption: photo.caption, altText: photo.alt })),
  }));
}
