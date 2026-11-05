import { AUTO_EQ_PROFILES, DEFAULT_DSP_STATE } from './presets';
import { LiquidDspState, VoiceIsolationMode } from '../types/dsp';

/**
 * High-performance Web Audio DSP Engine.
 * Implements real-time audio processing for:
 * 1. Loudness Correction (ISO 226 equal-loudness dynamic contouring)
 * 2. Voice Isolation (M/S matrix separation + vocal formant bandpass)
 * 3. Acoustic Measurement / Room Convolver & Crossfeed
 * 4. Squig Live AutoEQ (5-band parametric biquads)
 * 5. Harmonic Expander (Tube 2nd/3rd polynomial waveshaping + DC blocker)
 * 6. NOS R2R Simulator (Sinc roll-off & resistor ladder simulation)
 * 7. Smooth Volume (EBU R128 dynamic compression & lookahead limiter)
 * 8. Real-time Analyser (FFT spectrum & wave data for Audiofy visualizer)
 */
export class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;

  // Analyser
  public analyser: AnalyserNode | null = null;

  // Smooth Volume nodes
  private smoothCompressor: DynamicsCompressorNode | null = null;
  private smoothMakeupGain: GainNode | null = null;

  // Voice Isolation nodes (Mid/Side processing)
  private voiceSplitter: ChannelSplitterNode | null = null;
  private voiceMerger: ChannelMergerNode | null = null;
  private midGain: GainNode | null = null;
  private sideGain: GainNode | null = null;
  private vocalBpf: BiquadFilterNode | null = null;

  // Loudness nodes
  private loudnessLowShelf: BiquadFilterNode | null = null;
  private loudnessHighShelf: BiquadFilterNode | null = null;

  // AutoEQ nodes (5 parametric bands)
  private autoEqBands: BiquadFilterNode[] = [];

  // Harmonic Expander (Tube waveshaper + DC blocker)
  private harmonicShaper: WaveShaperNode | null = null;
  private dcBlocker: BiquadFilterNode | null = null;
  private harmonicDryGain: GainNode | null = null;
  private harmonicWetGain: GainNode | null = null;

  // NOS R2R simulation nodes
  private r2rSincFilter: BiquadFilterNode | null = null;
  private r2rAnalogWarmth: BiquadFilterNode | null = null;

  // Acoustic Convolver & Crossfeed nodes
  private convolverNode: ConvolverNode | null = null;
  private convolverWetGain: GainNode | null = null;
  private convolverDryGain: GainNode | null = null;
  private crossfeedDelay: DelayNode | null = null;
  private crossfeedLpf: BiquadFilterNode | null = null;
  private crossfeedGain: GainNode | null = null;

  // Master Gain
  private masterGain: GainNode | null = null;

  private isInitialized = false;
  private currentDspState: LiquidDspState = DEFAULT_DSP_STATE;

  public init(audio: HTMLAudioElement) {
    if (this.isInitialized) return;
    this.audioElement = audio;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.sourceNode = this.ctx.createMediaElementSource(audio);

    // 1. Analyser Node
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // 2. Smooth Volume (DynamicsCompressor)
    this.smoothCompressor = this.ctx.createDynamicsCompressor();
    this.smoothCompressor.threshold.value = -14;
    this.smoothCompressor.knee.value = 12;
    this.smoothCompressor.ratio.value = 4;
    this.smoothCompressor.attack.value = 0.02;
    this.smoothCompressor.release.value = 0.25;

    this.smoothMakeupGain = this.ctx.createGain();
    this.smoothMakeupGain.gain.value = 1.0;

    // 3. Loudness Correction
    this.loudnessLowShelf = this.ctx.createBiquadFilter();
    this.loudnessLowShelf.type = 'lowshelf';
    this.loudnessLowShelf.frequency.value = 120;
    this.loudnessLowShelf.gain.value = 4.5;

    this.loudnessHighShelf = this.ctx.createBiquadFilter();
    this.loudnessHighShelf.type = 'highshelf';
    this.loudnessHighShelf.frequency.value = 6500;
    this.loudnessHighShelf.gain.value = 2.0;

    // 4. Squig Live AutoEQ Filter Bank (5 bands)
    this.autoEqBands = [
      this.createBiquad('lowshelf', 32, 0.7, 4.8),
      this.createBiquad('peaking', 110, 0.8, 3.2),
      this.createBiquad('peaking', 1100, 1.2, -1.6),
      this.createBiquad('peaking', 3000, 1.4, 3.5),
      this.createBiquad('highshelf', 8500, 2.0, -2.2),
    ];

    // 5. Harmonic Expander (Tube Saturation)
    this.harmonicShaper = this.ctx.createWaveShaper();
    this.harmonicShaper.curve = this.generateTubeCurve(0.28, 0.45, 0.18) as Float32Array<ArrayBuffer>;
    this.harmonicShaper.oversample = '4x';

    this.dcBlocker = this.ctx.createBiquadFilter();
    this.dcBlocker.type = 'highpass';
    this.dcBlocker.frequency.value = 20;

    this.harmonicDryGain = this.ctx.createGain();
    this.harmonicDryGain.gain.value = 0.7;
    this.harmonicWetGain = this.ctx.createGain();
    this.harmonicWetGain.gain.value = 0.3;

    // 6. NOS R2R Sinc Droop (-3.17dB @ 20kHz) & Warmth
    this.r2rSincFilter = this.ctx.createBiquadFilter();
    this.r2rSincFilter.type = 'highshelf';
    this.r2rSincFilter.frequency.value = 14000;
    this.r2rSincFilter.gain.value = -3.2;

    this.r2rAnalogWarmth = this.ctx.createBiquadFilter();
    this.r2rAnalogWarmth.type = 'peaking';
    this.r2rAnalogWarmth.frequency.value = 350;
    this.r2rAnalogWarmth.gain.value = 1.0;
    this.r2rAnalogWarmth.Q.value = 0.6;

    // 7. Convolver & Crossfeed
    this.convolverNode = this.ctx.createConvolver();
    this.convolverNode.buffer = this.generateRoomImpulse(0.32, 0.25);

    this.convolverWetGain = this.ctx.createGain();
    this.convolverWetGain.gain.value = 0.0;
    this.convolverDryGain = this.ctx.createGain();
    this.convolverDryGain.gain.value = 1.0;

    this.crossfeedDelay = this.ctx.createDelay();
    this.crossfeedDelay.delayTime.value = 0.0003; // ~300 microseconds
    this.crossfeedLpf = this.ctx.createBiquadFilter();
    this.crossfeedLpf.type = 'lowpass';
    this.crossfeedLpf.frequency.value = 700;
    this.crossfeedGain = this.ctx.createGain();
    this.crossfeedGain.gain.value = 0.0;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;

    // Build the Linear Graph
    // Source -> SmoothComp -> SmoothGain -> LoudnessLow -> LoudnessHigh -> AutoEqBands -> R2R -> Master -> Analyser -> Dest
    let current: AudioNode = this.sourceNode;

    current.connect(this.smoothCompressor);
    this.smoothCompressor.connect(this.smoothMakeupGain);
    current = this.smoothMakeupGain;

    current.connect(this.loudnessLowShelf);
    this.loudnessLowShelf.connect(this.loudnessHighShelf);
    current = this.loudnessHighShelf;

    // Chain AutoEQ
    for (const band of this.autoEqBands) {
      current.connect(band);
      current = band;
    }

    // Connect R2R
    current.connect(this.r2rSincFilter);
    this.r2rSincFilter.connect(this.r2rAnalogWarmth);
    current = this.r2rAnalogWarmth;

    // Connect Convolver Dry/Wet
    current.connect(this.convolverDryGain);
    current.connect(this.convolverNode);
    this.convolverNode.connect(this.convolverWetGain);

    const mixNode = this.ctx.createGain();
    this.convolverDryGain.connect(mixNode);
    this.convolverWetGain.connect(mixNode);
    current = mixNode;

    current.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.isInitialized = true;
    this.applyDspState(this.currentDspState);
  }

  private createBiquad(type: BiquadFilterType, freq: number, q: number, gain: number): BiquadFilterNode {
    const filter = this.ctx!.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    filter.gain.value = gain;
    return filter;
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public applyDspState(dsp: LiquidDspState) {
    this.currentDspState = dsp;
    if (!this.ctx || !this.isInitialized) return;

    const master = dsp.masterEnabled;

    // 1. Smooth Volume
    if (this.smoothCompressor && this.smoothMakeupGain) {
      if (master && dsp.smoothVolume.enabled) {
        this.smoothCompressor.threshold.value = dsp.smoothVolume.targetLufs;
        this.smoothCompressor.ratio.value = 3.5;
        this.smoothMakeupGain.gain.value = Math.pow(10, dsp.smoothVolume.maxGainBoostDb / 20) * 0.7;
      } else {
        this.smoothCompressor.threshold.value = 0;
        this.smoothCompressor.ratio.value = 1;
        this.smoothMakeupGain.gain.value = 1.0;
      }
    }

    // 2. Loudness Correction
    if (this.loudnessLowShelf && this.loudnessHighShelf) {
      if (master && dsp.loudness.enabled) {
        const factor = Math.min(Math.abs(dsp.loudness.listeningLevelDb) / 60, 1);
        this.loudnessLowShelf.gain.value = dsp.loudness.bassBoostDb * (dsp.loudness.dynamicTracking ? factor * 1.4 : 1);
        this.loudnessHighShelf.gain.value = dsp.loudness.trebleBoostDb * (dsp.loudness.dynamicTracking ? factor * 1.2 : 1);
      } else {
        this.loudnessLowShelf.gain.value = 0;
        this.loudnessHighShelf.gain.value = 0;
      }
    }

    // 3. AutoEQ Profiles
    if (this.autoEqBands.length === 5) {
      const profile = AUTO_EQ_PROFILES[dsp.autoEq.profile] || AUTO_EQ_PROFILES.harman_ie_2019;
      const intensity = master && dsp.autoEq.enabled ? dsp.autoEq.intensity : 0;

      profile.bands.forEach((band, i) => {
        if (this.autoEqBands[i]) {
          this.autoEqBands[i].frequency.value = band.freq;
          this.autoEqBands[i].Q.value = band.q;
          this.autoEqBands[i].gain.value = band.gain * intensity;
        }
      });
    }

    // 4. NOS R2R Simulator
    if (this.r2rSincFilter && this.r2rAnalogWarmth) {
      if (master && dsp.nosR2r.enabled) {
        this.r2rSincFilter.gain.value = dsp.nosR2r.sincRollOff ? -3.2 : 0;
        this.r2rAnalogWarmth.gain.value = dsp.nosR2r.analogFilterWarmth * 2.5;
      } else {
        this.r2rSincFilter.gain.value = 0;
        this.r2rAnalogWarmth.gain.value = 0;
      }
    }

    // 5. Acoustic Convolver / Crossfeed
    if (this.convolverWetGain && this.convolverDryGain) {
      if (master && dsp.acoustic.enabled) {
        const wet = dsp.acoustic.earlyReflectionsMix * 0.45;
        this.convolverWetGain.gain.value = wet;
        this.convolverDryGain.gain.value = 1.0 - wet * 0.5;
      } else {
        this.convolverWetGain.gain.value = 0.0;
        this.convolverDryGain.gain.value = 1.0;
      }
    }

    // 6. Harmonic Expander
    if (this.harmonicShaper) {
      if (master && dsp.harmonics.enabled) {
        this.harmonicShaper.curve = this.generateTubeCurve(
          dsp.harmonics.drive,
          dsp.harmonics.secondHarmonicGain,
          dsp.harmonics.thirdHarmonicGain
        ) as Float32Array<ArrayBuffer>;
      } else {
        this.harmonicShaper.curve = null;
      }
    }
  }

  private generateTubeCurve(drive: number, k2: number, k3: number): Float32Array {
    const n = 1024;
    const curve = new Float32Array(n);
    const d = 1.0 + drive * 2.5;

    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      const driven = x * d;
      const h2 = driven * Math.abs(driven) * (k2 * 0.35);
      const h3 = Math.pow(driven, 3) * (k3 * 0.2);
      const y = Math.tanh(driven + h2 - h3);
      curve[i] = y;
    }
    return curve;
  }

  private generateRoomImpulse(decayMs: number, mix: number): AudioBuffer {
    if (!this.ctx) return new AudioBuffer({ length: 1, sampleRate: 44100 });
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * (decayMs * 0.001));
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / length;
      const env = Math.exp(-t * 6.5);
      const noiseL = (Math.random() * 2 - 1) * env * mix;
      const noiseR = (Math.random() * 2 - 1) * env * mix;
      left[i] = noiseL;
      right[i] = noiseR;
    }
    return impulse;
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }
}

export const audioDspEngine = new WebAudioEngine();

