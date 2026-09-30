"use client";

import { useEffect } from "react";

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

export function ClickTrendModal({
  id,
  title,
  subtitle,
  clicks,
  today,
  share,
  series,
  accent,
  onClose,
}: {
  id: string;
  title: string;
  subtitle: string;
  clicks: number;
  today: number;
  share?: number;
  series: { day: string; count: number }[];
  accent: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const dataMax = Math.max(0, ...series.map((point) => point.count));
  const ticks = yAxisTicks(dataMax);
  const chartMax = Math.max(1, ticks[ticks.length - 1] ?? 1);
  const width = 640;
  const height = 240;
  const leftPad = 40;
  const rightPad = 12;
  const topPad = 16;
  const bottomPad = 28;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;
  const points = series.map((point, index) => {
    const x = leftPad + (index / Math.max(1, series.length - 1)) * plotWidth;
    const y = topPad + plotHeight - (point.count / chartMax) * plotHeight;
    return `${x},${y}`;
  });
  const xLabels = series.filter(
    (_, index) => index % 5 === 0 || index === series.length - 1,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`click-trend-${id}`}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              id={`click-trend-${id}`}
              className="truncate text-lg font-semibold text-neutral-900"
            >
              {title}
            </h3>
            <p className="mt-1 truncate text-sm text-neutral-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          >
            Close
          </button>
        </div>
        <div
          className={`mt-4 grid gap-3 ${
            share === undefined ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          <div className="rounded-lg border border-black/5 p-3">
            <p className="text-xs text-neutral-500">All time</p>
            <p className="text-2xl font-semibold" style={{ color: accent }}>
              {clicks}
            </p>
          </div>
          <div className="rounded-lg border border-black/5 p-3">
            <p className="text-xs text-neutral-500">Today</p>
            <p className="text-2xl font-semibold" style={{ color: accent }}>
              {today}
            </p>
          </div>
          {share !== undefined ? (
            <div className="rounded-lg border border-black/5 p-3">
              <p className="text-xs text-neutral-500">Share</p>
              <p className="text-2xl font-semibold" style={{ color: accent }}>
                {share}%
              </p>
            </div>
          ) : null}
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mt-5 w-full"
          role="img"
          aria-label={`Clicks for ${title} over the last 30 days`}
        >
          {ticks.map((tick) => {
            const y = topPad + plotHeight - (tick / chartMax) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={leftPad}
                  x2={width - rightPad}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={leftPad - 8}
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
            points={points.join(" ")}
          />
          {xLabels.map((point) => {
            const index = series.findIndex((item) => item.day === point.day);
            const x =
              leftPad + (index / Math.max(1, series.length - 1)) * plotWidth;
            return (
              <text
                key={point.day}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fontSize="11"
                fill="#6b7280"
              >
                {point.day.slice(5)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 12.5V10M6 12.5V6M10 12.5V8M14 12.5V3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
