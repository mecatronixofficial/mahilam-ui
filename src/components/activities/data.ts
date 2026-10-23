import { BRAND } from "@/lib/brand";
import type { ActivityArt } from "./PlayArt";

export type ActivityFilter = "creative" | "physical" | "educational" | "outdoor";

export const FILTERS: { id: ActivityFilter | "all"; label: string }[] = [
  { id: "all", label: "All Activities" },
  { id: "creative", label: "Creative" },
  { id: "physical", label: "Physical" },
  { id: "educational", label: "Educational" },
  { id: "outdoor", label: "Outdoor" },
];

export type PlayActivity = {
  id: string;
  title: string;
  /** One line for the playground zones. */
  short: string;
  /** A little more for the explorer. */
  text: string;
  skills: string[];
  filters: ActivityFilter[];
  art: ActivityArt;
  color: string;
  soft: string;
  image?: string | null;
  /** Published from Admin → Activities. */
  fromCms?: boolean;
};

export const ACTIVITIES: PlayActivity[] = [
  { id: "art", title: "Art & Craft", short: "Paint, glue, cut and create.", text: "Open-ended art lets children choose colours, textures and shapes — building imagination, focus and fine-motor control.", skills: ["Imagination", "Fine motor", "Focus"], filters: ["creative"], art: "art", color: BRAND.pink[300], soft: BRAND.pink[50] },
  { id: "music", title: "Music & Dance", short: "Clap, sing and move to the beat.", text: "Rhymes, rhythm instruments and dance help children listen carefully, remember patterns and express themselves.", skills: ["Rhythm", "Listening", "Expression"], filters: ["creative", "physical"], art: "music", color: BRAND.yellow[400], soft: BRAND.yellow[50] },
  { id: "outdoor", title: "Outdoor Games", short: "Run, chase, throw and cheer.", text: "Active games in the open air build strong bodies, turn-taking and the joy of playing as a team.", skills: ["Teamwork", "Coordination", "Fair play"], filters: ["physical", "outdoor"], art: "outdoor", color: BRAND.green[400], soft: BRAND.green[50] },
  { id: "story", title: "Storytelling", short: "Listen, imagine and retell.", text: "Picture books, puppets and story circles grow vocabulary, attention and a lifelong love of books.", skills: ["Language", "Listening", "Imagination"], filters: ["educational", "creative"], art: "story", color: BRAND.blue[300], soft: BRAND.blue[50] },
  { id: "sensory", title: "Sensory Play", short: "Squish, pour, sift and feel.", text: "Sand, water, dough and textures invite children to explore with all their senses and describe what they notice.", skills: ["Curiosity", "Describing", "Calm focus"], filters: ["educational"], art: "sensory", color: BRAND.coral[300], soft: BRAND.coral[50] },
  { id: "yoga", title: "Yoga & Movement", short: "Stretch, balance and breathe.", text: "Simple poses, balancing games and breathing make children aware of their bodies and help them settle.", skills: ["Balance", "Body awareness", "Calm"], filters: ["physical"], art: "yoga", color: BRAND.pink[200], soft: BRAND.pink[50] },
  { id: "nature", title: "Nature Exploration", short: "Look closely, wonder often.", text: "Leaves, seeds, bugs and weather spark questions — and a gentle sense of caring for the world around us.", skills: ["Observation", "Questions", "Care"], filters: ["outdoor", "educational"], art: "nature", color: BRAND.green[300], soft: BRAND.green[50] },
  { id: "building", title: "Creative Building", short: "Stack it, test it, build it again.", text: "Blocks and construction toys turn ideas into towers and bridges, building early maths and problem-solving.", skills: ["Problem-solving", "Shapes", "Patience"], filters: ["creative", "educational"], art: "building", color: BRAND.blue[400], soft: BRAND.blue[50] },
];

/** Admin activities don't carry filter groups, so guess them (and an icon) from the name; unknown ones show under "All". */
const HINTS: { re: RegExp; filters: ActivityFilter[]; art: ActivityArt }[] = [
  { re: /art|craft|paint|draw|colour|color|clay/i, filters: ["creative"], art: "art" },
  { re: /music|song|danc|rhythm|sing/i, filters: ["creative", "physical"], art: "music" },
  { re: /yoga|exercise|movement|sport|gym/i, filters: ["physical"], art: "yoga" },
  { re: /outdoor|garden|park|game|play ?ground/i, filters: ["physical", "outdoor"], art: "outdoor" },
  { re: /story|book|read|phonic|language|rhyme/i, filters: ["educational"], art: "story" },
  { re: /nature|plant|science|discover|explor/i, filters: ["educational", "outdoor"], art: "nature" },
  { re: /block|build|lego|puzzle|math|number/i, filters: ["educational", "creative"], art: "building" },
  { re: /sensory|sand|water|cook|baking|dough/i, filters: ["educational"], art: "sensory" },
];

export type CmsActivity = { id: string; name: string; slug?: string; description?: string | null; image?: string | null; benefits?: string | null };

export function fromCms(row: CmsActivity, i: number): PlayActivity {
  const hint = HINTS.find((h) => h.re.test(row.name));
  const palette = ACTIVITIES[i % ACTIVITIES.length];
  return {
    id: `cms-${row.id}`,
    title: row.name,
    short: row.description?.split(/(?<=[.!?])\s/)[0] ?? "",
    text: row.description ?? "",
    skills: (row.benefits ?? "").split(/[,\n•]+/).map((s) => s.trim()).filter(Boolean).slice(0, 4),
    filters: hint?.filters ?? [],
    art: hint?.art ?? palette.art,
    color: palette.color,
    soft: palette.soft,
    image: row.image,
    fromCms: true,
  };
}

/** Built-in activities plus anything published in the admin area; an admin entry replaces a built-in one with the same name. */
export function mergeActivities(cms: CmsActivity[] | null): PlayActivity[] {
  const published = (cms ?? []).map(fromCms);
  const names = new Set(published.map((a) => a.title.trim().toLowerCase()));
  return [...ACTIVITIES.filter((a) => !names.has(a.title.toLowerCase())), ...published];
}
