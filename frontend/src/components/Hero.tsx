import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Cloud, Rocket, Stethoscope, Activity, HeartPulse } from 'lucide-react';

interface HeroProps {
  onLoginClick?: () => void;
  darkMode: boolean;
}

export function Hero({ onLoginClick, darkMode }: HeroProps) {
  const features = [
    { icon: Shield, label: 'HIPAA Compliant' },
    { icon: Sparkles, label: 'AI Clinical Notes' },
    { icon: HeartPulse, label: 'Patient-First' },
  ];

  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-700';
  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-white/20';

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Medical Background Pattern */}
      {!darkMode && <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 20 L50 35 M50 65 L50 80 M35 50 L20 50 M80 50 L65 50 M42 50 L58 50 M50 42 L50 58" stroke="#6366f1" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="25" stroke="#6366f1" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)"/>
        </svg>
      </div>}

      {/* Ambient Background Orbs */}
      {!darkMode && <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl"></div>
      </div>}
      
      {/* Medical Icons Floating */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 left-20 opacity-10"
      >
        <Stethoscope className="w-16 h-16 text-indigo-600" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-32 right-24 opacity-10"
      >
        <Activity className="w-20 h-20 text-purple-600" />
      </motion.div>

      {/* Main Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative max-w-5xl w-full"
      >
        {/* Glassy Hero Container */}
        <div className={`relative ${cardBgClass} backdrop-blur-xl rounded-[2.5rem] p-12 md:p-16 shadow-2xl border`}>
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 blur-2xl opacity-50"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-6xl md:text-7xl tracking-tight ${textClass}`}
            >
              Secure Medical Notes AI
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-xl md:text-2xl ${textSecondaryClass} max-w-2xl`}
            >
              Secure. Smart. Simplified Medical Documentation.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <div className={`flex items-center gap-3 px-6 py-3 ${
                    darkMode ? 'bg-slate-700/60 border-slate-600/40' : 'bg-white/60 border-white/40'
                  } backdrop-blur-md rounded-full shadow-lg border hover:shadow-xl hover:border-purple-500/60 transition-all duration-300`}>
                    <feature.icon className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{feature.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="pt-6"
            >
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  <span className="text-white text-lg">Login to Get Started</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Subtle Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'} pt-4`}
            >
              Trusted by healthcare professionals worldwide
            </motion.p>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-2xl backdrop-blur-sm rotate-12 shadow-xl"
        ></motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl backdrop-blur-sm -rotate-12 shadow-xl"
        ></motion.div>
      </motion.div>
    </div>
  );
}
