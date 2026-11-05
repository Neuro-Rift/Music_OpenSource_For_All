import React, { useState, useRef, useEffect } from 'react';
import { Song, PlaybackMode } from '../../types/music';
import { DiscArt } from './DiscArt';
import { VisualizerBars } from './VisualizerBars';
import { audioDspEngine } from '../../dsp/WebAudioEngine';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronDown, 
  Sliders, 
  Heart, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Radio,
  Gauge,
  Flame,
  MicOff,
  Cpu,
  Ear
} from 'lucide-react';

interface AudiofyMusicCardProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackMode: PlaybackMode;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onCyclePlaybackMode: () => void;
  onToggleLike: (songId: string) => void;
  onOpenDspController: () => void;
}

export const AudiofyMusicCard: React.FC<AudiofyMusicCardProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackMode,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onCyclePlaybackMode,
  onToggleLike,
  onOpenDspController,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [likedHeartPop, setLikedHeartPop] = useState(false);

  // Quick DSP Toggle States within Console
  const [quickDspState, setQuickDspState] = useState({
    loudness: true,
    voiceIsolation: false,
    harmonics: true,
    nosR2r: false,
  });

  // Full Screen Canvas Spectrum Analyzer
  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isExpanded) return;
    let animId: number;

    const drawSpectrum = () => {
      const canvas = spectrumCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const freqData = audioDspEngine.getVisualizerData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 38;
      const gap = 3;
      const barWidth = (canvas.width - (barCount - 1) * gap) / barCount;
      const step = Math.floor(freqData.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? freqData[i * step] || 15 : 10;
        const barHeight = Math.max(4, (val / 255) * canvas.height * 0.95);
        const x = i * (barWidth + gap);
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, y);
        grad.addColorStop(0, '#913af1');
        grad.addColorStop(0.5, '#ac5bfb');
        grad.addColorStop(1, '#1BFFFF');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2.5);
        ctx.fill();
      }

      animId = requestAnimationFrame(drawSpectrum);
    };

    animId = requestAnimationFrame(drawSpectrum);
    return () => cancelAnimationFrame(animId);
  }, [isExpanded, isPlaying]);

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Interactive Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = e.touches[0].clientX - touchStartX;
    setSwipeOffset(diffX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const diffY = touchStartY - e.changedTouches[0].clientY;
      if (diffY > 50) {
        setIsExpanded(true);
      }
    }

    if (swipeOffset > 60) {
      onPrevious(); // Swiped right -> previous track
    } else if (swipeOffset < -60) {
      onNext(); // Swiped left -> next track
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setSwipeOffset(0);
  };

  const handleSpeedToggle = () => {
    const speeds = [1.0, 1.25, 1.5, 0.8];
    const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    const audio = document.querySelector('audio') as HTMLAudioElement | null;
    if (audio) audio.playbackRate = nextSpeed;
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedHeartPop(true);
    setTimeout(() => setLikedHeartPop(false), 500);
    onToggleLike(currentSong.id);
  };

  const handleMiniScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(pct * (duration || 100));
  };

  return (
    <>
      {/* 1. Audiofy Signature Floating Music Card (Roomy, Beautiful, Non-Colliding) */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsExpanded(true)}
        className="absolute bottom-[82px] left-3.5 right-3.5 z-30 cursor-pointer select-none transition-transform duration-200 active:scale-[0.985]"
        style={{
          transform: `translateX(${swipeOffset * 0.35}px)`,
        }}
      >
        <div 
          className="relative rounded-[24px] overflow-hidden p-3 px-3.5 flex items-center gap-3.5 border border-white/20 shadow-[0_16px_44px_rgba(0,0,0,0.8)] group"
          style={{
            background: 'rgba(26, 22, 31, 0.92)',
            backdropFilter: 'blur(36px) saturate(220%)',
            WebkitBackdropFilter: 'blur(36px) saturate(220%)',
          }}
        >
          {/* Reactive Ambient Glow Halo */}
          <div 
            className="absolute -inset-6 opacity-35 pointer-events-none filter blur-2xl transition-all duration-700"
            style={{ background: currentSong.gradient }}
          />

          {/* Top Subtle Pull-Up Indicator Bar */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/25 pointer-events-none" />

          {/* Vinyl Disc Dynamo with Live Spin & Grooves */}
          <div className="relative pt-0.5 flex-shrink-0">
            <DiscArt artworkUrl={currentSong.artwork} isPlaying={isPlaying} size={46} />
          </div>

          {/* Track Metadata (Generous Room, Relaxed Typography, Words NOT Crammed) */}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-[13.5px] font-bold text-white truncate leading-normal tracking-normal group-hover:text-violet-300 transition-colors">
              {currentSong.title}
            </h4>
            
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-white/65 truncate font-medium tracking-normal leading-normal">
                {currentSong.artist}
              </p>
              <span className="text-[10px] text-white/30">•</span>
              <VisualizerBars isPlaying={isPlaying} barCount={3} color="#ac5bfb" className="h-3" />
            </div>
          </div>

          {/* Interactive Quick Controls (Spacious, Clear Touch Targets) */}
          <div className="flex items-center gap-2 relative z-10 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Quick Heart Toggle */}
            <button
              onClick={handleLikeClick}
              className={`p-2 rounded-full transition-all active:scale-75 ${
                currentSong.liked 
                  ? 'text-pink-400' 
                  : 'text-white/45 hover:text-white'
              } ${likedHeartPop ? 'scale-125' : ''}`}
              title="Like"
            >
              <Heart size={17} fill={currentSong.liked ? 'currentColor' : 'none'} />
            </button>

            {/* Glowing Liquid Play/Pause Orb */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#913af1] via-[#a344fa] to-[#ac5bfb] text-white flex items-center justify-center shadow-[0_0_18px_rgba(145,58,241,0.6)] active:scale-90 hover:scale-105 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
            </button>

            {/* Next Track */}
            <button
              onClick={onNext}
              className="p-2 rounded-full text-white/60 hover:text-white active:scale-75 transition-transform"
              title="Next Track"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Bottom Interactive Liquid Scrub Bar */}
          <div 
            onClick={handleMiniScrub}
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 hover:h-2 cursor-pointer transition-all overflow-hidden"
            title="Click or drag to seek"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#913af1] via-[#ac5bfb] to-[#1BFFFF] transition-all duration-100 shadow-[0_0_8px_#1BFFFF]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Audiofy Full Screen Now Playing Sheet Console */}
      {isExpanded && (
        <div className="absolute inset-0 z-50 flex flex-col justify-between bg-[#121016]/98 backdrop-blur-3xl animate-in slide-in-from-bottom duration-300 overflow-y-auto">
          {/* Ambient Liquid Glow */}
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 rounded-full filter blur-[130px] opacity-45 pointer-events-none transition-all duration-700"
            style={{ background: currentSong.gradient }}
          />

          {/* Top Bar Navigation (Generous Padding & Spacing) */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-transform"
              title="Minimize Console"
            >
              <ChevronDown size={22} />
            </button>

            <div className="text-center min-w-0 px-3">
              <span className="text-[11px] uppercase tracking-wider text-violet-400 font-extrabold flex items-center justify-center gap-1.5">
                <Radio size={13} className="animate-pulse text-violet-400" /> NOW PLAYING
              </span>
              <p className="text-xs text-white/65 font-medium truncate max-w-[210px] mt-1">
                {currentSong.album}
              </p>
            </div>

            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenDspController();
              }}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40 border border-violet-400/40 text-violet-200 text-xs font-bold flex items-center gap-1.5 hover:bg-violet-600/60 active:scale-95 transition-all shadow-md shadow-violet-900/40"
              title="Open Full DSP Suite"
            >
              <Sliders size={14} />
              <span>DSP Suite</span>
            </button>
          </div>

          {/* Center Vinyl Disc Artwork */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-3 my-auto">
            <div className="relative my-3">
              <DiscArt 
                artworkUrl={currentSong.artwork} 
                isPlaying={isPlaying} 
                size={220} 
                className="shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-2 border-white/10"
              />
              <div 
                className="absolute inset-0 rounded-full pointer-events-none opacity-40 filter blur-xl animate-pulse"
                style={{ background: currentSong.gradient }}
              />
            </div>

            {/* Live Real-time Spectrum Canvas */}
            <div className="w-full max-w-[300px] h-11 mt-4 flex items-center justify-center bg-black/25 rounded-2xl p-2 border border-white/5 backdrop-blur-md">
              <canvas 
                ref={spectrumCanvasRef} 
                width={290} 
                height={40} 
                className="w-full h-full opacity-90"
              />
            </div>

            {/* Song Title & Artist with Like Toggle (Relaxed Spacing) */}
            <div className="w-full max-w-[320px] mt-5 flex items-center justify-between gap-3">
              <div className="min-w-0 pr-2">
                <h2 className="text-xl font-black text-white tracking-normal leading-snug truncate">
                  {currentSong.title}
                </h2>
                <p className="text-sm text-white/70 font-medium tracking-normal mt-1 truncate">
                  {currentSong.artist}
                </p>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/10">
                    {currentSong.format || 'Hi-Res Lossless'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                    <Sparkles size={10} /> 96kHz / 24-bit
                  </span>
                </div>
              </div>

              <button
                onClick={() => onToggleLike(currentSong.id)}
                className={`p-3 rounded-full transition-all active:scale-75 flex-shrink-0 ${
                  currentSong.liked 
                    ? 'text-pink-400 bg-pink-500/15 border border-pink-500/40 shadow-[0_0_14px_rgba(236,72,153,0.4)]' 
                    : 'text-white/40 hover:text-white glass-panel'
                }`}
                title="Favorite"
              >
                <Heart size={22} fill={currentSong.liked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Quick DSP Interactive Toggles Bar */}
          <div className="relative z-10 px-6 py-2.5 max-w-[340px] w-full mx-auto">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-around text-[10px] font-semibold gap-1.5">
              <button
                onClick={() => setQuickDspState(prev => ({ ...prev, loudness: !prev.loudness }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
                  quickDspState.loudness ? 'bg-violet-600/40 text-violet-200 border border-violet-400/40 shadow-sm' : 'text-white/45 hover:text-white/75'
                }`}
                title="Toggle Equal-Loudness"
              >
                <Ear size={13} />
                <span>Loudness</span>
              </button>

              <button
                onClick={() => setQuickDspState(prev => ({ ...prev, voiceIsolation: !prev.voiceIsolation }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
                  quickDspState.voiceIsolation ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-400/40 shadow-sm' : 'text-white/45 hover:text-white/75'
                }`}
                title="Toggle Voice Isolation"
              >
                <MicOff size={13} />
                <span>Voice Iso</span>
              </button>

              <button
                onClick={() => setQuickDspState(prev => ({ ...prev, harmonics: !prev.harmonics }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
                  quickDspState.harmonics ? 'bg-amber-600/40 text-amber-200 border border-amber-400/40 shadow-sm' : 'text-white/45 hover:text-white/75'
                }`}
                title="Toggle Tube Harmonics"
              >
                <Flame size={13} />
                <span>Tube Sat</span>
              </button>

              <button
                onClick={() => setQuickDspState(prev => ({ ...prev, nosR2r: !prev.nosR2r }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
                  quickDspState.nosR2r ? 'bg-emerald-600/40 text-emerald-200 border border-emerald-400/40 shadow-sm' : 'text-white/45 hover:text-white/75'
                }`}
                title="Toggle NOS R2R DAC"
              >
                <Cpu size={13} />
                <span>NOS R2R</span>
              </button>
            </div>
          </div>

          {/* Bottom Scrub Bar & Console Controls (Generous Margins) */}
          <div className="relative z-10 px-6 pb-7 pt-2 max-w-[340px] w-full mx-auto flex-shrink-0">
            {/* Seek Bar */}
            <div className="mb-5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full accent-violet-500 h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-white/50 mt-1.5 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={onCyclePlaybackMode}
                className={`p-2.5 rounded-full transition-colors ${
                  playbackMode !== 'normal' ? 'text-violet-400 bg-violet-500/15' : 'text-white/45 hover:text-white'
                }`}
                title="Playback Mode"
              >
                {playbackMode === 'repeat-one' ? <Repeat1 size={20} /> : playbackMode === 'shuffle' ? <Shuffle size={20} /> : <Repeat size={20} />}
              </button>

              <button
                onClick={onPrevious}
                className="p-2 text-white/80 hover:text-white active:scale-80 transition-transform"
                title="Previous Track"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#913af1] via-[#a344fa] to-[#ac5bfb] text-white flex items-center justify-center shadow-[0_0_26px_rgba(145,58,241,0.65)] hover:scale-105 active:scale-90 transition-all"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-white/80 hover:text-white active:scale-80 transition-transform"
                title="Next Track"
              >
                <SkipForward size={24} />
              </button>

              <button
                onClick={handleSpeedToggle}
                className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white/70 hover:text-violet-300 glass-panel flex items-center gap-1 active:scale-90 transition-transform"
                title="Playback Speed"
              >
                <Gauge size={13} />
                <span>{playbackSpeed}x</span>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3.5 glass-panel px-3.5 py-2.5 rounded-2xl">
              <button 
                onClick={onToggleMute} 
                className="text-white/60 hover:text-white active:scale-90 transition-transform"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="flex-1 accent-violet-500 h-1.5"
              />
              <span className="text-[11px] font-mono text-white/50 w-8 text-right font-medium">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
