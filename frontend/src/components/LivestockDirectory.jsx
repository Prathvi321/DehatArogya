import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  QrCode, 
  Stethoscope, 
  Calendar, 
  Loader2, 
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getAllAnimals } from '../api';
import EarTagCard from './EarTagCard';

export default function LivestockDirectory({ onSelectAnimalForTriage, onNavigateRegister }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSpecies, setFilterSpecies] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForTag, setSelectedForTag] = useState(null);

  useEffect(() => {
    loadLivestock();
  }, []);

  const loadLivestock = async () => {
    setLoading(true);
    try {
      const data = await getAllAnimals();
      setAnimals(data);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Ear Tag Modal Popup */}
      {selectedForTag && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedForTag(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Registered Livestock Directory
          </h2>
          <p className="text-xs text-slate-500">
            View all animals, digital ear tags, and past triage incidents.
          </p>
        </div>

        <button
          onClick={onNavigateRegister}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, tag ID, or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Species Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['ALL', 'Cow', 'Buffalo', 'Goat', 'Sheep'].map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setFilterSpecies(sp)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterSpecies === sp
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sp === 'ALL' ? 'All Species' : `${getSpeciesEmoji(sp)} ${sp}`}
            </button>
          ))}
        </div>
      </div>

      {/* Livestock Grid / List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Loading livestock directory...</p>
        </div>
      ) : filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAnimals.map((animal) => (
            <div
              key={animal.tag_id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSpeciesEmoji(animal.animal_type)}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {animal.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {animal.animal_type} • {animal.gender} • {animal.age} yrs
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    {animal.tag_id}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2 mb-3">
                  <p><strong>Village:</strong> {animal.village || 'N/A'}</p>
                  <p>
                    <strong>Medical Incidents:</strong>{' '}
                    <span className="font-semibold text-slate-800">
                      {animal.medical_history?.length || 0} recorded
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedForTag(animal)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Tag</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectAnimalForTriage(animal.tag_id)}
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all shadow-xs"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Triage</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          <p className="font-bold text-sm text-slate-700 mb-1">No animals found</p>
          <p>Register your first livestock animal to generate a physical QR ear tag.</p>
        </div>
      )}
    </div>
  );
}
