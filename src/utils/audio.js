/**
 * Audio Synthesizer using Web Audio API for NOC Alerts & UI Feedback
 * Generates subtle, modern datacenter terminal blips without external audio files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle(enable) {
    this.enabled = enable;
    if (this.enabled) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBlip(880, 'sine', 0.05, 0.03);
    }
  }

  playBlip(freq = 600, type = 'sine', duration = 0.06, volume = 0.04) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  playAlert() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.playBlip(440, 'triangle', 0.1, 0.08);
      setTimeout(() => this.playBlip(880, 'triangle', 0.15, 0.08), 120);
    } catch {
      // Ignore
    }
  }

  playSpike() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.playBlip(220, 'sawtooth', 0.18, 0.08);
      setTimeout(() => this.playBlip(330, 'sawtooth', 0.18, 0.08), 100);
      setTimeout(() => this.playBlip(550, 'sawtooth', 0.25, 0.08), 200);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
