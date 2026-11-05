import React from 'react';
import {
  LiquidDspState,
  DevicePresetId,
  VoiceIsolationMode,
  AutoEqProfileId,
  RoomAcousticProfileId
} from '../../types/dsp';
import { DEVICE_PRESETS, AUTO_EQ_PROFILES } from '../../dsp/presets';
import { InteractiveAcousticCurve } from './InteractiveAcousticCurve';
import {
  Sliders,
  Headphones,
  Speaker,
  Disc,
  Cpu,
  Radio,
  Car,
  Activity,
  Mic,
  AudioWaveform,
  Flame,
  Volume2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Layers,
  Zap
} from 'lucide-react';

interface DspControllerViewProps {
  dspState: LiquidDspState;
  onUpdateDspState: (updater: (prev: LiquidDspState) => LiquidDspState) => void;
  onApplyPreset: (presetId: DevicePresetId) => void;
  onResetDsp: () => void;
}

export const DspControllerView: React.FC<DspControllerViewProps> = ({
  dspState,
  onUpdateDspState,
  onApplyPreset,
  onResetDsp,
}) => {
  const presetKeys: DevicePresetId[] = [
    'bluetooth_headphones',
    'in_ear_monitors',
    'audiophile_open_back',
    'phone_speaker',
    'usb_dac',
    'car_audio',
  ];

  const getPresetIcon = (id: DevicePresetId) => {
    switch (id) {
      case 'bluetooth_headphones': return <Headphones size={15} />;
      case 'in_ear_monitors': return <Radio size={15} />;
      case 'audiophile_open_back': return <Disc size={15} />;
      case 'phone_speaker': return <Speaker size={15} />;
      case 'usb_dac': return <Cpu size={15} />;
      case 'car_audio': return <Car size={15} />;
      default: return <Sliders size={15} />;
    }
  };

  return (
    <div className="pb-60 pt-5 px-4 sm:px-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 mb-6 relative overflow-hidden border border-white/10">
        <div
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full filter blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'var(--grad-liquid-violet)' }}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#913af1] to-[#ac5bfb] flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                <Sliders size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-normal">
                  DSP Sound Controller
                </h1>
                <p className="text-xs text-white/60 font-medium">
                  Studio Acoustic Suite • Powered by JamesDSP & Elovaire Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Master Bypass Toggle */}
            <button
              onClick={() => onUpdateDspState(prev => ({ ...prev, masterEnabled: !prev.masterEnabled }))}
              className={`px-4 py-2 rounded-2xl font-bold text-xs tracking-wide flex items-center gap-2 transition-all ${dspState.masterEnabled
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-700/40 border border-violet-400/30'
                  : 'bg-white/10 text-white/50 border border-white/10'
                }`}
            >
              <Zap size={14} fill={dspState.masterEnabled ? "currentColor" : "none"} />
              {dspState.masterEnabled ? 'DSP ACTIVE' : 'BYPASSED'}
            </button>

            <button
              onClick={onResetDsp}
              className="p-2.5 rounded-2xl glass-panel text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset All DSP to Defaults"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* 1. Device Presets Row */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <span className="text-[11px] uppercase tracking-wider font-bold text-white/50 block mb-3">
            DEVICE PROFILES & TARGETS
          </span>
          <div className="flex flex-wrap gap-2">
            {presetKeys.map((pId) => {
              const preset = DEVICE_PRESETS[pId];
              const isSelected = dspState.activePreset === pId;
              return (
                <button
                  key={pId}
                  onClick={() => onApplyPreset(pId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${isSelected
                      ? 'bg-gradient-to-tr from-[#913af1] to-[#ac5bfb] text-white shadow-md shadow-purple-900/40 border border-violet-300/40 scale-105'
                      : 'glass-panel text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {getPresetIcon(pId)}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of the 7 Audio Controller Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Module 1: Loudness Correction */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
                <Volume2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Loudness Correction</h3>
                <span className="text-[11px] text-white/50">ISO 226 Equal-Loudness Contour</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.loudness.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  loudness: { ...prev.loudness, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.loudness.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Listening Level Ref</span>
                <span className="font-mono text-violet-300">{dspState.loudness.listeningLevelDb} dB</span>
              </div>
              <input
                type="range"
                min={-60}
                max={0}
                value={dspState.loudness.listeningLevelDb}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  loudness: { ...prev.loudness, listeningLevelDb: Number(e.target.value) }
                }))}
                className="accent-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                  <span>Bass Contour</span>
                  <span className="font-mono text-violet-300">+{dspState.loudness.bassBoostDb} dB</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={0.5}
                  value={dspState.loudness.bassBoostDb}
                  onChange={(e) => onUpdateDspState(prev => ({
                    ...prev,
                    activePreset: 'custom',
                    loudness: { ...prev.loudness, bassBoostDb: Number(e.target.value) }
                  }))}
                  className="accent-violet-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                  <span>Treble Air</span>
                  <span className="font-mono text-violet-300">+{dspState.loudness.trebleBoostDb} dB</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={dspState.loudness.trebleBoostDb}
                  onChange={(e) => onUpdateDspState(prev => ({
                    ...prev,
                    activePreset: 'custom',
                    loudness: { ...prev.loudness, trebleBoostDb: Number(e.target.value) }
                  }))}
                  className="accent-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-white/70">Dynamic Volume Tracking</span>
              <input
                type="checkbox"
                checked={dspState.loudness.dynamicTracking}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  loudness: { ...prev.loudness, dynamicTracking: e.target.checked }
                }))}
                className="w-4 h-4 accent-violet-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Module 2: Voice Isolation & Center Channel */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                <Mic size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Voice Isolation</h3>
                <span className="text-[11px] text-white/50">M/S Center Extraction & Karaoke</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.voiceIsolation.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  voiceIsolation: {
                    ...prev.voiceIsolation,
                    enabled: e.target.checked,
                    mode: e.target.checked && prev.voiceIsolation.mode === 'off' ? 'isolate' : prev.voiceIsolation.mode
                  }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.voiceIsolation.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Mode Pills */}
            <div className="flex gap-2">
              {(['isolate', 'remove'] as VoiceIsolationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateDspState(prev => ({
                    ...prev,
                    activePreset: 'custom',
                    voiceIsolation: { ...prev.voiceIsolation, mode }
                  }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${dspState.voiceIsolation.mode === mode
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-900/40'
                      : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                >
                  {mode === 'isolate' ? 'Isolate Vocals' : 'Remove Vocals (Karaoke)'}
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Isolation Strength</span>
                <span className="font-mono text-pink-300">{Math.round(dspState.voiceIsolation.intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={dspState.voiceIsolation.intensity}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  voiceIsolation: { ...prev.voiceIsolation, intensity: Number(e.target.value) }
                }))}
                className="accent-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/60 block mb-1">Vocal Low Cut</span>
                <span className="font-mono text-white/90">{dspState.voiceIsolation.lowCutHz} Hz</span>
              </div>
              <div>
                <span className="text-white/60 block mb-1">Vocal High Cut</span>
                <span className="font-mono text-white/90">{dspState.voiceIsolation.highCutHz} Hz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Squig Live AutoEQ */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <AudioWaveform size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Squig Live AutoEQ</h3>
                <span className="text-[11px] text-white/50">Headphone & IEM Target Compensation</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.autoEq.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  autoEq: { ...prev.autoEq, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.autoEq.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Target Profile Pills */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(AUTO_EQ_PROFILES).map((profKey) => {
                const info = AUTO_EQ_PROFILES[profKey as AutoEqProfileId];
                const isSelected = dspState.autoEq.profile === profKey;
                return (
                  <button
                    key={profKey}
                    onClick={() => onUpdateDspState(prev => ({
                      ...prev,
                      activePreset: 'custom',
                      autoEq: { ...prev.autoEq, profile: profKey as AutoEqProfileId }
                    }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {info.name}
                  </button>
                );
              })}
            </div>

            {/* Live Interactive Frequency Response Bode Curve */}
            <InteractiveAcousticCurve dspState={dspState} />

            {/* Profile Description */}
            <p className="text-xs text-white/60 bg-black/20 p-2.5 rounded-xl border border-white/5">
              {AUTO_EQ_PROFILES[dspState.autoEq.profile]?.description}
            </p>

            {/* Intensity Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Compensation Strength</span>
                <span className="font-mono text-cyan-300">{Math.round(dspState.autoEq.intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.05}
                value={dspState.autoEq.intensity}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  autoEq: { ...prev.autoEq, intensity: Number(e.target.value) }
                }))}
                className="accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Module 4: Harmonic Expander */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <Flame size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Harmonic Expander</h3>
                <span className="text-[11px] text-white/50">Vacuum Tube Saturation & Exciter</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.harmonics.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  harmonics: { ...prev.harmonics, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.harmonics.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Tube Drive</span>
                <span className="font-mono text-amber-300">{Math.round(dspState.harmonics.drive * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={dspState.harmonics.drive}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  harmonics: { ...prev.harmonics, drive: Number(e.target.value) }
                }))}
                className="accent-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                  <span>2nd Harm (Warm)</span>
                  <span className="font-mono text-amber-300">{Math.round(dspState.harmonics.secondHarmonicGain * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={dspState.harmonics.secondHarmonicGain}
                  onChange={(e) => onUpdateDspState(prev => ({
                    ...prev,
                    activePreset: 'custom',
                    harmonics: { ...prev.harmonics, secondHarmonicGain: Number(e.target.value) }
                  }))}
                  className="accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                  <span>3rd Harm (Edge)</span>
                  <span className="font-mono text-amber-300">{Math.round(dspState.harmonics.thirdHarmonicGain * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={dspState.harmonics.thirdHarmonicGain}
                  onChange={(e) => onUpdateDspState(prev => ({
                    ...prev,
                    activePreset: 'custom',
                    harmonics: { ...prev.harmonics, thirdHarmonicGain: Number(e.target.value) }
                  }))}
                  className="accent-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> DC Blocker Active</span>
              <span className="font-mono text-amber-300">4x Oversampled</span>
            </div>
          </div>
        </div>

        {/* Module 5: NOS R2R Simulator */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">NOS R2R Simulator</h3>
                <span className="text-[11px] text-white/50">Non-Oversampling Ladder DAC Emulation</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.nosR2r.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  nosR2r: { ...prev.nosR2r, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.nosR2r.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Sinc HF Droop</span>
                <span className="text-[10px] text-white/50">-3.17 dB @ 20kHz Zero-Order Hold</span>
              </div>
              <input
                type="checkbox"
                checked={dspState.nosR2r.sincRollOff}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  nosR2r: { ...prev.nosR2r, sincRollOff: e.target.checked }
                }))}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Resistor Network Tolerance Jitter</span>
                <span className="font-mono text-emerald-300">{Math.round(dspState.nosR2r.ladderToleranceJitter * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={dspState.nosR2r.ladderToleranceJitter}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  nosR2r: { ...prev.nosR2r, ladderToleranceJitter: Number(e.target.value) }
                }))}
                className="accent-emerald-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-white/70">Ladder Precision</span>
              <div className="flex gap-1.5">
                {[16, 24].map((bits) => (
                  <button
                    key={bits}
                    onClick={() => onUpdateDspState(prev => ({
                      ...prev,
                      activePreset: 'custom',
                      nosR2r: { ...prev.nosR2r, bitDepthMode: bits as 16 | 24 }
                    }))}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${dspState.nosR2r.bitDepthMode === bits
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/10 text-white/60'
                      }`}
                  >
                    {bits}-bit
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module 6: Acoustic Measurement & Convolver */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Acoustic Measurement</h3>
                <span className="text-[11px] text-white/50">Room Convolver & Crossfeed</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.acoustic.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  acoustic: { ...prev.acoustic, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.acoustic.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Linkwitz Crossfeed</span>
                <span className="text-[10px] text-white/50">Headphone listening fatigue relief</span>
              </div>
              <input
                type="checkbox"
                checked={dspState.acoustic.crossfeedEnabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  acoustic: { ...prev.acoustic, crossfeedEnabled: e.target.checked }
                }))}
                className="w-4 h-4 accent-blue-500 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Early Reflections Mix</span>
                <span className="font-mono text-blue-300">{Math.round(dspState.acoustic.earlyReflectionsMix * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={dspState.acoustic.earlyReflectionsMix}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  acoustic: { ...prev.acoustic, earlyReflectionsMix: Number(e.target.value) }
                }))}
                className="accent-blue-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-white/70">Room Mode Damping (45Hz/85Hz)</span>
              <input
                type="checkbox"
                checked={dspState.acoustic.roomModeNotchDamping}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  acoustic: { ...prev.acoustic, roomModeNotchDamping: e.target.checked }
                }))}
                className="w-4 h-4 accent-blue-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Module 7: Smooth Volume */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Smooth Volume</h3>
                <span className="text-[11px] text-white/50">EBU R128 Dynamic Range Normalizer</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dspState.smoothVolume.enabled}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  smoothVolume: { ...prev.smoothVolume, enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${dspState.smoothVolume.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Target Loudness</span>
                <span className="font-mono text-purple-300">{dspState.smoothVolume.targetLufs} LUFS</span>
              </div>
              <input
                type="range"
                min={-24}
                max={-8}
                step={0.5}
                value={dspState.smoothVolume.targetLufs}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  smoothVolume: { ...prev.smoothVolume, targetLufs: Number(e.target.value) }
                }))}
                className="accent-purple-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Max Safe Leveler Boost</span>
                <span className="font-mono text-purple-300">+{dspState.smoothVolume.maxGainBoostDb} dB</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={0.5}
                value={dspState.smoothVolume.maxGainBoostDb}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  activePreset: 'custom',
                  smoothVolume: { ...prev.smoothVolume, maxGainBoostDb: Number(e.target.value) }
                }))}
                className="accent-purple-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-white/70">Lookahead Peak Limiter</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> ZERO CLIP
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
