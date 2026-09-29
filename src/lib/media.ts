/** Hosts next/image may optimize (comma-separated in NEXT_PUBLIC_IMAGE_HOSTS). Other CMS uploads render unoptimized. */
const OPTIMIZABLE_HOSTS = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export function isOptimizable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

export function formatDate(value?: string | null, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-IN", options).format(date);
}

export function formatMoney(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);
}

export function humanize(value?: string | null) {
  return (value || "").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toDateInput(value?: string | null) {
  return value ? String(value).slice(0, 10) : "";
}
