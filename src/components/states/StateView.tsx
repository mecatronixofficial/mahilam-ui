import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, CircleDashed, Clock3, Inbox, LoaderCircle, SearchX, ShieldAlert, WifiOff } from "lucide-react";
import { BRAND } from "@/lib/brand";

export type StateVariant = "loading" | "empty" | "success" | "error" | "offline" | "forbidden" | "partial" | "session" | "not-found";

type Action = { label: string; href?: string; onClick?: () => void; icon?: LucideIcon };

const PRESETS: Record<StateVariant, { icon: LucideIcon; title: string; description: string; tint: string }> = {
  loading: { icon: LoaderCircle, title: "Loading…", description: "Fetching the latest information.", tint: BRAND.green[700] },
  empty: { icon: Inbox, title: "Nothing here yet", description: "When items are added they will appear here.", tint: BRAND.neutral[500] },
  success: { icon: CheckCircle2, title: "All done!", description: "Your changes were saved successfully.", tint: BRAND.green[600] },
  error: { icon: AlertTriangle, title: "Something went wrong", description: "We couldn't load this right now. Please try again.", tint: BRAND.coral[600] },
  offline: { icon: WifiOff, title: "You're offline", description: "Check your internet connection. We'll reload automatically when you're back online.", tint: BRAND.yellow[600] },
  forbidden: { icon: ShieldAlert, title: "Permission denied", description: "Your account doesn't have access to this area. Ask an administrator if you need it.", tint: BRAND.pink[700] },
  partial: { icon: CircleDashed, title: "Some information is unavailable", description: "Part of this page couldn't load. What's shown is accurate, but may be incomplete.", tint: BRAND.yellow[600] },
  session: { icon: Clock3, title: "Your session has expired", description: "For your security you've been signed out after a period of inactivity. Please sign in again.", tint: BRAND.blue[700] },
  "not-found": { icon: SearchX, title: "Not found", description: "This item may have been moved or deleted.", tint: BRAND.neutral[500] },
};

export function StateView({
  variant,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  tone = "glass",
  className = "",
}: {
  variant: StateVariant;
  title?: string;
  description?: string;
  action?: Action;
  secondaryAction?: Action;
  compact?: boolean;
  tone?: "glass" | "plain";
  className?: string;
}) {
  const preset = PRESETS[variant];
  const Icon = preset.icon;
  const live = variant === "error" || variant === "offline" || variant === "session" ? "assertive" : "polite";

  return (
    <div
      role={variant === "error" || variant === "session" ? "alert" : "status"}
      aria-live={live}
      aria-busy={variant === "loading" || undefined}
      className={`${tone === "glass" ? "panel glass-card" : ""} relative overflow-hidden text-center ${compact ? "px-5 py-8" : "px-6 py-14 md:py-16"} ${className}`}
    >
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-2xl" style={{ backgroundColor: preset.tint }} />
      <span
        className={`relative mx-auto flex items-center justify-center rounded-[22px] animate-pop ${compact ? "h-12 w-12" : "h-16 w-16"}`}
        style={{ backgroundColor: `${preset.tint}1a`, color: preset.tint, boxShadow: `0 14px 30px -16px ${preset.tint}` }}
      >
        <Icon className={`${compact ? "h-6 w-6" : "h-8 w-8"} ${variant === "loading" ? "animate-spin" : ""}`} />
      </span>
      <h2 className={`relative mt-5 font-black tracking-tight text-little-neutral-900 ${compact ? "text-lg" : "text-2xl"}`}>{title ?? preset.title}</h2>
      <p className={`relative mx-auto mt-2 max-w-md leading-7 text-little-neutral-500 ${compact ? "text-sm" : ""}`}>{description ?? preset.description}</p>
      {(action || secondaryAction) && (
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && <ActionButton action={action} primary />}
          {secondaryAction && <ActionButton action={secondaryAction} />}
        </div>
      )}
    </div>
  );
}

function ActionButton({ action, primary = false }: { action: Action; primary?: boolean }) {
  const Icon = action.icon;
  const className = `${primary ? "btn-primary" : "btn-soft"} !py-2.5 text-sm`;
  const content = <>{Icon && <Icon className="h-4 w-4" />}{action.label}</>;
  if (action.href) return <Link href={action.href} className={className}>{content}</Link>;
  return <button type="button" onClick={action.onClick} className={className}>{content}</button>;
}

/** Slim inline notice for partial data, soft warnings and success confirmations. */
export function InlineNotice({ variant = "partial", children, onRetry }: { variant?: "partial" | "error" | "success" | "offline" | "forbidden"; children: React.ReactNode; onRetry?: () => void }) {
  const styles = {
    partial: "border-little-yellow-200/70 bg-little-yellow-50/80 text-little-yellow-900",
    offline: "border-little-yellow-200/70 bg-little-yellow-50/80 text-little-yellow-900",
    error: "border-little-coral-200/70 bg-little-coral-50/80 text-little-coral-800",
    success: "border-little-green-200/70 bg-little-green-50/80 text-little-green-800",
    forbidden: "border-little-pink-200/70 bg-little-pink-50/80 text-little-pink-800",
  }[variant];
  const Icon = PRESETS[variant === "success" ? "success" : variant === "offline" ? "offline" : variant === "forbidden" ? "forbidden" : variant === "error" ? "error" : "partial"].icon;
  return (
    <div role={variant === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {onRetry && <button type="button" onClick={onRetry} className="shrink-0 rounded-lg bg-white/70 px-2.5 py-1 text-xs font-black hover:bg-white">Retry</button>}
    </div>
  );
}
