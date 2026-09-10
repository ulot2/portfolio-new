"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Answer = { q: string; a: string };
type Role = {
  ext_id: string;
  company?: string;
  title?: string;
  location?: string;
  url?: string;
  source?: string;
  score?: number | null;
  reason?: string;
  mode?: string;
  resume?: string;
  letter_text?: string;
  answers?: Answer[];
  status?: string;
  notes?: string;
  applied_at?: string | null;
  updated_at?: string;
};

const FILTERS: [string, string, (r: Role) => boolean][] = [
  ["review", "To review", (r) => !r.status || r.status === "new"],
  ["shortlisted", "Shortlisted", (r) => r.status === "shortlisted"],
  ["applied", "Applied", (r) => r.status === "applied"],
  ["skipped", "Skipped", (r) => r.status === "skipped"],
  ["all", "All", () => true],
];

const scoreClass = (n?: number | null) =>
  n == null ? "lo" : n >= 8 ? "hi" : n >= 5 ? "mid" : "lo";

export default function JobsDashboard() {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [error, setError] = useState("");
  const [active, setActive] = useState("review");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1900);
  }, []);

  useEffect(() => {
    let live = true;
    fetch("/api/jobs")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return null;
        }
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => {
        if (live && data) setRoles(data.roles ?? []);
      })
      .catch(() => live && setError("The roles could not be loaded. Reload the page."));
    return () => {
      live = false;
    };
  }, []);

  const save = useCallback(
    async (extId: string, patch: { status?: string; notes?: string }, okMsg: string) => {
      // Optimistic: the tap should feel instant, and a failure rolls back.
      const before = roles;
      setRoles((rs) =>
        rs?.map((r) => (r.ext_id === extId ? { ...r, ...patch } : r)) ?? rs,
      );
      try {
        const res = await fetch("/api/jobs", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ext_id: extId, ...patch }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const { role } = await res.json();
        setRoles((rs) => rs?.map((r) => (r.ext_id === extId ? role : r)) ?? rs);
        say(okMsg);
      } catch {
        setRoles(before);
        say("Could not save, try again");
      }
    },
    [roles, say],
  );

  const stats = useMemo(() => {
    const list = roles ?? [];
    const n = (s: string) => list.filter((r) => r.status === s).length;
    const week = Date.now() - 7 * 864e5;
    const recent = list.filter(
      (r) => r.applied_at && Date.parse(r.applied_at) > week,
    ).length;
    const cos: Record<string, number> = {};
    list
      .filter((r) => r.status === "applied")
      .forEach((r) => {
        const c = r.company || "?";
        cos[c] = (cos[c] || 0) + 1;
      });
    const top = Object.entries(cos).sort((a, b) => b[1] - a[1])[0];
    const items: [string, number, string][] = [
      ["", list.length, "found"],
      ["short", n("shortlisted"), "shortlisted"],
      ["applied", n("applied"), "applied"],
      ["", recent, "this week"],
    ];
    if (top) items.push(["", top[1], `at ${top[0]}`]);
    return items;
  }, [roles]);

  const visible = useMemo(() => {
    const fn = FILTERS.find((f) => f[0] === active)![2];
    return (roles ?? []).filter(fn).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [roles, active]);

  const lastChange = useMemo(() => {
    const stamps = (roles ?? []).map((r) => r.updated_at).filter(Boolean) as string[];
    return stamps.sort().pop();
  }, [roles]);

  if (error) {
    return (
      <main className="wrap">
        <div className="note">
          <b>No connection to your roles</b>
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div className="mast">
        <h1>Roles Worth Your Morning</h1>
        <div className="sub">
          {roles === null
            ? ""
            : `${roles.length} roles${
                lastChange
                  ? ` · last change ${new Date(lastChange).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}`
                  : ""
              }`}
        </div>
      </div>

      {roles === null ? (
        <div className="roles">
          <div className="note">
            <b>Loading</b>
            Reading the roles your agent found.
          </div>
        </div>
      ) : (
        <>
          <div className="stats">
            {stats.map(([cls, v, label]) => (
              <div className={`stat ${cls}`} key={label}>
                <b>{v}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="tabs" role="tablist">
            {FILTERS.map(([key, label, fn]) => (
              <button
                key={key}
                className="tab"
                role="tab"
                aria-selected={key === active}
                onClick={() => setActive(key)}
              >
                {label}
                <span className="n">{(roles ?? []).filter(fn).length}</span>
              </button>
            ))}
          </div>

          <div className="roles">
            {visible.length === 0 ? (
              <div className="note">
                <b>Nothing here</b>
                {active === "review"
                  ? "Every role has been triaged. The next run adds more."
                  : "No roles with this status yet."}
              </div>
            ) : (
              visible.map((r) => (
                <RoleCard key={r.ext_id} role={r} onSave={save} onToast={say} />
              ))
            )}
          </div>
        </>
      )}

      <div className={`toast ${toast ? "on" : ""}`}>{toast}</div>
    </main>
  );
}

function RoleCard({
  role: r,
  onSave,
  onToast,
}: {
  role: Role;
  onSave: (id: string, patch: { status?: string; notes?: string }, msg: string) => void;
  onToast: (msg: string) => void;
}) {
  const [notes, setNotes] = useState(r.notes ?? "");
  const [fetching, setFetching] = useState(false);
  const done = r.status === "applied" || r.status === "skipped";

  useEffect(() => setNotes(r.notes ?? ""), [r.notes]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      onToast("Copied");
    } catch {
      onToast("Select the text and copy it manually");
    }
  }

  function setStatus(want: string) {
    const next = r.status === want ? "new" : want;
    onSave(
      r.ext_id,
      { status: next },
      next === "new" ? "Moved back to review" : `Marked ${next}`,
    );
  }

  async function getResume() {
    if (!r.resume) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/jobs/resume/${encodeURIComponent(r.resume)}`);
      if (!res.ok) throw new Error(String(res.status));

      // Fetching as a blob discards Content-Disposition, so read the filename
      // off the header first. Without this the file saves under its internal
      // slug, which is what an employer would then receive.
      const disposition = res.headers.get("content-disposition") ?? "";
      const named = /filename="([^"]+)"/.exec(disposition)?.[1];

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = named || `${r.resume}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      onToast("Could not fetch that resume");
    } finally {
      setFetching(false);
    }
  }

  return (
    <article className={`role ${done ? "done" : ""}`}>
      <div className="rail">
        <div className={`score ${scoreClass(r.score)}`}>{r.score ?? "–"}</div>
        <div className="of">/10</div>
      </div>
      <div>
        <div className="head">
          <span className="title">{r.title}</span>
          {r.status && r.status !== "new" ? (
            <span className={`pill ${r.status}`}>{r.status}</span>
          ) : null}
          <span className={`pill ${r.mode === "autofill" ? "autofill" : ""}`}>
            {r.mode || "prepare"}
          </span>
        </div>
        <div className="where">
          <span className="co">{r.company}</span> · {r.location || "location not stated"}
        </div>
        {r.reason ? <p className="reason">{r.reason}</p> : null}

        {r.letter_text ? (
          <details>
            <summary>Cover letter</summary>
            <div className="body">{r.letter_text}</div>
            <button className="btn" onClick={() => copy(r.letter_text!)}>
              Copy letter
            </button>
          </details>
        ) : null}

        {r.answers?.length ? (
          <details>
            <summary>Screening answers ({r.answers.length})</summary>
            {r.answers.map((qa, i) => (
              <div className="qa" key={i}>
                <div className="q">{qa.q}</div>
                <div className="body">{qa.a}</div>
                <button className="btn" onClick={() => copy(qa.a)}>
                  Copy answer
                </button>
              </div>
            ))}
          </details>
        ) : null}

        <div className="actions">
          <a className="btn apply" href={r.url} target="_blank" rel="noopener noreferrer">
            Apply
          </a>
          {r.resume ? (
            <button className="btn" onClick={getResume} disabled={fetching}>
              {fetching ? "Fetching" : "Resume"}
            </button>
          ) : null}
          <span className="spacer" />
          <button
            className="btn"
            aria-pressed={r.status === "shortlisted"}
            onClick={() => setStatus("shortlisted")}
          >
            Shortlist
          </button>
          <button
            className="btn"
            aria-pressed={r.status === "applied"}
            onClick={() => setStatus("applied")}
          >
            Applied
          </button>
          <button
            className="btn"
            aria-pressed={r.status === "skipped"}
            onClick={() => setStatus("skipped")}
          >
            Skip
          </button>
        </div>

        <textarea
          value={notes}
          rows={1}
          placeholder="Notes: interview dates, recruiter names, follow-ups"
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (r.notes ?? "")) onSave(r.ext_id, { notes }, "Note saved");
          }}
        />
      </div>
    </article>
  );
}
