import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  History, 
  Stethoscope, 
  ArrowRight, 
  Search, 
  Loader2, 
  Calendar, 
  ShieldAlert,
  HelpCircle,
  FileText,
  Tag,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { getAnimal, diagnoseAnimal } from '../api';
import IssueForm from './IssueForm';
import TriageResult from './TriageResult';
import { bounceTap, staggerFadeIn } from '../utils/animations';

export default function ScanConfirm({ initialTagId, onSelectDifferentAnimal }) {
  const [tagId, setTagId] = useState(initialTagId || '');
  const [manualInput, setManualInput] = useState(initialTagId || '');
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active step: 'confirm' | 'report' | 'result'
  const [step, setStep] = useState('confirm');
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const containerRef = useRef(null);

  // Load animal details when tagId changes
  useEffect(() => {
    if (tagId) {
      loadAnimal(tagId);
    }
  }, [tagId]);

  useEffect(() => {
    if (animal) {
      staggerFadeIn('.scan-anim-node', { startDelay: 60, stagger: 50 });
    }
  }, [animal, step]);

  const loadAnimal = async (id, keepCurrentStep = false) => {
    setLoading(!keepCurrentStep);
    setError(null);
    if (!keepCurrentStep) {
      setStep('confirm');
      setDiagnosisResult(null);
    }

    try {
      const data = await getAnimal(id.trim());
      setAnimal(data);
    } catch (err) {
      setError(err.message || `No animal found for Tag ID "${id}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setTagId(manualInput.trim().toUpperCase());
    }
  };

  const handleDiagnose = async (symptoms, latitude = null, longitude = null) => {
    if (!animal) return;
    setDiagnosing(true);
    setError(null);

    try {
      const result = await diagnoseAnimal(animal.tag_id, symptoms, latitude, longitude);
      setDiagnosisResult(result);
      setStep('result');
      // Refresh animal history quietly in the background without resetting step
      await loadAnimal(animal.tag_id, true);
    } catch (err) {
      setError(err.message || 'Failed to analyze symptoms.');
    } finally {
      setDiagnosing(false);
    }
  };

  // Allow clicking on a past medical record to view its full details in TriageResult
  const handleViewPastIncident = (record) => {
    setDiagnosisResult({
      history_id: record.id,
      tag_id: animal.tag_id,
      animal_name: animal.name,
      animal_type: animal.animal_type,
      triage: {
        detected_disease: record.detected_disease,
        identified_symptoms: [record.reported_issue],
        risk_level: record.risk_level,
        requires_specialist: record.requires_specialist,
        diet_and_routine_en: record.remedy_routine_english,
        diet_and_routine_hi: record.remedy_routine_hindi,
        supplements_or_remedies: record.recommended_supplements || []
      },
      user_status: record.user_status
    });
    setStep('result');
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

  const getRiskChipColor = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'LOW':
      default: return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto space-y-6">
      {/* Stepper Header (When an animal is active) */}
      {animal && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-bold text-slate-500 scan-anim-node">
          <div className={`flex items-center gap-1.5 ${step === 'confirm' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'confirm' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span>Identify</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 'report' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'report' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>2</span>
            <span>Voice Report</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 'result' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'result' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>3</span>
            <span>AI Triage</span>
          </div>
        </div>
      )}

      {/* Tag ID Search Bar if no animal loaded */}
      {(!tagId || !animal) && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-card-elevated border border-emerald-950/10 scan-anim-node">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Scan or Enter Livestock Tag ID</span>
          </div>
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. TAG-9A4B2C"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input-light text-sm font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !manualInput.trim()}
              onClick={(e) => bounceTap(e.currentTarget)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Lookup Tag</span>
            </button>
          </form>
          <p className="text-[11.5px] text-slate-500 mt-3 font-medium">
            💡 <strong>Quick NFC / QR Scan:</strong> When you scan the animal's physical ear tag using your mobile camera, this screen opens automatically.
          </p>
        </div>
      )}

      {loading && (
        <div className="p-10 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">
            Verifying livestock digital ear tag...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Error Identifying Tag</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Animal Identified Confirmation & Flow */}
      {animal && (
        <div className="space-y-6">
          {/* Top Tag Banner */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-mono shadow-md scan-anim-node">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SCANNED EAR TAG: <strong className="text-amber-300">{animal.tag_id}</strong></span>
            </div>
            <button
              onClick={(e) => {
                bounceTap(e.currentTarget);
                setAnimal(null);
                setTagId('');
                setManualInput('');
              }}
              className="text-slate-300 hover:text-white underline text-[11px] cursor-pointer"
            >
              Scan Another Tag
            </button>
          </div>

          {/* STEP 1: Animal Confirmation Card */}
          {step === 'confirm' && (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-7 shadow-card-elevated border border-emerald-950/10 text-center scan-anim-node">
              <div className="relative inline-block mb-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-100 to-amber-100 flex items-center justify-center text-5xl shadow-md border-2 border-white mx-auto">
                  {getSpeciesEmoji(animal.animal_type)}
                </div>
                <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {animal.animal_type}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                Is this {animal.name}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {animal.animal_type} • {animal.gender} • {animal.age} years old
                {animal.village ? ` • Village: ${animal.village}` : ''}
              </p>

              {/* Confirmation CTA */}
              <div className="pt-6 max-w-md mx-auto">
                <button
                  id="confirm-report-issue-btn"
                  onClick={(e) => {
                    bounceTap(e.currentTarget);
                    setStep('report');
                  }}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Yes, Report Health Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Issue Submission Form */}
          {step === 'report' && (
            <div className="space-y-4 scan-anim-node">
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    bounceTap(e.currentTarget);
                    setStep('confirm');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-xl border border-slate-200"
                >
                  ← Back to Profile
                </button>
                <span className="text-xs text-slate-500 font-semibold">
                  Triage Animal: <strong className="text-slate-900">{animal.name}</strong>
                </span>
              </div>
              <IssueForm
                animal={animal}
                onSubmitSymptoms={handleDiagnose}
                loading={diagnosing}
              />
            </div>
          )}

          {/* STEP 3: Triage Result Display */}
          {step === 'result' && diagnosisResult && (
            <div className="space-y-4 scan-anim-node">
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    bounceTap(e.currentTarget);
                    setStep('confirm');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-xl border border-slate-200"
                >
                  ← Back to History
                </button>
                <span className="text-xs text-slate-500 font-semibold">
                  Diagnosis for <strong className="text-slate-900">{animal.name}</strong>
                </span>
              </div>
              <TriageResult
                diagnosis={diagnosisResult}
                onReportNewIssue={() => setStep('report')}
                onResolutionUpdated={() => loadAnimal(animal.tag_id, true)}
              />
            </div>
          )}

          {/* Past Medical History Timeline */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-card-elevated border border-slate-200/80 scan-anim-node">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-heading font-black text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <span>Past Medical Records ({animal.medical_history?.length || 0})</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                TAG: {animal.tag_id}
              </span>
            </div>

            {animal.medical_history && animal.medical_history.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {animal.medical_history.map((record) => (
                  <div
                    key={record.id}
                    onClick={(e) => {
                      bounceTap(e.currentTarget);
                      handleViewPastIncident(record);
                    }}
                    className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs transition-all duration-200 text-xs space-y-2 cursor-pointer group"
                    title="Click to view full triage advice and care routine"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {record.detected_disease}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border uppercase ${getRiskChipColor(record.risk_level)}`}>
                        {record.risk_level} RISK
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-2 italic">
                      "{record.reported_issue}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(record.created_at).toLocaleDateString()}</span>
                        </span>

                        {record.latitude && record.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-200 hover:bg-emerald-100"
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            <span>Maps</span>
                          </a>
                        )}
                      </div>

                      <span className={`font-bold text-[11px] ${
                        record.user_status === 'SATISFIED' 
                          ? 'text-emerald-700' 
                          : record.user_status === 'TREATED'
                          ? 'text-cyan-700'
                          : record.user_status === 'IN_TREATMENT'
                          ? 'text-purple-700'
                          : record.user_status === 'ACTION_REQUIRED' 
                          ? 'text-rose-700' 
                          : 'text-amber-700'
                      }`}>
                        Status: {record.user_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-7 text-slate-400 text-xs">
                <FileText className="w-7 h-7 mx-auto mb-1.5 opacity-30" />
                <p className="font-semibold text-slate-500">No past medical incidents recorded for this animal.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "Yes, Report Health Issue" to run an AI diagnostic check.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
