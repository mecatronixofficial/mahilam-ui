import fs from "node:fs";
import path from "node:path";

/**
 * Pages reference their intended photography (e.g. /images/about/kids-group.webp).
 * Until that file is added to /public, a real campus photo is served instead of a
 * broken image. Drop the file in and it is picked up on the next build.
 * Server components only: this reads the filesystem.
 */
const FALLBACKS = ["/imgs/home/kid1.jpg", "/imgs/home/kid2.avif"];

export function localImage(src: string, fallback = 0) {
  try {
    if (fs.existsSync(path.join(process.cwd(), "public", src))) return src;
  } catch {
    // Fall through to the placeholder photo.
  }
  return FALLBACKS[fallback % FALLBACKS.length];
}
