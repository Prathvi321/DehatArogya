import React from 'react';
import { Wifi, Monitor, Smartphone } from 'lucide-react';

export default function MobileDeviceFrame({ 
  children, 
  isFrameActive = false,
  onToggleDeviceMode
}) {
  if (!isFrameActive) {
    return <>{children}</>;
  }

  return (
    <div className="py-4 md:py-8 flex flex-col justify-center items-center min-h-screen bg-slate-900/10 px-2 sm:px-4">
      {/* Floating Mode Switcher Pill on Top of Phone */}
      <div className="mb-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md text-xs font-semibold text-slate-700">
        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
        <span>Mobile App Mode</span>
        <span className="text-slate-300">|</span>
        <button
          onClick={onToggleDeviceMode}
          className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Switch to PC View</span>
        </button>
      </div>

      {/* Mobile Mockup Shell (Matches iPhone/Android reference in screenshot) */}
      <div className="w-full max-w-[430px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-slate-800 relative">
        
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-slate-900/90 ml-auto mr-2 border border-slate-800" />
        </div>

        {/* Screen Bezel and Inner Display */}
        <div className="bg-[#F4F6F2] rounded-[38px] overflow-hidden relative flex flex-col min-h-[840px] max-h-[90vh] overflow-y-auto scrollbar-none border border-slate-200/60">
          
          {/* Simulated Mobile Status Bar (9:41, Signal, Wifi, Battery 100) */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between text-slate-900 text-xs font-bold select-none border-b border-slate-100/60">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-800">
              {/* Cellular Signal Bars */}
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-1 bg-slate-900 rounded-xs" />
                <span className="w-0.5 h-1.5 bg-slate-900 rounded-xs" />
                <span className="w-0.5 h-2 bg-slate-900 rounded-xs" />
                <span className="w-0.5 h-2.5 bg-slate-900 rounded-xs" />
              </div>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5 bg-slate-900 text-white px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none">
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Actual Child Views */}
          <div className="flex-1 flex flex-col">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="sticky bottom-0 left-0 right-0 z-50 pointer-events-none pb-2 pt-1 flex justify-center">
            <div className="w-32 h-1 bg-slate-800/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
