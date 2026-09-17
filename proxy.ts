import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refreshes the Supabase auth session on every request, and implements the
// custom-domain routing from decisions/002-domain-routing.md: a request
// whose Host header matches a client's custom_domain gets rewritten to that
// client's public page instead of expecting <agency-domain>/<slug>.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  const host = request.headers.get("host")?.split(":")[0];
  // TODO: once the agency has its own domain (decisions/001-stack-choice.md
  // notes the stack is locked but the agency's own name/domain is not yet
  // chosen — see memory/project_agency_structure.md), add it here so it
  // isn't mistaken for a client custom domain.
  const isAgencyHost = !host || host === "localhost" || host.endsWith(".vercel.app");

  if (!isAgencyHost && request.nextUrl.pathname === "/") {
    const { data: client } = await supabase
      .from("clients")
      .select("slug")
      .eq("custom_domain", host)
      .maybeSingle();

    if (client) {
      const url = request.nextUrl.clone();
      url.pathname = `/${client.slug}`;
      return NextResponse.rewrite(url, { request, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
