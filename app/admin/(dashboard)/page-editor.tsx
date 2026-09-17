"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addLink,
  deleteLink,
  moveLink,
  updateLink,
  updateProfile,
  updateTheme,
} from "../actions";
import { markForUrl } from "@/lib/link-mark";
import type { Client, LinkRow, ThemeSettings } from "@/lib/types";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "links", label: "Links" },
  { id: "appearance", label: "Appearance" },
] as const;

type Tab = (typeof tabs)[number]["id"];

const fonts = ["Inter", "Geist", "Georgia", "System"];

export function PageEditor({
  client,
  theme,
  links,
}: {
  client: Client;
  theme: ThemeSettings | null;
  links: LinkRow[];
}) {
  const [tab, setTab] = useState<Tab>("links");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const accent = theme?.color ?? "#2F6BFF";

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
            <ProfileForm
              client={client}
              pending={pending}
              onSave={(formData) => run(updateProfile, formData, "Profile saved.")}
            />
          )}
          {tab === "links" && (
            <LinksForm
              clientId={client.id}
              links={links}
              accent={accent}
              pending={pending}
              onAdd={(formData) => run(addLink, formData, "Link added.")}
              onUpdate={(formData) => run(updateLink, formData, "Link saved.")}
              onDelete={(formData) => run(deleteLink, formData, "Link deleted.")}
              onMove={(formData) => run(moveLink, formData, "Order updated.")}
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
      className="flex max-w-xl flex-col gap-4"
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

function LinksForm({
  clientId,
  links,
  accent,
  pending,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
}: {
  clientId: string;
  links: LinkRow[];
  accent: string;
  pending: boolean;
  onAdd: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  onMove: (formData: FormData) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onAdd(formData);
          setTitle("");
          setUrl("");
        }}
      >
        <input type="hidden" name="clientId" value={clientId} />
        <label className="flex-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Title
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm normal-case"
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
            className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm normal-case"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#2f6bff] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Add New
        </button>
      </form>
      {links.map((link, index) => (
        <LinkRowEditor
          key={link.id}
          clientId={clientId}
          link={link}
          accent={accent}
          pending={pending}
          isFirst={index === 0}
          isLast={index === links.length - 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
}

function LinkRowEditor({
  clientId,
  link,
  accent,
  pending,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMove,
}: {
  clientId: string;
  link: LinkRow;
  accent: string;
  pending: boolean;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  onMove: (formData: FormData) => void;
}) {
  const mark = markForUrl(link.url, accent);
  return (
    <form
      className="flex items-center gap-3 rounded-lg border border-black/5 px-3 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        onUpdate(new FormData(event.currentTarget));
      }}
    >
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="linkId" value={link.id} />
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
        style={{ background: mark.background }}
      >
        ↗
      </span>
      <div className="min-w-0 flex-1">
        <input
          name="title"
          defaultValue={link.title}
          className="w-full text-sm font-medium outline-none"
        />
        <input
          name="url"
          defaultValue={link.url}
          className="w-full truncate text-xs text-neutral-500 outline-none"
        />
      </div>
      <button
        type="button"
        disabled={pending || isFirst}
        onClick={() =>
          onMove(formData(clientId, link.id, "up"))
        }
        className="text-xs text-neutral-400 disabled:opacity-30"
      >
        Up
      </button>
      <button
        type="button"
        disabled={pending || isLast}
        onClick={() =>
          onMove(formData(clientId, link.id, "down"))
        }
        className="text-xs text-neutral-400 disabled:opacity-30"
      >
        Down
      </button>
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-[#2f6bff]"
      >
        Save
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => onDelete(formData(clientId, link.id))}
        className="text-xs text-red-500"
      >
        Delete
      </button>
    </form>
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
      <div
        className="rounded-lg p-4 text-white"
        style={{ background: color }}
      >
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
