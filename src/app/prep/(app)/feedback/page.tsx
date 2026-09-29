import Link from "next/link";
import { loadPrep } from "../../data";
import { Empty, MarkTag, shortDate, TYPE_NAMES } from "../../ui";
import NewTag from "./NewTag";

export default async function Feedback() {
  const { attempts, cards, topics } = await loadPrep();
  const cardById = new Map(cards.map((c) => [c.id, c]));
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const graded = attempts
    .filter((a) => a.grade && a.gradedAt && a.feedback)
    .sort((a, b) => b.gradedAt!.localeCompare(a.gradedAt!));

  if (graded.length === 0) {
    return <Empty title="No feedback yet">After you answer cards, the next run grades them. Its notes show here.</Empty>;
  }

  return (
    <ul className="prep-cardlist">
      {graded.map((a) => {
        const card = cardById.get(a.cardId);
        const topic = topicById.get(card?.topicId ?? "");
        return (
          <li key={a.id}>
            <div className="head">
              <span>
                {topic ? (
                  <Link href={`/topics/${topic.id}`} className="prep-link">
                    {topic.title}
                  </Link>
                ) : (
                  "Removed card"
                )}
                {card && <span className="n"> · {TYPE_NAMES[card.type]}</span>} <NewTag gradedAt={a.gradedAt!} />
              </span>
              <span className="n">{shortDate(a.gradedAt!)}</span>
            </div>
            {card && <p className="prep-pre dim">{card.prompt}</p>}
            <p>
              You: <MarkTag mark={a.selfMark} /> Claude: <MarkTag mark={a.grade!} />
              {a.tests && <span className="n"> · {a.tests}</span>}
            </p>
            <p className="prep-pre">{a.feedback}</p>
          </li>
        );
      })}
    </ul>
  );
}
