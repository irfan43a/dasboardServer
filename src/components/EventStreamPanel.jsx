import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Lock, 
  Unlock 
} from 'lucide-react';

export function EventStreamPanel({ events, clearEvents }) {
  const [filter, setFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const logContainerRef = useRef(null);

  // Auto-scroll when new events arrive if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [events, autoScroll]);

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    return e.level === filter;
  });

  const copyToClipboard = () => {
    const text = events.map((e) => `[${e.time}] [${e.level}] [${e.source}] ${e.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'CRIT':
        return {
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
          bg: 'bg-rose-950/60 text-rose-300 border-rose-800',
        };
      case 'WARN':
        return {
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800',
        };
      case 'SUCCESS':
        return {
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
        };
      default:
        return {
          icon: <Info className="w-3 h-3 text-cyan-400" />,
          bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800',
        };
    }
  };

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Stream Log & Insiden Sistem
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                LIVE TAIL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Event Log Real-time Kernel, Daemon, Jaringan & Storage
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
              autoScroll
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-800/40 text-slate-400 border-slate-700'
            }`}
            title={autoScroll ? 'Kunci Auto-scroll aktif' : 'Auto-scroll dijeda'}
          >
            {autoScroll ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span className="text-[10px] hidden md:inline">AUTO-TAIL</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:text-white transition-colors"
            title="Salin semua log"
          >
            <Copy className="w-3 h-3" />
          </button>

          <button
            onClick={clearEvents}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Bersihkan log"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 my-2.5 font-mono text-xs overflow-x-auto pb-1">
        {['ALL', 'CRIT', 'WARN', 'INFO', 'SUCCESS'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
              filter === lvl
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
        {copied && (
          <span className="text-[10px] text-emerald-400 ml-auto font-mono">
            Tersalin ke clipboard!
          </span>
        )}
      </div>

      {/* Terminal Scroll Container */}
      <div
        ref={logContainerRef}
        className="h-64 overflow-y-auto space-y-2 pr-1 font-mono text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-850"
      >
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Tidak ada event untuk filter [{filter}]
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const badge = getLevelBadge(evt.level);
            return (
              <div
                key={evt.id}
                className="p-2 rounded bg-slate-900/60 border border-slate-850 hover:border-slate-750 transition-colors flex flex-col sm:flex-row sm:items-baseline gap-2"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 text-[10px]">{evt.time}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold flex items-center gap-1 ${badge.bg}`}>
                    {badge.icon}
                    {evt.level}
                  </span>
                  <span className="text-cyan-400/90 text-[10px] font-semibold">
                    [{evt.source}]
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] break-words">
                  {evt.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between items-center mt-2">
        <span>Menampilkan {filteredEvents.length} entri</span>
        <span className="text-slate-500">Buffer: 50 events maks</span>
      </div>

    </div>
  );
}
