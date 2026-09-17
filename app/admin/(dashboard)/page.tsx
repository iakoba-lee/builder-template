import { getPrimaryClient, requireUser } from "@/lib/data";
import { PageEditor } from "./page-editor";

export default async function MyPage() {
  const { supabase } = await requireUser();
  const loaded = await getPrimaryClient(supabase);

  if (!loaded) {
    return (
      <main className="px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2f6bff]">My Page</h1>
        <p className="mt-4 text-sm text-neutral-600">
          No client is set up yet.
        </p>
      </main>
    );
  }

  return (
    <PageEditor
      client={loaded.client}
      theme={loaded.theme}
      links={loaded.links}
    />
  );
}
