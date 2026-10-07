import React from 'react';
import { X, HardDrive, CheckCircle2, ShieldCheck, Thermometer, Activity } from 'lucide-react';

export function DriveModal({ drive, onClose }) {
  if (!drive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl font-mono text-xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-sans">
                Inspeksi SMART // BAY-0{drive.bay}
              </h3>
              <p className="text-[11px] text-slate-400">
                {drive.model} ({drive.type})
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

        {/* Status Highlights */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Kesehatan Drive</span>
            <span className="text-base font-bold text-emerald-400">{drive.health}%</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Temperatur</span>
            <span className="text-base font-bold text-cyan-400">{drive.temp}°C</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Endurance Terpakai</span>
            <span className="text-base font-bold text-slate-200">{drive.wear}% TBW</span>
          </div>
        </div>

        {/* Deep SMART Attributes */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-[11px]">
          <div className="flex justify-between py-1 border-b border-slate-850">
            <span className="text-slate-400">Status Array ZFS:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ONLINE (0 CHECKSUM ERRORS)
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-850">
            <span className="text-slate-400">Throughput Baca / Tulis:</span>
            <span className="text-white font-medium">{drive.readSpeed} / {drive.writeSpeed}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-850">
            <span className="text-slate-400">Total IOPS Sesaat:</span>
            <span className="text-indigo-400 font-semibold">{drive.iops.toLocaleString()} IOPS</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-850">
            <span className="text-slate-400">Reallocated Sectors:</span>
            <span className="text-emerald-400 font-semibold">0 (Passed)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">PCIe Link Negotiated:</span>
            <span className="text-slate-200">Gen4 x4 (64 GT/s)</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            Tutup Dialog
          </button>
        </div>

      </div>
    </div>
  );
}
