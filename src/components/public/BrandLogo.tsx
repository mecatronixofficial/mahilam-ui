import Image from "next/image";

export function BrandLogo({ className = "h-auto w-40", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo/mahilam.png"
      alt="Little Mahilam Pre-school"
      width={694}
      height={347}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
