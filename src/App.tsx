import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Song, Album, Playlist, PlaybackMode } from './types/music';
import { LiquidDspState, DevicePresetId } from './types/dsp';
import { DEFAULT_DSP_STATE, DEVICE_PRESETS } from './dsp/presets';
import { audioDspEngine } from './dsp/WebAudioEngine';
import { DEMO_SONGS, DEMO_ALBUMS, DEMO_PLAYLISTS } from './data/demoTracks';

import { GlassBackground } from './components/layout/GlassBackground';
import { MuckeHeader } from './components/layout/MuckeHeader';
import { MuckeNavbar, AppTab } from './components/layout/MuckeNavbar';
import { AudiofyMusicCard } from './components/card/AudiofyMusicCard';
import { MobileDeviceFrame } from './components/layout/MobileDeviceFrame';

import { LibraryView } from './components/views/LibraryView';
import { SongsView } from './components/views/SongsView';
import { AlbumsView } from './components/views/AlbumsView';
import { DspControllerView } from './components/dsp/DspControllerView';
import { SettingsView } from './components/views/SettingsView';

export const App: React.FC = () => {
  // 1. Audio Element & Web Audio API
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 2. Music Library State
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('music_custom_songs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* pass */ }
    }
    return DEMO_SONGS;
  });

  const [albums] = useState<Album[]>(DEMO_ALBUMS);
  const [playlists] = useState<Playlist[]>(DEMO_PLAYLISTS);

  // 3. Playback State
  const [currentSong, setCurrentSong] = useState<Song | null>(() => songs[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('normal');

  // 4. Navigation & Search State
  const [currentTab, setCurrentTab] = useState<AppTab>('library');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 5. DSP Controller State
  const [dspState, setDspState] = useState<LiquidDspState>(() => {
    const saved = localStorage.getItem('music_dsp_state');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* pass */ }
    }
    return DEFAULT_DSP_STATE;
  });

  // 6. Customizable App Icon
  const [appIconUrl, setAppIconUrl] = useState<string>(() => {
    return localStorage.getItem('music_app_icon') || '/default-icon.jpg';
  });

  // Update Favicon and document title when icon or song changes
  useEffect(() => {
    const favicon = document.getElementById('app-favicon') as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = appIconUrl;
    }
  }, [appIconUrl]);

  // Sync DSP state to localStorage and Web Audio Engine
  useEffect(() => {
    localStorage.setItem('music_dsp_state', JSON.stringify(dspState));
    audioDspEngine.applyDspState(dspState);
  }, [dspState]);

  // Initialize Web Audio Engine with the audio element on first user interaction
  const initAudioEngine = () => {
    if (audioRef.current) {
      audioDspEngine.init(audioRef.current);
      audioDspEngine.resume();
    }
  };

  // Playback Control Handlers
  const handlePlaySong = (song: Song) => {
    initAudioEngine();
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.url || '';
      audioRef.current.play().catch(err => {
        console.warn('Playback initiation note:', err);
      });
    }
  };

  const handleTogglePlay = () => {
    initAudioEngine();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.warn(err));
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    let nextIndex = (currentIndex + 1) % songs.length;

    if (playbackMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * songs.length);
    }
    handlePlaySong(songs[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    handlePlaySong(songs[prevIndex]);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCyclePlaybackMode = () => {
    const modes: PlaybackMode[] = ['normal', 'repeat-all', 'repeat-one', 'shuffle'];
    const nextMode = modes[(modes.indexOf(playbackMode) + 1) % modes.length];
    setPlaybackMode(nextMode);
  };

  const handleToggleLike = (songId: string) => {
    setSongs(prev => prev.map(s => s.id === songId ? { ...s, liked: !s.liked } : s));
  };

  const handleShuffleAll = () => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    setPlaybackMode('shuffle');
    handlePlaySong(songs[randomIndex]);
  };

  // Add Local Music Files
  const handleAddLocalFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newSongs: Song[] = [];
    const gradients = [
      'linear-gradient(135deg, #913af1 0%, #ac5bfb 50%, #1BFFFF 100%)',
      'linear-gradient(135deg, #FBB03B 0%, #D4145A 100%)',
      'linear-gradient(135deg, #1BFFFF 0%, #2E3192 100%)',
      'linear-gradient(135deg, #ED1E79 0%, #662D8C 100%)',
      'linear-gradient(135deg, #516395 0%, #614385 100%)',
    ];

    const localArtworks = [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    ];

    Array.from(files).forEach((file, i) => {
      const url = URL.createObjectURL(file);
      const nameParts = file.name.replace(/\.[^/.]+$/, '').split(' - ');
      const artist = nameParts.length > 1 ? nameParts[0].trim() : 'Local Artist';
      const title = nameParts.length > 1 ? nameParts.slice(1).join(' - ').trim() : nameParts[0].trim();

      newSongs.push({
        id: `local-${Date.now()}-${i}`,
        title,
        artist,
        album: 'Local Audio Library',
        duration: 210, // approximate until metadata loaded
        url,
        artwork: localArtworks[i % localArtworks.length],
        gradient: gradients[i % gradients.length],
        genre: 'Local Audio',
        year: new Date().getFullYear(),
        format: file.type || 'FLAC 24-bit',
        quality: 'Local Master',
        liked: false,
      });
    });

    setSongs(prev => {
      const updated = [...newSongs, ...prev];
      return updated;
    });

    if (newSongs[0]) {
      handlePlaySong(newSongs[0]);
    }
  };

  // App Icon Customizer
  const handleUpdateAppIcon = (newIcon: string) => {
    setAppIconUrl(newIcon);
    localStorage.setItem('music_app_icon', newIcon);
  };

  const handleResetAppIcon = () => {
    const def = '/default-icon.jpg';
    setAppIconUrl(def);
    localStorage.removeItem('music_app_icon');
  };

  // DSP Preset Application
  const handleApplyPreset = (presetId: DevicePresetId) => {
    const preset = DEVICE_PRESETS[presetId];
    if (preset) {
      setDspState(preset.state);
    }
  };

  const handleResetDsp = () => {
    setDspState(DEFAULT_DSP_STATE);
  };

  // Filtered Songs by Search
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const q = searchQuery.toLowerCase();
    return songs.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );
  }, [songs, searchQuery]);

  return (
    <MobileDeviceFrame>
      <div className="relative flex-1 w-full h-full flex flex-col bg-[#05040A] text-white overflow-hidden">
      {/* Hidden HTML5 Audio Element connected to Web Audio DSP */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          if (playbackMode === 'repeat-one') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(console.warn);
            }
          } else {
            handleNext();
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dynamic Glassmorphic Liquid Background */}
      <GlassBackground currentGradient={currentSong?.gradient} />

      {/* Sticky Header with customizable App Icon, Title "Music", and Search */}
      <MuckeHeader
        appIconUrl={appIconUrl}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setCurrentTab('settings')}
        onOpenDsp={() => setCurrentTab('dsp')}
        dspState={dspState}
      />

      {/* Main Content Area - Single smooth scroll container */}
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {currentTab === 'library' && (
          <LibraryView
            songs={filteredSongs}
            albums={albums}
            playlists={playlists}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onShuffleAll={handleShuffleAll}
            onAddLocalFiles={handleAddLocalFiles}
            onOpenDsp={() => setCurrentTab('dsp')}
          />
        )}

        {currentTab === 'songs' && (
          <SongsView
            songs={filteredSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onToggleLike={handleToggleLike}
            onAddLocalFiles={handleAddLocalFiles}
          />
        )}

        {currentTab === 'albums' && (
          <AlbumsView
            albums={albums}
            onPlaySong={handlePlaySong}
          />
        )}

        {currentTab === 'dsp' && (
          <DspControllerView
            dspState={dspState}
            onUpdateDspState={setDspState}
            onApplyPreset={handleApplyPreset}
            onResetDsp={handleResetDsp}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            appIconUrl={appIconUrl}
            onUpdateAppIcon={handleUpdateAppIcon}
            onResetAppIcon={handleResetAppIcon}
          />
        )}
      </main>

      {/* Audiofy Signature Floating Music Card (Now Playing Bar & Expandable Console) */}
      <AudiofyMusicCard
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playbackMode={playbackMode}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onCyclePlaybackMode={handleCyclePlaybackMode}
        onToggleLike={handleToggleLike}
        onOpenDspController={() => setCurrentTab('dsp')}
      />

      {/* Mucke Bottom Navigation Bar */}
      <MuckeNavbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDspActive={dspState.masterEnabled}
      />
      </div>
    </MobileDeviceFrame>
  );
};
export default App;
