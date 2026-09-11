import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MyAnimalsView({
  animals,
  onSelectAnimal,
  onNavigateRegister
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchSearch =
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.tag_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.animal_type?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterStatus === 'NEEDS_ATTENTION') {
        return animal.status === 'Needs Attention' || animal.status === 'Critical';
      }
      if (filterStatus === 'HEALTHY') {
        return animal.status === 'Healthy';
      }
      if (filterStatus === 'TREATMENT') {
        return animal.status === 'Under Treatment';
      }
      return true;
    });
  }, [animals, searchTerm, filterStatus]);

  const getStatusBadge = (status) => {
    if (status === 'Needs Attention' || status === 'Critical') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
          Needs Attention
        </span>
      );
    }
    if (status === 'Under Treatment') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
          Under Treatment
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Healthy
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Title and Add New Animal header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900">
            My Animals
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Here are your registered animals. Tap on any animal to view details, report a concern or check medical history.
          </p>
        </div>

        <button
          onClick={onNavigateRegister}
          className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Animal</span>
        </button>
      </div>

      {/* Search Bar & Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-xs"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`p-2.5 rounded-xl border transition-colors shadow-xs ${
              filterStatus !== 'ALL'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Filter Status"
          >
            <Filter className="w-4 h-4" />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-20 text-xs font-semibold">
              <button
                onClick={() => { setFilterStatus('ALL'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg ${filterStatus === 'ALL' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                All Animals ({animals.length})
              </button>
              <button
                onClick={() => { setFilterStatus('NEEDS_ATTENTION'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg ${filterStatus === 'NEEDS_ATTENTION' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                Needs Attention
              </button>
              <button
                onClick={() => { setFilterStatus('HEALTHY'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg ${filterStatus === 'HEALTHY' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                Healthy Only
              </button>
              <button
                onClick={() => { setFilterStatus('TREATMENT'); setShowFilterDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg ${filterStatus === 'TREATMENT' ? 'bg-sky-50 text-sky-800 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                Under Treatment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animal Cards List */}
      <div className="space-y-2.5">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
            <div
              key={animal.tag_id}
              onClick={() => onSelectAnimal(animal)}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 hover:border-emerald-300 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group hover:shadow-md"
            >
              {/* Thumbnail + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square">
                  <img
                    src={animal.image || '/images/cow1.png'}
                    alt={animal.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = '/images/cow1.png'; }}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display font-extrabold text-slate-900 text-base leading-snug truncate">
                    {animal.name}
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                    {animal.tag_id}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {animal.animal_type} • {animal.gender || 'Female'} • {animal.age} years
                  </p>
                </div>
              </div>

              {/* Status Badge + Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(animal.status)}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No animals found matching your search.
          </div>
        )}
      </div>

      {/* Bottom Summary Banner */}
      <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
            Total Animals Registered
          </p>
          <p className="text-2xl font-display font-extrabold text-emerald-950 mt-0.5">
            {animals.length}
          </p>
        </div>

        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold bg-white/80 px-3 py-2 rounded-xl border border-emerald-200/70">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Together for Healthier Animals</span>
        </div>
      </div>
    </div>
  );
}
