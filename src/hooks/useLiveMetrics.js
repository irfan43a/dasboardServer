import { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../utils/audio';

const HISTORY_LENGTH = 36;

export function useLiveMetrics() {
  const [isPaused, setIsPaused] = useState(false);
  const [tickRate, setTickRate] = useState(1000); // 1000ms default
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeInterface, setActiveInterface] = useState('eth0');
  const [selectedDriveBay, setSelectedDriveBay] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Time reference for timestamping
  const timeStepRef = useRef(0);
  const chaosTimerRef = useRef(null);

  // Initial network history
  const [networkHistory, setNetworkHistory] = useState(() => {
    const list = [];
    for (let i = HISTORY_LENGTH; i >= 0; i--) {
      list.push({
        time: `${i}s`,
        rx: 450 + Math.sin(i * 0.4) * 80 + Math.random() * 40,
        tx: 180 + Math.cos(i * 0.4) * 40 + Math.random() * 20,
        dropped: Math.random() > 0.85 ? Math.floor(Math.random() * 4) : 0,
      });
    }
    return list;
  });

  // Interfaces data
  const [interfaces, setInterfaces] = useState({
    eth0: { id: 'eth0', name: 'WAN 1 (10G SFP+ Fiber)', ip: '103.28.14.92/29', mtu: 9000, rx: 642.5, tx: 218.4, pps: 94200, status: 'UP', duplex: 'Full 10Gbps' },
    eth1: { id: 'eth1', name: 'LAN Trunk (10G DAC)', ip: '10.0.0.1/24', mtu: 1500, rx: 320.1, tx: 512.9, pps: 68100, status: 'UP', duplex: 'Full 10Gbps' },
    bond0: { id: 'bond0', name: 'LACP Cluster Interconnect', ip: '172.16.0.1/16', mtu: 9000, rx: 890.3, tx: 740.1, pps: 142000, status: 'UP', duplex: 'Full 20Gbps (2x10G)' },
    tun0: { id: 'tun0', name: 'WireGuard Mesh Gateway', ip: '10.88.0.1/24', mtu: 1420, rx: 45.2, tx: 38.6, pps: 12400, status: 'UP', duplex: 'Virtual L3' },
  });

  // CPU cores data
  const [cpuData, setCpuData] = useState(() => {
    const cores = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      load: 25 + Math.random() * 30,
      temp: 48 + Math.random() * 12,
      freq: 3.8 + Math.random() * 0.6,
    }));
    return {
      model: 'AMD EPYC™ 7763 64-Core (16 vCPUs Bound)',
      overall: 38.4,
      avgTemp: 54.2,
      maxTemp: 66.8,
      freq: 4.15,
      governor: 'Performance',
      cores,
      history: Array.from({ length: HISTORY_LENGTH }, (_, i) => 30 + Math.random() * 20),
    };
  });

  // Memory data
  const [memoryData, setMemoryData] = useState({
    total: 128, // GB
    used: 76.4,
    free: 22.8,
    cached: 24.2,
    buffers: 4.6,
    swapTotal: 32,
    swapUsed: 3.4,
    processes: [
      { pid: 1402, name: 'k8s-kubelet', user: 'root', cpu: 14.2, mem: 16.8, threads: 128 },
      { pid: 2180, name: 'postgres: worker', user: 'postgres', cpu: 12.8, mem: 24.4, threads: 64 },
      { pid: 3042, name: 'redis-server: 6379', user: 'redis', cpu: 8.4, mem: 14.1, threads: 16 },
      { pid: 1891, name: 'envoy-proxy', user: 'envoy', cpu: 6.9, mem: 8.2, threads: 32 },
      { pid: 4521, name: 'prometheus-node', user: 'prom', cpu: 3.1, mem: 4.5, threads: 24 },
    ],
  });

  // Storage / NAS ZFS data
  const [storageData, setStorageData] = useState({
    pools: [
      {
        id: 'pool-tank-01',
        name: 'tank-zfs-data (RAID-Z2)',
        totalTb: 96,
        usedTb: 64.8,
        availTb: 31.2,
        health: 'HEALTHY',
        scrub: 'Selesai 4j yang lalu (0 error)',
        compression: '1.45x (LZ4)',
        dedup: 'Off',
      },
      {
        id: 'pool-nvme-fast',
        name: 'nvme-scratch-fast (Stripe-Mirror)',
        totalTb: 15.36,
        usedTb: 9.42,
        availTb: 5.94,
        health: 'HEALTHY',
        scrub: 'Sedang berjalan (78%)',
        compression: '1.22x (ZSTD)',
        dedup: 'Off',
      },
    ],
    drives: [
      { bay: 1, model: 'Samsung PM9A3 3.84TB', type: 'NVMe U.3', temp: 41, health: 99, status: 'ONLINE', iops: 14200, wear: 2, readSpeed: '420 MB/s', writeSpeed: '280 MB/s' },
      { bay: 2, model: 'Samsung PM9A3 3.84TB', type: 'NVMe U.3', temp: 42, health: 99, status: 'ONLINE', iops: 13800, wear: 2, readSpeed: '390 MB/s', writeSpeed: '290 MB/s' },
      { bay: 3, model: 'Samsung PM9A3 3.84TB', type: 'NVMe U.3', temp: 44, health: 98, status: 'ONLINE', iops: 15100, wear: 3, readSpeed: '440 MB/s', writeSpeed: '310 MB/s' },
      { bay: 4, model: 'Samsung PM9A3 3.84TB', type: 'NVMe U.3', temp: 43, health: 99, status: 'ONLINE', iops: 12900, wear: 2, readSpeed: '380 MB/s', writeSpeed: '270 MB/s' },
      { bay: 5, model: 'Micron 7450 PRO 7.68TB', type: 'NVMe U.3', temp: 39, health: 100, status: 'ONLINE', iops: 9400, wear: 1, readSpeed: '310 MB/s', writeSpeed: '190 MB/s' },
      { bay: 6, model: 'Micron 7450 PRO 7.68TB', type: 'NVMe U.3', temp: 40, health: 100, status: 'ONLINE', iops: 9600, wear: 1, readSpeed: '320 MB/s', writeSpeed: '195 MB/s' },
      { bay: 7, model: 'Micron 7450 PRO 7.68TB', type: 'NVMe U.3', temp: 41, health: 97, status: 'ONLINE', iops: 10200, wear: 4, readSpeed: '330 MB/s', writeSpeed: '210 MB/s' },
      { bay: 8, model: 'Micron 7450 PRO 7.68TB', type: 'NVMe U.3', temp: 45, health: 96, status: 'ONLINE', iops: 11100, wear: 5, readSpeed: '350 MB/s', writeSpeed: '220 MB/s' },
    ],
    totalReadIops: 42500,
    totalWriteIops: 28400,
    readRate: 1420, // MB/s
    writeRate: 850,  // MB/s
  });

  // Cluster server nodes
  const [nodes, setNodes] = useState([
    {
      id: 'srv-edge-01',
      hostname: 'edge-gw-01.noc.internal',
      role: 'BGP Edge Router / Firewall',
      ip: '10.0.0.1',
      rack: 'RACK-A01 [U41-42]',
      ping: 2.1,
      uptime: '148d 14h 22m',
      status: 'healthy',
      cpu: 18.4,
      mem: 24.1,
      loadAvg: '0.42, 0.38, 0.35',
    },
    {
      id: 'srv-k8s-ctrl-01',
      hostname: 'k8s-master-01.noc.internal',
      role: 'Kubernetes Control Plane',
      ip: '10.0.0.10',
      rack: 'RACK-A01 [U38-40]',
      ping: 3.4,
      uptime: '92d 08h 14m',
      status: 'healthy',
      cpu: 44.2,
      mem: 62.5,
      loadAvg: '2.14, 1.89, 1.65',
    },
    {
      id: 'srv-worker-alpha',
      hostname: 'k8s-work-alpha.noc.internal',
      role: 'Compute Worker Alpha (High-Mem)',
      ip: '10.0.0.21',
      rack: 'RACK-B02 [U20-22]',
      ping: 4.8,
      uptime: '45d 02h 19m',
      status: 'healthy',
      cpu: 68.2,
      mem: 79.4,
      loadAvg: '8.42, 7.80, 6.95',
    },
    {
      id: 'srv-worker-bravo',
      hostname: 'k8s-work-bravo.noc.internal',
      role: 'Compute Worker Bravo (Batch)',
      ip: '10.0.0.22',
      rack: 'RACK-B02 [U17-19]',
      ping: 4.6,
      uptime: '45d 02h 18m',
      status: 'healthy',
      cpu: 52.8,
      mem: 64.1,
      loadAvg: '5.10, 4.90, 4.45',
    },
    {
      id: 'srv-db-primary',
      hostname: 'db-postgres-ha.noc.internal',
      role: 'PostgreSQL 17 Primary Cluster',
      ip: '10.0.0.50',
      rack: 'RACK-C03 [U12-14]',
      ping: 2.8,
      uptime: '180d 22h 05m',
      status: 'healthy',
      cpu: 34.6,
      mem: 82.0,
      loadAvg: '2.80, 2.55, 2.30',
    },
    {
      id: 'srv-nas-vault',
      hostname: 'nas-storage-zfs.noc.internal',
      role: 'TrueNAS Enterprise SAN/NAS',
      ip: '10.0.0.100',
      rack: 'RACK-D04 [U01-04]',
      ping: 1.9,
      uptime: '210d 11h 48m',
      status: 'healthy',
      cpu: 28.5,
      mem: 88.5,
      loadAvg: '1.92, 1.70, 1.58',
    },
  ]);

  // Inter-Datacenter Ping Matrix
  const [latencyMatrix, setLatencyMatrix] = useState([
    { code: 'JKT-01', location: 'Jakarta (Equinix JK1)', ping: 3.8, jitter: 0.4, loss: '0.00%', status: 'OPTIMAL' },
    { code: 'SIN-01', location: 'Singapore (Equinix SG1)', ping: 12.4, jitter: 0.8, loss: '0.00%', status: 'OPTIMAL' },
    { code: 'TYO-02', location: 'Tokyo (Equinix TY2)', ping: 64.2, jitter: 1.2, loss: '0.00%', status: 'OPTIMAL' },
    { code: 'FRA-01', location: 'Frankfurt (Interxion)', ping: 168.4, jitter: 2.5, loss: '0.01%', status: 'NORMAL' },
    { code: 'SJC-01', location: 'San Jose (CoreSite SV1)', ping: 154.6, jitter: 1.9, loss: '0.00%', status: 'NORMAL' },
  ]);

  // Real-time Event Stream Logs
  const [events, setEvents] = useState([
    { id: 101, time: '14:40:02', level: 'SUCCESS', source: 'zfs-daemon', message: 'ZFS Scrub pool-tank-01 completed. Verified 64.8 TB with 0 checksum errors.' },
    { id: 102, time: '14:40:22', level: 'INFO', source: 'bgp-bird', message: 'BGP Peer AS13335 (Cloudflare) route announcement update: 4,120 prefixes refreshed.' },
    { id: 103, time: '14:41:10', level: 'INFO', source: 'kubelet', message: 'Container runtime garbage collection triggered: reclaimed 2.4 GB unreferenced layers.' },
    { id: 104, time: '14:41:55', level: 'WARN', source: 'temp-sensor', message: 'Rack B02 ambient thermal sensor warning: +2.1°C excursion detected at intake bay.' },
    { id: 105, time: '14:42:30', level: 'INFO', source: 'wireguard', message: 'Handshake re-authenticated with Remote-NOC-Tunnel-JKT peer 10.88.0.4.' },
  ]);

  // Toggle Sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.toggle(next);
      return next;
    });
  }, []);

  // Trigger Chaos Mode (Simulates a sudden traffic surge & CPU load to test UI rendering speed)
  const triggerChaos = useCallback(() => {
    setChaosMode(true);
    soundEngine.playSpike();

    const spikeEvent = {
      id: Date.now(),
      time: new Date().toTimeString().split(' ')[0],
      level: 'CRIT',
      source: 'ddos-guard',
      message: 'SIMULATED SPIKE: Sudden incoming traffic surge detected (+8.2 Gbps on eth0). Mitigation active.',
    };
    setEvents((prev) => [spikeEvent, ...prev.slice(0, 49)]);

    if (chaosTimerRef.current) clearTimeout(chaosTimerRef.current);
    chaosTimerRef.current = setTimeout(() => {
      setChaosMode(false);
      setEvents((prev) => [
        {
          id: Date.now() + 1,
          time: new Date().toTimeString().split(' ')[0],
          level: 'SUCCESS',
          source: 'ddos-guard',
          message: 'Traffic normalization confirmed. Network burst mitigated, baseline metrics restored.',
        },
        ...prev.slice(0, 49),
      ]);
    }, 12000);
  }, []);

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Periodic Telemetry Simulator (Acts as WebSocket stream)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      timeStepRef.current += 1;
      const step = timeStepRef.current;
      const now = new Date().toTimeString().split(' ')[0];

      // 1. Calculate Network Rates
      const multiplier = chaosMode ? 3.5 : 1.0;
      const baseRx = (520 + Math.sin(step * 0.25) * 120 + Math.random() * 80) * multiplier;
      const baseTx = (210 + Math.cos(step * 0.25) * 60 + Math.random() * 40) * multiplier;
      const droppedPackets = chaosMode ? Math.floor(Math.random() * 18) : (Math.random() > 0.88 ? Math.floor(Math.random() * 3) : 0);

      setNetworkHistory((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          time: `${step}s`,
          rx: Math.max(10, baseRx),
          tx: Math.max(10, baseTx),
          dropped: droppedPackets,
        });
        return next;
      });

      // Update interface metrics
      setInterfaces((prev) => {
        const eth0Rx = chaosMode ? 8420.5 : baseRx;
        const eth0Tx = chaosMode ? 3210.0 : baseTx;
        return {
          ...prev,
          eth0: {
            ...prev.eth0,
            rx: eth0Rx,
            tx: eth0Tx,
            pps: Math.floor(eth0Rx * 145),
          },
          eth1: {
            ...prev.eth1,
            rx: 280 + Math.random() * 50,
            tx: 480 + Math.random() * 60,
            pps: Math.floor((280 + 480) * 110),
          },
          bond0: {
            ...prev.bond0,
            rx: eth0Rx * 0.95,
            tx: eth0Tx * 0.88,
            pps: Math.floor(eth0Rx * 170),
          },
          tun0: {
            ...prev.tun0,
            rx: 40 + Math.random() * 15,
            tx: 35 + Math.random() * 12,
            pps: 11000 + Math.floor(Math.random() * 2000),
          },
        };
      });

      // 2. Calculate CPU Cores
      setCpuData((prev) => {
        const chaosBoost = chaosMode ? 45 : 0;
        let sumLoad = 0;
        let maxT = 0;

        const nextCores = prev.cores.map((core) => {
          // Add organic oscillation
          const variance = (Math.sin(step * 0.3 + core.id) * 15) + (Math.random() * 10 - 5);
          let newLoad = Math.min(99.5, Math.max(8.0, core.load + variance * 0.4 + (chaosMode ? 30 : 0)));
          if (chaosMode) newLoad = Math.min(99.9, newLoad + 25);

          const coreTemp = 44 + (newLoad / 100) * 36 + (Math.random() * 2 - 1);
          if (coreTemp > maxT) maxT = coreTemp;
          sumLoad += newLoad;

          return {
            ...core,
            load: Number(newLoad.toFixed(1)),
            temp: Number(coreTemp.toFixed(1)),
            freq: Number((3.6 + (newLoad / 100) * 1.1).toFixed(2)),
          };
        });

        const overall = Number((sumLoad / 16).toFixed(1));
        const avgTemp = Number((48 + (overall / 100) * 30).toFixed(1));

        const nextHistory = [...prev.history.slice(1), overall];

        return {
          ...prev,
          overall,
          avgTemp,
          maxTemp: Number(maxT.toFixed(1)),
          freq: Number((3.8 + (overall / 100) * 0.9).toFixed(2)),
          cores: nextCores,
          history: nextHistory,
        };
      });

      // 3. Memory & Processes subtle drift
      setMemoryData((prev) => {
        const memFluct = (Math.random() - 0.48) * 0.3;
        const newUsed = Math.min(115, Math.max(65, prev.used + memFluct));
        const newFree = prev.total - newUsed - prev.cached;
        return {
          ...prev,
          used: Number(newUsed.toFixed(2)),
          free: Number(Math.max(2, newFree).toFixed(2)),
        };
      });

      // 4. Storage & Drives Telemetry
      setStorageData((prev) => {
        const chaosIops = chaosMode ? 3.2 : 1.0;
        const readIops = Math.floor((38000 + Math.random() * 9000) * chaosIops);
        const writeIops = Math.floor((22000 + Math.random() * 7000) * chaosIops);
        return {
          ...prev,
          totalReadIops: readIops,
          totalWriteIops: writeIops,
          readRate: Number(((readIops / 32) * 1.1).toFixed(0)),
          writeRate: Number(((writeIops / 32) * 0.95).toFixed(0)),
          drives: prev.drives.map((d) => ({
            ...d,
            iops: Math.floor((d.iops * 0.9) + (Math.random() * 4000 + 8000) * chaosIops * 0.1),
            temp: Number((40 + Math.random() * 4 + (chaosMode ? 4 : 0)).toFixed(0)),
          })),
        };
      });

      // 5. Server Nodes Ping & Load Update
      setNodes((prev) =>
        prev.map((node) => {
          const jitter = (Math.random() - 0.5) * 0.6;
          const ping = Math.max(1.1, Number((node.ping + jitter).toFixed(1)));
          const cpuMod = chaosMode ? Math.min(98, node.cpu + 20) : Math.max(10, Math.min(90, node.cpu + (Math.random() - 0.5) * 4));
          return {
            ...node,
            ping,
            cpu: Number(cpuMod.toFixed(1)),
          };
        })
      );

      // 6. Datacenter Latencies
      setLatencyMatrix((prev) =>
        prev.map((dc) => ({
          ...dc,
          ping: Number((dc.ping + (Math.random() - 0.5) * (chaosMode ? 4 : 0.8)).toFixed(1)),
        }))
      );

      // 7. Occasional Random Event Log
      if (Math.random() < 0.18 && !chaosMode) {
        const sampleEvents = [
          { level: 'INFO', source: 'chrony', message: 'NTP synchronization locked with stratum 1 reference time server (offset -0.042ms).' },
          { level: 'INFO', source: 'syslog', message: 'Prometheus exporter metrics collected: 1,842 targets healthy in 38ms.' },
          { level: 'SUCCESS', source: 'ssl-vault', message: 'Automated TLS wildcard cert renewal verification passed for *.noc.internal.' },
          { level: 'WARN', source: 'conntrack', message: 'IP conntrack table utilization at 68% (178,204 / 262,144 entries).' },
          { level: 'INFO', source: 'corosync', message: 'High-availability cluster heartbeat quorum verified: 6/6 votes active.' },
          { level: 'SUCCESS', source: 'btrfs-snapshot', message: 'Daily storage atomic snapshot created: snap-20261003-daily (0 errors).' },
        ];
        const pick = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        setEvents((prev) => [{ id: Date.now(), time: now, ...pick }, ...prev.slice(0, 49)]);
        soundEngine.playBlip(750, 'sine', 0.04, 0.02);
      }
    }, tickRate);

    return () => clearInterval(interval);
  }, [isPaused, tickRate, chaosMode]);

  return {
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
  };
}
