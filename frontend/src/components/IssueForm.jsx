import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, AlertCircle, Loader2, Volume2, Globe, MapPin, Navigation, RefreshCw, Activity, Camera, Image as ImageIcon, X } from 'lucide-react';
import { bounceTap, animateWaveform } from '../utils/animations';

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
  const waveContainerRef = useRef(null);

  // Condition image and audio evidence state
  const [conditionImage, setConditionImage] = useState(null);
  const [audioTranscript, setAudioTranscript] = useState('');
  const photoInputRef = useRef(null);

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

  // Control the anime.js waveform whenever recording status changes
  useEffect(() => {
    if (waveContainerRef.current) {
      animateWaveform(waveContainerRef.current, isRecording);
    }
  }, [isRecording]);

  const toggleRecording = (e) => {
    if (e) bounceTap(e.currentTarget);
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

  const addSymptomChip = (e, chip) => {
    bounceTap(e.currentTarget);
    const textToAdd = speechLang === 'hi-IN' ? chip.hi : chip.en;
    setSymptoms((prev) => {
      if (!prev.trim()) return textToAdd;
      if (prev.includes(textToAdd)) return prev;
      return `${prev.trim()}, ${textToAdd}`;
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConditionImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      gpsCoords ? gpsCoords.lng : null,
      conditionImage,
      audioTranscript || symptoms.trim()
    );
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-card-elevated border border-emerald-950/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-heading font-black text-slate-900 flex items-center gap-2">
              <span>Describe Health Symptoms</span>
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              AI CLINICAL TRIAGE
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Voice or text input supported in Hindi & English • Auto-routed to local vet
          </p>
        </div>

        {/* Speech Language Switcher */}
        {speechSupported && (
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto border border-slate-200/80">
            <button
              type="button"
              onClick={(e) => {
                bounceTap(e.currentTarget);
                setSpeechLang('hi-IN');
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                speechLang === 'hi-IN'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              onClick={(e) => {
                bounceTap(e.currentTarget);
                setSpeechLang('en-IN');
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                speechLang === 'en-IN'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
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
                onClick={(e) => addSymptomChip(e, chip)}
                className="px-3 py-1.5 bg-slate-50/80 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                + {speechLang === 'hi-IN' ? chip.hi : chip.en}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea with embedded mic button & anime.js soundwave visualizer */}
        <div className="relative rounded-2xl border border-slate-300/80 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all bg-white overflow-hidden shadow-inner">
          <textarea
            rows={4}
            required
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={
              speechLang === 'hi-IN'
                ? "पशु के लक्षण बताएं (जैसे: 2 दिन से तेज बुखार है, मुंह में छाले हैं, चारा नहीं खा रही है)..."
                : "Describe observed signs (e.g. high temperature, blisters inside mouth, sudden drop in milk, limping)..."
            }
            className="w-full px-4 py-3 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 placeholder:font-normal leading-relaxed resize-none bg-transparent"
          />

          {/* Bottom Bar inside Textarea: Waveform & Mic */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-t border-slate-100">
            {/* Anime.js Audio Waveform Visualizer */}
            <div ref={waveContainerRef} className="flex items-center gap-1 h-7 px-2">
              <span className={`text-[10px] font-mono font-bold mr-2 ${isRecording ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`}>
                {isRecording ? 'RECORDING LIVE' : 'VOICE ENGINE'}
              </span>
              {[...Array(9)].map((_, i) => (
                <span 
                  key={i} 
                  className={`wave-bar ${isRecording ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ height: `${10 + (i % 3) * 6}px` }}
                />
              ))}
            </div>

            {/* Mic Toggle Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                title={isRecording ? 'Stop Recording' : `Speak in ${speechLang === 'hi-IN' ? 'Hindi' : 'English'}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-white shadow-rose-500/30 recording-pulse'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
                <span>{isRecording ? 'Stop' : 'Voice Input'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile GPS Location Capture Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              gpsStatus === 'acquired'
                ? 'bg-emerald-500 shadow-xs ring-2 ring-emerald-300 animate-pulse'
                : gpsStatus === 'requesting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-300'
            }`} />
            <div className="truncate">
              {gpsStatus === 'acquired' && gpsCoords ? (
                <span className="text-slate-800 font-bold font-mono">
                  <span className="text-emerald-700 font-sans">📍 GPS Pinned:</span> {gpsCoords.lat.toFixed(4)}°, {gpsCoords.lng.toFixed(4)}°
                  {gpsCoords.accuracy ? ` (±${Math.round(gpsCoords.accuracy)}m)` : ''}
                </span>
              ) : gpsStatus === 'requesting' ? (
                <span className="text-amber-700 font-semibold animate-pulse">
                  Acquiring Mobile GPS location...
                </span>
              ) : (
                <span className="text-slate-500 font-medium">
                  {gpsErrorMsg || 'Mobile GPS Coordinates (Helps veterinary officer navigate to your location)'}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              bounceTap(e.currentTarget);
              requestGpsLocation();
            }}
            disabled={gpsStatus === 'requesting'}
            className="p-1.5 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
            title="Refresh GPS Coordinates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'requesting' ? 'animate-spin' : ''}`} />
            <span>GPS</span>
          </button>
        </div>

        {/* Condition Photo Attachment (Optional photo of lumps, wounds, sores) */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Attach Animal Condition Photo (लक्षण फोटो जोड़ें - ऐच्छिक):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Optional</span>
          </div>

          <input
            type="file"
            ref={photoInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {conditionImage ? (
            <div className="relative inline-block rounded-xl overflow-hidden border border-emerald-300 shadow-xs">
              <img
                src={conditionImage}
                alt="Condition Preview"
                className="w-24 h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => setConditionImage(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full py-2.5 px-3 border border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Photo of Affected Area / Animal</span>
            </button>
          )}
        </div>

        {/* Submit Triage Button */}
        <button
          type="submit"
          disabled={loading || !symptoms.trim()}
          onClick={(e) => bounceTap(e.currentTarget)}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing with Gemini Flash Veterinary AI...</span>
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
