import React, { useState, useEffect } from 'react';
import FarmerHeader from './components/FarmerHeader';
import FarmerBottomNav from './components/FarmerBottomNav';
import FarmerDashboard from './components/FarmerDashboard';
import MyAnimalsView from './components/MyAnimalsView';
import AnimalDetailView from './components/AnimalDetailView';
import RegisterNewAnimal from './components/RegisterNewAnimal';
import ScanConfirm from './components/ScanConfirm';
import EarTagCard from './components/EarTagCard';
import VetDashboard from './components/VetDashboard';
import DoctorPortal from './components/DoctorPortal';
import FarmerProfileModal from './components/FarmerProfileModal';
import { ScanModal } from './components/FarmerModals';
import { 
  INITIAL_FARMER_ANIMALS, 
  RECENT_ACTIVITIES, 
  INITIAL_USER_PROFILE 
} from './data/mockFarmerData';
import { getAllAnimals, fetchNetworkInfo } from './api';
import { X } from 'lucide-react';

export default function App() {
  const isPort5174 = typeof window !== 'undefined' && window.location.port === '5174';
  const hasDoctorParam = typeof window !== 'undefined' && window.location.search.includes('portal=doctor');
  
  // Portal State: Doctor or Farmer
  const [portalOverride, setPortalOverride] = useState(null);
  const isDoctorPortal = portalOverride !== null 
    ? portalOverride 
    : (isPort5174 || hasDoctorParam);

  // Farmer Navigation Views: 'home' | 'directory' | 'animal-detail' | 'register' | 'scan'
  const [farmerView, setFarmerView] = useState('home');
  const [selectedAnimal, setSelectedAnimal] = useState(INITIAL_FARMER_ANIMALS[0]);
  const [selectedTagId, setSelectedTagId] = useState(null);

  // User Profile state (editable from settings/profile modal)
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);

  // Data collections
  const [animals, setAnimals] = useState(INITIAL_FARMER_ANIMALS);
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);
  const [networkInfo, setNetworkInfo] = useState(null);

  // Modal visibility states
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tagModalAnimal, setTagModalAnimal] = useState(null);

  // Initial data loading from backend
  useEffect(() => {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag_id');
    const viewFromUrl = urlParams.get('view');

    if (viewFromUrl === 'vet' || window.location.hash === '#vet') {
      setPortalOverride(true);
    } else if (tagFromUrl) {
      setSelectedTagId(tagFromUrl);
      setFarmerView('scan');
    }

    // Fetch backend animals and merge
    getAllAnimals()
      .then((serverAnimals) => {
        if (serverAnimals && serverAnimals.length > 0) {
          setAnimals((prev) => {
            const existingTags = new Set(prev.map((a) => a.tag_id));
            const newOnes = serverAnimals.filter((a) => !existingTags.has(a.tag_id)).map((a) => ({
              ...a,
              status: a.medical_history?.some(m => m.risk_level === 'HIGH') ? 'Needs Attention' : 'Healthy',
              image: a.animal_type === 'Buffalo' ? '/images/buffalo.jpg' : a.animal_type === 'Goat' ? '/images/goat.jpg' : '/images/cow1.png',
              owner_name: userProfile.name,
              village: userProfile.village,
              district: `${userProfile.district} (${userProfile.state})`,
              medical_history: a.medical_history || []
            }));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch((err) => console.warn('Could not fetch server animals:', err));

    fetchNetworkInfo().then((info) => {
      if (info) setNetworkInfo(info);
    });
  }, [userProfile.name, userProfile.village, userProfile.district, userProfile.state]);

  const handleTogglePortal = () => {
    const nextDoctorState = !isDoctorPortal;
    setPortalOverride(nextDoctorState);
  };

  const handleUpdateProfile = (updatedData) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updatedData
    }));
  };

  const handleAnimalRegistered = (newAnimal) => {
    setAnimals((prev) => [newAnimal, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'register',
        title: `Animal ${newAnimal.name} registered`,
        date: 'Today',
        iconColor: 'bg-emerald-100 text-emerald-700',
        tagId: newAnimal.tag_id
      },
      ...prev
    ]);
  };

  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
    setFarmerView('animal-detail');
  };

  const handleReportConcern = (tagId) => {
    setSelectedTagId(tagId);
    setFarmerView('scan');
  };

  const handleScanTagFromModal = (tagId) => {
    const matched = animals.find((a) => a.tag_id?.toUpperCase() === tagId.toUpperCase());
    if (matched) {
      setSelectedAnimal(matched);
      setFarmerView('animal-detail');
    } else {
      setSelectedTagId(tagId);
      setFarmerView('scan');
    }
  };

  // ==========================================
  // VETERINARY DOCTOR PORTAL (Enhanced Mobile-First Portal)
  // ==========================================
  if (isDoctorPortal) {
    return <DoctorPortal onTogglePortal={handleTogglePortal} />;
  }

  // ==========================================
  // FARMER FIELD PORTAL (Natural Responsive App)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F4F6F2] text-slate-800 font-sans flex flex-col transition-colors duration-300">
      
      {/* Top Header: Logo on left, single unified Profile & Settings action on right */}
      <FarmerHeader
        showBack={farmerView !== 'home'}
        onBack={() => {
          if (farmerView === 'animal-detail') setFarmerView('directory');
          else setFarmerView('home');
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userProfile={userProfile}
      />

      {/* Main View Area: Rendered directly without artificial mobile device frames */}
      <main className="flex-1 px-3 sm:px-4 py-4 max-w-2xl mx-auto w-full">
        {farmerView === 'directory' && (
          <MyAnimalsView
            animals={animals}
            onSelectAnimal={handleSelectAnimal}
            onNavigateRegister={() => setFarmerView('register')}
          />
        )}

        {farmerView === 'animal-detail' && (
          <AnimalDetailView
            animal={selectedAnimal}
            onBack={() => setFarmerView('directory')}
            onReportConcern={handleReportConcern}
            onViewTag={(animal) => setTagModalAnimal(animal)}
            onEditDetails={(animal) => alert(`Editing ${animal.name} biometric data`)}
          />
        )}

        {farmerView === 'register' && (
          <RegisterNewAnimal
            onAnimalRegistered={handleAnimalRegistered}
            onDiagnoseNow={(tagId) => {
              setSelectedTagId(tagId);
              setFarmerView('scan');
            }}
            onBack={() => setFarmerView('home')}
          />
        )}

        {farmerView === 'scan' && (
          <div className="pb-28 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setFarmerView('home')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer shadow-2xs"
              >
                ← Back to Dashboard
              </button>
              <span className="text-xs font-bold text-emerald-800">
                Live AI Triage & Voice Diagnosis
              </span>
            </div>
            <ScanConfirm
              initialTagId={selectedTagId}
              onSelectDifferentAnimal={() => setSelectedTagId(null)}
            />
          </div>
        )}

        {farmerView === 'home' && (
          <FarmerDashboard
            animals={animals}
            activities={activities}
            userProfile={userProfile}
            onNavigate={(target) => setFarmerView(target)}
            onSelectAnimal={handleSelectAnimal}
          />
        )}
      </main>

      {/* ========================================================= */}
      {/* STICKY FOOTER BAR: 3 OPTIONS ALWAYS STUCK ON SCREEN       */}
      {/* 1. My Animals | 2. Center Scan QR | 3. Register Animal     */}
      {/* ========================================================= */}
      <FarmerBottomNav
        activeView={farmerView}
        onNavigate={(target) => setFarmerView(target)}
        onOpenScan={() => setIsScanModalOpen(true)}
      />

      {/* ========================================================= */}
      {/* MODALS & DIALOGS                                          */}
      {/* ========================================================= */}

      {/* Quick QR Scanner & Search Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        animals={animals}
        onSelectTag={handleScanTagFromModal}
      />

      {/* Single Unified Profile, Settings & Livestock Analytics Modal */}
      <FarmerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        totalRegistered={animals.length}
        totalConcernsRaised={animals.reduce((acc, a) => acc + (a.medical_history?.length || 0), 0)}
        onTogglePortal={handleTogglePortal}
        isDoctorPortal={isDoctorPortal}
      />

      {/* Physical Digital Ear-Tag UID Modal with 1-Click Print / PNG Download */}
      {tagModalAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                Official Physical Digital Ear-Tag UID
              </h3>
              <button
                onClick={() => setTagModalAnimal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <EarTagCard
              tagId={tagModalAnimal.tag_id}
              name={tagModalAnimal.name}
              species={tagModalAnimal.animal_type}
              age={tagModalAnimal.age}
              village={tagModalAnimal.village}
              ownerPhone={tagModalAnimal.owner_phone}
              qrBase64={tagModalAnimal.qr_code_base64}
              qrUrl={tagModalAnimal.qr_url}
            />
          </div>
        </div>
      )}

    </div>
  );
}
