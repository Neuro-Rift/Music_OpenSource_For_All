import React from 'react';

interface GlassBackgroundProps {
  currentGradient?: string;
}

export const GlassBackground: React.FC<GlassBackgroundProps> = ({ currentGradient }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Void Obsidian Foundation Base */}
      <div className="absolute inset-0 bg-[#05040A]" />

      {/* Orb 1: Neon Cyan Top-Right */}
      <div className="orb-ambient-1 absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#62CDFF]/22 blur-[100px]" />

      {/* Orb 2: Electric Violet Center-Left */}
      <div className="orb-ambient-2 absolute top-1/4 -left-28 w-96 h-96 rounded-full bg-[#a377fe]/26 blur-[120px]" />

      {/* Orb 3: Prismatic Magenta Bottom-Left */}
      <div className="orb-ambient-3 absolute bottom-16 -left-16 w-80 h-80 rounded-full bg-[#F43F9E]/18 blur-[110px]" />

      {/* Reactive Song Color Halo (when song changes) */}
      {currentGradient && (
        <div 
          className="absolute inset-0 opacity-20 filter blur-[140px] transition-all duration-1000"
          style={{ background: currentGradient }}
        />
      )}

      {/* Subtle Cosmic Refraction Vignette */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: 'radial-gradient(circle at 50% 40%, transparent 20%, rgba(5, 4, 10, 0.85) 100%)'
        }}
      />
    </div>
  );
};
