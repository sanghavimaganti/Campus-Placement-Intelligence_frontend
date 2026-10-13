import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Award } from 'lucide-react';

export default function StudentDirectory({ students, onSelectStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = students.filter((s) => {
    if (selectedDept !== 'All' && s.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && s.placement_status !== selectedStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = s.name.toLowerCase().includes(term);
      const matchRoll = s.roll_number.toLowerCase().includes(term);
      return matchName || matchRoll;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Dream Placed':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Placed':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Student Master Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of eligible students, academic records, certifications, and placement outcomes.
          </p>
        </div>

        {/* Filter bars */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or roll..."
              className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="AIDS">AIDS</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Unplaced">Unplaced</option>
            <option value="Placed">Placed</option>
            <option value="Dream Placed">Dream Placed</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">CGPA</th>
                <th className="px-5 py-3.5">10th / 12th %</th>
                <th className="px-5 py-3.5">Active Backlogs</th>
                <th className="px-5 py-3.5">Readiness Score</th>
                <th className="px-5 py-3.5">Placement Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
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
                        {s.active_backlogs}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${s.readiness_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-slate-200">{s.readiness_score || 0}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(s.placement_status)}`}>
                        {s.placement_status}
                      </span>
                      {s.placed_company && (
                        <span className="block text-[10px] text-emerald-400 font-medium mt-0.5">
                          {s.placed_company} ({s.package_lpa} LPA)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(s.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
