import { notFound } from "next/navigation";
import { getLesson } from "@/lib/prep-store";
import { loadPrep } from "../../../data";
import { isWeak } from "../../../schedule";
import { Label, Lesson, MarkTag, shortDate, TRACK_NAMES, TYPE_NAMES } from "../../../ui";

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { redis, states } = await loadPrep();
  const t = states.find((s) => s.topic.id === id);
  if (!t) notFound();
  const lesson = await getLesson(redis, id);

  return (
    <div className="prep-stack narrow">
      <div>
        <p className="prep-kicker">{TRACK_NAMES[t.topic.track]}</p>
        <h2 className="prep-h2">{t.topic.title}</h2>
      </div>

      <section>
        <Label n={1}>Lesson</Label>
        {lesson ? <Lesson source={lesson} /> : <p className="prep-quiet">The run has not written this lesson yet.</p>}
      </section>

      <section>
        <Label n={2}>Cards</Label>
        <ul className="prep-cardlist">
          {t.cards.map((s) => (
            <li key={s.card.id}>
              <div className="head">
                <span className="prep-kicker">{TYPE_NAMES[s.card.type]}</span>
                <span className="n">
                  {s.attempts.length === 0
                    ? "Not tried"
                    : `Box ${s.box} · due ${shortDate(s.due! + "T00:00:00Z")}${isWeak(s) ? " · weak spot" : ""}`}
                </span>
              </div>
              <p className="prep-pre">{s.card.prompt}</p>
              {s.attempts.length > 0 && (
                <details>
                  <summary>
                    {s.attempts.length} {s.attempts.length === 1 ? "attempt" : "attempts"}
                  </summary>
                  <ol className="prep-history">
                    {[...s.attempts].reverse().map((a) => (
                      <li key={a.id}>
                        <div className="head">
                          <span>{shortDate(a.at)}</span>
                          <span>
                            You: <MarkTag mark={a.selfMark} />
                            {a.grade && (
                              <>
                                {" "}
                                Claude: <MarkTag mark={a.grade} />
                              </>
                            )}
                            {a.tests && <span className="n"> · {a.tests}</span>}
                          </span>
                        </div>
                        {a.answer && <p className="prep-pre dim">{a.answer}</p>}
                        {a.feedback && <p className="prep-pre">{a.feedback}</p>}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
