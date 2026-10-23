export const SCHOOL_TIME_ZONE = "Asia/Kolkata";

/** Value for datetime-local inputs, always shown in the school's timezone. */
export function schoolDateTimeInput(value?: string | Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: SCHOOL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

/** Asia/Kolkata has no daylight saving; persist an unambiguous ISO timestamp. */
export function schoolDateTimeIso(value: string): string {
  const date = new Date(`${value}:00+05:30`);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || schoolDateTimeInput(date) !== value) throw new Error("Choose a valid school date and time.");
  return date.toISOString();
}

/** A calendar date at school, independent of the browser's timezone. */
export function schoolDate(value: string | Date = new Date()): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: SCHOOL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function schoolMonthStart(months: number, now = new Date()): string {
  const [year, month] = schoolDate(now).split("-").map(Number);
  return new Date(Date.UTC(year, month - months, 1)).toISOString().slice(0, 10);
}
