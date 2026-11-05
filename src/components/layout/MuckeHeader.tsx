import React, { useState } from 'react';
import { Search, Sparkles, Sliders, X, Radio, Activity } from 'lucide-react';
import { LiquidDspState } from '../../types/dsp';

interface MuckeHeaderProps {
  appIconUrl: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  onOpenDsp: () => void;
  dspState: LiquidDspState;
}

export const MuckeHeader: React.FC<MuckeHeaderProps> = ({
  appIconUrl,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenDsp,
  dspState,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-4 py-3 bg-[#0e0d19]/80 backdrop-blur-2xl border-b border-white/[0.12] flex flex-col gap-2.5 flex-shrink-0 shadow-[0_4px_24px_rgba(5,4,10,0.6)]">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Customizable App Icon */}
        <div className="flex items-center gap-3 min-w-0">
          <div 
            onClick={onOpenSettings}
            className="relative group cursor-pointer flex-shrink-0"
            title="Click to customize application icon"
          >
            {/* Shimmer rim frame */}
            <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#62CDFF] via-[#a377fe] to-[#F43F9E] shadow-md shadow-purple-950/50 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0e0d19] flex items-center justify-center">
                <img
                  src={appIconUrl}
                  alt="Music Icon"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Sparkles size={13} className="text-white animate-spin-slow" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-sora text-white tracking-normal leading-snug truncate">
                Music
              </h1>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-[#a377fe] to-[#F43F9E] text-white font-bold tracking-wider shadow-sm flex-shrink-0">
                NEURO-RIFT
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62CDFF] animate-pulse" />
              <p className="text-[11px] text-[#ccc3d5] font-medium tracking-normal truncate">
                Luminous Crystal Audio
              </p>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
              isSearchOpen || searchQuery 
                ? 'bg-[#a377fe]/30 text-[#d2bcff] border border-[#a377fe]/50 shadow-[0_0_12px_rgba(163,119,254,0.4)]' 
                : 'bg-white/[0.06] border border-white/10 text-white/70 hover:text-white'
            }`}
            title="Search tracks and albums"
          >
            <Search size={15} />
          </button>

          <button
            onClick={onOpenDsp}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
              dspState.masterEnabled
                ? 'bg-gradient-to-r from-[#a377fe] to-[#62CDFF] text-[#05040A] font-extrabold border-white/30 shadow-[0_0_16px_rgba(98,205,255,0.45)]'
                : 'bg-white/[0.06] border-white/10 text-white/50 hover:text-white'
            }`}
            title="Open Master DSP Audio Suite"
          >
            <Sliders size={13} />
            <span>{dspState.masterEnabled ? 'DSP' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Recessed Glass Capsule Search Dropdown Input */}
      {isSearchOpen && (
        <div className="relative animate-in slide-in-from-top-2 duration-150 pt-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#62CDFF]" />
          <input
            type="text"
            autoFocus
            placeholder="Search tracks, artists, acoustics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#090814]/85 border border-[#a377fe]/40 rounded-2xl pl-10 pr-9 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#62CDFF] focus:shadow-[0_0_14px_rgba(98,205,255,0.3)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </header>
  );
};
