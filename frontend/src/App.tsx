import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { NurseDashboard } from './components/NurseDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'doctor-dashboard' | 'nurse-dashboard'>('landing');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage
          onLoginClick={() => setCurrentPage('login')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {currentPage === 'login' && (
        <Login
          onBackToHome={() => setCurrentPage('landing')}
          onDoctorLogin={() => setCurrentPage('doctor-dashboard')}
          onNurseLogin={() => setCurrentPage('nurse-dashboard')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {currentPage === 'doctor-dashboard' && (
        <DoctorDashboard
          onLogout={() => setCurrentPage('landing')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {currentPage === 'nurse-dashboard' && (
        <NurseDashboard
          onLogout={() => setCurrentPage('landing')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
    </>
  );
}
