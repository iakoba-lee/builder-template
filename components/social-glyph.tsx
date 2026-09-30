import type { SocialPlatform } from "@/lib/social";

export function SocialGlyph({
  platform,
  size = 18,
}: {
  platform: SocialPlatform | null;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };

  switch (platform) {
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zM17.75 6.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14.5 3c.4 2.4 1.9 4.1 4.2 4.4v2.5c-1.5 0-2.9-.5-4.1-1.3v6.2a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.7a2.9 2.9 0 1 0 2 2.8V3h2.7z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23 12.2s0-3.4-.4-5a2.9 2.9 0 0 0-2-2C18.9 4.7 12 4.7 12 4.7s-6.9 0-8.6.5a2.9 2.9 0 0 0-2 2c-.4 1.6-.4 5-.4 5s0 3.4.4 5a2.9 2.9 0 0 0 2 2c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.9 2.9 0 0 0 2-2c.4-1.6.4-5 .4-5zM9.8 15.5v-6.6l5.8 3.3-5.8 3.3z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M3 3h4.4l4.1 5.8L16.8 3H21l-6.6 7.5L21.5 21h-4.4l-4.5-6.3L7.2 21H3l7-8L3 3z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 9h3V5.5h-3c-2.4 0-4 1.5-4 4V12H7v3.5h3V22h3.8v-6.5H17L17.7 12H13.8V9.8c0-.5.3-.8.9-.8z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5L12 7.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0L6 13a3.5 3.5 0 0 0 5 5l1-1.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
