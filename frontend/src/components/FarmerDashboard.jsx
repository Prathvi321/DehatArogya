import React from 'react';
import { 
  FileText, AlertTriangle, HeartPulse, ChevronRight, MapPin
} from 'lucide-react';

export default function FarmerDashboard({
  animals,
  activities,
  userProfile,
  onNavigate,
  onSelectAnimal
}) {
  // Compute live stats
  const registeredCount = animals.length;
  const needsAttentionCount = animals.filter(a => a.status === 'Needs Attention' || a.status === 'Critical').length;
  const totalTreatmentsCount = animals.reduce((acc, a) => acc + (a.medical_history?.length || 0), 0);
  const activeConcernsCount = animals.filter(a => a.status === 'Under Treatment').length;

  const getStatusBadge = (status) => {
    if (status === 'Needs Attention' || status === 'Critical') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
          Needs Attention
        </span>
      );
    }
    if (status === 'Under Treatment') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
          Under Treatment
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Healthy
      </span>
    );
  };

  const farmerName = userProfile?.name || 'Ram Kishan';
  const farmerVillage = userProfile?.village || 'Rampur';
  const farmerDistrict = userProfile?.district || 'Sehore (MP)';

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      
      {/* ==================================================== */}
      {/* 1. HERO BANNER: TEXT & DETAILS DIRECTLY ON THE IMAGE */}
      {/* ==================================================== */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-emerald-900/15 min-h-[220px] sm:min-h-[260px] flex items-end sm:items-center">
        {/* Full Hero Image */}
        <img
          src="/images/farmer_cow_hero.png"
          alt="Farmer with cow"
          className="absolute inset-0 w-full h-full object-cover object-[75%_25%] sm:object-[65%_30%] scale-100"
          onError={(e) => { e.target.src = '/images/farmer_hero.jpg'; }}
        />

        {/* Ambient Dark/Emerald Gradient Overlay for crystal clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-emerald-950/95 via-emerald-950/70 to-black/20" />

        {/* Text Details Positioned Directly ON the Image */}
        <div className="relative z-10 p-5 sm:p-7 max-w-[85%] sm:max-w-[65%] space-y-2">
          {/* Namaste in first line, Ram Kishan in second line, no emoji */}
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight drop-shadow-md">
            Namaste,<br />{farmerName}
          </h1>

          {/* Location Directly Below Greeting ON the Image */}
          <div className="inline-flex items-center gap-1.5 text-emerald-200 text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{farmerVillage}, {farmerDistrict}</span>
          </div>

          {/* Tagline Directly ON the Image */}
          <div className="pt-0.5">
            <p className="text-xs sm:text-sm font-medium text-emerald-100 leading-snug drop-shadow-xs">
              Aapke pashu, hamari zimmedari
            </p>
            {/* Curved Green Brush Underline */}
            <svg className="w-32 sm:w-36 h-3 text-emerald-400 mt-1" viewBox="0 0 128 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9C32 2 85 2 126 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. STAT / METRIC CARDS (4 Grid Tiles)                 */}
      {/* ==================================================== */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Registered Animals */}
          <div 
            onClick={() => onNavigate('directory')}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50/70 rounded-2xl transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl">🐄</span>
            </div>
            <div>
              <p className="text-xl font-display font-extrabold text-slate-900 leading-none">
                {registeredCount}
              </p>
              <p className="text-[11px] font-medium text-slate-500 mt-1 leading-tight">
                Registered Animals
              </p>
            </div>
          </div>

          {/* Needs Attention */}
          <div 
            onClick={() => onNavigate('directory')}
            className="flex items-center gap-3 p-2 pt-3 sm:pt-2 sm:pl-4 cursor-pointer hover:bg-slate-50/70 rounded-2xl transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5 stroke-[2.4px]" />
            </div>
            <div>
              <p className="text-xl font-display font-extrabold text-rose-600 leading-none">
                {needsAttentionCount}
              </p>
              <p className="text-[11px] font-medium text-slate-500 mt-1 leading-tight">
                Needs Attention
              </p>
            </div>
          </div>

          {/* Total Treatments */}
          <div 
            onClick={() => onNavigate('directory')}
            className="flex items-center gap-3 p-2 pt-3 sm:pt-2 sm:pl-4 cursor-pointer hover:bg-slate-50/70 rounded-2xl transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <p className="text-xl font-display font-extrabold text-slate-900 leading-none">
                {totalTreatmentsCount}
              </p>
              <p className="text-[11px] font-medium text-slate-500 mt-1 leading-tight">
                Total Treatments
              </p>
            </div>
          </div>

          {/* Active Concerns */}
          <div 
            onClick={() => onNavigate('directory')}
            className="flex items-center gap-3 p-2 pt-3 sm:pt-2 sm:pl-4 cursor-pointer hover:bg-slate-50/70 rounded-2xl transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <p className="text-xl font-display font-extrabold text-slate-900 leading-none">
                {activeConcernsCount}
              </p>
              <p className="text-[11px] font-medium text-slate-500 mt-1 leading-tight">
                Active Concerns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. MY ANIMALS HORIZONTAL CAROUSEL                    */}
      {/* ==================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-extrabold text-slate-900 text-lg">
            My Animals
          </h2>
          <button
            onClick={() => onNavigate('directory')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
          {animals.slice(0, 5).map((animal) => (
            <div
              key={animal.tag_id}
              onClick={() => onSelectAnimal(animal)}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 hover:border-emerald-300 transition-all duration-200 cursor-pointer group hover:shadow-md flex items-center justify-between gap-3 min-w-[260px] sm:min-w-[280px] snap-start shrink-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Fixed aspect-square ratio for crisp image rendering */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-square">
                  <img
                    src={animal.image || '/images/cow1.png'}
                    alt={animal.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = '/images/cow1.png'; }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-extrabold text-slate-900 text-sm truncate">
                    {animal.name}
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                    {animal.tag_id}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {animal.animal_type} • {animal.age} years
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {getStatusBadge(animal.status)}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. RECENT ACTIVITY FEED                              */}
      {/* ==================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-extrabold text-slate-900 text-lg">
            Recent Activity
          </h2>
          <button
            onClick={() => onNavigate('directory')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-200/80 divide-y divide-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.iconColor}`}>
                  {act.type === 'treatment' && <FileText className="w-4 h-4 stroke-[2.2px]" />}
                  {act.type === 'concern' && <AlertTriangle className="w-4 h-4 stroke-[2.2px]" />}
                  {act.type === 'register' && <span className="text-base font-bold text-emerald-700">+</span>}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {act.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {act.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const animal = animals.find(a => a.tag_id === act.tagId) || animals[0];
                  if (animal) onSelectAnimal(animal);
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
