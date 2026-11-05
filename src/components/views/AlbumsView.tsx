import React, { useState } from 'react';
import { Album, Song } from '../../types/music';
import { Disc, Play, Sparkles, SlidersHorizontal, Music } from 'lucide-react';

interface AlbumsViewProps {
  albums: Album[];
  onPlaySong: (song: Song) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({ albums, onPlaySong }) => {
  const [filter, setFilter] = useState<'all' | 'hires' | 'vinyl' | 'recent'>('all');

  const filterTabs = [
    { id: 'all', label: 'All Albums' },
    { id: 'hires', label: 'Hi-Res Master' },
    { id: 'vinyl', label: 'Vinyl Edition' },
    { id: 'recent', label: 'Recently Added' },
  ];

  const spotlightAlbum = albums[0];

  return (
    <div className="pb-52 pt-4 px-4 sm:px-5 animate-in fade-in duration-300">
      {/* 1. Screen Title & Statistics Overview */}
      <section className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-[#62CDFF] uppercase">
            PURE SOUND ARCHIVE
          </p>
          <h1 className="text-2xl font-bold font-sora text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Disc size={22} className="text-[#62CDFF]" />
            <span>Master Albums</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="text-xs font-mono font-semibold text-[#ccc3d5]">
            {albums.length} Masters
          </span>
        </div>
      </section>

      {/* 2. Filter & Sort Segmented Ribbon */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 pt-1">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'text-[#05040A] bg-gradient-to-r from-[#62CDFF] to-[#a377fe] font-bold shadow-[0_0_15px_rgba(98,205,255,0.4)] scale-100'
                  : 'text-[#ccc3d5] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 backdrop-blur-md'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </section>

      {/* 3. Featured Spotlight Album Banner */}
      {spotlightAlbum && (
        <section 
          className="relative rounded-[28px] p-5 sm:p-6 overflow-hidden mb-6 border border-white/[0.15] shadow-[0_16px_40px_rgba(5,4,10,0.6)] cursor-pointer group"
          onClick={() => spotlightAlbum.songs[0] && onPlaySong(spotlightAlbum.songs[0])}
          style={{
            background: 'linear-gradient(135deg, rgba(22, 18, 36, 0.95), rgba(10, 8, 18, 0.98))',
          }}
        >
          {/* Ambient Glow */}
          <div 
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full filter blur-3xl opacity-35 group-hover:opacity-60 transition-opacity pointer-events-none"
            style={{ background: spotlightAlbum.gradient || 'linear-gradient(135deg, #a377fe, #62CDFF)' }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/20 shadow-xl bg-black/40">
              <img
                src={spotlightAlbum.artwork}
                alt={spotlightAlbum.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-[#05040A]/85 backdrop-blur-md border border-white/20 text-[#ffe169] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                DSD 256
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#62CDFF] text-[9px] font-bold tracking-wider uppercase mb-1.5 border border-white/10">
                <Sparkles size={9} className="text-[#ffe169]" /> SPOTLIGHT MASTER
              </div>
              <h2 className="text-lg font-bold font-sora text-white truncate leading-snug">
                {spotlightAlbum.title}
              </h2>
              <p className="text-xs text-[#ccc3d5] font-medium truncate mt-0.5">
                {spotlightAlbum.artist} • {spotlightAlbum.year}
              </p>
              <p className="text-[11px] text-[#ccc3d5]/70 mt-2 line-clamp-2 leading-relaxed">
                Captured in 32-bit floating point high precision, preserving acoustic decay and holographic spatial realism.
              </p>

              <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    spotlightAlbum.songs[0] && onPlaySong(spotlightAlbum.songs[0]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#a377fe] to-[#62CDFF] text-[#05040A] font-bold text-xs shadow-lg active:scale-95 transition-all"
                >
                  <Play size={14} fill="#05040A" />
                  <span>Play Album</span>
                </button>
                <span className="text-xs font-mono text-[#ccc3d5]/60">
                  {spotlightAlbum.songCount} Tracks
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Section Subheader */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold font-sora text-white tracking-wide">
          Spatial Master Catalog
        </h3>
        <span className="text-xs text-[#62CDFF] font-medium font-mono">
          32-Bit Lossless
        </span>
      </div>

      {/* 5. 2-Column Responsive Albums Grid (No cramped 3 cols, ample padding, zero text clipping) */}
      <section className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {albums.map((album) => (
          <article
            key={album.id}
            onClick={() => album.songs[0] && onPlaySong(album.songs[0])}
            className="group relative rounded-[24px] p-3 sm:p-3.5 border border-white/[0.12] hover:border-[#62CDFF]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-[0_12px_32px_rgba(5,4,10,0.6)] active:scale-[0.98]"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            }}
          >
            {/* Ambient Artwork Light */}
            <div 
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full filter blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
              style={{ background: album.gradient || 'linear-gradient(135deg, #a377fe, #62CDFF)' }}
            />

            {/* Album Cover Art */}
            <div className="relative w-full aspect-square rounded-[18px] overflow-hidden mb-3 border border-white/10 bg-black/40">
              <img
                src={album.artwork}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Lossless Format Chip */}
              <div className="absolute top-2 left-2 bg-[#05040A]/80 backdrop-blur-md border border-white/15 text-[#62CDFF] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                24b/192k
              </div>

              {/* Quick Play Frosted Disc Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  album.songs[0] && onPlaySong(album.songs[0]);
                }}
                className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#05040A]/85 backdrop-blur-lg border border-white/30 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#62CDFF] group-hover:text-[#05040A] transition-all"
                title="Play Album"
              >
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>

            {/* Album Metadata with Spacious Breathing Room */}
            <div className="flex flex-col min-w-0 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold font-sora text-white truncate group-hover:text-[#62CDFF] transition-colors leading-snug">
                {album.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#ccc3d5] truncate mt-0.5 font-medium leading-normal">
                {album.artist}
              </p>
              
              {/* Year and Track Count Row - Zero clipping, clear text */}
              <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#ccc3d5]/75">
                <span className="font-semibold text-white/90">{album.year}</span>
                <span className="text-[#ffe169] flex items-center gap-1 font-semibold">
                  <Sparkles size={9} />
                  {album.songCount} {album.songCount === 1 ? 'Track' : 'Tracks'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
