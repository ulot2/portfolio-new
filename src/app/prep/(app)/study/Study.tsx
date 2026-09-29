"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Card, Mark } from "@/lib/prep-validate";
import { BUDGETS, buildQueue, type QueueItem, type TopicState } from "../../schedule";

type Props = { states: TopicState[]; lessons: Record<string, React.ReactNode>; now: string };

const TYPE_LABEL = { explain: "Explain it back", short: "Question", mc: "Quiz", build: "Build it" };

export default function Study({ states, lessons, now }: Props) {
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(0);

  if (!queue) {
    const due = states.flatMap((t) => t.cards).filter((s) => s.due !== null && s.due <= now).length;
    return (
      <div className="prep-stack narrow">
        <div>
          <h2 className="prep-h2">How much time do you have?</h2>
          <p className="prep-quiet">
            {due} {due === 1 ? "card is" : "cards are"} due today. Due cards come first, then new topics.
          </p>
        </div>
        <div className="prep-budgets">
          {BUDGETS.map((b) => (
            <button key={b} className="prep-btn" onClick={() => setQueue(buildQueue(states, b, now))}>
              {b} min
            </button>
          ))}
        </div>
      </div>
    );
  }

  const item = queue[index];
  const next = () => setIndex((i) => i + 1);

  if (!item) {
    return (
      <div className="prep-stack narrow">
        <h2 className="prep-h2">Session done</h2>
        <p className="prep-quiet">
          You saved {saved} {saved === 1 ? "answer" : "answers"}. The next run grades them.
        </p>
        <div className="prep-actions">
          <Link href="/" className="prep-btn">
            Dashboard
          </Link>
          <button className="prep-btn" onClick={() => (setQueue(null), setIndex(0), setSaved(0))}>
            Study more
          </button>
        </div>
      </div>
    );
  }

  const left = queue.slice(index).reduce((m, i) => m + i.minutes, 0);

  return (
    <div className="prep-stack narrow">
      <div className="prep-progress">
        <span>
          {index + 1} of {queue.length} · {item.topic.title} · {item.kind === "lesson" ? "Lesson" : TYPE_LABEL[item.card.type]}
        </span>
        <span className="n">About {left} min left</span>
        <span className="prep-bar" aria-hidden="true">
          <span style={{ width: `${(index / queue.length) * 100}%` }} />
        </span>
      </div>

      {item.kind === "lesson" ? (
        <>
          {lessons[item.topic.id] ?? <p className="prep-quiet">This lesson did not load. Open it from Topics.</p>}
          <div className="prep-actions">
            <button className="prep-btn primary" onClick={next}>
              I read it
            </button>
          </div>
        </>
      ) : (
        <CardView key={item.card.id} card={item.card} onSaved={() => setSaved((n) => n + 1)} onNext={next} />
      )}
    </div>
  );
}

type Phase = "answer" | "reveal" | "result";

function CardView({ card, onSaved, onNext }: { card: Card; onSaved: () => void; onNext: () => void }) {
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>("answer");
  const [error, setError] = useState<React.ReactNode>("");
  const [busy, setBusy] = useState(false);
  const [grade, setGrade] = useState<Mark | null>(null);
  const [started, setStarted] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(0);

  async function save(selfMark?: Mark) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, answer, selfMark, minutes: card.type === "build" ? minutes : undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setError(
          <>
            Your session ended. <a href="/login">Log in again</a>. Your answer is still here.
          </>,
        );
        return;
      }
      if (!res.ok) {
        setError(data.error || "The answer was not saved. Try again.");
        return;
      }
      onSaved();
      if (card.type === "mc") {
        setGrade(data.attempt.grade);
        setPhase("result");
      } else {
        onNext();
      }
    } catch {
      setError("Could not reach the server. Your answer is still here. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const selfMark = (
    <fieldset className="prep-marks" disabled={busy}>
      <legend>How did you do?</legend>
      <button className="prep-btn got" onClick={() => save("got")}>
        Got it
      </button>
      <button className="prep-btn partly" onClick={() => save("partly")}>
        Partly
      </button>
      <button className="prep-btn missed" onClick={() => save("missed")}>
        Missed
      </button>
    </fieldset>
  );

  const reveal = (
    <div className="prep-reveal">
      {card.type !== "mc" && (
        <>
          <h3>{card.type === "build" ? "Reference solution" : "Model answer"}</h3>
          <div className={card.type === "build" ? "prep-code" : "prep-pre"}>{card.answer}</div>
        </>
      )}
      {card.keyPoints && (
        <>
          <h3>Key points</h3>
          <ul>
            {card.keyPoints.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <div className="prep-card">
      <p className="prep-prompt">{card.prompt}</p>

      {card.type === "mc" && (
        <fieldset className="prep-choices" disabled={phase === "result" || busy}>
          <legend className="visually-hidden">Choices</legend>
          {card.choices?.map((c) => (
            <label key={c} className={phase === "result" && c === card.answer ? "right" : undefined}>
              <input type="radio" name={card.id} value={c} checked={answer === c} onChange={() => (setAnswer(c), setError(""))} />
              {c}
            </label>
          ))}
        </fieldset>
      )}

      {(card.type === "explain" || card.type === "short") && (
        <>
          <label htmlFor="prep-answer" className="visually-hidden">
            Your answer
          </label>
          <textarea
            id="prep-answer"
            rows={card.type === "explain" ? 9 : 3}
            value={answer}
            readOnly={phase !== "answer"}
            onChange={(e) => (setAnswer(e.target.value), setError(""))}
            placeholder={card.type === "explain" ? "Explain it in your own words, as you would to an interviewer." : "Your answer"}
            autoFocus
          />
        </>
      )}

      {card.type === "build" && (
        <BuildPanel card={card} started={started} setStarted={setStarted} phase={phase} onStop={setMinutes} />
      )}

      {card.type === "build" && phase === "reveal" && (
        <>
          <label htmlFor="prep-note">A note for the grader (optional)</label>
          <textarea id="prep-note" rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="What was hard, what you left out" />
        </>
      )}

      <p className="prep-error" role="alert">
        {error}
      </p>

      {phase === "result" && grade && (
        <p className={`prep-result ${grade}`} role="status">
          {grade === "got" ? "Correct." : `Not this time. The answer is: ${card.answer}`}
        </p>
      )}
      {phase === "result" && card.keyPoints && reveal}
      {phase === "reveal" && reveal}
      {phase === "reveal" && selfMark}

      <div className="prep-actions">
        {phase === "answer" && card.type === "mc" && (
          <button
            className="prep-btn primary"
            disabled={busy}
            onClick={() => (answer ? save() : setError("Pick one of the choices first."))}
          >
            Check
          </button>
        )}
        {phase === "answer" && (card.type === "explain" || card.type === "short") && (
          <button
            className="prep-btn primary"
            onClick={() => (answer.trim() ? setPhase("reveal") : setError("Write an answer first."))}
          >
            Show the answer
          </button>
        )}
        {phase === "answer" && card.type === "build" && started !== null && (
          <button className="prep-btn primary" onClick={() => setPhase("reveal")}>
            I am done
          </button>
        )}
        {phase === "result" && (
          <button className="prep-btn primary" onClick={onNext} autoFocus>
            Next
          </button>
        )}
        {phase !== "result" && (
          <button className="prep-btn ghost" onClick={onNext} disabled={busy}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

function BuildPanel({
  card,
  started,
  setStarted,
  phase,
  onStop,
}: {
  card: Card;
  started: number | null;
  setStarted: (t: number) => void;
  phase: Phase;
  onStop: (minutes: number) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  const running = started !== null && phase === "answer";

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = started === null ? 0 : Math.max(0, now - started);
  useEffect(() => {
    if (phase === "reveal") onStop(Math.min(300, Math.round(elapsed / 60000)));
    // Only when the build ends. elapsed stops changing then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const limit = (card.minutes ?? 30) * 60000;
  const mm = String(Math.floor(elapsed / 60000)).padStart(2, "0");
  const ss = String(Math.floor(elapsed / 1000) % 60).padStart(2, "0");

  return (
    <div className="prep-build">
      <p>
        Write it in VS Code, in <code>builds/{card.topicId}/</code>. Run <code>node --test</code> there to check it.
      </p>
      <div className="prep-timer">
        <span className={elapsed > limit ? "over" : undefined} aria-live="off">
          {mm}:{ss}
        </span>
        <span className="n">of {card.minutes} min</span>
        {started === null && (
          <button className="prep-btn primary" onClick={() => (setStarted(Date.now()), setNow(Date.now()))}>
            Start the timer
          </button>
        )}
      </div>
    </div>
  );
}
