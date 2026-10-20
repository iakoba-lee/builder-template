import { loadClickAggregates } from "@/lib/click-counts";
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
  const clicks = await loadClickAggregates(
    supabase,
    loaded.client.id,
    todayStart,
  );

  const linkStats: Record<string, LinkClickStats> = {};
  for (const link of loaded.links) {
    const linkClicks = clicks.byLink.get(link.id);
    const linkTotal = linkClicks?.total ?? 0;
    const byDay = linkClicks?.byDay;
    linkStats[link.id] = {
      clicks: linkTotal,
      today: linkClicks?.today ?? 0,
      share:
        clicks.total > 0 ? Math.round((linkTotal / clicks.total) * 100) : 0,
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
