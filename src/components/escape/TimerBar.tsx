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
    barColor = "bg-primary";
  } else if (ratio > 0.2) {
    barColor = "bg-secondary";
  } else {
    barColor = "bg-error";
    pulse = true;
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${ratio <= 0.2 ? "bg-error animate-pulse" : "bg-primary"}`} />
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">
            {t("timeRemaining")}
          </span>
        </div>
        <span
          className={`font-mono text-xl font-bold ${
            ratio <= 0.2 ? "text-error" : "text-secondary"
          } ${isPaused ? "opacity-50" : ""}`}
        >
          {formatTime(remainingSeconds)}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-outline-variant/30">
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
