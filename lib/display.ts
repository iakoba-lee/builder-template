export function deviceFromUserAgent(userAgent: string | null): string {
  const ua = userAgent ?? "";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

export function fontStack(font: string): string {
  switch (font) {
    case "Georgia":
      return 'Georgia, "Times New Roman", serif';
    case "System":
      return 'system-ui, -apple-system, "Segoe UI", sans-serif';
    case "Geist":
      return "var(--font-geist-sans), sans-serif";
    default:
      return "var(--font-inter), Inter, sans-serif";
  }
}
