import React from 'react';
import { Globe, Radio, Signal, Wifi } from 'lucide-react';

export function LatencyMatrixPanel({ latencyMatrix, chaosMode }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Matriks Latensi Antar-DC Global
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
                BGP ANYCAST
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              RTT Ping & Quality of Service (QoS) Multi-Region
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-emerald-400">
          <Signal className="w-3.5 h-3.5" />
          <span>ALL POPs REACHABLE</span>
        </div>
      </div>

      {/* Latency Matrix List / Grid */}
      <div className="space-y-2.5 my-3 font-mono text-xs">
        {latencyMatrix.map((item) => (
          <div
            key={item.code}
            className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                {item.code}
              </span>
              <div>
                <span className="text-slate-200 font-semibold block">{item.location}</span>
                <span className="text-[10px] text-slate-400">Jitter: {item.jitter}ms • Loss: {item.loss}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className={`text-sm font-bold ${
                  item.ping > 100 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.ping}
                </span>
                <span className="text-[10px] text-slate-400">ms</span>
              </div>
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-850 text-slate-400">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
        <span>BGP Peer AS13335 (Cloudflare)</span>
        <span className="text-cyan-400">LACP 20G Trunk</span>
      </div>

    </div>
  );
}
