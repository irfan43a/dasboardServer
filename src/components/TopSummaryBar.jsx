import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Cpu, Database, HardDrive, Network } from 'lucide-react';
import { formatBitrate, formatPercentage, generateSvgPath } from '../utils/formatters';

export function TopSummaryBar({ networkHistory, cpuData, memoryData, storageData, chaosMode }) {
  const currentNetwork = networkHistory[networkHistory.length - 1] || { rx: 0, tx: 0 };
  const totalBitrate = currentNetwork.rx + currentNetwork.tx;
  
  // Extract sparkline values
  const rxValues = networkHistory.map((d) => d.rx);
  const cpuValues = cpuData.history || [];
  
  const sparklineRx = generateSvgPath(rxValues, 120, 28);
  const sparklineCpu = generateSvgPath(cpuValues, 120, 28, 0, 100);

  const memPercent = (memoryData.used / memoryData.total) * 100;
  const storageTotal = storageData.pools.reduce((acc, p) => acc + p.totalTb, 0);
  const storageUsed = storageData.pools.reduce((acc, p) => acc + p.usedTb, 0);
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
      
      {/* 1. Bandwidth Throughput Card */}
      <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
        chaosMode
          ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30'
          : 'bg-slate-900/60 dark:bg-slate-900/70 border-slate-700/50 hover:border-cyan-500/40'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Network className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wide">
              Total Throughput
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            10GbE WAN
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white flex items-baseline gap-1">
              {formatBitrate(totalBitrate)}
            </div>
            <div className="flex items-center gap-3 text-xs font-mono mt-1 text-slate-400">
              <span className="text-cyan-400 flex items-center gap-0.5">
                <ArrowDownLeft className="w-3 h-3" /> {formatBitrate(currentNetwork.rx)}
              </span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {formatBitrate(currentNetwork.tx)}
              </span>
            </div>
          </div>

          {/* Mini Sparkline */}
          <div className="w-28 h-8 flex items-center justify-end">
            <svg viewBox="0 0 120 28" className="w-full h-full overflow-visible">
              <path
                d={sparklineRx}
                fill="none"
                stroke={chaosMode ? '#f43f5e' : '#06b6d4'}
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Cluster CPU Load Card */}
      <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
        cpuData.overall > 85 || chaosMode
          ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30'
          : 'bg-slate-900/60 dark:bg-slate-900/70 border-slate-700/50 hover:border-amber-500/40'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wide">
              Cluster CPU Load
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
            {cpuData.cores.length} Cores
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white flex items-baseline gap-1">
              {formatPercentage(cpuData.overall)}
            </div>
            <div className="flex items-center gap-3 text-xs font-mono mt-1 text-slate-400">
              <span className="text-amber-400 font-semibold">{cpuData.freq} GHz</span>
              <span>Avg {cpuData.avgTemp}°C</span>
              <span className={cpuData.maxTemp > 75 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                Peak {cpuData.maxTemp}°C
              </span>
            </div>
          </div>

          {/* Mini Sparkline */}
          <div className="w-28 h-8 flex items-center justify-end">
            <svg viewBox="0 0 120 28" className="w-full h-full overflow-visible">
              <path
                d={sparklineCpu}
                fill="none"
                stroke={cpuData.overall > 80 ? '#f43f5e' : '#f59e0b'}
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Memory Allocation Card */}
      <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/60 dark:bg-slate-900/70 hover:border-emerald-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wide">
              RAM Allocation
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            DDR4 ECC
          </span>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {memoryData.used.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ {memoryData.total} GB</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {formatPercentage(memPercent)}
            </span>
          </div>

          {/* Mini progress gauge */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${memPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
            <span>Free: {memoryData.free.toFixed(1)} GB</span>
            <span>Cached: {memoryData.cached.toFixed(1)} GB</span>
          </div>
        </div>
      </div>

      {/* 4. Storage Array Card */}
      <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/60 dark:bg-slate-900/70 hover:border-indigo-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wide">
              NAS Storage Pool
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
            8x NVMe U.3
          </span>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {storageUsed.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ {storageTotal.toFixed(0)} TB</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {formatPercentage(storagePercent)}
            </span>
          </div>

          {/* Mini progress gauge */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden flex">
            <div
              className="bg-indigo-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
            <span>IOPS: {(storageData.totalReadIops + storageData.totalWriteIops).toLocaleString()}</span>
            <span className="text-emerald-400 font-semibold">ALL DRIVES HEALTHY</span>
          </div>
        </div>
      </div>

    </div>
  );
}
