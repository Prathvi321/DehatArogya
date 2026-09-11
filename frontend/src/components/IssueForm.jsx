import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, AlertCircle, Loader2, Volume2, Globe, MapPin, Navigation, RefreshCw } from 'lucide-react';

const COMMON_SYMPTOMS = [
  { en: 'High Fever', hi: 'तेज बुखार' },
  { en: 'Mouth Blisters / Drooling', hi: 'मुंह में छाले / लार बहना' },
  { en: 'Loss of Appetite', hi: 'खाना न खाना' },
  { en: 'Lethargy & Shivering', hi: 'सुस्ती / कांपना' },
  { en: 'Watery Diarrhea', hi: 'पतला दस्त' },
  { en: 'Swollen Udder / Teats', hi: 'थन में सूजन' },
  { en: 'Cough & Heavy Breathing', hi: 'खांसी व सांस में तकलीफ' },
  { en: 'Limping / Foot Sores', hi: 'लंगड़ाना / पैर में घाव' },
  { en: 'Drop in Milk Yield', hi: 'दूध कम होना' },
];

export default function IssueForm({ animal, onSubmitSymptoms, loading }) {
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState('hi-IN'); // 'hi-IN' or 'en-IN'
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // GPS Geolocation state
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle', 'requesting', 'acquired', 'error'
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);

  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    setGpsStatus('requesting');
    setGpsErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGpsStatus('acquired');
      },
      (err) => {
        console.warn('GPS position error:', err);
        setGpsStatus('error');
        setGpsErrorMsg(
          err.code === 1
            ? 'Location access denied by user.'
            : 'Unable to retrieve location coordinates.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    // Automatically attempt GPS capture on mobile when issue reporting screen opens
    requestGpsLocation();

    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;

      recog.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSymptoms((prev) => {
          const separator = prev.length && !prev.endsWith(' ') ? ' ' : '';
          return prev + separator + currentTranscript;
        });
      };

      recog.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = speechLang;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const addSymptomChip = (chip) => {
    const textToAdd = speechLang === 'hi-IN' ? chip.hi : chip.en;
    setSymptoms((prev) => {
      if (!prev.trim()) return textToAdd;
      if (prev.includes(textToAdd)) return prev;
      return `${prev.trim()}, ${textToAdd}`;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim() || loading) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    onSubmitSymptoms(
      symptoms.trim(),
      gpsCoords ? gpsCoords.lat : null,
      gpsCoords ? gpsCoords.lng : null
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Describe Health Symptoms</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              AI Triage
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Explain observations in plain Hindi or English. Voice input supported.
          </p>
        </div>

        {/* Speech Language Switcher */}
        {speechSupported && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSpeechLang('hi-IN')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                speechLang === 'hi-IN'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setSpeechLang('en-IN')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                speechLang === 'en-IN'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Symptom Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Quick-Select Common Signs (शीघ्र लक्षण चयन):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SYMPTOMS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addSymptomChip(chip)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-medium rounded-lg transition-all active:scale-95"
              >
                + {speechLang === 'hi-IN' ? chip.hi : chip.en}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea with embedded mic button */}
        <div className="relative">
          <textarea
            rows={4}
            required
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={
              speechLang === 'hi-IN'
                ? "पशु के लक्षण बताएं (जैसे: 2 दिन से तेज बुखार है, मुंह से लार गिर रही है और चारा नहीं खा रही है)..."
                : "Describe symptoms (e.g., cow has high fever, drooling, blisters in mouth, not chewing cud)..."
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400 pr-12 leading-relaxed"
          />

          {/* Voice Input Mic Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              title={isRecording ? 'Stop Recording' : `Speak in ${speechLang === 'hi-IN' ? 'Hindi' : 'English'}`}
              className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all shadow-sm ${
                isRecording
                  ? 'bg-red-500 text-white recording-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile GPS Location Capture Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              gpsStatus === 'acquired'
                ? 'bg-emerald-500 shadow-xs ring-2 ring-emerald-300 animate-pulse'
                : gpsStatus === 'requesting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-300'
            }`} />
            <div className="truncate">
              {gpsStatus === 'acquired' && gpsCoords ? (
                <span className="text-slate-800 font-medium">
                  <strong className="text-emerald-700">GPS Tagged:</strong> {gpsCoords.lat.toFixed(4)}°, {gpsCoords.lng.toFixed(4)}°
                  {gpsCoords.accuracy ? ` (±${Math.round(gpsCoords.accuracy)}m)` : ''}
                </span>
              ) : gpsStatus === 'requesting' ? (
                <span className="text-amber-700 font-medium">
                  Acquiring Mobile GPS location...
                </span>
              ) : (
                <span className="text-slate-500">
                  {gpsErrorMsg || 'Mobile GPS Location (Optional for Vet Map routing)'}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={requestGpsLocation}
            disabled={gpsStatus === 'requesting'}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all"
            title="Refresh GPS Coordinates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'requesting' ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>

        {/* Submit Triage Button */}
        <button
          type="submit"
          disabled={loading || !symptoms.trim()}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing with Gemini 2.5 Flash Triage...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Analyze & Generate Triage Advice</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
