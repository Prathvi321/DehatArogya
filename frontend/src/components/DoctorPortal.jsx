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
import { fetchVetIncidents, scheduleVetAppointment } from '../api';

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
        const incidentList = Array.isArray(data) ? data : (data?.incidents || []);
        if (incidentList.length > 0) {
          setPatients((prev) => {
            const existingTags = new Set(prev.map((p) => p.tag_id));
            const newIncidents = incidentList
              .filter((inc) => !existingTags.has(inc.tag_id))
              .map((inc) => ({
                id: inc.id,
                history_id: inc.id,
                tag_id: inc.tag_id,
                name: inc.animal_name || 'Animal',
                animal_type: inc.animal_type || 'Cow',
                age: inc.age || 3,
                gender: inc.gender || 'Female',
                image: inc.image_url || (inc.animal_type === 'Buffalo' ? '/images/buffalo.jpg' : '/images/cow1.png'),
                owner_name: 'Ram Kishan',
                owner_phone: inc.owner_phone || '9876543210',
                village: inc.village || 'Rampur',
                district: 'Sehore (MP)',
                distance: '2.5 km away',
                priority: inc.risk_level === 'HIGH' ? 'High Priority' : (inc.risk_level === 'MEDIUM' ? 'Moderate' : 'Follow-up'),
                risk_level: inc.risk_level,
                status: inc.user_status === 'TREATED' ? 'Treated' : 'Needs Treatment',
                reported_at: inc.created_at ? new Date(inc.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
                reported_issue: inc.reported_issue,
                detected_disease: inc.detected_disease,
                images: inc.complaint_image_url ? [inc.complaint_image_url] : (inc.image_url ? [inc.image_url] : ['/images/cow1.png']),
                audio_note: {
                  duration: '00:28',
                  transcript: inc.complaint_audio_transcript || inc.reported_issue
                },
                location: {
                  address: `${inc.village || 'Rampur'}, Sehore (MP)`,
                  distance: '2.5 km away',
                  latitude: inc.latitude || 23.2031,
                  longitude: inc.longitude || 77.0844
                },
                deadline_date: inc.deadline_date,
                scheduled_visit: inc.scheduled_date ? {
                  date: inc.scheduled_date.split('T')[0],
                  time: inc.scheduled_time || '10:00 AM',
                  note: inc.scheduled_notes || ''
                } : null,
                actual_diagnosis: inc.actual_diagnosis,
                treatment_given: inc.treatment_given,
                medicines_used: inc.medicines_used,
                treatment_image_url: inc.treatment_image_url,
                treated_at: inc.treated_at,
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

  const handleConfirmSchedule = async ({ history_id, date, time, note }) => {
    const targetHistoryId = history_id || selectedPatient.history_id || (typeof selectedPatient.id === 'number' ? selectedPatient.id : null);

    if (targetHistoryId) {
      try {
        await scheduleVetAppointment({
          historyId: targetHistoryId,
          scheduledDate: date,
          scheduledTime: time,
          scheduledNotes: note
        });
      } catch (err) {
        showToast(err.message || 'Reschedule rejected by strict deadline policy');
        return;
      }
    }

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
