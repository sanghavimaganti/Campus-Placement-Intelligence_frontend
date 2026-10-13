import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Award, 
  CheckCircle, 
  Plus, 
  ArrowRight,
  Sparkles,
  Layers,
  Users
} from 'lucide-react';

export default function CompanyDrives({ companies, onScreenCompany, onOpenAddCompany, onViewApplicants, currentUser }) {
  const [filterTier, setFilterTier] = useState('All');

  const filtered = companies.filter((c) => {
    if (filterTier === 'All') return true;
    return c.tier === filterTier;
  });

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Super Dream':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Dream':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Campus Recruitment Drives
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse upcoming corporate placement drives, compensation packages, and eligibility criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            {['All', 'Super Dream', 'Dream', 'Core/Regular'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterTier === t
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddCompany}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Drive</span>
          </button>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((company) => (
          <div
            key={company.id}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Name, Tier, Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {company.company_name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>{company.role}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getTierBadge(company.tier)}`}>
                  {company.tier}
                </span>
              </div>

              {/* Package CTC banner */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-baseline justify-between">
                <span className="text-xs text-indigo-300/80 font-medium">Offered CTC:</span>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  ₹ {company.package_lpa} <span className="text-xs text-slate-400 font-normal">LPA</span>
                </span>
              </div>

              {/* Criteria details */}
              <div className="mt-4 space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>CGPA Cutoff:</span>
                  <span className="font-semibold text-slate-200">≥ {company.min_cgpa.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>10th / 12th Cutoff:</span>
                  <span className="font-semibold text-slate-200">≥ {company.min_tenth_percentage}% / {company.min_twelfth_percentage}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Backlogs Allowed:</span>
                  <span className="font-semibold text-amber-400">{company.max_active_backlogs}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Eligible Branches:</span>
                  <span className="font-medium text-slate-300 truncate max-w-[170px]" title={company.eligible_branches}>
                    {company.eligible_branches}
                  </span>
                </div>
                {company.drive_date && (
                  <div className="flex justify-between text-slate-400">
                    <span>Drive Date:</span>
                    <span className="font-medium text-indigo-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {company.drive_date}
                    </span>
                  </div>
                )}
              </div>

              {/* Required Skills Badges */}
              {company.required_skills && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">Required Technical Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {company.required_skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onScreenCompany(company.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 text-xs font-semibold transition-all duration-200 shadow-sm"
              >
                <span>Screen Pool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onViewApplicants && onViewApplicants(company.id)}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                  title="View registered student applicants"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Applicants</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
