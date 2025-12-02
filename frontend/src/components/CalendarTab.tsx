import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Video,
  Stethoscope,
  ClipboardList,
  ChevronDown,
  Plus
} from 'lucide-react';
import { api, Appointment } from '../services/api';

interface CalendarTabProps {
  darkMode: boolean;
}

export function CalendarTab({ darkMode }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  // Form fields - matching Streamlit exactly
  const [patient, setPatient] = useState('');
  const [title, setTitle] = useState('');
  const [visitType, setVisitType] = useState('Consultation');
  const [status, setStatus] = useState('confirmed');
  const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0]);
  const [timeValue, setTimeValue] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('Telehealth');
  const [notes, setNotes] = useState('');

  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const inputBgClass = darkMode
    ? 'bg-slate-700/50 border-slate-600/40'
    : 'bg-white/50 border-white/40';

  // Load appointments
  useEffect(() => {
    loadAppointments();
  }, [currentMonth]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

      const data = await api.getAppointments({
        start: start.toISOString(),
        end: end.toISOString(),
      });
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!patient.trim()) {
      setMessage({ text: 'Please add the patient name or MRN.', type: 'error' });
      return;
    }
    if (!title.trim()) {
      setMessage({ text: 'Please add a visit title.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      // Combine date and time into start_time
      const startDateTime = new Date(`${dateValue}T${timeValue}`);

      // Calculate end_time by adding duration
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const appointmentData = {
        title: title.trim(),
        patient_name: patient.trim(),
        appointment_type: visitType,
        status: status,
        location: location.trim() || 'Clinic',
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        notes: notes.trim() || undefined,
      };

      await api.createAppointment(appointmentData);

      setMessage({ text: 'Appointment scheduled.', type: 'success' });

      // Reset form
      setPatient('');
      setTitle('');
      setVisitType('Consultation');
      setStatus('confirmed');
      setDateValue(new Date().toISOString().split('T')[0]);
      setTimeValue('09:00');
      setDuration(60);
      setLocation('Telehealth');
      setNotes('');

      // Reload appointments
      await loadAppointments();
    } catch (err: any) {
      setMessage({ text: err.message || 'Unable to create appointment.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Navigate months
  const shiftMonth = (delta: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Calculate appointment stats
  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    return aptDate.getMonth() === currentMonth.getMonth() &&
           aptDate.getFullYear() === currentMonth.getFullYear();
  });

  const followUpCount = monthAppointments.filter(apt => apt.appointment_type === 'Follow-up').length;
  const procedureCount = monthAppointments.filter(apt => apt.appointment_type === 'Procedure').length;
  const telehealthCount = monthAppointments.filter(apt => apt.appointment_type === 'Telehealth').length;

  const stats = [
    {
      label: 'Total Appointments',
      value: monthAppointments.length.toString(),
      change: '+5 vs last week',
      icon: ClipboardList,
      color: 'text-blue-500',
    },
    {
      label: 'Follow-ups',
      value: followUpCount.toString(),
      change: 'Auto reminders enabled',
      icon: ClipboardList,
      color: 'text-purple-500',
    },
    {
      label: 'Procedures',
      value: procedureCount.toString(),
      change: 'OR blocks confirmed',
      icon: Stethoscope,
      color: 'text-indigo-500',
    },
    {
      label: 'Telehealth',
      value: telehealthCount.toString(),
      change: 'Remote visits',
      icon: Video,
      color: 'text-green-500',
    },
  ];

  // Get calendar days for the month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate.getFullYear() === date.getFullYear() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getDate() === date.getDate();
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  // Get today's appointments
  const todaysAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    const today = new Date();
    return aptDate.getFullYear() === today.getFullYear() &&
           aptDate.getMonth() === today.getMonth() &&
           aptDate.getDate() === today.getDate();
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  // Get upcoming appointments (next 3 after today)
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return aptDate > today;
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).slice(0, 3);

  const EVENT_COLORS: Record<string, string> = {
    'Consultation': 'bg-blue-500',
    'Follow-up': 'bg-sky-500',
    'Procedure': 'bg-pink-500',
    'Telehealth': 'bg-green-500',
    'Rounding': 'bg-orange-500',
  };

  const STATUS_COLORS: Record<string, string> = {
    'confirmed': 'bg-green-500',
    'pending': 'bg-orange-500',
    'hold': 'bg-yellow-500',
    'cancelled': 'bg-red-500',
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-xl ${textClass} mb-1 flex items-center gap-2`}>
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          Care Team Calendar
        </h2>
        <p className={textSecondaryClass}>A Google Calendar-style hub for consults, procedures, and follow-ups.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-5 border shadow-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-3xl ${textClass} mb-1`}>{stat.value}</div>
            <div className={`text-sm ${textSecondaryClass} mb-1`}>{stat.label}</div>
            <div className="text-xs text-green-500">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Calendar Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shiftMonth(-1)}
                  className={`p-2 ${inputBgClass} rounded-lg border hover:border-purple-500/50 transition-all`}
                >
                  <ChevronLeft className={`w-5 h-5 ${textClass}`} />
                </motion.button>
                <h3 className={`text-2xl ${textClass}`}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shiftMonth(1)}
                  className={`p-2 ${inputBgClass} rounded-lg border hover:border-purple-500/50 transition-all`}
                >
                  <ChevronRight className={`w-5 h-5 ${textClass}`} />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToToday}
                className={`px-4 py-2 ${inputBgClass} border rounded-lg ${textClass} text-sm hover:border-purple-500/50 transition-all`}
              >
                Today
              </motion.button>
            </div>

            <p className={`text-sm ${textSecondaryClass} mb-6`}>Synced across the whole care team</p>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className={`text-center text-xs ${textSecondaryClass} py-2 uppercase font-semibold`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dayInfo, index) => {
                  const dayAppointments = getAppointmentsForDay(dayInfo.date);
                  const isTodayDate = isToday(dayInfo.date);

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`
                        relative min-h-[80px] p-2 rounded-lg border transition-all cursor-pointer
                        ${isTodayDate
                          ? 'bg-purple-500/20 border-purple-500'
                          : darkMode
                            ? 'bg-slate-700/30 border-slate-600/40 hover:border-slate-500'
                            : 'bg-slate-50/50 border-slate-200/40 hover:border-slate-300'
                        }
                        ${!dayInfo.isCurrentMonth ? 'opacity-40' : ''}
                      `}
                    >
                      <div className={`text-sm ${textClass} mb-1 font-semibold`}>{dayInfo.day}</div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((appointment, idx) => (
                          <div
                            key={idx}
                            className={`${EVENT_COLORS[appointment.appointment_type] || 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded truncate`}
                            title={appointment.title}
                          >
                            {appointment.title}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className={`text-xs ${textSecondaryClass}`}>
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Today's Agenda */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-5 border shadow-lg`}
          >
            <h3 className={`${textClass} mb-3 font-semibold`}>Today's agenda</h3>
            {todaysAppointments.length === 0 ? (
              <p className={`text-sm ${textSecondaryClass}`}>No events scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todaysAppointments.map((apt, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-slate-700/30' : 'bg-white/40'} rounded-lg p-3 border ${darkMode ? 'border-slate-600/30' : 'border-white/30'}`}>
                    <div className={`font-semibold ${textClass} text-sm mb-1`}>{apt.title}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[apt.status] || 'bg-gray-500'}`}></div>
                      <span className={`text-xs ${textSecondaryClass}`}>
                        {new Date(apt.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`text-xs ${textSecondaryClass}`}>
                      {apt.patient_name} • {apt.appointment_type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-5 border shadow-lg`}
          >
            <h3 className={`${textClass} mb-3 font-semibold`}>Upcoming</h3>
            {upcomingAppointments.length === 0 ? (
              <p className={`text-sm ${textSecondaryClass}`}>No pending events.</p>
            ) : (
              <div className="space-y-2">
                {upcomingAppointments.map((apt, idx) => {
                  const aptDate = new Date(apt.start_time);
                  return (
                    <div key={idx} className={`pb-2 border-b ${darkMode ? 'border-slate-700/50' : 'border-slate-200/50'} last:border-0`}>
                      <div className={`font-semibold ${textClass} text-sm`}>
                        {aptDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className={`text-xs ${textSecondaryClass}`}>
                        {aptDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {apt.title}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'} text-purple-500 text-xs rounded-full`}>
                        {apt.appointment_type}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Slot Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-5 border shadow-lg`}
          >
            <h3 className={`${textClass} mb-4 font-semibold`}>Quick slot</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient / MRN */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Patient / MRN</label>
                <input
                  type="text"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                  required
                />
              </div>

              {/* Visit Title */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Visit title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Cardiology Consult"
                  className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                  required
                />
              </div>

              {/* Visit Type */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Visit type</label>
                <div className="relative">
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer`}
                  >
                    <option>Consultation</option>
                    <option>Follow-up</option>
                    <option>Procedure</option>
                    <option>Telehealth</option>
                    <option>Rounding</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Status</label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer`}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="hold">Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Date</label>
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Time</label>
                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Duration</label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer`}
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                    <option value={120}>120 min</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Location / modality</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 ${inputBgClass} backdrop-blur-sm border rounded-lg ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none`}
                />
              </div>

              {/* Message Display */}
              {message && (
                <div className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  'Scheduling...'
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Schedule slot
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
