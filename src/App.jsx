import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveMetrics } from './hooks/useLiveMetrics';
import { Header } from './components/Header';
import { TopSummaryBar } from './components/TopSummaryBar';
import { NetworkTrafficPanel } from './components/NetworkTrafficPanel';
import { CpuClusterPanel } from './components/CpuClusterPanel';
import { MemoryPanel } from './components/MemoryPanel';
import { StorageNasPanel } from './components/StorageNasPanel';
import { LatencyMatrixPanel } from './components/LatencyMatrixPanel';
import { ServerFleetPanel } from './components/ServerFleetPanel';
import { EventStreamPanel } from './components/EventStreamPanel';
import { DriveModal } from './components/DriveModal';
import { NodeModal } from './components/NodeModal';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('noc-theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('noc-theme', next);
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Telemetry stream & state
  const {
    isPaused,
    setIsPaused,
    tickRate,
    setTickRate,
    soundEnabled,
    toggleSound,
    chaosMode,
    triggerChaos,
    activeInterface,
    setActiveInterface,
    networkHistory,
    interfaces,
    cpuData,
    memoryData,
    storageData,
    nodes,
    latencyMatrix,
    events,
    clearEvents,
    selectedDriveBay,
    setSelectedDriveBay,
    selectedNode,
    setSelectedNode,
  } = useLiveMetrics();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-[#070b12] light:bg-[#f1f5f9] light:text-slate-900 transition-colors duration-300 font-sans">
      
      {/* Background Matrix / Grid texture */}
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-60 z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Bar */}
        <Header
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          tickRate={tickRate}
          setTickRate={setTickRate}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          chaosMode={chaosMode}
          triggerChaos={triggerChaos}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-3 sm:p-5 max-w-[1920px] mx-auto w-full space-y-4">
          
          {/* Top KPI Summary Bar (4 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TopSummaryBar
              networkHistory={networkHistory}
              cpuData={cpuData}
              memoryData={memoryData}
              storageData={storageData}
              chaosMode={chaosMode}
            />
          </motion.div>

          {/* Master CSS Grid Layout */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* ROW 1: Network Traffic Inspector (8 cols) & CPU Heatmap Matrix (4 cols) */}
            <motion.div
              className="col-span-12 xl:col-span-8 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <NetworkTrafficPanel
                networkHistory={networkHistory}
                interfaces={interfaces}
                activeInterface={activeInterface}
                setActiveInterface={setActiveInterface}
                chaosMode={chaosMode}
              />
            </motion.div>

            <motion.div
              className="col-span-12 xl:col-span-4 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <CpuClusterPanel
                cpuData={cpuData}
                chaosMode={chaosMode}
              />
            </motion.div>

            {/* ROW 2: RAM & Swap (4 cols), NAS Storage & NVMe Bays (5 cols), Latency Matrix (3 cols) */}
            <motion.div
              className="col-span-12 lg:col-span-4 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <MemoryPanel
                memoryData={memoryData}
              />
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-5 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <StorageNasPanel
                storageData={storageData}
                setSelectedDriveBay={setSelectedDriveBay}
                chaosMode={chaosMode}
              />
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-3 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <LatencyMatrixPanel
                latencyMatrix={latencyMatrix}
                chaosMode={chaosMode}
              />
            </motion.div>

            {/* ROW 3: Server Fleet Rack Nodes (7 cols) & System Event Stream (5 cols) */}
            <motion.div
              className="col-span-12 xl:col-span-7 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
            >
              <ServerFleetPanel
                nodes={nodes}
                setSelectedNode={setSelectedNode}
              />
            </motion.div>

            <motion.div
              className="col-span-12 xl:col-span-5 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 }}
            >
              <EventStreamPanel
                events={events}
                clearEvents={clearEvents}
              />
            </motion.div>

          </div>

        </main>

        {/* Global Footer Status Bar */}
        <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-2.5 px-4 text-xs font-mono text-slate-400">
          <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> ALL SUBSYSTEMS NOMINAL
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline">Engine: React 19 + Framer Motion (60 FPS Constant Stream)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>Zero Jitter Ring Buffer: {networkHistory.length} frames</span>
              <span>Memory Footprint: O(1) Stable</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Interactive Telemetry Modal Dialogs */}
      <AnimatePresence>
        {selectedDriveBay && (
          <DriveModal
            drive={selectedDriveBay}
            onClose={() => setSelectedDriveBay(null)}
          />
        )}
        {selectedNode && (
          <NodeModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
