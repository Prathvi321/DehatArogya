import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Stethoscope, 
  Home, 
  Pill, 
  Languages, 
  PhoneCall,
  Loader2,
  Clock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { resolveIncident } from '../api';

export default function TriageResult({ diagnosis, onResolutionUpdated, onReportNewIssue }) {
  const [currentLang, setCurrentLang] = useState('en'); // 'en' or 'hi'
  const [resolving, setResolving] = useState(false);
  const [status, setStatus] = useState(diagnosis?.user_status || 'PENDING');
  const [toastMsg, setToastMsg] = useState(null);

  if (!diagnosis || !diagnosis.triage) return null;
  const { triage, animal_name, animal_type, tag_id, history_id } = diagnosis;

  const handleResolve = async (newStatus) => {
    setResolving(true);
    try {
      await resolveIncident(history_id, newStatus);
      setStatus(newStatus);
      if (newStatus === 'SATISFIED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setToastMsg('Marked as Resolved. Care routine noted.');
      } else {
        setToastMsg('Escalated to Veterinary Officer. Action flagged in history.');
      }
      if (onResolutionUpdated) {
        onResolutionUpdated(history_id, newStatus);
      }
    } catch (err) {
      alert(err.message || 'Failed to update incident status.');
    } finally {
      setResolving(false);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  // Color-coded risk badge config
  const getRiskDetails = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'bg-red-500',
          lightBg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-700',
          label: 'HIGH RISK (अत्यधिक जोखिम)',
          desc: 'Immediate medical danger or highly contagious condition'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500',
          lightBg: 'bg-amber-50',
          border: 'border-amber-500',
          text: 'text-amber-800',
          label: 'MEDIUM RISK (मध्यम जोखिम)',
          desc: 'Moderate illness requiring active care & monitoring'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500',
          lightBg: 'bg-emerald-50',
          border: 'border-emerald-500',
          text: 'text-emerald-800',
          label: 'LOW RISK (कम जोखिम)',
          desc: 'Mild health anomaly manageable with home routine'
        };
    }
  };

  const riskInfo = getRiskDetails(triage.risk_level);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Risk Level & Disease */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-black tracking-wide uppercase ${riskInfo.bg} shadow-sm`}>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>{riskInfo.label}</span>
            </span>

            {/* Resolution Status Chip */}
            {status !== 'PENDING' && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                status === 'SATISFIED' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {status === 'SATISFIED' ? '✓ Resolved' : '🚨 Escalated to Vet'}
              </span>
            )}
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currentLang === 'en'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang('hi')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currentLang === 'hi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
          {triage.detected_disease}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Identified condition for <strong className="text-slate-800">{animal_name}</strong> ({animal_type}, Tag: <span className="font-mono text-emerald-700">{tag_id}</span>)
        </p>
      </div>

      {/* Specialist Banner vs Home Care Banner */}
      {triage.requires_specialist ? (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500 text-white shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-900">
              {currentLang === 'hi' ? '🚨 पशु चिकित्सक (स्पेशलिस्ट) की तुरंत आवश्यकता है' : '🚨 Requires Specialist Vet Visit Immediately'}
            </h4>
            <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
              {currentLang === 'hi' 
                ? 'यह लक्षण गंभीर या संक्रामक रोग का संकेत देते हैं। प्राथमिक उपचार के साथ-साथ निकटतम पशु चिकित्सालय में संपर्क करें।'
                : 'These clinical signs point to potentially severe or contagious pathology. Provide first aid below and arrange veterinary inspection without delay.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">
              {currentLang === 'hi' ? '🌿 प्राथमिक घरेलू देखभाल व निगरानी पर्याप्त है' : '🌿 Home Care & Close Observation Recommended'}
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
              {currentLang === 'hi'
                ? 'स्थिति नियंत्रण योग्य है। नीचे दिए गए दैनिक आहार और उपचार का पालन करें। 48 घंटे में सुधार न होने पर डॉक्टर को दिखाएं।'
                : 'Condition is currently manageable with supportive hygiene, hydration, and nutritional care. Monitor closely.'}
            </p>
          </div>
        </div>
      )}

      {/* Identified Symptoms */}
      {triage.identified_symptoms && triage.identified_symptoms.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {currentLang === 'hi' ? 'पहचाने गए लक्षण (Observed Signs)' : 'Identified Clinical Signs'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {triage.identified_symptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
              >
                • {sym}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Diet & Routine Guidance Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>{currentLang === 'hi' ? 'दैनिक देखभाल व आहार निर्देश (Care Routine)' : 'Diet & Routine Care Protocol'}</span>
        </h4>
        <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans">
          {currentLang === 'hi' ? triage.diet_and_routine_hi : triage.diet_and_routine_en}
        </p>
      </div>

      {/* Recommended Supplements / Rural Remedies */}
      {triage.supplements_or_remedies && triage.supplements_or_remedies.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-amber-600" />
            <span>{currentLang === 'hi' ? 'अनुशंसित पूरक आहार व देसी उपचार' : 'Recommended Supplements & Village Remedies'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {triage.supplements_or_remedies.map((rem, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs font-medium text-amber-950 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{rem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Actions Section */}
      <div className="border-t border-slate-200 pt-5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center sm:text-left">
          Incident Resolution Feedback (घटना की स्थिति दर्ज करें):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={resolving || status === 'SATISFIED'}
            onClick={() => handleResolve('SATISFIED')}
            className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 ${
              status === 'SATISFIED'
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
            }`}
          >
            {resolving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>
              {status === 'SATISFIED' ? '✓ Marked as Satisfied' : 'Satisfied (Follow Home Care)'}
            </span>
          </button>

          <button
            type="button"
            disabled={resolving || status === 'ACTION_REQUIRED'}
            onClick={() => handleResolve('ACTION_REQUIRED')}
            className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 ${
              status === 'ACTION_REQUIRED'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 cursor-default'
                : 'bg-white border-2 border-rose-600 text-rose-700 hover:bg-rose-50 shadow-sm'
            }`}
          >
            {resolving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>
              {status === 'ACTION_REQUIRED' ? '🚨 Action Required (Escalated)' : 'Action Required (Escalate to Vet)'}
            </span>
          </button>
        </div>

        {onReportNewIssue && (
          <div className="text-center mt-4">
            <button
              onClick={onReportNewIssue}
              className="text-xs text-slate-500 hover:text-emerald-700 font-medium underline underline-offset-4"
            >
              + Report Another Observation for this Animal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
