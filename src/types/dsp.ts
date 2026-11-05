export type VoiceIsolationMode = 'off' | 'isolate' | 'remove';

export type AutoEqProfileId = 
  | 'harman_ie_2019'
  | 'diffuse_field_5128'
  | 'ief_neutral'
  | 'rtings_target'
  | 'crinacle_target'
  | 'jm1_target'
  | 'warm_audiophile'
  | 'vshape_fun';

export interface AutoEqProfileInfo {
  id: AutoEqProfileId;
  name: string;
  description: string;
  bands: { freq: number; q: number; gain: number }[];
}

export type RoomAcousticProfileId = 
  | 'studio_control'
  | 'audiophile_room'
  | 'concert_hall'
  | 'intimate_club'
  | 'cathedral'
  | 'nearfield';

export type DevicePresetId = 
  | 'bluetooth_headphones'
  | 'in_ear_monitors'
  | 'audiophile_open_back'
  | 'phone_speaker'
  | 'usb_dac'
  | 'car_audio'
  | 'custom';

export interface LoudnessCorrectionSettings {
  enabled: boolean;
  listeningLevelDb: number; // -60dB to 0dB
  bassBoostDb: number;      // 0dB to +12dB
  trebleBoostDb: number;    // 0dB to +8dB
  dynamicTracking: boolean;
}

export interface VoiceIsolationSettings {
  enabled: boolean;
  mode: VoiceIsolationMode;
  intensity: number;        // 0.0 to 1.0
  lowCutHz: number;         // 120Hz to 300Hz
  highCutHz: number;        // 2500Hz to 6000Hz
  centerSpread: number;     // 0.0 to 1.0
}

export interface AcousticMeasurementSettings {
  enabled: boolean;
  profile: RoomAcousticProfileId;
  crossfeedEnabled: boolean;
  crossfeedStrength: number;// 0.0 to 1.0
  roomDecayMs: number;      // 50ms to 2000ms
  earlyReflectionsMix: number; // 0.0 to 1.0
  roomModeNotchDamping: boolean;
}

export interface AutoEqSettings {
  enabled: boolean;
  profile: AutoEqProfileId;
  intensity: number;        // 0.0 to 1.5
}

export interface HarmonicExpanderSettings {
  enabled: boolean;
  drive: number;            // 0.0 to 1.0
  secondHarmonicGain: number; // Even order (warm tube body, 0.0 to 1.0)
  thirdHarmonicGain: number;  // Odd order (punch & presence, 0.0 to 1.0)
  airExciter: number;       // High-frequency sheen (>8kHz, 0.0 to 1.0)
  warmth: number;           // Transformer low-end warmth
}

export interface NosR2rSettings {
  enabled: boolean;
  sincRollOff: boolean;     // Characteristic -3dB @ 20kHz sinc droop
  ladderToleranceJitter: number; // Resistor network tolerance micro-variance (0.0 to 1.0)
  analogFilterWarmth: number;
  bitDepthMode: 16 | 24;
}

export interface SmoothVolumeSettings {
  enabled: boolean;
  targetLufs: number;       // -24 to -8 LUFS
  maxGainBoostDb: number;   // 0dB to 12dB
  lookaheadLimitEnabled: boolean;
}

export interface LiquidDspState {
  masterEnabled: boolean;
  activePreset: DevicePresetId;
  loudness: LoudnessCorrectionSettings;
  voiceIsolation: VoiceIsolationSettings;
  acoustic: AcousticMeasurementSettings;
  autoEq: AutoEqSettings;
  harmonics: HarmonicExpanderSettings;
  nosR2r: NosR2rSettings;
  smoothVolume: SmoothVolumeSettings;
}

