import React from 'react';
import { Database, Server, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import { formatPercentage } from '../utils/formatters';

export function MemoryPanel({ memoryData }) {
  const usedPct = (memoryData.used / memoryData.total) * 100;
  const cachedPct = (memoryData.cached / memoryData.total) * 100;
  const buffersPct = (memoryData.buffers / memoryData.total) * 100;
  const freePct = (memoryData.free / memoryData.total) * 100;

  const swapPct = (memoryData.swapUsed / memoryData.swapTotal) * 100;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Alokasi RAM & Swap Kernel
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                128 GB ECC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Memori Fisik & Swap Linux Kernel vm.swappiness=10
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NO MEMORY LEAKS</span>
        </div>
      </div>

      {/* Stacked Memory Bar */}
      <div className="my-3 font-mono text-xs">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-slate-400">Distribusi Memori Fisik:</span>
          <span className="text-white font-bold">
            {memoryData.used.toFixed(1)} GB / {memoryData.total} GB ({formatPercentage(usedPct)})
          </span>
        </div>

        {/* Stacked progress bar */}
        <div className="w-full bg-slate-950 rounded-lg h-3 overflow-hidden flex border border-slate-800">
          <div
            title={`Active Used: ${memoryData.used.toFixed(1)} GB`}
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${usedPct}%` }}
          />
          <div
            title={`Cached: ${memoryData.cached.toFixed(1)} GB`}
            className="bg-cyan-500/80 h-full transition-all duration-300"
            style={{ width: `${cachedPct}%` }}
          />
          <div
            title={`Buffers: ${memoryData.buffers.toFixed(1)} GB`}
            className="bg-indigo-500/80 h-full transition-all duration-300"
            style={{ width: `${buffersPct}%` }}
          />
          <div
            title={`Free: ${memoryData.free.toFixed(1)} GB`}
            className="bg-slate-800 h-full transition-all duration-300"
            style={{ width: `${freePct}%` }}
          />
        </div>

        {/* Stacked Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span className="text-slate-400">Aktif:</span>
            <span className="text-white font-semibold">{memoryData.used.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
            <span className="text-slate-400">Cached:</span>
            <span className="text-white font-semibold">{memoryData.cached.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
            <span className="text-slate-400">Buffers:</span>
            <span className="text-white font-semibold">{memoryData.buffers.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-700"></span>
            <span className="text-slate-400">Bebas:</span>
            <span className="text-white font-semibold">{memoryData.free.toFixed(1)} GB</span>
          </div>
        </div>
      </div>

      {/* Swap Bar */}
      <div className="my-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 font-mono text-xs">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-slate-400">NVMe ZRAM / Swap Space:</span>
          <span className="text-slate-300">
            {memoryData.swapUsed.toFixed(1)} GB / {memoryData.swapTotal} GB ({formatPercentage(swapPct)})
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${swapPct}%` }}
          />
        </div>
      </div>

      {/* Top Consuming Processes */}
      <div className="mt-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            Top Proses Memori (RSS)
          </span>
          <span className="text-[11px] text-slate-400">Top 5 Daemon</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {memoryData.processes.map((proc) => (
            <div
              key={proc.pid}
              className="flex items-center justify-between p-1.5 px-2 rounded bg-slate-950/40 border border-slate-850 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-400 text-[10px] w-10">#{proc.pid}</span>
                <span className="text-slate-200 font-semibold truncate text-[11px]">{proc.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-amber-400">{proc.cpu}% CPU</span>
                <span className="text-emerald-400 font-bold">{proc.mem}% RAM</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
