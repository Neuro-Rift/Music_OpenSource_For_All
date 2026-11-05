import React from 'react';
import { Home, Music2, Disc, Sliders, Settings } from 'lucide-react';

export type AppTab = 'library' | 'songs' | 'albums' | 'dsp' | 'settings';

interface MuckeNavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isDspActive: boolean;
}

export const MuckeNavbar: React.FC<MuckeNavbarProps> = ({
  currentTab,
  onSelectTab,
  isDspActive,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'library', label: 'Library', icon: <Home size={20} /> },
    { id: 'songs', label: 'Tracks', icon: <Music2 size={20} /> },
    { id: 'albums', label: 'Albums', icon: <Disc size={20} /> },
    { id: 'dsp', label: 'DSP Suite', icon: <Sliders size={20} />, badge: isDspActive },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="absolute bottom-2 left-3 right-3 z-40 flex justify-center pointer-events-none select-none">
      <div 
        className="pointer-events-auto rounded-full px-3 py-2 flex items-center justify-around border border-white/[0.16] shadow-[0_16px_40px_rgba(5,4,10,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] w-full max-w-[390px]"
        style={{
          background: 'rgba(12, 10, 22, 0.92)',
          backdropFilter: 'blur(32px) saturate(220%)',
          WebkitBackdropFilter: 'blur(32px) saturate(220%)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="group relative flex-1 py-1 px-1 flex flex-col items-center justify-center transition-all duration-200 outline-none focus:outline-none"
            >
              {/* Icon Container */}
              <div 
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'text-[#62CDFF] scale-110 drop-shadow-[0_0_10px_rgba(98,205,255,0.7)]' 
                    : 'text-[#ccc3d5]/60 hover:text-white group-active:scale-95'
                }`}
              >
                {tab.icon}

                {/* DSP Active Pulsing Indicator Badge */}
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#62CDFF] animate-pulse shadow-[0_0_8px_#62CDFF]" />
                )}
              </div>

              {/* Text Label - Never overlapping, clean typography */}
              <span 
                className={`text-[10px] font-sans font-medium tracking-normal mt-1 leading-tight transition-colors duration-200 ${
                  isActive 
                    ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                    : 'text-[#ccc3d5]/55 group-hover:text-white/80'
                }`}
              >
                {tab.label}
              </span>

              {/* Micro Active Bottom Glowing Pill */}
              <div className="h-1 flex items-center justify-center mt-0.5">
                {isActive && (
                  <span className="w-3.5 h-[2.5px] rounded-full bg-gradient-to-r from-[#a377fe] to-[#62CDFF] shadow-[0_0_8px_#62CDFF]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
