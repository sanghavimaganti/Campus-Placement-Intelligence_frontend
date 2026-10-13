import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { loginUser } from '../api/client';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [loginId, setLoginId] = useState('21CS001');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setError(null);
    if (selectedRole === 'admin') {
      setLoginId('admin@campus.edu');
      setPassword('admin123');
    } else {
      setLoginId('21CS001');
      setPassword('student123');
    }
  };

  const handleSubmit = async (e) => {
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

  const handleQuickLogin = (demoRole, id, pass) => {
    setRole(demoRole);
    setLoginId(id);
    setPassword(pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/60 shadow-2xl shadow-indigo-950/50">
        {/* Glow ambient background inside modal */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="relative p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Placement Portal Login</h3>
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

        {/* Role Tabs */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'student'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Placement Officer (TPO)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {role === 'student' ? 'Roll Number / Campus Email' : 'Officer Email / Username'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder={role === 'student' ? 'e.g. 21CS001 or student@campus.edu' : 'admin@campus.edu'}
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
                placeholder="Enter password..."
                className="w-full bg-slate-950/70 text-slate-200 text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Profiles (For Instant Testing):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student', '21CS001', 'student123')}
                className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 text-[11px] font-medium text-left transition-all"
              >
                🎓 <strong className="text-white">Aarav (21CS001)</strong>
                <span className="block text-[10px] text-slate-400">Student Profile</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin@campus.edu', 'admin123')}
                className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 text-[11px] font-medium text-left transition-all"
              >
                👑 <strong className="text-white">Head TPO</strong>
                <span className="block text-[10px] text-slate-400">Admin Console</span>
              </button>
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
        </form>
      </div>
    </div>
  );
}
