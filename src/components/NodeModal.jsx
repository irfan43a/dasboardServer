import React, { useState } from 'react';
import { X, Server, Activity, Terminal, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatPercentage } from '../utils/formatters';

export function NodeModal({ node, onClose }) {
  const [pingRunning, setPingRunning] = useState(false);
  const [pingResults, setPingResults] = useState([]);

  if (!node) return null;

  const runPingTest = () => {
    setPingRunning(true);
    setPingResults([]);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const rtt = (node.ping + (Math.random() - 0.5) * 0.8).toFixed(2);
      setPingResults((prev) => [
        ...prev,
        `64 bytes from ${node.ip}: icmp_seq=${count} ttl=64 time=${rtt} ms`,
      ]);

      if (count >= 4) {
        clearInterval(interval);
        setPingRunning(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl font-mono text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-sans">
                {node.hostname}
              </h3>
              <p className="text-[11px] text-slate-400">
                {node.role} • {node.ip}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Specs Overview */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Rack Location:</span>
            <span className="text-xs font-bold text-white">{node.rack}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">System Uptime:</span>
            <span className="text-xs font-bold text-emerald-400">{node.uptime}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Load Average (1/5/15m):</span>
            <span className="text-xs font-bold text-cyan-400">{node.loadAvg}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Current Telemetry:</span>
            <span className="text-xs font-bold text-slate-200">
              CPU: {formatPercentage(node.cpu)} | RAM: {formatPercentage(node.mem)}
            </span>
          </div>
        </div>

        {/* Live Ping Terminal Test */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              ICMP Ping Diagnostic (Ping ke {node.ip})
            </span>
            <button
              onClick={runPingTest}
              disabled={pingRunning}
              className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-colors text-[10px] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${pingRunning ? 'animate-spin' : ''}`} />
              {pingRunning ? 'Pinging...' : 'Mulai Ping'}
            </button>
          </div>

          <div className="h-24 overflow-y-auto space-y-1 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-850">
            {pingResults.length === 0 ? (
              <span className="text-slate-500 italic">
                Klik 'Mulai Ping' untuk mengeksekusi uji latensi ICMP ke node ini...
              </span>
            ) : (
              pingResults.map((line, idx) => (
                <div key={idx} className="text-emerald-400 font-mono">
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
