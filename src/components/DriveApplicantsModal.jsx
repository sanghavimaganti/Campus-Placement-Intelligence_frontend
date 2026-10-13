import React, { useEffect, useState } from 'react';
import { X, Users, Building2, CheckCircle2, Award, Calendar, Search } from 'lucide-react';
import { getCompanyApplicants } from '../api/client';

export default function DriveApplicantsModal({ companyId, onClose, onSelectStudent }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      getCompanyApplicants(companyId)
        .then((res) => setData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [companyId]);

  if (!companyId) return null;

  const applicants = (data?.applicants || []).filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return a.name.toLowerCase().includes(term) || a.roll_number.toLowerCase().includes(term);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {data?.company_name || 'Company'} Drive Applicants
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                  {data?.total_applicants || 0} Registered
                </span>
              </h3>
              <p className="text-xs text-slate-400">{data?.role} • Campus Recruitment Drive</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applicant name or roll..."
              className="w-full bg-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table of Applicants */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading registered applicants...</div>
          ) : applicants.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No student applicants recorded for this drive yet.</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">CGPA</th>
                  <th className="px-4 py-3">Backlogs</th>
                  <th className="px-4 py-3">Readiness Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applicants.map((a) => (
                  <tr
                    key={a.application_id}
                    onClick={() => {
                      onSelectStudent(a.student_id);
                    }}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-200">{a.roll_number}</td>
                    <td className="px-4 py-3 font-medium text-white">{a.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[10px]">
                        {a.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-100">{a.cgpa.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        a.active_backlogs > 0 ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400'
                      }`}>
                        {a.active_backlogs}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-indigo-400">{a.readiness_score} / 100</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        a.status === 'Selected'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{a.applied_at || 'Recently'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
