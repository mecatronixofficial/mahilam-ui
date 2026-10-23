import { BookHeart, Building2, Palette, ShieldCheck, Sun, ToyBrick, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import type { GalleryAlbum } from "@/lib/server-api";

export type SpacePhoto = { id: string; src: string; alt: string; caption?: string | null };

/** Icons by key, so spaces can be passed to client components as plain data. */
export const SPACE_ICONS: Record<string, LucideIcon> = { classroom: Building2, play: ToyBrick, book: BookHeart, art: Palette, safe: ShieldCheck, sun: Sun };
export type SpaceIcon = keyof typeof SPACE_ICONS;

export type Space = {
  id: string;
  title: string;
  description: string;
  /** What children do there — used by the explorer. */
  inside: string;
  labels: string[];
  icon: SpaceIcon;
  tint: string;
  photos: SpacePhoto[];
};

/** The spaces the school already describes on its website. Admin → Facilities entries replace these when published. */
export const BUILT_IN = [
  { id: "classrooms", title: "Welcoming classrooms", description: "Comfortable learning spaces support conversation, group work and independent discovery.", inside: "Children gather for circle time, work together in small groups and explore learning materials at their own pace.", labels: ["Group learning", "Conversation", "Independent discovery"], icon: "classroom" as SpaceIcon, tint: BRAND.yellow[100] },
  { id: "play-spaces", title: "Play spaces", description: "Purposeful play areas encourage movement, imagination, sharing and joyful friendships.", inside: "Active games, pretend play and shared toys help children move, imagine and make friends.", labels: ["Movement", "Imagination", "Sharing"], icon: "play" as SpaceIcon, tint: BRAND.green[100] },
  { id: "reading-corners", title: "Reading corners", description: "Inviting book spaces help children slow down, listen and develop a love for stories.", inside: "Picture books and story time invite children to settle, listen and discover new words.", labels: ["Picture books", "Story time", "Quiet moments"], icon: "book" as SpaceIcon, tint: BRAND.pink[50] },
  { id: "activity-zones", title: "Activity zones", description: "Flexible areas make room for art, sensory experiences, music and hands-on projects.", inside: "Tables and open spaces are set up for painting, sensory play, music and making things.", labels: ["Art", "Sensory play", "Music"], icon: "art" as SpaceIcon, tint: BRAND.blue[50] },
  { id: "child-friendly", title: "Child-friendly design", description: "Spaces are organised around young learners, with safety and ease of movement in mind.", inside: "Rooms are arranged so little learners can move around easily and reach what they need.", labels: ["Made for little ones", "Easy to move around", "Organised"], icon: "safe" as SpaceIcon, tint: BRAND.coral[50] },
  { id: "bright", title: "Bright environment", description: "Cheerful surroundings help children feel comfortable, curious and ready to participate.", inside: "Colourful, welcoming rooms help children feel at ease and ready to join in.", labels: ["Cheerful", "Welcoming", "Comfortable"], icon: "sun" as SpaceIcon, tint: BRAND.yellow[50] },
];

const ICON_ORDER: SpaceIcon[] = ["classroom", "play", "book", "art", "safe", "sun"];
const TINTS = [BRAND.yellow[100], BRAND.green[100], BRAND.pink[50], BRAND.blue[50], BRAND.coral[50], BRAND.yellow[50]];

export type CmsFacility = { id: string; title: string; description?: string | null; image?: string | null };

/** Albums that look like campus photography (by title or category). */
const CAMPUS = /campus|facilit|classroom|space|school|room|play ?area|library|reading/i;

export function campusPhotos(albums: GalleryAlbum[]): SpacePhoto[] {
  return albums
    .filter((a) => CAMPUS.test(`${a.title} ${a.category ?? ""}`))
    .flatMap((a) => a.items.map((item) => ({ id: item.id, src: item.imageUrl, alt: item.altText || item.caption || `${a.title} at Little Mahilam Preschool`, caption: item.caption || a.title })));
}

/** Album photos whose album names this space (e.g. album "Reading corner" → space "Reading corners"). */
function photosFor(title: string, albums: GalleryAlbum[]): SpacePhoto[] {
  const key = title.toLowerCase().replace(/s\b/g, "");
  return albums
    .filter((a) => { const name = `${a.title} ${a.category ?? ""}`.toLowerCase().replace(/s\b/g, ""); const album = a.title.toLowerCase().replace(/s\b/g, "").trim(); return name.includes(key) || (album.length >= 5 && key.includes(album)); })
    .flatMap((a) => a.items.map((item) => ({ id: item.id, src: item.imageUrl, alt: item.altText || item.caption || `${title} at Little Mahilam Preschool`, caption: item.caption })));
}

/**
 * The spaces to show: published admin entries if there are any, otherwise the built-in list.
 * `localPhoto` returns a real file for a built-in space or null — a space never borrows an unrelated photo.
 */
export function buildSpaces(cms: CmsFacility[] | null, albums: GalleryAlbum[], localPhoto: (id: string) => string | null): Space[] {
  if (cms?.length) {
    return cms.map((f, i) => ({
      id: `space-${f.id}`,
      title: f.title,
      description: f.description ?? "",
      inside: f.description ?? "",
      labels: [],
      icon: ICON_ORDER[i % ICON_ORDER.length],
      tint: TINTS[i % TINTS.length],
      photos: [...(f.image ? [{ id: `${f.id}-cover`, src: f.image, alt: `${f.title} at Little Mahilam Preschool` }] : []), ...photosFor(f.title, albums)],
    }));
  }
  return BUILT_IN.map((s) => {
    const local = localPhoto(s.id);
    return { ...s, photos: [...(local ? [{ id: `${s.id}-local`, src: local, alt: `${s.title} at Little Mahilam Preschool` }] : []), ...photosFor(s.title, albums)] };
  });
}
