"use client";

import { useEffect, useState } from "react";

interface RadarSweepProps {
  lifetime: number;
  size?: number;
}

export default function RadarSweep({ lifetime, size = 48 }: RadarSweepProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= lifetime) {
          clearInterval(interval);
          return lifetime;
        }
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [lifetime]);

  const progress = Math.min(elapsed / lifetime, 1);
  const angle = progress * 360;
  const remaining = 1 - progress;

  const color = remaining > 0.5 ? "#00ff41" : remaining > 0.25 ? "#ffaa00" : "#ff4444";
  const glowColor = remaining > 0.5 ? "rgba(0,255,65,0.3)" : remaining > 0.25 ? "rgba(255,170,0,0.3)" : "rgba(255,68,68,0.3)";

  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  const handAngle = ((angle - 90) * Math.PI) / 180;
  const hx = cx + r * Math.cos(handAngle);
  const hy = cy + r * Math.sin(handAngle);

  return (
    <svg width={size} height={size} className="flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a3a1a" strokeWidth="2" />
      <line x1={cx} y1={4} x2={cx} y2={size - 4} stroke="#1a3a1a" strokeWidth="0.5" />
      <line x1={4} y1={cy} x2={size - 4} y2={cy} stroke="#1a3a1a" strokeWidth="0.5" />
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2" fill={color} />
      {remaining > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={`${remaining * 2 * Math.PI * r} ${2 * Math.PI * r}`}
          strokeDashoffset={`${(angle / 360) * 2 * Math.PI * r}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity="0.4"
        />
      )}
    </svg>
  );
}
