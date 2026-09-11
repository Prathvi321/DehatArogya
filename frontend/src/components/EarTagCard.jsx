import React from 'react';
import { Printer, ExternalLink, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EarTagCard({ animal, onDiagnoseNow }) {
  if (!animal) return null;

  const handlePrint = () => {
    window.print();
  };

  const getSpeciesEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case 'cow': return '🐄';
      case 'buffalo': return '🐃';
      case 'goat': return '🐐';
      case 'sheep': return '🐑';
      default: return '🐾';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Physical Ear Tag Container */}
      <div 
        id="printable-ear-tag"
        className="w-full max-w-sm bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-3xl p-6 shadow-2xl border-4 border-amber-500/80 text-slate-900 relative overflow-hidden transition-all duration-300 hover:shadow-amber-500/20"
      >
        {/* Top Rivet Hole for physical ear-tag pin */}
        <div className="flex justify-center mb-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border-4 border-amber-200 shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-950 shadow-md"></div>
          </div>
        </div>

        {/* Tag Header */}
        <div className="text-center border-b border-amber-600/30 pb-2 mb-3">
          <div className="text-[10px] tracking-widest font-black uppercase text-amber-950/80 flex items-center justify-center gap-1">
            <span>DEHAT AROGYA</span>
            <span>•</span>
            <span>SIH LIVESTOCK ID</span>
          </div>
          <div className="text-2xl font-mono font-black tracking-wider text-slate-950 mt-0.5 bg-amber-200/60 py-0.5 px-3 rounded-md inline-block border border-amber-600/30">
            {animal.tag_id}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-amber-600/30 flex flex-col items-center justify-center mb-4">
          <img 
            src={animal.qr_code_base64} 
            alt={`QR Tag for ${animal.name}`}
            className="w-48 h-48 object-contain rounded-lg shadow-sm"
          />
          <p className="text-[11px] font-semibold text-slate-600 mt-2 text-center flex items-center gap-1">
            <span>Scan with phone camera on LAN</span>
          </p>
          <p className="text-[10px] font-mono text-slate-400 text-center truncate max-w-[240px]">
            {animal.qr_url}
          </p>
        </div>

        {/* Animal Details */}
        <div className="bg-amber-100/90 backdrop-blur rounded-xl p-3 border border-amber-600/20 text-xs text-amber-950 font-medium space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center text-sm font-bold border-b border-amber-600/20 pb-1">
            <span className="flex items-center gap-1.5">
              <span>{getSpeciesEmoji(animal.animal_type)}</span>
              <span>{animal.name}</span>
            </span>
            <span className="bg-amber-200 px-2 py-0.5 rounded text-xs font-semibold text-amber-900 border border-amber-400/40">
              {animal.animal_type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5 text-[11px]">
            <div>
              <span className="text-amber-800/80">Gender / Age:</span>
              <p className="font-semibold">{animal.gender}, {animal.age} yrs</p>
            </div>
            <div>
              <span className="text-amber-800/80">Village / Loc:</span>
              <p className="font-semibold">{animal.village || 'Not specified'}</p>
            </div>
            {animal.owner_phone && (
              <div className="col-span-2">
                <span className="text-amber-800/80">Owner Contact:</span>
                <p className="font-semibold font-mono">{animal.owner_phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Barcode-like bottom strip */}
        <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-amber-950/70 border-t border-amber-600/20 pt-1">
          <span>NO LOGIN REQUIRED</span>
          <span>SIH-2024-HEALTH</span>
        </div>
      </div>

      {/* Card Action Buttons (hidden during printing) */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print / Save Tag</span>
        </button>

        {onDiagnoseNow && (
          <button
            onClick={() => onDiagnoseNow(animal.tag_id)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <span>Test Health Triage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
