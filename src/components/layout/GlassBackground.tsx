import React from 'react';

interface GlassBackgroundProps {
  currentGradient?: string;
}

export const GlassBackground: React.FC<GlassBackgroundProps> = ({ currentGradient }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Background Base */}
      <div className="absolute inset-0 bg-[#141216]" />

      {/* Reactive Liquid Gradient Orbs */}
      <div 
        className="absolute -top-[25%] -left-[15%] w-[65vw] h-[65vw] rounded-full filter blur-[120px] opacity-40 animate-liquid-glow transition-all duration-1000"
        style={{
          background: currentGradient || 'var(--grad-liquid-violet)',
        }}
      />
      <div 
        className="absolute -bottom-[20%] -right-[15%] w-[60vw] h-[60vw] rounded-full filter blur-[140px] opacity-35 animate-liquid-glow transition-all duration-1000"
        style={{
          background: currentGradient || 'var(--grad-purplelake)',
          animationDelay: '-4s',
        }}
      />
      <div 
        className="absolute top-[35%] right-[20%] w-[45vw] h-[45vw] rounded-full filter blur-[130px] opacity-25 animate-liquid-glow transition-all duration-1000"
        style={{
          background: 'var(--grad-oceanblue)',
          animationDelay: '-2s',
        }}
      />

      {/* Subtle Noise Texture & Glass Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-60" 
           style={{
             background: 'radial-gradient(circle at center, transparent 30%, rgba(20, 18, 22, 0.85) 100%)'
           }}
      />
    </div>
  );
};

