import React from 'react';
import { Song } from '../../types/music';
import { Play, Pause, Heart, FolderPlus, Music, Sparkles } from 'lucide-react';
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
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold font-sora text-white tracking-normal flex items-center gap-2">
            <Music size={22} className="text-[#a377fe]" />
            <span>Master Tracks</span>
          </h2>
          <p className="text-xs text-[#ccc3d5] font-medium tracking-normal mt-1 leading-normal">
            {songs.length} audio files in lossless stream
          </p>
        </div>

        <label className="px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all shadow-sm">
          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={onAddLocalFiles}
            className="hidden"
          />
          <FolderPlus size={14} className="text-[#62CDFF]" />
          <span>Add Music</span>
        </label>
      </div>

      {/* Glass Ribbon Track Rows */}
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
                  ? 'border-[#a377fe]/50 bg-gradient-to-r from-[#1f1e2b]/90 via-[#a377fe]/15 to-transparent shadow-[0_8px_28px_rgba(163,119,254,0.25)]' 
                  : 'border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
              style={{
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* Index or Equalizer Bars */}
              <div className="w-6 flex items-center justify-center flex-shrink-0">
                {isThisPlaying ? (
                  <VisualizerBars isPlaying={true} barCount={3} color="#62CDFF" className="h-4" />
                ) : (
                  <span className="font-mono text-xs text-[#ccc3d5]/50 font-bold group-hover:hidden">
                    {index + 1}
                  </span>
                )}
                <div className={`hidden group-hover:flex items-center justify-center ${isThisPlaying ? '!hidden' : ''}`}>
                  <Play size={14} fill="#62CDFF" className="text-[#62CDFF] ml-0.5" />
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

              {/* Title & Artist & Album */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-[13.5px] font-bold font-sora truncate leading-snug tracking-normal ${isCurrent ? 'text-[#62CDFF]' : 'text-white'}`}>
                    {song.title}
                  </h4>
                  {song.quality && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[#62CDFF]/15 text-[#62CDFF] border border-[#62CDFF]/30 flex-shrink-0">
                      Hi-Res
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-[#ccc3d5] truncate mt-1 font-medium tracking-normal leading-normal">
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
                  song.liked ? 'text-[#F43F9E] bloom-magenta' : 'text-[#ccc3d5]/40 hover:text-white'
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
                <span className="text-[10px] text-[#ccc3d5]/40 block font-mono mt-0.5">
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
