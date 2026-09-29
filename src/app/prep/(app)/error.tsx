"use client";

export default function PrepError({ reset }: { reset: () => void }) {
  return (
    <div className="prep-empty" role="alert">
      <b>The app could not load your data.</b>
      This can happen when Redis is not reachable. Try again. If it keeps happening, check the storage variables in
      Vercel.
      <button className="prep-btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
