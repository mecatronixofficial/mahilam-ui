const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63"];
const FLAGS = Array.from({ length: 28 });

/** Decorative party-flag strip. Pure markup, no images. */
export function Bunting({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-4 w-full overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 top-1.5 border-t-2 border-dashed border-current opacity-15" />
      <div className="container-pad flex h-full items-start justify-between px-4">
        {FLAGS.map((_, i) => (
          <span key={i} className="h-3 w-2.5 shrink-0" style={{ backgroundColor: TINTS[i % TINTS.length], clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        ))}
      </div>
    </div>
  );
}
