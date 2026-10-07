import React from 'react';
import { 
  HardDrive, 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal, 
  ArrowDown, 
  ArrowUp,
  Cpu
} from 'lucide-react';
import { formatPercentage } from '../utils/formatters';

export function StorageNasPanel({ storageData, setSelectedDriveBay, chaosMode }) {
  const totalIops = storageData.totalReadIops + storageData.totalWriteIops;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Kapasitas Penyimpanan NAS & ZFS Pools
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                ZFS RAID-Z2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Enterprise Storage Array // 8x NVMe U.3 Hot-Swap Bays
            </p>
          </div>
        </div>

        {/* Global Storage IOPS */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">Total IOPS:</span>
            <span className="text-indigo-400 font-bold">{totalIops.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-semibold">POOL ONLINE</span>
          </div>
        </div>
      </div>

      {/* ZFS Storage Pools Overview (CSS Grid 2 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
        {storageData.pools.map((pool) => {
          const usedPct = (pool.usedTb / pool.totalTb) * 100;
          return (
            <div
              key={pool.id}
              className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 font-mono text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white font-bold tracking-wide">{pool.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    {pool.health}
                  </span>
                </div>
                
                <div className="flex items-baseline justify-between text-slate-300 mb-1">
                  <span className="text-sm font-bold text-white">
                    {pool.usedTb.toFixed(1)} TB <span className="text-xs font-normal text-slate-400">terpakai</span>
                  </span>
                  <span className="text-xs font-semibold text-indigo-400">
                    {pool.availTb.toFixed(1)} TB kosong ({formatPercentage(usedPct)})
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-1.5 flex">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                <span>Kompresi: {pool.compression}</span>
                <span className="text-slate-300">Scrub: {pool.scrub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 8-Drive Hot-Swap Matrix (Advanced CSS Grid) */}
      <div className="my-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Status Bay Drive Fisik (Klik drive untuk inspeksi SMART)</span>
          <span className="text-emerald-400 text-[11px]">8/8 NVMe U.3 Beroperasi</span>
        </div>

        {/* CSS Grid for 8 Hot Swap Bays */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono">
          {storageData.drives.map((drive) => (
            <button
              key={drive.bay}
              onClick={() => setSelectedDriveBay(drive)}
              className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-300">BAY-0{drive.bay}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                {drive.type}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>{drive.temp}°C</span>
                <span className="text-emerald-400 font-bold">{drive.health}%</span>
              </div>

              <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                {drive.iops.toLocaleString()} IOPS
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time I/O Throughput Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800 font-mono text-xs">
        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <ArrowDown className="w-3 h-3 text-cyan-400" /> Read Throughput
          </div>
          <span className="text-sm font-bold text-white block mt-0.5">
            {storageData.readRate} MB/s
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <ArrowUp className="w-3 h-3 text-emerald-400" /> Write Throughput
          </div>
          <span className="text-sm font-bold text-white block mt-0.5">
            {storageData.writeRate} MB/s
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <RefreshCw className="w-3 h-3 text-indigo-400" /> Read IOPS
          </div>
          <span className="text-sm font-bold text-indigo-300 block mt-0.5">
            {storageData.totalReadIops.toLocaleString()}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <RefreshCw className="w-3 h-3 text-amber-400" /> Write IOPS
          </div>
          <span className="text-sm font-bold text-amber-300 block mt-0.5">
            {storageData.totalWriteIops.toLocaleString()}
          </span>
        </div>
      </div>

    </div>
  );
}
