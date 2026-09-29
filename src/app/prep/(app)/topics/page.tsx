import Link from "next/link";
import { TRACKS } from "@/lib/prep-validate";
import { loadPrep } from "../../data";
import { isWeak } from "../../schedule";
import { Empty, Label, TRACK_NAMES } from "../../ui";

const STATUS = { new: "New", learning: "Learning", mastered: "Mastered" };

export default async function Topics({ searchParams }: { searchParams: Promise<{ q?: string; weak?: string }> }) {
  const { q = "", weak } = await searchParams;
  const { states } = await loadPrep();
  if (states.length === 0) return <Empty title="No topics yet">The first run writes your first topics.</Empty>;

  const weakCount = states.filter((t) => t.cards.some(isWeak)).length;
  const shown = states.filter(
    (t) => (!weak || t.cards.some(isWeak)) && t.topic.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="prep-stack">
      <nav className="prep-filters" aria-label="Filter topics">
        <Link href="/topics" aria-current={!weak && !q ? "page" : undefined}>
          All <span className="n">{states.length}</span>
        </Link>
        <Link href="/topics?weak=1" aria-current={weak ? "page" : undefined}>
          Weak spots <span className="n">{weakCount}</span>
        </Link>
        {q && (
          <span className="prep-quiet">
            Matching “{q}” · <Link href="/topics">Clear</Link>
          </span>
        )}
      </nav>

      {shown.length === 0 && <p className="prep-quiet">No topics match.</p>}

      {TRACKS.map((track, i) => {
        const list = shown.filter((t) => t.topic.track === track);
        if (list.length === 0) return null;
        return (
          <section key={track}>
            <Label n={i + 1}>{TRACK_NAMES[track]}</Label>
            <ul className="prep-rows">
              {list.map((t) => (
                <li key={t.topic.id}>
                  <Link href={`/topics/${t.topic.id}`} className="prep-link">
                    {t.topic.title}
                  </Link>
                  <span className="prep-boxes" aria-label={`Boxes: ${t.cards.map((s) => s.box).join(", ")}`}>
                    {t.cards.map((s) => (
                      <i key={s.card.id} data-box={s.attempts.length ? s.box : 0} className={isWeak(s) ? "weak" : undefined} />
                    ))}
                  </span>
                  <span className={`prep-status ${t.status}`}>{STATUS[t.status]}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
