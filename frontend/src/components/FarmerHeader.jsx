import React from 'react';
import { ArrowLeft, User, Settings } from 'lucide-react';

export default function FarmerHeader({
  showBack = false,
  onBack,
  onOpenProfile,
  userProfile
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Back Button or Logo */}
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
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
              <p className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                Healthy Animals Stronger Villages
              </p>
            </div>
          </div>
        </div>

        {/* Right: Unified Single Profile & Settings Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/90 hover:border-emerald-300 px-2.5 py-1.5 rounded-full transition-all duration-200 shadow-xs group cursor-pointer"
            title="Open Profile, Settings & Livestock Analytics"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span>{userProfile?.name ? userProfile.name.slice(0, 2).toUpperCase() : 'RK'}</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 hidden sm:inline-block">
              {userProfile?.name || 'Ram Kishan'}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-800 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </div>
    </header>
  );
}
