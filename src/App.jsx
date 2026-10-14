import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';
import AnalyticsCharts from './components/AnalyticsCharts';
import EligibilityScreener from './components/EligibilityScreener';
import CompanyDrives from './components/CompanyDrives';
import StudentDirectory from './components/StudentDirectory';
import SkillGapSimulator from './components/SkillGapSimulator';
import StudentPortal from './components/StudentPortal';
import StudentDetailModal from './components/StudentDetailModal';
import BulkUploadModal from './components/BulkUploadModal';
import AddCompanyModal from './components/AddCompanyModal';
import LoginModal from './components/LoginModal';
import DriveApplicantsModal from './components/DriveApplicantsModal';

import { 
  getAnalyticsSummary, 
  getStudents, 
  getCompanies, 
  api 
} from './api/client';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Building2, 
  Sparkles, 
  DollarSign, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function App() {
  // Default session: Admin (TPO) with quick switcher to Student
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('campus_placement_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 1,
      email: 'admin@campus.edu',
      name: 'Prof. Rajesh Varma',
      role: 'admin',
      department: 'Placement Cell',
      token: 'demo-tpo-auth-token-2026'
    };
  });

  const [activeTab, setActiveTab] = useState(currentUser?.role === 'student' ? 'student-portal' : 'analytics');
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [applicantsCompanyId, setApplicantsCompanyId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [preselectedCompanyId, setPreselectedCompanyId] = useState('');

  const loadData = async () => {
    try {
      const healthRes = await api.get('/../health').catch(() => null);
      if (healthRes && healthRes.data?.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('online');
      }

      const [summaryData, studentsData, companiesData] = await Promise.all([
        getAnalyticsSummary(),
        getStudents({ limit: 200 }),
        getCompanies(),
      ]);

      setAnalytics(summaryData);
      setStudents(studentsData);
      setCompanies(companiesData);
      setBackendStatus('online');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('campus_placement_user', JSON.stringify(user));
    if (user.role === 'student') {
      setActiveTab('student-portal');
    } else {
      setActiveTab('analytics');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('campus_placement_user');
    setCurrentUser(null);
    setLoginModalMode('login');
    setIsLoginOpen(true);
  };

  const handleScreenCompany = (companyId) => {
    setPreselectedCompanyId(companyId);
    setActiveTab('screener');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glow & Grid Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] animate-glow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[140px] animate-glow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[130px] animate-glow" style={{ animationDelay: '5s' }}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      </div>

      {/* Account & Role Banner */}
      <div className="relative z-50 bg-slate-900/90 border-b border-slate-800 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-slate-400">Current Role Mode:</span>
            {currentUser ? (
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                currentUser.role === 'admin' 
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentUser.role === 'admin' 
                  ? '👑 Training & Placement Officer (Admin)' 
                  : `🎓 Student Candidate: ${currentUser.name} (${currentUser.roll_number || 'Student'})`}
              </span>
            ) : (
              <span className="font-semibold text-slate-400">Not Signed In</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoginModalMode('register');
                setIsLoginOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Student Account</span>
            </button>

            <button
              onClick={() => {
                setLoginModalMode('login');
                setIsLoginOpen(true);
              }}
              className="text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-medium transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In / Switch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        backendStatus={backendStatus}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <p className="text-sm text-slate-400">Loading Campus Placement Intelligence Engine...</p>
          </div>
        ) : (
          <>
            {/* STUDENT PORTAL TAB (FOR LOGGED-IN STUDENT) */}
            {activeTab === 'student-portal' && (
              <StudentPortal
                currentUser={currentUser}
                companies={companies}
                onNavigateToSimulator={() => setActiveTab('simulator')}
              />
            )}

            {/* TAB 1: OVERVIEW & ANALYTICS (FOR ADMIN) */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl backdrop-blur-xl">
                  <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      Academic Year 2026 - 2027 Placement Portal
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      Campus Placement Eligibility & Analytics Intelligence
                    </h1>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                      Instant multi-parameter screening, real-time corporate cutoff matching, and data-driven candidate evaluation powered by Python & Pandas analytics.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('screener')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                      >
                        <span>Launch Eligibility Screener</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveTab('simulator')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>Run Skill Gap Simulator</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Total Registered Students"
                    value={analytics?.total_students || 0}
                    subtitle="Enrolled final year candidates"
                    icon={Users}
                    color="indigo"
                  />
                  <MetricCard
                    title="Placement Conversion"
                    value={`${analytics?.placement_rate || 0}%`}
                    subtitle={`${analytics?.placed_students || 0} candidates successfully placed`}
                    icon={Award}
                    color="emerald"
                  />
                  <MetricCard
                    title="Cohort Average CGPA"
                    value={analytics?.average_cgpa?.toFixed(2) || '0.00'}
                    subtitle="Overall academic performance"
                    icon={GraduationCap}
                    color="amber"
                  />
                  <MetricCard
                    title="Active Company Drives"
                    value={analytics?.company_stats?.total_companies || companies.length}
                    subtitle={`${analytics?.company_stats?.super_dream_count || 0} Super Dream opportunities`}
                    icon={Building2}
                    color="sky"
                  />
                </div>

                {/* Recharts Analytics Section */}
                <AnalyticsCharts analytics={analytics} />
              </div>
            )}

            {/* TAB 2: ELIGIBILITY SCREENER */}
            {activeTab === 'screener' && (
              <EligibilityScreener
                companies={companies}
                onSelectStudent={(id) => setSelectedStudentId(id)}
                preselectedCompanyId={preselectedCompanyId}
              />
            )}

            {/* TAB 3: COMPANY DRIVES */}
            {activeTab === 'companies' && (
              <CompanyDrives
                companies={companies}
                onScreenCompany={handleScreenCompany}
                onOpenAddCompany={() => setIsAddCompanyOpen(true)}
                onViewApplicants={(id) => setApplicantsCompanyId(id)}
                currentUser={currentUser}
              />
            )}

            {/* TAB 4: STUDENT DIRECTORY */}
            {activeTab === 'students' && (
              <StudentDirectory
                students={students}
                onSelectStudent={(id) => setSelectedStudentId(id)}
              />
            )}

            {/* TAB 5: SKILL GAP SIMULATOR */}
            {activeTab === 'simulator' && (
              <SkillGapSimulator
                students={students}
                companies={companies}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Campus Placement Eligibility Dashboard &copy; 2026. All rights reserved.</span>
          <span className="text-slate-400">
            Powered by FastAPI, Pandas Analytics, and React
          </span>
        </div>
      </footer>

      {/* MODALS */}
      <LoginModal
        isOpen={isLoginOpen}
        initialMode={loginModalMode}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {applicantsCompanyId && (
        <DriveApplicantsModal
          companyId={applicantsCompanyId}
          onClose={() => setApplicantsCompanyId(null)}
          onSelectStudent={(id) => {
            setApplicantsCompanyId(null);
            setSelectedStudentId(id);
          }}
        />
      )}

      {selectedStudentId && (
        <StudentDetailModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {isUploadOpen && (
        <BulkUploadModal
          onClose={() => setIsUploadOpen(false)}
          onSuccess={loadData}
        />
      )}

      {isAddCompanyOpen && (
        <AddCompanyModal
          onClose={() => setIsAddCompanyOpen(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
