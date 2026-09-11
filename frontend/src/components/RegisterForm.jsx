import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Loader2, Sparkles, CheckCircle2, QrCode, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerAnimal } from '../api';
import EarTagCard from './EarTagCard';
import { bounceTap, modalPop, staggerFadeIn } from '../utils/animations';

const SPECIES_OPTIONS = [
  { id: 'Cow', label: 'Cow (गाय)', icon: '🐄' },
  { id: 'Buffalo', label: 'Buffalo (भैंस)', icon: '🐃' },
  { id: 'Goat', label: 'Goat (बकरी)', icon: '🐐' },
  { id: 'Sheep', label: 'Sheep (भेड़)', icon: '🐑' },
];

export default function RegisterForm({ onAnimalRegistered, onDiagnoseNow }) {
  const [formData, setFormData] = useState({
    name: '',
    animal_type: 'Cow',
    gender: 'Female',
    age: '',
    owner_phone: '',
    village: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdAnimal, setCreatedAnimal] = useState(null);
  const resultCardRef = useRef(null);
  const formCardRef = useRef(null);

  useEffect(() => {
    if (createdAnimal && resultCardRef.current) {
      modalPop(resultCardRef.current);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else if (!createdAnimal && formCardRef.current) {
      staggerFadeIn('.register-anim-item', { startDelay: 50, stagger: 45 });
    }
  }, [createdAnimal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      setError('Please enter the animal name and age.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        animal_type: formData.animal_type,
        gender: formData.gender,
        age: parseFloat(formData.age),
        owner_phone: formData.owner_phone.trim() || null,
        village: formData.village.trim() || null,
      };

      const result = await registerAnimal(payload);
      setCreatedAnimal(result);
      if (onAnimalRegistered) {
        onAnimalRegistered(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to register animal. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedAnimal(null);
    setFormData({
      name: '',
      animal_type: 'Cow',
      gender: 'Female',
      age: '',
      owner_phone: '',
      village: '',
    });
    setError(null);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {createdAnimal ? (
        <div ref={resultCardRef} className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Official Digital Tag Minted</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              Livestock Registered Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
              Tag ID <strong className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{createdAnimal.tag_id}</strong> is permanently assigned to {createdAnimal.name}.
            </p>
          </div>

          {/* Printable Ear Tag Card */}
          <EarTagCard animal={createdAnimal} onDiagnoseNow={onDiagnoseNow} />

          <div className="text-center pt-3 no-print">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-bold px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Another Animal</span>
            </button>
          </div>
        </div>
      ) : (
        <div ref={formCardRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Registration Form */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-card-elevated border border-emerald-950/10 register-anim-item">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 leading-tight">
                  Register Livestock
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Instant offline QR ear tag generation • No password required
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Animal Species Selectors */}
              <div className="register-anim-item">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Livestock Species (पशु का प्रकार) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SPECIES_OPTIONS.map((sp) => {
                    const isSelected = formData.animal_type === sp.id;
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={(e) => {
                          bounceTap(e.currentTarget);
                          setFormData({ ...formData, animal_type: sp.id });
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-3xl mb-1 filter drop-shadow-xs">{sp.icon}</span>
                        <span className="text-xs font-bold leading-tight">{sp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name and Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 register-anim-item">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Animal Name (नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gauri, Lakshmi, Raja"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input-light text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Age in Years (उम्र) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    max="30"
                    required
                    placeholder="e.g. 3.5"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input-light text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="register-anim-item">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  4. Gender (लिंग) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Female', 'Male'].map((g) => (
                    <label
                      key={g}
                      onClick={(e) => bounceTap(e.currentTarget)}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all duration-200 ${
                        formData.gender === g
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="sr-only"
                      />
                      <span>{g === 'Female' ? '♀ Female (मादा)' : '♂ Male (नर)'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Village and Owner Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 register-anim-item">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    5. Village / Gram (गाँव)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rampur, Shivpuri"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input-light text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    6. Owner Phone (फ़ोन नंबर)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.owner_phone}
                    onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input-light text-sm font-mono font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 register-anim-item">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => bounceTap(e.currentTarget)}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Minting Physical Digital Ear Tag...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      <span>Register & Generate Digital Ear Tag</span>
                      <ArrowRight className="w-4 h-4 opacity-70" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Interactive Live Ear-Tag Preview Sidecar */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 via-amber-100/40 to-emerald-50 rounded-3xl p-6 border border-amber-200/60 shadow-xs register-anim-item">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Live Tag Simulation Preview</span>
            </div>

            {/* Ear Tag Mini Silhouette Card */}
            <div className="w-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-3xl p-5 shadow-tag border-2 border-amber-500/80 text-slate-950 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] sheen-card">
              {/* Rivet Grommet */}
              <div className="flex justify-center mb-2">
                <div className="w-7 h-7 rounded-full brass-grommet flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
                </div>
              </div>

              <div className="text-center border-b border-amber-600/30 pb-2 mb-3">
                <div className="text-[9px] tracking-widest font-black uppercase text-amber-950/80">
                  DEHAT AROGYA • LIVESTOCK ID
                </div>
                <div className="text-xl font-mono font-black tracking-wider text-slate-950 mt-0.5 bg-amber-200/60 py-0.5 px-3 rounded-lg inline-block border border-amber-600/30">
                  TAG-SIMULATED
                </div>
              </div>

              {/* QR Code Placeholder with animated scan line */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-600/30 flex flex-col items-center justify-center mb-3">
                <div className="w-28 h-28 rounded-xl bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-white relative overflow-hidden">
                  <QrCode className="w-16 h-16 text-emerald-400 opacity-90" />
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-75"></div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-1.5 font-mono">
                  LAN Fast-Scan Ready
                </span>
              </div>

              {/* Tag Animal Info */}
              <div className="bg-amber-100/90 rounded-xl p-2.5 text-xs text-amber-950 space-y-1 border border-amber-600/20">
                <div className="flex justify-between items-center font-bold">
                  <span className="flex items-center gap-1.5 text-sm">
                    <span>{getSpeciesEmoji(formData.animal_type)}</span>
                    <span className="truncate max-w-[120px]">
                      {formData.name.trim() || 'Your Animal'}
                    </span>
                  </span>
                  <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[10px] font-bold">
                    {formData.animal_type}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-amber-900/80">
                  <span>{formData.gender} • {formData.age || '0'} yrs</span>
                  <span>{formData.village || 'Local Ward'}</span>
                </div>
              </div>

              <div className="mt-2 text-center text-[8px] font-mono text-amber-950/60">
                OFFLINE-FIRST RFID/QR STANDARD
              </div>
            </div>

            <p className="text-[11.5px] text-amber-900/70 mt-4 leading-relaxed font-medium">
              💡 <strong>Instant Field Tagging:</strong> Once registered, print or save the QR ear-tag. When scanned by anyone with a phone camera, it instantly connects to AI triage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
