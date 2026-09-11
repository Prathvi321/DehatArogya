import React, { useState } from 'react';
import { PlusCircle, Loader2, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import { registerAnimal } from '../api';
import EarTagCard from './EarTagCard';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      setError('Please provide the animal name and age.');
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

  return (
    <div className="max-w-xl mx-auto">
      {createdAnimal ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Animal Registered Successfully!</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Digital Ear Tag Generated
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
              Tag ID <strong className="font-mono text-emerald-700">{createdAnimal.tag_id}</strong> is permanently assigned to {createdAnimal.name}. Print this tag or scan to report issues.
            </p>
          </div>

          {/* Printable Ear Tag Card */}
          <EarTagCard animal={createdAnimal} onDiagnoseNow={onDiagnoseNow} />

          <div className="text-center pt-2 no-print">
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-emerald-700 font-medium underline underline-offset-4"
            >
              + Register Another Animal
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Register New Livestock
              </h2>
              <p className="text-xs text-slate-500">
                No login required. Instantly generates a printable physical QR ear-tag.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Animal Species Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Livestock Species (पशु का प्रकार) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SPECIES_OPTIONS.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, animal_type: sp.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      formData.animal_type === sp.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl mb-1">{sp.icon}</span>
                    <span className="text-xs font-semibold">{sp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name and Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Animal Name (नाम) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gauri, Lakshmi, Raja"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age in Years (उम्र) *
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender (लिंग) *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Female', 'Male'].map((g) => (
                  <label
                    key={g}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      formData.gender === g
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Village / Gram (गाँव)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rampur, Shivpuri"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Owner Phone (फ़ोन नंबर)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.owner_phone}
                  onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Tag & QR Code...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>Register & Generate Digital Ear Tag</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
