"use client";

import { useState } from "react";

export function faviconSrc(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (!host) return null;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  } catch {
    return null;
  }
}

export function SiteMark({ url, label }: { url: string; label: string }) {
  const src = faviconSrc(url);
  const [failed, setFailed] = useState(false);
  const letter = label.trim().slice(0, 1).toUpperCase() || "↗";

  if (!src || failed) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-200 text-sm font-semibold text-neutral-700">
        {letter}
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/8 bg-white">
      <img
        src={src}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
