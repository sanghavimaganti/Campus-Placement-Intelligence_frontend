import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { checkSkillGap } from '../api/client';

export default function SkillGapSimulator({ students, companies }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
    if (companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [students, companies]);

  const runSimulation = async () => {
    if (!selectedStudentId || !selectedCompanyId) return;
    setLoading(true);
    try {
      const data = await checkSkillGap(parseInt(selectedStudentId), parseInt(selectedCompanyId));
      setResult(data);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId && selectedCompanyId) {
      runSimulation();
    }
  }, [selectedStudentId, selectedCompanyId]);

  const studentObj = students.find((s) => String(s.id) === String(selectedStudentId));
  const companyObj = companies.find((c) => String(c.id) === String(selectedCompanyId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Skill Gap & Placement Readiness Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Predict student success for specific company drives, identify skill deficiencies, and generate personalized preparation roadmaps.
        </p>
      </div>

      {/* Simulator Inputs Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Student */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Select Student Candidate:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.roll_number} - {s.name} ({s.department}, CGPA: {s.cgpa})
                </option>
              ))}
            </select>
            {studentObj && (
              <p className="text-[11px] text-slate-400">
                Skills: <span className="text-slate-300">{studentObj.skills || 'None listed'}</span>
              </p>
            )}
          </div>

          {/* Select Target Company */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Target Recruitment Drive:</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name} - {c.role} ({c.package_lpa} LPA)
                </option>
              ))}
            </select>
            {companyObj && (
              <p className="text-[11px] text-slate-400">
                Requires: <span className="text-indigo-300">{companyObj.required_skills}</span> (Cutoff: ≥ {companyObj.min_cgpa} CGPA)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Results Output */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Match Score & Clearance */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluation Outcome</span>
              
              {/* Circular Gauge / Big Percentage */}
              <div className="my-6 text-center">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-900/50 to-violet-900/40 border-4 border-indigo-500/30">
                  <span className="text-3xl font-extrabold text-white">
                    {result.match_percentage}%
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-300 mt-2">Technical Skill Match</p>
              </div>

              {/* Academic Eligibility Badge */}
              <div className={`p-4 rounded-xl border ${
                result.is_eligible_academically
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {result.is_eligible_academically ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Academic Clearance Passed
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      Academic Clearance Disqualified
                    </>
                  )}
                </div>
                {result.academic_reasons.length > 0 && (
                  <ul className="mt-2 text-xs space-y-1 text-rose-300/90 list-disc list-inside">
                    {result.academic_reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Placement Readiness */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Placement Readiness Index:</span>
                <span className="font-bold text-slate-200">{result.readiness_score} / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full"
                  style={{ width: `${result.readiness_score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Middle & Right: Skills Breakdown & Personalized Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Skill Gap Breakdown for {result.company_name} ({result.company_role})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Matched Competencies ({result.matched_skills.length})</span>
                  </div>
                  {result.matched_skills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No direct skill matches found.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {result.matched_skills.map((sk) => (
                        <span
                          key={sk}
                          className="bg-emerald-500/10 text-emerald-300 text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-2">
                    <XCircle className="w-4 h-4" />
                    <span>Missing / Gap Skills ({result.missing_skills.length})</span>
                  </div>
                  {result.missing_skills.length === 0 ? (
                    <p className="text-xs text-emerald-400 font-medium">All required skills fulfilled!</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_skills.map((sk) => (
                        <span
                          key={sk}
                          className="bg-rose-500/10 text-rose-300 text-xs px-2.5 py-1 rounded-lg border border-rose-500/30 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Action Plan & Recommendations */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Actionable Preparation Roadmap & Recommendations
              </h3>

              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
