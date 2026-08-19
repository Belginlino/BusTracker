import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import NetworkBanner from '../components/common/NetworkBanner';
import AuthModal from '../features/auth/AuthModal';
import { HomePage } from '../pages/HomePage';
import { LiveMapPage } from '../pages/LiveMapPage';
import { RoutesPage } from '../pages/RoutesPage';
import { StopsPage } from '../pages/StopsPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { DriverPage } from '../pages/DriverPage';
import { AdminPage } from '../pages/AdminPage';

function AppContent() {
  const { role, setRole, user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <NetworkBanner isOnline={isOnline} />
      
      <Header
        currentRole={role}
        setRole={setRole}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/live" element={<LiveMapPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:routeId" element={<RoutesPage />} />
          <Route path="/stops" element={<StopsPage />} />
          <Route path="/stops/:stopId" element={<StopsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/driver" element={<DriverPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
