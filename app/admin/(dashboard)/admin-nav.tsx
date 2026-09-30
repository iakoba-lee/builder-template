"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "../sign-out";

type NavItem = {
  href: string;
  label: string;
  icon: "page" | "analytics" | "account";
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    label: "Create",
    items: [{ href: "/admin", label: "My Page", icon: "page" }],
  },
  {
    label: "Monitor",
    items: [{ href: "/admin/analytics", label: "Analytics", icon: "analytics" }],
  },
  {
    label: "Workspace",
    items: [{ href: "/admin/account", label: "Account", icon: "account" }],
  },
];

export function AdminNav({
  slug,
  clientName,
  avatarUrl,
}: {
  slug: string;
  clientName: string;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const initial = (clientName.trim().charAt(0) || slug.charAt(0) || "A").toUpperCase();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-black/5 bg-[#f7f8fa] px-4 py-5">
      <div className="flex items-center gap-2.5 px-1">
        <ClientAvatar avatarUrl={avatarUrl} initial={initial} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {clientName || slug}
          </p>
          <p className="truncate text-xs text-neutral-500">/{slug}</p>
        </div>
      </div>

      <nav className="mt-7 flex flex-col gap-5 text-sm">
        {sections.map((section) => (
          <div key={section.label ?? "main"} className="flex flex-col gap-1">
            {section.label ? (
              <p className="px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                {section.label}
              </p>
            ) : null}
            {section.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors ${
                    active
                      ? "bg-white font-medium text-neutral-900 shadow-sm"
                      : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        <form action={signOut} className="mt-1">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-neutral-500 transition-colors hover:bg-white/70 hover:text-neutral-800"
          >
            <NavIcon name="logout" />
            Log Out
          </button>
        </form>
      </nav>
    </aside>
  );
}

function ClientAvatar({
  avatarUrl,
  initial,
}: {
  avatarUrl: string | null;
  initial: string;
}) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2f6bff] text-sm font-semibold text-white">
      {initial}
    </span>
  );
}

function NavIcon({
  name,
}: {
  name: "page" | "analytics" | "account" | "logout";
}) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "page":
      return (
        <svg {...common}>
          <path
            d="M4 2.5h5.5L12 5v8.5H4V2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 2.5V5H12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "analytics":
      return (
        <svg {...common}>
          <path
            d="M3 12.5V9M7 12.5V5.5M11 12.5V7.5M13.5 12.5h-12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "account":
      return (
        <svg {...common}>
          <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M3.5 13c.7-2 2.2-3 4.5-3s3.8 1 4.5 3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path
            d="M6.5 3H4.5A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h2M9 5l2.5 3L9 11M6.5 8H11.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
