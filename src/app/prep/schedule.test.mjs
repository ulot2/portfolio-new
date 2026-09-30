// Run: node --test --experimental-strip-types src/app/prep/schedule.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { addDays, buildQueue, cardState, streak, topicStates } from "./schedule.ts";

const card = (id, topicId, type = "short", extra = {}) => ({ id, topicId, type, prompt: "p", answer: "a", ...extra });
const tries = (cardId, ...marks) =>
  marks.map((m, i) => ({ id: `${cardId}-${i}`, cardId, at: `2026-09-${String(10 + i).padStart(2, "0")}T09:00:00Z`, answer: "x", ...m }));

test("addDays crosses month ends", () => {
  assert.equal(addDays("2026-09-29", 3), "2026-10-02");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
});

test("boxes: got moves up, partly stays, missed resets, grade beats self-mark", () => {
  const c = card("c", "t");
  assert.deepEqual(cardState(c, []).due, null);
  const s = cardState(c, tries("c", { selfMark: "got" }, { selfMark: "got" }, { selfMark: "partly" }));
  assert.equal(s.box, 3);
  assert.equal(s.due, "2026-09-19"); // last try on the 12th, box 3 = 7 days
  assert.equal(cardState(c, tries("c", { selfMark: "got" }, { selfMark: "got", grade: "missed" })).box, 1);
  assert.equal(cardState(c, tries("c", ...Array(9).fill({ selfMark: "got" }))).box, 5);
});

test("topic status and learned", () => {
  const topics = [{ id: "b", track: "js", title: "B", order: 2 }, { id: "a", track: "js", title: "A", order: 1 }];
  const cards = [card("a1", "a"), card("b1", "b")];
  const got3 = tries("a1", { selfMark: "got" }, { selfMark: "got" });
  const [a, b] = topicStates(topics, cards, got3);
  assert.equal(a.topic.id, "a"); // sorted by order
  assert.equal(a.status, "learning");
  assert.equal(a.learned, true); // box 3
  assert.equal(b.status, "new");
  assert.equal(b.studied, false);
});

test("studied: every card answered once, except a build", () => {
  const topics = [{ id: "t", track: "js", title: "T", order: 1 }];
  const cards = [card("q1", "t"), card("q2", "t"), card("b", "t", "build", { minutes: 20 })];
  const one = topicStates(topics, cards, tries("q1", { selfMark: "missed" }))[0];
  assert.equal(one.studied, false); // q2 not answered yet
  const both = topicStates(topics, cards, [...tries("q1", { selfMark: "missed" }), ...tries("q2", { selfMark: "partly" })])[0];
  assert.equal(both.studied, true); // the build can wait
  assert.equal(both.learned, false); // studied is not learned
});

test("streak counts back from today, or from yesterday while today is empty", () => {
  const at = (d) => ({ id: d, cardId: "c", at: `${d}T08:00:00Z`, answer: "", selfMark: "got" });
  const attempts = ["2026-09-27", "2026-09-28"].map(at);
  assert.equal(streak(attempts, "2026-09-29"), 2);
  assert.equal(streak([...attempts, at("2026-09-29")], "2026-09-29"), 3);
  assert.equal(streak(attempts, "2026-09-30"), 0);
});

test("queue: due first, then new topics as whole units, builds only if they fit", () => {
  const topics = [
    { id: "old", track: "js", title: "Old", order: 1 },
    { id: "new1", track: "js", title: "New 1", order: 2 },
    { id: "new2", track: "js", title: "New 2", order: 3 },
  ];
  const cards = [
    card("old1", "old"),
    card("n1a", "new1", "explain"), card("n1b", "new1", "mc"), card("n1build", "new1", "build", { minutes: 25 }),
    card("n2a", "new2", "explain"),
  ];
  const states = topicStates(topics, cards, tries("old1", { selfMark: "missed" })); // due 2026-09-11
  const ids = (q) => q.map((i) => (i.kind === "lesson" ? `lesson:${i.topic.id}` : i.card.id));

  // 2 (due) + 10 + 5 + 1 (new1) = 18; the 25-minute build does not fit; new2 (15) does not fit.
  assert.deepEqual(ids(buildQueue(states, 30, "2026-09-29")), ["old1", "lesson:new1", "n1a", "n1b"]);
  assert.deepEqual(ids(buildQueue(states, 60, "2026-09-29")), ["old1", "lesson:new1", "n1a", "n1b", "n1build", "lesson:new2", "n2a"]);
  // Nothing due and too little time: still one whole unit.
  const fresh = topicStates(topics.slice(1), cards.slice(1), []);
  assert.deepEqual(ids(buildQueue(fresh, 5, "2026-09-29")), ["lesson:new1", "n1a", "n1b"]);
});
