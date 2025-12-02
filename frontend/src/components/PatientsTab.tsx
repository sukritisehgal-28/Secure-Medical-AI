import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Users, Heart, AlertTriangle, Calendar, Info } from 'lucide-react';
import { api, Patient, NoteSummary } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

interface PatientsTabProps {
  darkMode: boolean;
}

export function PatientsTab({ darkMode }: PatientsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'detail' | 'analytics'>('overview');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchMessage, setSearchMessage] = useState('');

  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const inputBgClass = darkMode
    ? 'bg-slate-700/50 border-slate-600/40'
    : 'bg-white/50 border-white/40';

  // Load patients and notes from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [patientsData, notesData] = await Promise.all([
        api.getPatients(),
        api.getNotes(),
      ]);
      setPatients(patientsData);
      setNotes(notesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date_of_birth
  const calculateAge = (dob: string): number => {
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  // Search patient by ID or name
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchMessage('');
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    let found = null;

    // Try searching by ID
    if (!isNaN(Number(query))) {
      found = patients.find(p => p.id.toString() === query);
    }

    // Try searching by name
    if (!found) {
      found = patients.find(p => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
        return fullName.includes(query);
      });
    }

    if (found) {
      setSearchMessage(`✓ Located ${found.first_name} ${found.last_name}`);
    } else {
      setSearchMessage('⚠ No patient matched that query.');
    }
  };

  const subTabs = [
    { id: 'overview' as const, label: 'Overview', icon: Users },
    { id: 'detail' as const, label: 'Patient Detail', icon: Heart },
    { id: 'analytics' as const, label: 'Analytics', icon: AlertTriangle },
  ];

  // Get risk level (mock based on index for now - in production would come from AI)
  const getRiskLevel = (index: number): string => {
    return ['Low', 'Medium', 'High'][index % 3];
  };

  // Get notes for a specific patient
  const getPatientNotes = (patientId: number): Note[] => {
    return notes.filter(note => note.patient_id === patientId).slice(0, 2);
  };

  // Overview Tab: Stats cards + grid of first 6 patients
  const renderOverview = () => {
    const stats = [
      { title: 'Active Patients', value: patients.length.toString(), trend: '+3 this week', icon: '👥' },
      { title: 'Chronic Care', value: '18', trend: 'engaged', icon: '🩺' },
      { title: 'High Risk', value: '4', trend: 'requires review', icon: '⚠️' },
      { title: 'Upcoming Visits', value: '12', trend: 'next 7 days', icon: '📅' },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h3 className={`text-sm ${textSecondaryClass} mb-1`}>{stat.title}</h3>
              <div className={`text-3xl ${textClass} mb-1`}>{stat.value}</div>
              <p className="text-xs text-green-500">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Patient Grid - First 6 patients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.slice(0, 6).map((patient, index) => {
            const name = `${patient.first_name} ${patient.last_name}`;
            const risk = getRiskLevel(index);
            const history = patient.medical_history || 'General Care';

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-5 border shadow-lg hover:border-purple-500/50 transition-all`}
              >
                <div className="mb-3">
                  <h4 className={`${textClass} text-lg mb-1 font-semibold`}>{name}</h4>
                  <p className={`text-xs ${textSecondaryClass}`}>MRN: {patient.medical_record_number}</p>
                </div>
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      risk === 'High'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : risk === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : 'bg-green-500/20 text-green-400 border border-green-500/40'
                    }`}
                  >
                    {risk.toUpperCase()}
                  </span>
                </div>
                <p className={`text-sm ${textSecondaryClass} line-clamp-2`}>
                  {history.substring(0, 60)}...
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Patient Detail Tab: All patients with full information
  const renderPatientDetail = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className={`text-xl ${textClass} mb-1`}>Comprehensive Patient Details</h3>
          <p className={textSecondaryClass}>All patient records in one view.</p>
        </div>

        {patients.map((patient, index) => {
          const name = `${patient.first_name} ${patient.last_name}`;
          const age = calculateAge(patient.date_of_birth);
          const patientNotes = getPatientNotes(patient.id);

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border-l-4 border-l-purple-500/50 shadow-lg`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-400 mb-2">
                    MRN {patient.medical_record_number}
                  </div>
                  <h3 className={`text-xl ${textClass} font-semibold`}>{name}</h3>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-400">
                  Age {age}
                </div>
              </div>

              {/* Patient Details - 4 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className={`${darkMode ? 'bg-slate-700/30' : 'bg-white/40'} rounded-xl p-4 border ${darkMode ? 'border-slate-600/30' : 'border-white/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <h4 className={`text-xs ${textSecondaryClass} uppercase`}>Allergies</h4>
                  </div>
                  <p className={`text-sm ${textClass}`}>{patient.allergies || 'None'}</p>
                </div>

                <div className={`${darkMode ? 'bg-slate-700/30' : 'bg-white/40'} rounded-xl p-4 border ${darkMode ? 'border-slate-600/30' : 'border-white/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-green-500" />
                    <h4 className={`text-xs ${textSecondaryClass} uppercase`}>Patient ID</h4>
                  </div>
                  <p className={`text-sm ${textClass}`}>{patient.id}</p>
                </div>

                <div className={`${darkMode ? 'bg-slate-700/30' : 'bg-white/40'} rounded-xl p-4 border ${darkMode ? 'border-slate-600/30' : 'border-white/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-purple-500" />
                    <h4 className={`text-xs ${textSecondaryClass} uppercase`}>DOB</h4>
                  </div>
                  <p className={`text-sm ${textClass}`}>{patient.date_of_birth}</p>
                </div>

                <div className={`${darkMode ? 'bg-slate-700/30' : 'bg-white/40'} rounded-xl p-4 border ${darkMode ? 'border-slate-600/30' : 'border-white/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-orange-500" />
                    <h4 className={`text-xs ${textSecondaryClass} uppercase`}>History</h4>
                  </div>
                  <p className={`text-sm ${textClass} line-clamp-2`}>{patient.medical_history || 'No history recorded'}</p>
                </div>
              </div>

              {/* Recent Notes */}
              {patientNotes.length > 0 && (
                <div>
                  <h4 className={`text-sm ${textClass} font-semibold mb-3`}>Recent Notes</h4>
                  <div className="space-y-2">
                    {patientNotes.map(note => (
                      <div
                        key={note.id}
                        className={`${darkMode ? 'bg-slate-700/40' : 'bg-white/50'} rounded-xl p-4 border ${darkMode ? 'border-slate-600/30' : 'border-white/30'}`}
                      >
                        <div className={`font-semibold ${textClass} mb-2`}>{note.title}</div>
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-full">
                            {note.note_type.charAt(0).toUpperCase() + note.note_type.slice(1)}
                          </span>
                          <span className={`px-2 py-0.5 ${darkMode ? 'bg-slate-600/50' : 'bg-slate-200/50'} text-xs rounded-full ${textSecondaryClass}`}>
                            {note.created_at.substring(0, 10)}
                          </span>
                        </div>
                        <p className={`text-sm ${textSecondaryClass} line-clamp-2`}>
                          {note.content.substring(0, 160)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Analytics Tab: Charts and insights
  const renderAnalytics = () => {
    // Prepare analytics data
    const analyticsData = patients.map((p, idx) => ({
      name: `${p.first_name} ${p.last_name}`,
      age: calculateAge(p.date_of_birth),
      risk: getRiskLevel(idx),
      medical_history: p.medical_history || 'General Care',
    }));

    // Population insights
    const medianAge = analyticsData.length > 0
      ? analyticsData.map(p => p.age).sort((a, b) => a - b)[Math.floor(analyticsData.length / 2)]
      : 0;
    const highRiskCount = analyticsData.filter(p => p.risk === 'High').length;
    const chronicRegex = /diabetes|hypertension|copd|asthma/i;
    const chronicPercentage = analyticsData.length > 0
      ? Math.round((analyticsData.filter(p => chronicRegex.test(p.medical_history)).length / analyticsData.length) * 100)
      : 0;

    // Risk distribution data for pie chart
    const riskCounts = analyticsData.reduce((acc, p) => {
      acc[p.risk] = (acc[p.risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskData = Object.entries(riskCounts).map(([name, value]) => ({ name, value }));
    const RISK_COLORS = { Low: '#4cc9f0', Medium: '#f9c74f', High: '#f94144' };

    // Age histogram data
    const ageRanges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-30', min: 21, max: 30, count: 0 },
      { range: '31-40', min: 31, max: 40, count: 0 },
      { range: '41-50', min: 41, max: 50, count: 0 },
      { range: '51-60', min: 51, max: 60, count: 0 },
      { range: '61-70', min: 61, max: 70, count: 0 },
      { range: '71-80', min: 71, max: 80, count: 0 },
      { range: '81+', min: 81, max: 150, count: 0 },
    ];

    analyticsData.forEach(p => {
      const ageRange = ageRanges.find(r => p.age >= r.min && p.age <= r.max);
      if (ageRange) ageRange.count++;
    });

    const ageHistogramData = ageRanges.map(r => ({ age: r.range, count: r.count }));

    // Condition frequency data
    const conditionCounts: Record<string, number> = {};
    analyticsData.forEach(p => {
      p.medical_history.split(',').forEach(condition => {
        const trimmed = condition.trim();
        if (trimmed) {
          conditionCounts[trimmed] = (conditionCounts[trimmed] || 0) + 1;
        }
      });
    });

    const conditionData = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([condition, count]) => ({ condition, count }));

    // Risk vs Age scatter data
    const riskScoreMap = { Low: 1, Medium: 2, High: 3 };
    const scatterData = analyticsData.map(p => ({
      age: p.age,
      riskScore: riskScoreMap[p.risk as keyof typeof riskScoreMap],
      risk: p.risk,
      name: p.name,
    }));

    // Follow-up data (mock)
    const today = new Date();
    const followUpData = analyticsData.slice(0, 5).map((p, idx) => {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + (idx + 1) * 7);
      return {
        Patient: p.name,
        'Next Follow-up': nextDate.toISOString().split('T')[0],
        Priority: ['Routine', 'High', 'Routine', 'Medium', 'Routine'][idx],
      };
    });

    return (
      <div className="space-y-6">
        {/* Population Insights */}
        <div>
          <h3 className={`text-lg ${textClass} mb-4`}>Population Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="text-3xl mb-2">🎂</div>
              <h4 className={`text-sm ${textSecondaryClass} mb-1`}>Median Age</h4>
              <div className={`text-3xl ${textClass}`}>{medianAge}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="text-3xl mb-2">⚠️</div>
              <h4 className={`text-sm ${textSecondaryClass} mb-1`}>High-Risk Cohort</h4>
              <div className={`text-3xl ${textClass}`}>{highRiskCount}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
            >
              <div className="text-3xl mb-2">🧬</div>
              <h4 className={`text-sm ${textSecondaryClass} mb-1`}>Chronic Condition %</h4>
              <div className={`text-3xl ${textClass}`}>{chronicPercentage}%</div>
            </motion.div>
          </div>
        </div>

        {/* Charts Row 1: Risk Distribution & Age Spectrum */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
          >
            <h4 className={`text-md ${textClass} mb-4`}>Risk Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
          >
            <h4 className={`text-md ${textClass} mb-4`}>Age Spectrum</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageHistogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="age" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#7b2cbf" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Condition Frequency Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
        >
          <h4 className={`text-md ${textClass} mb-4`}>Condition Frequency</h4>
          {conditionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conditionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="condition" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className={textSecondaryClass}>No condition data available.</p>
          )}
        </motion.div>

        {/* Risk vs Age Correlation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
        >
          <h4 className={`text-md ${textClass} mb-4`}>Risk vs Age Correlation</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="age" name="Age" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis
                dataKey="riskScore"
                name="Risk"
                stroke={darkMode ? '#94a3b8' : '#64748b'}
                domain={[0, 4]}
                ticks={[1, 2, 3]}
                tickFormatter={(value) => ['', 'Low', 'Medium', 'High'][value] || ''}
              />
              <Tooltip
                contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }}
                formatter={(value, name, props) => {
                  if (name === 'riskScore') return [props.payload.risk, 'Risk'];
                  return [value, name];
                }}
              />
              <Scatter name="Patients" data={scatterData} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Follow-up Outlook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
        >
          <h4 className={`text-md ${textClass} mb-4`}>Follow-up Outlook</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <th className={`text-left py-3 px-4 ${textClass} font-semibold`}>Patient</th>
                  <th className={`text-left py-3 px-4 ${textClass} font-semibold`}>Next Follow-up</th>
                  <th className={`text-left py-3 px-4 ${textClass} font-semibold`}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {followUpData.map((row, idx) => (
                  <tr key={idx} className={`border-b ${darkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                    <td className={`py-3 px-4 ${textClass}`}>{row.Patient}</td>
                    <td className={`py-3 px-4 ${textSecondaryClass}`}>{row['Next Follow-up']}</td>
                    <td className={`py-3 px-4`}>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          row.Priority === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : row.Priority === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {row.Priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textClass}`}>Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textSecondaryClass}`}>No patients found. Use the API to seed sample data.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-xl ${textClass} mb-1`}>Patient Intelligence Workspace</h2>
        <p className={textSecondaryClass}>Search, triage, and analyze every patient from one secure dashboard.</p>
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or Name (e.g. 4 or Jane)"
              className={`w-full pl-12 pr-4 py-3 ${inputBgClass} backdrop-blur-sm border rounded-xl ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            🔎 Search
          </motion.button>
        </div>
        {searchMessage && (
          <div className={`text-sm ${searchMessage.includes('✓') ? 'text-green-500' : 'text-yellow-500'}`}>
            {searchMessage}
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className={`inline-flex gap-2 p-1.5 ${cardBgClass} backdrop-blur-xl rounded-2xl border shadow-lg`}>
        {subTabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSubTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeSubTab === tab.id
                ? darkMode
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : darkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      {activeSubTab === 'overview' && renderOverview()}
      {activeSubTab === 'detail' && renderPatientDetail()}
      {activeSubTab === 'analytics' && renderAnalytics()}
    </div>
  );
}
