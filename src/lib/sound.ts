// Web Audio API Sound Synthesizer & Audio Player

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = false;
  private oceanNode: AudioBufferSourceNode | null = null;
  private oceanGain: GainNode | null = null;
  private isPlayingOcean: boolean = false;
  private bgMusic: HTMLAudioElement | null = null;
  private isPlayingMusic: boolean = false;

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private initMusic() {
    if (typeof window === "undefined") return;
    if (!this.bgMusic) {
      this.bgMusic = new Audio("/bg_music.mp3");
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.35; // Soft pleasant volume
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (enabled) {
      this.initContext();
      this.startOceanLoop();
      this.startBgMusic();
    } else {
      this.stopOceanLoop();
      this.stopBgMusic();
    }
  }

  public getEnabled(): boolean {
    return this.soundEnabled;
  }

  // Generate pink noise for gentle ocean wave ambience
  public startOceanLoop() {
    if (!this.soundEnabled || this.isPlayingOcean) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Create 5 seconds of pink noise buffer
      const bufferSize = this.ctx.sampleRate * 5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.05; // Keep it soft
        b6 = white * 0.115926;
      }

      this.oceanNode = this.ctx.createBufferSource();
      this.oceanNode.buffer = buffer;
      this.oceanNode.loop = true;

      // Low pass filter for wave sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350;

      this.oceanGain = this.ctx.createGain();
      this.oceanGain.gain.value = 0.15; // Subtle background

      this.oceanNode.connect(filter);
      filter.connect(this.oceanGain);
      this.oceanGain.connect(this.ctx.destination);

      this.oceanNode.start();
      this.isPlayingOcean = true;
    } catch (e) {
      console.warn("Could not synthesize ocean loop:", e);
    }
  }

  public stopOceanLoop() {
    if (this.oceanNode) {
      try {
        this.oceanNode.stop();
        this.oceanNode.disconnect();
      } catch {}
      this.oceanNode = null;
    }
    this.isPlayingOcean = false;
  }

  public startBgMusic() {
    if (!this.soundEnabled || this.isPlayingMusic) return;
    this.initMusic();
    if (!this.bgMusic) return;

    try {
      this.bgMusic.play().then(() => {
        this.isPlayingMusic = true;
      }).catch((e) => {
        console.warn("Could not autoplay background music:", e);
      });
    } catch (e) {
      console.warn("Could not start background music:", e);
    }
  }

  public stopBgMusic() {
    if (this.bgMusic) {
      try {
        this.bgMusic.pause();
      } catch {}
    }
    this.isPlayingMusic = false;
  }

  public duckMusic() {
    if (this.bgMusic) {
      this.bgMusic.volume = 0.05;
    }
  }

  public restoreMusic() {
    if (this.bgMusic) {
      this.bgMusic.volume = 0.35;
    }
  }

  // Play gentle UI click / tap chime
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  // Play magical ascending sparkle chime
  public playSparkle() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        const startTime = this.ctx.currentTime + index * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {}
  }

  // Play pop / bottle sound
  public playPop() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  // Play playful noodle slurp sound effect
  public playSlurp() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const startTime = this.ctx.currentTime;
      
      osc.frequency.setValueAtTime(350, startTime);
      osc.frequency.exponentialRampToValueAtTime(700, startTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1100, startTime + 0.35);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.setValueAtTime(0.3, startTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    } catch {}
  }

  // Play victory celebration fanfare
  public playVictory() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 major arpeggio to E6
      chord.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        const startTime = this.ctx.currentTime + index * 0.1;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.8);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();
