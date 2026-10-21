import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deviceFromUserAgent } from "@/lib/display";
import { isLiveLink } from "@/lib/link-schedule";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const { linkId } = await params;
  const supabase = await createClient();
  const { data: link } = await supabase
    .from("links")
    .select("id, url, client_id, expires_at, archived_at")
    .eq("id", linkId)
    .maybeSingle();

  if (!link || !isLiveLink(link)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await supabase.from("click_events").insert({
    client_id: link.client_id,
    link_id: link.id,
    device: deviceFromUserAgent(request.headers.get("user-agent")),
    country: request.headers.get("x-vercel-ip-country"),
  });

  return NextResponse.redirect(link.url, { status: 302 });
}
