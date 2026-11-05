import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen w-full bg-[#0a090c] flex items-center justify-center p-0 sm:py-8 sm:px-4 font-sans selection:bg-violet-500 selection:text-white">
      {/* Outer Mobile Device Mockup Container (Portrait) */}
      <div className="relative w-full sm:max-w-[420px] sm:h-[890px] sm:max-h-[95vh] h-screen bg-[#141216] sm:rounded-[52px] sm:border-[8px] sm:border-[#221f27] shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden sm:ring-1 sm:ring-white/10">
        
        {/* Specular Outer Metallic Edge (Desktop only) */}
        <div className="hidden sm:block absolute inset-0 rounded-[44px] pointer-events-none border border-white/10 z-50 shadow-inner" />

        {/* Top Punch-Hole Camera & Speaker Grill */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none">
          {/* Speaker Earpiece */}
          <div className="w-12 h-1 rounded-full bg-white/15" />
          {/* Selfie Camera Punch-hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/10 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/40" />
          </div>
        </div>

        {/* Android Status Bar */}
        <div className="h-10 px-6 pt-1 flex items-center justify-between text-white/80 text-xs font-semibold select-none z-40 bg-[#141216]/80 backdrop-blur-md flex-shrink-0">
          <span className="text-[12px] font-mono tracking-tight font-bold pl-1">{currentTime}</span>
          <div className="flex items-center gap-2 pr-1 text-white/70">
            <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400">5G</span>
            <Signal size={13} />
            <Wifi size={13} />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono">98%</span>
              <BatteryMedium size={14} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Content Scrollable Viewport */}
        <div className="relative flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col">
          {children}
        </div>

        {/* Android Bottom Gesture Indicator Bar */}
        <div className="h-5 w-full flex items-center justify-center bg-[#141216]/80 backdrop-blur-md pointer-events-none z-50 flex-shrink-0 pb-1">
          <div className="w-28 h-1 rounded-full bg-white/35" />
        </div>

      </div>
    </div>
  );
};

