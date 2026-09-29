import { loadPrep } from "../data";
import Shell from "./Shell";

// Every page reads live data from Redis. Nothing here can be built ahead.
export const dynamic = "force-dynamic";

export default async function PrepAppLayout({ children }: { children: React.ReactNode }) {
  const { topics, attempts, lastRun } = await loadPrep();
  const gradedAt = attempts.flatMap((a) => (a.gradedAt && a.grade ? [a.gradedAt] : []));
  return (
    <Shell
      lastRun={lastRun}
      gradedAt={gradedAt}
      topics={[...topics].sort((a, b) => a.order - b.order).map(({ id, title }) => ({ id, title }))}
    >
      {children}
    </Shell>
  );
}
