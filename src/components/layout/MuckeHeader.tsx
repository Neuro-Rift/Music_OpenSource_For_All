import React, { useState } from 'react';
import { Search, Sparkles, Sliders, X } from 'lucide-react';
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
    <header className="sticky top-0 z-30 px-4 py-3 glass-panel-elevated border-b border-white/10 flex flex-col gap-2.5 flex-shrink-0">
      <div className="flex items-center justify-between gap-3">
        {/* Brand & Customizable App Icon */}
        <div className="flex items-center gap-3 min-w-0">
          <div 
            onClick={onOpenSettings}
            className="relative group cursor-pointer flex-shrink-0"
            title="Click to customize application icon"
          >
            <img
              src={appIconUrl}
              alt="Music Icon"
              className="w-10 h-10 rounded-xl object-cover border border-violet-400/50 shadow-md shadow-purple-900/40 group-hover:scale-105 transition-all"
            />
            <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Sparkles size={13} className="text-white animate-spin-slow" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-normal leading-snug truncate">
                Music
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold tracking-wider shadow-sm flex-shrink-0">
                NEURO-RIFT
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-medium tracking-normal truncate mt-0.5">
              Liquid Studio Edition
            </p>
          </div>
        </div>

        {/* Action Buttons with Comfortable Gap */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2.5 rounded-xl text-white/70 hover:text-white transition-colors active:scale-95 ${
              isSearchOpen || searchQuery ? 'bg-violet-600/35 text-violet-300 border border-violet-400/40' : 'glass-panel'
            }`}
            title="Search"
          >
            <Search size={16} />
          </button>

          <button
            onClick={onOpenDsp}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              dspState.masterEnabled
                ? 'bg-violet-600 text-white shadow-md shadow-purple-900/40 border border-violet-400/40'
                : 'glass-panel text-white/50 hover:text-white'
            }`}
            title="Open DSP Sound Controller"
          >
            <Sliders size={14} />
            <span>{dspState.masterEnabled ? 'DSP' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown Input */}
      {isSearchOpen && (
        <div className="relative animate-in slide-in-from-top-2 duration-150 pt-1.5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            autoFocus
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-violet-400"
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
