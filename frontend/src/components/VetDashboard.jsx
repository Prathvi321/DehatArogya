import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Phone, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Search, 
  Filter, 
  Calendar, 
  Loader2, 
  Pill, 
  FileText, 
  ExternalLink,
  ChevronDown,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchVetAreas, fetchVetIncidents, submitVetAction } from '../api';

export default function VetDashboard({ onSelectTagForTriage }) {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'CRITICAL', 'PENDING', 'TREATED'
  const [searchQuery, setSearchQuery] = useState('');

  // Treatment Action Modal state
  const [actionModalIncident, setActionModalIncident] = useState(null);
  const [newStatus, setNewStatus] = useState('TREATED');
  const [vetNotes, setVetNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadAreas();
    loadIncidents('ALL');
  }, []);

  const loadAreas = async () => {
    try {
      const data = await fetchVetAreas();
      if (data && data.areas) {
        setAreas(data.areas);
      }
    } catch (err) {
      console.warn('Failed to load vet areas:', err);
    }
  };

  const loadIncidents = async (area = selectedArea) => {
    setLoading(true);
    try {
      const data = await fetchVetIncidents({
        village: area,
      });
      setIncidents(data || []);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
    loadIncidents(area);
  };

  const handleOpenActionModal = (incident) => {
    setActionModalIncident(incident);
    setNewStatus(incident.user_status === 'PENDING' || incident.user_status === 'ACTION_REQUIRED' ? 'TREATED' : incident.user_status);
    setVetNotes(incident.vet_notes || '');
  };

  const handleSaveAction = async (e) => {
    e.preventDefault();
    if (!actionModalIncident) return;

    setSubmittingAction(true);
    try {
      await submitVetAction(actionModalIncident.id, newStatus, vetNotes);
      setToastMessage(`Incident #${actionModalIncident.id} updated to ${newStatus}`);
      setActionModalIncident(null);
      // Refresh cases list
      await loadIncidents(selectedArea);
    } catch (err) {
      alert(err.message || 'Failed to update treatment record');
    } finally {
      setSubmittingAction(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
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

  // Filtered incidents based on active tab and search query
  const filteredIncidents = incidents.filter((inc) => {
    // Filter Tab condition
    let matchesTab = true;
    if (activeFilter === 'CRITICAL') {
      matchesTab = inc.risk_level === 'HIGH' || inc.requires_specialist;
    } else if (activeFilter === 'PENDING') {
      matchesTab = inc.user_status === 'PENDING' || inc.user_status === 'ACTION_REQUIRED';
    } else if (activeFilter === 'TREATED') {
      matchesTab = inc.user_status === 'TREATED' || inc.user_status === 'SATISFIED' || inc.user_status === 'IN_TREATMENT';
    }

    // Search query condition
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      inc.animal_name.toLowerCase().includes(q) ||
      inc.tag_id.toLowerCase().includes(q) ||
      inc.detected_disease.toLowerCase().includes(q) ||
      (inc.village && inc.village.toLowerCase().includes(q)) ||
      (inc.owner_phone && inc.owner_phone.includes(q));

    return matchesTab && matchesSearch;
  });

  // KPI Calculations for current area
  const totalCount = incidents.length;
  const criticalCount = incidents.filter(i => i.risk_level === 'HIGH' || i.requires_specialist).length;
  const gpsCount = incidents.filter(i => i.latitude && i.longitude).length;
  const treatedCount = incidents.filter(i => i.user_status === 'TREATED' || i.user_status === 'SATISFIED').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Vet Posting Selector */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold backdrop-blur-xs mb-2 border border-white/10">
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>Veterinary Officer Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Jurisdiction Health Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-md">
              Select your assigned local posting to track animal health incidents, view mobile GPS locations, and administer field treatment.
            </p>
          </div>

          {/* Posting Area Dropdown */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[220px]">
            <label className="block text-[11px] uppercase font-bold tracking-wider text-emerald-200 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Assigned Posting Area:</span>
            </label>
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="w-full bg-white text-slate-900 font-bold text-sm rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm cursor-pointer pr-9"
              >
                <option value="ALL">🌐 All Jurisdictions / Herd</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    📍 {area} Sector
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
            <div className="text-[10px] text-emerald-200/70 mt-1 text-right">
              {selectedArea === 'ALL' ? 'Showing all regions' : `Active in ${selectedArea}`}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Active Cases</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{selectedArea === 'ALL' ? 'All areas' : selectedArea}</div>
        </div>

        <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200/80 shadow-xs">
          <div className="text-xs font-bold text-red-700 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Critical / Specialist</span>
          </div>
          <div className="text-2xl font-black text-red-800 mt-1">{criticalCount}</div>
          <div className="text-[10px] text-red-600/80 mt-0.5">High risk urgency</div>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 shadow-xs">
          <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS Mapped</span>
          </div>
          <div className="text-2xl font-black text-blue-800 mt-1">{gpsCount}</div>
          <div className="text-[10px] text-blue-600/80 mt-0.5">Exact coordinates</div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Treated / Resolved</span>
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{treatedCount}</div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">Completed visits</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 justify-between sm:items-center">
          {/* Urgency Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'All Cases' },
              { id: 'CRITICAL', label: '🚨 Critical / Specialist' },
              { id: 'PENDING', label: '⏳ Needs Action' },
              { id: 'TREATED', label: '✓ Treated' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search animal, tag, disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Case Feed */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">
            Fetching livestock incidents in {selectedArea === 'ALL' ? 'all areas' : selectedArea}...
          </p>
        </div>
      ) : filteredIncidents.length > 0 ? (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const hasGps = incident.latitude && incident.longitude;
            const isCritical = incident.risk_level === 'HIGH' || incident.requires_specialist;

            return (
              <div
                key={incident.id}
                className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${
                  isCritical 
                    ? 'border-red-300 ring-1 ring-red-200 bg-gradient-to-r from-red-50/20 to-white' 
                    : 'border-slate-200'
                }`}
              >
                {/* Header with Disease, Risk Badge, and Animal Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase ${
                        incident.risk_level === 'HIGH'
                          ? 'bg-red-500 text-white'
                          : incident.risk_level === 'MEDIUM'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {incident.risk_level} RISK
                      </span>

                      {incident.requires_specialist && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          <span>Specialist Vet Required</span>
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        incident.user_status === 'SATISFIED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : incident.user_status === 'TREATED'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : incident.user_status === 'IN_TREATMENT'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : incident.user_status === 'ACTION_REQUIRED'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        Status: {incident.user_status}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {incident.detected_disease}
                    </h3>
                  </div>

                  {/* Animal Profile Chip */}
                  <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 self-start">
                    <span className="text-2xl">{getSpeciesEmoji(incident.animal_type)}</span>
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">
                        {incident.animal_name} ({incident.animal_type})
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {incident.tag_id} • {incident.age} yrs
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farmer Reported Observations */}
                <div className="text-xs text-slate-700 mb-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-0.5">
                    Reported Symptoms:
                  </span>
                  <p className="font-medium text-slate-800 italic">
                    "{incident.reported_issue}"
                  </p>
                </div>

                {/* Location, Owner & Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                  {/* Village & GPS */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">
                      Village: {incident.village || 'Unassigned'}
                    </span>
                    {hasGps && (
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                        {incident.latitude.toFixed(4)}°, {incident.longitude.toFixed(4)}°
                      </span>
                    )}
                  </div>

                  {/* Owner Contact */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Owner: </span>
                    {incident.owner_phone ? (
                      <a
                        href={`tel:${incident.owner_phone}`}
                        className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{incident.owner_phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>

                  {/* Incident Time */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reported on: {new Date(incident.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Doctor's Notes (if existing) */}
                {incident.vet_notes && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                    <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px] block mb-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-blue-700" />
                      <span>Veterinary Clinical Notes & Prescription:</span>
                    </span>
                    <p className="text-blue-950 font-medium whitespace-pre-line">
                      {incident.vet_notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    {/* GPS Google Maps Navigation Button */}
                    {hasGps ? (
                      <a
                        href={`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-all active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Navigate via Google Maps</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 opacity-40" />
                        <span>No GPS coordinates provided</span>
                      </span>
                    )}
                  </div>

                  {/* Vet Record Treatment Button */}
                  <button
                    onClick={() => handleOpenActionModal(incident)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {incident.vet_notes ? 'Update Clinical Record' : 'Record Field Treatment'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
          <p className="font-bold text-sm text-slate-800 mb-1">
            No pending cases found for this criteria!
          </p>
          <p>
            {selectedArea === 'ALL'
              ? 'All registered livestock health cases are currently addressed.'
              : `All livestock in ${selectedArea} are in good standing.`}
          </p>
        </div>
      )}

      {/* VET TREATMENT ACTION MODAL */}
      {actionModalIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setActionModalIncident(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 font-bold text-base p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Veterinary Treatment
                </h3>
                <p className="text-xs text-slate-500">
                  Case #{actionModalIncident.id} • {actionModalIncident.animal_name} ({actionModalIncident.tag_id})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Update Clinical Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'TREATED', label: '✓ Treated / Resolved' },
                    { id: 'IN_TREATMENT', label: '🔄 In Treatment' },
                    { id: 'ACTION_REQUIRED', label: '🚨 Urgent Followup' },
                    { id: 'SATISFIED', label: '🌿 Monitored at Home' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setNewStatus(st.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                        newStatus === st.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Doctor's Clinical Notes & Prescription:
                </label>
                <textarea
                  rows={4}
                  value={vetNotes}
                  onChange={(e) => setVetNotes(e.target.value)}
                  placeholder="e.g. Visited farm. Administered 10ml Meloxicam + antiseptic potassium permanganate wash. Prescribed oral electrolytes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModalIncident(null)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingAction}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submittingAction ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Save Treatment Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
