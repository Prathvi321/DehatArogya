import React, { useState } from 'react';
import { 
  X, QrCode, Camera, AlertTriangle, PhoneCall, Stethoscope, 
  Settings, Monitor, Smartphone, ShieldCheck, CheckCircle2, ChevronRight 
} from 'lucide-react';

export function ScanModal({
  isOpen,
  onClose,
  animals,
  onSelectTag
}) {
  const [manualTag, setManualTag] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualTag.trim()) {
      onSelectTag(manualTag.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-100 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <QrCode className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-base">
                Scan Animal Tag
              </h3>
              <p className="text-[11px] text-slate-500">
                Hold tag QR code in camera or select animal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex flex-col items-center justify-center text-center p-4 border-2 border-emerald-500/30">
          <div className="w-44 h-44 rounded-2xl border-2 border-emerald-400/80 relative flex items-center justify-center">
            {/* Corner accents */}
            <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            
            <div className="w-full h-0.5 bg-emerald-400/80 shadow-[0_0_8px_#34d399] animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-3">
            Position official QR tag within frame
          </p>
        </div>

        {/* Quick Pick Registered Animal */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Or Quick Pick an Animal:
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {animals.map((animal) => (
              <button
                key={animal.tag_id}
                onClick={() => {
                  onSelectTag(animal.tag_id);
                  onClose();
                }}
                className="p-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl border border-slate-200 text-left flex items-center gap-2 transition-colors"
              >
                <img
                  src={animal.image || '/images/cow1.png'}
                  alt={animal.name}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">{animal.name}</p>
                  <p className="text-[10px] font-mono text-slate-500">{animal.tag_id}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Tag Entry */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. TAG-8A21F3C2"
            value={manualTag}
            onChange={(e) => setManualTag(e.target.value)}
            className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Open
          </button>
        </form>
      </div>
    </div>
  );
}

export function SettingsModal({
  isOpen,
  onClose,
  isDoctorPortal,
  onTogglePortal,
  deviceMode,
  onToggleDeviceMode,
  networkInfo
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-800" />
            <span>Platform Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Switch Portal Button */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="font-bold text-slate-800">Switch System Portal</p>
            <p className="text-[11px] text-slate-500">
              Access the clinical tele-veterinary dashboard or field farmer hub.
            </p>
            <button
              onClick={() => {
                onTogglePortal();
                onClose();
              }}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{isDoctorPortal ? 'Switch to Farmer Field Hub' : 'Switch to Vet Doctor Command Deck'}</span>
            </button>
          </div>

          {/* Toggle Layout Mode */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="font-bold text-slate-800">Preview Layout Mode</p>
            <p className="text-[11px] text-slate-500">
              Simulate native phone frame or wide PC screen dashboard.
            </p>
            <button
              onClick={() => {
                onToggleDeviceMode();
                onClose();
              }}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {deviceMode === 'mobile' ? (
                <>
                  <Monitor className="w-4 h-4" />
                  <span>Switch to Full PC Layout</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-800" />
                  <span>Switch to Mobile App Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Network and Sync info */}
          {networkInfo && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-[11px] text-emerald-900">
              <p className="font-bold">Offline-First Wi-Fi Sync</p>
              <p className="mt-0.5 font-mono">Server IP: {networkInfo.ip_address || '127.0.0.1'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlertsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Health & Vaccination Alerts</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-800">High Urgency</span>
            <p className="font-bold text-slate-900">Gauri (TAG-8A21F3C2) Follow-up Due</p>
            <p className="text-slate-600 text-[11px]">Scheduled follow-up with Dr. S. Sharma for Lumpy Skin monitoring on 15 Sep 2024.</p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">Vaccination Camp</span>
            <p className="font-bold text-slate-900">FMD Free Vaccination Camp</p>
            <p className="text-slate-600 text-[11px]">Sehore District Veterinary Hospital camp arriving in Rampur on 18 Sep 2024.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-800" />
            <span>Help & Veterinary Support</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <p className="font-bold text-emerald-950 text-sm">Kisan Call Center (Toll Free)</p>
            <p className="text-xs text-emerald-800 mt-1 font-mono font-bold">1800-180-1551</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">Available 6:00 AM - 10:00 PM all 7 days</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="font-bold text-slate-900 text-sm">Sehore District Emergency Hospital</p>
            <p className="text-xs text-slate-700 mt-1 font-mono font-bold">+91 7562 224190</p>
            <p className="text-[10px] text-slate-500 mt-0.5">24/7 Mobile Veterinary Clinic Unit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
