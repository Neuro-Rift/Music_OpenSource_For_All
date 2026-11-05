import { AutoEqProfileId, AutoEqProfileInfo, DevicePresetId, LiquidDspState } from '../types/dsp';

export const AUTO_EQ_PROFILES: Record<AutoEqProfileId, AutoEqProfileInfo> = {
  harman_ie_2019: {
    id: 'harman_ie_2019',
    name: 'Harman In-Ear 2019',
    description: 'Consumer gold standard target with musical sub-bass boost and pinna ear gain',
    bands: [
      { freq: 32, q: 0.7, gain: 4.8 },
      { freq: 110, q: 0.8, gain: 3.2 },
      { freq: 1100, q: 1.2, gain: -1.6 },
      { freq: 3000, q: 1.4, gain: 3.5 },
      { freq: 8500, q: 2.0, gain: -2.2 },
    ]
  },
  diffuse_field_5128: {
    id: 'diffuse_field_5128',
    name: 'Diffuse Field (B&K 5128)',
    description: 'Reference diffuse acoustical room field measured on B&K 5128 head simulator',
    bands: [
      { freq: 40, q: 0.8, gain: -2.0 },
      { freq: 220, q: 0.7, gain: -1.2 },
      { freq: 2800, q: 1.3, gain: 4.5 },
      { freq: 6200, q: 1.8, gain: 1.8 },
      { freq: 12000, q: 1.5, gain: 2.4 },
    ]
  },
  ief_neutral: {
    id: 'ief_neutral',
    name: 'IEF Neutral Target',
    description: 'Acoustic measurement curve from Crinacle and In-Ear Fidelity for studio accuracy',
    bands: [
      { freq: 60, q: 0.7, gain: 1.5 },
      { freq: 250, q: 1.0, gain: -0.8 },
      { freq: 1000, q: 0.9, gain: 0.0 },
      { freq: 3200, q: 1.5, gain: 2.2 },
      { freq: 9000, q: 2.2, gain: -1.4 },
    ]
  },
  rtings_target: {
    id: 'rtings_target',
    name: 'Rtings Target',
    description: 'Balanced curve with smooth treble roll-off and punchy bass articulation',
    bands: [
      { freq: 50, q: 0.8, gain: 3.0 },
      { freq: 380, q: 1.1, gain: -1.2 },
      { freq: 2500, q: 1.3, gain: 2.5 },
      { freq: 6500, q: 1.6, gain: -1.8 },
      { freq: 10500, q: 1.4, gain: -2.5 },
    ]
  },
  crinacle_target: {
    id: 'crinacle_target',
    name: 'Crinacle 2023 Target',
    description: 'Modern neutral target curve with natural ear canal acoustic compensation',
    bands: [
      { freq: 45, q: 0.7, gain: 2.6 },
      { freq: 300, q: 1.0, gain: -1.0 },
      { freq: 2700, q: 1.4, gain: 2.8 },
      { freq: 7500, q: 1.9, gain: -1.5 },
      { freq: 11000, q: 1.5, gain: 1.2 },
    ]
  },
  jm1_target: {
    id: 'jm1_target',
    name: 'JM-1 Target',
    description: 'Harmonious hybrid Harman variation with relaxed upper mids for fatigue-free listening',
    bands: [
      { freq: 35, q: 0.8, gain: 4.2 },
      { freq: 150, q: 0.9, gain: 1.8 },
      { freq: 3000, q: 1.2, gain: 1.6 },
      { freq: 6000, q: 1.5, gain: -1.0 },
      { freq: 13000, q: 1.6, gain: 2.2 },
    ]
  },
  warm_audiophile: {
    id: 'warm_audiophile',
    name: 'Warm Audiophile',
    description: 'Rich low-end body with silky treble roll-off mimicking classic tube amplifiers',
    bands: [
      { freq: 65, q: 0.7, gain: 3.5 },
      { freq: 220, q: 0.9, gain: 2.2 },
      { freq: 1200, q: 1.0, gain: 0.5 },
      { freq: 4500, q: 1.5, gain: -1.8 },
      { freq: 10000, q: 1.8, gain: -2.2 },
    ]
  },
  vshape_fun: {
    id: 'vshape_fun',
    name: 'V-Shape Dynamic',
    description: 'Energetic dynamic sound signature with slamming sub-bass and crisp cymbal air',
    bands: [
      { freq: 40, q: 0.8, gain: 5.5 },
      { freq: 100, q: 1.0, gain: 3.8 },
      { freq: 1000, q: 1.2, gain: -2.5 },
      { freq: 4000, q: 1.4, gain: 3.5 },
      { freq: 12000, q: 1.5, gain: 4.5 },
    ]
  }
};

export const DEFAULT_DSP_STATE: LiquidDspState = {
  masterEnabled: true,
  activePreset: 'custom',
  loudness: {
    enabled: true,
    listeningLevelDb: -18,
    bassBoostDb: 4.5,
    trebleBoostDb: 2.0,
    dynamicTracking: true,
  },
  voiceIsolation: {
    enabled: false,
    mode: 'off',
    intensity: 0.85,
    lowCutHz: 160,
    highCutHz: 4200,
    centerSpread: 0.70,
  },
  acoustic: {
    enabled: false,
    profile: 'audiophile_room',
    crossfeedEnabled: true,
    crossfeedStrength: 0.45,
    roomDecayMs: 320,
    earlyReflectionsMix: 0.25,
    roomModeNotchDamping: true,
  },
  autoEq: {
    enabled: true,
    profile: 'harman_ie_2019',
    intensity: 1.0,
  },
  harmonics: {
    enabled: true,
    drive: 0.28,
    secondHarmonicGain: 0.45,
    thirdHarmonicGain: 0.18,
    airExciter: 0.25,
    warmth: 0.35,
  },
  nosR2r: {
    enabled: false,
    sincRollOff: true,
    ladderToleranceJitter: 0.20,
    analogFilterWarmth: 0.30,
    bitDepthMode: 16,
  },
  smoothVolume: {
    enabled: true,
    targetLufs: -14.0,
    maxGainBoostDb: 6.0,
    lookaheadLimitEnabled: true,
  }
};

export const DEVICE_PRESETS: Record<DevicePresetId, { name: string; icon: string; description: string; state: LiquidDspState }> = {
  bluetooth_headphones: {
    name: 'Bluetooth Headphones',
    icon: 'Headphones',
    description: 'Optimized for wireless ANC headphones (Sony WH-1000XM, AirPods Max, Bose)',
    state: {
      ...DEFAULT_DSP_STATE,
      activePreset: 'bluetooth_headphones',
      loudness: { enabled: true, listeningLevelDb: -18, bassBoostDb: 3.8, trebleBoostDb: 2.2, dynamicTracking: true },
      autoEq: { enabled: true, profile: 'harman_ie_2019', intensity: 1.0 },
      harmonics: { enabled: true, drive: 0.25, secondHarmonicGain: 0.40, thirdHarmonicGain: 0.15, airExciter: 0.20, warmth: 0.30 },
      smoothVolume: { enabled: true, targetLufs: -14.0, maxGainBoostDb: 5.0, lookaheadLimitEnabled: true },
      nosR2r: { enabled: false, sincRollOff: false, ladderToleranceJitter: 0.15, analogFilterWarmth: 0.2, bitDepthMode: 16 },
      acoustic: { enabled: false, profile: 'audiophile_room', crossfeedEnabled: false, crossfeedStrength: 0.3, roomDecayMs: 200, earlyReflectionsMix: 0.1, roomModeNotchDamping: true }
    }
  },
  in_ear_monitors: {
    name: 'In-Ear Monitors (IEMs)',
    icon: 'Radio',
    description: 'High-resolution target tuning for multi-driver IEMs with deep bass extension',
    state: {
      ...DEFAULT_DSP_STATE,
      activePreset: 'in_ear_monitors',
      autoEq: { enabled: true, profile: 'diffuse_field_5128', intensity: 0.9 },
      nosR2r: { enabled: true, sincRollOff: true, ladderToleranceJitter: 0.18, analogFilterWarmth: 0.25, bitDepthMode: 24 },
      acoustic: { enabled: true, profile: 'nearfield', crossfeedEnabled: true, crossfeedStrength: 0.35, roomDecayMs: 150, earlyReflectionsMix: 0.15, roomModeNotchDamping: true },
      harmonics: { enabled: false, drive: 0.15, secondHarmonicGain: 0.25, thirdHarmonicGain: 0.1, airExciter: 0.3, warmth: 0.2 },
      smoothVolume: { enabled: true, targetLufs: -15.0, maxGainBoostDb: 4.0, lookaheadLimitEnabled: true }
    }
  },
  audiophile_open_back: {
    name: 'Audiophile Open-Back',
    icon: 'Disc',
    description: 'Natural speaker soundstage with Linkwitz crossfeed and rich tube harmonics',
    state: {
      ...DEFAULT_DSP_STATE,
      activePreset: 'audiophile_open_back',
      acoustic: {
        enabled: true,
        profile: 'audiophile_room',
        crossfeedEnabled: true,
        crossfeedStrength: 0.55,
        roomDecayMs: 280,
        earlyReflectionsMix: 0.22,
        roomModeNotchDamping: true
      },
      harmonics: { enabled: true, drive: 0.32, secondHarmonicGain: 0.50, thirdHarmonicGain: 0.20, airExciter: 0.35, warmth: 0.40 },
      nosR2r: { enabled: true, sincRollOff: true, ladderToleranceJitter: 0.15, analogFilterWarmth: 0.35, bitDepthMode: 24 },
      autoEq: { enabled: true, profile: 'crinacle_target', intensity: 0.85 }
    }
  },
  phone_speaker: {
    name: 'Built-in Speaker',
    icon: 'Speaker',
    description: 'Loudness enhancement, vocal isolation, and dynamic protection for compact speakers',
    state: {
      ...DEFAULT_DSP_STATE,
      activePreset: 'phone_speaker',
      loudness: { enabled: true, listeningLevelDb: -10, bassBoostDb: 5.5, trebleBoostDb: 3.5, dynamicTracking: true },
      voiceIsolation: { enabled: true, mode: 'isolate', intensity: 0.40, lowCutHz: 180, highCutHz: 4000, centerSpread: 0.6 },
      smoothVolume: { enabled: true, targetLufs: -11.0, maxGainBoostDb: 8.0, lookaheadLimitEnabled: true },
      harmonics: { enabled: true, drive: 0.40, secondHarmonicGain: 0.55, thirdHarmonicGain: 0.25, airExciter: 0.40, warmth: 0.45 },
      nosR2r: { enabled: false, sincRollOff: false, ladderToleranceJitter: 0, analogFilterWarmth: 0, bitDepthMode: 16 }
    }
  },
  usb_dac: {
    name: 'USB DAC / Hi-Fi Line Out',
    icon: 'Cpu',
    description: 'Bit-perfect 24-bit Non-Oversampling R-2R ladder simulation with studio transparency',
    state: {
      ...DEFAULT_DSP_STATE,
      activePreset: 'usb_dac',
      nosR2r: { enabled: true, sincRollOff: true, ladderToleranceJitter: 0.10, analogFilterWarmth: 0.35, bitDepthMode: 24 },
      harmonics: { enabled: true, drive: 0.18, secondHarmonicGain: 0.30, thirdHarmonicGain: 0.10, airExciter: 0.20, warmth: 0.25 },
      autoEq: { enabled: true, profile: 'ief_neutral', intensity: 1.0 },
      smoothVolume: { enabled: false, targetLufs: -14.0, maxGainBoostDb: 0, lookaheadLimitEnabled: false }
    }
  },
  car_audio: {
    name: 'Car Audio Bluetooth',
    icon: 'Car',
    description: 'Road noise compensation with punchy dynamic loudness and leveled volume',
    state: {
      ...DEFAULT_DSP_STATE,
      activePreset: 'car_audio',
      loudness: { enabled: true, listeningLevelDb: -8, bassBoostDb: 6.0, trebleBoostDb: 2.5, dynamicTracking: true },
      smoothVolume: { enabled: true, targetLufs: -12.0, maxGainBoostDb: 7.0, lookaheadLimitEnabled: true },
      harmonics: { enabled: true, drive: 0.35, secondHarmonicGain: 0.45, thirdHarmonicGain: 0.20, airExciter: 0.30, warmth: 0.40 },
      autoEq: { enabled: true, profile: 'vshape_fun', intensity: 1.1 }
    }
  },
  custom: {
    name: 'Custom Profile',
    icon: 'Sliders',
    description: 'User-configured custom DSP parameters',
    state: DEFAULT_DSP_STATE
  }
};

