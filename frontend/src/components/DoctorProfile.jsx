import React from 'react';
import { 
  User, Stethoscope, ShieldCheck, MapPin, Phone, 
  Mail, Calendar, Award, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function DoctorProfile({
  doctorProfile,
  totalPatients,
  onTogglePortal
}) {
  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* 1. Doctor Profile Hero Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-600/30 shadow-xs shrink-0 aspect-square">
          <img
            src={doctorProfile?.avatar || '/images/dr_sharma.jpg'}
            alt={doctorProfile?.fullName || 'Dr. Sharma'}
            className="w-full h-full object-cover object-top"
            onError={(e) => { e.target.src = '/images/dr_sharma.jpg'; }}
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-display font-extrabold text-slate-900">
              {doctorProfile?.fullName || 'Dr. S. Sharma'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified Vet
            </span>
          </div>

          <p className="text-xs font-semibold text-emerald-800">
            {doctorProfile?.role || 'Senior Veterinary Medical Officer'}
          </p>

          <p className="text-xs text-slate-500 font-mono">
            VCI Reg: {doctorProfile?.registrationNo || 'VCI-MP-4921'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 pt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{doctorProfile?.block || 'Sehore Block & Rampur Cluster'}</span>
          </div>
        </div>
      </div>

      {/* 2. Clinical Jurisdiction Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Jurisdiction Herd
          </span>
          <span className="text-2xl font-display font-black text-emerald-950 block mt-0.5">
            {doctorProfile?.stats?.animalsInJurisdiction || 24}
          </span>
          <span className="text-[10px] text-emerald-700">Registered livestock</span>
        </div>

        <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
            Urgent Attention
          </span>
          <span className="text-2xl font-display font-black text-rose-900 block mt-0.5">
            {totalPatients}
          </span>
          <span className="text-[10px] text-rose-700">Awaiting treatment</span>
        </div>

        <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
            Treated Cases
          </span>
          <span className="text-2xl font-display font-black text-sky-950 block mt-0.5">
            {doctorProfile?.stats?.treatedThisMonth || 18}
          </span>
          <span className="text-[10px] text-sky-700">This month</span>
        </div>

        <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
            Scheduled Visits
          </span>
          <span className="text-2xl font-display font-black text-purple-950 block mt-0.5">
            {doctorProfile?.stats?.scheduledVisits || 5}
          </span>
          <span className="text-[10px] text-purple-700">Field appointments</span>
        </div>
      </div>

      {/* 3. Official Department Credentials */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3 text-xs">
        <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Department of Animal Husbandry & Dairying</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Official Helpline</span>
            <p className="font-mono font-bold text-slate-800">{doctorProfile?.phone || '+91 7562 224190'}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Official Mail</span>
            <p className="font-mono text-slate-800 truncate">{doctorProfile?.email || 'dr.sharma.vet@mp.gov.in'}</p>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
          <p className="text-[11px] font-medium leading-tight">
            Authorized to prescribe antibiotics, NSAIDs, and vaccines under National Livestock Mission.
          </p>
        </div>
      </div>

      {/* 4. Switch to Farmer Portal */}
      <button
        onClick={onTogglePortal}
        className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-colors flex items-center justify-between border border-slate-200 cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🌾</span>
          <span>Switch to Farmer Field Hub</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

    </div>
  );
}
