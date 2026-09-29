"use client";

import { useState } from "react";

/** Same passphrase and login route as the jobs dashboard, in the portfolio style. */
export default function PrepLogin() {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/jobs/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      if (res.ok) {
        // Full reload: the middleware must see the new cookie.
        window.location.href = "/";
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "That did not work.");
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="prep-login" id="main">
      <p className="prep-brand">
        prep<span>.</span>
      </p>
      <p>This app is private. Enter your passphrase to continue.</p>
      <form onSubmit={submit}>
        <label htmlFor="passphrase" className="visually-hidden">
          Passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          autoComplete="current-password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Passphrase"
          required
          autoFocus
        />
        <p className="prep-error" role="alert">
          {error}
        </p>
        <button className="prep-btn primary" disabled={busy || !passphrase}>
          {busy ? "Checking…" : "Continue"}
        </button>
      </form>
    </main>
  );
}
