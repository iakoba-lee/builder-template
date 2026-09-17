"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSetPassword(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage("Password saved.");
  }

  return (
    <form onSubmit={handleSetPassword} className="flex max-w-xl flex-col gap-3">
      <h2 className="text-2xl font-semibold">Password</h2>
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        New
        <input
          type="password"
          required
          minLength={6}
          placeholder="Enter your new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm normal-case"
        />
      </label>
      <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Confirm
        <input
          type="password"
          required
          minLength={6}
          placeholder="Enter your new password (again)"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="mt-1 w-full rounded-md bg-neutral-100 px-3 py-2 text-sm normal-case"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="ml-auto rounded-md bg-neutral-400 px-5 py-2 text-sm text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}
    </form>
  );
}
