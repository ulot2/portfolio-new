// Run: node --test --experimental-strip-types src/lib/prep-validate.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { parseAnswer, parseCard, parseGrade, parseTopic } from "./prep-validate.ts";

const topic = { id: "js-closures", track: "js", title: "Closures", order: 3 };
const mc = {
  id: "js-closures-q1", topicId: "js-closures", type: "mc",
  prompt: "What does a closure keep?", answer: "Its outer scope", choices: ["Its outer scope", "A copy of the DOM"],
};
const explain = { id: "js-closures-explain", topicId: "js-closures", type: "explain", prompt: "Explain closures.", answer: "…" };
const topics = new Set(["js-closures"]);

test("topics: keeps a good one, drops unknown fields, rejects bad input", () => {
  assert.deepEqual(parseTopic({ ...topic, lesson: "# Closures", extra: 1 }), { topic, lesson: "# Closures" });
  assert.equal(typeof parseTopic({ ...topic, id: "Bad Id" }), "string");
  assert.equal(typeof parseTopic({ ...topic, track: "python" }), "string");
  assert.equal(typeof parseTopic({ ...topic, order: "3" }), "string");
});

test("cards: checks the topic, mc choices, and build minutes", () => {
  assert.deepEqual(parseCard(mc, topics), mc);
  assert.equal(typeof parseCard({ ...mc, topicId: "nope" }, topics), "string");
  assert.equal(typeof parseCard({ ...mc, answer: "Not a choice" }, topics), "string");
  assert.equal(typeof parseCard({ ...explain, type: "build" }, topics), "string");
  assert.equal(parseCard({ ...explain, type: "build", minutes: 25 }, topics).minutes, 25);
});

test("grades: only grade, feedback, and tests get through", () => {
  const g = parseGrade({ attemptId: "a1", grade: "partly", feedback: "Close.", answer: "overwrite!", selfMark: "got" });
  assert.deepEqual(g, { attemptId: "a1", grade: "partly", feedback: "Close." });
  assert.equal(typeof parseGrade({ attemptId: "a1", grade: "great", feedback: "x" }), "string");
});

test("answers: the server marks mc itself and ignores a sent mark", () => {
  const card = parseCard(mc, topics);
  assert.deepEqual(parseAnswer({ answer: "A copy of the DOM", selfMark: "got" }, card),
    { answer: "A copy of the DOM", selfMark: "missed", grade: "missed" });
  assert.equal(parseAnswer({ answer: "Its outer scope" }, card).grade, "got");
  assert.equal(typeof parseAnswer({ answer: "Something else" }, card), "string");
});

test("answers: typed answers need text and a self-mark, and are cut at 8,000", () => {
  const card = parseCard(explain, topics);
  assert.equal(typeof parseAnswer({ answer: "  ", selfMark: "got" }, card), "string");
  assert.equal(typeof parseAnswer({ answer: "A function and its scope." }, card), "string");
  assert.equal(parseAnswer({ answer: "x".repeat(9000), selfMark: "partly" }, card).answer.length, 8000);
  assert.equal(typeof parseAnswer({ answer: "ok", selfMark: "got", minutes: 999 }, card), "string");
});
