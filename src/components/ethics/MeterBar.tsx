"use client";

import { motion } from "framer-motion";

interface MeterBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export default function MeterBar({ label, value, max, color }: MeterBarProps) {
  // Normalize value from [-max, max] to [0, 100]
  const percentage = ((value + max) / (2 * max)) * 100;
  const midpoint = 50;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-label font-bold text-on-surface-variant w-14 text-right uppercase tracking-wider">
        {label}
      </span>
      <div
        className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden relative"
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={-max}
        aria-valuemax={max}
      >
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-outline-variant/50 z-10" />
        {/* Fill bar */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{
            left: percentage >= midpoint ? `${midpoint}%` : `${percentage}%`,
            width: `${Math.abs(percentage - midpoint)}%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className={`text-xs font-mono font-bold w-8 text-right ${value >= 0 ? "text-primary" : "text-error"}`}>
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
  );
}
