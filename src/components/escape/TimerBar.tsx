"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface TimerBarProps {
  totalSeconds: number;
  remainingSeconds: number;
  isPaused?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerBar({ totalSeconds, remainingSeconds, isPaused }: TimerBarProps) {
  const t = useTranslations("escape");
  const ratio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const percentage = Math.max(0, Math.min(100, ratio * 100));

  let barColor: string;
  let pulse = false;

  if (ratio > 0.5) {
    barColor = "bg-ed-teal";
  } else if (ratio > 0.2) {
    barColor = "bg-amber-500";
  } else {
    barColor = "bg-ed-error";
    pulse = true;
  }

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-ed-ink-muted">
          {t("timeRemaining")}
        </span>
        <span
          className={`font-mono text-sm font-bold ${
            ratio <= 0.2 ? "text-ed-error" : "text-ed-ink"
          } ${isPaused ? "opacity-50" : ""}`}
        >
          {formatTime(remainingSeconds)}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-ed-border/30">
        <motion.div
          className={`h-full rounded-full ${barColor} ${pulse ? "animate-pulse" : ""}`}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
