export type ListeningTrack = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
  playedAt: string | null;
};

export type ListeningStatus = { track: ListeningTrack | null };
