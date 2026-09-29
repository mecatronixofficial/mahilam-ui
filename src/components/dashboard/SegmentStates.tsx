"use client";
import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { StateView } from "@/components/states/StateView";
import { ListSkeleton, StatSkeleton } from "@/components/states/Skeletons";

/** Shared by app/admin and app/crm loading.tsx / error.tsx / not-found.tsx, rendered inside the workspace shell. */
export function SegmentLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <div><div className="skeleton h-3 w-28" /><div className="skeleton mt-3 h-9 w-64" /><div className="skeleton mt-3 h-4 w-96 max-w-full" /></div>
      <StatSkeleton />
      <ListSkeleton rows={3} />
    </div>
  );
}

export function SegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <StateView variant="error" title="This page ran into a problem" description="Your data is safe. Try again, and if it keeps happening let an administrator know." action={{ label: "Try again", onClick: reset, icon: RotateCw }} />;
}

export function SegmentNotFound({ home }: { home: string }) {
  return <StateView variant="not-found" title="Page not found" description="This workspace page doesn't exist or was moved." action={{ label: "Back to dashboard", href: home }} />;
}
