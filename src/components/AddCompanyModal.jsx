import React, { useState } from 'react';
import { X, Building2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { createCompanyDrive } from '../api/client';

export default function AddCompanyModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    tier: 'Dream',
    package_lpa: 8.0,
    min_cgpa: 7.0,
    min_tenth_percentage: 60.0,
    min_twelfth_percentage: 60.0,
    max_active_backlogs: 0,
    max_history_backlogs: 1,
    eligible_branches: 'CSE,IT,ECE,AIDS',
    required_skills: 'Python,SQL,Data Structures',
    drive_date: '',
    registration_deadline: '',
    status: 'Upcoming',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name || !formData.role) {
      setError('Company name and role are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createCompanyDrive({
        ...formData,
        package_lpa: parseFloat(formData.package_lpa),
        min_cgpa: parseFloat(formData.min_cgpa),
        min_tenth_percentage: parseFloat(formData.min_tenth_percentage),
        min_twelfth_percentage: parseFloat(formData.min_twelfth_percentage),
        max_active_backlogs: parseInt(formData.max_active_backlogs),
        max_history_backlogs: parseInt(formData.max_history_backlogs),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create company drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Recruitment Drive</h3>
              <p className="text-xs text-slate-400">Configure cutoff criteria for a company placement visit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Adobe, Intel, Oracle"
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Job Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Software Engineer"
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Drive Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value="Super Dream">Super Dream (&gt;= 15 LPA)</option>
                <option value="Dream">Dream (7 - 15 LPA)</option>
                <option value="Core/Regular">Core / Mass Recruiters (&lt; 7 LPA)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Package (CTC in LPA) *</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.package_lpa}
                onChange={(e) => setFormData({ ...formData, package_lpa: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.min_cgpa}
                onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Min 10th %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.min_tenth_percentage}
                onChange={(e) => setFormData({ ...formData, min_tenth_percentage: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Min 12th %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.min_twelfth_percentage}
                onChange={(e) => setFormData({ ...formData, min_twelfth_percentage: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Max Active Backlogs</label>
              <input
                type="number"
                min="0"
                value={formData.max_active_backlogs}
                onChange={(e) => setFormData({ ...formData, max_active_backlogs: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Drive Date</label>
              <input
                type="date"
                value={formData.drive_date}
                onChange={(e) => setFormData({ ...formData, drive_date: e.target.value })}
                className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Eligible Branches (comma separated)</label>
            <input
              type="text"
              value={formData.eligible_branches}
              onChange={(e) => setFormData({ ...formData, eligible_branches: e.target.value })}
              className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Required Skills (comma separated)</label>
            <input
              type="text"
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              className="w-full bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              {loading ? 'Creating...' : 'Save Recruitment Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
