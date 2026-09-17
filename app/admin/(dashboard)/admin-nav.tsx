"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "../sign-out";

const nav = [
  { href: "/admin", label: "My Page" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/account", label: "Account" },
];

export function AdminNav({ slug }: { slug: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-5">
      <p className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
        /{slug}
      </p>
      <nav className="mt-6 flex flex-col gap-1 text-sm">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 ${
                active
                  ? "bg-blue-50 font-medium text-[#2f6bff]"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-[#2f6bff]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOut} className="mt-auto pb-16">
        <button
          type="submit"
          className="rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:text-neutral-800"
        >
          Log Out
        </button>
      </form>
    </aside>
  );
}
