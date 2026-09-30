import { getPrimaryClient, requireUser } from "@/lib/data";
import { PageEditor, type LinkClickStats } from "./page-editor";

function eachDayKeys(start: Date, end: Date): string[] {
  const days: string[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cursor <= last) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export default async function MyPage() {
  const { supabase } = await requireUser();
  const loaded = await getPrimaryClient(supabase);

  if (!loaded) {
    return (
      <main className="px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2f6bff]">My Page</h1>
        <p className="mt-4 text-sm text-neutral-600">
          No client is set up yet.
        </p>
      </main>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.toISOString();
  const dayKeys = eachDayKeys(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
    today,
  );
  const dayKeySet = new Set(dayKeys);

  const { data: clickRows } = await supabase
    .from("click_events")
    .select("link_id, created_at")
    .eq("client_id", loaded.client.id);

  const allByLink = new Map<string, number>();
  const todayByLink = new Map<string, number>();
  const seriesByLink = new Map<string, Map<string, number>>();
  let totalClicks = 0;

  for (const row of clickRows ?? []) {
    totalClicks += 1;
    allByLink.set(row.link_id, (allByLink.get(row.link_id) ?? 0) + 1);
    if (row.created_at >= todayStart) {
      todayByLink.set(row.link_id, (todayByLink.get(row.link_id) ?? 0) + 1);
    }
    const day = row.created_at.slice(0, 10);
    if (!dayKeySet.has(day)) continue;
    let byDay = seriesByLink.get(row.link_id);
    if (!byDay) {
      byDay = new Map();
      seriesByLink.set(row.link_id, byDay);
    }
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  const linkStats: Record<string, LinkClickStats> = {};
  for (const link of loaded.links) {
    const clicks = allByLink.get(link.id) ?? 0;
    const byDay = seriesByLink.get(link.id);
    linkStats[link.id] = {
      clicks,
      today: todayByLink.get(link.id) ?? 0,
      share: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0,
      series: dayKeys.map((day) => ({
        day,
        count: byDay?.get(day) ?? 0,
      })),
    };
  }

  return (
    <PageEditor
      client={loaded.client}
      theme={loaded.theme}
      links={loaded.links}
      linkStats={linkStats}
    />
  );
}
