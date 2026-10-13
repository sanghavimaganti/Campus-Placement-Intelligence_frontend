import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';
import AnalyticsCharts from './components/AnalyticsCharts';
import EligibilityScreener from './components/EligibilityScreener';
import CompanyDrives from './components/CompanyDrives';
import StudentDirectory from './components/StudentDirectory';
import SkillGapSimulator from './components/SkillGapSimulator';
import StudentDetailModal from './components/StudentDetailModal';
import BulkUploadModal from './components/BulkUploadModal';
import AddCompanyModal from './components/AddCompanyModal';

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
  ArrowRight 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [preselectedCompanyId, setPreselectedCompanyId] = useState('');

  const loadData = async () => {
    try {
      // Check health
      const healthRes = await api.get('/../health').catch(() => null);
      if (healthRes && healthRes.data?.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('online'); // default assumed if local or relative
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

  const handleScreenCompany = (companyId) => {
    setPreselectedCompanyId(companyId);
    setActiveTab('screener');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        backendStatus={backendStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <p className="text-sm text-slate-400">Loading Campus Placement Intelligence Engine...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 p-8 shadow-2xl">
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
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Campus Placement Eligibility Dashboard &copy; 2026. All rights reserved.</span>
          <span className="text-slate-400">
            Powered by FastAPI, Pandas Analytics, and React
          </span>
        </div>
      </footer>

      {/* Modals */}
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
