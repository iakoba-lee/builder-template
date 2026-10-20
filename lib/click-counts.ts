import type { SupabaseClient } from "@supabase/supabase-js";

export type ClickAggregates = {
  total: number;
  today: number;
  byDay: Map<string, number>;
  byLink: Map<
    string,
    { total: number; today: number; byDay: Map<string, number> }
  >;
};

// PostgREST returns at most 1000 rows per request. A single select kept only
// the oldest clicks, so the last few days rendered as zero.
const PAGE_SIZE = 1000;
const MAX_PAGES = 200;

export async function loadClickAggregates(
  supabase: SupabaseClient,
  clientId: string,
  todayStartIso: string,
): Promise<ClickAggregates> {
  const byDay = new Map<string, number>();
  const byLink = new Map<
    string,
    { total: number; today: number; byDay: Map<string, number> }
  >();
  let total = 0;
  let today = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from("click_events")
      .select("id, link_id, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Could not load click events: ${error.message}`);
    }

    const rows = data ?? [];
    for (const row of rows) {
      total += 1;
      const day = row.created_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);

      let link = byLink.get(row.link_id);
      if (!link) {
        link = { total: 0, today: 0, byDay: new Map() };
        byLink.set(row.link_id, link);
      }
      link.total += 1;
      link.byDay.set(day, (link.byDay.get(day) ?? 0) + 1);
      if (row.created_at >= todayStartIso) {
        today += 1;
        link.today += 1;
      }
    }

    if (rows.length < PAGE_SIZE) {
      return { total, today, byDay, byLink };
    }
  }

  throw new Error(
    "Click history exceeded the analytics page size. Aggregate counts in the database before loading more.",
  );
}
