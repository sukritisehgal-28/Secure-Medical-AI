import React from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, CheckCircle2, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MedicalPreviewProps {
  darkMode: boolean;
}

export function MedicalPreview({ darkMode }: MedicalPreviewProps) {
  const stats = [
    { icon: FileText, label: 'Notes Generated', value: '50K+' },
    { icon: Clock, label: 'Time Saved', value: '10K hrs' },
    { icon: CheckCircle2, label: 'Accuracy Rate', value: '99.8%' },
    { icon: User, label: 'Active Doctors', value: '2,500+' },
  ];

  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/40 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`${cardBgClass} backdrop-blur-lg rounded-3xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl">
                    <stat.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className={`text-3xl ${textClass}`}>{stat.value}</div>
                  <div className={`text-sm ${textSecondaryClass}`}>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Medical Notes Preview */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Medical Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjMyNzExNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Medical professional using technology"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
            </div>
            
            {/* Floating Medical Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute -bottom-6 -right-6 ${
                darkMode ? 'bg-slate-800/90 border-slate-700/60' : 'bg-white/90 border-white/60'
              } backdrop-blur-lg rounded-2xl p-4 shadow-xl border`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className={`text-xs ${textSecondaryClass}`}>HIPAA Certified</div>
                  <div className={textClass}>Secure & Compliant</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Mock Medical Note */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className={`${cardBgClass} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl`}>
              <div className="space-y-6">
                {/* Header */}
                <div className={`flex items-center justify-between pb-4 border-b ${
                  darkMode ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <div>
                    <h3 className={textClass}>Clinical Note</h3>
                    <p className={`text-sm ${textSecondaryClass}`}>Generated in 30 seconds</p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    AI Generated
                  </div>
                </div>

                {/* Patient Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className={`text-sm ${textSecondaryClass}`}>Patient: John Doe, 45y/o Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className={`text-sm ${textSecondaryClass}`}>Visit Date: Nov 16, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className={`text-sm ${textSecondaryClass}`}>Chief Complaint: Annual Physical</span>
                  </div>
                </div>

                {/* Note Content */}
                <div className={`${
                  darkMode ? 'bg-slate-700/80' : 'bg-slate-50/80'
                } rounded-2xl p-4 space-y-2`}>
                  <h4 className={`text-sm ${textClass}`}>Assessment & Plan:</h4>
                  <p className={`text-sm ${textSecondaryClass} leading-relaxed`}>
                    Patient presents for routine annual physical examination. Vital signs within normal limits. 
                    No acute concerns reported. Continue current medications...
                  </p>
                  <div className="pt-2 flex gap-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs">Cardiology</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">Preventive</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm hover:shadow-lg transition-shadow">
                    Save Note
                  </button>
                  <button className={`px-4 py-2 ${
                    darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  } rounded-xl text-sm transition-colors`}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
