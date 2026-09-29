import { getLessons } from "@/lib/prep-store";
import { loadPrep } from "../../data";
import { BUDGETS, buildQueue, today } from "../../schedule";
import { Empty, Lesson } from "../../ui";
import Study from "./Study";

export default async function StudyPage() {
  const { redis, states } = await loadPrep();
  if (states.length === 0) {
    return <Empty title="Nothing to study yet">The first run writes your first topics.</Empty>;
  }

  // Only the lessons that the largest session could show. The rest stay in Redis.
  const now = today();
  const ids = [
    ...new Set(buildQueue(states, BUDGETS.at(-1)!, now).flatMap((i) => (i.kind === "lesson" ? [i.topic.id] : []))),
  ];
  const sources = await getLessons(redis, ids);
  const lessons = Object.fromEntries(Object.entries(sources).map(([id, src]) => [id, <Lesson key={id} source={src} />]));

  return <Study states={states} lessons={lessons} now={now} />;
}
