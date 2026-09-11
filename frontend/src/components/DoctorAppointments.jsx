import React, { useState } from 'react';
import { 
  Calendar, Clock, AlertTriangle, Stethoscope, 
  MapPin, Phone, Edit2, Navigation, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function DoctorAppointments({
  patients,
  onStartTreatment,
  onAdjustSchedule
}) {
  const [selectedDateFilter, setSelectedDateFilter] = useState('ALL');

  // Filter patients with scheduled visits
  const scheduledPatients = patients.filter(p => p.scheduled_visit);

  // Sort: High priority first, then date
  const sortedAppointments = [...scheduledPatients].sort((a, b) => {
    if (a.priority === 'High Priority' && b.priority !== 'High Priority') return -1;
    if (b.priority === 'High Priority' && a.priority !== 'High Priority') return 1;
    return 0;
  });

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* 1. Auto-Assignment & Priority Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-300" />
          <h2 className="font-display font-extrabold text-base sm:text-lg">
            Assigned Field Appointments
          </h2>
        </div>
        <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
          Patients are automatically prioritized based on AI triage risk. High urgency cases are queued for immediate slots. You can adjust dates and timings anytime.
        </p>
      </div>

      {/* 2. Appointments Cards */}
      <div className="space-y-3">
        {sortedAppointments.map((patient) => {
          const isHigh = patient.priority === 'High Priority' || patient.priority === 'HIGH';

          return (
            <div
              key={patient.id || patient.tag_id}
              className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3 hover:border-emerald-300 transition-all duration-200"
            >
              {/* Header: Date/Time Badge & Urgency */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-3 py-1 rounded-xl font-bold border border-emerald-200/70">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{patient.scheduled_visit?.date || '14 Sep 2024'}</span>
                  <span className="text-slate-300">•</span>
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{patient.scheduled_visit?.time || '10:00 AM'}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isHigh ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800'
                }`}>
                  {patient.priority || 'High Priority'}
                </span>
              </div>

              {/* Patient Body */}
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square">
                  <img
                    src={patient.image || '/images/cow1.png'}
                    alt={patient.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { e.target.src = '/images/cow1.png'; }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-extrabold text-slate-900 text-base leading-tight truncate">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {patient.animal_type} • {patient.age} yrs • Tag: <span className="font-mono text-emerald-800 font-bold">{patient.tag_id}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">Owner:</span> {patient.owner_name} ({patient.owner_phone})
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    📍 {patient.location?.address || patient.village}
                  </p>
                </div>
              </div>

              {/* Doctor Visit Note */}
              {patient.scheduled_visit?.note && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                  "{patient.scheduled_visit.note}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  onClick={() => onStartTreatment(patient)}
                  className="col-span-2 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Start Treatment</span>
                </button>

                <button
                  onClick={() => onAdjustSchedule(patient)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200/80 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Adjust Date and Time Slot"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Reschedule</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
