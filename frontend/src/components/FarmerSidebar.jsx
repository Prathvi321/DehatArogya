import React from 'react';
import { 
  Home, Heart, PlusCircle, QrCode, AlertCircle, FileText, 
  HelpCircle, ChevronRight, Stethoscope 
} from 'lucide-react';

export default function FarmerSidebar({
  currentView,
  onNavigate,
  onOpenScan,
  onOpenHelp,
  onTogglePortal
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'directory', label: 'My Animals', icon: Heart },
    { id: 'register', label: 'Register Animal', icon: PlusCircle },
    { id: 'scan', label: 'Scan QR Code', icon: QrCode, action: onOpenScan },
    { id: 'concern', label: 'Report a Concern', icon: AlertCircle, action: onOpenScan },
    { id: 'history', label: 'Medical History', icon: FileText, navTarget: 'directory' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, action: onOpenHelp },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-screen p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-6">
        {/* Logo Brand */}
        <div className="flex items-center gap-3 px-2 py-1 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div>
            <span className="font-display font-black text-emerald-950 text-xl tracking-tight leading-none block">
              DehatArogya
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
              Healthy Animals<br />Stronger Tomorrow
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.navTarget) onNavigate(item.navTarget);
                  else onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 shadow-xs border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-800 stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo / Slogan Badge */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-3.5 border border-emerald-200/70">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌾</span>
            <p className="font-serif italic font-bold text-emerald-950 text-xs">
              पशु स्वस्थ, किसान समृद्ध
            </p>
          </div>
          <p className="text-[10px] text-emerald-800 leading-tight">
            A Healthier Village, A Brighter Tomorrow
          </p>
        </div>

        {/* Quick Portal Switch */}
        <button
          onClick={onTogglePortal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px]">Doctor Deck</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </aside>
  );
}
