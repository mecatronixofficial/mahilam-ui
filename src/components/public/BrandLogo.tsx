"use client";
import Image from "next/image";
import { useState } from "react";
import { DEFAULT_LOGO, safeLogoUrl, type Branding } from "@/lib/branding";
import { isOptimizable } from "@/lib/media";

export function BrandLogo({ className = "h-auto w-40", priority = false, branding }: { className?: string; priority?: boolean; branding?: Branding }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const custom = safeLogoUrl(branding?.logoUrl);
  const src = custom && custom !== failedUrl ? custom : DEFAULT_LOGO;
  return (
    <Image
      src={src}
      alt="Little Mahilam Pre-school"
      width={src === DEFAULT_LOGO ? 694 : branding?.width || 694}
      height={src === DEFAULT_LOGO ? 347 : branding?.height || 347}
      unoptimized={!isOptimizable(src)}
      onError={() => { if (custom) setFailedUrl(custom); }}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
