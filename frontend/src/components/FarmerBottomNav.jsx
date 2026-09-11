import React from 'react';
import { QrCode, PlusCircle, Heart, FolderHeart } from 'lucide-react';

export default function FarmerBottomNav({
  activeView,
  onNavigate,
  onOpenScan
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto px-6 h-18 flex items-center justify-between relative">
        
        {/* OPTION 1: My Animals (Left) */}
        <button
          onClick={() => onNavigate('directory')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all duration-200 flex-1 group cursor-pointer ${
            activeView === 'directory' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`w-10 h-8 rounded-xl flex items-center justify-center transition-colors ${
            activeView === 'directory' ? 'bg-emerald-100/70 text-emerald-800' : 'group-hover:bg-slate-100'
          }`}>
            <span className="text-lg">🐄</span>
          </div>
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">
            My Animals
          </span>
        </button>

        {/* OPTION 2: Center Elevated Floating Scan QR Button */}
        <div className="flex-1 flex justify-center -mt-7">
          <button
            onClick={onOpenScan}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-700 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-900/35 ring-4 ring-[#F4F6F2] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Scan Animal QR Tag"
          >
            <QrCode className="w-7 h-7 stroke-[2.3px]" />
            <span className="text-[9px] font-extrabold tracking-tight uppercase mt-0.5">
              Scan QR
            </span>
          </button>
        </div>

        {/* OPTION 3: Register Animal (Right) */}
        <button
          onClick={() => onNavigate('register')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all duration-200 flex-1 group cursor-pointer ${
            activeView === 'register' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`w-10 h-8 rounded-xl flex items-center justify-center transition-colors ${
            activeView === 'register' ? 'bg-emerald-100/70 text-emerald-800' : 'group-hover:bg-slate-100'
          }`}>
            <PlusCircle className={`w-5 h-5 ${activeView === 'register' ? 'stroke-[2.5px] text-emerald-800' : 'stroke-[2px]'}`} />
          </div>
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">
            Register Animal
          </span>
        </button>

      </div>
    </nav>
  );
}
