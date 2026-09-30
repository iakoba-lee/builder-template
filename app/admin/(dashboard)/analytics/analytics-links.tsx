"use client";

import { useMemo, useState } from "react";
import { ChartIcon, ClickTrendModal } from "./click-trend-modal";

export type AnalyticsLinkItem = {
  id: string;
  title: string;
  url: string;
  domain: string;
  redirectPath: string;
  clicks: number;
  today: number;
  share: number;
  series: { day: string; count: number }[];
};

type SortKey = "clicks" | "today" | "share";

const SORT_LABELS: Record<SortKey, string> = {
  clicks: "Ranked by clicks",
  today: "Ranked by today",
  share: "Ranked by share",
};

export function AnalyticsLinks({
  links,
  accent,
}: {
  links: AnalyticsLinkItem[];
  accent: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("clicks");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const next = [...links];
    next.sort((a, b) => b[sortKey] - a[sortKey]);
    return next;
  }, [links, sortKey]);

  const selected = selectedId
    ? (links.find((link) => link.id === selectedId) ?? null)
    : null;

  const maxClicks = Math.max(1, ...links.map((link) => link.clicks));

  function cycleSort() {
    const order: SortKey[] = ["clicks", "today", "share"];
    const index = order.indexOf(sortKey);
    setSortKey(order[(index + 1) % order.length]);
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Link block performance</h2>
        <button
          type="button"
          onClick={cycleSort}
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-800"
          aria-label={`Change ranking. Currently ${SORT_LABELS[sortKey]}`}
        >
          {SORT_LABELS[sortKey]}
        </button>
      </div>
      <ul className="flex flex-col gap-3">
        {sorted.map((link) => {
          const barWidth = Math.round((link.clicks / maxClicks) * 100);
          return (
            <li
              key={link.id}
              className="overflow-hidden rounded-xl border border-black/8 bg-white"
            >
              <div className="flex items-start gap-4 px-5 pt-4 pb-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-neutral-900">
                    {link.title}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-neutral-500">
                    <span className="text-neutral-400">{link.redirectPath}</span>
                    <span className="mx-1.5 text-neutral-300">·</span>
                    <span>{link.domain}</span>
                  </p>
                </div>
                <div className="hidden shrink-0 items-end gap-6 sm:flex">
                  <Metric value={link.clicks} label="Clicks" />
                  <Metric value={link.today} label="Today" />
                  <Metric value={`${link.share}%`} label="Share" />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(link.id)}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-black/8 text-neutral-400 transition-colors hover:border-black/20 hover:bg-neutral-50 hover:text-neutral-700"
                  aria-label={`Open click trend for ${link.title}`}
                >
                  <ChartIcon />
                </button>
              </div>
              <div className="flex gap-4 px-5 pb-3 text-sm sm:hidden">
                <Metric value={link.clicks} label="Clicks" compact />
                <Metric value={link.today} label="Today" compact />
                <Metric value={`${link.share}%`} label="Share" compact />
              </div>
              <div className="h-1.5 w-full bg-neutral-100">
                <div
                  className="h-full transition-[width]"
                  style={{
                    width: `${barWidth}%`,
                    background: accent,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {selected ? (
        <ClickTrendModal
          id={selected.id}
          title={selected.title}
          subtitle={`Clicks over the last 30 days · ${selected.domain}`}
          clicks={selected.clicks}
          today={selected.today}
          share={selected.share}
          series={selected.series}
          accent={accent}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </section>
  );
}

function Metric({
  value,
  label,
  compact = false,
}: {
  value: number | string;
  label: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <p className="text-neutral-600">
        <span className="font-semibold text-neutral-900">{value}</span>{" "}
        <span className="text-neutral-500">{label}</span>
      </p>
    );
  }

  return (
    <div className="min-w-[3.5rem] text-right">
      <p className="text-lg font-semibold leading-none text-neutral-900">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{label}</p>
    </div>
  );
}
