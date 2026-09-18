"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "working" | "sent" | "error";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const notAuthorized = searchParams.get("error") === "not-authorized";
  const [status, setStatus] = useState<Status>(
    notAuthorized ? "error" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    notAuthorized ? "That account isn't authorized for the admin panel." : null,
  );

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace("/admin");
      }
    });
  }, []);

  async function handlePasswordLogin(event: FormEvent) {
    event.preventDefault();
    setStatus("working");
    setErrorMessage(null);
    if (!password) {
      setErrorMessage("Enter a password, or email yourself a magic link.");
      setStatus("error");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }
    // refresh() first so the push re-fetches server components with the new auth cookie
    router.refresh();
    router.push("/admin");
  }

  async function handleMagicLink() {
    setStatus("working");
    setErrorMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });
    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-sm text-neutral-600">
          We sent a login link to {email}.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-left text-sm text-blue-600"
        >
          Back to login
        </button>
      </main>
    );
  }

  const busy = status === "working";

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Agency admin login</h1>
      <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="you@agency.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded border border-neutral-300 px-3 py-2"
        />
        <input
          type="password"
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Log in"}
        </button>
        <button
          type="button"
          disabled={busy || !email}
          onClick={handleMagicLink}
          className="rounded border border-neutral-300 px-3 py-2 disabled:opacity-50"
        >
          Email me a magic link instead
        </button>
        {status === "error" && errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}
      </form>
    </main>
  );
}
