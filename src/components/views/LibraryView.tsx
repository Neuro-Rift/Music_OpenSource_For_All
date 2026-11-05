import React from 'react';
import { Song, Album, Playlist } from '../../types/music';
import { Play, Shuffle, Sparkles, FolderPlus, Disc, Clock, Disc3, Sliders } from 'lucide-react';

interface LibraryViewProps {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onShuffleAll: () => void;
  onAddLocalFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDsp: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  songs,
  albums,
  playlists,
  currentSong,
  isPlaying,
  onPlaySong,
  onShuffleAll,
  onAddLocalFiles,
  onOpenDsp,
}) => {
  const albumOfTheDay = albums[0];

  return (
    <div className="pb-60 pt-5 px-4 sm:px-5 animate-in fade-in duration-300">
      
      {/* 1. Acoustic Sanctuary Hero Showcase */}
      {albumOfTheDay && (
        <div 
          className="relative rounded-[28px] overflow-hidden p-5 sm:p-6 mb-6 border border-white/[0.16] shadow-[0_20px_50px_rgba(5,4,10,0.8)] transition-all duration-300"
          style={{
            background: albumOfTheDay.gradient || 'linear-gradient(135deg, #1BFFFF 0%, #2E3192 100%)',
          }}
        >
          {/* Frosted Glass Overlay */}
          <div className="absolute inset-0 bg-[#05040A]/60 backdrop-blur-md" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={albumOfTheDay.artwork}
                alt={albumOfTheDay.title}
                className="w-24 h-24 rounded-2xl object-cover shadow-2xl border border-white/25"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#a377fe] border border-white/30 flex items-center justify-center text-white shadow-md">
                <Disc3 size={13} className="animate-spin-slow" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-bold tracking-wider uppercase mb-2 backdrop-blur-sm border border-white/20">
                <Sparkles size={10} className="text-[#ffe169]" /> ALBUM OF THE DAY
              </div>
              <h2 className="text-lg font-bold font-sora text-white tracking-normal truncate leading-snug">
                {albumOfTheDay.title}
              </h2>
              <p className="text-xs text-[#ccc3d5] font-medium tracking-normal truncate mt-1 leading-normal">
                {albumOfTheDay.artist} • {albumOfTheDay.songCount} Tracks ({albumOfTheDay.year})
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 mt-3">
                <button
                  onClick={() => albumOfTheDay.songs[0] && onPlaySong(albumOfTheDay.songs[0])}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#a377fe] to-[#62CDFF] text-[#05040A] font-extrabold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  <Play size={12} fill="#05040A" />
                  <span>Play Album</span>
                </button>

                <button
                  onClick={onShuffleAll}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition-transform border border-white/15"
                >
                  <Shuffle size={12} />
                  <span>Shuffle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Quick Action Tiles (Bento Grid) */}
      <div className="grid grid-cols-2 gap-3.5 mb-7">
        <label className="rounded-2xl p-4 bg-white/[0.04] border border-white/[0.12] hover:border-[#62CDFF]/40 flex items-center gap-3.5 cursor-pointer transition-all active:scale-95 shadow-md">
          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={onAddLocalFiles}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-xl bg-[#62CDFF]/20 text-[#62CDFF] flex items-center justify-center flex-shrink-0 border border-[#62CDFF]/30">
            <FolderPlus size={19} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold font-sora text-white leading-snug tracking-normal">Import Local</h4>
            <span className="text-[11px] text-[#ccc3d5]/70 block truncate mt-0.5">FLAC, MP3, WAV</span>
          </div>
        </label>

        <div 
          onClick={onOpenDsp}
          className="rounded-2xl p-4 bg-white/[0.04] border border-white/[0.12] hover:border-[#a377fe]/40 flex items-center gap-3.5 cursor-pointer transition-all active:scale-95 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-[#a377fe]/20 text-[#d2bcff] flex items-center justify-center flex-shrink-0 border border-[#a377fe]/30">
            <Sliders size={19} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold font-sora text-white leading-snug tracking-normal">DSP Suite</h4>
            <span className="text-[11px] text-[#ccc3d5]/70 block truncate mt-0.5">AutoEQ & 3D Stage</span>
          </div>
        </div>
      </div>

      {/* 3. Featured Playlists */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider flex items-center gap-2">
            <span>Curated Playlists</span>
          </h3>
          <span className="text-xs text-[#62CDFF] font-semibold">{playlists.length} Lists</span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {playlists.map((pl) => {
            const firstSong = songs.find((s) => s.id === pl.songIds[0]);
            return (
              <div
                key={pl.id}
                onClick={() => firstSong && onPlaySong(firstSong)}
                className="rounded-2xl p-3.5 border border-white/[0.12] hover:border-[#62CDFF]/40 transition-all cursor-pointer group active:scale-95 shadow-sm"
                style={{
                  background: 'rgba(26, 22, 38, 0.78)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                <div 
                  className="aspect-video w-full rounded-xl overflow-hidden mb-2.5 relative bg-black/40 border border-white/5 flex items-center justify-center"
                  style={{ background: pl.gradient }}
                >
                  {firstSong?.artwork && (
                    <img
                      src={firstSong.artwork}
                      alt={pl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <Play size={18} fill="#62CDFF" className="text-[#62CDFF]" />
                  </div>
                </div>
                <h4 className="text-xs font-bold font-sora text-white truncate leading-snug tracking-normal group-hover:text-[#62CDFF]">
                  {pl.name}
                </h4>
                <p className="text-[11px] text-[#ccc3d5]/70 truncate mt-1">
                  {pl.songIds.length} tracks
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recently Played Tracks */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold font-sora text-white uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-[#62CDFF]" />
            <span>Recent Sessions</span>
          </h3>
          <span className="text-xs text-[#ccc3d5]/50">{songs.length} tracks</span>
        </div>

        <div className="space-y-2.5">
          {songs.slice(0, 4).map((song, idx) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                onClick={() => onPlaySong(song)}
                className={`p-3 px-3.5 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all border ${
                  isThisPlaying 
                    ? 'bg-[#1f1e2b]/90 border-[#62CDFF]/50 text-[#62CDFF] shadow-[0_0_16px_rgba(98,205,255,0.25)]' 
                    : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/8'
                }`}
              >
                <span className="w-5 text-center font-mono text-xs text-[#ccc3d5]/40 font-bold">
                  {idx + 1}
                </span>

                <img
                  src={song.artwork}
                  alt={song.title}
                  className="w-10 h-10 rounded-xl object-cover shadow border border-white/10 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 pr-1">
                  <h4 className={`text-xs font-bold truncate leading-snug tracking-normal ${isThisPlaying ? 'text-[#62CDFF]' : 'text-white'}`}>
                    {song.title}
                  </h4>
                  <p className="text-[11px] text-[#ccc3d5]/60 truncate mt-0.5 font-medium">
                    {song.artist}
                  </p>
                </div>

                <div className="text-right pr-1 flex-shrink-0">
                  <span className="text-xs font-mono text-[#ccc3d5]/60 block font-medium">
                    {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
