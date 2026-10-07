import React from 'react';
import { Server, Wifi, CheckCircle2, AlertCircle, RefreshCw, Terminal } from 'lucide-react';
import { formatPercentage } from '../utils/formatters';

export function ServerFleetPanel({ nodes, setSelectedNode }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Armada Server & Rack Node Status
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                6/6 ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Infrastruktur Fisik & Bare-Metal Hypervisor Cluster
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 100% Operational
          </span>
        </div>
      </div>

      {/* Rack Node Grid (CSS Grid 2 or 3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-3">
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Node Top Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                    {node.hostname}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-850 text-slate-400 border border-slate-700">
                  {node.ping}ms
                </span>
              </div>

              {/* Role & Rack Location */}
              <div className="text-xs text-slate-400 font-mono mb-2">
                <div className="text-slate-300 font-medium truncate">{node.role}</div>
                <div className="text-[11px] text-cyan-400/90">{node.rack} • {node.ip}</div>
              </div>

              {/* CPU & RAM Mini Gauges */}
              <div className="space-y-1.5 font-mono text-[11px] my-2">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>CPU:</span>
                    <span className="text-slate-200 font-semibold">{formatPercentage(node.cpu)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        node.cpu > 75 ? 'bg-amber-400' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${node.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>RAM:</span>
                    <span className="text-slate-200 font-semibold">{formatPercentage(node.mem)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${node.mem}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-400 mt-2">
              <span>Up: {node.uptime}</span>
              <span className="text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Detail
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary Bar */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Total Cluster Cores: 96 vCPUs</span>
        <span>Total RAM: 768 GB ECC Registered</span>
      </div>

    </div>
  );
}
