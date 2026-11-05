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
    { id: 'library', label: 'Library', icon: <Home size={19} /> },
    { id: 'songs', label: 'Songs', icon: <Music2 size={19} /> },
    { id: 'albums', label: 'Albums', icon: <Disc size={19} /> },
    { id: 'dsp', label: 'DSP Suite', icon: <Sliders size={19} />, badge: isDspActive },
    { id: 'settings', label: 'Settings', icon: <Settings size={19} /> },
  ];

  return (
    <nav className="absolute bottom-2.5 left-3.5 right-3.5 z-40 flex justify-center pointer-events-none select-none">
      <div 
        className="pointer-events-auto rounded-[26px] px-2 py-1.5 flex items-center justify-around border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.8)] w-full"
        style={{
          background: 'rgba(22, 18, 26, 0.94)',
          backdropFilter: 'blur(32px) saturate(210%)',
          WebkitBackdropFilter: 'blur(32px) saturate(210%)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="group relative flex-1 py-1 px-0.5 flex flex-col items-center justify-center transition-all duration-200 outline-none focus:outline-none"
            >
              {/* Icon Container with active glowing pill */}
              <div 
                className={`relative px-3.5 py-1 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/50 to-fuchsia-600/40 text-violet-200 border border-violet-400/40 shadow-[0_0_14px_rgba(145,58,241,0.45)] scale-105' 
                    : 'text-white/45 group-hover:text-white/80 group-active:scale-90'
                }`}
              >
                {tab.icon}

                {/* DSP Active Pulsing Indicator Badge */}
                {tab.badge && !isActive && (
                  <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_#ac5bfb]" />
                )}
              </div>

              {/* Text Label - Generous spacing, never clipped */}
              <span 
                className={`text-[10px] tracking-normal font-semibold mt-1 transition-colors duration-200 ${
                  isActive ? 'text-white font-extrabold' : 'text-white/50 group-hover:text-white/80'
                }`}
              >
                {tab.label}
              </span>

              {/* Micro Active Bottom Dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-violet-400 shadow-[0_0_6px_#ac5bfb] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
