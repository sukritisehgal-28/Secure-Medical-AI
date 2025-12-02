import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Brain,
  Calendar as CalendarIcon,
  Shield,
  Activity,
} from 'lucide-react';
import { PatientsTab } from './PatientsTab';
import { ClinicalNotesTab } from './ClinicalNotesTab';
import { TasksTab } from './TasksTab';
import { CalendarTab } from './CalendarTab';
import { AIAnalyticsTab } from './AIAnalyticsTab';

interface DoctorDashboardProps {
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export function DoctorDashboard({ onLogout, darkMode, setDarkMode }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'notes' | 'tasks' | 'analytics' | 'calendar'>('dashboard');

  // Shared task state between TasksTab and AIAnalyticsTab
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review lab results for Patient #1',
      description: 'Check blood work and update treatment plan',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:00',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Follow-up consultation - Patient #2',
      description: 'Post-surgery check-up and medication review',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dueTime: '10:30',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]);

  const stats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: '5',
      change: '+2 this week',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      label: 'Active Notes',
      value: '73',
      change: '+15 today',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: AlertTriangle,
      label: 'High Risk',
      value: '2',
      change: 'Requires review',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: ClipboardCheck,
      label: 'Pending Reviews',
      value: '8',
      change: 'Due today',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const recentNotes = [
    {
      title: 'Follow-up Visit - Hypertension',
      patientId: 'Patient #--',
      date: '2025-06-18 23:28',
      icon: Activity,
    },
    {
      title: 'Mental Health Screening',
      patientId: 'Patient #--',
      date: '2025-10-08 23:28',
      icon: Brain,
    },
  ];

  const highRiskPatients = [
    {
      initials: 'JD',
      name: 'John Doe',
      mrn: 'MRN-1124',
      risk: 'High',
      condition: 'Post-surgical monitoring',
    },
    {
      initials: 'JS',
      name: 'Jane Smith',
      mrn: 'MRN-1188',
      risk: 'Medium',
      condition: 'Diabetes complications',
    },
    {
      initials: 'ML',
      name: 'Marcus Lee',
      mrn: 'MRN-1320',
      risk: 'High',
      condition: 'CHF readmission risk',
    },
  ];

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as const, label: 'Patients', icon: UserCircle },
    { id: 'notes' as const, label: 'Clinical Notes', icon: FileText },
    { id: 'tasks' as const, label: 'Tasks', icon: ClipboardCheck },
    { id: 'analytics' as const, label: 'AI & Analytics', icon: Brain },
    { id: 'calendar' as const, label: 'Calendar', icon: CalendarIcon },
  ];

  const bgClass = darkMode
    ? 'bg-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-white to-purple-50/30';
  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Background Effects */}
      {!darkMode && (
        <>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-grid-dashboard" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M50 20 L50 35 M50 65 L50 80 M35 50 L20 50 M80 50 L65 50 M42 50 L58 50 M50 42 L50 58" stroke="#6366f1" strokeWidth="2" fill="none"/>
                  <circle cx="50" cy="50" r="25" stroke="#6366f1" strokeWidth="1" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-grid-dashboard)"/>
            </svg>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
          </div>
        </>
      )}

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${cardBgClass} backdrop-blur-xl border-b shadow-lg`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Greeting */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl ${textClass}`}>Hello, Doc</h1>
                  <p className="text-sm text-green-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Session Active
                  </p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-4">
                {/* HIPAA Mode Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 rounded-full">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">HIPAA Mode</span>
                </div>

                {/* Date & Time */}
                <div className="hidden md:block text-right">
                  <p className={`text-sm ${textSecondaryClass}`}>Nov 15, 10:46 PM</p>
                </div>

                {/* Dark Mode Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 ${cardBgClass} backdrop-blur-sm rounded-xl border hover:border-purple-500/50 transition-all`}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-indigo-600" />
                  )}
                </motion.button>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Workspace Badge */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-2 text-sm">
            <Shield className={`w-3.5 h-3.5 ${textSecondaryClass}`} />
            <span className={textSecondaryClass}>Secure workspace • Doctor</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className={`inline-flex gap-2 p-1.5 ${cardBgClass} backdrop-blur-xl rounded-2xl border shadow-lg`}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : darkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline text-sm">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Section Title */}
              <div className="mb-6">
                <h2 className={`text-xl ${textClass} mb-1`}>Clinical Command Center</h2>
                <p className={textSecondaryClass}>Real-time intelligence for your patient panel.</p>
              </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-3xl mb-2 ${textClass}`}>{stat.value}</h3>
                <p className={`text-sm ${textSecondaryClass} mb-1`}>{stat.label}</p>
                <p className="text-xs text-green-500">{stat.change}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Notes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <h3 className={`text-lg ${textClass} mb-4`}>Recent Notes</h3>
              <div className="space-y-4">
                {recentNotes.map((note, index) => (
                  <div
                    key={index}
                    className={`p-4 ${
                      darkMode ? 'bg-slate-700/50' : 'bg-white/60'
                    } rounded-xl border ${
                      darkMode ? 'border-slate-600' : 'border-white/40'
                    } hover:border-purple-500/50 transition-all cursor-pointer group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                        <note.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`${textClass} mb-1`}>{note.title}</h4>
                        <p className={`text-sm ${textSecondaryClass}`}>{note.patientId}</p>
                        <p className="text-xs text-purple-400 mt-2">{note.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* High-Risk Patients */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <h3 className={`text-lg ${textClass} mb-4`}>High-Risk Patients</h3>
              <div className="space-y-4">
                {highRiskPatients.map((patient, index) => (
                  <div
                    key={index}
                    className={`p-4 ${
                      darkMode ? 'bg-slate-700/50' : 'bg-white/60'
                    } rounded-xl border ${
                      darkMode ? 'border-slate-600' : 'border-white/40'
                    } hover:border-red-500/50 transition-all cursor-pointer group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          {patient.initials}
                        </div>
                        {patient.risk === 'High' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`${textClass} mb-1`}>{patient.name}</h4>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className={`text-xs ${textSecondaryClass}`}>{patient.mrn}</p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                              patient.risk === 'High'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                            }`}
                          >
                            {patient.risk === 'High' ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <Activity className="w-3 h-3" />
                            )}
                            Risk: {patient.risk}
                          </span>
                        </div>
                        <p className={`text-xs ${textSecondaryClass}`}>{patient.condition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
            </>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && <PatientsTab darkMode={darkMode} />}

          {/* Clinical Notes Tab */}
          {activeTab === 'notes' && <ClinicalNotesTab darkMode={darkMode} />}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && <TasksTab darkMode={darkMode} tasks={tasks} setTasks={setTasks} />}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && <AIAnalyticsTab darkMode={darkMode} tasks={tasks} setActiveTab={setActiveTab} />}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && <CalendarTab darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}
