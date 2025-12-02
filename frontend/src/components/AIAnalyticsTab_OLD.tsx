import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Users,
  FileText,
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Loader,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Heart,
  LineChart,
  X,
} from 'lucide-react';
import { api, Patient, Note, Appointment } from '../services/api';

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

interface AIAnalyticsTabProps {
  darkMode: boolean;
  tasks: Task[];
  setActiveTab: (tab: 'dashboard' | 'patients' | 'notes' | 'tasks' | 'analytics' | 'calendar') => void;
}

interface HighRiskPatient {
  patient_id: number;
  patient_name: string;
  risk_level: string;
  risk_score: number;
  recent_notes_count: number;
  last_visit: string;
  primary_concerns: string[];
}

interface PatientTimeline {
  patient: {
    id: number;
    name: string;
    mrn: string;
    dob: string;
    allergies: string;
    medical_history: string;
  };
  timeline: Array<{
    type: 'note' | 'appointment';
    id: number;
    date: string;
    title: string;
    content?: string;
    summary?: string;
    risk_level?: string;
    author?: string;
    reason?: string;
    status?: string;
  }>;
  ai_summary: string;
  statistics: {
    total_visits: number;
    total_appointments: number;
    risk_distribution: Record<string, number>;
    last_visit: string;
  };
}

export function AIAnalyticsTab({ darkMode, tasks, setActiveTab }: AIAnalyticsTabProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAIView, setActiveAIView] = useState<'summary' | 'high-risk' | 'timeline'>('summary');
  const [highRiskPatients, setHighRiskPatients] = useState<HighRiskPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientTimeline, setPatientTimeline] = useState<PatientTimeline | null>(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [loadingHighRisk, setLoadingHighRisk] = useState(false);

  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [patientsData, notesData, appointmentsData] = await Promise.all([
        api.getPatients(),
        api.getNotes(),
        api.getAppointments(),
      ]);
      setPatients(patientsData);
      setNotes(notesData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHighRiskPatients = async () => {
    try {
      setLoadingHighRisk(true);
      const response = await fetch(`${api.getBaseUrl()}/ai/high-risk-patients?limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHighRiskPatients(data.high_risk_patients || []);
      }
    } catch (error) {
      console.error('Failed to fetch high-risk patients:', error);
    } finally {
      setLoadingHighRisk(false);
    }
  };

  const fetchPatientTimeline = async (patientId: number) => {
    try {
      setLoadingTimeline(true);
      const response = await fetch(`${api.getBaseUrl()}/ai/patient-timeline/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatientTimeline(data);
      }
    } catch (error) {
      console.error('Failed to fetch patient timeline:', error);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleViewPatientTimeline = async (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveAIView('timeline');
    await fetchPatientTimeline(patient.id);
  };

  useEffect(() => {
    if (activeAIView === 'high-risk') {
      fetchHighRiskPatients();
    }
  }, [activeAIView]);

  // Calculate insights
  const totalPatients = patients.length;
  const recentNotes = notes.slice(0, 5);
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    const today = new Date();
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  const stats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: totalPatients.toString(),
      change: 'Active in system',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      label: 'Clinical Notes',
      value: notes.length.toString(),
      change: `${recentNotes.length} recent`,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: CalendarIcon,
      label: 'Appointments Today',
      value: todayAppointments.length.toString(),
      change: `${upcomingAppointments.length} upcoming`,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      label: 'Pending Tasks',
      value: pendingTasks.toString(),
      change: 'Requires attention',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  if (loading) {
    return (
      <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-12 border shadow-lg text-center`}>
        <Loader className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
        <p className={textSecondaryClass}>Loading AI analytics...</p>
      </div>
    );
  }

  // Calculate insights
  const totalPatients = patients.length;
  const recentNotes = notes.slice(0, 5);
  const notesWithAISummary = notes.filter(n => n.summary).length;
  const highRiskNotes = notes.filter(n => n.risk_level === 'HIGH').length;

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textClass}`}>AI Medical Intelligence</h2>
            <p className={textSecondaryClass}>
              AI-powered patient insights, risk assessment, and clinical decision support
            </p>
          </div>
        </div>
      </div>

      {/* AI View Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveAIView('summary')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
            activeAIView === 'summary'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              : 'bg-white/50 text-slate-600 hover:bg-white/80'
          }`}
        >
          <Sparkles className="w-5 h-5 inline mr-2" />
          AI Summary
        </button>
        <button
          onClick={() => setActiveAIView('high-risk')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
            activeAIView === 'high-risk'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              : 'bg-white/50 text-slate-600 hover:bg-white/80'
          }`}
        >
          <AlertTriangle className="w-5 h-5 inline mr-2" />
          High-Risk Patients
        </button>
        <button
          onClick={() => setActiveAIView('timeline')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
            activeAIView === 'timeline'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              : 'bg-white/50 text-slate-600 hover:bg-white/80'
          }`}
        >
          <LineChart className="w-5 h-5 inline mr-2" />
          Patient Timeline
        </button>
      </div>

      {/* AI Summary View */}
      {activeAIView === 'summary' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* AI Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg w-fit mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${textClass}`}>{notesWithAISummary}</h3>
              <p className={`text-sm ${textSecondaryClass}`}>AI-Analyzed Notes</p>
              <p className="text-xs text-purple-500 mt-1">
                {Math.round((notesWithAISummary / notes.length) * 100)}% of all notes
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg w-fit mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${textClass}`}>{highRiskNotes}</h3>
              <p className={`text-sm ${textSecondaryClass}`}>High-Risk Cases</p>
              <p className="text-xs text-red-500 mt-1">Requires immediate attention</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg w-fit mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${textClass}`}>{totalPatients}</h3>
              <p className={`text-sm ${textSecondaryClass}`}>Total Patients</p>
              <p className="text-xs text-green-500 mt-1">Under AI monitoring</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg w-fit mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${textClass}`}>AI Active</h3>
              <p className={`text-sm ${textSecondaryClass}`}>System Status</p>
              <p className="text-xs text-blue-500 mt-1">GPT-4 Enabled</p>
            </motion.div>
          </div>

          {/* Recent AI-Analyzed Notes */}
          <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className={`text-lg font-semibold ${textClass}`}>Recent AI-Analyzed Notes</h3>
            </div>
            <div className="space-y-3">
              {recentNotes.filter(n => n.summary).map((note) => {
                const patient = patients.find(p => p.id === note.patient_id);
                return (
                  <div
                    key={note.id}
                    className={`p-4 ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white/60 hover:bg-white/80'} rounded-xl border ${
                      darkMode ? 'border-slate-600' : 'border-white/40'
                    } cursor-pointer transition-all`}
                    onClick={() => setActiveTab('notes')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${textClass}`}>{note.title}</h4>
                        <p className={`text-sm ${textSecondaryClass}`}>
                          {patient && `${patient.first_name} ${patient.last_name}`} • {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {note.risk_level && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          note.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          note.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                          'bg-green-500/20 text-green-400 border border-green-500/40'
                        }`}>
                          {note.risk_level}
                        </span>
                      )}
                    </div>
                    {note.summary && (
                      <p className={`text-sm ${textSecondaryClass} line-clamp-2`}>{note.summary}</p>
                    )}
                  </div>
                );
              })}
              {recentNotes.filter(n => n.summary).length === 0 && (
                <p className={`text-center py-8 ${textSecondaryClass}`}>No AI-analyzed notes yet</p>
              )}
            </div>
          </div>

          {/* Patient List for Timeline Access */}
          <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className={`text-lg font-semibold ${textClass}`}>Patient Visit History</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {patients.slice(0, 6).map((patient) => {
                const patientNotes = notes.filter(n => n.patient_id === patient.id);
                return (
                  <div
                    key={patient.id}
                    onClick={() => handleViewPatientTimeline(patient)}
                    className={`p-4 ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white/60 hover:bg-white/80'} rounded-xl border ${
                      darkMode ? 'border-slate-600' : 'border-white/40'
                    } cursor-pointer transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold ${textClass}`}>{patient.first_name} {patient.last_name}</h4>
                        <p className={`text-sm ${textSecondaryClass}`}>{patientNotes.length} visits</p>
                      </div>
                      <LineChart className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-xl ${textClass} mb-1`}>AI & Analytics Dashboard</h2>
        <p className={textSecondaryClass}>
          Comprehensive overview of patient care, clinical documentation, and upcoming tasks
        </p>
      </div>

      {/* Main Layout: Summary on Left, Todo on Right */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Summary (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Recent Activity Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-500" />
              <h3 className={`text-lg ${textClass}`}>Recent Activity Summary</h3>
            </div>

            <div className="space-y-4">
              {/* Patients Summary */}
              <div className={`p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h4 className={`${textClass} font-semibold`}>Patients</h4>
                </div>
                <p className={`text-sm ${textSecondaryClass}`}>
                  {totalPatients} total patients in system
                  {patients.length > 0 && ` • Latest: ${patients[0].first_name} ${patients[0].last_name}`}
                </p>
              </div>

              {/* Notes Summary */}
              <div 
                onClick={() => setActiveTab('notes')}
                className={`p-4 ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white/60 hover:bg-white/80'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              } cursor-pointer transition-all`}>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h4 className={`${textClass} font-semibold`}>Clinical Notes</h4>
                </div>
                <p className={`text-sm ${textSecondaryClass}`}>
                  {notes.length} total notes • {recentNotes.length} created recently
                  {notes.length > 0 && ` • Latest: ${notes[0].title}`}
                </p>
              </div>

              {/* Appointments Summary */}
              <div className={`p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon className="w-5 h-5 text-green-400" />
                  <h4 className={`${textClass} font-semibold`}>Appointments</h4>
                </div>
                <p className={`text-sm ${textSecondaryClass}`}>
                  {todayAppointments.length} appointments today • {upcomingAppointments.length} upcoming
                </p>
              </div>

              {/* Tasks Summary */}
              <div className={`p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-400" />
                  <h4 className={`${textClass} font-semibold`}>Tasks</h4>
                </div>
                <p className={`text-sm ${textSecondaryClass}`}>
                  {pendingTasks} pending tasks • {tasks.filter(t => t.status === 'completed').length} completed
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-500" />
              <h3 className={`text-lg ${textClass}`}>AI-Powered Insights</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <h4 className={`text-sm ${textClass} font-semibold`}>Clinical Efficiency</h4>
                </div>
                <p className="text-2xl font-bold text-green-400 mb-1">86%</p>
                <p className={`text-xs ${textSecondaryClass}`}>
                  Documentation completion rate
                </p>
              </div>

              <div className={`p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h4 className={`text-sm ${textClass} font-semibold`}>Patient Load</h4>
                </div>
                <p className="text-2xl font-bold text-blue-400 mb-1">{totalPatients}</p>
                <p className={`text-xs ${textSecondaryClass}`}>
                  Active patients under care
                </p>
              </div>

              <div className={`p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                darkMode ? 'border-slate-600' : 'border-white/40'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <h4 className={`text-sm ${textClass} font-semibold`}>Task Completion</h4>
                </div>
                <p className="text-2xl font-bold text-purple-400 mb-1">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
                <p className={`text-xs ${textSecondaryClass}`}>
                  Completed tasks
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Quick Todo List (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg h-fit sticky top-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
              <h3 className={`text-lg ${textClass}`}>Quick Todo</h3>
            </div>
            <span className={`text-xs ${textSecondaryClass}`}>
              {tasks.filter(t => t.status === 'pending').length} pending
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                <p className={textSecondaryClass}>No pending tasks</p>
              </div>
            ) : (
              tasks.filter(t => t.status === 'pending').slice(0, 5).map((task) => {
                const isOverdue = new Date(`${task.dueDate}T${task.dueTime}`) < new Date();
                const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
                const isToday = dueDateTime.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={task.id}
                    className={`p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-xl border ${
                      isOverdue
                        ? 'border-red-500/50'
                        : darkMode
                        ? 'border-slate-600'
                        : 'border-white/40'
                    } hover:border-purple-500/50 transition-all cursor-pointer`}
                    onClick={() => setActiveTab('tasks')}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${textClass} mb-1 line-clamp-1`}>{task.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-xs ${isOverdue ? 'text-red-400' : textSecondaryClass} flex items-center gap-1`}>
                            <Clock className="w-3 h-3" />
                            {isToday ? task.dueTime : dueDateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {isToday && task.dueTime}
                          </p>
                          {isOverdue && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                        {task.priority === 'high' && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/40">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full p-3 border border-dashed ${
                darkMode ? 'border-slate-600 hover:border-purple-500/50' : 'border-slate-300 hover:border-purple-500/50'
              } rounded-xl transition-colors flex items-center justify-center gap-2 ${textSecondaryClass} hover:text-purple-500`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add task</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <button
              onClick={() => setActiveTab('tasks')}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-sm font-semibold"
            >
              View All Tasks
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
