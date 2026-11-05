import React, { useEffect, useRef } from 'react';
import { audioDspEngine } from '../../dsp/WebAudioEngine';

interface VisualizerBarsProps {
  isPlaying: boolean;
  barCount?: number;
  color?: string;
  className?: string;
}

export const VisualizerBars: React.FC<VisualizerBarsProps> = ({
  isPlaying,
  barCount = 4,
  color = '#913af1',
  className = '',
}) => {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let animId: number;

    const updateBars = () => {
      if (isPlaying) {
        const freqData = audioDspEngine.getVisualizerData();
        const step = Math.floor(freqData.length / barCount);

        barsRef.current.forEach((bar, i) => {
          if (!bar) return;
          const val = freqData[i * step] || 0;
          // Scale between 20% and 100%
          const heightPercent = Math.max(15, Math.min(100, (val / 255) * 100));
          bar.style.height = `${heightPercent}%`;
        });
      } else {
        barsRef.current.forEach((bar) => {
          if (bar) bar.style.height = '15%';
        });
      }

      animId = requestAnimationFrame(updateBars);
    };

    animId = requestAnimationFrame(updateBars);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, barCount]);

  return (
    <div className={`flex items-end justify-center gap-[3px] h-5 ${className}`}>
      {Array.from({ length: barCount }).map((_, idx) => (
        <span
          key={idx}
          ref={(el) => { barsRef.current[idx] = el; }}
          className="w-[3px] rounded-full transition-all duration-75"
          style={{
            backgroundColor: color,
            height: '20%',
            boxShadow: isPlaying ? `0 0 8px ${color}` : 'none',
          }}
        />
      ))}
    </div>
  );
};

