"use client";

import { motion } from "framer-motion";

interface MeterDashboardProps {
  meters: { revenue: number; reputation: number; trust: number; regulatory: number };
  labels?: { revenue: string; reputation: string; trust: string; regulatory: string };
}

const METER_COLORS: Record<string, string> = {
  revenue: "bg-primary",
  reputation: "bg-tertiary",
  trust: "bg-secondary",
  regulatory: "bg-[#5b4bb4]",
};

const METER_ICONS: Record<string, string> = {
  revenue: "payments",
  reputation: "star",
  trust: "handshake",
  regulatory: "gavel",
};

function meterColor(value: number, baseColor: string): string {
  if (value < 25) return "bg-error";
  if (value < 50) return "bg-yellow-500";
  return baseColor;
}

export default function MeterDashboard({ meters, labels }: MeterDashboardProps) {
  const defaultLabels = { revenue: "Revenue", reputation: "Reputation", trust: "Trust", regulatory: "Regulatory" };
  const l = labels ?? defaultLabels;

  return (
    <div className="flex gap-3">
      {(["revenue", "reputation", "trust", "regulatory"] as const).map((key) => (
        <div key={key} className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="material-symbols-outlined text-sm text-on-surface-variant"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {METER_ICONS[key]}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant truncate">
                {l[key]}
              </span>
              <span className="text-[10px] font-mono font-bold text-on-surface">{meters[key]}</span>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${meterColor(meters[key], METER_COLORS[key])} rounded-full`}
                initial={{ width: "50%" }}
                animate={{ width: `${meters[key]}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
