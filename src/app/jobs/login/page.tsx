"use client";

import { useState } from "react";

export default function JobsLogin() {
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
        // Full reload, not a client route change: middleware has to see the new
        // cookie before it will rewrite the request to the dashboard.
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
    <main className="login">
      <h1>Roles Worth Your Morning</h1>
      <p>This dashboard is private. Enter your passphrase to continue.</p>
      <form onSubmit={submit}>
        <label htmlFor="passphrase" className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
          Passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Passphrase"
        />
        <p className="err" role="alert">{error}</p>
        <button type="submit" disabled={busy || !passphrase}>
          {busy ? "Checking" : "Unlock"}
        </button>
      </form>
    </main>
  );
}
