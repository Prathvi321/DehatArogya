import React, { useState, useEffect } from 'react';
import DoctorHeader from './DoctorHeader';
import DoctorBottomNav from './DoctorBottomNav';
import DoctorHome from './DoctorHome';
import DoctorPatientDetail from './DoctorPatientDetail';
import DoctorScheduleModal from './DoctorScheduleModal';
import DoctorTreatmentForm from './DoctorTreatmentForm';
import DoctorAppointments from './DoctorAppointments';
import DoctorProfile from './DoctorProfile';
import DoctorScanModal from './DoctorScanModal';
import { INITIAL_DOCTOR_PROFILE, INITIAL_DOCTOR_PATIENTS } from '../data/mockDoctorData';
import { fetchVetIncidents } from '../api';

export default function DoctorPortal({ onTogglePortal }) {
  // Main Navigation Tabs: 'home' | 'appointments' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Sub-views for detail flows: null | 'patient-detail' | 'schedule-visit' | 'treatment-form'
  const [subView, setSubView] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(INITIAL_DOCTOR_PATIENTS[0]);

  // Modals
  const [isScanQrOpen, setIsScanQrOpen] = useState(false);

  // Doctor Data State
  const [doctorProfile, setDoctorProfile] = useState(INITIAL_DOCTOR_PROFILE);
  const [patients, setPatients] = useState(INITIAL_DOCTOR_PATIENTS);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with backend incidents if available
  useEffect(() => {
    fetchVetIncidents()
      .then((data) => {
        if (data && data.incidents && data.incidents.length > 0) {
          // Merge any live reported incidents into patients
          setPatients((prev) => {
            const existingTags = new Set(prev.map((p) => p.tag_id));
            const newIncidents = data.incidents
              .filter((inc) => !existingTags.has(inc.tag_id))
              .map((inc) => ({
                id: `server-${inc.incident_id}`,
                tag_id: inc.tag_id,
                name: inc.animal_name || 'Cow',
                animal_type: inc.species || 'Cow',
                age: inc.age || 3,
                gender: 'Female',
                image: inc.species === 'Buffalo' ? '/images/buffalo.jpg' : '/images/cow1.png',
                owner_name: inc.owner_name || 'Local Farmer',
                owner_phone: inc.owner_phone || '9876543210',
                village: inc.village || 'Rampur',
                district: 'Sehore (MP)',
                distance: '3.5 km away',
                priority: inc.risk_level === 'HIGH' ? 'High Priority' : 'Moderate',
                status: inc.status === 'TREATED' ? 'Treated' : 'Needs Treatment',
                reported_at: 'Just now',
                reported_issue: inc.reported_symptoms || inc.concern || 'Lumpy skin disease suspected',
                images: inc.image_url ? [inc.image_url] : ['/images/cow1.png'],
                audio_note: {
                  duration: '00:20',
                  transcript: inc.voice_transcript || 'Cow showing distress and fever.'
                },
                location: {
                  address: `${inc.village || 'Rampur'}, Sehore (MP)`,
                  distance: '3.5 km away',
                  latitude: 23.2031,
                  longitude: 77.0844
                },
                scheduled_visit: inc.risk_level === 'HIGH' ? {
                  date: '14 Sep 2024',
                  time: '09:30 AM',
                  note: 'Urgent priority AI triage dispatch'
                } : null,
                medical_history: []
              }));
            return [...newIncidents, ...prev];
          });
        }
      })
      .catch((err) => console.warn('Could not load vet backend incidents:', err));
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSubView('patient-detail');
  };

  const handleOpenScanQr = () => {
    setIsScanQrOpen(true);
  };

  const handleSelectPatientByTag = (tagId) => {
    const matched = patients.find(
      (p) => p.tag_id?.toUpperCase() === tagId.toUpperCase() ||
             p.name?.toLowerCase() === tagId.toLowerCase()
    );
    if (matched) {
      setSelectedPatient(matched);
      setSubView('patient-detail');
      showToast(`Found records for ${matched.name} (${matched.tag_id})`);
    } else {
      showToast(`Tag ${tagId} not found in jurisdiction database`);
    }
  };

  const handleConfirmSchedule = ({ date, time, note }) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === selectedPatient.id || p.tag_id === selectedPatient.tag_id) {
          const updated = {
            ...p,
            scheduled_visit: { date, time, note }
          };
          setSelectedPatient(updated);
          return updated;
        }
        return p;
      })
    );
    showToast(`Visit scheduled for ${date} at ${time}`);
    setSubView('patient-detail');
  };

  const handleMarkAsTreated = (treatmentData) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === selectedPatient.id || p.tag_id === selectedPatient.tag_id) {
          const newHistoryItem = {
            id: `h-${Date.now()}`,
            date: treatmentData.visitDate || 'Today',
            title: treatmentData.diagnosis || 'Clinical Treatment',
            description: `${treatmentData.treatmentGiven} • Meds: ${treatmentData.medicines.map(m => m.name).join(', ')}`
          };

          const updated = {
            ...p,
            status: 'Treated',
            priority: 'Follow-up',
            medical_history: [newHistoryItem, ...(p.medical_history || [])],
            treatment_summary: treatmentData
          };
          setSelectedPatient(updated);
          return updated;
        }
        return p;
      })
    );

    // Update stats
    setDoctorProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        treatedThisMonth: (prev.stats.treatedThisMonth || 0) + 1,
        activePatients: Math.max(0, (prev.stats.activePatients || 1) - 1)
      }
    }));

    showToast(`Treatment recorded for ${selectedPatient.name} & saved to database!`);
    setSubView('patient-detail');
  };

  const handleBack = () => {
    if (subView === 'treatment-form' || subView === 'schedule-visit') {
      setSubView('patient-detail');
    } else if (subView === 'patient-detail') {
      setSubView(null);
    }
  };

  const handleTabChange = (newTab) => {
    setSubView(null);
    setActiveTab(newTab);
  };

  // Urgent count for badges
  const urgentCount = patients.filter(
    (p) => p.status === 'Needs Treatment' && (p.priority === 'High Priority' || p.priority === 'HIGH')
  ).length;

  const scheduledCount = patients.filter((p) => p.scheduled_visit).length;

  return (
    <div className="min-h-screen bg-[#F4F6F2] text-slate-800 font-sans flex flex-col transition-colors duration-300">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Doctor Branding on Left, Doctor Avatar & Profile Button on Right */}
      <DoctorHeader
        showBack={subView !== null}
        onBack={handleBack}
        onOpenProfile={() => {
          setSubView(null);
          setActiveTab('profile');
        }}
        doctorProfile={doctorProfile}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-3 sm:px-4 py-4 max-w-2xl mx-auto w-full">
        
        {/* SUBVIEW 1: Treatment Form (Screenshot 4) */}
        {subView === 'treatment-form' && (
          <DoctorTreatmentForm
            patient={selectedPatient}
            onSubmitTreatment={handleMarkAsTreated}
            onBack={() => setSubView('patient-detail')}
          />
        )}

        {/* SUBVIEW 2: Schedule Visit Form (Screenshot 3) */}
        {subView === 'schedule-visit' && (
          <DoctorScheduleModal
            patient={selectedPatient}
            onConfirmSchedule={handleConfirmSchedule}
            onBack={() => setSubView('patient-detail')}
          />
        )}

        {/* SUBVIEW 3: Patient Detail (Screenshot 2) */}
        {subView === 'patient-detail' && (
          <DoctorPatientDetail
            patient={selectedPatient}
            onBack={() => setSubView(null)}
            onReadyToTreat={() => setSubView('treatment-form')}
            onScheduleVisit={() => setSubView('schedule-visit')}
          />
        )}

        {/* ROOT TAB 1: Home (Screenshot 1) */}
        {!subView && activeTab === 'home' && (
          <DoctorHome
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onOpenScanQr={handleOpenScanQr}
            doctorName={doctorProfile.name}
          />
        )}

        {/* ROOT TAB 2: Appointments */}
        {!subView && activeTab === 'appointments' && (
          <DoctorAppointments
            patients={patients}
            onStartTreatment={(patient) => {
              setSelectedPatient(patient);
              setSubView('treatment-form');
            }}
            onAdjustSchedule={(patient) => {
              setSelectedPatient(patient);
              setSubView('schedule-visit');
            }}
          />
        )}

        {/* ROOT TAB 3: Profile */}
        {!subView && activeTab === 'profile' && (
          <DoctorProfile
            doctorProfile={doctorProfile}
            totalPatients={patients.length}
            onTogglePortal={onTogglePortal}
          />
        )}

      </main>

      {/* ========================================================= */}
      {/* STICKY FOOTER: Exactly 3 options: Home, Appointments, Profile */}
      {/* No Add Record, No Messages                                */}
      {/* ========================================================= */}
      <DoctorBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        urgentCount={urgentCount}
        appointmentsCount={scheduledCount}
      />

      {/* Scan QR Modal */}
      <DoctorScanModal
        isOpen={isScanQrOpen}
        onClose={() => setIsScanQrOpen(false)}
        patients={patients}
        onSelectPatientByTag={handleSelectPatientByTag}
      />

    </div>
  );
}
