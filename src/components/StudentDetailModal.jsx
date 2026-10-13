import React, { useEffect, useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Briefcase,
  Building2,
  Calendar
} from 'lucide-react';
import { getStudentDetail } from '../api/client';

export default function StudentDetailModal({ studentId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      getStudentDetail(studentId)
        .then((res) => setData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
              {data ? data.department : '...'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{data?.name || 'Loading Student...'}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-mono text-slate-300">{data?.roll_number}</span>
                <span>•</span>
                <span>{data?.email}</span>
                <span>•</span>
                <span>{data?.gender}</span>
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

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Fetching student academic records and drive clearances...
          </div>
        ) : data ? (
          <div className="p-6 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
                <p className="text-[11px] text-slate-400">CGPA</p>
                <p className="text-xl font-extrabold text-white mt-1">{data.cgpa.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
                <p className="text-[11px] text-slate-400">10th / 12th</p>
                <p className="text-base font-bold text-slate-200 mt-1">
                  {data.tenth_percentage.toFixed(0)}% / {data.twelfth_percentage.toFixed(0)}%
                </p>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
                <p className="text-[11px] text-slate-400">Active Backlogs</p>
                <p className={`text-xl font-extrabold mt-1 ${data.active_backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {data.active_backlogs}
                </p>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-center">
                <p className="text-[11px] text-slate-400">Readiness Score</p>
                <p className="text-xl font-extrabold text-indigo-400 mt-1">{data.readiness_score} / 100</p>
              </div>
            </div>

            {/* Practical Experience & Technical Skills */}
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Technical Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills ? (
                    data.skills.split(',').map((s, i) => (
                      <span
                        key={i}
                        className="bg-indigo-500/10 text-indigo-300 text-xs px-2.5 py-1 rounded-lg border border-indigo-500/20 font-medium"
                      >
                        {s.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No skills recorded.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Projects Completed:</span>
                  <p className="text-base font-bold text-white mt-0.5">{data.projects_count}</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Internships Done:</span>
                  <p className="text-base font-bold text-white mt-0.5">{data.internships_count}</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Certifications:</span>
                  <p className="text-base font-bold text-white mt-0.5">{data.certifications_count}</p>
                </div>
              </div>
            </div>

            {/* Eligible Company Drives Status */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Live Corporate Drive Clearance
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(data.eligible_drives || []).map((drive) => (
                  <div
                    key={drive.drive_id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{drive.company_name}</span>
                        <span className="text-slate-400">• {drive.role}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                          ₹ {drive.package_lpa} LPA
                        </span>
                      </div>
                      {!drive.is_eligible && drive.reasons.length > 0 && (
                        <p className="text-[11px] text-rose-400 mt-1">
                          Disqualified: {drive.reasons.join(', ')}
                        </p>
                      )}
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                      drive.is_eligible
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {drive.is_eligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
