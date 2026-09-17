export type LinkMark = {
  background: string;
  kind: "amazon" | "youtube" | "instagram" | "tiktok" | "kickstarter" | "link";
};

export function markForUrl(url: string, accent: string): LinkMark {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (
      host.includes("amazon") ||
      host.includes("amzn.to") ||
      host === "a.co" ||
      host.endsWith(".a.co")
    ) {
      return { background: "#111111", kind: "amazon" };
    }
    if (host.includes("youtube") || host.includes("youtu.be")) {
      return { background: "#ff0000", kind: "youtube" };
    }
    if (host.includes("instagram")) {
      return { background: "#e1306c", kind: "instagram" };
    }
    if (host.includes("tiktok")) {
      return { background: "#111111", kind: "tiktok" };
    }
    if (host.includes("kickstarter")) {
      return { background: "#05ce78", kind: "kickstarter" };
    }
  } catch {
    // Invalid URLs still get a default mark.
  }
  return { background: accent, kind: "link" };
}
