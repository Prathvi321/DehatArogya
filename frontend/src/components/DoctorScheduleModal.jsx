import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, Check, Loader2 } from 'lucide-react';

export default function DoctorScheduleModal({
  patient,
  onConfirmSchedule,
  onBack
}) {
  const [date, setDate] = useState('2024-09-14');
  const [time, setTime] = useState('10:00 AM');
  const [note, setNote] = useState('I am on the way. Will reach by 10 AM.');
  const [saving, setSaving] = useState(false);

  if (!patient) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onConfirmSchedule({
        date: date,
        time: time,
        note: note.trim()
      });
      setSaving(false);
    }, 400);
  };

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* 1. Patient Profile Card Summary (Screenshot 3) */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center gap-3.5">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square">
          <img
            src={patient.image || '/images/cow1.png'}
            alt={patient.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.src = '/images/cow1.png'; }}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-black text-slate-900 text-lg leading-tight truncate">
              {patient.name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
              Needs Treatment
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {patient.animal_type} • {patient.age} years • {patient.gender || 'Female'}
          </p>

          <p className="text-xs font-mono font-bold text-emerald-800">
            Tag ID: {patient.tag_id}
          </p>

          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Owner:</span> {patient.owner_name} ({patient.owner_phone})
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            📍 {patient.location?.address || patient.village || 'Rampur, Sehore (MP)'}
          </p>
        </div>
      </div>

      {/* 2. Concern Callout Banner (Screenshot 3) */}
      <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 space-y-1 text-xs">
        <div className="flex items-center justify-between text-[11px] text-rose-800 font-bold">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Concern</span>
          </span>
          <span className="font-normal text-rose-600">{patient.reported_at || '12 Sep 2024, 10:30 AM'}</span>
        </div>
        <p className="text-slate-700 font-medium leading-relaxed">
          {patient.reported_issue}
        </p>
      </div>

      {/* 3. Schedule Your Visit Card (Screenshot 3) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="font-display font-extrabold text-slate-900 text-base">
            Schedule Your Visit
          </h3>
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Select Date
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
            />
          </div>
        </div>

        {/* Time Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Select Time
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          >
            <option value="09:00 AM">09:00 AM (Morning Slot)</option>
            <option value="10:00 AM">10:00 AM (Morning Slot)</option>
            <option value="11:30 AM">11:30 AM (Mid-day Slot)</option>
            <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
            <option value="04:00 PM">04:00 PM (Evening Slot)</option>
          </select>
        </div>

        {/* Optional Note with Character Counter */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Optional Note</span>
            <span className="text-[10px] text-slate-400 font-mono">{note.length}/200</span>
          </div>
          <textarea
            rows="3"
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. I am on the way. Will reach by 10 AM."
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-display font-extrabold text-sm rounded-2xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          <span>Confirm Visit</span>
        </button>
      </form>

    </div>
  );
}
