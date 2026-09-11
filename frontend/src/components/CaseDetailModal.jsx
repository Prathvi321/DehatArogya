import React from 'react';
import { 
  X, Calendar, Clock, Stethoscope, Phone, MapPin, 
  Pill, AlertTriangle, ShieldCheck, FileText, Printer, CheckCircle2,
  ExternalLink, Sparkles, Activity
} from 'lucide-react';

export default function CaseDetailModal({
  isOpen,
  onClose,
  record,
  animal
}) {
  if (!isOpen || !record) return null;

  const isHigh = record.risk_level?.includes('High') || record.risk_level === 'HIGH';
  const isMed = record.risk_level?.includes('Medium') || record.risk_level === 'MEDIUM';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 my-auto space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header with Case ID and Close */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                {record.case_id || `CASE-${record.id || 'RECORD'}`}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isHigh ? 'bg-rose-100 text-rose-700' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {record.risk_level || 'Evaluated Case'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                Status: {record.status || 'Treated'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-2">
              {record.title || record.detected_disease || 'Veterinary Medical Case'}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-2">
              <span>Patient: <strong className="text-slate-800">{animal?.name || 'Animal'}</strong> ({animal?.animal_type}, {animal?.tag_id})</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {record.date} {record.time ? `• ${record.time}` : ''}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-xs"
              title="Print Prescription Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-xs"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clinical Symptoms & Vitals */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reported Symptoms & Clinical Presentation
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {record.symptoms || record.reported_issue || 'General wellness and clinical evaluation.'}
            </p>
          </div>

          {/* Vitals Grid if captured */}
          {record.vital_signs && (
            <div className="pt-2 border-t border-slate-200/60">
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-700" />
                <span>Recorded Vital Signs</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {record.vital_signs.temperature && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Temperature</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">{record.vital_signs.temperature}</span>
                  </div>
                )}
                {record.vital_signs.rumination && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Rumination</span>
                    <span className="text-xs font-bold text-slate-800">{record.vital_signs.rumination}</span>
                  </div>
                )}
                {record.vital_signs.respiratory_rate && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Respiration</span>
                    <span className="text-xs font-bold text-slate-800">{record.vital_signs.respiratory_rate}</span>
                  </div>
                )}
                {record.vital_signs.mucous_membrane && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Mucous Memb.</span>
                    <span className="text-xs font-bold text-slate-800">{record.vital_signs.mucous_membrane}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Images Uploaded At Time of Examination */}
        {record.case_photos && record.case_photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Attached Medical Evidence / Photos ({record.case_photos.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Captured at field triage</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {record.case_photos.map((photo, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs aspect-video bg-slate-100 group relative">
                  <img
                    src={photo}
                    alt={`Case Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    View Photo
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treating Veterinary Doctor Card */}
        {record.doctor_name && (
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div>
                <p className="font-display font-extrabold text-slate-900 text-sm">
                  {record.doctor_name}
                </p>
                <p className="text-[11px] text-emerald-800 font-medium">
                  {record.doctor_title || 'Veterinary Officer, Sehore Block'}
                </p>
                {record.doctor_phone && (
                  <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{record.doctor_phone}</span>
                  </p>
                )}
              </div>
            </div>

            {record.follow_up_date && (
              <div className="bg-white/90 px-3 py-2 rounded-xl border border-emerald-200 text-emerald-900 font-semibold text-[11px] flex items-center gap-1.5 shrink-0 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Next Follow-up: <strong>{record.follow_up_date}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Official Prescription & Treatment Table */}
        {record.prescription && record.prescription.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-700" />
              <span>Veterinary Prescriptions & Dosage Regimen</span>
            </h4>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {record.prescription.map((med, idx) => (
                <div key={idx} className="p-3.5 space-y-1 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {idx + 1}. {med.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                      {med.dosage}
                    </span>
                  </div>
                  {med.frequency && (
                    <p className="text-[11px] text-emerald-800 font-semibold">
                      Schedule: {med.frequency}
                    </p>
                  )}
                  {med.instructions && (
                    <p className="text-[11px] text-slate-600">
                      Note: {med.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          record.treatment && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                Treatment Administered
              </h4>
              <p className="text-slate-700 font-medium">{record.treatment}</p>
            </div>
          )
        )}

        {/* Bilingual Home Care Advice */}
        {record.home_care && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Home Care & Dietary Guidance for Farmer</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {record.home_care.english && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">English Protocol</span>
                  <p className="text-slate-600 leading-relaxed">{record.home_care.english}</p>
                </div>
              )}
              {record.home_care.hindi && (
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70 text-xs">
                  <span className="font-bold text-emerald-950 block mb-1">घरेलू देखभाल (हिंदी)</span>
                  <p className="text-emerald-900 leading-relaxed font-medium">{record.home_care.hindi}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GPS Location & Doctor Clinical Notes */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100 text-slate-500">
          {record.gps_location?.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{record.gps_location.address}</span>
            </div>
          )}

          {record.notes && (
            <p className="w-full text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <strong className="not-italic text-slate-800 font-bold">Doctor's Clinical Notes:</strong> {record.notes}
            </p>
          )}
        </div>

        {/* Bottom Done Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-sm transition-transform active:scale-[0.98] text-center"
        >
          Close Medical Record
        </button>

      </div>
    </div>
  );
}
