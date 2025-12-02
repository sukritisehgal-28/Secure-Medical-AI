import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { Hero } from './Hero';
import { MedicalPreview } from './MedicalPreview';
import { MedicalBenefits } from './MedicalBenefits';

interface LandingPageProps {
  onLoginClick?: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function LandingPage({ onLoginClick, darkMode, setDarkMode }: LandingPageProps) {
  const bgClass = darkMode
    ? 'bg-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-white to-purple-50/30';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 relative`}>
      {/* Dark Mode Toggle - Fixed Position */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 p-3 ${
          darkMode ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/60 border-white/40'
        } backdrop-blur-md rounded-full shadow-lg border hover:border-purple-500/50 transition-all`}
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </motion.button>

      <Hero onLoginClick={onLoginClick} darkMode={darkMode} />
      <MedicalPreview darkMode={darkMode} />
      <MedicalBenefits darkMode={darkMode} />
    </div>
  );
}
