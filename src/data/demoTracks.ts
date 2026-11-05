import { Song, Album, Playlist } from '../types/music';

export const DEMO_SONGS: Song[] = [
  {
    id: 'track-1',
    title: 'Liquid Neon Horizon',
    artist: 'Neuro-Rift',
    album: 'Glass Symphony',
    duration: 214,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artwork: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #913af1 0%, #ac5bfb 50%, #1BFFFF 100%)',
    genre: 'Synthwave / Ambient',
    year: 2026,
    format: 'FLAC 24-bit / 96kHz',
    quality: 'Lossless Hi-Res',
    liked: true,
  },
  {
    id: 'track-2',
    title: 'Acoustic Pulse Reflection',
    artist: 'JamesDSP x Elovaire',
    album: 'Impulse Dynamics',
    duration: 185,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #FBB03B 0%, #D4145A 100%)', // Mucke Sanguine
    genre: 'Audiophile Acoustic',
    year: 2026,
    format: 'WAV 32-bit Float',
    quality: 'Master Studio',
    liked: false,
  },
  {
    id: 'track-3',
    title: 'Vacuum Tube Harmonics',
    artist: 'Audiofy Lab',
    album: 'Pure Analog R2R',
    duration: 242,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #1BFFFF 0%, #2E3192 100%)', // Mucke Oceanblue
    genre: 'Warm Electronic',
    year: 2026,
    format: 'DSD 128',
    quality: 'Direct Stream Digital',
    liked: true,
  },
  {
    id: 'track-4',
    title: 'Mucke Midnight Reverie',
    artist: 'Neuro-Rift',
    album: 'Glass Symphony',
    duration: 198,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #ED1E79 0%, #662D8C 100%)', // Mucke Purplelake
    genre: 'Deep Liquid Beats',
    year: 2026,
    format: 'FLAC 24-bit / 192kHz',
    quality: 'Lossless Studio',
    liked: true,
  },
  {
    id: 'track-5',
    title: 'Sub-Bass Loudness Contour',
    artist: 'Rootless DSP Engine',
    album: 'Impulse Dynamics',
    duration: 226,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #516395 0%, #614385 100%)', // Mucke Kashmir
    genre: 'Sub-Bass Electronic',
    year: 2026,
    format: 'FLAC 24-bit',
    quality: 'Lossless Hi-Res',
    liked: false,
  }
];

export const DEMO_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Glass Symphony',
    artist: 'Neuro-Rift',
    artwork: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #913af1 0%, #ac5bfb 50%, #1BFFFF 100%)',
    songCount: 2,
    year: 2026,
    songs: [DEMO_SONGS[0], DEMO_SONGS[3]],
  },
  {
    id: 'album-2',
    title: 'Impulse Dynamics',
    artist: 'JamesDSP x Elovaire',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #FBB03B 0%, #D4145A 100%)',
    songCount: 2,
    year: 2026,
    songs: [DEMO_SONGS[1], DEMO_SONGS[4]],
  },
  {
    id: 'album-3',
    title: 'Pure Analog R2R',
    artist: 'Audiofy Lab',
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    gradient: 'linear-gradient(135deg, #1BFFFF 0%, #2E3192 100%)',
    songCount: 1,
    year: 2026,
    songs: [DEMO_SONGS[2]],
  }
];

export const DEMO_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    name: 'Audiophile References',
    description: 'Acoustic measurement & Squig Live AutoEQ test tracks',
    songIds: ['track-1', 'track-2', 'track-3'],
    gradient: 'linear-gradient(135deg, #FBB03B 0%, #D4145A 100%)',
  },
  {
    id: 'pl-2',
    name: 'Night Drive Glass',
    description: 'Smooth volume, NOS R2R and vacuum tube warmth',
    songIds: ['track-1', 'track-4', 'track-5'],
    gradient: 'linear-gradient(135deg, #ED1E79 0%, #662D8C 100%)',
  }
];
