import { getPrimaryClient, requireUser } from "@/lib/data";
import { markForUrl } from "@/lib/link-mark";

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
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

  const todayStart = startOfToday();
  const weekAgoDate = new Date();
  weekAgoDate.setDate(weekAgoDate.getDate() - 7);
  const weekAgo = weekAgoDate.toISOString();
  const accent = loaded.theme?.color ?? "#2F6BFF";

  const [{ count: todayCount }, { count: allCount }, { data: weekRows }, { data: linkClicks }] =
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
        .select("created_at")
        .eq("client_id", loaded.client.id)
        .gte("created_at", weekAgo),
      supabase
        .from("click_events")
        .select("link_id, created_at")
        .eq("client_id", loaded.client.id),
    ]);

  const byDay = new Map<string, number>();
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    byDay.set(day.toISOString().slice(0, 10), 0);
  }
  for (const row of weekRows ?? []) {
    const key = row.created_at.slice(0, 10);
    if (byDay.has(key)) {
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
  }
  const series = [...byDay.entries()];
  const max = Math.max(1, ...series.map(([, value]) => value));

  const todayByLink = new Map<string, number>();
  const allByLink = new Map<string, number>();
  for (const row of linkClicks ?? []) {
    allByLink.set(row.link_id, (allByLink.get(row.link_id) ?? 0) + 1);
    if (row.created_at >= todayStart) {
      todayByLink.set(row.link_id, (todayByLink.get(row.link_id) ?? 0) + 1);
    }
  }

  const width = 640;
  const height = 180;
  const points = series.map(([, value], index) => {
    const x = (index / Math.max(1, series.length - 1)) * (width - 24) + 12;
    const y = height - 20 - (value / max) * (height - 40);
    return `${x},${y}`;
  });

  return (
    <main className="px-8 py-8">
      <h1 className="text-3xl font-bold text-[#2f6bff]">Analytics</h1>
      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Clicks</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-black/5 p-4">
            <p className="text-sm text-neutral-500">Today</p>
            <p className="text-4xl font-semibold text-[#2f6bff]">
              {todayCount ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-black/5 p-4">
            <p className="text-sm text-neutral-500">All Time</p>
            <p className="text-4xl font-semibold text-[#2f6bff]">
              {allCount ?? 0}
            </p>
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="mt-6 w-full">
          <polyline
            fill="none"
            stroke={accent}
            strokeWidth="3"
            points={points.join(" ")}
          />
          {series.map(([day], index) => {
            const x =
              (index / Math.max(1, series.length - 1)) * (width - 24) + 12;
            return (
              <text
                key={day}
                x={x}
                y={height - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {day.slice(5)}
              </text>
            );
          })}
        </svg>
      </section>
      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-neutral-400">
          <h2 className="text-xl font-semibold normal-case text-black">Links</h2>
          <span>Today / All time</span>
        </div>
        <ul className="flex flex-col">
          {loaded.links.map((link) => {
            const mark = markForUrl(link.url, accent);
            return (
              <li
                key={link.id}
                className="flex items-center gap-3 border-b border-black/5 py-3 last:border-0"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-md text-white"
                  style={{ background: mark.background }}
                >
                  ↗
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{link.title}</p>
                  <p className="truncate text-xs text-neutral-500">{link.url}</p>
                </div>
                <p className="text-sm text-neutral-400">
                  {todayByLink.get(link.id) ?? 0} / {allByLink.get(link.id) ?? 0}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
