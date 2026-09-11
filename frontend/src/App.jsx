import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RegisterForm from './components/RegisterForm';
import ScanConfirm from './components/ScanConfirm';
import LivestockDirectory from './components/LivestockDirectory';
import VetDashboard from './components/VetDashboard';
import { fetchNetworkInfo } from './api';

export default function App() {
  const isDoctorPortal = window.location.port === '5174' || window.location.search.includes('portal=doctor');
  const [currentView, setCurrentView] = useState(isDoctorPortal ? 'vet' : 'register');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    // If on doctor portal port 5174, keep in vet view
    if (isDoctorPortal) {
      setCurrentView('vet');
      return;
    }

    // Check URL parameters for direct scan link or vet portal
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag_id');
    const viewFromUrl = urlParams.get('view');

    if (viewFromUrl === 'vet' || window.location.hash === '#vet') {
      setCurrentView('vet');
    } else if (tagFromUrl) {
      setSelectedTagId(tagFromUrl);
      setCurrentView('scan');
    } else if (window.location.pathname.includes('/scan')) {
      setCurrentView('scan');
    }

    // Fetch LAN info for display
    fetchNetworkInfo().then((info) => {
      if (info) setNetworkInfo(info);
    });
  }, [isDoctorPortal]);

  const handleAnimalRegistered = (animal) => {
    // Keep user on the generated tag view
  };

  const handleDiagnoseNow = (tagId) => {
    setSelectedTagId(tagId);
    setCurrentView('scan');
    // Update URL without reload for sharing/bookmarking
    const newUrl = `${window.location.pathname}?tag_id=${tagId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleSelectFromDirectory = (tagId) => {
    setSelectedTagId(tagId);
    setCurrentView('scan');
    const newUrl = `${window.location.pathname}?tag_id=${tagId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view !== 'scan') {
            setSelectedTagId(null);
            window.history.pushState({}, '', window.location.pathname);
          }
        }} 
        networkInfo={networkInfo}
        isDoctorPortal={isDoctorPortal}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* DOCTOR PORTAL VIEWS (Port 5174) */}
        {isDoctorPortal ? (
          <>
            {currentView === 'vet' && (
              <VetDashboard onSelectTagForTriage={handleSelectFromDirectory} />
            )}
            {currentView === 'directory' && (
              <LivestockDirectory 
                onSelectAnimalForTriage={(tag) => {
                  // On doctor portal, selecting triage views cases in VetDashboard
                  setCurrentView('vet');
                }}
                onNavigateRegister={() => {}}
                hideRegisterBtn={true}
              />
            )}
          </>
        ) : (
          /* FARMER PORTAL VIEWS (Port 5173) */
          <>
            {currentView === 'register' && (
              <RegisterForm 
                onAnimalRegistered={handleAnimalRegistered}
                onDiagnoseNow={handleDiagnoseNow}
              />
            )}

            {currentView === 'scan' && (
              <ScanConfirm 
                key={selectedTagId || 'scan-default'}
                initialTagId={selectedTagId}
                onSelectDifferentAnimal={() => setSelectedTagId(null)}
              />
            )}

            {currentView === 'directory' && (
              <LivestockDirectory 
                onSelectAnimalForTriage={handleSelectFromDirectory}
                onNavigateRegister={() => setCurrentView('register')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 no-print">
        <p>
          <strong>DehatArogya</strong> • {isDoctorPortal ? 'Veterinary Doctor Jurisdiction Portal (Port 5174)' : 'Livestock Field & QR Portal (Port 5173)'}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Smart India Hackathon 2024 • Powered by Google Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
}
