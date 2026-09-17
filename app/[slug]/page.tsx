import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fontStack } from "@/lib/display";
import { markForUrl } from "@/lib/link-mark";
import type { Client, LinkRow, ThemeSettings } from "@/lib/types";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!client) {
    notFound();
  }

  const [{ data: theme }, { data: links }] = await Promise.all([
    supabase
      .from("theme_settings")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle(),
    supabase
      .from("links")
      .select("*")
      .eq("client_id", client.id)
      .order("position", { ascending: true }),
  ]);

  return (
    <PublicLinkPage
      client={client as Client}
      theme={(theme as ThemeSettings | null) ?? null}
      links={(links as LinkRow[]) ?? []}
    />
  );
}

function PublicLinkPage({
  client,
  theme,
  links,
}: {
  client: Client;
  theme: ThemeSettings | null;
  links: LinkRow[];
}) {
  const accent = theme?.color ?? "#2F6BFF";
  const featured = links[0];
  const rest = links.slice(1);

  return (
    <div
      className="min-h-full text-white"
      style={{
        fontFamily: fontStack(theme?.font ?? "Inter"),
        background: `linear-gradient(165deg, ${accent} 0 38%, #0b0b0b 38%)`,
      }}
    >
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-16">
        <section className="relative rounded-md bg-[#111] px-6 pb-8 pt-16 text-center">
          {client.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.avatar_url}
              alt=""
              className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#111] object-cover"
            />
          ) : null}
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          {client.bio ? (
            <p className="mt-2 whitespace-pre-line text-sm text-white/70">
              {client.bio}
            </p>
          ) : null}
        </section>
        <div className="mt-6 flex flex-col gap-3">
          {featured ? (
            <PublicLinkRow link={featured} accent={accent} wide />
          ) : null}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rest.map((link) => (
              <PublicLinkRow key={link.id} link={link} accent={accent} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function PublicLinkRow({
  link,
  accent,
  wide = false,
}: {
  link: LinkRow;
  accent: string;
  wide?: boolean;
}) {
  const mark = markForUrl(link.url, accent);
  return (
    <a
      href={`/l/${link.id}`}
      className={`flex items-center gap-3 rounded-md bg-[#161616] px-3 py-3 transition hover:bg-[#1e1e1e] ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg text-white"
        style={{ background: mark.background }}
      >
        ↗
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{link.title}</span>
        <span className="block truncate text-xs text-white/45">{link.url}</span>
      </span>
      <span className="text-white/40">→</span>
    </a>
  );
}
