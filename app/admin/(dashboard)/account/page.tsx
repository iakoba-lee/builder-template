import { getPrimaryClient, requireUser } from "@/lib/data";
import { PasswordForm } from "../password-form";

export default async function AccountPage() {
  const { user, supabase } = await requireUser();
  const loaded = await getPrimaryClient(supabase);

  return (
    <main className="px-8 py-8">
      <h1 className="text-3xl font-bold text-[#2f6bff]">Account</h1>
      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">User Info</h2>
        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-neutral-500">
          Email
          <input
            readOnly
            value={user.email ?? ""}
            className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm normal-case"
          />
        </label>
      </section>
      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Pages</h2>
        {loaded ? (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-black/10 px-4 py-3">
            <div>
              <p className="font-medium">{loaded.client.name}</p>
              <p className="text-sm text-neutral-500">/{loaded.client.slug}</p>
            </div>
            <span className="rounded bg-[#2f6bff] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              Current
            </span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-neutral-500">No pages yet.</p>
        )}
      </section>
      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <PasswordForm />
      </section>
    </main>
  );
}
