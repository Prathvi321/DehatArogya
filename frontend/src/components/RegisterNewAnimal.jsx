import React, { useState, useRef } from 'react';
import { Camera, MapPin, X, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerAnimal } from '../api';
import EarTagCard from './EarTagCard';

export default function RegisterNewAnimal({
  onAnimalRegistered,
  onDiagnoseNow,
  onBack
}) {
  const [formData, setFormData] = useState({
    name: 'Gauri',
    animal_type: 'Cow',
    gender: 'Female',
    age: 3.5,
    ageUnit: 'Years',
    owner_phone: '9876543210',
    village: 'Rampur',
    additional_notes: ''
  });

  const [photoPreview, setPhotoPreview] = useState('/images/cow1.png');
  const [useGps, setUseGps] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showLocationNotice, setShowLocationNotice] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registeredResult, setRegisteredResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setUseGps(true);
        setGpsLoading(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        setGpsLoading(false);
        // Fallback demo coordinates in Sehore, MP
        setGpsCoordinates({ latitude: 23.2031, longitude: 77.0844 });
        setUseGps(true);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        animal_type: formData.animal_type,
        gender: formData.gender,
        age: parseFloat(formData.age) || 1.0,
        owner_phone: formData.owner_phone.trim(),
        village: formData.village,
        latitude: gpsCoordinates?.latitude || null,
        longitude: gpsCoordinates?.longitude || null,
      };

      const result = await registerAnimal(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Augment result with photo and details
      const completeAnimal = {
        ...result,
        gender: formData.gender,
        image: photoPreview || '/images/cow1.png',
        owner_name: 'Ram Kishan',
        district: 'Sehore (MP)',
        status: 'Healthy',
        medical_history: []
      };

      setRegisteredResult(completeAnimal);
      if (onAnimalRegistered) {
        onAnimalRegistered(completeAnimal);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'Registration failed. Please check network.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already registered, show the EarTagCard view with instant print/diagnose options
  if (registeredResult) {
    return (
      <div className="max-w-xl mx-auto space-y-4 pb-20">
        <div className="bg-emerald-800 text-white p-5 rounded-3xl text-center space-y-2 shadow-md">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-emerald-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-bold">
            Animal Tag Generated Successfully!
          </h2>
          <p className="text-xs text-emerald-100 max-w-sm mx-auto">
            {registeredResult.name} has been issued official UID{' '}
            <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
              {registeredResult.tag_id}
            </span>
          </p>
        </div>

        <EarTagCard
          tagId={registeredResult.tag_id}
          name={registeredResult.name}
          species={registeredResult.animal_type}
          age={registeredResult.age}
          village={registeredResult.village}
          ownerPhone={registeredResult.owner_phone}
          qrBase64={registeredResult.qr_code_base64}
          qrUrl={registeredResult.qr_url}
        />

        <div className="flex gap-3">
          <button
            onClick={() => onDiagnoseNow(registeredResult.tag_id)}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-2xl shadow-sm transition-transform active:scale-95 text-center"
          >
            Start Health Diagnosis
          </button>
          <button
            onClick={onBack}
            className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-2xl transition-colors text-center"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* Title & Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900">
            Register New Animal
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Add your animal's details to generate a unique QR tag and keep track of its health.
          </p>
        </div>

        {/* Top Right Illustration Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-2xl">
          <img src="/images/cow1.png" alt="Cow" className="w-9 h-9 object-contain" />
          <div className="text-right">
            <span className="block text-[10px] font-bold text-emerald-900 leading-tight">Healthy Animals</span>
            <span className="block text-[9px] font-medium text-emerald-700 leading-tight">Happier Farmers</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
        {/* Animal Photo (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Animal Photo (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-600 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/70 hover:bg-emerald-50/40 transition-colors h-28"
            >
              <Camera className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-xs font-bold text-slate-700">Tap to upload photo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">You can take a photo or choose from gallery</p>
            </div>

            {photoPreview && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center">
                <img
                  src={photoPreview}
                  alt="Animal Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Remove Photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 1: Name and Species */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Animal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Gauri"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Species / Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.animal_type}
              onChange={(e) => {
                const nextType = e.target.value;
                setFormData({ ...formData, animal_type: nextType });
                if (!photoPreview || photoPreview === '/images/cow1.png') {
                  if (nextType === 'Buffalo') setPhotoPreview('/images/buffalo.jpg');
                  else if (nextType === 'Goat') setPhotoPreview('/images/goat.jpg');
                  else setPhotoPreview('/images/cow1.png');
                }
              }}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
            >
              <option value="Cow">Cow</option>
              <option value="Buffalo">Buffalo</option>
              <option value="Goat">Goat</option>
              <option value="Sheep">Sheep</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 2: Gender and Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gender <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                min="0.1"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-1/2 px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
              />
              <select
                value={formData.ageUnit}
                onChange={(e) => setFormData({ ...formData, ageUnit: e.target.value })}
                className="w-1/2 px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
              >
                <option value="Years">Years</option>
                <option value="Months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Owner Phone Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Owner's Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.owner_phone}
            onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
            placeholder="e.g. 9876543210"
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
          />
        </div>

        {/* Row 4: Village & Current Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Village / Location <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
            >
              <option value="Rampur">Rampur</option>
              <option value="Sehore">Sehore</option>
              <option value="Bilkisganj">Bilkisganj</option>
              <option value="Ashta">Ashta</option>
              <option value="Ichhawar">Ichhawar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Location (Optional)
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gpsLoading}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                useGps
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              ) : (
                <MapPin className="w-4 h-4 text-emerald-700" />
              )}
              <span>{useGps ? 'GPS Captured ✓' : 'Use My Current Location'}</span>
            </button>
          </div>
        </div>

        {/* Location Info Callout */}
        {showLocationNotice && (
          <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-3 flex items-start justify-between gap-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">Location will help in better assistance</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Your area helps us connect you with nearby veterinary support.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowLocationNotice(false)}
              className="text-emerald-700 hover:text-emerald-900 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Additional Notes (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            rows="2"
            value={formData.additional_notes}
            onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
            placeholder="Any other information about your animal..."
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
          />
        </div>

        {/* Register Animal Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-display font-bold text-sm rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Secure Ear Tag...</span>
            </>
          ) : (
            <span>Register Animal</span>
          )}
        </button>
      </form>
    </div>
  );
}
