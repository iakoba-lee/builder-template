"use server";

import { revalidatePath } from "next/cache";
import { requireUser, getPrimaryClient } from "@/lib/data";
import { expiresAtFromChoice, isLiveLink } from "@/lib/link-schedule";

async function requireOwnedClient(clientId: string) {
  const { supabase } = await requireUser();
  const loaded = await getPrimaryClient(supabase);
  if (!loaded || loaded.client.id !== clientId) {
    throw new Error("Client not found.");
  }
  return { supabase, client: loaded.client };
}

function discountCodeFromForm(formData: FormData): string | null {
  const raw = String(formData.get("discountCode") ?? "").trim();
  return raw || null;
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
  const schedule =
    placement === "page"
      ? expiresAtFromChoice(
          String(formData.get("duration") ?? "none"),
          String(formData.get("endsOn") ?? ""),
        )
      : { expiresAt: null };
  if (schedule.error) return { error: schedule.error };
  const { supabase, client } = await requireOwnedClient(clientId);
  // Prepend: sit above existing links when sorted by position ascending.
  const { data: first } = await supabase
    .from("links")
    .select("position, expires_at, archived_at")
    .eq("client_id", client.id)
    .eq("placement", placement)
    .order("position", { ascending: true });
  const firstLive = (first ?? []).find((link) => isLiveLink(link));
  const { error } = await supabase.from("links").insert({
    client_id: client.id,
    title,
    url,
    placement,
    discount_code: placement === "page" ? discountCodeFromForm(formData) : null,
    expires_at: schedule.expiresAt,
    position: (firstLive?.position ?? 0) - 1,
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
  const patch: {
    title: string;
    url: string;
    discount_code?: string | null;
    expires_at?: string | null;
  } = {
    title,
    url,
  };
  if (formData.has("discountCode")) {
    patch.discount_code = discountCodeFromForm(formData);
  }
  if (formData.has("duration")) {
    const schedule = expiresAtFromChoice(
      String(formData.get("duration") ?? "none"),
      String(formData.get("endsOn") ?? ""),
    );
    if (schedule.error) return { error: schedule.error };
    patch.expires_at = schedule.expiresAt;
  }
  const { error } = await supabase
    .from("links")
    .update(patch)
    .eq("id", linkId)
    .eq("client_id", clientId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function archiveLink(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const { supabase } = await requireOwnedClient(clientId);
  const { error } = await supabase
    .from("links")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", linkId)
    .eq("client_id", clientId)
    .eq("placement", "page");
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function restoreLink(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const { supabase } = await requireOwnedClient(clientId);
  const { error } = await supabase
    .from("links")
    .update({ archived_at: null, expires_at: null })
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
    .select("id, position, expires_at, archived_at")
    .eq("client_id", client.id)
    .eq("placement", target.placement)
    .order("position", { ascending: true });
  if (!links) return { error: "Could not load links." };
  const liveLinks = links.filter((link) => isLiveLink(link));
  const index = liveLinks.findIndex((link) => link.id === linkId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= liveLinks.length) {
    return { ok: true };
  }
  const current = liveLinks[index];
  const other = liveLinks[swapWith];
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

/** Persist a full ordered list of link ids (0..n-1). Used when leaving edit mode. */
export async function reorderLinks(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const placementRaw = String(formData.get("placement") ?? "page");
  const placement = placementRaw === "profile" ? "profile" : "page";
  const orderedIds = String(formData.get("orderedIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (orderedIds.length === 0) return { ok: true };

  const { supabase, client } = await requireOwnedClient(clientId);
  const { data: existing } = await supabase
    .from("links")
    .select("id, expires_at, archived_at")
    .eq("client_id", client.id)
    .eq("placement", placement);
  if (!existing) return { error: "Could not load links." };

  const owned = new Set(
    existing.filter((link) => isLiveLink(link)).map((link) => link.id),
  );
  if (
    orderedIds.length !== owned.size ||
    orderedIds.some((id) => !owned.has(id))
  ) {
    return { error: "Link order is out of date. Refresh and try again." };
  }

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("links")
      .update({ position: i })
      .eq("id", orderedIds[i])
      .eq("client_id", client.id);
    if (error) return { error: error.message };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
