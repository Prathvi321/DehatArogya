import React, { useState, useRef } from 'react';
import { 
  X, User, Phone, MapPin, Camera, Save, Stethoscope, 
  ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function FarmerProfileModal({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  totalRegistered,
  totalConcernsRaised,
  onTogglePortal,
  isDoctorPortal
}) {
  const [formData, setFormData] = useState({
    name: userProfile?.name || 'Ram Kishan',
    phone: userProfile?.phone || '9876543210',
    village: userProfile?.village || 'Rampur',
    district: userProfile?.district || 'Sehore',
    state: userProfile?.state || 'Madhya Pradesh',
    avatar: userProfile?.avatar || '/images/farmer_cow_hero.png'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 my-auto space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-base">
                Farmer Profile & Account
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage personal credentials & livestock holdings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Farmer Activity Analytics Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Registered Livestock
            </span>
            <span className="text-2xl font-display font-black text-emerald-950 block mt-0.5">
              {totalRegistered}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">Animals active in herd</span>
          </div>

          <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              Concerns Raised
            </span>
            <span className="text-2xl font-display font-black text-rose-900 block mt-0.5">
              {totalConcernsRaised}
            </span>
            <span className="text-[10px] text-rose-700 font-medium">Triage sessions logged</span>
          </div>
        </div>

        {/* Profile Avatar Upload */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
            <img
              src={formData.avatar || '/images/farmer_cow_hero.png'}
              alt={formData.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/farmer_cow_hero.png'; }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <p className="font-bold text-slate-900 text-sm">{formData.name}</p>
            <p className="text-xs text-slate-500 font-medium">Kisan ID: KCC-MP-SEH-88210</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] text-emerald-800 font-bold hover:underline mt-0.5 block"
            >
              Change Profile Photo
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Farmer Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Registered Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Village Location
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                District / State
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Details</span>
          </button>
        </form>

      </div>
    </div>
  );
}
