import React, { useState } from 'react';
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
  Zap,
  Check,
  Compass,
  Boxes,
  Waves
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
  // 10-Band EQ state
  const [eqGains, setEqGains] = useState<number[]>([4.0, 3.2, 1.5, 0.0, -1.0, 0.0, 2.0, 3.5, 4.8, 2.5]);
  const eqFrequencies = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];

  const handleBandGainChange = (bandIdx: number, val: number) => {
    setEqGains(prev => {
      const next = [...prev];
      next[bandIdx] = val;
      return next;
    });
  };

  const handleResetCurve = () => {
    setEqGains([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const presetProfiles: { id: DevicePresetId; name: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'audiophile_open_back', name: 'Acoustic Transparency', desc: 'Active Reference Default', icon: <Waves size={16} /> },
    { id: 'bluetooth_headphones', name: 'Bass Resonance', desc: '+4.5dB Sub Bass Contour', icon: <Volume2 size={16} /> },
    { id: 'in_ear_monitors', name: 'IEM Harman 2019', desc: 'Squig Target AutoEQ', icon: <Sparkles size={16} /> },
    { id: 'usb_dac', name: 'Studio Flat', desc: 'Direct Bit-Perfect DAC', icon: <Cpu size={16} /> },
    { id: 'phone_speaker', name: 'Dynamic Loudness', desc: 'Fletcher-Munson ISO 226', icon: <Speaker size={16} /> },
    { id: 'car_audio', name: 'Wide Soundstage', desc: 'Crossfeed + 3D Room', icon: <Compass size={16} /> },
  ];

  const autoEqProfiles: { id: AutoEqProfileId; label: string }[] = [
    { id: 'harman_ie_2019', label: 'Harman 2019' },
    { id: 'diffuse_field_5128', label: 'Diffuse Field' },
    { id: 'ief_neutral', label: 'IEF Neutral' },
    { id: 'rtings_target', label: 'Rtings' },
    { id: 'crinacle_target', label: 'Crinacle' },
  ];

  const roomProfiles: { id: RoomAcousticProfileId; label: string }[] = [
    { id: 'cathedral', label: 'Cathedral' },
    { id: 'concert_hall', label: 'Concert Hall' },
    { id: 'audiophile_room', label: 'Listening Room' },
    { id: 'studio_control', label: 'Studio Control' },
    { id: 'nearfield', label: 'Nearfield' },
  ];

  return (
    <div className="pb-52 pt-4 px-4 sm:px-5 animate-in fade-in duration-300">
      
      {/* 1. Header with Master Bypass */}
      <section className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-[#62CDFF] uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#62CDFF] animate-pulse" />
            DSP AUDIO ENGINE
          </p>
          <h1 className="text-2xl font-bold font-sora text-white tracking-tight mt-0.5">
            Acoustic Sanctuary
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Master Bypass Toggle */}
          <div className="flex items-center gap-2 bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-[11px] font-mono text-[#ccc3d5] font-semibold">
              {dspState.masterEnabled ? 'Active' : 'Bypass'}
            </span>
            <button
              onClick={() => onUpdateDspState(prev => ({ ...prev, masterEnabled: !prev.masterEnabled }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
                dspState.masterEnabled 
                  ? 'border-[#62CDFF] bg-gradient-to-r from-[#a377fe] to-[#62CDFF] shadow-[0_0_12px_rgba(98,205,255,0.5)]' 
                  : 'border-white/20 bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#05040A] shadow-md transition duration-200 mt-[2px] ${
                  dspState.masterEnabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button
            onClick={onResetDsp}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#ccc3d5] hover:text-white border border-white/10 active:scale-95 transition-all"
            title="Reset All DSP to Defaults"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </section>

      {/* 2. Engine Status Ribbon */}
      <section className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-lg mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#62CDFF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#62CDFF]" />
          </span>
          <span className="text-xs font-sora font-semibold text-white tracking-wide">
            32-Bit Floating Point DSP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#62CDFF]/15 text-[#62CDFF] border border-[#62CDFF]/30">
            192 kHz
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ffe169]/15 text-[#ffe169] border border-[#ffe169]/30">
            DSD Direct
          </span>
        </div>
      </section>

      {/* 3. Frequency Topology Live Bode Spectrum Canvas */}
      <section 
        className="relative rounded-[28px] p-4 sm:p-5 border border-white/[0.14] shadow-2xl mb-5 overflow-hidden"
        style={{
          background: 'rgba(20, 16, 32, 0.85)',
          backdropFilter: 'blur(30px) saturate(210%)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#62CDFF]" />
            <h2 className="text-sm font-bold font-sora text-white">
              Frequency Topology
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#ccc3d5]">
            <span>+6.0 dB Peak</span>
            <span>•</span>
            <span className="text-[#62CDFF] font-semibold">Live Real-time</span>
          </div>
        </div>

        {/* Live Bode Response Graph */}
        <InteractiveAcousticCurve dspState={dspState} />

        {/* Frequency Scale Footer */}
        <div className="flex justify-between px-1 text-[9px] font-mono text-[#ccc3d5]/70 pt-2 border-t border-white/[0.08] mt-2">
          <span>31Hz</span>
          <span>125Hz</span>
          <span>500Hz</span>
          <span>2kHz</span>
          <span>8kHz</span>
          <span>16kHz</span>
        </div>
      </section>

      {/* 4. Quick Sound Profile Presets (Horizontal Carousel) */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold font-sora text-white">
            Acoustic Profiles
          </h3>
          <span className="text-xs text-[#a377fe] font-mono font-semibold">
            {presetProfiles.length} Tunings
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {presetProfiles.map((p) => {
            const isSelected = dspState.activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onApplyPreset(p.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#a377fe]/30 to-[#62CDFF]/30 border-[#62CDFF]/60 shadow-[0_0_16px_rgba(98,205,255,0.3)]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-[#62CDFF] text-[#05040A]' : 'bg-white/10 text-white'
                }`}>
                  {p.icon}
                </div>
                <div className="pr-1">
                  <div className="text-xs font-bold font-sora text-white leading-tight">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[#ccc3d5]/70 font-mono mt-0.5">
                    {p.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Parametric 10-Band Glass Equalizer */}
      <section 
        className="rounded-[28px] p-4 sm:p-5 border border-white/[0.14] shadow-2xl mb-5"
        style={{
          background: 'rgba(20, 16, 32, 0.85)',
          backdropFilter: 'blur(30px) saturate(210%)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold font-sora text-white">
              10-Band Mastering EQ
            </h3>
            <p className="text-[11px] text-[#ccc3d5]/70 font-medium">
              Octave Precision Linear Phase
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 bg-black/40 rounded-full border border-white/10 text-[#ccc3d5]">
            <span>Range:</span>
            <span className="text-[#62CDFF] font-bold">±12.0 dB</span>
          </div>
        </div>

        {/* 10 Vertical Sliders Grid */}
        <div className="grid grid-cols-10 gap-1 text-center select-none pt-1">
          {eqFrequencies.map((freq, idx) => {
            const gain = eqGains[idx];
            return (
              <div key={freq} className="flex flex-col items-center space-y-2">
                <span className={`text-[9px] font-mono font-bold ${
                  gain > 0 ? 'text-[#62CDFF]' : gain < 0 ? 'text-[#F43F9E]' : 'text-white/50'
                }`}>
                  {gain > 0 ? `+${gain.toFixed(1)}` : gain.toFixed(1)}
                </span>
                
                <div className="h-32 flex items-center justify-center relative">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={gain}
                    onChange={(e) => handleBandGainChange(idx, Number(e.target.value))}
                    className="vertical-slider h-28 cursor-pointer"
                  />
                </div>

                <span className="text-[10px] font-mono text-[#ccc3d5]/70 font-semibold">
                  {freq}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <button
            onClick={handleResetCurve}
            className="text-[#ccc3d5] hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[11px]"
          >
            <RotateCcw size={12} />
            <span>Reset Curve</span>
          </button>
          <span className="text-[11px] font-mono text-[#62CDFF]">
            Q-Factor: Constant 1.414
          </span>
        </div>
      </section>

      {/* 6. Acoustic Architect Modules (Bento Grid of All 8 DSP Systems) */}
      <div className="mb-4">
        <h3 className="text-sm font-bold font-sora text-white mb-3">
          Acoustic Architect Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Module 1: 3D Spatializer & HRTF Room */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#62CDFF]">
                <Compass size={17} />
                <span className="text-xs font-bold font-sora text-white">3D Spatializer</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#62CDFF]/20 text-[#62CDFF]">
                HRTF Holographic
              </span>
            </div>

            {/* Dimension Dial */}
            <div className="flex items-center justify-center py-2">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#62CDFF]/40 flex items-center justify-center relative">
                <div className="w-18 h-18 rounded-full bg-white/[0.06] backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
                  <span className="text-base font-bold font-sora text-[#62CDFF]">
                    {Math.round(dspState.acoustic.earlyReflectionsMix * 100)}%
                  </span>
                  <span className="text-[9px] font-mono text-[#ccc3d5]/70">
                    {dspState.acoustic.profile.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Picker & Crossfeed */}
            <div className="space-y-2 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {roomProfiles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => onUpdateDspState(prev => ({
                      ...prev,
                      acoustic: { ...prev.acoustic, profile: r.id }
                    }))}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all ${
                      dspState.acoustic.profile === r.id
                        ? 'bg-[#62CDFF] text-[#05040A] font-bold'
                        : 'bg-white/5 text-[#ccc3d5]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#ccc3d5] font-sora">Linkwitz Crossfeed</span>
                <button
                  onClick={() => onUpdateDspState(prev => ({
                    ...prev,
                    acoustic: { ...prev.acoustic, crossfeedEnabled: !prev.acoustic.crossfeedEnabled }
                  }))}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    dspState.acoustic.crossfeedEnabled ? 'bg-[#62CDFF]/20 text-[#62CDFF] border border-[#62CDFF]/40' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {dspState.acoustic.crossfeedEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Module 2: Harmonic Tube Warmth */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#a377fe]">
                <Flame size={17} />
                <span className="text-xs font-bold font-sora text-white">Tube Warmth</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#a377fe]/20 text-[#d2bcff]">
                12AX7 Even-Order
              </span>
            </div>

            {/* Vacuum Tube Visualizer */}
            <div className="flex items-center justify-center py-2">
              <div className="w-20 h-24 rounded-2xl bg-black/60 border border-[#a377fe]/30 p-2 flex flex-col items-center justify-center relative shadow-[inset_0_0_16px_rgba(163,119,254,0.3)]">
                <div className="w-4 h-12 rounded-full bg-gradient-to-t from-[#a377fe] to-[#F43F9E] opacity-80 blur-[2px] animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#d2bcff] mt-1">12AX7</span>
              </div>
            </div>

            {/* Tube Controls */}
            <div className="space-y-2 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Saturation Drive</span>
                <span className="text-[#a377fe] font-bold">
                  {(dspState.harmonics.drive * 10).toFixed(1)} dB
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={dspState.harmonics.drive}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  harmonics: { ...prev.harmonics, drive: Number(e.target.value) }
                }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a377fe]"
              />
            </div>
          </div>

          {/* Module 3: Voice Isolation / Center Extractor */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#ffe169]">
                <Mic size={17} />
                <span className="text-xs font-bold font-sora text-white">Voice Isolation</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ffe169]/20 text-[#ffe169]">
                M/S Center
              </span>
            </div>

            <div className="flex gap-2 my-2">
              {(['off', 'isolate', 'remove'] as VoiceIsolationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateDspState(prev => ({
                    ...prev,
                    voiceIsolation: { ...prev.voiceIsolation, mode }
                  }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                    dspState.voiceIsolation.mode === mode
                      ? 'bg-gradient-to-r from-[#ffe169] to-[#F43F9E] text-[#05040A] font-bold shadow-md'
                      : 'bg-white/5 text-[#ccc3d5]'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-1 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Formant Intensity</span>
                <span className="text-[#ffe169] font-bold">
                  {Math.round(dspState.voiceIsolation.intensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={dspState.voiceIsolation.intensity}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  voiceIsolation: { ...prev.voiceIsolation, intensity: Number(e.target.value) }
                }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffe169]"
              />
            </div>
          </div>

          {/* Module 4: NOS R2R Ladder DAC Simulator */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#62CDFF]">
                <Cpu size={17} />
                <span className="text-xs font-bold font-sora text-white">NOS R2R Ladder</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#62CDFF]/20 text-[#62CDFF]">
                Discrete Resistors
              </span>
            </div>

            <div className="flex items-center justify-between my-2">
              <div>
                <p className="text-xs font-bold font-sora text-white">Sinc Droop (-3dB @ 20k)</p>
                <p className="text-[10px] text-[#ccc3d5]/70">Zero-oversampling natural step response</p>
              </div>
              <button
                onClick={() => onUpdateDspState(prev => ({
                  ...prev,
                  nosR2r: { ...prev.nosR2r, sincRollOff: !prev.nosR2r.sincRollOff }
                }))}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${
                  dspState.nosR2r.sincRollOff ? 'bg-[#62CDFF] text-[#05040A] font-bold' : 'bg-white/10 text-white/50'
                }`}
              >
                {dspState.nosR2r.sincRollOff ? 'ENABLED' : 'FLAT'}
              </button>
            </div>

            <div className="space-y-1 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Ladder Precision</span>
                <span className="text-[#62CDFF] font-bold">
                  {dspState.nosR2r.bitDepthMode}-Bit Discrete
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[16, 24].map((bits) => (
                  <button
                    key={bits}
                    onClick={() => onUpdateDspState(prev => ({
                      ...prev,
                      nosR2r: { ...prev.nosR2r, bitDepthMode: bits as 16 | 24 }
                    }))}
                    className={`py-1 rounded-lg text-xs font-mono font-bold ${
                      dspState.nosR2r.bitDepthMode === bits
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {bits}-Bit R2R
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Module 5: Squig Live AutoEQ Targets */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#F43F9E]">
                <Activity size={17} />
                <span className="text-xs font-bold font-sora text-white">Squig Live AutoEQ</span>
              </div>
              <button
                onClick={() => onUpdateDspState(prev => ({
                  ...prev,
                  autoEq: { ...prev.autoEq, enabled: !prev.autoEq.enabled }
                }))}
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  dspState.autoEq.enabled ? 'bg-[#F43F9E] text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                {dspState.autoEq.enabled ? 'ACTIVE' : 'BYPASS'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 my-1">
              {autoEqProfiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => onUpdateDspState(prev => ({
                    ...prev,
                    autoEq: { ...prev.autoEq, profile: p.id }
                  }))}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                    dspState.autoEq.profile === p.id
                      ? 'bg-[#F43F9E] text-white font-bold shadow'
                      : 'bg-white/5 text-[#ccc3d5]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="space-y-1 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Correction Strength</span>
                <span className="text-[#F43F9E] font-bold">
                  {Math.round(dspState.autoEq.intensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={dspState.autoEq.intensity}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  autoEq: { ...prev.autoEq, intensity: Number(e.target.value) }
                }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F43F9E]"
              />
            </div>
          </div>

          {/* Module 6: Dynamic Compander & EBU R128 Smooth Volume */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#a377fe]">
                <AudioWaveform size={17} />
                <span className="text-xs font-bold font-sora text-white">Smooth Volume</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#a377fe]/20 text-[#d2bcff]">
                EBU R128 Limiter
              </span>
            </div>

            {/* Dynamic visualizer bars */}
            <div className="flex items-end justify-center gap-1.5 h-16 py-1">
              <div className="w-2 h-6 rounded-full bg-[#a377fe]/40" />
              <div className="w-2 h-10 rounded-full bg-[#62CDFF]/80 shadow-[0_0_8px_#62CDFF]" />
              <div className="w-2 h-14 rounded-full bg-[#F43F9E] shadow-[0_0_8px_#F43F9E]" />
              <div className="w-2 h-8 rounded-full bg-[#a377fe]/60" />
              <div className="w-2 h-5 rounded-full bg-white/20" />
            </div>

            <div className="space-y-1 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Target Loudness</span>
                <span className="text-[#a377fe] font-bold">
                  {dspState.smoothVolume.targetLufs} LUFS
                </span>
              </div>
              <input
                type="range"
                min="-24"
                max="-8"
                step="1"
                value={dspState.smoothVolume.targetLufs}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  smoothVolume: { ...prev.smoothVolume, targetLufs: Number(e.target.value) }
                }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a377fe]"
              />
            </div>
          </div>

          {/* Module 7: Loudness Correction (ISO 226) */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#ffe169]">
                <Volume2 size={17} />
                <span className="text-xs font-bold font-sora text-white">Loudness (ISO 226)</span>
              </div>
              <button
                onClick={() => onUpdateDspState(prev => ({
                  ...prev,
                  loudness: { ...prev.loudness, enabled: !prev.loudness.enabled }
                }))}
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  dspState.loudness.enabled ? 'bg-[#ffe169] text-[#05040A]' : 'bg-white/10 text-white/40'
                }`}
              >
                {dspState.loudness.enabled ? 'ACTIVE' : 'BYPASS'}
              </button>
            </div>

            <p className="text-[11px] text-[#ccc3d5]/70 leading-normal my-1">
              Dynamic bass and treble compensation according to human ear sensitivity at lower volumes.
            </p>

            <div className="space-y-1 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Sub-Bass Boost</span>
                <span className="text-[#ffe169] font-bold">
                  +{dspState.loudness.bassBoostDb.toFixed(1)} dB
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={dspState.loudness.bassBoostDb}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  loudness: { ...prev.loudness, bassBoostDb: Number(e.target.value) }
                }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffe169]"
              />
            </div>
          </div>

          {/* Module 8: Studio Soundstage Convolver */}
          <div 
            className="rounded-[24px] p-4 border border-white/[0.12] shadow-lg flex flex-col justify-between"
            style={{
              background: 'rgba(20, 16, 32, 0.78)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#62CDFF]">
                <Layers size={17} />
                <span className="text-xs font-bold font-sora text-white">Convolver Reverb</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#62CDFF]/20 text-[#62CDFF]">
                Impulse Response
              </span>
            </div>

            <p className="text-[11px] text-[#ccc3d5]/70 leading-normal my-1">
              Real-time mathematical convolution with acoustic impulse responses to simulate natural physical spaces.
            </p>

            <div className="space-y-1 mt-2 pt-2 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#ccc3d5]">Decay Time</span>
                <span className="text-[#62CDFF] font-bold">
                  {dspState.acoustic.roomDecayMs} ms
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={dspState.acoustic.roomDecayMs}
                onChange={(e) => onUpdateDspState(prev => ({
                  ...prev,
                  acoustic: { ...prev.acoustic, roomDecayMs: Number(e.target.value) }
                }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#62CDFF]"
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
