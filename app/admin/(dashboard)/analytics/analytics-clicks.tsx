"use client";

import { useMemo, useState } from "react";

export type ClickSeriesPoint = {
  day: string;
  count: number;
};

export type ClicksRangeKey = "7d" | "month" | "all";

export type ClicksRange = {
  key: ClicksRangeKey;
  label: string;
  total: number;
  series: ClickSeriesPoint[];
};

const RANGE_ORDER: ClicksRangeKey[] = ["7d", "month", "all"];

function yAxisTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const roughStep = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const residual = roughStep / magnitude;
  const niceResidual =
    residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  const step = niceResidual * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = 0; value <= top; value += step) {
    ticks.push(value);
  }
  return ticks;
}

function formatDayLabel(day: string) {
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return day.slice(5);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function AnalyticsClicks({
  todayCount,
  ranges,
  accent,
}: {
  todayCount: number;
  ranges: ClicksRange[];
  accent: string;
}) {
  const [rangeKey, setRangeKey] = useState<ClicksRangeKey>("7d");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const range =
    ranges.find((item) => item.key === rangeKey) ??
    ranges.find((item) => item.key === "7d") ??
    ranges[0];

  const chart = useMemo(() => {
    const series = range?.series ?? [];
    const dataMax = Math.max(0, ...series.map((point) => point.count));
    const ticks = yAxisTicks(dataMax);
    const chartMax = Math.max(1, ticks[ticks.length - 1] ?? 1);
    const width = 640;
    const height = 200;
    const leftPad = 40;
    const rightPad = 12;
    const topPad = 16;
    const bottomPad = 28;
    const plotWidth = width - leftPad - rightPad;
    const plotHeight = height - topPad - bottomPad;
    const plotted = series.map((point, index) => {
      const x = leftPad + (index / Math.max(1, series.length - 1)) * plotWidth;
      const y = topPad + plotHeight - (point.count / chartMax) * plotHeight;
      return { ...point, x, y };
    });
    const labelEvery = Math.max(1, Math.ceil(series.length / 7));
    const xLabels = plotted.filter(
      (_, index) =>
        index % labelEvery === 0 || index === plotted.length - 1,
    );
    return {
      width,
      height,
      leftPad,
      rightPad,
      topPad,
      plotHeight,
      chartMax,
      ticks,
      plotted,
      xLabels,
      points: plotted.map((point) => `${point.x},${point.y}`),
    };
  }, [range]);

  const hovered =
    hoveredIndex === null ? null : (chart.plotted[hoveredIndex] ?? null);

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Clicks</h2>
        <div className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1">
          {RANGE_ORDER.map((key) => {
            const item = ranges.find((rangeItem) => rangeItem.key === key);
            if (!item) return null;
            const active = rangeKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setRangeKey(key);
                  setHoveredIndex(null);
                }}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-white font-medium text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                aria-pressed={active}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-black/5 p-4">
          <p className="text-sm text-neutral-500">Today</p>
          <p className="text-4xl font-semibold" style={{ color: accent }}>
            {todayCount}
          </p>
        </div>
        <div className="rounded-lg border border-black/5 p-4">
          <p className="text-sm text-neutral-500">{range?.label ?? "Range"}</p>
          <p className="text-4xl font-semibold" style={{ color: accent }}>
            {range?.total ?? 0}
          </p>
        </div>
      </div>
      <div
        className="relative mt-6"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="w-full"
          role="img"
          aria-label={`Clicks for ${range?.label ?? "selected range"}`}
        >
          {chart.ticks.map((tick) => {
            const y =
              chart.topPad +
              chart.plotHeight -
              (tick / chart.chartMax) * chart.plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={chart.leftPad}
                  x2={chart.width - chart.rightPad}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={chart.leftPad - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fontWeight="500"
                  fill="#4b5563"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          <polyline
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={chart.points.join(" ")}
          />
          {hovered ? (
            <>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={chart.topPad}
                y2={chart.topPad + chart.plotHeight}
                stroke={accent}
                strokeOpacity="0.25"
                strokeWidth="1.5"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r="5"
                fill="white"
                stroke={accent}
                strokeWidth="2.5"
              />
            </>
          ) : null}
          {chart.xLabels.map((point) => (
            <text
              key={point.day}
              x={point.x}
              y={chart.height - 6}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {point.day.slice(5)}
            </text>
          ))}
          {chart.plotted.map((point, index) => {
            const hitWidth = Math.max(
              18,
              chart.width / Math.max(chart.plotted.length, 1),
            );
            return (
              <rect
                key={point.day}
                x={point.x - hitWidth / 2}
                y={chart.topPad}
                width={hitWidth}
                height={chart.plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                tabIndex={0}
                role="img"
                aria-label={`${formatDayLabel(point.day)}: ${point.count} clicks`}
              />
            );
          })}
        </svg>
        {hovered ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{
              left: `${(hovered.x / chart.width) * 100}%`,
              top: `${(hovered.y / chart.height) * 100}%`,
              marginTop: "-10px",
            }}
          >
            <p className="font-medium">{formatDayLabel(hovered.day)}</p>
            <p className="text-white/80">
              {hovered.count} {hovered.count === 1 ? "click" : "clicks"}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
