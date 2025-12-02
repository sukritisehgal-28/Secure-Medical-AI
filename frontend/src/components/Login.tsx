import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Stethoscope, Heart, Moon, Sun, AlertCircle, User, Check } from 'lucide-react';
import { api } from '../services/api';

interface LoginProps {
  onBackToHome: () => void;
  onDoctorLogin: () => void;
  onNurseLogin: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Login({ onBackToHome, onDoctorLogin, onNurseLogin, darkMode, setDarkMode }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'nurse'>('doctor');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.register({
        email,
        password,
        full_name: fullName,
        role: selectedRole
      });
      setSuccess('Account created successfully! You can now login.');
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
      // Switch to login mode after 2 seconds
      setTimeout(() => {
        setIsSignUp(false);
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.login(email, password);
      // Navigate based on role
      if (selectedRole === 'doctor' || email.toLowerCase().includes('dr') || email.toLowerCase().includes('doctor')) {
        onDoctorLogin();
      } else if (selectedRole === 'nurse' || email.toLowerCase().includes('nurse')) {
        onNurseLogin();
      } else {
        onDoctorLogin(); // Default to doctor
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'doctor' | 'nurse') => {
    setSelectedRole(role);
    setLoading(true);
    setError('');

    try {
      // Use demo credentials
      const demoEmail = role === 'doctor' ? 'dr.williams@hospital.com' : 'nurse.davis@hospital.com';
      const demoPassword = 'password123';

      await api.login(demoEmail, demoPassword);

      if (role === 'doctor') {
        onDoctorLogin();
      } else {
        onNurseLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed. Please ensure API is running.');
    } finally {
      setLoading(false);
    }
  };

  const bgClass = darkMode
    ? 'bg-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-white to-purple-50/30';
  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-white/20';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex items-center justify-center px-6 py-12 overflow-hidden relative`}>
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

      {/* Medical Background Pattern */}
      {!darkMode && <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-grid-login" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 20 L50 35 M50 65 L50 80 M35 50 L20 50 M80 50 L65 50 M42 50 L58 50 M50 42 L50 58" stroke="#6366f1" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="25" stroke="#6366f1" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid-login)"/>
        </svg>
      </div>}

      {/* Ambient Background Orbs */}
      {!darkMode && <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>}

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onBackToHome}
        className={`fixed top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 ${
          darkMode ? 'bg-slate-800/60 border-slate-700/40' : 'bg-white/60 border-white/40'
        } backdrop-blur-md rounded-full shadow-lg border hover:border-purple-500/50 transition-all duration-300 group`}
      >
        <ArrowLeft className={`w-4 h-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'} group-hover:-translate-x-1 transition-transform`} />
        <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} text-sm md:text-base`}>Back to Home</span>
      </motion.button>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative max-w-md w-full"
      >
        {/* Glassy Container */}
        <div className={`relative ${cardBgClass} backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border`}>
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 blur-2xl opacity-50"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl ${textClass} mb-2`}>{isSignUp ? 'Create Account' : 'Secure Login'}</h2>
              <p className={textSecondaryClass}>{isSignUp ? 'Register to start using the platform' : 'Select your role and authenticate to continue'}</p>
            </div>

            {/* Sign-Up / Login Toggle */}
            <div className="mb-6">
              <div className="flex gap-2 p-1 bg-white/30 dark:bg-slate-700/30 rounded-xl backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-2 rounded-lg transition-all ${!isSignUp ? (darkMode ? 'bg-slate-800 shadow-md text-white' : 'bg-white shadow-md text-slate-900') : (darkMode ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-white/50')}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-2 rounded-lg transition-all ${isSignUp ? (darkMode ? 'bg-slate-800 shadow-md text-white' : 'bg-white shadow-md text-slate-900') : (darkMode ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-white/50')}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className={`block text-sm ${textSecondaryClass} mb-3`}>Login Context</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole('doctor')}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedRole === 'doctor'
                      ? darkMode 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-purple-500 bg-purple-50/50'
                      : darkMode
                        ? 'border-slate-700/40 bg-slate-700/30 hover:border-slate-600/60'
                        : 'border-white/40 bg-white/30 hover:border-white/60'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Stethoscope className={`w-6 h-6 ${selectedRole === 'doctor' ? 'text-purple-600' : darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`text-sm ${
                      selectedRole === 'doctor' 
                        ? darkMode ? 'text-purple-400' : 'text-purple-900' 
                        : darkMode ? 'text-slate-400' : 'text-slate-700'
                    }`}>
                      Doctor Workspace
                    </span>
                  </div>
                  {selectedRole === 'doctor' && (
                    <motion.div
                      layoutId="role-indicator"
                      className="absolute top-2 right-2 w-3 h-3 bg-purple-600 rounded-full"
                    />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole('nurse')}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedRole === 'nurse'
                      ? darkMode
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-indigo-500 bg-indigo-50/50'
                      : darkMode
                        ? 'border-slate-700/40 bg-slate-700/30 hover:border-slate-600/60'
                        : 'border-white/40 bg-white/30 hover:border-white/60'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Heart className={`w-6 h-6 ${selectedRole === 'nurse' ? 'text-indigo-600' : darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`text-sm ${
                      selectedRole === 'nurse'
                        ? darkMode ? 'text-indigo-400' : 'text-indigo-900'
                        : darkMode ? 'text-slate-400' : 'text-slate-700'
                    }`}>
                      Nurse Workspace
                    </span>
                  </div>
                  {selectedRole === 'nurse' && (
                    <motion.div
                      layoutId="role-indicator"
                      className="absolute top-2 right-2 w-3 h-3 bg-indigo-600 rounded-full"
                    />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl"
              >
                <Check className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-500">{success}</p>
              </motion.div>
            )}

            {/* Login/Sign-Up Form */}
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
              {/* Full Name Field (Sign-Up only) */}
              {isSignUp && (
                <div>
                  <label className={`block text-sm ${textSecondaryClass} mb-2`}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      className={`w-full pl-12 pr-4 py-3 ${
                        darkMode ? 'bg-slate-700/50 border-slate-600/40 text-white' : 'bg-white/50 border-white/40 text-slate-900'
                      } backdrop-blur-sm border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className={`w-full pl-12 pr-4 py-3 ${
                      darkMode ? 'bg-slate-700/50 border-slate-600/40 text-white' : 'bg-white/50 border-white/40 text-slate-900'
                    } backdrop-blur-sm border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 ${
                      darkMode ? 'bg-slate-700/50 border-slate-600/40 text-white' : 'bg-white/50 border-white/40 text-slate-900'
                    } backdrop-blur-sm border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  {loading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
                </span>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
              </div>
              <div className="relative flex justify-center">
                <span className={`px-4 text-sm ${
                  darkMode ? 'text-slate-500 bg-slate-800/80' : 'text-slate-500 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10'
                }`}>
                  Quick Access
                </span>
              </div>
            </div>

            {/* Quick Access Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                onClick={() => handleQuickLogin('doctor')}
                disabled={loading}
                className={`px-4 py-3 ${
                  darkMode ? 'bg-slate-700/50 border-slate-600/40 hover:bg-slate-700/70' : 'bg-white/50 border-white/40 hover:bg-white/70'
                } backdrop-blur-sm border rounded-xl hover:border-purple-300 transition-all duration-300 group ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Stethoscope className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  )}
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {loading ? 'Loading...' : 'Doctor Login'}
                  </span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                onClick={() => handleQuickLogin('nurse')}
                disabled={loading}
                className={`px-4 py-3 ${
                  darkMode ? 'bg-slate-700/50 border-slate-600/40 hover:bg-slate-700/70' : 'bg-white/50 border-white/40 hover:bg-white/70'
                } backdrop-blur-sm border rounded-xl hover:border-indigo-300 transition-all duration-300 group ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  )}
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {loading ? 'Loading...' : 'Nurse Login'}
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-2xl backdrop-blur-sm rotate-12 shadow-xl"
        ></motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl backdrop-blur-sm -rotate-12 shadow-xl"
        ></motion.div>
      </motion.div>
    </div>
  );
}
