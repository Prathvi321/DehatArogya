import React, { useRef } from 'react';
import { Printer, Download, Sparkles, QrCode, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { bounceTap } from '../utils/animations';

export default function EarTagCard({ animal, onDiagnoseNow }) {
  const cardRef = useRef(null);
  if (!animal) return null;

  const handlePrint = (e) => {
    bounceTap(e.currentTarget);
    window.print();
  };

  const handleDownloadQr = (e) => {
    bounceTap(e.currentTarget);
    if (!animal.qr_code_base64) return;
    const link = document.createElement('a');
    link.href = animal.qr_code_base64;
    link.download = `${animal.tag_id || 'EarTag'}-${animal.name || 'animal'}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="flex flex-col items-center select-none">
      {/* Physical Digital Ear Tag Container */}
      <div 
        ref={cardRef}
        id="printable-ear-tag"
        className="w-full max-w-sm bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-3xl p-6 shadow-tag border-2 border-amber-500/90 text-slate-950 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] sheen-card"
      >
        {/* Top Rivet Hole for physical ear-tag pin */}
        <div className="flex justify-center mb-3">
          <div className="w-9 h-9 rounded-full brass-grommet flex items-center justify-center shadow-lg">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 shadow-inner"></div>
          </div>
        </div>

        {/* Tag Header */}
        <div className="text-center border-b border-amber-700/25 pb-2.5 mb-3">
          <div className="text-[10px] tracking-widest font-mono font-black uppercase text-amber-950/80 flex items-center justify-center gap-1.5">
            <span>DEHAT AROGYA</span>
            <span>•</span>
            <span>SIH LIVESTOCK ID</span>
          </div>
          <div className="text-2xl font-mono font-black tracking-wider text-slate-950 mt-1 bg-amber-200/80 py-1 px-4 rounded-xl inline-block border border-amber-600/30 shadow-xs">
            {animal.tag_id}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-600/25 flex flex-col items-center justify-center mb-4">
          <img 
            src={animal.qr_code_base64} 
            alt={`QR Tag for ${animal.name}`}
            className="w-48 h-48 object-contain rounded-xl shadow-xs"
          />
          <p className="text-[11px] font-bold text-slate-700 mt-2.5 text-center flex items-center gap-1">
            <span>Scan with phone camera on LAN</span>
          </p>
          <p className="text-[10px] font-mono text-slate-400 text-center truncate max-w-[240px]">
            {animal.qr_url}
          </p>
        </div>

        {/* Animal Details */}
        <div className="bg-amber-100/95 backdrop-blur rounded-2xl p-3.5 border border-amber-600/25 text-xs text-amber-950 font-medium space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-sm font-bold border-b border-amber-600/20 pb-1.5">
            <span className="flex items-center gap-2">
              <span className="text-xl filter drop-shadow-xs">{getSpeciesEmoji(animal.animal_type)}</span>
              <span className="font-heading font-black text-base">{animal.name}</span>
            </span>
            <span className="bg-amber-200/90 px-2.5 py-0.5 rounded-lg text-xs font-bold text-amber-900 border border-amber-400/50">
              {animal.animal_type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5 text-[11px]">
            <div>
              <span className="text-amber-800/80 block text-[10px] uppercase font-bold tracking-wider">Gender & Age</span>
              <p className="font-bold text-slate-900">{animal.gender}, {animal.age} yrs</p>
            </div>
            <div>
              <span className="text-amber-800/80 block text-[10px] uppercase font-bold tracking-wider">Village / Ward</span>
              <p className="font-bold text-slate-900">{animal.village || 'Field Recorded'}</p>
            </div>
            {animal.owner_phone && (
              <div className="col-span-2 pt-1 border-t border-amber-600/15">
                <span className="text-amber-800/80 block text-[10px] uppercase font-bold tracking-wider">Owner Contact</span>
                <p className="font-bold font-mono text-slate-900">{animal.owner_phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Barcode-like bottom strip */}
        <div className="mt-3.5 flex justify-between items-center text-[9px] font-mono font-bold text-amber-950/70 border-t border-amber-600/20 pt-1.5">
          <span>NO LOGIN REQUIRED</span>
          <span>SIH-2024-HEALTH</span>
        </div>
      </div>

      {/* Card Action Buttons (hidden during printing) */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Physical Tag</span>
        </button>

        <button
          onClick={handleDownloadQr}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download QR PNG</span>
        </button>

        {onDiagnoseNow && (
          <button
            onClick={(e) => {
              bounceTap(e.currentTarget);
              onDiagnoseNow(animal.tag_id);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-all cursor-pointer"
          >
            <span>Test Health Triage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
