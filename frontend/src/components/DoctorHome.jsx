import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, AlertTriangle, Search, Filter, Phone, 
  MapPin, ChevronRight, QrCode, CheckCircle2, Clock
} from 'lucide-react';

export default function DoctorHome({
  patients,
  onSelectPatient,
  onOpenScanQr,
  doctorName = 'Dr. Sharma'
}) {
  const [activeTab, setActiveTab] = useState('NEEDS_TREATMENT'); // 'NEEDS_TREATMENT' | 'FOLLOW_UPS' | 'RECENT'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState('ALL');

  // Compute counts
  const needsTreatmentCount = patients.filter(p => p.status === 'Needs Treatment').length;
  const followUpsCount = patients.filter(p => p.status === 'Follow-up' || p.priority === 'Follow-up').length;
  const recentCount = patients.length;

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Tab filter
      if (activeTab === 'NEEDS_TREATMENT' && patient.status !== 'Needs Treatment') {
        return false;
      }
      if (activeTab === 'FOLLOW_UPS' && patient.status !== 'Follow-up' && patient.priority !== 'Follow-up') {
        return false;
      }

      // Village filter
      if (selectedVillage !== 'ALL' && !patient.village?.toLowerCase().includes(selectedVillage.toLowerCase())) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        patient.name?.toLowerCase().includes(q) ||
        patient.tag_id?.toLowerCase().includes(q) ||
        patient.owner_name?.toLowerCase().includes(q) ||
        patient.village?.toLowerCase().includes(q)
      );
    });
  }, [patients, activeTab, searchQuery, selectedVillage]);

  const getPriorityBadge = (priority) => {
    if (priority === 'High Priority' || priority === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3" />
          <span>High Priority</span>
        </span>
      );
    }
    if (priority === 'Follow-up') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Clock className="w-3 h-3" />
          <span>Follow-up</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3 h-3" />
        <span>Moderate</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* 1. Good Morning Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <div>
            <h2 className="font-display font-black text-slate-900 text-lg sm:text-xl leading-tight">
              Good Morning, {doctorName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Here are the animals that need your attention.
            </p>
          </div>
        </div>

        {/* Alert Bell Badge */}
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 stroke-[2.2px]" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
            {needsTreatmentCount}
          </span>
        </div>
      </div>

      {/* 2. Scan QR Animal Tag Quick Action */}
      <button
        onClick={onOpenScanQr}
        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl shadow-sm hover:shadow-md flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-display font-extrabold text-xs text-white leading-tight">
              Scan Animal Ear-Tag QR
            </p>
            <p className="text-[10px] text-emerald-100">
              Instantly fetch patient records, farmer complaint & history
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-lg">
          Open Scanner ↗
        </span>
      </button>

      {/* 3. Filter Segment Tabs */}
      <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/70 text-xs font-bold">
        <button
          onClick={() => setActiveTab('NEEDS_TREATMENT')}
          className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
            activeTab === 'NEEDS_TREATMENT'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Needs Treatment ({needsTreatmentCount})
        </button>

        <button
          onClick={() => setActiveTab('FOLLOW_UPS')}
          className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
            activeTab === 'FOLLOW_UPS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Follow-ups ({followUpsCount})
        </button>

        <button
          onClick={() => setActiveTab('RECENT')}
          className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
            activeTab === 'RECENT'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recent ({recentCount})
        </button>
      </div>

      {/* 4. Search and Filter Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by animal name, owner, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        <button
          onClick={() => setShowFilterModal(!showFilterModal)}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ${
            selectedVillage !== 'ALL'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Filter Village dropdown */}
      {showFilterModal && (
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 flex flex-wrap gap-1.5 text-xs animate-fade-in">
          <span className="text-[11px] font-bold text-slate-400 w-full mb-1">Filter by Village Area:</span>
          {['ALL', 'Rampur', 'Kheda', 'Barkheda', 'Sehore'].map((v) => (
            <button
              key={v}
              onClick={() => { setSelectedVillage(v); setShowFilterModal(false); }}
              className={`px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                selectedVillage === v
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* 5. Patient Cards List (Reference Screenshot 1) */}
      <div className="space-y-3">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div
              key={patient.id || patient.tag_id}
              onClick={() => onSelectPatient(patient)}
              className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 hover:border-emerald-300 transition-all duration-200 cursor-pointer group hover:shadow-md space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Photo + Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square">
                    <img
                      src={patient.image || '/images/cow1.png'}
                      alt={patient.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/images/cow1.png'; }}
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-slate-900 text-base leading-tight truncate">
                        {patient.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        • {patient.animal_type} • {patient.age} yrs
                      </span>
                    </div>

                    {/* Location Pin */}
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{patient.location?.address || patient.village || 'Rampur, Sehore'}</span>
                      {patient.distance && (
                        <span className="text-slate-400 text-[11px]">• {patient.distance}</span>
                      )}
                    </div>

                    {/* Owner & Phone */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                      <span className="font-semibold text-slate-800">{patient.owner_name}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-600">{patient.owner_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Priority Badge & Arrow */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {getPriorityBadge(patient.priority)}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Bottom Card Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <p className="text-[11px] text-slate-500 italic truncate max-w-[70%]">
                  "{patient.reported_issue || 'General veterinary concern'}"
                </p>

                {/* Phone Call Quick Action */}
                <a
                  href={`tel:${patient.owner_phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors border border-emerald-200/70"
                  title="Call Animal Owner"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No patient records found matching your filters.
          </div>
        )}
      </div>

    </div>
  );
}
