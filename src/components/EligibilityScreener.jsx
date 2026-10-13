import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Search, 
  Building2, 
  Sliders, 
  Sparkles, 
  FileSpreadsheet, 
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { evaluateEligibility, exportEligibleCsv, exportEligibleExcel } from '../api/client';

export default function EligibilityScreener({ companies, onSelectStudent, preselectedCompanyId }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId || '');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [minTenth, setMinTenth] = useState(60.0);
  const [minTwelfth, setMinTwelfth] = useState(60.0);
  const [maxActiveBacklogs, setMaxActiveBacklogs] = useState(0);
  const [maxHistoryBacklogs, setMaxHistoryBacklogs] = useState(1);
  const [selectedBranches, setSelectedBranches] = useState(['CSE', 'IT', 'ECE', 'AIDS']);
  const [genderFilter, setGenderFilter] = useState('All');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // all, eligible, ineligible
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState(false);

  const ALL_BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];

  // Sync when preselectedCompanyId changes
  useEffect(() => {
    if (preselectedCompanyId) {
      setSelectedCompanyId(preselectedCompanyId);
      applyCompanyCriteria(preselectedCompanyId);
    }
  }, [preselectedCompanyId]);

  const applyCompanyCriteria = (companyId) => {
    const comp = companies.find((c) => String(c.id) === String(companyId));
    if (comp) {
      setMinCgpa(comp.min_cgpa);
      setMinTenth(comp.min_tenth_percentage);
      setMinTwelfth(comp.min_twelfth_percentage);
      setMaxActiveBacklogs(comp.max_active_backlogs);
      setMaxHistoryBacklogs(comp.max_history_backlogs);
      
      const branches = comp.eligible_branches.split(',').map((b) => b.trim().toUpperCase()).filter(Boolean);
      setSelectedBranches(branches);

      const skills = comp.required_skills ? comp.required_skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
      setRequiredSkills(skills);
    }
  };

  const handleCompanyChange = (e) => {
    const cid = e.target.value;
    setSelectedCompanyId(cid);
    if (cid) {
      applyCompanyCriteria(cid);
    }
  };

  const toggleBranch = (branch) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(skillInput.trim())) {
        setRequiredSkills([...requiredSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const resetFilters = () => {
    setSelectedCompanyId('');
    setMinCgpa(7.0);
    setMinTenth(60.0);
    setMinTwelfth(60.0);
    setMaxActiveBacklogs(0);
    setMaxHistoryBacklogs(1);
    setSelectedBranches(['CSE', 'IT', 'ECE', 'AIDS']);
    setGenderFilter('All');
    setRequiredSkills([]);
    setSkillInput('');
  };

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const payload = {
        company_id: selectedCompanyId ? parseInt(selectedCompanyId) : null,
        min_cgpa: parseFloat(minCgpa),
        min_tenth_percentage: parseFloat(minTenth),
        min_twelfth_percentage: parseFloat(minTwelfth),
        max_active_backlogs: parseInt(maxActiveBacklogs),
        max_history_backlogs: parseInt(maxHistoryBacklogs),
        eligible_branches: selectedBranches,
        required_skills: requiredSkills,
        gender_filter: genderFilter,
      };

      const data = await evaluateEligibility(payload);
      setEvaluationResult(data);
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first load or when key criteria changes
  useEffect(() => {
    runEvaluation();
  }, [minCgpa, minTenth, minTwelfth, maxActiveBacklogs, maxHistoryBacklogs, selectedBranches, genderFilter, requiredSkills, selectedCompanyId]);

  const handleExport = async (format) => {
    setDownloading(true);
    try {
      const payload = {
        company_id: selectedCompanyId ? parseInt(selectedCompanyId) : null,
        min_cgpa: parseFloat(minCgpa),
        min_tenth_percentage: parseFloat(minTenth),
        min_twelfth_percentage: parseFloat(minTwelfth),
        max_active_backlogs: parseInt(maxActiveBacklogs),
        max_history_backlogs: parseInt(maxHistoryBacklogs),
        eligible_branches: selectedBranches,
        required_skills: requiredSkills,
        gender_filter: genderFilter,
      };

      let blobData;
      let filename = `eligible_candidates_${Date.now()}`;

      if (format === 'csv') {
        blobData = await exportEligibleCsv(payload, false);
        filename += '.csv';
      } else {
        blobData = await exportEligibleExcel(payload, false);
        filename += '.xlsx';
      }

      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Filter candidate items by status and search term
  const filteredCandidates = (evaluationResult?.candidates || []).filter((item) => {
    if (statusFilter === 'eligible' && !item.is_eligible) return false;
    if (statusFilter === 'ineligible' && item.is_eligible) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = item.student.name.toLowerCase().includes(term);
      const matchRoll = item.student.roll_number.toLowerCase().includes(term);
      const matchDept = item.student.department.toLowerCase().includes(term);
      return matchName || matchRoll || matchDept;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls / Filters Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Placement Screening & Eligibility Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Filter student pool by dynamic corporate thresholds, backlogs, branch relevance, and skill matching.
            </p>
          </div>

          {/* Preset Company Selector */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedCompanyId}
                onChange={handleCompanyChange}
                className="bg-slate-800 text-slate-200 text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">Custom Criteria (Manual)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name} - {c.role} ({c.package_lpa} LPA)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Sliders & Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {/* Min CGPA */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Minimum CGPA</span>
              <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {minCgpa.toFixed(1)} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={minCgpa}
              onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Min 10th & 12th */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">10th / 12th Cutoff</span>
              <span className="font-bold text-slate-300">
                {minTenth}% / {minTwelfth}%
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={minTenth}
                onChange={(e) => setMinTenth(e.target.value)}
                placeholder="10th %"
                className="w-1/2 bg-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={minTwelfth}
                onChange={(e) => setMinTwelfth(e.target.value)}
                placeholder="12th %"
                className="w-1/2 bg-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Max Backlogs */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Max Active Backlogs</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {maxActiveBacklogs} Allowed
              </span>
            </div>
            <select
              value={maxActiveBacklogs}
              onChange={(e) => setMaxActiveBacklogs(parseInt(e.target.value))}
              className="w-full bg-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="0">0 (Strictly No Active Backlogs)</option>
              <option value="1">At most 1 Backlog</option>
              <option value="2">At most 2 Backlogs</option>
              <option value="5">Any Backlogs Allowed</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <span className="text-slate-400 text-xs font-medium block">Gender Diversity</span>
            <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              {['All', 'Female', 'Male'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderFilter(g)}
                  className={`text-xs py-1 rounded font-medium transition-all ${
                    genderFilter === g
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Branches & Skills Row */}
        <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch Pills */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">Eligible Engineering Branches:</span>
            <div className="flex flex-wrap gap-2">
              {ALL_BRANCHES.map((dept) => {
                const isSelected = selectedBranches.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => toggleBranch(dept)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills Input */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">
              Mandatory Skills (Press Enter to add):
            </span>
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-800 rounded-lg border border-slate-700 min-h-[38px]">
              {requiredSkills.map((sk) => (
                <span
                  key={sk}
                  className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-md flex items-center gap-1 border border-indigo-500/30"
                >
                  {sk}
                  <button
                    onClick={() => removeSkill(sk)}
                    className="hover:text-rose-400 text-slate-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={requiredSkills.length === 0 ? "Type skill (e.g. Python, SQL) and press Enter..." : "Add skill..."}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="bg-transparent text-xs text-slate-200 placeholder-slate-500 px-2 py-1 focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Banner */}
      {evaluationResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total Evaluated Pool</p>
              <p className="text-2xl font-bold text-white mt-1">{evaluationResult.total_students}</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
              <Filter className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-400 font-medium">Eligible Candidates</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-emerald-300">{evaluationResult.eligible_count}</p>
                <span className="text-xs text-emerald-400/80 font-semibold">
                  ({evaluationResult.eligibility_rate_percentage}%)
                </span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-400 font-medium">Disqualified Candidates</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-rose-300">{evaluationResult.ineligible_count}</p>
                <span className="text-xs text-rose-400/80 font-semibold">
                  ({(100 - evaluationResult.eligibility_rate_percentage).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Candidate Pool Table Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        {/* Table Header & Actions */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({evaluationResult?.total_students || 0})
            </button>
            <button
              onClick={() => setStatusFilter('eligible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'eligible'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Eligible ({evaluationResult?.eligible_count || 0})
            </button>
            <button
              onClick={() => setStatusFilter('ineligible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'ineligible'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ineligible ({evaluationResult?.ineligible_count || 0})
            </button>
          </div>

          {/* Search & Export Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate name or roll..."
                className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => handleExport('excel')}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm"
              title="Download Formatted Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Excel</span>
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all shadow-sm"
              title="Download CSV"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Branch</th>
                <th className="px-5 py-3.5">CGPA</th>
                <th className="px-5 py-3.5">10th / 12th %</th>
                <th className="px-5 py-3.5">Backlogs</th>
                <th className="px-5 py-3.5">Readiness Score</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Evaluation Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400">
                    No candidates found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((cand) => {
                  const s = cand.student;
                  const isElig = cand.is_eligible;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s.id)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-200">
                        {s.roll_number}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-white">
                        {s.name}
                        <span className="block text-[10px] text-slate-500 font-normal">{s.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                          {s.department}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-100">
                        {s.cgpa.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {s.tenth_percentage.toFixed(0)}% / {s.twelfth_percentage.toFixed(0)}%
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold ${
                            s.active_backlogs > 0
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s.active_backlogs} Active
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${cand.readiness_score}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-slate-200">{cand.readiness_score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isElig
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isElig ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              ELIGIBLE
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              INELIGIBLE
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-xs">
                        {isElig ? (
                          <span className="text-emerald-400/90 text-[11px] font-medium flex items-center gap-1">
                            Clear for Drive Registration
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {cand.reasons.map((r, i) => (
                              <p key={i} className="text-rose-400/90 text-[11px] flex items-start gap-1">
                                <span className="text-rose-500 font-bold">•</span>
                                {r}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
