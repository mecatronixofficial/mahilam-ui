import { WEBSITE_PHOTO_SLOTS, schoolPhoto } from "./school-photos";
/** Section documents are stored as JSON in the existing, role-protected CMS settings API. */
export type PageId = "home" | "about";
export type SectionContent = { text: Record<string, string>; images: Record<string, { url: string; alt: string }> };
export type ContentField = { key: string; label: string; fallback: string; multiline?: boolean };
export type ContentPhoto = { key: string; label: string; fallback: string; alt: string };
export type ContentSection = { id: string; title: string; fields: ContentField[]; photos: ContentPhoto[] };

const field = (key: string, label: string, fallback: string, multiline = false): ContentField => ({ key, label, fallback, multiline });
const photo = (key: string, label: string, fallback = "/imgs/home/kid1.jpg", alt = label): ContentPhoto => ({ key, label, fallback, alt });
const section = (id: string, title: string, heading: string, eyebrow: string, description = "", photos: ContentPhoto[] = [], extra: ContentField[] = []): ContentSection => ({
  id, title, fields: [field("heading", "Heading", heading), field("eyebrow", "Section label", eyebrow), ...(description ? [field("description", "Description", description, true)] : []), ...extra], photos,
});
const reviews = () => section("testimonials", "Parent reviews", "What families say.", "Parent voices", "Real experiences shared by families in our Little Mahilam community.");
const explore = () => section("explore", "Discover more", "Life at Little Mahilam.", "Discover more");

export const PAGE_SECTIONS: Record<PageId, ContentSection[]> = {
  home: [
    section("hero", "Hero (default slide)", "A School of Happiness.", "Kangayam Road · Tiruppur", "A child-centric preschool where children explore, discover and grow through joyful play-way learning.", [photo("main", "Hero photo", undefined, "Children learning at Little Mahilam Preschool")]),
    section("pillars", "Happy learning", "Little minds. Big imagination.", "Happy learning", "A joyful learning environment in Tiruppur where every child can play, explore, create, communicate and grow with confidence.", [], [
      ...["Child-Centric", "Play-Way Learning", "Multiple Intelligence"].map((title, i) => field(`title${i}`, `Card ${i + 1} heading`, title)),
      ...["Every child learns at their own pace with care, attention and encouragement.", "Concepts come alive through play, stories, games and hands-on activities.", "We nurture creativity, language, movement, music, social and thinking skills."].map((text, i) => field(`text${i}`, `Card ${i + 1} description`, text, true)),
    ]),
    section("welcome", "Welcome collage", "A school filled with smiles, stories and discovery.", "Welcome little learners", "Little Mahilam Preschool gives children in Tiruppur a happy, secure and inspiring beginning to their learning journey — through play, movement, stories, creativity and meaningful everyday experiences.", [photo("main", "Welcome main photo"), photo("small", "Welcome round photo", "/imgs/home/kid2.avif")]),
    section("programs", "Programs", "A happy learning journey for every age.", "Our programs"),
    section("activities", "Activities", "More than books. More ways to grow.", "Fun every day", "Every day includes creative, physical, social and imaginative activities for young children."),
    section("moments", "Happy moments", "Little moments. Beautiful memories.", "Happy moments", "A peek into the everyday smiles, friendships and discoveries at our school.", Array.from({ length: 4 }, (_, i) => photo(`photo${i}`, `Moment ${i + 1}`, i === 1 || i === 2 ? "/imgs/home/kid2.avif" : "/imgs/home/kid1.jpg"))),
    section("neighbourhood", "Our neighbourhood", "A neighbourhood preschool families trust.", "Right here in Tiruppur", "Located on Kangayam Road in Valliammai Nagar, Little Mahilam welcomes children from across Tiruppur and nearby areas. Visit us to see why parents choose us as their child’s first school."),
    explore(), reviews(),
    section("review-form", "Share your experience", "Your story can help another family.", "Share your experience", "Are you a Little Mahilam parent? Tell us what your family values about the school. Reviews are checked before they appear publicly."),
    section("admissions", "Admissions invitation", "Give your child a happy beginning.", "Admissions open", "Send an enquiry for Play Group, Pre-KG, LKG, UKG or Grades 1–3 and our team will call you back to arrange a campus visit."),
  ],
  about: [
    section("hero", "About hero", "Where little minds learn, play & shine!", "Welcome to Little Mahilam", "A joyful School of Happiness where every child gets the freedom to explore, imagine, create and grow.", [photo("main", "Hero main photo"), photo("small", "Hero round photo", "/imgs/home/kid2.avif")]),
    section("story", "Our story", "A happy beginning for every little learner.", "Our Story", "", [photo("main", "Story book photo")]),
    section("vision", "Our vision", "More than a school. A place to be happy.", "Our Vision", "We want children to look forward to coming to school every day — meeting friends, discovering new ideas and enjoying meaningful childhood experiences.", [], [
      ...["Happy Children", "Happy Learning", "Happy Growth"].map((title, i) => field(`title${i}`, `Vision ${i + 1} heading`, title)),
      ...["Creating a warm environment where children feel comfortable, valued and excited to participate.", "Making learning enjoyable through play, stories, movement, creativity and exploration.", "Supporting emotional, social, physical and intellectual development together."].map((text, i) => field(`text${i}`, `Vision ${i + 1} description`, text, true)),
    ]),
    section("founders", "Our founders", "Meet the hearts behind our School of Happiness", "Meet Our Founders", "Little Mahilam was envisioned by educators who believe that early childhood education should feel joyful, meaningful and respectful of every child's uniqueness.", [photo("founder0", "Ramya Mahilam portrait", ""), photo("founder1", "Sneha Balumani portrait", "")], [field("name0", "First founder name", "Ramya Mahilam"), field("role0", "First founder role", "Founder"), field("name1", "Second founder name", "Sneha Balumani"), field("role1", "Second founder role", "Founder")]),
    section("philosophy", "Our philosophy", "How do little minds learn best?", "Our Philosophy", "Our approach creates meaningful experiences that help children discover, participate, communicate and grow naturally.", [], [
      ...["Child-Centric", "Play-Way Learning", "Multiple Intelligence"].map((title, i) => field(`title${i}`, `Pillar ${i + 1} heading`, title)),
      ...["Every child's pace, curiosity, emotions and unique voice shape the way we teach and support learning.", "Children discover ideas through games, stories, exploration, creativity and meaningful hands-on activities.", "We nurture different strengths including language, movement, creativity, music, logic and social intelligence."].map((text, i) => field(`text${i}`, `Pillar ${i + 1} description`, text, true)),
    ]),
    section("day", "Our happy day", "A little day at Little Mahilam", "Our Happy Day", "From the first hello to the happy goodbye, every hour has its own small adventure."),
    section("values", "Our values", "Childhood comes first in everything we do.", "What Matters To Us", "Our values guide our classrooms, activities and interactions with children and families every day.", [photo("main", "Children together")]),
    reviews(),
    section("game", "Memory game", "Match the animal friends!", "Little Game"),
    section("invitation", "School gate invitation", "Come play, learn & grow with us.", "You're invited", "Visit Little Mahilam and experience our School of Happiness — our classrooms, activities, learning environment and the joyful experiences we create for young children."),
    explore(),
  ],
};

// Match CMS defaults to the actual supplied photo at each Home and About position.
for (const page of ["home", "about"] as const) {
  for (const section of PAGE_SECTIONS[page]) {
    for (const photo of section.photos) {
      const slot = WEBSITE_PHOTO_SLOTS.find((slot) => slot.group === page && slot.section === section.id && slot.field === photo.key);
      if (slot) { photo.fallback = slot.sourcePath; photo.alt = schoolPhoto(slot.photoId).alt; }
    }
  }
}

export const contentKey = (page: PageId, section: string) => `public.page.${page}.${section}`;
export function isPageContentKey(key: string) { return /^public\.page\.(home|about)\./.test(key); }
const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

/** Reject malformed settings and unsafe URLs before passing CMS data to rendering components. */
export function safeContentImage(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const url = value.trim();
  if (/[\\\u0000-\u0020]/.test(url)) return undefined;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    if (["https:", "http:"].includes(parsed.protocol) && !parsed.username && !parsed.password) return url;
  } catch { /* Use the built-in image. */ }
  return undefined;
}

export function parseSectionContent(value: unknown, definition: ContentSection): SectionContent {
  const input = record(value);
  const rawText = record(input.text);
  const rawImages = record(input.images);
  const text: SectionContent["text"] = {};
  const images: SectionContent["images"] = {};
  for (const field of definition.fields) {
    const value = rawText[field.key];
    if (typeof value === "string" && value.trim()) text[field.key] = value.trim().slice(0, field.multiline ? 5000 : 300);
  }
  for (const photo of definition.photos) {
    const image = record(rawImages[photo.key]);
    const url = safeContentImage(image.url);
    if (url) images[photo.key] = { url, alt: typeof image.alt === "string" ? image.alt.trim().slice(0, 300) : "" };
  }
  return { text, images };
}

export function pageContent(settings: Record<string, unknown> | null | undefined, page: PageId): Record<string, SectionContent> {
  return Object.fromEntries(PAGE_SECTIONS[page].map((section) => [section.id, parseSectionContent(settings?.[contentKey(page, section.id)], section)]));
}
export const contentText = (content: SectionContent | undefined, key: string) => content?.text[key] || undefined;
export const contentImage = (content: SectionContent | undefined, key: string, fallback: string, alt: string) => ({ src: content?.images[key]?.url || fallback, alt: content?.images[key]?.alt || alt });
