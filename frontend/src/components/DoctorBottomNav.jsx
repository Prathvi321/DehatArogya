import React from 'react';
import { Home, Calendar, User } from 'lucide-react';

export default function DoctorBottomNav({
  activeTab,
  onTabChange,
  urgentCount = 5,
  appointmentsCount = 5
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* TAB 1: Home (Patients needing treatment) */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'home' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px] text-emerald-800' : 'stroke-[1.8px]'}`} />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {urgentCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-bold">Home</span>
        </button>

        {/* TAB 2: Appointments */}
        <button
          onClick={() => onTabChange('appointments')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'appointments' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${activeTab === 'appointments' ? 'stroke-[2.5px] text-emerald-800' : 'stroke-[1.8px]'}`} />
            {appointmentsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {appointmentsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-bold">Appointments</span>
        </button>

        {/* TAB 3: Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5px] text-emerald-800' : 'stroke-[1.8px]'}`} />
          <span className="text-[11px] mt-1 font-bold">Profile</span>
        </button>

      </div>
    </nav>
  );
}
