"use client";
import { RotateCw } from "lucide-react";
import { ApiError } from "@/lib/api";
import { StateView, type StateVariant } from "./StateView";
import { ListSkeleton } from "./Skeletons";

type QueryLike = { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown };

/** Maps any thrown error to the state screen that explains it best. */
export function variantForError(error: unknown): StateVariant {
  if (error instanceof ApiError) {
    if (error.kind === "network" || error.kind === "timeout") return typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "error";
    if (error.kind === "forbidden") return "forbidden";
    if (error.kind === "unauthorized") return "session";
    if (error.kind === "not-found") return "not-found";
  }
  return "error";
}

export function ErrorState({ error, onRetry, compact }: { error: unknown; onRetry?: () => void; compact?: boolean }) {
  const variant = variantForError(error);
  const retry = onRetry && variant !== "forbidden" && variant !== "session" ? { label: "Try again", onClick: onRetry, icon: RotateCw } : undefined;
  const description = variant === "error" && error instanceof Error && error.message !== "Request failed" ? error.message : undefined;
  return <StateView variant={variant} description={description} action={retry} compact={compact} />;
}

/**
 * Renders loading → error → empty → content for a react-query result.
 * Pass `isEmpty` to show the empty state (with `empty` props for its copy/action).
 */
export function QueryState({
  query,
  isEmpty,
  empty,
  loading,
  children,
}: {
  query: QueryLike;
  isEmpty?: boolean;
  empty?: { title?: string; description?: string; action?: { label: string; href?: string; onClick?: () => void } };
  loading?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (query.isPending) return <>{loading ?? <ListSkeleton />}</>;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  if (isEmpty) return <StateView variant="empty" compact title={empty?.title} description={empty?.description} action={empty?.action} />;
  return <>{children}</>;
}
