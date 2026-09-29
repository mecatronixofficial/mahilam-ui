/** Layout-matched placeholders so content doesn't jump when data arrives. */
export function ListSkeleton({ rows = 4, media = false }: { rows?: number; media?: boolean }) {
  return (
    <div className="grid gap-3" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="panel glass-card flex items-center gap-4 p-5">
          {media && <div className="skeleton h-14 w-14 shrink-0 !rounded-2xl" />}
          <div className="flex-1 space-y-2.5">
            <div className="skeleton h-4 w-2/5" />
            <div className="skeleton h-3 w-3/4" />
          </div>
          <div className="skeleton h-7 w-20 !rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="panel overflow-hidden" aria-hidden>
      <div className="grid gap-4 border-b p-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => <div key={i} className="skeleton h-3" />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-4 border-b p-4 last:border-0" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((_, c) => <div key={c} className="skeleton h-4" style={{ width: `${55 + ((r + c) % 4) * 12}%` }} />)}
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="panel p-6">
          <div className="skeleton h-11 w-11 !rounded-2xl" />
          <div className="skeleton mt-6 h-8 w-20" />
          <div className="skeleton mt-2 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass-card overflow-hidden">
          <div className="skeleton h-48 !rounded-none" />
          <div className="space-y-3 p-6">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
