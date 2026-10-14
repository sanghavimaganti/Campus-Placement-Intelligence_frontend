import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  UserPlus,
  LogIn,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';
import { loginUser, registerStudent } from '../api/client';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState('student'); // 'student' or 'admin' (only for login)
  
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);
  
  // Login Form State (clean, no demo credentials prefilled)
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  // Register Form State (for creating a student account)
  const [regForm, setRegForm] = useState({
    name: '',
    roll_number: '',
    email: '',
    password: '',
    department: 'CSE',
    gender: 'Male',
    cgpa: 7.5,
    tenth_percentage: 75.0,
    twelfth_percentage: 75.0,
    active_backlogs: 0,
    history_of_backlogs: 0,
    skills: '',
    projects_count: 1,
    internships_count: 0,
    certifications_count: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please enter both login identifier and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(loginId, password, role);
      onLoginSuccess(userData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.roll_number || !regForm.email || !regForm.password) {
      setError('Please fill in Name, Roll Number, Email, and Password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userData = await registerStudent({
        ...regForm,
        cgpa: parseFloat(regForm.cgpa) || 7.0,
        tenth_percentage: parseFloat(regForm.tenth_percentage) || 60.0,
        twelfth_percentage: parseFloat(regForm.twelfth_percentage) || 60.0,
        active_backlogs: parseInt(regForm.active_backlogs) || 0,
        history_of_backlogs: parseInt(regForm.history_of_backlogs) || 0,
        projects_count: parseInt(regForm.projects_count) || 0,
        internships_count: parseInt(regForm.internships_count) || 0,
        certifications_count: parseInt(regForm.certifications_count) || 0
      });
      setSuccessMessage('Student account created successfully! Signing in...');
      setTimeout(() => {
        onLoginSuccess(userData);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/60 shadow-2xl shadow-indigo-950/50">
        {/* Glow ambient background inside modal */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="relative p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {mode === 'login' ? 'Campus Portal Sign In' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-400">Campus Placement Intelligence System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Sign In vs Create Account) */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Student Account</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="px-6 pt-3 flex-shrink-0">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Role Tabs for Sign In */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Select Role</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/50 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('student')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      role === 'student'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('admin')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      role === 'admin'
                        ? 'bg-violet-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Placement Officer (TPO)</span>
                  </button>
                </div>
              </div>

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {role === 'student' ? 'Roll Number or Campus Email' : 'Officer Email or Username'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder={role === 'student' ? 'Enter your Roll Number or Email' : 'Enter Admin Email'}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-slate-950/70 text-slate-200 text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to {role === 'admin' ? 'TPO Portal' : 'Student Dashboard'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Link to Register */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  New Student?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Create your account here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>

                {/* Roll Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Roll Number / Student ID *</label>
                  <input
                    type="text"
                    required
                    value={regForm.roll_number}
                    onChange={(e) => setRegForm({ ...regForm, roll_number: e.target.value })}
                    placeholder="e.g. 23CS101"
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Campus Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Campus Email *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="student@campus.edu"
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Password *</label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Department */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Department / Branch</label>
                  <select
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="AIDS">AI & Data Science (AIDS)</option>
                    <option value="ECE">Electronics & Communication (ECE)</option>
                    <option value="EEE">Electrical & Electronics (EEE)</option>
                    <option value="MECH">Mechanical Engineering (MECH)</option>
                    <option value="CIVIL">Civil Engineering (CIVIL)</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Gender</label>
                  <select
                    value={regForm.gender}
                    onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Academics: CGPA, 10th %, 12th % */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 block">CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={regForm.cgpa}
                    onChange={(e) => setRegForm({ ...regForm, cgpa: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-2.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 block">10th %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={regForm.tenth_percentage}
                    onChange={(e) => setRegForm({ ...regForm, tenth_percentage: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-2.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 block">12th %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={regForm.twelfth_percentage}
                    onChange={(e) => setRegForm({ ...regForm, twelfth_percentage: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-2.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Backlogs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={regForm.active_backlogs}
                    onChange={(e) => setRegForm({ ...regForm, active_backlogs: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">History of Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={regForm.history_of_backlogs}
                    onChange={(e) => setRegForm({ ...regForm, history_of_backlogs: e.target.value })}
                    className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Technical Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={regForm.skills}
                  onChange={(e) => setRegForm({ ...regForm, skills: e.target.value })}
                  placeholder="e.g. Python, React, SQL, Data Structures, Java"
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Submit Register Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account & Sign In</span>
                    </>
                  )}
                </button>
              </div>

              {/* Link to Login */}
              <div className="text-center pt-1">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
