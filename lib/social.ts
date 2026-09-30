export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "facebook";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "youtube",
  "instagram",
  "tiktok",
  "x",
  "facebook",
];

const LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  facebook: "Facebook",
};

export function labelForSocial(platform: SocialPlatform): string {
  return LABELS[platform];
}

/** Known social hosts get branded icons; other profile links use a generic glyph. */
export function socialPlatformForUrl(url: string): SocialPlatform | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.toLowerCase();

    if (host.includes("instagram.com")) {
      if (path.startsWith("/p/") || path.startsWith("/reel") || path.startsWith("/tv/")) {
        return null;
      }
      return "instagram";
    }

    if (host.includes("tiktok.com")) {
      if (path.includes("/video/")) return null;
      return "tiktok";
    }

    if (host === "x.com" || host.includes("twitter.com")) {
      if (path.includes("/status/")) return null;
      return "x";
    }

    if (host.includes("facebook.com") || host === "fb.com" || host.endsWith(".fb.com")) {
      if (path.includes("/posts/") || path.includes("/photo") || path.includes("/watch/")) {
        return null;
      }
      return "facebook";
    }

    if (host.includes("youtu.be")) return null;

    if (host.includes("youtube.com")) {
      if (
        path.startsWith("/watch") ||
        path.startsWith("/shorts") ||
        path.startsWith("/embed") ||
        path.startsWith("/live") ||
        path.startsWith("/clip")
      ) {
        return null;
      }
      return "youtube";
    }
  } catch {
    // Invalid URLs are not treated as known social platforms.
  }
  return null;
}
