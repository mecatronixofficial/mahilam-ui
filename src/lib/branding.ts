export const DEFAULT_LOGO = "/logo/mahilam.png";
export type Branding = { logoUrl: string | null; width?: number; height?: number; updatedAt?: string };
export const DEFAULT_BRANDING: Branding = { logoUrl: null, width: 694, height: 347 };
export const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export function safeLogoUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : null; } catch { return null; }
}

export async function validateLogo(file: File) {
  if (!LOGO_TYPES.includes(file.type)) throw new Error("Choose a PNG, JPEG or WebP image. SVG is not supported.");
  if (!file.size || file.size > MAX_LOGO_BYTES) throw new Error("Logo must be 2 MB or smaller.");
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const matches = file.type === "image/png" ? [137,80,78,71,13,10,26,10].every((b, i) => bytes[i] === b)
    : file.type === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP";
  if (!matches) throw new Error("File contents do not match the selected image type.");
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error("This image is corrupted or cannot be decoded."); });
  const { width, height } = bitmap;
  bitmap.close();
  if (width < 32 || height < 16 || width > 4096 || height > 4096 || width * height > 16_000_000) throw new Error("Logo dimensions must be 32–4096 pixels wide and 16–4096 pixels high (maximum 16 megapixels).");
  return { width, height };
}
