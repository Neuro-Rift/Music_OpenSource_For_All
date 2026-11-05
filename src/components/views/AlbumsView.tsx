import React from 'react';
import { Album, Song } from '../../types/music';
import { Disc, Play, Sparkles } from 'lucide-react';

interface AlbumsViewProps {
  albums: Album[];
  onPlaySong: (song: Song) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({ albums, onPlaySong }) => {
  return (
    <div className="pb-60 pt-5 px-4 sm:px-5 animate-in fade-in duration-300">
      {/* View Header with Ample Margin */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-normal flex items-center gap-2.5">
            <Disc size={23} className="text-violet-400" />
            <span>Albums</span>
          </h2>
          <p className="text-xs text-white/50 font-medium tracking-normal mt-1 leading-normal">
            {albums.length} curated master albums in discography
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Card Grid (Proper 16px Gaps, Relaxed Typography) */}
      <div className="grid grid-cols-2 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => album.songs[0] && onPlaySong(album.songs[0])}
            className="group relative rounded-[24px] p-3.5 border border-white/10 hover:border-violet-400/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_14px_36px_rgba(0,0,0,0.55)] active:scale-[0.98]"
            style={{
              background: 'rgba(26, 22, 32, 0.85)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            }}
          >
            {/* Ambient Artwork Light Aura */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full filter blur-2xl opacity-25 group-hover:opacity-45 transition-opacity pointer-events-none"
              style={{ background: album.gradient }}
            />

            {/* Album Cover Art */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-md bg-black/40">
              <img
                src={album.artwork}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Lossless Pill Tag */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[9px] font-mono font-bold text-violet-300 border border-white/10 flex items-center gap-1 shadow-sm">
                  <Sparkles size={9} /> HI-RES
                </span>
              </div>

              {/* Play Button Overlay on Hover/Tap */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#913af1] to-[#ac5bfb] text-white flex items-center justify-center shadow-lg shadow-purple-900/60 transform scale-75 group-hover:scale-100 transition-transform">
                  <Play size={20} fill="white" className="ml-0.5" />
                </div>
              </div>
            </div>

            {/* Album Metadata with Clean Line Heights and Zero Clipping */}
            <div className="flex flex-col min-w-0">
              <h4 className="text-sm font-extrabold text-white truncate leading-snug tracking-normal group-hover:text-violet-300 transition-colors">
                {album.title}
              </h4>
              <p className="text-xs text-white/60 truncate mt-1 font-medium tracking-normal leading-normal">
                {album.artist}
              </p>
              
              {/* Year and Track Count Row (Proper Breathing Room) */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mt-3 pt-2.5 border-t border-white/10">
                <span className="font-semibold text-white/70">{album.year}</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-medium">
                  {album.songCount} {album.songCount === 1 ? 'song' : 'songs'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
