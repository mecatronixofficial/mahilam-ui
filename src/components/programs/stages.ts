import { BRAND } from "@/lib/brand";

/** One learning stage on the Programs page. Plain data, so it can cross the server → client boundary. */
export type Stage = {
  slug: string;
  title: string;
  age: string;
  text: string;
  image: string;
  /** Focus areas drawn from the stage description. */
  focus: string[];
  /** Youngest age (years) for the program finder. */
  minAge: number;
  color: string;
  deep: string;
};

export const STAGE_COLORS = [
  { color: BRAND.yellow[300], deep: BRAND.yellow[700] },
  { color: BRAND.coral[200], deep: BRAND.coral[700] },
  { color: BRAND.green[200], deep: BRAND.green[700] },
  { color: BRAND.blue[200], deep: BRAND.blue[700] },
];
