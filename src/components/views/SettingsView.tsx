import React, { useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  RotateCcw, 
  User, 
  GitFork, 
  Cpu, 
  Info, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Disc3
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

  const contributors = [
    {
      name: 'RootlessJamesDSP',
      role: 'DSP Engine & AutoEQ',
      desc: 'Native DSP algorithms, AutoEQ target curve engine, and Linkwitz crossfeed.',
      url: 'https://github.com/thepbone/RootlessJamesDSP'
    },
    {
      name: 'elovaire-music',
      role: 'Media3 Audio Processor Pipeline',
      desc: 'In-process realtime AudioProcessor pipeline, soft-knee limiter, and high-performance biquad filter structures.',
      url: 'https://github.com/elovaire/elovaire-music'
    },
    {
      name: 'Audiofy',
      role: 'Music Card Design & Console',
      desc: 'Signature Now Playing card layout, vinyl disc dynamo, and visualizer bars.',
      url: 'https://github.com/Zakir-Sheikh/Audiofy'
    },
    {
      name: 'mucke',
      role: 'App Style & Aesthetic',
      desc: 'Obsidian/violet dark palette, custom gradients, and clean typography.',
      url: 'https://github.com/mucke-music/mucke'
    }
  ];

  return (
    <div className="pb-60 pt-5 px-4 sm:px-5 animate-in fade-in duration-300">
      {/* Header with Generous Margin */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-normal flex items-center gap-2.5">
          <Info size={23} className="text-violet-400" />
          <span>App Settings & About</span>
        </h2>
        <p className="text-xs text-white/50 font-medium tracking-normal mt-1 leading-normal">
          Configure application icon, author profile, and contributors
        </p>
      </div>

      {/* 1. App Icon Customizer Section */}
      <div 
        className="rounded-[26px] p-5 mb-5 border border-white/10 relative overflow-hidden shadow-xl"
        style={{
          background: 'rgba(26, 22, 32, 0.85)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 flex-shrink-0">
            <Sparkles size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-snug tracking-normal">
              Customize Application Icon
            </h3>
            <span className="text-xs text-white/50 block mt-0.5">
              Personalize your app icon on home screen and header
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Current Icon Preview */}
          <div className="relative flex-shrink-0">
            <div className="w-18 h-18 rounded-[22px] overflow-hidden border-2 border-white/20 shadow-xl bg-black/60 flex items-center justify-center">
              <img
                src={appIconUrl}
                alt="App Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-emerald-500 text-black font-extrabold text-[8px] uppercase tracking-wider shadow-sm flex items-center gap-0.5">
              <CheckCircle2 size={9} /> ACTIVE
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white mb-1">Upload Custom Icon</h4>
            <p className="text-xs text-white/50 mb-3.5 leading-relaxed">
              Choose any image (PNG, JPG, SVG). Default is loaded from images.jpg.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-tr from-[#913af1] to-[#ac5bfb] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/40 active:scale-95 transition-transform"
              >
                <Upload size={14} />
                <span>Choose Image</span>
              </button>

              <button
                onClick={onResetAppIcon}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform border border-white/5"
                title="Reset to default images.jpg"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Author Profile Card */}
      <div 
        className="rounded-[26px] p-5 mb-5 border border-white/10 shadow-xl"
        style={{
          background: 'rgba(26, 22, 32, 0.85)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 flex-shrink-0">
            <User size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-snug tracking-normal">
              Author & Development
            </h3>
            <span className="text-xs text-white/50 block mt-0.5">
              Creator identity and build architecture
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <span className="text-[11px] text-white/50 uppercase font-mono block mb-1">
              Lead Author
            </span>
            <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300">
              Neuro-Rift
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <span className="text-[11px] text-white/50 uppercase font-mono block mb-1">
              Application Build
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              Music v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* 3. Repository Contributors Card (Spacious, Roomy Cards) */}
      <div 
        className="rounded-[26px] p-5 mb-5 border border-white/10 shadow-xl"
        style={{
          background: 'rgba(26, 22, 32, 0.85)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 flex-shrink-0">
            <GitFork size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-snug tracking-normal">
              Repository Contributors
            </h3>
            <span className="text-xs text-white/50 block mt-0.5">
              Four open-source codebases unified into Music
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {contributors.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="group p-3.5 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-violet-500/30 transition-all flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                  {c.name}
                </h4>
                <ExternalLink size={13} className="text-white/35 group-hover:text-violet-300" />
              </div>
              <span className="text-[11px] font-mono font-medium text-violet-400">
                {c.role}
              </span>
              <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                {c.desc}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* 4. DSP & Sound Pipeline Verification Card */}
      <div 
        className="rounded-[26px] p-5 mb-2 border border-white/10 shadow-xl"
        style={{
          background: 'rgba(26, 22, 32, 0.85)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 flex-shrink-0">
            <ShieldCheck size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-snug tracking-normal">
              Sound Pipeline Verification
            </h3>
            <span className="text-xs text-white/50 block mt-0.5">
              Real-time Web Audio API + Media3 Android DSP
            </span>
          </div>
        </div>

        <p className="text-xs text-white/65 leading-relaxed">
          Integrated with 8 realtime DSP stages: Dynamic Loudness contour, M/S Center voice isolation, 
          Linkwitz acoustic crossfeed, Squig Live AutoEQ, vacuum tube harmonic exciter, NOS R2R step simulation, 
          and EBU R128 soft-knee volume dynamics.
        </p>
      </div>
    </div>
  );
};
