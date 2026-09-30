import { getPrimaryClient, requireUser } from "@/lib/data";
import { socialPlatformForUrl } from "@/lib/social";
import { AnalyticsClicks, type ClicksRange } from "./analytics-clicks";
import { AnalyticsLinks } from "./analytics-links";
import { AnalyticsSocials } from "./analytics-socials";

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function eachDayKeys(start: Date, end: Date): string[] {
  const days: string[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cursor <= last) {
    days.push(toDayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function seriesFromDays(
  dayKeys: string[],
  countsByDay: Map<string, number>,
): { day: string; count: number }[] {
  return dayKeys.map((day) => ({
    day,
    count: countsByDay.get(day) ?? 0,
  }));
}

function sumSeries(series: { day: string; count: number }[]) {
  return series.reduce((sum, point) => sum + point.count, 0);
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function AnalyticsPage() {
  const { supabase } = await requireUser();
  const loaded = await getPrimaryClient(supabase);

  if (!loaded) {
    return (
      <main className="px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2f6bff]">Analytics</h1>
        <p className="mt-4 text-sm text-neutral-600">No client is set up yet.</p>
      </main>
    );
  }

  const today = startOfToday();
  const todayStart = today.toISOString();
  const accent = loaded.theme?.color ?? "#2F6BFF";

  const [{ count: todayCount }, { count: allCount }, { data: linkClicks }] =
    await Promise.all([
      supabase
        .from("click_events")
        .select("*", { count: "exact", head: true })
        .eq("client_id", loaded.client.id)
        .gte("created_at", todayStart),
      supabase
        .from("click_events")
        .select("*", { count: "exact", head: true })
        .eq("client_id", loaded.client.id),
      supabase
        .from("click_events")
        .select("link_id, created_at")
        .eq("client_id", loaded.client.id),
    ]);

  const countsByDay = new Map<string, number>();
  const todayByLink = new Map<string, number>();
  const allByLink = new Map<string, number>();
  const dayKeys30: string[] = eachDayKeys(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
    today,
  );
  const seriesByLink = new Map<string, Map<string, number>>();
  let earliestDay: string | null = null;

  for (const row of linkClicks ?? []) {
    allByLink.set(row.link_id, (allByLink.get(row.link_id) ?? 0) + 1);
    if (row.created_at >= todayStart) {
      todayByLink.set(row.link_id, (todayByLink.get(row.link_id) ?? 0) + 1);
    }

    const day = row.created_at.slice(0, 10);
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
    if (!earliestDay || day < earliestDay) earliestDay = day;

    if (dayKeys30.includes(day)) {
      let byDayForLink = seriesByLink.get(row.link_id);
      if (!byDayForLink) {
        byDayForLink = new Map();
        seriesByLink.set(row.link_id, byDayForLink);
      }
      byDayForLink.set(day, (byDayForLink.get(day) ?? 0) + 1);
    }
  }

  function seriesForLink(linkId: string) {
    const byDayForLink = seriesByLink.get(linkId);
    return dayKeys30.map((day) => ({
      day,
      count: byDayForLink?.get(day) ?? 0,
    }));
  }

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const allStart = earliestDay
    ? new Date(`${earliestDay}T00:00:00`)
    : weekStart;

  const weekSeries = seriesFromDays(eachDayKeys(weekStart, today), countsByDay);
  const monthSeries = seriesFromDays(eachDayKeys(monthStart, today), countsByDay);
  const allSeries = seriesFromDays(eachDayKeys(allStart, today), countsByDay);

  const ranges: ClicksRange[] = [
    {
      key: "7d",
      label: "Last 7 days",
      total: sumSeries(weekSeries),
      series: weekSeries,
    },
    {
      key: "month",
      label: "This month",
      total: sumSeries(monthSeries),
      series: monthSeries,
    },
    {
      key: "all",
      label: "All time",
      total: allCount ?? sumSeries(allSeries),
      series: allSeries,
    },
  ];

  const totalClicks = allCount ?? 0;
  const socialItems: {
    id: string;
    title: string;
    platform: ReturnType<typeof socialPlatformForUrl>;
    url: string;
    clicks: number;
    today: number;
    series: { day: string; count: number }[];
  }[] = [];
  const linkItems: {
    id: string;
    title: string;
    url: string;
    domain: string;
    redirectPath: string;
    clicks: number;
    today: number;
    share: number;
    series: { day: string; count: number }[];
  }[] = [];

  for (const link of loaded.links) {
    const clicks = allByLink.get(link.id) ?? 0;
    const todayClicks = todayByLink.get(link.id) ?? 0;

    if (link.placement === "profile") {
      socialItems.push({
        id: link.id,
        title: link.title,
        platform: socialPlatformForUrl(link.url),
        url: link.url,
        clicks,
        today: todayClicks,
        series: seriesForLink(link.id),
      });
      continue;
    }

    linkItems.push({
      id: link.id,
      title: link.title,
      url: link.url,
      domain: domainOf(link.url),
      redirectPath: `/l/${link.id}`,
      clicks,
      today: todayClicks,
      share: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0,
      series: seriesForLink(link.id),
    });
  }

  return (
    <main className="px-8 py-8">
      <h1 className="text-3xl font-bold text-[#2f6bff]">Analytics</h1>
      <AnalyticsClicks
        todayCount={todayCount ?? 0}
        ranges={ranges}
        accent={accent}
      />
      <AnalyticsSocials socials={socialItems} accent={accent} />
      <AnalyticsLinks links={linkItems} accent={accent} />
    </main>
  );
}
