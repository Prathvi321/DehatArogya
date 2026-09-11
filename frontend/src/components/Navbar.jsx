import React from 'react';
import { ShieldCheck, Wifi, QrCode, PlusCircle, List, Stethoscope, ArrowLeftRight, Sparkles } from 'lucide-react';
import { bounceTap } from '../utils/animations';

export default function Navbar({ currentView, setCurrentView, networkInfo, isDoctorPortal, onTogglePortal }) {
  const lanIp = networkInfo?.lan_ip || window.location.hostname;
  const currentPort = window.location.port || (isDoctorPortal ? '5174' : '5173');

  const handleNavClick = (e, view) => {
    bounceTap(e.currentTarget);
    setCurrentView(view);
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      isDoctorPortal 
        ? 'bg-command-900/90 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-xl' 
        : 'bg-white/90 backdrop-blur-xl border-b border-emerald-900/10 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand */}
        <div 
          onClick={(e) => handleNavClick(e, isDoctorPortal ? 'vet' : 'register')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-105 ${
            isDoctorPortal 
              ? 'bg-gradient-to-br from-cyan-500 to-teal-700 shadow-cyan-500/30' 
              : 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-500/30'
          }`}>
            {isDoctorPortal ? <Stethoscope className="w-5 h-5 text-cyan-100" /> : <ShieldCheck className="w-5 h-5 text-emerald-100" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-lg sm:text-xl font-heading font-black tracking-tight ${isDoctorPortal ? 'text-white' : 'text-slate-900'}`}>
                Dehat<span className={isDoctorPortal ? 'text-cyan-400' : 'text-emerald-600'}>Arogya</span>
              </span>
              <span className={`text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                isDoctorPortal
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {isDoctorPortal ? 'VET DESK' : 'FARMER HUB'}
              </span>
            </div>
            <p className={`text-[10.5px] font-medium leading-none mt-0.5 hidden sm:block ${
              isDoctorPortal ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {isDoctorPortal 
                ? 'Clinical Jurisdiction Telemetry & Treatment' 
                : 'Livestock Identity & AI Voice Diagnostic Triage'}
            </p>
          </div>
        </div>

        {/* Center: LAN status with Radar ping */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
          isDoctorPortal
            ? 'bg-slate-800/80 border-slate-700 text-slate-300'
            : 'bg-emerald-50/80 border-emerald-100 text-emerald-900'
        }`}>
          <div className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full radar-ring ${
              isDoctorPortal ? 'bg-cyan-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isDoctorPortal ? 'bg-cyan-400' : 'bg-emerald-500'
            }`}></span>
          </div>
          <Wifi className="w-3.5 h-3.5 opacity-70" />
          <span className="text-[11px] font-semibold">PORT {currentPort} • {lanIp}</span>
        </div>

        {/* Right Navigation & Portal Switcher */}
        <div className="flex items-center gap-1.5">
          <nav className="flex items-center gap-1">
            {isDoctorPortal ? (
              /* DOCTOR PORTAL NAV (Port 5174) */
              <>
                <button
                  id="nav-vet-cases-btn"
                  onClick={(e) => handleNavClick(e, 'vet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    currentView === 'vet'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Cases</span>
                </button>

                <button
                  id="nav-vet-directory-btn"
                  onClick={(e) => handleNavClick(e, 'directory')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    currentView === 'directory'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Registry</span>
                </button>
              </>
            ) : (
              /* FARMER PORTAL NAV (Port 5173) */
              <>
                <button
                  id="nav-register-btn"
                  onClick={(e) => handleNavClick(e, 'register')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    currentView === 'register'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Register</span>
                </button>

                <button
                  id="nav-scan-btn"
                  onClick={(e) => handleNavClick(e, 'scan')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    currentView === 'scan'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Triage</span>
                </button>

                <button
                  id="nav-directory-btn"
                  onClick={(e) => handleNavClick(e, 'directory')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    currentView === 'directory'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Herd</span>
                </button>
              </>
            )}
          </nav>

          {/* Quick Portal Switcher for Instant Demo Verification */}
          {onTogglePortal && (
            <button
              onClick={(e) => {
                bounceTap(e.currentTarget);
                onTogglePortal();
              }}
              title={isDoctorPortal ? "Switch to Farmer Portal View" : "Switch to Veterinary Doctor Desk View"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 ${
                isDoctorPortal
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border-slate-700'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isDoctorPortal ? 'Farmer View' : 'Vet View'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
