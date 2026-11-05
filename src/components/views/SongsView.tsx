import React from 'react';
import { Song } from '../../types/music';
import { Play, Pause, Heart, FolderPlus, Music } from 'lucide-react';
import { VisualizerBars } from '../card/VisualizerBars';

interface SongsViewProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onToggleLike: (songId: string) => void;
  onAddLocalFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SongsView: React.FC<SongsViewProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onToggleLike,
  onAddLocalFiles,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="pb-60 pt-5 px-4 sm:px-5 animate-in fade-in duration-300">
      {/* Header with Generous Bottom Margin */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-normal flex items-center gap-2.5">
            <Music size={23} className="text-violet-400" />
            <span>All Songs</span>
          </h2>
          <p className="text-xs text-white/50 font-medium tracking-normal mt-1 leading-normal">
            {songs.length} audio tracks in your library
          </p>
        </div>

        <label className="px-3.5 py-2 rounded-2xl glass-panel text-xs font-bold text-white flex items-center gap-2 cursor-pointer hover:bg-white/10 active:scale-95 transition-all border border-white/10 shadow-sm">
          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={onAddLocalFiles}
            className="hidden"
          />
          <FolderPlus size={15} className="text-cyan-400" />
          <span>Add Music</span>
        </label>
      </div>

      {/* Spacious Song Card List (Proper 12px Gaps, Relaxed Words) */}
      <div className="space-y-3">
        {songs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div
              key={song.id}
              onClick={() => onPlaySong(song)}
              className={`rounded-[22px] p-3 px-3.5 flex items-center gap-3.5 cursor-pointer transition-all duration-200 group border ${
                isCurrent 
                  ? 'border-violet-500/60 bg-gradient-to-r from-violet-950/45 via-purple-900/30 to-white/[0.02] shadow-[0_6px_24px_rgba(145,58,241,0.28)]' 
                  : 'border-white/8 hover:border-white/15 bg-white/[0.04] hover:bg-white/[0.07] shadow-sm'
              }`}
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Index or Equalizer Bars */}
              <div className="w-6 flex items-center justify-center flex-shrink-0">
                {isThisPlaying ? (
                  <VisualizerBars isPlaying={true} barCount={3} color="#ac5bfb" className="h-4" />
                ) : (
                  <span className="font-mono text-xs text-white/40 font-bold group-hover:hidden">
                    {index + 1}
                  </span>
                )}
                <div className={`hidden group-hover:flex items-center justify-center ${isThisPlaying ? '!hidden' : ''}`}>
                  <Play size={14} fill="white" className="text-white ml-0.5" />
                </div>
              </div>

              {/* Artwork Thumbnail */}
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-white/10 flex-shrink-0 bg-black">
                <img
                  src={song.artwork}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Artist & Album (Relaxed Typography) */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-[13.5px] font-bold truncate leading-snug tracking-normal ${isCurrent ? 'text-violet-300 font-extrabold' : 'text-white'}`}>
                    {song.title}
                  </h4>
                  {song.quality && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 flex-shrink-0">
                      Hi-Res
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-white/60 truncate mt-1 font-medium tracking-normal leading-normal">
                  {song.artist} <span className="text-white/30">•</span> {song.album}
                </p>
              </div>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(song.id);
                }}
                className={`p-2 rounded-full transition-transform active:scale-75 flex-shrink-0 ${
                  song.liked ? 'text-pink-400' : 'text-white/30 hover:text-white'
                }`}
                title="Like"
              >
                <Heart size={17} fill={song.liked ? "currentColor" : "none"} />
              </button>

              {/* Duration & Year */}
              <div className="text-right flex-shrink-0 min-w-[52px] pr-1">
                <span className="text-xs font-mono text-white/70 block font-semibold leading-normal">
                  {formatTime(song.duration)}
                </span>
                <span className="text-[10px] text-white/40 block font-mono mt-0.5">
                  {song.year}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
