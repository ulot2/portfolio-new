"use client";

import { useEffect, useState } from "react";
import type { ListeningStatus } from "@/lib/spotify-types";
import { NOW } from "@/data/now";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Lagos",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
const hourFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  hour: "2-digit",
  hourCycle: "h23",
});

function playedAgo(playedAt: string, now: Date) {
  const minutes = Math.max(0, Math.floor((now.getTime() - Date.parse(playedAt)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1_440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1_440)}d ago`;
}

export default function HeroStatus() {
  const [now, setNow] = useState<Date | null>(null);
  const [music, setMusic] = useState<ListeningStatus>({ track: null });

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    const updateMusic = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch("/api/spotify", { signal: controller.signal });
        if (response.ok) setMusic(await response.json());
        else setMusic({ track: null });
      } catch {
        if (!controller.signal.aborted) setMusic({ track: null });
      } finally {
        pending = false;
      }
    };
    void updateMusic();
    const timer = window.setInterval(updateMusic, 60_000);
    document.addEventListener("visibilitychange", updateMusic);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", updateMusic);
    };
  }, []);

  const hour = now ? Number(hourFormat.format(now)) : 12;
  const minutes = now ? now.getUTCMinutes() : 0;
  const around = hour >= 8 && hour < 22;
  const track = music.track;

  return (
    <div className="hero-status">
      <svg className="hero-status-clock" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path className="ink-line" d="M24 3.8C12.5 3 3.4 12.4 3.9 24.1c-.5 11.4 8.7 20.5 20 20.1 11.9.3 20.4-9 20.2-20.3C44.6 12.4 35.5 3.1 24 3.8Z" />
        <path className="ink-line" d="M24 24c-.4-3.7-.2-7.3.1-11" transform={`rotate(${(hour % 12) * 30 + minutes / 2} 24 24)`} />
        <path className="ink-line" d="M24 24c.3-5.2-.2-10.3.1-15.5" transform={`rotate(${minutes * 6} 24 24)`} />
      </svg>
      <div className="hero-status-copy">
        <p className="hero-status-time">
          {now ? <>It&rsquo;s <time dateTime={now.toISOString()}>{timeFormat.format(now)}</time> in Lagos.</> : "Local time in Lagos."}{" "}
          <span className="hero-status-availability">{now ? (around ? "Good time to say hello." : "Probably asleep, or should be.") : "A little note from my corner of the world."}</span>
        </p>
        <p className="hero-status-music">
          <svg className="hero-status-record" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path className="ink-line" d="M10.2 2.6C6 2.2 2.6 5.5 2.7 9.9c-.2 4.2 3 7.6 7.3 7.5 4.4.1 7.5-3.2 7.3-7.6.1-4-3-7.4-7.1-7.2Z" />
            <path className="ink-line" d="M10 8.4c-2.2-.2-2.3 3.4 0 3.3 2.2.2 2.3-3.4 0-3.3Z" />
            <path className="ink-line" d="M5.3 8a5 5 0 0 1 2.8-2.7M14.7 12a5 5 0 0 1-2.8 2.7" />
          </svg>
          <span>
            {track ? <>
              {track.isPlaying ? "Now playing: " : "Last played: "}
              <a href={track.url} target="_blank" rel="noopener noreferrer" aria-label={`${track.title} by ${track.artist} on Spotify (opens in a new tab)`}>
                {track.title}<svg className="hero-status-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path className="ink-line" d="M4 12 12 4M4.5 4H12v7.5" /></svg>
              </a>{" "}by {track.artist}
              {!track.isPlaying && track.playedAt && now ? <span className="hero-status-ago"> · {playedAgo(track.playedAt, now)}</span> : null}
              <span className="hero-status-source"> on Spotify</span>
            </> : "A little quiet on Spotify right now."}
          </span>
        </p>
        {NOW.length > 0 && (
          <p className="hero-status-now">
            <svg className="hero-status-pin" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path className="ink-line" d="M10 17.4c-3-3.4-5.2-6.3-5.1-9.1C5 5.4 7.3 3.2 10.1 3.3c2.8.1 4.9 2.3 4.9 5-.1 2.8-2.2 5.7-5 9.1Z" />
              <path className="ink-line" d="M10 6.6c-1-.1-1.8.8-1.7 1.8.1.9.8 1.6 1.8 1.6.9-.1 1.6-.9 1.5-1.8 0-.9-.7-1.6-1.6-1.6Z" />
            </svg>
            <a href="#now">
              Now: {NOW.slice(0, 2).map((entry) => entry.title).join(", ")}
              {NOW.length > 2 && <> and {NOW.length - 2} more</>}
              <svg className="hero-status-down" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path className="ink-line" d="M8 3.2c-.1 3.2 0 6.4.1 9.6M4.6 9.4c1.2 1.1 2.3 2.3 3.4 3.5 1.1-1.2 2.2-2.4 3.4-3.5" />
              </svg>
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
