import React from 'react';

interface DiscArtProps {
  artworkUrl?: string;
  isPlaying: boolean;
  size?: number;
  className?: string;
}

export const DiscArt: React.FC<DiscArtProps> = ({
  artworkUrl,
  isPlaying,
  size = 56,
  className = '',
}) => {
  return (
    <div 
      className={`relative rounded-full flex-shrink-0 select-none shadow-[0_8px_24px_rgba(0,0,0,0.6)] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Vinyl Outer Grooves Texture */}
      <div 
        className={`w-full h-full rounded-full relative flex items-center justify-center transition-transform duration-500 animate-spin-slow ${
          isPlaying ? '' : 'paused'
        }`}
        style={{
          background: 'radial-gradient(circle, #2b2633 0%, #17141d 55%, #0d0b10 100%)',
          boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.9), 0 6px 20px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Micro-Grooves Rings for authentic vinyl look */}
        <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute inset-2.5 rounded-full border border-white/[0.07] pointer-events-none" />
        <div className="absolute inset-4 rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute inset-6 rounded-full border border-white/[0.04] pointer-events-none" />

        {/* Center Artwork Label */}
        <div className="w-[58%] h-[58%] rounded-full overflow-hidden relative border border-white/20 shadow-inner flex items-center justify-center bg-black">
          <img
            src={artworkUrl || '/default-icon.jpg'}
            alt="Album artwork"
            className="w-full h-full object-cover"
          />
          {/* Subtle center gloss overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Center Spindle Metal Hole */}
        <div className="absolute w-[13%] h-[13%] rounded-full bg-[#121016] border border-white/40 shadow-inner flex items-center justify-center">
          <div className="w-[35%] h-[35%] rounded-full bg-white/70 shadow-[0_0_4px_white]" />
        </div>

        {/* Holographic / Specular 2-Way Light Sheen */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'conic-gradient(from 45deg, rgba(255,255,255,0.18) 0deg, transparent 60deg, rgba(255,255,255,0.12) 180deg, transparent 240deg, rgba(255,255,255,0.18) 360deg)'
          }}
        />
      </div>
    </div>
  );
};
