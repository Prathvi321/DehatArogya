import React, { useState } from 'react';
import { 
  Phone, MapPin, Calendar, Clock, Play, Pause, 
  ExternalLink, Stethoscope, ChevronRight, CheckCircle2,
  Navigation, MessageCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function DoctorPatientDetail({
  patient,
  onBack,
  onReadyToTreat,
  onScheduleVisit
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!patient) return null;

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleOpenMaps = () => {
    const lat = patient.location?.latitude || 23.2031;
    const lng = patient.location?.longitude || 77.0844;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* 1. Animal Hero Profile Card (Screenshot 2) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square mx-auto sm:mx-0">
          <img
            src={patient.image || '/images/cow1.png'}
            alt={patient.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.src = '/images/cow1.png'; }}
          />
        </div>

        <div className="flex-1 w-full text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-display font-extrabold text-slate-900">
              {patient.name}
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
              {patient.status || 'Needs Treatment'}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            {patient.animal_type} • {patient.age} years • {patient.gender || 'Female'}
          </p>

          <p className="text-xs font-mono font-bold text-emerald-800">
            Tag ID: {patient.tag_id}
          </p>

          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Owner:</span> {patient.owner_name}
          </p>

          <div className="flex items-center justify-between pt-0.5">
            <p className="text-xs text-slate-600 font-mono">
              📞 {patient.owner_phone}
            </p>
            <a
              href={`tel:${patient.owner_phone}`}
              className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 flex items-center justify-center transition-colors"
              title="Call Owner"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{patient.location?.address || patient.village || 'Rampur, Sehore (MP)'}</span>
          </div>
        </div>
      </div>

      {/* 2. Reported Concern Card (Screenshot 2) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-display font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
            <span>📋</span>
            <span>Reported Concern</span>
          </h3>
          <span className="text-slate-400 text-[11px] font-medium">
            {patient.reported_at || '12 Sep 2024, 10:30 AM'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
          "{patient.reported_issue}"
        </p>
      </div>

      {/* 3. Evidence Grid: Images & Audio Note (Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Images (3) */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1">
              <span>🖼️</span>
              <span>Images ({patient.images?.length || 3})</span>
            </h4>
            <span className="text-emerald-800 font-bold text-[11px] cursor-pointer">
              View All
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(patient.images && patient.images.length > 0 ? patient.images : ['/images/cow1.png', '/images/cow4.png', '/images/cow2.png']).map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img} alt="Evidence" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Audio Note (Interactive player with waveform) */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1">
              <span>🎙️</span>
              <span>Audio Note</span>
            </h4>
            <span className="text-slate-400 font-mono text-[11px]">
              {patient.audio_note?.duration || '00:28'}
            </span>
          </div>

          {/* Player Bar */}
          <div className="bg-emerald-50 rounded-2xl p-2.5 flex items-center gap-3 border border-emerald-200/60">
            <button
              onClick={handleToggleAudio}
              className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Dynamic Waveform Bars */}
            <div className="flex-1 flex items-center gap-1 h-6">
              {[40, 70, 90, 60, 80, 100, 50, 85, 45, 75, 95, 60, 40].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isPlayingAudio ? 'bg-emerald-700 animate-pulse' : 'bg-emerald-300'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-600 italic">
            "{patient.audio_note?.transcript || 'She is not eating and looks very dull since yesterday.'}"
          </p>
        </div>
      </div>

      {/* 4. Location & Medical History Grid (Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Location with Open in Maps */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Location</span>
            </h4>
            <button
              onClick={handleOpenMaps}
              className="text-emerald-800 font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Open in Maps</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Map Preview Simulation */}
          <div 
            onClick={handleOpenMaps}
            className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/2.5] bg-sky-50 relative cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-sky-100/50 to-amber-50/50 flex flex-col items-center justify-center p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md animate-bounce">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                {patient.location?.address || 'Rampur, Sehore (MP)'}
              </p>
              <span className="text-[10px] text-emerald-800 font-bold bg-white/90 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                Tap to navigate with GPS
              </span>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Medical History</span>
            </h4>
            <span className="text-emerald-800 font-bold text-[11px] cursor-pointer">
              View All
            </span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {patient.medical_history?.map((h) => (
              <div key={h.id} className="p-2 bg-slate-50 rounded-xl text-xs flex items-start gap-2 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] truncate">{h.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{h.date}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 line-clamp-1">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Previous Notes Card */}
      {patient.previous_notes && (
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-1 text-xs">
          <h4 className="font-bold text-slate-900 flex items-center gap-1">
            <span>📝</span>
            <span>Previous Clinical Notes</span>
          </h4>
          <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
            "{patient.previous_notes}"
          </p>
        </div>
      )}

      {/* 6. Primary Action: Ready to Treat (Screenshot 2) */}
      <button
        onClick={onReadyToTreat}
        className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-display font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
      >
        <Stethoscope className="w-5 h-5 stroke-[2.4px]" />
        <span>Ready to Treat</span>
      </button>

      {/* 7. Secondary Row: Schedule Visit, Contact Owner, Get Directions (Screenshot 2) */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <button
          onClick={onScheduleVisit}
          className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
        >
          <Calendar className="w-4 h-4 text-emerald-800" />
          <span className="text-[11px]">Schedule Visit</span>
        </button>

        <a
          href={`tel:${patient.owner_phone}`}
          className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex flex-col items-center justify-center gap-1 transition-colors shadow-2xs"
        >
          <Phone className="w-4 h-4 text-emerald-800" />
          <span className="text-[11px]">Contact Owner</span>
        </a>

        <button
          onClick={handleOpenMaps}
          className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
        >
          <Navigation className="w-4 h-4 text-emerald-800" />
          <span className="text-[11px]">Get Directions</span>
        </button>
      </div>

    </div>
  );
}
