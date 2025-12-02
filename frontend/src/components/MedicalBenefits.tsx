import React from 'react';
import { motion } from 'motion/react';
import { Brain, Lock, Zap, Users, FileCheck, Workflow } from 'lucide-react';
import { TestimonialsSlideshow } from './TestimonialsSlideshow';

interface MedicalBenefitsProps {
  darkMode: boolean;
}

export function MedicalBenefits({ darkMode }: MedicalBenefitsProps) {
  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Clinical Intelligence',
      description: 'Advanced natural language processing trained on millions of medical records for accurate, context-aware documentation.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Lock,
      title: 'Enterprise-Grade Security',
      description: 'HIPAA compliant with end-to-end encryption, role-based access control, and comprehensive audit trails.',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast Documentation',
      description: 'Reduce documentation time by 70%. Generate comprehensive clinical notes in under 30 seconds.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Multi-Specialty Support',
      description: 'Optimized templates for primary care, cardiology, psychiatry, emergency medicine, and 20+ specialties.',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: FileCheck,
      title: 'Quality Assurance Built-In',
      description: 'Automated verification checks ensure clinical accuracy and completeness before finalization.',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: Workflow,
      title: 'Seamless EHR Integration',
      description: 'Integrate directly with Epic, Cerner, Athenahealth, and other major electronic health record systems.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="relative py-24 px-6 overflow-hidden">
      {/* Background Elements */}
      {!darkMode && <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>}

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className={`inline-block px-4 py-2 ${
            darkMode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-purple-100 text-purple-700'
          } rounded-full text-sm mb-4`}>
            Why Healthcare Professionals Choose Us
          </div>
          <h2 className={`text-5xl ${textClass} mb-4`}>
            Built for Modern Healthcare
          </h2>
          <p className={`text-xl ${textSecondaryClass} max-w-2xl mx-auto`}>
            Cutting-edge AI technology designed specifically for clinical workflows, compliance, and patient care excellence.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className={`relative h-full ${cardBgClass} backdrop-blur-lg rounded-3xl p-8 border shadow-lg hover:shadow-2xl transition-all duration-300`}>
                {/* Icon with Gradient */}
                <div className={`inline-flex p-4 bg-gradient-to-br ${benefit.gradient} rounded-2xl mb-6 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className={`text-xl ${textClass} mb-3`}>
                  {benefit.title}
                </h3>
                <p className={`${textSecondaryClass} leading-relaxed`}>
                  {benefit.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Slideshow */}
      <TestimonialsSlideshow darkMode={darkMode} />

      <div className="max-w-7xl mx-auto relative">
        {/* Medical Specialties Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className={`mt-16 ${
            darkMode 
              ? 'bg-slate-800/60 border-slate-700/40' 
              : 'bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-white/40'
          } backdrop-blur-lg rounded-3xl p-8 border`}
        >
          <div className="text-center mb-6">
            <h3 className={`text-2xl ${textClass} mb-2`}>Trusted Across Medical Specialties</h3>
            <p className={textSecondaryClass}>Supporting diverse clinical practices with specialized templates</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Primary Care',
              'Cardiology',
              'Psychiatry',
              'Emergency Medicine',
              'Pediatrics',
              'Oncology',
              'Surgery',
              'Neurology',
              'Radiology',
              'Internal Medicine',
            ].map((specialty) => (
              <span
                key={specialty}
                className={`px-4 py-2 ${
                  darkMode 
                    ? 'bg-slate-700/60 text-slate-300 border-slate-600/40 hover:border-purple-500/50 hover:bg-slate-700' 
                    : 'bg-white/60 text-slate-700 border-white/40 hover:border-purple-300 hover:bg-white/80'
                } backdrop-blur-sm rounded-full text-sm border transition-all duration-200`}
              >
                {specialty}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
