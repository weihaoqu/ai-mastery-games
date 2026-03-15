"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { BattleRound } from "@/lib/types";

interface BattleCardProps {
  round: BattleRound;
  onPick: (pick: "A" | "B") => void;
  disabled?: boolean;
}

export default function BattleCard({
  round,
  onPick,
  disabled,
}: BattleCardProps) {
  const t = useTranslations("arena");

  const sides = [
    { key: "A" as const, label: t("promptA"), text: round.promptA.text },
    { key: "B" as const, label: t("promptB"), text: round.promptB.text },
  ];

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      {/* Task box */}
      <div className="w-full rounded-lg border border-ed-border bg-ed-parchment p-5">
        <p className="text-xs uppercase tracking-widest text-ed-ink-muted mb-1">
          {t("task")}
        </p>
        <p className="text-[15px] leading-7 text-ed-ink">{round.task}</p>
      </div>

      {/* Instruction */}
      <p className="text-sm text-ed-ink-muted">{t("pickBetter")}</p>

      {/* Two-column grid */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {sides.map(({ key, label, text }) => (
          <motion.button
            key={key}
            onClick={() => !disabled && onPick(key)}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.01 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className="cursor-pointer rounded-xl border-2 border-ed-border bg-ed-card p-5 text-left transition-all hover:border-ed-teal/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="mb-3 font-display text-sm text-ed-ink-muted">
              {label}
            </p>
            <p className="text-[15px] leading-7 text-ed-ink">{text}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
