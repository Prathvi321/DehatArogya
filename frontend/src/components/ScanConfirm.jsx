import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { getAnimal, diagnoseAnimal } from '../api';
import IssueForm from './IssueForm';
import TriageResult from './TriageResult';

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

  // Load animal details when tagId changes
  useEffect(() => {
    if (tagId) {
      loadAnimal(tagId);
    }
  }, [tagId]);

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
      setTagId(manualInput.trim());
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
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOW':
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Tag ID Search Bar if no animal loaded or to search another tag */}
      {(!tagId || !animal) && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
            Scan or Enter Livestock Tag ID
          </h3>
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. TAG-9A4B2C"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value.toUpperCase())}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !manualInput.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-2">
            Tip: When you scan the physical ear tag with a phone camera, this screen loads automatically.
          </p>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">
            Verifying livestock ear tag...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Animal Identified Confirmation & Flow */}
      {animal && (
        <div className="space-y-6">
          {/* Top Tag Banner */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SCANNED TAG: <strong>{animal.tag_id}</strong></span>
            </div>
            <button
              onClick={() => {
                setAnimal(null);
                setTagId('');
                setManualInput('');
              }}
              className="text-slate-400 hover:text-white underline text-[11px]"
            >
              Scan Another Tag
            </button>
          </div>

          {/* STEP 1: Animal Confirmation Card */}
          {step === 'confirm' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-4xl">{getSpeciesEmoji(animal.animal_type)}</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Is this {animal.name}?
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {animal.animal_type} • {animal.gender} • {animal.age} years old
                  {animal.village ? ` • Village: ${animal.village}` : ''}
                </p>
              </div>

              {/* Confirmation CTA */}
              <div className="pt-5 flex flex-col sm:flex-row gap-3">
                <button
                  id="confirm-report-issue-btn"
                  onClick={() => setStep('report')}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('confirm')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  ← Back to Profile
                </button>
                <span className="text-xs text-slate-500 font-semibold">
                  Animal: <strong className="text-slate-800">{animal.name}</strong>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('confirm')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  ← Back to Animal History
                </button>
                <span className="text-xs text-slate-500 font-semibold">
                  Triage for <strong className="text-slate-800">{animal.name}</strong>
                </span>
              </div>
              <TriageResult
                diagnosis={diagnosisResult}
                onReportNewIssue={() => setStep('report')}
                onResolutionUpdated={() => loadAnimal(animal.tag_id)}
              />
            </div>
          )}

          {/* Past Medical History Timeline (Shown on Confirm & Result steps) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <span>Past Medical History ({animal.medical_history?.length || 0})</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Tag: {animal.tag_id}
              </span>
            </div>

            {animal.medical_history && animal.medical_history.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {animal.medical_history.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleViewPastIncident(record)}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all text-xs space-y-1.5 cursor-pointer group"
                    title="Click to view detailed triage advice and care routine"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {record.detected_disease}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border uppercase ${getRiskChipColor(record.risk_level)}`}>
                        {record.risk_level} RISK
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-2">
                      <strong>Reported:</strong> "{record.reported_issue}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(record.created_at).toLocaleDateString()}</span>
                        </span>

                        {record.latitude && record.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-emerald-200 hover:bg-emerald-100"
                            title="Open reported location in Google Maps"
                          >
                            <span>📍 Maps</span>
                          </a>
                        )}
                      </div>

                      <span className={`font-semibold ${
                        record.user_status === 'SATISFIED' 
                          ? 'text-emerald-700' 
                          : record.user_status === 'TREATED'
                          ? 'text-blue-700'
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
              <div className="text-center py-6 text-slate-400 text-xs">
                <FileText className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                <p>No past medical incidents recorded for this animal.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "Yes, Report Health Issue" to record first triage.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
