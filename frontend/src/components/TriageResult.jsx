import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Stethoscope, 
  Home, 
  Pill, 
  Loader2,
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { resolveIncident } from '../api';
import { bounceTap, animateRiskGauge, staggerFadeIn } from '../utils/animations';

export default function TriageResult({ diagnosis, onResolutionUpdated, onReportNewIssue }) {
  const [currentLang, setCurrentLang] = useState('en'); // 'en' or 'hi'
  const [resolving, setResolving] = useState(false);
  const [status, setStatus] = useState(diagnosis?.user_status || 'PENDING');
  const [toastMsg, setToastMsg] = useState(null);
  const gaugeBarRef = useRef(null);

  const riskLevel = diagnosis?.triage?.risk_level;

  // Animate the risk gauge bar with anime.js on mount
  useEffect(() => {
    if (!diagnosis?.triage) return;
    let targetPercent = 25;
    if (riskLevel === 'HIGH') targetPercent = 95;
    else if (riskLevel === 'MEDIUM') targetPercent = 60;

    if (gaugeBarRef.current) {
      animateRiskGauge(gaugeBarRef.current, targetPercent);
    }
    staggerFadeIn('.triage-anim-section', { startDelay: 40, stagger: 50 });
  }, [riskLevel, diagnosis?.triage]);

  if (!diagnosis || !diagnosis.triage) return null;
  const { triage, animal_name, animal_type, tag_id, history_id } = diagnosis;

  const handleResolve = async (newStatus, e) => {
    if (e) bounceTap(e.currentTarget);
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
        setToastMsg('Marked as Resolved. Care routine noted in health history.');
      } else {
        setToastMsg('Escalated to Veterinary Officer. Incident flagged in jurisdiction queue.');
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
          bg: 'bg-rose-500',
          gradient: 'from-rose-500 to-red-700',
          gaugeGradient: 'bg-gradient-to-r from-amber-400 via-rose-500 to-red-600',
          text: 'text-rose-700',
          label: 'HIGH RISK (अत्यधिक जोखिम)',
          desc: 'Immediate medical danger or contagious infection suspected',
          percentage: '95%'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500',
          gradient: 'from-amber-500 to-amber-700',
          gaugeGradient: 'bg-gradient-to-r from-emerald-400 via-amber-400 to-amber-500',
          text: 'text-amber-800',
          label: 'MEDIUM RISK (मध्यम जोखिम)',
          desc: 'Moderate illness requiring active care & daily monitoring',
          percentage: '60%'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500',
          gradient: 'from-emerald-500 to-teal-700',
          gaugeGradient: 'bg-gradient-to-r from-emerald-300 to-emerald-500',
          text: 'text-emerald-800',
          label: 'LOW RISK (कम जोखिम)',
          desc: 'Mild health anomaly manageable with supportive home care',
          percentage: '25%'
        };
    }
  };

  const riskInfo = getRiskDetails(triage.risk_level);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-card-elevated border border-emerald-950/10 space-y-6 select-none">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Risk Level & Disease */}
      <div className="triage-anim-section">
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-white text-xs font-heading font-black tracking-wide uppercase shadow-sm ${riskInfo.bg}`}>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>{riskInfo.label}</span>
            </span>

            {/* Resolution Status Chip */}
            {status !== 'PENDING' && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                status === 'SATISFIED' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}>
                {status === 'SATISFIED' ? '✓ Resolved in Field' : '🚨 Escalated to Vet'}
              </span>
            )}
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold border border-slate-200/80">
            <button
              type="button"
              onClick={(e) => {
                bounceTap(e.currentTarget);
                setCurrentLang('en');
              }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={(e) => {
                bounceTap(e.currentTarget);
                setCurrentLang('hi');
              }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                currentLang === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 leading-tight">
          {triage.detected_disease}
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Assessed condition for <strong className="text-slate-900">{animal_name}</strong> ({animal_type}, Tag: <span className="font-mono font-bold text-emerald-700">{tag_id}</span>)
        </p>

        {/* Dynamic Anime.js Severity Risk Gauge Meter */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex justify-between text-[11px] font-bold mb-1.5">
            <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>Condition Severity Dial:</span>
            </span>
            <span className={`font-mono ${riskInfo.text}`}>{riskInfo.desc}</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div 
              ref={gaugeBarRef}
              className={`h-full rounded-full transition-all duration-700 ${riskInfo.gaugeGradient}`}
              style={{ width: '0%' }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1 px-1">
            <span>MILD / STABLE</span>
            <span>MODERATE RISK</span>
            <span>CRITICAL PATHOLOGY</span>
          </div>
        </div>
      </div>

      {/* Specialist Banner vs Home Care Banner */}
      <div className="triage-anim-section">
        {triage.requires_specialist ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-100/40 to-white border-2 border-rose-300 flex items-start gap-3.5 shadow-xs">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5 shadow-md shadow-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-rose-950">
                {currentLang === 'hi' ? '🚨 पशु चिकित्सक (स्पेशलिस्ट) की तुरंत आवश्यकता है' : '🚨 Requires Urgent Specialist Vet Inspection'}
              </h4>
              <p className="text-xs text-rose-900/90 mt-1 leading-relaxed font-medium">
                {currentLang === 'hi' 
                  ? 'यह लक्षण गंभीर या संक्रामक रोग का संकेत देते हैं। प्राथमिक उपचार के साथ-साथ निकटतम पशु चिकित्सालय में संपर्क करें।'
                  : 'These clinical signs point to potentially severe or contagious pathology. Provide supportive care below and ensure veterinary examination.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-white border border-emerald-300 flex items-start gap-3.5 shadow-xs">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-md shadow-emerald-600/30">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-emerald-950">
                {currentLang === 'hi' ? '🌿 प्राथमिक घरेलू देखभाल व निगरानी पर्याप्त है' : '🌿 Home Care & Field Monitoring Recommended'}
              </h4>
              <p className="text-xs text-emerald-900/90 mt-1 leading-relaxed font-medium">
                {currentLang === 'hi'
                  ? 'स्थिति नियंत्रण योग्य है। नीचे दिए गए दैनिक आहार और उपचार का पालन करें। 48 घंटे में सुधार न होने पर डॉक्टर को दिखाएं।'
                  : 'Condition is currently manageable with supportive hygiene, hydration, and nutritional care. Monitor closely over 48 hours.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Identified Symptoms */}
      {triage.identified_symptoms && triage.identified_symptoms.length > 0 && (
        <div className="triage-anim-section">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {currentLang === 'hi' ? 'पहचाने गए लक्षण (Observed Signs)' : 'Identified Clinical Signs'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {triage.identified_symptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-100/90 text-slate-800 text-xs font-bold rounded-xl border border-slate-200"
              >
                • {sym}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Diet & Routine Guidance Box */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 triage-anim-section">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>{currentLang === 'hi' ? 'दैनिक देखभाल व आहार निर्देश (Care Routine)' : 'Diet & Routine Care Protocol'}</span>
        </h4>
        <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans font-medium">
          {currentLang === 'hi' ? triage.diet_and_routine_hi : triage.diet_and_routine_en}
        </p>
      </div>

      {/* Recommended Supplements / Rural Remedies */}
      {triage.supplements_or_remedies && triage.supplements_or_remedies.length > 0 && (
        <div className="triage-anim-section">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-amber-600" />
            <span>{currentLang === 'hi' ? 'अनुशंसित पूरक आहार व देसी उपचार' : 'Recommended Herbal Supplements & Village Remedies'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {triage.supplements_or_remedies.map((rem, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs font-semibold text-amber-950 flex items-start gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{rem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Actions Section */}
      <div className="border-t border-slate-200/80 pt-5 triage-anim-section">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center sm:text-left">
          Incident Resolution Feedback (घटना की स्थिति दर्ज करें):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={resolving || status === 'SATISFIED'}
            onClick={(e) => handleResolve('SATISFIED', e)}
            className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              status === 'SATISFIED'
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 cursor-default shadow-xs'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25'
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
            onClick={(e) => handleResolve('ACTION_REQUIRED', e)}
            className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              status === 'ACTION_REQUIRED'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 cursor-default shadow-xs'
                : 'bg-white border-2 border-rose-600 text-rose-700 hover:bg-rose-50 shadow-xs'
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
              onClick={(e) => {
                bounceTap(e.currentTarget);
                onReportNewIssue();
              }}
              className="text-xs text-slate-500 hover:text-emerald-700 font-bold underline underline-offset-4 cursor-pointer"
            >
              + Report Another Observation for this Animal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
