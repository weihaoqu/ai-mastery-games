"use client";

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

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-8">
      {/* Task */}
      <div className="inline-block bg-surface-container px-8 py-6 rounded-2xl border-b-4 border-outline-variant max-w-2xl text-center">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-label font-bold">
          {t("task")}
        </p>
        <p className="font-body text-lg font-semibold text-on-surface leading-relaxed">
          {round.task}
        </p>
      </div>

      {/* Instruction */}
      <p className="text-sm text-on-surface-variant font-label">{t("pickBetter")}</p>

      {/* Two-column battle cards */}
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
        {/* Prompt A */}
        <div className="flex flex-col">
          <div className="bg-surface-container-lowest rounded-3xl p-8 flex-grow border-b-8 border-outline-variant shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="font-label uppercase tracking-widest text-primary font-bold bg-primary-container px-3 py-1 rounded-lg text-sm">
                  {t("promptA")}
                </span>
                <span className="material-symbols-outlined text-outline-variant">auto_awesome</span>
              </div>
              <div className="font-body text-base text-on-surface leading-relaxed py-4">
                {round.promptA.text}
              </div>
            </div>
            <motion.button
              onClick={() => !disabled && onPick("A")}
              disabled={disabled}
              whileHover={disabled ? {} : { scale: 1.02 }}
              whileTap={disabled ? {} : { y: 2 }}
              className="w-full mt-6 bg-primary py-4 rounded-2xl border-b-4 border-primary-dim text-on-primary font-headline text-base font-extrabold flex items-center justify-center gap-3 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5 active:shadow-none"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {t("promptA")}
            </motion.button>
          </div>
        </div>

        {/* Prompt B */}
        <div className="flex flex-col">
          <div className="bg-surface-container-lowest rounded-3xl p-8 flex-grow border-b-8 border-outline-variant shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -mr-8 -mt-8 rounded-full" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="font-label uppercase tracking-widest text-secondary font-bold bg-secondary-container px-3 py-1 rounded-lg text-sm">
                  {t("promptB")}
                </span>
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <div className="font-body text-base text-on-surface leading-relaxed py-4">
                {round.promptB.text}
              </div>
            </div>
            <motion.button
              onClick={() => !disabled && onPick("B")}
              disabled={disabled}
              whileHover={disabled ? {} : { scale: 1.02 }}
              whileTap={disabled ? {} : { y: 2 }}
              className="w-full mt-6 bg-secondary py-4 rounded-2xl border-b-4 border-secondary-dim text-on-secondary font-headline text-base font-extrabold flex items-center justify-center gap-3 transition-all hover:brightness-110 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5 active:shadow-none"
            >
              <span className="material-symbols-outlined">swords</span>
              {t("promptB")}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
