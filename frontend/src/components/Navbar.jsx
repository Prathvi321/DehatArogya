import React from 'react';
import { ShieldCheck, Wifi, QrCode, PlusCircle, List, Stethoscope } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, networkInfo, isDoctorPortal }) {
  const lanIp = networkInfo?.lan_ip || window.location.hostname;
  const currentPort = window.location.port || (isDoctorPortal ? '5174' : '5173');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView(isDoctorPortal ? 'vet' : 'register')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform ${
            isDoctorPortal 
              ? 'bg-gradient-to-br from-teal-700 to-slate-900 shadow-teal-700/20' 
              : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-500/20'
          }`}>
            {isDoctorPortal ? <Stethoscope className="w-6 h-6 text-amber-300" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Dehat<span className={isDoctorPortal ? 'text-teal-700' : 'text-emerald-600'}>Arogya</span>
              </h1>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                isDoctorPortal
                  ? 'bg-teal-50 text-teal-900 border-teal-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}>
                {isDoctorPortal ? 'DOCTOR PORTAL' : 'FARMER PORTAL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {isDoctorPortal 
                ? 'Veterinary Jurisdiction & Treatment Desk' 
                : 'Livestock Identity & AI Health Triage'}
            </p>
          </div>
        </div>

        {/* LAN Info Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Wifi className="w-3.5 h-3.5 text-slate-500" />
          <span>PORT {currentPort} • {lanIp}</span>
        </div>

        {/* Navigation Actions - COMPLETELY SEPARATED FOR EACH PORTAL */}
        <nav className="flex items-center gap-1">
          {isDoctorPortal ? (
            /* DOCTOR PORTAL ONLY (Port 5174) */
            <>
              <button
                id="nav-vet-cases-btn"
                onClick={() => setCurrentView('vet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentView === 'vet'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-amber-300" />
                <span>Jurisdiction Cases</span>
              </button>

              <button
                id="nav-vet-directory-btn"
                onClick={() => setCurrentView('directory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentView === 'directory'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Herd Registry</span>
              </button>
            </>
          ) : (
            /* FARMER / FIELD PORTAL ONLY (Port 5173) */
            <>
              <button
                id="nav-register-btn"
                onClick={() => setCurrentView('register')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentView === 'register'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Register Tag</span>
              </button>

              <button
                id="nav-scan-btn"
                onClick={() => setCurrentView('scan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentView === 'scan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden xs:inline">Scan / Triage</span>
              </button>

              <button
                id="nav-directory-btn"
                onClick={() => setCurrentView('directory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentView === 'directory'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden xs:inline">Directory</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
