const AGENCY_TIME_ZONE = "America/Denver";
const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type SchedulableLink = {
  expires_at?: string | null;
  archived_at?: string | null;
};

export function onPageRange(
  link: SchedulableLink & { created_at?: string | null },
  now = new Date(),
): { start: Date; end: Date } {
  const endRaw = link.archived_at ?? link.expires_at;
  const end = endRaw ? new Date(endRaw) : now;
  const start = link.created_at ? new Date(link.created_at) : end;
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return { start: now, end: now };
  if (startMs > endMs) return { start: end, end: start };
  return { start, end };
}

export function isLiveLink(link: SchedulableLink, now = new Date()): boolean {
  if (link.archived_at) return false;
  if (!link.expires_at) return true;
  const end = new Date(link.expires_at).getTime();
  return Number.isNaN(end) || end > now.getTime();
}

export function expiresAtFromChoice(
  choice: string,
  endsOn: string,
  now = new Date(),
): { expiresAt: string | null; error?: string } {
  if (choice === "7") {
    return { expiresAt: new Date(now.getTime() + 7 * DAY_MS).toISOString() };
  }
  if (choice === "30") {
    return { expiresAt: new Date(now.getTime() + 30 * DAY_MS).toISOString() };
  }
  if (choice === "date") {
    const expiresAt = endOfAgencyDay(endsOn);
    if (!expiresAt) return { expiresAt: null, error: "Pick an end date." };
    if (new Date(expiresAt).getTime() <= now.getTime()) {
      return { expiresAt: null, error: "That date has already passed." };
    }
    return { expiresAt };
  }
  return { expiresAt: null };
}

export function daysLeftLabel(
  expiresAt: string | null | undefined,
  now = new Date(),
): string | null {
  if (!expiresAt) return null;
  const end = new Date(expiresAt).getTime();
  if (Number.isNaN(end) || end <= now.getTime()) return null;
  const days = Math.ceil((end - now.getTime()) / DAY_MS);
  return days === 1 ? "1 day left" : `${days} days left`;
}

export function agencyDay(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AGENCY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function formatAgencyDay(iso: string): string {
  const [year, month, day] = agencyDay(iso).split("-");
  const monthName = MONTHS[Number(month) - 1] ?? month;
  return `${monthName} ${Number(day)}, ${year}`;
}

export function todayAgencyDay(now = new Date()): string {
  return agencyDay(now.toISOString());
}

function endOfAgencyDay(isoDate: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AGENCY_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(utcGuess);
  const value = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUTC = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour"),
    value("minute"),
    value("second"),
    999,
  );
  return new Date(utcGuess.getTime() - (asUTC - utcGuess.getTime())).toISOString();
}
