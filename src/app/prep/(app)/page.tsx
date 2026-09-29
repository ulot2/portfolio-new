import Link from "next/link";
import { TRACKS } from "@/lib/prep-validate";
import { loadPrep } from "../data";
import { buildQueue, isWeak, streak, today } from "../schedule";
import { Empty, Label, MarkTag, TRACK_NAMES, TYPE_NAMES } from "../ui";

export default async function Dashboard() {
  const { states, attempts, cards } = await loadPrep();
  if (states.length === 0) {
    return (
      <Empty title="No lessons yet">
        The first run writes your first topics. Open Claude Code in the interview folder and say “do the run”.
      </Empty>
    );
  }

  const now = today();
  const all = states.flatMap((t) => t.cards);
  const due = all.filter((s) => s.due !== null && s.due <= now).length;
  const learned = states.filter((t) => t.learned).length;
  const weak = all.filter(isWeak).length;
  const days = streak(attempts, now);

  const cardById = new Map(cards.map((c) => [c.id, c]));
  const topicById = new Map(states.map((t) => [t.topic.id, t.topic]));
  const latest = attempts
    .filter((a) => a.grade && a.gradedAt)
    .sort((a, b) => b.gradedAt!.localeCompare(a.gradedAt!))
    .slice(0, 4);

  // "Up next" is the queue for a 30-minute session, folded into rows.
  const queue = buildQueue(states, 30, now);
  const isBuild = (i: (typeof queue)[number]) => i.kind === "card" && i.card.type === "build";
  const lessons = queue.filter((i) => i.kind === "lesson");
  const fresh = new Set(lessons.map((l) => l.topic.id));
  const reviews = queue.filter((i) => i.kind === "card" && !isBuild(i) && !fresh.has(i.topic.id));
  const builds = queue.filter(isBuild);
  const minutesFor = (topicId: string) =>
    queue.filter((i) => i.topic.id === topicId && !isBuild(i)).reduce((m, i) => m + i.minutes, 0);

  return (
    <div className="prep-stack">
      <div className="prep-stats">
        <Stat value={due} label="Due today" />
        <Stat value={learned} of={states.length} label="Topics learned" />
        <Stat value={days} label={days === 1 ? "Day streak" : "Days streak"} tone="accent" />
        <Stat value={weak} label="Weak spots" tone={weak ? "red" : undefined} href={weak ? "/topics?weak=1" : undefined} />
      </div>

      <div className="prep-cols">
        <section>
          <Label n={1}>Tracks</Label>
          <ul className="prep-tracks">
            {TRACKS.map((track) => {
              const mine = states.filter((t) => t.topic.track === track);
              const done = mine.filter((t) => t.learned).length;
              const pct = mine.length ? Math.round((done / mine.length) * 100) : 0;
              return (
                <li key={track} className={mine.length ? "" : "idle"}>
                  <span>{TRACK_NAMES[track]}</span>
                  <span className="n">{mine.length ? `${done} / ${mine.length}` : "Not started"}</span>
                  <span className="prep-bar" aria-hidden="true">
                    <span style={{ width: `${pct}%` }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <Label n={2}>Latest feedback</Label>
          {latest.length === 0 ? (
            <p className="prep-quiet">Grades from the run show here.</p>
          ) : (
            <ul className="prep-rows">
              {latest.map((a) => {
                const card = cardById.get(a.cardId);
                return (
                  <li key={a.id}>
                    <Link href="/feedback">
                      {topicById.get(card?.topicId ?? "")?.title ?? "Removed card"} · {card ? TYPE_NAMES[card.type] : ""}
                    </Link>
                    <MarkTag mark={a.grade!} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section>
        <Label n={3}>Up next</Label>
        <ul className="prep-rows">
          {reviews.length > 0 && (
            <li>
              <Link href="/study">
                {reviews.length} review {reviews.length === 1 ? "card" : "cards"}
              </Link>
              <span className="n">{reviews.reduce((m, i) => m + i.minutes, 0)} min</span>
            </li>
          )}
          {lessons.map((l) => (
            <li key={l.topic.id}>
              <Link href="/study">New topic: {l.topic.title}</Link>
              <span className="n">{minutesFor(l.topic.id)} min</span>
            </li>
          ))}
          {builds.map((b) => (
            <li key={b.kind === "card" ? b.card.id : ""}>
              <Link href="/builds">Build: {b.topic.title}</Link>
              <span className="n">{b.minutes} min</span>
            </li>
          ))}
        </ul>
        <p className="prep-quiet">This is a 30-minute session. Study asks how much time you have.</p>
      </section>
    </div>
  );
}

function Stat({
  value,
  of,
  label,
  tone,
  href,
}: {
  value: number;
  of?: number;
  label: string;
  tone?: "accent" | "red";
  href?: string;
}) {
  const body = (
    <>
      <b className={tone}>
        {value}
        {of !== undefined && <span> / {of}</span>}
      </b>
      <span>{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="prep-stat">
      {body}
    </Link>
  ) : (
    <div className="prep-stat">{body}</div>
  );
}
