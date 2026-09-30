"use server";

import { revalidatePath } from "next/cache";
import { requireUser, getPrimaryClient } from "@/lib/data";

async function requireOwnedClient(clientId: string) {
  const { supabase } = await requireUser();
  const loaded = await getPrimaryClient(supabase);
  if (!loaded || loaded.client.id !== clientId) {
    throw new Error("Client not found.");
  }
  return { supabase, client: loaded.client };
}

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function updateProfile(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  if (!name) {
    return { error: "Name is required." };
  }
  const { supabase } = await requireOwnedClient(clientId);
  const { error } = await supabase
    .from("clients")
    .update({
      name,
      bio: bio || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", clientId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateTheme(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const color = String(formData.get("color") ?? "#2F6BFF");
  const font = String(formData.get("font") ?? "Inter");
  const { supabase, client } = await requireOwnedClient(clientId);
  const { error } = await supabase.from("theme_settings").upsert(
    {
      client_id: client.id,
      color,
      font,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "client_id" },
  );
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function addLink(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const placementRaw = String(formData.get("placement") ?? "page");
  const placement = placementRaw === "profile" ? "profile" : "page";
  if (!title || !url) {
    return { error: "Title and URL are required." };
  }
  const { supabase, client } = await requireOwnedClient(clientId);
  const { data: last } = await supabase
    .from("links")
    .select("position")
    .eq("client_id", client.id)
    .eq("placement", placement)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from("links").insert({
    client_id: client.id,
    title,
    url,
    placement,
    position: (last?.position ?? -1) + 1,
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateLink(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  if (!title || !url) {
    return { error: "Title and URL are required." };
  }
  const { supabase } = await requireOwnedClient(clientId);
  const { error } = await supabase
    .from("links")
    .update({ title, url })
    .eq("id", linkId)
    .eq("client_id", clientId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteLink(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const { supabase } = await requireOwnedClient(clientId);
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", linkId)
    .eq("client_id", clientId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function moveLink(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const { supabase, client } = await requireOwnedClient(clientId);
  const { data: target } = await supabase
    .from("links")
    .select("id, placement")
    .eq("id", linkId)
    .eq("client_id", client.id)
    .maybeSingle();
  if (!target) return { error: "Link not found." };

  const { data: links } = await supabase
    .from("links")
    .select("id, position")
    .eq("client_id", client.id)
    .eq("placement", target.placement)
    .order("position", { ascending: true });
  if (!links) return { error: "Could not load links." };
  const index = links.findIndex((link) => link.id === linkId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= links.length) {
    return { ok: true };
  }
  const current = links[index];
  const other = links[swapWith];
  const { error: firstError } = await supabase
    .from("links")
    .update({ position: other.position })
    .eq("id", current.id);
  const { error: secondError } = await supabase
    .from("links")
    .update({ position: current.position })
    .eq("id", other.id);
  if (firstError || secondError) {
    return { error: firstError?.message ?? secondError?.message };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
