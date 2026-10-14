import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase,
  Award,
  Layers,
  Save
} from 'lucide-react';
import { updateStudent } from '../api/client';

export default function EditStudentModal({ isOpen, onClose, studentData, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CSE',
    gender: 'Other',
    cgpa: 7.0,
    tenth_percentage: 60.0,
    twelfth_percentage: 60.0,
    active_backlogs: 0,
    history_of_backlogs: 0,
    skills: '',
    projects_count: 0,
    internships_count: 0,
    certifications_count: 0,
    placement_status: 'Unplaced',
    placed_company: '',
    package_lpa: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (studentData && isOpen) {
      setFormData({
        name: studentData.name || '',
        email: studentData.email || '',
        department: studentData.department || 'CSE',
        gender: studentData.gender || 'Other',
        cgpa: studentData.cgpa ?? 7.0,
        tenth_percentage: studentData.tenth_percentage ?? 60.0,
        twelfth_percentage: studentData.twelfth_percentage ?? 60.0,
        active_backlogs: studentData.active_backlogs ?? 0,
        history_of_backlogs: studentData.history_of_backlogs ?? 0,
        skills: studentData.skills || '',
        projects_count: studentData.projects_count ?? 0,
        internships_count: studentData.internships_count ?? 0,
        certifications_count: studentData.certifications_count ?? 0,
        placement_status: studentData.placement_status || 'Unplaced',
        placed_company: studentData.placed_company || '',
        package_lpa: studentData.package_lpa ?? ''
      });
      setError(null);
      setSuccess(false);
    }
  }, [studentData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department,
      gender: formData.gender,
      cgpa: parseFloat(formData.cgpa) || 0.0,
      tenth_percentage: parseFloat(formData.tenth_percentage) || 0.0,
      twelfth_percentage: parseFloat(formData.twelfth_percentage) || 0.0,
      active_backlogs: parseInt(formData.active_backlogs) || 0,
      history_of_backlogs: parseInt(formData.history_of_backlogs) || 0,
      skills: formData.skills.trim(),
      projects_count: parseInt(formData.projects_count) || 0,
      internships_count: parseInt(formData.internships_count) || 0,
      certifications_count: parseInt(formData.certifications_count) || 0,
      placement_status: formData.placement_status,
      placed_company: formData.placement_status !== 'Unplaced' ? (formData.placed_company.trim() || null) : null,
      package_lpa: formData.placement_status !== 'Unplaced' && formData.package_lpa ? parseFloat(formData.package_lpa) : null
    };

    try {
      const updated = await updateStudent(studentData.id, payload);
      setSuccess(true);
      setTimeout(() => {
        if (onUpdateSuccess) onUpdateSuccess(updated);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.detail || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/60 shadow-2xl shadow-indigo-950/50">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Update Student Details</h3>
              <p className="text-xs text-slate-400">
                Roll Number: <strong className="text-emerald-400 font-mono">{studentData?.roll_number}</strong> • Editable anytime
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Notifications */}
        <div className="px-6 pt-3 flex-shrink-0">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Profile details updated successfully! Refreshing analytics...</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Personal & Academic Identity</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Campus Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Department / Branch</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Grades & Academic Cutoffs */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Academic Performance & Backlogs</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">10th %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={formData.tenth_percentage}
                  onChange={(e) => setFormData({ ...formData, tenth_percentage: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">12th %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={formData.twelfth_percentage}
                  onChange={(e) => setFormData({ ...formData, twelfth_percentage: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.active_backlogs}
                  onChange={(e) => setFormData({ ...formData, active_backlogs: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">History of Backlogs</label>
                <input
                  type="number"
                  min="0"
                  value={formData.history_of_backlogs}
                  onChange={(e) => setFormData({ ...formData, history_of_backlogs: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Placement Status</label>
                <select
                  value={formData.placement_status}
                  onChange={(e) => setFormData({ ...formData, placement_status: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Unplaced">Unplaced (Actively Looking)</option>
                  <option value="Placed">Placed</option>
                  <option value="Dream Placed">Dream Placed</option>
                </select>
              </div>
            </div>

            {formData.placement_status !== 'Unplaced' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Company Placed At</label>
                  <input
                    type="text"
                    value={formData.placed_company}
                    onChange={(e) => setFormData({ ...formData, placed_company: e.target.value })}
                    placeholder="e.g. Google, Microsoft, TCS"
                    className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">Package (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.package_lpa}
                    onChange={(e) => setFormData({ ...formData, package_lpa: e.target.value })}
                    placeholder="e.g. 12.5"
                    className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Technical Skills & Projects */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Skills, Projects & Certifications</span>
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. Python, React, SQL, AWS, Docker, Machine Learning"
                className="w-full bg-slate-950/70 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-slate-500">
                Updating your skills recalculates your skill match percentage and readiness score for all recruitment drives!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Projects Count</label>
                <input
                  type="number"
                  min="0"
                  value={formData.projects_count}
                  onChange={(e) => setFormData({ ...formData, projects_count: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Internships</label>
                <input
                  type="number"
                  min="0"
                  value={formData.internships_count}
                  onChange={(e) => setFormData({ ...formData, internships_count: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Certifications</label>
                <input
                  type="number"
                  min="0"
                  value={formData.certifications_count}
                  onChange={(e) => setFormData({ ...formData, certifications_count: e.target.value })}
                  className="w-full bg-slate-950/70 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Saving Details...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Updated Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
