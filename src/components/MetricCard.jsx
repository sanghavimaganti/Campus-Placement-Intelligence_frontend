import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-900/30 to-indigo-950/20 border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'group-hover:border-indigo-500/40',
    },
    emerald: {
      bg: 'from-emerald-900/30 to-emerald-950/20 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:border-emerald-500/40',
    },
    amber: {
      bg: 'from-amber-900/30 to-amber-950/20 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:border-amber-500/40',
    },
    violet: {
      bg: 'from-violet-900/30 to-violet-950/20 border-violet-500/20',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      glow: 'group-hover:border-violet-500/40',
    },
    sky: {
      bg: 'from-sky-900/30 to-sky-950/20 border-sky-500/20',
      iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      glow: 'group-hover:border-sky-500/40',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${scheme.bg} p-6 border transition-all duration-300 ${scheme.glow} hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
