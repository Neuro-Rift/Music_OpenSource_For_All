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
  Ear,
  Share2,
  MoreVertical,
  Activity,
  Layers,
  ChevronUp
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
    spatial3d: true,
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

      const barCount = 42;
      const gap = 2.5;
      const barWidth = (canvas.width - (barCount - 1) * gap) / barCount;
      const step = Math.floor(freqData.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? freqData[i * step] || 15 : 10;
        const barHeight = Math.max(4, (val / 255) * canvas.height * 0.95);
        const x = i * (barWidth + gap);
        const y = canvas.height - barHeight;

        // Tri-color Prismatic Gradient (Cyan -> Violet -> Magenta)
        const grad = ctx.createLinearGradient(0, canvas.height, 0, y);
        grad.addColorStop(0, '#62CDFF');
        grad.addColorStop(0.5, '#a377fe');
        grad.addColorStop(1, '#F43F9E');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
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
      onPrevious();
    } else if (swipeOffset < -60) {
      onNext();
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
      {/* 1. Luminous Crystal Floating Music Card (Mini-Player) */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsExpanded(true)}
        className="absolute bottom-[70px] left-3 right-3 z-30 cursor-pointer select-none transition-transform duration-200 active:scale-[0.985]"
        style={{
          transform: `translateX(${swipeOffset * 0.35}px)`,
        }}
      >
        <div 
          className="relative rounded-[24px] overflow-hidden p-3 px-3.5 flex items-center gap-3.5 border border-white/[0.18] shadow-[0_16px_44px_rgba(5,4,10,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] group"
          style={{
            background: 'rgba(18, 14, 32, 0.92)',
            backdropFilter: 'blur(36px) saturate(220%)',
            WebkitBackdropFilter: 'blur(36px) saturate(220%)',
          }}
        >
          {/* Reactive Ambient Glow Halo */}
          <div 
            className="absolute -inset-6 opacity-35 pointer-events-none filter blur-2xl transition-all duration-700"
            style={{ background: currentSong.gradient || 'linear-gradient(135deg, #a377fe, #62CDFF)' }}
          />

          {/* Top Subtle Pull-Up Indicator Bar */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/25 pointer-events-none" />

          {/* Left: Vinyl Disc Dynamo with Live Spin */}
          <div className="relative pt-0.5 flex-shrink-0">
            <DiscArt artworkUrl={currentSong.artwork} isPlaying={isPlaying} size={46} />
          </div>

          {/* Center: Track Metadata (Spacious, Clean) */}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-[13.5px] font-bold font-sora text-white truncate leading-normal tracking-normal group-hover:text-[#62CDFF] transition-colors">
              {currentSong.title}
            </h4>
            
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-[#ccc3d5] truncate font-medium tracking-normal leading-normal">
                {currentSong.artist}
              </p>
              <span className="text-[10px] text-white/30">•</span>
              <VisualizerBars isPlaying={isPlaying} barCount={4} color="#62CDFF" className="h-3" />
            </div>
          </div>

          {/* Right: Interactive Quick Controls */}
          <div className="flex items-center gap-2 relative z-10 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Favorite Button */}
            <button
              onClick={handleLikeClick}
              className={`p-2 rounded-full transition-all active:scale-75 ${
                currentSong.liked 
                  ? 'text-[#F43F9E] bloom-magenta' 
                  : 'text-[#ccc3d5]/50 hover:text-white'
              } ${likedHeartPop ? 'scale-125' : ''}`}
              title="Like"
            >
              <Heart size={17} fill={currentSong.liked ? 'currentColor' : 'none'} />
            </button>

            {/* Primary Master Play/Pause Crystal Disc Button */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#a377fe] to-[#62CDFF] text-[#05040A] flex items-center justify-center shadow-[0_0_18px_rgba(98,205,255,0.55)] active:scale-90 hover:scale-105 transition-all border border-white/40"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="#05040A" /> : <Play size={18} fill="#05040A" className="ml-0.5" />}
            </button>

            {/* Next Track Button */}
            <button
              onClick={onNext}
              className="p-2 rounded-full text-[#ccc3d5]/60 hover:text-[#62CDFF] active:scale-75 transition-transform"
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
              className="h-full bg-gradient-to-r from-[#62CDFF] via-[#a377fe] to-[#F43F9E] transition-all duration-100 shadow-[0_0_8px_#62CDFF]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Full-Screen Now Playing Crystal Sheet Console */}
      {isExpanded && (
        <div className="absolute inset-0 z-50 flex flex-col justify-between bg-[#05040A]/98 backdrop-blur-3xl animate-in slide-in-from-bottom duration-300 overflow-y-auto">
          {/* Ambient Light Halos & Acoustic Void Canvas */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#a377fe]/20 rounded-full blur-[140px] opacity-70" />
            <div className="absolute top-[35%] -left-[20%] w-[420px] h-[420px] bg-[#F43F9E]/15 rounded-full blur-[130px] opacity-60" />
            <div className="absolute bottom-[10%] -right-[15%] w-[480px] h-[480px] bg-[#62CDFF]/20 rounded-full blur-[140px] opacity-65" />
          </div>

          {/* 1. Top Navigation & Action Bar */}
          <header className="relative z-10 flex items-center justify-between w-full px-5 pt-5 pb-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-10 h-10 rounded-full bg-[#1b1a27]/70 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white hover:text-[#62CDFF] active:scale-90 transition-all shadow-lg"
              title="Dismiss Player"
            >
              <ChevronDown size={22} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#62CDFF] animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#62CDFF]">NOW PLAYING</span>
              </div>
              <div className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full bg-[#2a2836]/60 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-[#ccc3d5] font-medium font-mono">DSD 256 Master • Direct DAC</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenDspController();
              }}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#a377fe]/40 to-[#62CDFF]/40 border border-[#62CDFF]/40 text-[#62CDFF] text-xs font-bold flex items-center gap-1.5 hover:bg-[#a377fe]/60 active:scale-95 transition-all shadow-md shadow-purple-950/40"
              title="Open Full DSP Suite"
            >
              <Sliders size={13} />
              <span>DSP Suite</span>
            </button>
          </header>

          {/* 2. Hero Vinyl & Album Artwork Showcase */}
          <section className="relative z-10 w-full my-auto py-2 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-square group">
              {/* Ambient Spectral Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a377fe]/40 via-[#F43F9E]/25 to-[#62CDFF]/35 rounded-[32px] blur-2xl transform scale-95 group-hover:scale-105 transition-transform duration-700" />
              
              {/* Glass Frame Container with 28px rounded corners */}
              <div className="relative w-full h-full rounded-[28px] overflow-hidden p-1 bg-[#0e0d19]/40 backdrop-blur-2xl border border-white/20 shadow-[0_16px_40px_rgba(5,4,10,0.85)] flex items-center justify-center">
                <div className="w-full h-full rounded-[24px] overflow-hidden relative flex items-center justify-center bg-black">
                  <img
                    src={currentSong.artwork}
                    alt={currentSong.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Top Left Master Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#05040A]/80 backdrop-blur-md border border-white/20 text-[9.5px] font-mono text-[#ffe169] font-bold tracking-wider shadow-md">
                      DSD 256 • 11.2 MHz
                    </span>
                  </div>
                  {/* Bottom Floating Bit-Perfect Badge Strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-full bg-[#0e0d19]/85 backdrop-blur-xl border border-white/15 text-white">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#62CDFF]" />
                      <span className="text-[10px] font-bold text-[#62CDFF] tracking-wider">BIT-PERFECT DIRECT STREAM</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#ccc3d5]">1-bit / Native</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Spectrum Visualizer */}
            <div className="w-full max-w-[300px] h-10 mt-4 flex items-center justify-center bg-[#05040A]/60 rounded-2xl p-1.5 border border-white/10 backdrop-blur-md">
              <canvas 
                ref={spectrumCanvasRef} 
                width={290} 
                height={36} 
                className="w-full h-full opacity-90"
              />
            </div>
          </section>

          {/* 3. Track Metadata & Action Row */}
          <section className="relative z-10 w-full px-6 mt-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0 pr-2">
                <h1 className="text-xl font-bold font-sora text-white tracking-normal truncate drop-shadow-sm">
                  {currentSong.title}
                </h1>
                <p className="text-sm text-[#ccc3d5] truncate mt-0.5 font-medium">
                  {currentSong.artist} <span className="text-white/30">•</span> {currentSong.album}
                </p>
              </div>

              {/* Action Cluster */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setQuickDspState(prev => ({ ...prev, spatial3d: !prev.spatial3d }))}
                  className={`px-2.5 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1 transition-all ${
                    quickDspState.spatial3d
                      ? 'bg-[#62CDFF]/20 border-[#62CDFF]/50 text-[#62CDFF] shadow-[0_0_12px_rgba(98,205,255,0.35)]'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}
                  title="Toggle 3D Binaural HRTF"
                >
                  <Activity size={13} />
                  <span className="text-[10px] font-bold tracking-wider">3D BINAURAL</span>
                </button>

                <button
                  onClick={() => onToggleLike(currentSong.id)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center active:scale-90 transition-all ${
                    currentSong.liked 
                      ? 'bg-[#F43F9E]/20 border-[#F43F9E]/50 text-[#F43F9E] bloom-magenta' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                  }`}
                  title="Favorite"
                >
                  <Heart size={19} fill={currentSong.liked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </section>

          {/* 4. Progress Scrubber with Floating Orb Thumb */}
          <section className="relative z-10 w-full px-6 mt-3">
            <div className="relative w-full py-2 flex items-center cursor-pointer group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#62CDFF]"
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#ccc3d5] mt-0.5">
              <span className="text-[#62CDFF] font-medium">{formatTime(currentTime)}</span>
              <span className="text-white/40">Buffer 100% (Bit-Perfect)</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </section>

          {/* 5. Master Playback Controls */}
          <section className="relative z-10 w-full my-3 flex items-center justify-between px-6 max-w-[340px] mx-auto">
            {/* Shuffle */}
            <button
              onClick={onCyclePlaybackMode}
              className={`w-11 h-11 rounded-full backdrop-blur-xl border flex items-center justify-center active:scale-90 transition-all ${
                playbackMode === 'shuffle'
                  ? 'bg-[#1b1a27]/80 border-[#62CDFF]/50 text-[#62CDFF] shadow-[0_0_12px_rgba(98,205,255,0.4)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
              }`}
              title="Shuffle Mode"
            >
              <Shuffle size={18} />
            </button>

            {/* Previous Track */}
            <button
              onClick={onPrevious}
              className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:text-[#62CDFF] active:scale-90 transition-all flex items-center justify-center"
              title="Previous Track"
            >
              <SkipBack size={22} />
            </button>

            {/* Master Play/Pause Crystal Disc Button */}
            <button
              onClick={onTogglePlay}
              className="relative group active:scale-95 transition-transform duration-150"
              title={isPlaying ? "Pause" : "Play"}
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#a377fe] to-[#F43F9E] opacity-75 blur-lg group-hover:opacity-100 transition-opacity" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#9D71F8] to-[#6D28D9] border border-white/40 shadow-[0_8px_32px_rgba(157,113,248,0.55)] flex items-center justify-center text-white backdrop-blur-2xl">
                {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
              </div>
            </button>

            {/* Next Track */}
            <button
              onClick={onNext}
              className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:text-[#62CDFF] active:scale-90 transition-all flex items-center justify-center"
              title="Next Track"
            >
              <SkipForward size={22} />
            </button>

            {/* Repeat Mode */}
            <button
              onClick={onCyclePlaybackMode}
              className={`w-11 h-11 rounded-full backdrop-blur-xl border flex items-center justify-center active:scale-90 transition-all ${
                playbackMode === 'repeat-all' || playbackMode === 'repeat-one'
                  ? 'bg-[#1b1a27]/80 border-[#62CDFF]/50 text-[#62CDFF] shadow-[0_0_12px_rgba(98,205,255,0.4)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
              }`}
              title="Repeat Mode"
            >
              {playbackMode === 'repeat-one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </section>

          {/* 6. Audio Engine & Signal Path Quick Strip */}
          <section className="relative z-10 w-full px-6 mb-2 max-w-[340px] mx-auto">
            <div className="rounded-2xl p-2.5 bg-[#0e0d19]/80 backdrop-blur-2xl border border-white/10 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#62CDFF]" />
                  <span className="text-[11px] font-bold text-white tracking-wide">DSP: Acoustic Transparency</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-[#62CDFF] px-2 py-0.5 rounded-full bg-[#62CDFF]/15 border border-[#62CDFF]/30">
                  USB DAC (Direct)
                </span>
              </div>
              <div className="flex items-center justify-between text-[#ccc3d5] font-mono text-[10px]">
                <span>Engine: <span className="text-[#d2bcff] font-medium">HyperQuartz Core</span></span>
                <span>384kHz / 32-bit</span>
                <span className="text-[#ffe169] font-medium">Buffer: 64 smp</span>
              </div>
            </div>
          </section>

          {/* 7. Bottom Expandable Sheets / Tabs Preview Pill */}
          <section className="relative z-10 w-full px-6 pb-6 max-w-[340px] mx-auto">
            <div 
              onClick={handleSpeedToggle}
              className="rounded-2xl bg-[#1b1a27]/80 backdrop-blur-2xl border border-white/15 p-2.5 shadow-2xl flex items-center justify-between cursor-pointer hover:border-[#62CDFF]/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-[#a377fe]" />
                <span className="text-xs text-white font-medium">Playback Speed: <strong className="text-[#62CDFF]">{playbackSpeed}x</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                  }}
                  className="text-white/60 hover:text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <span className="text-[11px] font-mono text-[#ccc3d5]">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
