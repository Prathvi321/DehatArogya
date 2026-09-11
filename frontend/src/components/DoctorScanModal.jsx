import React, { useState } from 'react';
import { X, QrCode, Search, ChevronRight } from 'lucide-react';

export default function DoctorScanModal({
  isOpen,
  onClose,
  patients,
  onSelectPatientByTag
}) {
  const [manualTag, setManualTag] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualTag.trim()) {
      onSelectPatientByTag(manualTag.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <QrCode className="w-5 h-5 stroke-[2.3px]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-base">
                Scan Patient QR Tag
              </h3>
              <p className="text-[11px] text-slate-500">
                Point camera at ear tag to fetch clinical history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex flex-col items-center justify-center text-center p-4 border-2 border-emerald-500/30">
          <div className="w-44 h-44 rounded-2xl border-2 border-emerald-400/80 relative flex items-center justify-center">
            <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            
            <div className="w-full h-0.5 bg-emerald-400/80 shadow-[0_0_8px_#34d399] animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-3">
            Aim camera at animal's physical digital ear tag
          </p>
        </div>

        {/* Quick Pick Patients in Jurisdiction */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Or Select Patient to Inspect:
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {patients.map((p) => (
              <button
                key={p.tag_id}
                onClick={() => {
                  onSelectPatientByTag(p.tag_id);
                  onClose();
                }}
                className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl border border-slate-200 text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={p.image || '/images/cow1.png'}
                    alt={p.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{p.name} ({p.animal_type})</p>
                    <p className="text-[10px] font-mono text-slate-500">{p.tag_id} • {p.owner_name}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Inspect
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Tag Entry */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Tag (e.g. TAG-8A21F3C2)"
            value={manualTag}
            onChange={(e) => setManualTag(e.target.value)}
            className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            Lookup
          </button>
        </form>

      </div>
    </div>
  );
}
