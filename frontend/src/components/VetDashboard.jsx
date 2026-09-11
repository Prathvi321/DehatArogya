import React, { useState, useEffect, useRef } from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  ShieldAlert, 
  Search, 
  Loader2, 
  FileText, 
  ExternalLink,
  ChevronDown,
  User,
  Clock,
  Activity,
  Radio
} from 'lucide-react';
import { fetchVetAreas, fetchVetIncidents, submitVetAction } from '../api';
import { bounceTap, animateCounter, staggerFadeIn, modalPop } from '../utils/animations';

export default function VetDashboard({ onSelectTagForTriage: _onSelectTagForTriage }) {
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

  // Counter Refs for anime.js rolling numbers
  const totalCountRef = useRef(null);
  const criticalCountRef = useRef(null);
  const gpsCountRef = useRef(null);
  const treatedCountRef = useRef(null);
  const modalRef = useRef(null);

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

  // KPI Calculations for current area
  const totalCount = incidents.length;
  const criticalCount = incidents.filter(i => i.risk_level === 'HIGH' || i.requires_specialist).length;
  const gpsCount = incidents.filter(i => i.latitude && i.longitude).length;
  const treatedCount = incidents.filter(i => i.user_status === 'TREATED' || i.user_status === 'SATISFIED').length;

  // Run Anime.js Rolling Counters whenever counts change
  useEffect(() => {
    if (!loading) {
      if (totalCountRef.current) animateCounter(totalCountRef.current, totalCount, 750);
      if (criticalCountRef.current) animateCounter(criticalCountRef.current, criticalCount, 850);
      if (gpsCountRef.current) animateCounter(gpsCountRef.current, gpsCount, 800);
      if (treatedCountRef.current) animateCounter(treatedCountRef.current, treatedCount, 900);
    }
  }, [totalCount, criticalCount, gpsCount, treatedCount, loading]);

  // Run Staggered Cascade for incidents cards
  useEffect(() => {
    if (!loading && incidents.length > 0) {
      staggerFadeIn('.vet-case-card', { startDelay: 30, stagger: 45 });
    }
  }, [loading, activeFilter, searchQuery, selectedArea]);

  // Run modal spring pop when opening treatment modal
  useEffect(() => {
    if (actionModalIncident && modalRef.current) {
      modalPop(modalRef.current);
    }
  }, [actionModalIncident]);

  const handleAreaChange = (area) => {
    setSelectedArea(area);
    loadIncidents(area);
  };

  const handleOpenActionModal = (incident, e) => {
    if (e) bounceTap(e.currentTarget);
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
    let matchesTab = true;
    if (activeFilter === 'CRITICAL') {
      matchesTab = inc.risk_level === 'HIGH' || inc.requires_specialist;
    } else if (activeFilter === 'PENDING') {
      matchesTab = inc.user_status === 'PENDING' || inc.user_status === 'ACTION_REQUIRED';
    } else if (activeFilter === 'TREATED') {
      matchesTab = inc.user_status === 'TREATED' || inc.user_status === 'SATISFIED' || inc.user_status === 'IN_TREATMENT';
    }

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

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-lg shadow-cyan-500/10">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Clinical Command Deck Header */}
      <div className="bg-gradient-to-r from-command-900 via-slate-900 to-command-950 border border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background radar grid lines */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold mb-2.5 shadow-xs">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>VETERINARY FIELD COMMAND DESK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              Jurisdiction Telemetry & Triage Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg font-medium">
              Monitor incoming AI triage diagnoses, real-time GPS locations from mobile tags, and coordinate veterinary clinical interventions.
            </p>
          </div>

          {/* Assigned Sector Selector */}
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 min-w-[240px] shadow-xl">
            <label className="block text-[10.5px] uppercase font-mono font-bold tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jurisdiction Sector:</span>
            </label>
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="w-full bg-command-850 text-white font-bold text-xs rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-700 shadow-sm cursor-pointer pr-9"
              >
                <option value="ALL">🌐 All Jurisdictions / Global Herd</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    📍 {area} Sector
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1.5 text-right">
              {selectedArea === 'ALL' ? 'Aggregated across all blocks' : `Live queue in ${selectedArea}`}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats HUD with Anime.js Animated Rolling Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Active Cases */}
        <div className="bg-command-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 shadow-card-dark flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-slate-400 flex items-center justify-between">
            <span>TOTAL CASES</span>
            <Activity className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div ref={totalCountRef} className="text-3xl sm:text-4xl font-mono font-black text-white mt-2">
            0
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {selectedArea === 'ALL' ? 'Total regional cases' : `${selectedArea} sector`}
          </div>
        </div>

        {/* Critical Cases */}
        <div className="bg-rose-950/30 backdrop-blur-md p-5 rounded-3xl border border-rose-800/40 shadow-card-dark flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-rose-400 flex items-center justify-between">
            <span>CRITICAL / URGENT</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div ref={criticalCountRef} className="text-3xl sm:text-4xl font-mono font-black text-rose-400 mt-2">
            0
          </div>
          <div className="text-[10px] text-rose-400/80 font-mono mt-1">
            Specialist visit needed
          </div>
        </div>

        {/* GPS Mapped Cases */}
        <div className="bg-cyan-950/30 backdrop-blur-md p-5 rounded-3xl border border-cyan-800/40 shadow-card-dark flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-cyan-400 flex items-center justify-between">
            <span>GPS PINPOINTED</span>
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div ref={gpsCountRef} className="text-3xl sm:text-4xl font-mono font-black text-cyan-300 mt-2">
            0
          </div>
          <div className="text-[10px] text-cyan-400/80 font-mono mt-1">
            Mobile coordinates active
          </div>
        </div>

        {/* Treated Cases */}
        <div className="bg-emerald-950/30 backdrop-blur-md p-5 rounded-3xl border border-emerald-800/40 shadow-card-dark flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center justify-between">
            <span>TREATED / RESOLVED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div ref={treatedCountRef} className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 mt-2">
            0
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-1">
            Field visits administered
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-command-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-card-dark">
        <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          {/* Urgency Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'All Cases' },
              { id: 'CRITICAL', label: '🚨 Critical Emergencies' },
              { id: 'PENDING', label: '⏳ Action Pending' },
              { id: 'TREATED', label: '✓ Treated Records' },
            ].map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    bounceTap(e.currentTarget);
                    setActiveFilter(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Telemetry Search Box */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tag ID, animal, disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-input-dark text-xs placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Case Feed */}
      {loading ? (
        <div className="p-16 text-center bg-command-900/80 rounded-3xl border border-slate-800 shadow-card-dark">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-2" />
          <p className="text-xs font-mono font-bold text-slate-400">
            Connecting to jurisdiction telemetry in {selectedArea === 'ALL' ? 'all areas' : selectedArea}...
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
                className={`vet-case-card bg-command-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-2xl ${
                  isCritical 
                    ? 'border-rose-500/60 shadow-lg shadow-rose-950/20 bg-gradient-to-r from-rose-950/20 via-command-900 to-command-900' 
                    : 'border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                {/* Header: Risk Pill, Specialist Alert, Tag ID, Species Avatar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                        incident.risk_level === 'HIGH'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : incident.risk_level === 'MEDIUM'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {incident.risk_level} RISK
                      </span>

                      {incident.requires_specialist && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                          <span>Specialist Required</span>
                        </span>
                      )}

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        incident.user_status === 'SATISFIED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : incident.user_status === 'TREATED'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : incident.user_status === 'IN_TREATMENT'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : incident.user_status === 'ACTION_REQUIRED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        STATUS: {incident.user_status}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-black text-white">
                      {incident.detected_disease}
                    </h3>
                  </div>

                  {/* Animal Profile Chip */}
                  <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2.5 rounded-2xl border border-slate-700/80 self-start shadow-xs">
                    <span className="text-2xl filter drop-shadow-xs">{getSpeciesEmoji(incident.animal_type)}</span>
                    <div>
                      <div className="font-heading font-bold text-white text-sm">
                        {incident.animal_name} ({incident.animal_type})
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono font-bold">
                        {incident.tag_id} • {incident.age} yrs
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farmer Reported Observations / Symptoms Quote */}
                <div className="text-xs text-slate-300 mb-4 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                  <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider text-[10px] block mb-1">
                    REPORTED SYMPTOMS (VOICE / TEXT TRANSCRIPTION):
                  </span>
                  <p className="font-medium text-slate-100 italic">
                    "{incident.reported_issue}"
                  </p>
                </div>

                {/* Location, Owner & Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 mb-4">
                  {/* Village & GPS */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-bold text-white">
                      Sector: {incident.village || 'Field Recorded'}
                    </span>
                    {hasGps && (
                      <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-800">
                        {incident.latitude.toFixed(4)}°, {incident.longitude.toFixed(4)}°
                      </span>
                    )}
                  </div>

                  {/* Owner Contact Speed-dial */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-400">Owner:</span>
                    {incident.owner_phone ? (
                      <a
                        href={`tel:${incident.owner_phone}`}
                        className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/60"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{incident.owner_phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">Not listed</span>
                    )}
                  </div>

                  {/* Incident Time */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reported: {new Date(incident.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Doctor's Notes (if existing) */}
                {incident.vet_notes && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 text-xs">
                    <span className="font-mono font-bold text-cyan-300 uppercase tracking-wider text-[10px] block mb-1 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                      <span>CLINICAL PRESCRIPTION & TREATMENT NOTES:</span>
                    </span>
                    <p className="text-slate-200 font-medium whitespace-pre-line leading-relaxed">
                      {incident.vet_notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-800/80 pt-3.5">
                  <div className="flex items-center gap-2">
                    {/* GPS Google Maps Navigation Button */}
                    {hasGps ? (
                      <a
                        href={`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Navigate with Maps</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic flex items-center gap-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 opacity-40" />
                        <span>No GPS Tagged</span>
                      </span>
                    )}
                  </div>

                  {/* Vet Record Treatment Button */}
                  <button
                    onClick={(e) => handleOpenActionModal(incident, e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {incident.vet_notes ? 'Update Clinical Record' : 'Administer Field Treatment'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-command-900/80 rounded-3xl border border-slate-800 text-slate-400 text-xs shadow-card-dark">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-75" />
          <p className="font-heading font-bold text-base text-white mb-1">
            No active emergency cases in this jurisdiction!
          </p>
          <p className="max-w-md mx-auto">
            {selectedArea === 'ALL'
              ? 'All registered livestock health reports across all sectors are currently resolved.'
              : `All livestock in the ${selectedArea} sector are currently healthy and accounted for.`}
          </p>
        </div>
      )}

      {/* VET TREATMENT ACTION MODAL */}
      {actionModalIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div ref={modalRef} className="bg-command-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full relative shadow-2xl border border-cyan-500/30 text-white">
            <button
              onClick={() => setActionModalIncident(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white font-bold text-lg p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-300 rounded-2xl border border-cyan-500/40">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-white">
                  Record Veterinary Action & Treatment
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Case #{actionModalIncident.id} • {actionModalIncident.animal_name} ({actionModalIncident.tag_id})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAction} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  Update Jurisdiction Status:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'TREATED', label: '✓ Treated / Resolved' },
                    { id: 'IN_TREATMENT', label: '🔄 In Active Treatment' },
                    { id: 'ACTION_REQUIRED', label: '🚨 Urgent Followup Required' },
                    { id: 'SATISFIED', label: '🌿 Monitored at Home' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={(e) => {
                        bounceTap(e.currentTarget);
                        setNewStatus(st.id);
                      }}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        newStatus === st.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30 shadow-md'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                  Officer Clinical Notes & Drug Prescription:
                </label>
                <textarea
                  rows={4}
                  value={vetNotes}
                  onChange={(e) => setVetNotes(e.target.value)}
                  placeholder="e.g. Conducted clinical exam. Administered 10ml Meloxicam + antibiotic wash. Prescribed oral electrolytes and wound spray..."
                  className="w-full px-4 py-3 rounded-2xl glass-input-dark text-xs focus:outline-none placeholder:text-slate-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModalIncident(null)}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingAction}
                  onClick={(e) => bounceTap(e.currentTarget)}
                  className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingAction ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Save Clinical Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
