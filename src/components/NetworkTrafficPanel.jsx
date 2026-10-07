import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Activity, 
  Layers, 
  AlertTriangle, 
  Radio, 
  ShieldAlert,
  Gauge
} from 'lucide-react';
import { formatBitrate, generateSvgPath, generateSvgArea } from '../utils/formatters';

export function NetworkTrafficPanel({
  networkHistory,
  interfaces,
  activeInterface,
  setActiveInterface,
  chaosMode,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const iface = interfaces[activeInterface] || interfaces.eth0;
  const currentNetwork = networkHistory[networkHistory.length - 1] || { rx: 0, tx: 0, dropped: 0 };

  // Calculate dynamic max scale for the graph
  const maxRate = useMemo(() => {
    let peak = 1000;
    networkHistory.forEach((d) => {
      if (d.rx > peak) peak = d.rx;
      if (d.tx > peak) peak = d.tx;
    });
    return Math.ceil(peak * 1.15 / 100) * 100;
  }, [networkHistory]);

  // Extract arrays for SVG generation
  const rxData = useMemo(() => networkHistory.map((d) => d.rx), [networkHistory]);
  const txData = useMemo(() => networkHistory.map((d) => d.tx), [networkHistory]);

  const svgWidth = 720;
  const svgHeight = 220;

  const rxPath = useMemo(() => generateSvgPath(rxData, svgWidth, svgHeight, 0, maxRate), [rxData, maxRate]);
  const rxArea = useMemo(() => generateSvgArea(rxData, svgWidth, svgHeight, 0, maxRate), [rxData, maxRate]);

  const txPath = useMemo(() => generateSvgPath(txData, svgWidth, svgHeight, 0, maxRate), [txData, maxRate]);
  const txArea = useMemo(() => generateSvgArea(txData, svgWidth, svgHeight, 0, maxRate), [txData, maxRate]);

  // Total drops in current window
  const totalDropped = networkHistory.reduce((acc, curr) => acc + (curr.dropped || 0), 0);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      
      {/* Top Header & Interface Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Lalu Lintas Jaringan & Bandwidth Live
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                10GbE SFP+
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Inbound / Outbound Telemetry Stream // RX: TX Dual Waveform
            </p>
          </div>
        </div>

        {/* Interface Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {Object.entries(interfaces).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setActiveInterface(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                activeInterface === key
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:text-slate-200'
              }`}
            >
              <span className="font-bold">{item.id}</span>
              <span className="text-[10px] opacity-75 ml-1 hidden md:inline">({item.status})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interface Info Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 py-2 px-3 rounded-lg bg-slate-950/40 border border-slate-800/80 font-mono text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Interface / Alias:</span>
          <span className="text-white font-semibold truncate block">{iface.name}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">IP Address:</span>
          <span className="text-cyan-300 block truncate">{iface.ip}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Duplex / MTU:</span>
          <span className="text-slate-200 block truncate">{iface.duplex} • MTU {iface.mtu}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Packet Rate:</span>
          <span className="text-emerald-400 font-semibold block">{iface.pps.toLocaleString()} pps</span>
        </div>
      </div>

      {/* Main Streaming Waveform SVG Graph */}
      <div className="relative w-full my-2 bg-slate-950/60 rounded-lg p-3 border border-slate-800">
        
        {/* Graph Legend & Status Badge */}
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400"></span>
              <span className="text-slate-300 font-semibold">RX Inbound:</span>
              <span className="text-cyan-400 font-bold">{formatBitrate(currentNetwork.rx)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400"></span>
              <span className="text-slate-300 font-semibold">TX Outbound:</span>
              <span className="text-emerald-400 font-bold">{formatBitrate(currentNetwork.tx)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalDropped > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 font-semibold animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                {totalDropped} DROPPED PKTS
              </span>
            )}
            <span className="text-[10px] text-slate-400">Skala: 0 - {formatBitrate(maxRate)}</span>
          </div>
        </div>

        {/* SVG Container */}
        <div className="relative h-48 w-full overflow-hidden">
          
          {/* Subtle Grid Guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-slate-600 w-full"></div>
            <div className="border-b border-dashed border-slate-600 w-full"></div>
            <div className="border-b border-dashed border-slate-600 w-full"></div>
            <div className="border-b border-dashed border-slate-600 w-full"></div>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Cyan Gradient for RX */}
              <linearGradient id="rxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>

              {/* Emerald Gradient for TX */}
              <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Inbound Area & Line */}
            <path d={rxArea} fill="url(#rxGradient)" />
            <path
              d={rxPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-200"
            />

            {/* Outbound Area & Line */}
            <path d={txArea} fill="url(#txGradient)" />
            <path
              d={txPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 2"
              strokeLinecap="round"
              className="transition-all duration-200"
            />
          </svg>

          {/* Real-time scanning pulse line */}
          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-cyan-400/80 shadow-[0_0_8px_#06b6d4] pointer-events-none"></div>
        </div>

        {/* Dynamic Timeline labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-1">
          <span>-36 detik</span>
          <span>-24 detik</span>
          <span>-12 detik</span>
          <span className="text-cyan-400 font-bold">SEKARANG (LIVE)</span>
        </div>
      </div>

      {/* Bottom Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 pt-3 border-t border-slate-800 font-mono text-xs">
        
        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peak RX (Session)</span>
          </div>
          <span className="text-sm font-bold text-white">
            {formatBitrate(Math.max(...rxData, 1))}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Peak TX (Session)</span>
          </div>
          <span className="text-sm font-bold text-white">
            {formatBitrate(Math.max(...txData, 1))}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Jitter / Variance</span>
          </div>
          <span className="text-sm font-bold text-amber-300">
            {chaosMode ? '8.4 ms (Elevated)' : '1.14 ms (Optimal)'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Packet Loss</span>
          </div>
          <span className={`text-sm font-bold ${chaosMode ? 'text-rose-400' : 'text-emerald-400'}`}>
            {chaosMode ? '0.42% (Warning)' : '0.00% (Lossless)'}
          </span>
        </div>

      </div>

    </div>
  );
}
