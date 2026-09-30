"use client";

import { useState } from "react";
import { SocialGlyph } from "@/components/social-glyph";
import type { SocialPlatform } from "@/lib/social";
import { ChartIcon, ClickTrendModal } from "./click-trend-modal";

export type AnalyticsSocialItem = {
  id: string;
  title: string;
  platform: SocialPlatform | null;
  url: string;
  clicks: number;
  today: number;
  series: { day: string; count: number }[];
};

export function AnalyticsSocials({
  socials,
  accent,
}: {
  socials: AnalyticsSocialItem[];
  accent: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (socials.length === 0) return null;

  const selected = selectedId
    ? (socials.find((social) => social.id === selectedId) ?? null)
    : null;

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Socials</h2>
      <ul className="mt-5 flex flex-wrap gap-4">
        {socials.map((social) => (
          <li
            key={social.id}
            className="relative flex min-w-[6.5rem] flex-1 flex-col items-center rounded-xl border border-black/8 px-4 py-4"
          >
            <button
              type="button"
              onClick={() => setSelectedId(social.id)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-black/8 text-neutral-400 transition-colors hover:border-black/20 hover:bg-neutral-50 hover:text-neutral-700"
              aria-label={`Open click trend for ${social.title}`}
            >
              <ChartIcon />
            </button>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.title}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white transition hover:scale-105"
              style={{ color: accent }}
            >
              <SocialGlyph platform={social.platform} size={20} />
            </a>
            <p className="mt-3 text-sm font-medium text-neutral-900">
              {social.title}
            </p>
            <p className="mt-2 text-lg font-semibold leading-none text-neutral-900">
              {social.clicks}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Clicks · {social.today} today
            </p>
          </li>
        ))}
      </ul>
      {selected ? (
        <ClickTrendModal
          id={selected.id}
          title={selected.title}
          subtitle="Clicks over the last 30 days"
          clicks={selected.clicks}
          today={selected.today}
          series={selected.series}
          accent={accent}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </section>
  );
}
