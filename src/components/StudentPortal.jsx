import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Clock, 
  Send, 
  Building2, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { 
  getStudentDetail, 
  getStudentApplications, 
  applyToDrive, 
  runWhatIfSimulation 
} from '../api/client';

export default function StudentPortal({ currentUser, companies, onNavigateToSimulator }) {
  const [studentData, setStudentData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [applyFeedback, setApplyFeedback] = useState(null);

  // What-if simulator state
  const [simCgpa, setSimCgpa] = useState(8.5);
  const [simBacklogs, setSimBacklogs] = useState(0);
  const [selectedAddSkills, setSelectedAddSkills] = useState(['Docker', 'AWS']);
  const [simProjects, setSimProjects] = useState(1);
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const POPULAR_SKILLS = ['AWS', 'Docker', 'Kubernetes', 'React', 'TensorFlow', 'Spring Boot', 'System Design'];

  const studentId = currentUser?.student_id || 1;

  const loadStudentInfo = async () => {
    setLoading(true);
    try {
      const [detail, apps] = await Promise.all([
        getStudentDetail(studentId),
        getStudentApplications(studentId).catch(() => []),
      ]);
      setStudentData(detail);
      setApplications(apps);
      setSimCgpa(detail.cgpa);
      setSimBacklogs(detail.active_backlogs);
    } catch (err) {
      console.error('Failed to load student info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentInfo();
  }, [studentId]);

  const handleApply = async (companyDriveId, companyName) => {
    setApplyingId(companyDriveId);
    setApplyFeedback(null);
    try {
      await applyToDrive(studentId, companyDriveId);
      setApplyFeedback({
        type: 'success',
        message: `Successfully registered for ${companyName} placement drive! Your profile is forwarded to the recruiter.`,
      });
      loadStudentInfo();
    } catch (err) {
      setApplyFeedback({
        type: 'error',
        message: err.response?.data?.detail || `Failed to register for ${companyName}`,
      });
    } finally {
      setApplyingId(null);
    }
  };

  const handleSimulate = async () => {
    setSimLoading(true);
    try {
      const res = await runWhatIfSimulation({
        student_id: studentId,
        simulated_cgpa: parseFloat(simCgpa),
        simulated_active_backlogs: parseInt(simBacklogs),
        additional_skills: selectedAddSkills,
        additional_projects: parseInt(simProjects),
      });
      setWhatIfResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    if (studentData) {
      handleSimulate();
    }
  }, [simCgpa, simBacklogs, selectedAddSkills, simProjects, studentData]);

  const toggleSkill = (skill) => {
    if (selectedAddSkills.includes(skill)) {
      setSelectedAddSkills(selectedAddSkills.filter((s) => s !== skill));
    } else {
      setSelectedAddSkills([...selectedAddSkills, skill]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="text-xs text-slate-400">Loading your candidate portal...</p>
      </div>
    );
  }

  const appliedDriveIds = applications.map((a) => a.company_drive_id);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Student Welcome Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-indigo-600/30">
              {studentData?.department}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {studentData?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {studentData?.roll_number}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Department of {studentData?.department} Engineering • Class of 2026 • Campus Placement Candidate
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  Status: <strong className="text-emerald-400">{studentData?.placement_status}</strong>
                </span>
                {studentData?.placed_company && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                    🎉 Placed at {studentData?.placed_company} ({studentData?.package_lpa} LPA)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Placement Readiness Badge */}
          <div className="flex flex-col items-center md:items-end justify-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Placement Readiness</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                {studentData?.readiness_score}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-28 bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full"
                style={{ width: `${studentData?.readiness_score || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-400 font-medium">Cumulative CGPA</p>
          <p className="text-2xl font-bold text-white mt-1">{studentData?.cgpa.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Scale of 10.0</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-400 font-medium">10th / 12th Grades</p>
          <p className="text-2xl font-bold text-slate-200 mt-1">
            {studentData?.tenth_percentage.toFixed(0)}% / {studentData?.twelfth_percentage.toFixed(0)}%
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">High School Academics</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-400 font-medium">Active Backlogs</p>
          <p className={`text-2xl font-bold mt-1 ${studentData?.active_backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {studentData?.active_backlogs}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {studentData?.active_backlogs === 0 ? 'Clear record' : 'Pending clearance'}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-400 font-medium">Drives Registered</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{applications.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active applications</p>
        </div>
      </div>

      {/* Feedback Banner */}
      {applyFeedback && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fadeIn ${
          applyFeedback.type === 'success'
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {applyFeedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{applyFeedback.message}</span>
          </div>
          <button
            onClick={() => setApplyFeedback(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Eligible Drives & Applications Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drive Clearance & Apply (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Campus Recruitment Drives & Your Eligibility
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live corporate cutoffs evaluated against your academic transcript.
                </p>
              </div>
            </div>

            {/* Drives List */}
            <div className="space-y-3">
              {(studentData?.eligible_drives || []).map((drive) => {
                const isApplied = appliedDriveIds.includes(drive.drive_id);
                return (
                  <div
                    key={drive.drive_id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-bold text-white">{drive.company_name}</span>
                        <span className="text-xs text-slate-400">• {drive.role}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          ₹ {drive.package_lpa} LPA
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className="text-slate-400">
                          Skill Match: <strong className="text-slate-200">{drive.skill_match_percentage}%</strong>
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          Tier: <strong className="text-slate-200">{drive.tier}</strong>
                        </span>
                      </div>

                      {!drive.is_eligible && drive.reasons.length > 0 && (
                        <div className="mt-2 text-[11px] text-rose-400/90 space-y-0.5">
                          {drive.reasons.map((r, i) => (
                            <p key={i} className="flex items-center gap-1">
                              <span className="text-rose-500 font-bold">•</span>
                              {r}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {isApplied ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Application Registered
                        </span>
                      ) : drive.is_eligible ? (
                        <button
                          onClick={() => handleApply(drive.drive_id, drive.company_name)}
                          disabled={applyingId === drive.drive_id}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{applyingId === drive.drive_id ? 'Submitting...' : 'Register / Apply'}</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                          Disqualified
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Applications Tracker & Timeline */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-indigo-400" />
              My Drive Application Tracker
            </h3>

            {applications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                You have not registered for any recruitment drives yet. Browse eligible drives on the left and click <strong>Register / Apply</strong>!
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{app.company_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        ₹ {app.package_lpa} LPA
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{app.role}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">Applied: {app.applied_at}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === 'Selected'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Feature: AI What-If Career Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              AI "What-If" Career & Readiness Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate profile enhancements (higher GPA, cleared backlogs, learning AWS/Docker) to discover how your placement opportunities expand!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Target CGPA */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Simulated Target CGPA:</span>
                <span className="font-bold text-indigo-400">{parseFloat(simCgpa).toFixed(1)} / 10.0</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="10.0"
                step="0.1"
                value={simCgpa}
                onChange={(e) => setSimCgpa(e.target.value)}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Backlogs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Simulated Active Backlogs:</span>
                <span className="font-bold text-emerald-400">{simBacklogs} Backlogs</span>
              </div>
              <select
                value={simBacklogs}
                onChange={(e) => setSimBacklogs(e.target.value)}
                className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-200"
              >
                <option value="0">0 (All Backlogs Cleared)</option>
                <option value="1">1 Active Backlog</option>
                <option value="2">2 Active Backlogs</option>
              </select>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Add In-Demand Skills to Learn:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map((sk) => {
                  const isSel = selectedAddSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isSel
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results: Delta & Unlocked Opportunities */}
          <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
            {whatIfResult ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-800/80">
                  <div className="text-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Baseline Score</span>
                    <span className="text-xl font-bold text-slate-300 mt-1 block">{whatIfResult.baseline_score}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                    <span className="text-[11px] text-indigo-300 block">Simulated Score</span>
                    <span className="text-xl font-extrabold text-white mt-1 block">{whatIfResult.simulated_score}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[11px] text-emerald-400 block">Score Boost</span>
                    <span className="text-xl font-extrabold text-emerald-300 mt-1 block">+{whatIfResult.score_delta} pts</span>
                  </div>
                </div>

                {/* Unlocked Companies */}
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    🔓 Unlocked Placement Opportunities ({whatIfResult.unlocked_companies.length}):
                  </span>
                  {whatIfResult.unlocked_companies.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No new company drives unlocked with these parameters.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {whatIfResult.unlocked_companies.map((comp) => (
                        <span
                          key={comp}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Insights */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">AI Strategic Recommendations:</span>
                  {whatIfResult.insights.map((ins, i) => (
                    <p key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-indigo-400 font-bold">•</span>
                      {ins}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
