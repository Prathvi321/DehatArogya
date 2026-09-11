import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  PlusCircle, 
  QrCode, 
  Stethoscope, 
  Calendar, 
  Loader2, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getAllAnimals } from '../api';
import EarTagCard from './EarTagCard';
import { bounceTap, staggerFadeIn, modalPop } from '../utils/animations';

export default function LivestockDirectory({ onSelectAnimalForTriage, onNavigateRegister, hideRegisterBtn = false }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSpecies, setFilterSpecies] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForTag, setSelectedForTag] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    loadLivestock();
  }, []);

  useEffect(() => {
    if (!loading && animals.length > 0) {
      staggerFadeIn('.directory-animal-card', { startDelay: 40, stagger: 45 });
    }
  }, [loading, filterSpecies, searchQuery]);

  useEffect(() => {
    if (selectedForTag && modalRef.current) {
      modalPop(modalRef.current);
    }
  }, [selectedForTag]);

  const loadLivestock = async () => {
    setLoading(true);
    try {
      const data = await getAllAnimals();
      setAnimals(data || []);
    } catch (err) {
      console.error('Failed to load animals:', err);
    } finally {
      setLoading(false);
    }
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

  const filteredAnimals = animals.filter((a) => {
    const matchesSpecies = filterSpecies === 'ALL' || a.animal_type.toLowerCase() === filterSpecies.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery || 
      a.name.toLowerCase().includes(q) || 
      a.tag_id.toLowerCase().includes(q) ||
      (a.village && a.village.toLowerCase().includes(q));
    return matchesSpecies && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Ear Tag Modal Popup */}
      {selectedForTag && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div ref={modalRef} className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedForTag(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 font-bold text-lg p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <div className="pt-2">
              <EarTagCard 
                animal={selectedForTag} 
                onDiagnoseNow={() => {
                  const tag = selectedForTag.tag_id;
                  setSelectedForTag(null);
                  onSelectAnimalForTriage(tag);
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-emerald-950/10 shadow-card-elevated">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Livestock Herd Registry
            </h2>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {animals.length} Animals
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Instant digital ear tag inspection, QR printing, and past diagnostic records
          </p>
        </div>

        {!hideRegisterBtn && onNavigateRegister && (
          <button
            onClick={(e) => {
              bounceTap(e.currentTarget);
              onNavigateRegister();
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Livestock</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card-elevated space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by animal name, tag ID, or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input-light text-xs font-medium text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Species Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['ALL', 'Cow', 'Buffalo', 'Goat', 'Sheep'].map((sp) => {
            const isSelected = filterSpecies === sp;
            return (
              <button
                key={sp}
                type="button"
                onClick={(e) => {
                  bounceTap(e.currentTarget);
                  setFilterSpecies(sp);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sp === 'ALL' ? '🌐 All Species' : `${getSpeciesEmoji(sp)} ${sp}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Livestock Grid / List */}
      {loading ? (
        <div className="p-12 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">Loading livestock directory...</p>
        </div>
      ) : filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAnimals.map((animal) => (
            <div
              key={animal.tag_id}
              className="directory-animal-card bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-400 hover:shadow-card-elevated transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner">
                      {getSpeciesEmoji(animal.animal_type)}
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-slate-900 text-base leading-tight">
                        {animal.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {animal.animal_type} • {animal.gender} • {animal.age} yrs
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-black bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-300 shadow-xs">
                    {animal.tag_id}
                  </span>
                </div>

                <div className="text-[11.5px] text-slate-600 space-y-1 border-t border-slate-100 pt-2.5 mb-4">
                  <p>
                    <span className="text-slate-400 font-medium">Village / Loc:</span>{' '}
                    <strong className="text-slate-800">{animal.village || 'Field Recorded'}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400 font-medium">Medical Incidents:</span>{' '}
                    <strong className="text-emerald-700 font-mono">
                      {animal.medical_history?.length || 0} recorded
                    </strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    bounceTap(e.currentTarget);
                    setSelectedForTag(animal);
                  }}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Tag</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    bounceTap(e.currentTarget);
                    onSelectAnimalForTriage(animal.tag_id);
                  }}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Diagnose</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          <p className="font-bold text-sm text-slate-700 mb-1">No livestock records found</p>
          <p>Register an animal to generate a physical QR ear-tag and track diagnostic triage.</p>
        </div>
      )}
    </div>
  );
}
