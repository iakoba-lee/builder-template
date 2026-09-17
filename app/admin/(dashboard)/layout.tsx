import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPrimaryClient } from "@/lib/data";
import { AdminNav } from "./admin-nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const loaded = await getPrimaryClient(supabase);
  const slug = loaded?.client.slug ?? "page";

  return (
    <div className="min-h-full bg-[#eef1f6] text-[#171717]">
      <header className="h-12 bg-[#111]" />
      <div className="flex min-h-[calc(100vh-3rem)]">
        <AdminNav slug={slug} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
