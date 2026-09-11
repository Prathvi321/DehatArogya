import React, { useState } from 'react';
import { 
  FileText, QrCode, Edit3, Share2, Plus, 
  Stethoscope, Calendar, ShieldCheck, Copy, Check, ChevronRight,
  Info, Image as ImageIcon, ExternalLink, Pill, Eye
} from 'lucide-react';
import CaseDetailModal from './CaseDetailModal';

export default function AnimalDetailView({
  animal,
  onBack,
  onReportConcern,
  onViewTag,
  onEditDetails
}) {
  const [activeTab, setActiveTab] = useState('medical');
  const [copied, setCopied] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  if (!animal) return null;

  const handleCopyTag = () => {
    navigator.clipboard?.writeText(animal.tag_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${animal.name} - DehatArogya Medical Passport`,
        text: `Animal Tag: ${animal.tag_id} (${animal.name}, ${animal.animal_type}). Owner: ${animal.owner_name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyTag();
      alert(`Tag ID ${animal.tag_id} copied to clipboard!`);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Needs Attention' || status === 'Critical') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
          Needs Attention
        </span>
      );
    }
    if (status === 'Under Treatment') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
          Under Treatment
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Healthy
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Animal Hero Profile Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm shrink-0 mx-auto sm:mx-0 aspect-square">
          <img
            src={animal.image || '/images/cow1.png'}
            alt={animal.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.src = '/images/cow1.png'; }}
          />
        </div>

        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2 className="text-2xl font-display font-extrabold text-slate-900">
              {animal.name}
            </h2>
            {getStatusBadge(animal.status)}
          </div>

          {/* Tag Pill with copy */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-xs font-mono font-bold border border-emerald-200/80 my-1">
            <span>{animal.tag_id}</span>
            <button
              onClick={handleCopyTag}
              className="text-emerald-700 hover:text-emerald-900 transition-colors p-0.5"
              title="Copy Tag ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-600 mt-1">
            {animal.animal_type} • {animal.gender || 'Female'} • {animal.age} years
          </p>

          <p className="text-xs text-slate-500 mt-0.5">
            <span className="font-semibold text-slate-700">Owner:</span> {animal.owner_name || 'Ram Kishan'} ({animal.owner_phone || '9876543210'})
          </p>
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Village:</span> {animal.village || 'Rampur'}, {animal.district || 'Sehore (MP)'}
          </p>
        </div>
      </div>

      {/* 4 Quick Action Circular Buttons */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Report a Concern */}
        <button
          onClick={() => onReportConcern(animal.tag_id)}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 rounded-full bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-105 active:scale-95">
            <FileText className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-emerald-800 leading-tight">
            Report a Concern
          </span>
        </button>

        {/* View QR Tag */}
        <button
          onClick={() => onViewTag(animal)}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 rounded-full bg-slate-100 group-hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-105 active:scale-95">
            <QrCode className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-slate-900 leading-tight">
            View QR Tag
          </span>
        </button>

        {/* Edit Details */}
        <button
          onClick={() => onEditDetails && onEditDetails(animal)}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 rounded-full bg-slate-100 group-hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-105 active:scale-95">
            <Edit3 className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-slate-900 leading-tight">
            Edit Details
          </span>
        </button>

        {/* Share Details */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 rounded-full bg-slate-100 group-hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-105 active:scale-95">
            <Share2 className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-slate-900 leading-tight">
            Share Details
          </span>
        </button>
      </div>

      {/* Segmented Tabs */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-1 flex">
        <button
          onClick={() => setActiveTab('medical')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'medical'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Medical History</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'about'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'photos'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'medical' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-slate-900 text-lg">
              Medical History
            </h3>
            <button
              onClick={() => onReportConcern(animal.tag_id)}
              className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Report New Concern</span>
            </button>
          </div>

          {/* Timeline Cards */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {(animal.medical_history && animal.medical_history.length > 0) ? (
              animal.medical_history.map((record, index) => {
                const isHigh = record.risk_level?.includes('High') || record.risk_level === 'HIGH';
                const isMed = record.risk_level?.includes('Medium') || record.risk_level === 'MEDIUM';
                const dotColor = isHigh ? 'bg-rose-500 ring-rose-200' : isMed ? 'bg-amber-500 ring-amber-200' : 'bg-emerald-500 ring-emerald-200';
                
                return (
                  <div key={record.id || index} className="relative">
                    {/* Urgency Dot on timeline */}
                    <div className={`absolute -left-6 top-4 w-3.5 h-3.5 rounded-full ring-4 ${dotColor}`} />

                    <div 
                      onClick={() => setSelectedCase(record)}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all duration-200 group"
                      title="Click to view complete clinical case file, uploaded photos, and prescriptions"
                    >
                      {/* Date & Time Header */}
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {record.date} {record.time ? `• ${record.time}` : ''}
                          </span>
                          {record.case_id && (
                            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {record.case_id}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {record.risk_level && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isHigh ? 'bg-rose-100 text-rose-700' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {record.risk_level}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {record.status || 'Treated'}
                          </span>
                        </div>
                      </div>

                      {/* Diagnosis Title & Symptoms */}
                      <div>
                        <h4 className="text-sm font-display font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {record.title || record.detected_disease || 'General Veterinary Examination'}
                        </h4>
                        {(record.symptoms || record.reported_issue) && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            <span className="font-semibold text-slate-700">Symptoms:</span> {record.symptoms || record.reported_issue}
                          </p>
                        )}
                      </div>

                      {/* Attached Case Photo Thumbnails preview if any */}
                      {record.case_photos && record.case_photos.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Evidence:</span>
                          <div className="flex gap-1.5 overflow-hidden">
                            {record.case_photos.map((p, i) => (
                              <img
                                key={i}
                                src={p}
                                alt="case thumb"
                                className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Doctor Box if treated */}
                      {record.doctor_name && (
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <Stethoscope className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">
                                Treated by {record.doctor_name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {record.doctor_title || 'Veterinary Officer, Sehore'}
                              </p>
                            </div>
                          </div>

                          {record.follow_up_date && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-slate-200/60">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Follow-up: {record.follow_up_date}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View Case Details CTA Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-bold group-hover:text-emerald-950">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>View Full Medical File, Photos & Prescriptions</span>
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">
                  No medical records found for this animal yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">Biometric & Registration Details</h4>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Species</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{animal.animal_type}</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Gender</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{animal.gender || 'Female'}</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Age</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{animal.age} Years</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Ear Tag UID</span>
              <p className="font-mono font-bold text-emerald-800 text-sm mt-0.5">{animal.tag_id}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-slate-500">Registered Village Post</p>
            <p className="font-semibold text-slate-800 mt-0.5">{animal.village || 'Rampur'}, Sehore District</p>
          </div>
        </div>
      )}

      {/* PHOTOS TAB */}
      {activeTab === 'photos' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">Animal Photographic Records</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square">
              <img src={animal.image || '/images/cow1.png'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <Plus className="w-6 h-6 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-600 mt-1">Add Photo</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Medical History Information Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
          <strong>Complete medical history helps in better treatment.</strong> Keep this information updated for your animal's health.
        </p>
      </div>

      {/* Full Clinical Case Record Modal */}
      <CaseDetailModal
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        record={selectedCase}
        animal={animal}
      />
    </div>
  );
}
