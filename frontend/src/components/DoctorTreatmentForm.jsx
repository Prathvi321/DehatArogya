import React, { useState, useRef } from 'react';
import { 
  Stethoscope, Calendar, Clock, Plus, X, Camera, 
  CheckCircle2, Pill, Loader2, Image as ImageIcon 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitVetAction } from '../api';

export default function DoctorTreatmentForm({
  patient,
  onSubmitTreatment,
  onBack
}) {
  const [visitDate, setVisitDate] = useState('2024-09-14');
  const [visitTime, setVisitTime] = useState('10:15 AM');
  const [diagnosis, setDiagnosis] = useState('Bacterial skin infection (Lumpy skin disease - suspected).');
  const [treatmentGiven, setTreatmentGiven] = useState(
    'Injected long-acting antibiotic (Oxytetracycline 20 ml), anti-inflammatory (Meloxicam 10 ml). Advised topical antiseptic wash.'
  );
  const [medicines, setMedicines] = useState([
    { name: 'Oxytetracycline Injection', dosage: '20 ml' },
    { name: 'Meloxicam Injection', dosage: '10 ml' }
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [showAddMedRow, setShowAddMedRow] = useState(false);

  const [treatmentImages, setTreatmentImages] = useState([
    '/images/cow1.png',
    '/images/cow4.png'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!patient) return null;

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (newMedName.trim()) {
      setMedicines([
        ...medicines,
        { name: newMedName.trim(), dosage: newMedDosage.trim() || 'Standard dose' }
      ]);
      setNewMedName('');
      setNewMedDosage('');
      setShowAddMedRow(false);
    }
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTreatmentImages([...treatmentImages, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const treatmentRecord = {
      date: visitDate,
      time: visitTime,
      diagnosis: diagnosis.trim(),
      treatment_given: treatmentGiven.trim(),
      medicines: medicines,
      photos: treatmentImages,
      treated_by: 'Dr. S. Sharma',
      status: 'Treated'
    };

    try {
      // Save to backend database if history_id exists
      if (patient.id) {
        const fullNotes = `${diagnosis}\nTreatment: ${treatmentGiven}\nRx: ${medicines.map(m => `${m.name} (${m.dosage})`).join(', ')}`;
        await submitVetAction(patient.id, 'TREATED', fullNotes).catch(() => {});
      }
    } catch (err) {
      console.warn('Backend sync note:', err);
    }

    // Confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitting(false);
    onSubmitTreatment(treatmentRecord);
  };

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* 1. Patient Profile Summary Card (Screenshot 4) */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center gap-3.5">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square">
          <img
            src={patient.image || '/images/cow1.png'}
            alt={patient.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.src = '/images/cow1.png'; }}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-black text-slate-900 text-lg leading-tight truncate">
              {patient.name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              Under Treatment
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {patient.animal_type} • {patient.age} years • {patient.gender || 'Female'}
          </p>

          <p className="text-xs font-mono font-bold text-emerald-800">
            Tag ID: {patient.tag_id}
          </p>

          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Owner:</span> {patient.owner_name} ({patient.owner_phone})
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            📍 {patient.location?.address || patient.village || 'Rampur, Sehore (MP)'}
          </p>
        </div>
      </div>

      {/* 2. Visit Scheduled Banner (Screenshot 4) */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-emerald-900">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Visit Scheduled</span>
        </span>
        <span className="text-emerald-800 font-mono text-[11px]">
          {patient.scheduled_visit?.date || '14 Sep 2024'}, {patient.scheduled_visit?.time || '10:00 AM'}
        </span>
      </div>

      {/* 3. Treatment Details Form (Screenshot 4) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
        
        {/* Header & Visit Date & Time */}
        <div className="border-b border-slate-100 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-800 stroke-[2.3px]" />
              <span>Treatment Details</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Visit Date & Time</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none w-full"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis * */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Diagnosis <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="2"
            required
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Treatment Given * */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Treatment Given <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="3"
            required
            value={treatmentGiven}
            onChange={(e) => setTreatmentGiven(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Medicines Used (Screenshot 4) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-emerald-700" />
              <span>Medicines Used</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddMedRow(!showAddMedRow)}
              className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>

          {/* List of Medicines with remove button */}
          <div className="space-y-1.5">
            {medicines.map((med, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs"
              >
                <span className="font-semibold text-slate-800">{med.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {med.dosage}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    title="Remove medicine"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Inline Add Medicine Row */}
          {showAddMedRow && (
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Belamyl)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 10 ml IM)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedRow(false)}
                  className="px-3 py-1 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-3 py-1 bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Add to Rx
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Treatment Images (Optional) (Screenshot 4) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Upload Treatment Images (Optional)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="grid grid-cols-3 gap-2">
            {treatmentImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                <img src={img} alt="treatment" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setTreatmentImages(treatmentImages.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add Photos Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-600 bg-slate-50 flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:bg-emerald-50/50 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-600">Add Photos</span>
            </div>
          </div>
        </div>

        {/* Submit Button: Mark as Treated (Screenshot 4) */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-display font-extrabold text-sm rounded-2xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          <span>Mark as Treated</span>
        </button>
      </form>

    </div>
  );
}
