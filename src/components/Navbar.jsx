import React from 'react';
import { 
  GraduationCap, 
  BarChart3, 
  Filter, 
  Building2, 
  Users, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenUpload, 
  backendStatus,
  currentUser,
  onOpenLogin,
  onLogout 
}) {
  // Navigation tabs vary by role
  const adminNavItems = [
    { id: 'analytics', label: 'Overview & KPIs', icon: BarChart3 },
    { id: 'screener', label: 'Eligibility Screener', icon: Filter },
    { id: 'companies', label: 'Company Drives', icon: Building2 },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'simulator', label: 'Skill Gap Simulator', icon: Sparkles },
  ];

  const studentNavItems = [
    { id: 'student-portal', label: 'My Placement Portal', icon: GraduationCap },
    { id: 'companies', label: 'Company Drives', icon: Building2 },
    { id: 'simulator', label: 'Career Simulator', icon: Sparkles },
  ];

  const navItems = currentUser?.role === 'student' ? studentNavItems : adminNavItems;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight">Placement Intelligence</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Campus 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Campus Placement Eligibility & Analytics Engine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Import CSV (Admin only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenUpload}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Import CSV</span>
              </button>
            )}

            {/* User Profile / Login status */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 pr-2.5 rounded-2xl border border-slate-700/80">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  currentUser.role === 'admin'
                    ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                    : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="text-left hidden lg:block">
                  <span className="block text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {currentUser.role === 'admin' ? 'TPO Admin' : `Roll: ${currentUser.roll_number || 'Student'}`}
                  </span>
                </div>

                {/* Switch Role / Logout button */}
                <button
                  onClick={onOpenLogin}
                  className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  title="Switch Role or Log In as different user"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
