import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SocialGlyph } from "@/components/social-glyph";
import { createClient } from "@/lib/supabase/server";
import { fontStack } from "@/lib/display";
import { markForUrl } from "@/lib/link-mark";
import { socialPlatformForUrl } from "@/lib/social";
import type { Client, LinkRow, ThemeSettings } from "@/lib/types";

async function getClientBySlug(slug: string) {
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return client as Client | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClientBySlug(slug);

  if (!client) {
    return { title: "Link page" };
  }

  const description = `Links, brand deals, and socials from ${client.name}.`;

  return {
    title: client.name,
    description,
    icons: client.avatar_url ? { icon: client.avatar_url } : undefined,
    openGraph: {
      title: client.name,
      description,
      images: client.avatar_url ? [{ url: client.avatar_url }] : undefined,
    },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);

  if (!client) {
    notFound();
  }

  const supabase = await createClient();

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
      client={client}
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
  const socials = links.filter((link) => link.placement === "profile");
  const content = links.filter((link) => link.placement !== "profile");
  const featured = content[0];
  const rest = content.slice(1);

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
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {socials.map((link) => {
                const platform = socialPlatformForUrl(link.url);
                return (
                  <li key={link.id}>
                    <a
                      href={`/l/${link.id}`}
                      aria-label={link.title}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white transition hover:scale-105"
                      style={{ color: accent }}
                    >
                      <SocialGlyph platform={platform} />
                    </a>
                  </li>
                );
              })}
            </ul>
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
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {link.title}
      </span>
      <span className="text-white/40">→</span>
    </a>
  );
}
