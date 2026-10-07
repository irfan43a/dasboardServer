import React from 'react';
import { 
  Activity, 
  Wifi, 
  Zap, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Maximize2, 
  Flame, 
  ShieldCheck, 
  Server
} from 'lucide-react';

export function Header({
  isPaused,
  setIsPaused,
  tickRate,
  setTickRate,
  soundEnabled,
  toggleSound,
  chaosMode,
  triggerChaos,
  theme,
  toggleTheme,
}) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="border-b border-slate-700/60 bg-slate-900/90 dark:bg-slate-950/80 backdrop-blur-xl px-4 py-3 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${chaosMode ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${chaosMode ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-wider text-slate-100 dark:text-white uppercase font-sans">
                NOC Command Center
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-semibold tracking-wider">
                v4.8-PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span>TELCO-POP // JAKARTA ID</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> WS-STREAM LIVE
              </span>
            </p>
          </div>
        </div>

        {/* Global Cluster Status Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Nodes:</span>
            <span className="text-emerald-400 font-semibold">6/6 ONLINE</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">SLA Uptime:</span>
            <span className="text-slate-200 font-semibold">99.98%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Latency:</span>
            <span className="text-cyan-300 font-semibold">~2.8ms</span>
          </div>
        </div>

        {/* Live Controls and Simulation Tools */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Tick Rate / Polling Frequency Selector */}
          <div className="flex items-center rounded-lg border border-slate-700/60 bg-slate-800/50 p-0.5 text-xs font-mono">
            {[
              { rate: 250, label: '250ms' },
              { rate: 500, label: '500ms' },
              { rate: 1000, label: '1s' },
              { rate: 2000, label: '2s' },
            ].map(({ rate, label }) => (
              <button
                key={rate}
                onClick={() => setTickRate(rate)}
                className={`px-2 py-1 rounded transition-colors text-xs ${
                  tickRate === rate
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Frekuensi pembaruan data: ${label}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Pause / Resume Live Stream */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/50'
            }`}
            title={isPaused ? 'Lanjutkan streaming data' : 'Jeda streaming data'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          {/* Simulate Chaos / Spike Button */}
          <button
            onClick={triggerChaos}
            disabled={chaosMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
              chaosMode
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50'
            }`}
            title="Simulasikan lonjakan beban traffic jaringan dan CPU (Uji ketahanan render tanpa lag)"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{chaosMode ? 'CHAOS SPIKE ACTIVE!' : 'SIMULATE SPIKE'}</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Matikan audio telemetry' : 'Nyalakan audio telemetry blip'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-300 hover:text-white transition-colors"
            title={`Ganti tema (${theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'})`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-300 hover:text-white transition-colors hidden sm:block"
            title="Layar Penuh"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </header>
  );
}
