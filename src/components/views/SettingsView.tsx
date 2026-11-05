import React, { useRef, useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  RotateCcw, 
  User, 
  GitFork, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Sliders,
  Wifi,
  Radio,
  Layers,
  HardDrive,
  Trash2,
  ChevronRight,
  Disc,
  Cpu
} from 'lucide-react';

interface SettingsViewProps {
  appIconUrl: string;
  onUpdateAppIcon: (newIconUrl: string) => void;
  onResetAppIcon: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  appIconUrl,
  onUpdateAppIcon,
  onResetAppIcon,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [bitPerfect, setBitPerfect] = useState<boolean>(true);
  const [sampleRate, setSampleRate] = useState<string>('192k');
  const [dacBuffer, setDacBuffer] = useState<number>(64);
  const [gaplessTransition, setGaplessTransition] = useState<boolean>(true);
  const [glowIntensity, setGlowIntensity] = useState<number>(85);
  const [fluidBloom, setFluidBloom] = useState<boolean>(true);
  const [cachePurged, setCachePurged] = useState<boolean>(false);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUpdateAppIcon(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePurgeCache = () => {
    setCachePurged(true);
    setTimeout(() => setCachePurged(false), 3000);
  };

  const sampleRates = ['44.1k', '96.0k', '192k', '384k'];

  const contributors = [
    {
      name: 'RootlessJamesDSP',
      tag: 'DSP Engine & AutoEQ',
      desc: 'Native DSP algorithms, AutoEQ target curve engine, Linkwitz crossfeed, and compander.',
      url: 'https://github.com/thepbone/RootlessJamesDSP',
    },
    {
      name: 'elovaire-music',
      tag: 'Media3 Audio Processor Pipeline',
      desc: 'In-process realtime AudioProcessor pipeline, soft-knee limiter, and high-performance biquad structures.',
      url: 'https://github.com/elovaire/elovaire-music',
    },
    {
      name: 'Audiofy',
      tag: 'Music Card Design & Console',
      desc: 'Signature Now Playing card layout, vinyl disc dynamo, and live 42-band spectrum analyzer.',
      url: 'https://github.com/Zakir-Sheikh/Audiofy',
    },
    {
      name: 'mucke',
      tag: 'App Style & Aesthetic',
      desc: 'Obsidian/violet dark palette, custom gradients, and clean mobile typography.',
      url: 'https://github.com/mucke-music/mucke',
    },
    {
      name: 'Stitch / Luminous Crystal',
      tag: 'Design System & DSP Topology',
      desc: 'Luminous crystal glassmorphism, frequency topology curve, and 10-band mastering EQ layout.',
      url: 'https://github.com/Neuro-Rift/Music_OpenSource_For_All',
    },
  ];

  return (
    <div className="pb-52 pt-4 px-4 sm:px-5 animate-in fade-in duration-300">
      
      {/* 1. Header */}
      <div className="mb-5">
        <p className="text-[10px] font-mono font-bold tracking-widest text-[#62CDFF] uppercase">
          SYSTEM PREFERENCES
        </p>
        <h1 className="text-2xl font-bold font-sora text-white tracking-tight mt-0.5 flex items-center gap-2">
          <span>Settings & Architecture</span>
        </h1>
        <p className="text-xs text-[#ccc3d5] font-medium tracking-normal mt-1 leading-normal">
          Audio engine configuration, app icon, hardware pass, and open-source contributors
        </p>
      </div>

      {/* 2. Audiophile Pro Master Pass Glass Card */}
      <section className="relative rounded-[28px] p-[1px] mb-6 overflow-hidden shadow-2xl shimmer-edge">
        <div 
          className="relative rounded-[27px] p-5 border border-white/[0.14] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(28, 22, 46, 0.92) 0%, rgba(12, 10, 24, 0.96) 100%)',
            backdropFilter: 'blur(32px) saturate(220%)',
          }}
        >
          {/* Hologram sweep effect */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-bl from-[#62CDFF]/30 via-[#F43F9E]/20 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#62CDFF]/15 border border-[#62CDFF]/40 text-[#62CDFF] text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={11} className="text-[#62CDFF]" />
                    ACTIVE HARDWARE PASS
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#ffe169] text-[10px] font-mono font-bold">
                    384kHz / 32-bit
                  </span>
                </div>
                <h2 className="text-lg font-bold font-sora text-white tracking-tight mt-2">
                  Audiophile Pro Master Pass
                </h2>
                <p className="text-xs text-[#ccc3d5] leading-relaxed max-w-sm">
                  Bit-Perfect direct engine enabled. ASIO/ALSA bypass unlocked for DAC stream isolation and 32-bit floating point precision.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-[#62CDFF] shadow-inner flex-shrink-0">
                <Disc size={26} className="animate-spin-slow" />
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#ccc3d5]">
                <Cpu size={14} className="text-[#62CDFF]" />
                <span className="font-mono text-[11px]">Token: #8942-AP • Neuro-Rift Lead</span>
              </div>
              <span className="text-[#d2bcff] font-bold text-[11px] font-mono">
                Music v1.0.0
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Customize Application Icon Section */}
      <section 
        className="rounded-[26px] p-5 mb-6 border border-white/[0.12] shadow-xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 16, 32, 0.82)',
          backdropFilter: 'blur(28px) saturate(200%)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-[#a377fe]/20 text-[#d2bcff] flex-shrink-0 border border-[#a377fe]/30">
            <Sparkles size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sora text-white leading-snug">
              Customize Application Icon
            </h3>
            <span className="text-xs text-[#ccc3d5]/70 block mt-0.5">
              Personalize your app icon on home screen, status header, and favicon
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Current Icon Preview */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-[22px] overflow-hidden border-2 border-white/20 shadow-2xl bg-black/60 flex items-center justify-center p-1">
              <img
                src={appIconUrl}
                alt="Application Icon"
                className="w-full h-full object-cover rounded-[18px]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[8px] uppercase tracking-wider shadow-md flex items-center gap-0.5">
              <CheckCircle2 size={8} /> ACTIVE
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold font-sora text-white mb-1">
              Upload Custom Master Icon
            </h4>
            <p className="text-[11px] text-[#ccc3d5]/70 mb-3 leading-relaxed">
              Choose any image (PNG, JPG, SVG). Default is restored from images.jpg.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#a377fe] to-[#62CDFF] text-[#05040A] font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <Upload size={14} />
                <span>Choose Image</span>
              </button>

              <button
                onClick={onResetAppIcon}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform border border-white/10"
                title="Reset to default images.jpg"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Audio Engine & Output Hardware */}
      <section className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold font-sora text-white tracking-wide flex items-center gap-2">
            <Sliders size={16} className="text-[#62CDFF]" />
            <span>Audio Engine & Output</span>
          </h3>
          <span className="text-xs font-mono font-semibold text-[#62CDFF]">
            CoreAudio DSP Active
          </span>
        </div>

        <div 
          className="rounded-[26px] p-5 border border-white/[0.12] space-y-4 shadow-xl"
          style={{
            background: 'rgba(20, 16, 32, 0.82)',
            backdropFilter: 'blur(28px) saturate(200%)',
          }}
        >
          {/* Row: Bit-Perfect USB Direct Drive (Toggle) */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <p className="text-xs sm:text-sm font-bold text-white font-sora">
                Bit-Perfect USB Direct Drive
              </p>
              <p className="text-[11px] text-[#ccc3d5]/70 leading-normal">
                Bypass OS audio mixer for pure hardware clock delivery
              </p>
            </div>
            <button
              onClick={() => setBitPerfect(!bitPerfect)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                bitPerfect 
                  ? 'border-[#a377fe] bg-[#a377fe]/80 shadow-[0_0_12px_rgba(163,119,254,0.4)]' 
                  : 'border-white/20 bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-[2px] ${
                  bitPerfect ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* Sample Rate Lock Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-white font-sora">
                Sample Rate Frequency Lock
              </span>
              <span className="text-[10px] font-mono text-[#62CDFF] font-bold tracking-wider">
                AUTO-MATCH DAC
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-center text-xs">
              {sampleRates.map((sr) => {
                const isSelected = sampleRate === sr;
                return (
                  <button
                    key={sr}
                    onClick={() => setSampleRate(sr)}
                    className={`py-1.5 rounded-lg font-mono font-semibold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#a377fe] to-[#62CDFF] text-[#05040A] font-bold shadow-md'
                        : 'text-[#ccc3d5] hover:text-white'
                    }`}
                  >
                    {sr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* DAC Latency Buffer Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white font-medium font-sora">DAC Latency Buffer</span>
              <span className="font-mono text-[#62CDFF] font-semibold">
                {dacBuffer} Samples ({(dacBuffer * 0.022).toFixed(1)} ms)
              </span>
            </div>
            <input
              type="range"
              min="32"
              max="512"
              step="32"
              value={dacBuffer}
              onChange={(e) => setDacBuffer(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#62CDFF]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#ccc3d5]/60">
              <span>Ultra-low (32)</span>
              <span>Balanced (128)</span>
              <span>Safe (512)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Streaming & Playback Precision */}
      <section className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold font-sora text-white tracking-wide flex items-center gap-2">
            <Wifi size={16} className="text-[#a377fe]" />
            <span>Streaming & Playback Precision</span>
          </h3>
        </div>

        <div 
          className="rounded-[26px] p-5 border border-white/[0.12] space-y-4 shadow-xl"
          style={{
            background: 'rgba(20, 16, 32, 0.82)',
            backdropFilter: 'blur(28px) saturate(200%)',
          }}
        >
          {/* Wi-Fi Stream Resolution */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-white font-sora">Wi-Fi Stream Resolution</p>
                <span className="px-1.5 py-0.2 rounded bg-[#ffe169]/20 border border-[#ffe169]/40 text-[#ffe169] text-[9px] font-mono font-bold">
                  24-bit / 192kHz
                </span>
              </div>
              <p className="text-[11px] text-[#ccc3d5]/70">FLAC Uncompressed Lossless</p>
            </div>
            <span className="text-xs font-mono text-[#62CDFF] font-semibold">Master</span>
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* Cellular Stream Protocol */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-white font-sora">Cellular Stream Protocol</p>
              <p className="text-[11px] text-[#ccc3d5]/70">Adaptive ALAC (up to 96kHz) with buffer preload</p>
            </div>
            <span className="text-xs font-mono text-[#a377fe] font-semibold">Smart Lossless</span>
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* True Gapless Acoustic Transition */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <p className="text-xs sm:text-sm font-bold text-white font-sora">
                True Gapless Acoustic Transition
              </p>
              <p className="text-[11px] text-[#ccc3d5]/70 leading-normal">
                0ms frame boundary matching for continuous live concerts
              </p>
            </div>
            <button
              onClick={() => setGaplessTransition(!gaplessTransition)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                gaplessTransition 
                  ? 'border-[#62CDFF] bg-[#62CDFF]/80 shadow-[0_0_12px_rgba(98,205,255,0.4)]' 
                  : 'border-white/20 bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-[2px] ${
                  gaplessTransition ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Crystal Glass Aesthetics */}
      <section className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold font-sora text-white tracking-wide flex items-center gap-2">
            <Layers size={16} className="text-[#F43F9E]" />
            <span>Crystal Glass Aesthetics</span>
          </h3>
        </div>

        <div 
          className="rounded-[26px] p-5 border border-white/[0.12] space-y-4 shadow-xl"
          style={{
            background: 'rgba(20, 16, 32, 0.82)',
            backdropFilter: 'blur(28px) saturate(200%)',
          }}
        >
          {/* Glow Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white font-medium font-sora">Aura Theme Glow Intensity</span>
              <span className="text-[#F43F9E] font-mono font-semibold">{glowIntensity}% Prism Bloom</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F43F9E]"
            />
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* Fluid Background Spectrum Bloom Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <p className="text-xs sm:text-sm font-bold text-white font-sora">
                Fluid Background Spectrum Bloom
              </p>
              <p className="text-[11px] text-[#ccc3d5]/70">
                Live refraction reacting to active audio master peaks
              </p>
            </div>
            <button
              onClick={() => setFluidBloom(!fluidBloom)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                fluidBloom 
                  ? 'border-[#a377fe] bg-[#a377fe]/80 shadow-[0_0_12px_rgba(163,119,254,0.4)]' 
                  : 'border-white/20 bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-[2px] ${
                  fluidBloom ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* Haptic Touch Feedback */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-white font-sora">Analog Rotary & Slider Haptics</p>
              <p className="text-[11px] text-[#ccc3d5]/70">Tactile click emulation on touch controls</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-[#62CDFF]">
              Crisp (Level 3)
            </span>
          </div>
        </div>
      </section>

      {/* 7. Storage & FLAC Cache Allocation */}
      <section className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold font-sora text-white tracking-wide flex items-center gap-2">
            <HardDrive size={16} className="text-[#ffe169]" />
            <span>Storage & Cache Allocation</span>
          </h3>
          <span className="text-xs font-mono text-[#ccc3d5]/60">Capacity: 256 GB</span>
        </div>

        <div 
          className="rounded-[26px] p-5 border border-white/[0.12] space-y-4 shadow-xl"
          style={{
            background: 'rgba(20, 16, 32, 0.82)',
            backdropFilter: 'blur(28px) saturate(200%)',
          }}
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white font-medium font-sora">Allocated FLAC Hi-Res Cache</span>
              <span className="font-mono text-[#62CDFF] font-semibold">18.4 GB / 25.0 GB</span>
            </div>

            {/* Glass Multi-Segment Progress Bar */}
            <div className="h-3 w-full rounded-full bg-black/60 p-0.5 border border-white/15 overflow-hidden flex gap-0.5">
              <div className="h-full rounded-l-full bg-gradient-to-r from-[#62CDFF] to-[#a377fe]" style={{ width: '58%' }} />
              <div className="h-full bg-[#F43F9E]" style={{ width: '15%' }} />
              <div className="h-full rounded-r-full bg-white/10" style={{ width: '27%' }} />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#ccc3d5] pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#62CDFF] inline-block" />
                FLAC 192k Master (14.2 GB)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F43F9E] inline-block" />
                DSD64 Direct (4.2 GB)
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
            <span className="text-[11px] text-[#ccc3d5]/70">
              {cachePurged ? 'Cache successfully purged! 1.1 GB freed.' : 'Temporary decoding stems: 1.1 GB'}
            </span>
            <button
              onClick={handlePurgeCache}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <Trash2 size={12} className="text-[#F43F9E]" />
              <span>{cachePurged ? 'Purged' : 'Purge Cache'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Repository Contributors (Spacious, Roomy Cards with Zero Cramming) */}
      <section className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold font-sora text-white tracking-wide flex items-center gap-2">
            <GitFork size={16} className="text-[#62CDFF]" />
            <span>Repository Contributors</span>
          </h3>
          <span className="text-xs font-mono text-[#a377fe]">5 Unified Repos</span>
        </div>

        <div className="space-y-3">
          {contributors.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="group p-4 rounded-[22px] border border-white/[0.1] hover:border-[#62CDFF]/50 transition-all flex flex-col gap-1.5 shadow-md active:scale-[0.99]"
              style={{
                background: 'rgba(20, 16, 32, 0.75)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-sora text-white group-hover:text-[#62CDFF] transition-colors">
                  {c.name}
                </h4>
                <ExternalLink size={14} className="text-[#ccc3d5]/50 group-hover:text-[#62CDFF] transition-colors" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#a377fe]">
                {c.tag}
              </span>
              <p className="text-xs text-[#ccc3d5]/80 leading-relaxed mt-0.5">
                {c.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* 9. Build Architecture & Credits Footer */}
      <div className="text-center pt-2 pb-6 space-y-1 font-mono text-[10px] text-[#ccc3d5]/60">
        <p className="tracking-wider text-[#62CDFF]/80 font-bold">
          MUSIC • LIQUID STUDIO EDITION • LEAD AUTHOR NEURO-RIFT
        </p>
        <p>Engine: HyperQuartz 32-bit WebAudio DSP Core • Android Capacitor v7</p>
      </div>

    </div>
  );
};
