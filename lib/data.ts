import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Client, LinkRow, ThemeSettings } from "@/lib/types";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  const { data: isAdmin } = await supabase.rpc("is_admin_email");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-authorized");
  }
  return { supabase, user };
}

export async function getPrimaryClient(supabase: Awaited<
  ReturnType<typeof createClient>
>): Promise<{
  client: Client;
  theme: ThemeSettings | null;
  links: LinkRow[];
} | null> {
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !client) {
    return null;
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

  return {
    client: client as Client,
    theme: (theme as ThemeSettings | null) ?? null,
    links: (links as LinkRow[]) ?? [],
  };
}
