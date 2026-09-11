import React from 'react';
import { ArrowLeft, Settings, Stethoscope } from 'lucide-react';

export default function DoctorHeader({
  showBack = false,
  onBack,
  onOpenProfile,
  doctorProfile
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Back Button or Logo */}
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
            </button>
          ) : null}

          <div className="flex items-center gap-2 cursor-pointer" onClick={showBack ? onBack : undefined}>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-black text-emerald-950 text-lg tracking-tight leading-none block">
                DehatArogya
              </span>
              <p className="text-[10.5px] text-emerald-800 font-bold leading-tight mt-0.5">
                Veterinary Doctor Portal
              </p>
            </div>
          </div>
        </div>

        {/* Right: Doctor Avatar & Profile Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/90 hover:border-emerald-300 px-2.5 py-1.5 rounded-full transition-all duration-200 shadow-xs group cursor-pointer"
            title="Open Doctor Profile & Jurisdiction Settings"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden border border-emerald-600/30">
              <img
                src={doctorProfile?.avatar || '/images/dr_sharma.jpg'}
                alt={doctorProfile?.name || 'Dr. Sharma'}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/images/dr_sharma.jpg'; }}
              />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 block leading-tight">
                {doctorProfile?.name || 'Dr. Sharma'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none block">
                {doctorProfile?.title || 'Veterinarian'}
              </span>
            </div>
            <Settings className="w-4 h-4 text-emerald-800 transition-transform group-hover:rotate-45 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
