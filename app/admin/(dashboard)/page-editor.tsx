"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addLink,
  deleteLink,
  moveLink,
  reorderLinks,
  updateLink,
  updateProfile,
  updateTheme,
} from "../actions";
import { markForUrl } from "@/lib/link-mark";
import { socialPlatformForUrl } from "@/lib/social";
import { SocialGlyph } from "@/components/social-glyph";
import type { Client, LinkRow, ThemeSettings } from "@/lib/types";
import { ClickTrendModal } from "./analytics/click-trend-modal";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "links", label: "Links" },
  { id: "appearance", label: "Appearance" },
] as const;

type Tab = (typeof tabs)[number]["id"];

const fonts = ["Inter", "Geist", "Georgia", "System"];

export type LinkClickStats = {
  clicks: number;
  today: number;
  share: number;
  series: { day: string; count: number }[];
};

const EMPTY_STATS: LinkClickStats = {
  clicks: 0,
  today: 0,
  share: 0,
  series: [],
};

export function PageEditor({
  client,
  theme,
  links,
  linkStats,
}: {
  client: Client;
  theme: ThemeSettings | null;
  links: LinkRow[];
  linkStats: Record<string, LinkClickStats>;
}) {
  const [tab, setTab] = useState<Tab>("links");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const accent = theme?.color ?? "#2F6BFF";
  const pageLinks = links.filter((link) => link.placement !== "profile");
  const profileLinks = links.filter((link) => link.placement === "profile");

  function run(
    action: (formData: FormData) => Promise<{ error?: string; ok?: boolean }>,
    formData: FormData,
    success: string,
  ) {
    startTransition(async () => {
      const result = await action(formData);
      setMessage(result.error ?? success);
    });
  }

  return (
    <main className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#2f6bff]">My Page</h1>
        <a
          href={`/${client.slug}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm"
        >
          Preview
        </a>
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex gap-6 border-b border-black/5 px-6">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`border-b-2 py-3 text-sm ${
                tab === item.id
                  ? "border-[#2f6bff] font-medium text-[#2f6bff]"
                  : "border-transparent text-neutral-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "profile" && (
            <div className="flex max-w-xl flex-col gap-8">
              <ProfileForm
                client={client}
                pending={pending}
                onSave={(formData) =>
                  run(updateProfile, formData, "Profile saved.")
                }
              />
              <SocialsEditor
                clientId={client.id}
                links={profileLinks}
                linkStats={linkStats}
                accent={accent}
                pending={pending}
                onAdd={(formData) => run(addLink, formData, "Social added.")}
                onUpdate={(formData) => run(updateLink, formData, "Social saved.")}
                onDelete={(formData) =>
                  run(deleteLink, formData, "Social removed.")
                }
                onMove={(formData) => run(moveLink, formData, "Order updated.")}
              />
            </div>
          )}
          {tab === "links" && (
            <LinksForm
              clientId={client.id}
              links={pageLinks}
              linkStats={linkStats}
              accent={accent}
              pending={pending}
              onAdd={(formData) => run(addLink, formData, "Link added.")}
              onUpdate={(formData) => run(updateLink, formData, "Link saved.")}
              onDelete={(formData) => run(deleteLink, formData, "Link deleted.")}
              onReorder={(formData) =>
                run(reorderLinks, formData, "Order saved.")
              }
            />
          )}
          {tab === "appearance" && (
            <AppearanceForm
              clientId={client.id}
              theme={theme}
              pending={pending}
              onSave={(formData) => run(updateTheme, formData, "Appearance saved.")}
            />
          )}
          {message && (
            <p className="mt-4 text-sm text-neutral-600">{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}

function ProfileForm({
  client,
  pending,
  onSave,
}: {
  client: Client;
  pending: boolean;
  onSave: (formData: FormData) => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState(client.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const supabase = createClient();
    const path = `${client.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
    });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(new FormData(event.currentTarget));
      }}
    >
      <input type="hidden" name="clientId" value={client.id} />
      <input type="hidden" name="avatarUrl" value={avatarUrl} />
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Display name
        <input
          name="name"
          defaultValue={client.name}
          required
          className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Bio
        <textarea
          name="bio"
          rows={4}
          defaultValue={client.bio ?? ""}
          className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm"
        />
      </label>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Profile picture
        </p>
        <div className="mt-2 flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-neutral-200" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
        {uploading && <p className="mt-1 text-xs text-neutral-500">Uploading…</p>}
      </div>
      <button
        type="submit"
        disabled={pending || uploading}
        className="ml-auto rounded-md bg-neutral-400 px-5 py-2 text-sm text-white disabled:opacity-50"
      >
        Save
      </button>
    </form>
  );
}

function SocialsEditor({
  clientId,
  links,
  linkStats,
  accent,
  pending,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
}: {
  clientId: string;
  links: LinkRow[];
  linkStats: Record<string, LinkClickStats>;
  accent: string;
  pending: boolean;
  onAdd: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  onMove: (formData: FormData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function resetAdd() {
    setTitle("");
    setUrl("");
    setAdding(false);
  }

  function stopEditing() {
    setEditing(false);
    resetAdd();
  }

  const selected = selectedId
    ? (links.find((link) => link.id === selectedId) ?? null)
    : null;
  const selectedStats = selected
    ? (linkStats[selected.id] ?? EMPTY_STATS)
    : null;

  return (
    <div className="border-t border-black/5 pt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Socials
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {editing
              ? "Reorder, edit, or remove profile icons."
              : "Icons under the bio. Click Edit to change them."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (editing ? stopEditing() : setEditing(true))}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            editing
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "border border-[#2f6bff]/30 bg-[#2f6bff]/5 text-[#2f6bff] hover:bg-[#2f6bff]/10"
          }`}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/8 bg-white">
        <ul className="divide-y divide-black/5">
          {links.map((link, index) => (
            <SocialRowEditor
              key={link.id}
              clientId={clientId}
              link={link}
              accent={accent}
              pending={pending}
              editing={editing}
              isFirst={index === 0}
              isLast={index === links.length - 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMove={onMove}
              onOpenTrend={() => setSelectedId(link.id)}
            />
          ))}
          {links.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-neutral-500">
              No socials yet. Click Edit to add one.
            </li>
          ) : null}
        </ul>
      </div>

      {editing ? (
        adding ? (
          <form
            className="mt-4 rounded-2xl border border-black/8 bg-white p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              onAdd(formData);
              resetAdd();
            }}
          >
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="placement" value="profile" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Label
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  autoFocus
                  placeholder="Newsletter"
                  className="mt-1 w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm normal-case text-neutral-900"
                />
              </label>
              <label className="flex-[2] text-xs font-medium uppercase tracking-wide text-neutral-500">
                URL
                <input
                  name="url"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  placeholder="https://"
                  className="mt-1 w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm normal-case text-neutral-900"
                />
              </label>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAdd}
                className="rounded-full px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-[#2f6bff] px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Add social
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-4 w-full rounded-2xl border border-[#2f6bff]/30 bg-[#2f6bff]/5 px-4 py-3 text-sm font-medium text-[#2f6bff] transition-colors hover:bg-[#2f6bff]/10"
          >
            + Add social
          </button>
        )
      ) : null}

      {selected && selectedStats ? (
        <ClickTrendModal
          id={selected.id}
          title={selected.title}
          subtitle="Clicks over the last 30 days"
          clicks={selectedStats.clicks}
          today={selectedStats.today}
          share={selectedStats.share}
          series={selectedStats.series}
          accent={accent}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}

function SocialRowEditor({
  clientId,
  link,
  accent,
  pending,
  editing,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMove,
  onOpenTrend,
}: {
  clientId: string;
  link: LinkRow;
  accent: string;
  pending: boolean;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  onMove: (formData: FormData) => void;
  onOpenTrend: () => void;
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const platform = socialPlatformForUrl(url || link.url);

  function saveIfChanged() {
    if (!editing) return;
    const cleanedTitle = title.trim();
    const cleanedUrl = url.trim();
    if (!cleanedTitle || !cleanedUrl) return;
    if (cleanedTitle === link.title && cleanedUrl === link.url) return;
    const data = new FormData();
    data.set("clientId", clientId);
    data.set("linkId", link.id);
    data.set("title", cleanedTitle);
    data.set("url", cleanedUrl);
    onUpdate(data);
  }

  return (
    <li className="flex items-center gap-3 px-3 py-3 sm:px-4">
      {editing ? (
        <div className="flex shrink-0 flex-col items-center gap-0.5 text-neutral-300">
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => onMove(formData(clientId, link.id, "up"))}
            className="rounded p-0.5 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-20"
            aria-label={`Move ${link.title} up`}
          >
            <ChevronIcon direction="up" />
          </button>
          <span className="px-1" aria-hidden>
            <GripIcon />
          </span>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() => onMove(formData(clientId, link.id, "down"))}
            className="rounded p-0.5 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-20"
            aria-label={`Move ${link.title} down`}
          >
            <ChevronIcon direction="down" />
          </button>
        </div>
      ) : null}

      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white"
        style={{ color: accent }}
      >
        <SocialGlyph platform={platform} size={18} />
      </span>

      <div className="min-w-0 flex-1">
        {editing ? (
          <>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={saveIfChanged}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              disabled={pending}
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
              aria-label="Social label"
            />
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onBlur={saveIfChanged}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              disabled={pending}
              className="mt-0.5 w-full truncate bg-transparent text-xs text-neutral-500 outline-none"
              aria-label="Social URL"
            />
          </>
        ) : (
          <>
            <p className="truncate text-sm font-semibold text-neutral-900">
              {link.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-neutral-500">{link.url}</p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenTrend}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label={`Open click trend for ${link.title}`}
          title="Click trend"
        >
          <ChartGlyph />
        </button>
        {editing ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => onDelete(formData(clientId, link.id))}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            aria-label={`Remove ${link.title}`}
          >
            <TrashIcon />
          </button>
        ) : null}
      </div>
    </li>
  );
}

function LinksForm({
  clientId,
  links,
  linkStats,
  accent,
  pending,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: {
  clientId: string;
  links: LinkRow[];
  linkStats: Record<string, LinkClickStats>;
  accent: string;
  pending: boolean;
  onAdd: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  onReorder: (formData: FormData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orderedLinks, setOrderedLinks] = useState(links);
  const [orderDirty, setOrderDirty] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const linksSignature = links
    .map((link) => `${link.id}:${link.title}:${link.url}:${link.position}`)
    .join("|");
  const [syncedSignature, setSyncedSignature] = useState(linksSignature);

  if (linksSignature !== syncedSignature) {
    setSyncedSignature(linksSignature);
    if (!orderDirty) {
      setOrderedLinks(links);
    } else {
      const byId = new Map(links.map((link) => [link.id, link]));
      const prevIds = new Set(orderedLinks.map((link) => link.id));
      const kept = orderedLinks
        .filter((link) => byId.has(link.id))
        .map((link) => byId.get(link.id)!);
      const added = links.filter((link) => !prevIds.has(link.id));
      const merged = [...added, ...kept];
      setOrderedLinks(merged);
      const same =
        links.length === merged.length &&
        links.every((link, index) => link.id === merged[index]?.id);
      if (same) setOrderDirty(false);
    }
  }

  const displayLinks = editing || orderDirty ? orderedLinks : links;

  function resetAdd() {
    setTitle("");
    setUrl("");
    setAdding(false);
  }

  function startEditing() {
    setOrderedLinks(links);
    setOrderDirty(false);
    setEditing(true);
  }

  function finishEditing() {
    if (orderDirty) {
      const data = new FormData();
      data.set("clientId", clientId);
      data.set("placement", "page");
      data.set(
        "orderedIds",
        orderedLinks.map((link) => link.id).join(","),
      );
      onReorder(data);
    }
    setEditing(false);
    resetAdd();
    setDragIndex(null);
  }

  function moveLocal(index: number, direction: "up" | "down") {
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= orderedLinks.length) return;
    setOrderedLinks((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[swapWith];
      next[swapWith] = temp;
      return next;
    });
    setOrderDirty(true);
  }

  function moveToIndex(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || to >= orderedLinks.length) return;
    setOrderedLinks((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setOrderDirty(true);
  }

  const selected = selectedId
    ? (displayLinks.find((link) => link.id === selectedId) ?? null)
    : null;
  const selectedStats = selected
    ? (linkStats[selected.id] ?? EMPTY_STATS)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          {editing
            ? "Reorder, edit, or remove links. Order saves when you click Done."
            : "Click Edit to reorder or change links."}
        </p>
        <button
          type="button"
          onClick={() => (editing ? finishEditing() : startEditing())}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            editing
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "border border-[#2f6bff]/30 bg-[#2f6bff]/5 text-[#2f6bff] hover:bg-[#2f6bff]/10"
          }`}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {editing ? (
        adding ? (
          <form
            className="rounded-2xl border border-black/8 bg-white p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              onAdd(formData);
              resetAdd();
            }}
          >
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="placement" value="page" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Title
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  autoFocus
                  className="mt-1 w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm normal-case text-neutral-900"
                />
              </label>
              <label className="flex-[2] text-xs font-medium uppercase tracking-wide text-neutral-500">
                URL
                <input
                  name="url"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  placeholder="https://"
                  className="mt-1 w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm normal-case text-neutral-900"
                />
              </label>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAdd}
                className="rounded-full px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-[#2f6bff] px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Add link
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-2xl border border-[#2f6bff]/30 bg-[#2f6bff]/5 px-4 py-3 text-sm font-medium text-[#2f6bff] transition-colors hover:bg-[#2f6bff]/10"
          >
            + Add link
          </button>
        )
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
        <ul className="divide-y divide-black/5">
          {displayLinks.map((link, index) => (
            <LinkRowEditor
              key={link.id}
              clientId={clientId}
              link={link}
              accent={accent}
              pending={pending}
              editing={editing}
              isFirst={index === 0}
              isLast={index === displayLinks.length - 1}
              dragging={dragIndex === index}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMoveUp={() => moveLocal(index, "up")}
              onMoveDown={() => moveLocal(index, "down")}
              onDragStart={() => setDragIndex(index)}
              onDragOver={() => {
                if (dragIndex === null || dragIndex === index) return;
                moveToIndex(dragIndex, index);
                setDragIndex(index);
              }}
              onDragEnd={() => setDragIndex(null)}
              onOpenTrend={() => setSelectedId(link.id)}
            />
          ))}
          {displayLinks.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-neutral-500">
              No links yet. Click Edit to add one.
            </li>
          ) : null}
        </ul>
      </div>

      {selected && selectedStats ? (
        <ClickTrendModal
          id={selected.id}
          title={selected.title}
          subtitle={`Clicks over the last 30 days · ${hostnameOf(selected.url)}`}
          clicks={selectedStats.clicks}
          today={selectedStats.today}
          share={selectedStats.share}
          series={selectedStats.series}
          accent={accent}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function LinkRowEditor({
  clientId,
  link,
  accent,
  pending,
  editing,
  isFirst,
  isLast,
  dragging,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragEnd,
  onOpenTrend,
}: {
  clientId: string;
  link: LinkRow;
  accent: string;
  pending: boolean;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  dragging: boolean;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  onOpenTrend: () => void;
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const mark = markForUrl(url || link.url, accent);
  const platform = socialPlatformForUrl(url || link.url);

  function saveIfChanged() {
    if (!editing) return;
    const cleanedTitle = title.trim();
    const cleanedUrl = url.trim();
    if (!cleanedTitle || !cleanedUrl) return;
    if (cleanedTitle === link.title && cleanedUrl === link.url) return;
    const data = new FormData();
    data.set("clientId", clientId);
    data.set("linkId", link.id);
    data.set("title", cleanedTitle);
    data.set("url", cleanedUrl);
    onUpdate(data);
  }

  return (
    <li
      className={`flex items-center gap-3 px-3 py-3 sm:px-4 ${
        dragging ? "bg-[#2f6bff]/5 opacity-80" : ""
      }`}
      onDragOver={(event) => {
        if (!editing) return;
        event.preventDefault();
        onDragOver();
      }}
    >
      {editing ? (
        <div className="flex shrink-0 flex-col items-center gap-0.5 text-neutral-300">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="rounded p-0.5 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-20"
            aria-label={`Move ${link.title} up`}
          >
            <ChevronIcon direction="up" />
          </button>
          <span
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", link.id);
              onDragStart();
            }}
            onDragEnd={onDragEnd}
            className="cursor-grab select-none rounded px-1 py-0.5 hover:bg-neutral-100 hover:text-neutral-600 active:cursor-grabbing"
            aria-label={`Drag to reorder ${link.title}`}
          >
            <GripIcon />
          </span>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="rounded p-0.5 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-20"
            aria-label={`Move ${link.title} down`}
          >
            <ChevronIcon direction="down" />
          </button>
        </div>
      ) : null}

      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white"
        style={{
          background: platform ? "#fff" : mark.background,
          color: platform ? accent : "#fff",
          border: platform ? "1px solid rgba(0,0,0,0.08)" : undefined,
        }}
      >
        {platform ? (
          <SocialGlyph platform={platform} size={18} />
        ) : (
          <span className="text-sm font-semibold">
            {(title || link.title).slice(0, 1).toUpperCase() || "↗"}
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        {editing ? (
          <>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={saveIfChanged}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              disabled={pending}
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
              aria-label="Link title"
            />
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onBlur={saveIfChanged}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              disabled={pending}
              className="mt-0.5 w-full truncate bg-transparent text-xs text-neutral-500 outline-none"
              aria-label="Link URL"
            />
          </>
        ) : (
          <>
            <p className="truncate text-sm font-semibold text-neutral-900">
              {link.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-neutral-500">{link.url}</p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenTrend}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label={`Open click trend for ${link.title}`}
          title="Click trend"
        >
          <ChartGlyph />
        </button>
        {editing ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => onDelete(formData(clientId, link.id))}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            aria-label={`Delete ${link.title}`}
          >
            <TrashIcon />
          </button>
        ) : null}
      </div>
    </li>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden>
      <circle cx="2" cy="2" r="1.2" />
      <circle cx="8" cy="2" r="1.2" />
      <circle cx="2" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="2" cy="14" r="1.2" />
      <circle cx="8" cy="14" r="1.2" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d={direction === "up" ? "M3 7.5 6 4.5 9 7.5" : "M3 4.5 6 7.5 9 4.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 12.5V10M6 12.5V6M10 12.5V8M14 12.5V3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 4.5h10M6.5 4.5V3.5h3v1M5 4.5l.5 8h5l.5-8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formData(clientId: string, linkId: string, direction?: string) {
  const data = new FormData();
  data.set("clientId", clientId);
  data.set("linkId", linkId);
  if (direction) data.set("direction", direction);
  return data;
}

function AppearanceForm({
  clientId,
  theme,
  pending,
  onSave,
}: {
  clientId: string;
  theme: ThemeSettings | null;
  pending: boolean;
  onSave: (formData: FormData) => void;
}) {
  const [color, setColor] = useState(theme?.color ?? "#2F6BFF");
  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(new FormData(event.currentTarget));
      }}
    >
      <input type="hidden" name="clientId" value={clientId} />
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Accent color
        <div className="mt-1 flex items-center gap-3">
          <input
            type="color"
            name="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-10 w-14 cursor-pointer bg-transparent"
          />
          <span className="text-sm normal-case text-neutral-600">{color}</span>
        </div>
      </label>
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Font
        <select
          name="font"
          defaultValue={theme?.font ?? "Inter"}
          className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm normal-case"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </label>
      <div className="rounded-lg p-4 text-white" style={{ background: color }}>
        Preview of the page accent
      </div>
      <button
        type="submit"
        disabled={pending}
        className="ml-auto rounded-md bg-neutral-400 px-5 py-2 text-sm text-white disabled:opacity-50"
      >
        Save
      </button>
    </form>
  );
}
