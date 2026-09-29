import Link from "next/link";
import { loadPrep } from "../../data";
import { Empty, MarkTag, shortDate } from "../../ui";

export default async function Builds() {
  const { states } = await loadPrep();
  const builds = states.flatMap((t) =>
    t.cards.filter((s) => s.card.type === "build").map((s) => ({ topic: t.topic, s, last: s.attempts.at(-1) })),
  );
  if (builds.length === 0) {
    return <Empty title="No build tasks yet">Build tasks come with topics such as closures and promises.</Empty>;
  }

  return (
    <ul className="prep-cardlist">
      {builds.map(({ topic, s, last }) => (
        <li key={s.card.id}>
          <div className="head">
            <Link href={`/topics/${topic.id}`} className="prep-link">
              {topic.title}
            </Link>
            <span className="n">
              {s.card.minutes} min limit
              {last?.minutes !== undefined && ` · you took ${last.minutes} min`}
            </span>
          </div>
          <p className="prep-pre">{s.card.prompt}</p>
          <div className="head">
            <code className="n">builds/{topic.id}/</code>
            {last ? (
              <span>
                {shortDate(last.at)}
                {last.tests && <span className="n"> · {last.tests}</span>}{" "}
                <MarkTag mark={last.grade ?? last.selfMark} />
                {!last.grade && <span className="n"> (self-mark, not graded yet)</span>}
              </span>
            ) : (
              <span className="n">Not tried</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
