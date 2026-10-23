"use client";
import { createContext, useContext } from "react";
import NextImage, { type ImageProps } from "next/image";
import { isOptimizable } from "@/lib/media";
import { resolveWebsitePhoto } from "@/lib/website-photos";

const WebsitePhotos = createContext<Record<string, unknown>>({});
export function WebsitePhotoProvider({ settings, children }: { settings: Record<string, unknown>; children: React.ReactNode }) {
  return <WebsitePhotos.Provider value={settings}>{children}</WebsitePhotos.Provider>;
}

/** Preserve Next Image sizing while resolving only registered school-photo positions. */
export default function SchoolImage({ src, alt, unoptimized, style, ...props }: ImageProps) {
  const settings = useContext(WebsitePhotos);
  const resolved = typeof src === "string" ? resolveWebsitePhoto(settings, src, alt) : { src, alt };
  return <NextImage {...props} style={{ ...("position" in resolved ? { objectPosition: resolved.position } : {}), ...style }} src={resolved.src} alt={resolved.alt} unoptimized={unoptimized || (typeof resolved.src === "string" && !isOptimizable(resolved.src))} />;
}

