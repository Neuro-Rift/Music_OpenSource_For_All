export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  url?: string;
  artwork: string;
  gradient: string;
  genre: string;
  year: number;
  format?: string;
  quality?: string;
  liked?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  gradient: string;
  songCount: number;
  year: number;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songIds: string[];
  gradient: string;
}

export type PlaybackMode = 'repeat-all' | 'repeat-one' | 'shuffle' | 'normal';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackMode: PlaybackMode;
  queue: Song[];
  queueIndex: number;
}

