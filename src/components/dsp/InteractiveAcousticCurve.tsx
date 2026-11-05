import React, { useRef, useEffect } from 'react';
import { LiquidDspState } from '../../types/dsp';
import { AUTO_EQ_PROFILES } from '../../dsp/presets';

interface InteractiveAcousticCurveProps {
  dspState: LiquidDspState;
}

export const InteractiveAcousticCurve: React.FC<InteractiveAcousticCurveProps> = ({ dspState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Grid lines (dB: +12, +6, 0, -6, -12)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const dbLevels = [12, 6, 0, -6, -12];
    dbLevels.forEach(db => {
      const y = (1 - (db + 15) / 30) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '9px monospace';
      ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 4, y - 2);
    });

    // Frequency markers (100Hz, 1kHz, 10kHz)
    const freqs = [
      { f: 100, label: '100Hz' },
      { f: 1000, label: '1kHz' },
      { f: 10000, label: '10kHz' },
    ];
    freqs.forEach(freq => {
      const x = (Math.log10(freq.f) - Math.log10(20)) / (Math.log10(20000) - Math.log10(20)) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '9px monospace';
      ctx.fillText(freq.label, x + 2, height - 4);
    });

    // Calculate curve points across 120 frequency bins from 20Hz to 20kHz
    const points: { x: number; y: number }[] = [];
    const minLog = Math.log10(20);
    const maxLog = Math.log10(20000);

    const autoEqProfile = AUTO_EQ_PROFILES[dspState.autoEq.profile] || AUTO_EQ_PROFILES.harman_ie_2019;
    const autoEqActive = dspState.masterEnabled && dspState.autoEq.enabled;
    const loudnessActive = dspState.masterEnabled && dspState.loudness.enabled;

    for (let i = 0; i < width; i += 2) {
      const logFreq = minLog + (i / width) * (maxLog - minLog);
      const freq = Math.pow(10, logFreq);

      let totalGainDb = 0;

      // 1. Loudness Bass and Treble contours
      if (loudnessActive) {
        if (freq < 200) {
          totalGainDb += dspState.loudness.bassBoostDb * Math.max(0, 1 - freq / 200);
        }
        if (freq > 4000) {
          totalGainDb += dspState.loudness.trebleBoostDb * Math.min(1, (freq - 4000) / 10000);
        }
      }

      // 2. AutoEQ Target bands
      if (autoEqActive) {
        autoEqProfile.bands.forEach(band => {
          const octDiff = Math.abs(Math.log2(freq / band.freq));
          const bandInfluence = Math.exp(-Math.pow(octDiff * band.q * 1.5, 2));
          totalGainDb += band.gain * dspState.autoEq.intensity * bandInfluence;
        });
      }

      // 3. NOS R2R Sinc Droop
      if (dspState.masterEnabled && dspState.nosR2r.enabled && dspState.nosR2r.sincRollOff) {
        if (freq > 8000) {
          totalGainDb -= 3.2 * Math.min(1, (freq - 8000) / 12000);
        }
      }

      const clampedDb = Math.max(-15, Math.min(15, totalGainDb));
      const y = (1 - (clampedDb + 15) / 30) * height;
      points.push({ x: i, y });
    }

    // Draw Smooth Neon Glowing Curve
    if (points.length > 0) {
      // Glow under area
      ctx.beginPath();
      ctx.moveTo(points[0].x, height);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, height);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, 0, 0, height);
      areaGrad.addColorStop(0, 'rgba(172, 91, 251, 0.25)');
      areaGrad.addColorStop(1, 'rgba(145, 58, 241, 0.0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Neon Line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = '#1BFFFF';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ac5bfb';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }
  }, [dspState]);

  return (
    <div className="w-full bg-black/40 rounded-2xl p-2.5 border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] font-mono text-cyan-300 font-bold tracking-wider uppercase">
          LIVE ACOUSTIC TARGET BODE RESPONSE
        </span>
        <span className="text-[9px] font-mono text-white/50">
          20Hz - 20kHz (±15dB)
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={340}
        height={100}
        className="w-full h-24 rounded-lg"
      />
    </div>
  );
};

