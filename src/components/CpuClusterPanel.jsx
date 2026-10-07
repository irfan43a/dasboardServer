import React from 'react';
import { Cpu, Flame, Zap, ShieldCheck, Thermometer } from 'lucide-react';
import { formatPercentage, generateSvgPath } from '../utils/formatters';

export function CpuClusterPanel({ cpuData, chaosMode }) {
  const sparklineHistory = generateSvgPath(cpuData.history, 240, 36, 0, 100);

  // Helper for core color by load & temp
  const getCoreColor = (load, temp) => {
    if (load >= 85 || temp >= 75) {
      return {
        bg: 'bg-rose-950/40',
        border: 'border-rose-500/60',
        text: 'text-rose-400',
        bar: 'bg-rose-500',
        glow: 'shadow-rose-900/40',
      };
    }
    if (load >= 60 || temp >= 65) {
      return {
        bg: 'bg-amber-950/30',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        bar: 'bg-amber-500',
        glow: 'shadow-amber-900/30',
      };
    }
    return {
      bg: 'bg-slate-900/50',
      border: 'border-slate-800',
      text: 'text-cyan-400',
      bar: 'bg-cyan-500',
      glow: 'shadow-cyan-900/20',
    };
  };

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Beban CPU & Matrix Multi-Core
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                16 CORES
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate max-w-[280px] sm:max-w-none">
              {cpuData.model}
            </p>
          </div>
        </div>

        {/* Throttling Watchdog */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Thermal Throttle:</span>
          <span className="text-emerald-400 font-bold">0 EVENTS</span>
        </div>
      </div>

      {/* Aggregate Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 py-2 px-3 rounded-lg bg-slate-950/40 border border-slate-800/80 font-mono text-xs">
        <div>
          <span className="text-slate-400 text-[11px] block">Cluster Average:</span>
          <span className="text-white font-bold text-sm block">
            {formatPercentage(cpuData.overall)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Clock Frequency:</span>
          <span className="text-amber-400 font-bold text-sm block">
            {cpuData.freq} GHz
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Thermal Status:</span>
          <span className={`font-bold text-sm block ${cpuData.maxTemp > 75 ? 'text-rose-400' : 'text-slate-200'}`}>
            Avg {cpuData.avgTemp}°C • Peak {cpuData.maxTemp}°C
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Governor:</span>
          <span className="text-cyan-400 font-bold text-sm block">
            {cpuData.governor}
          </span>
        </div>
      </div>

      {/* Advanced CSS Grid: 16-Core Heatmap Matrix */}
      <div className="my-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Heatmap Beban Thread Per-Core</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-cyan-500"></span> &lt;60%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-500"></span> 60-84%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-rose-500"></span> &ge;85%
            </span>
          </div>
        </div>

        {/* 16-Core CSS Grid (4 cols on mobile, 4x4 or 8x2 on desktop) */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 font-mono">
          {cpuData.cores.map((core) => {
            const style = getCoreColor(core.load, core.temp);
            return (
              <div
                key={core.id}
                className={`p-2 rounded-lg border transition-all duration-200 flex flex-col justify-between ${style.bg} ${style.border} ${style.glow}`}
                title={`Core #${core.id}: ${core.load}% @ ${core.freq} GHz (${core.temp}°C)`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold">#{core.id.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-400">{core.temp}°C</span>
                </div>

                <div className={`text-xs font-bold ${style.text} my-0.5`}>
                  {core.load.toFixed(0)}%
                </div>

                {/* Micro Load Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden mt-1">
                  <div
                    className={`${style.bar} h-full transition-all duration-300`}
                    style={{ width: `${core.load}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Sparkline & Cluster Thermal Line */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-slate-400 text-[11px] block">Riwayat Tren Beban CPU</span>
          <span className="text-slate-300 text-xs">Rolling window 36 detik</span>
        </div>
        <div className="w-44 h-9">
          <svg viewBox="0 0 240 36" className="w-full h-full overflow-visible">
            <path
              d={sparklineHistory}
              fill="none"
              stroke={chaosMode ? '#f43f5e' : '#f59e0b'}
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

    </div>
  );
}
