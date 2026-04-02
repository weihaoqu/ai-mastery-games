"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { EthicsScenario, EthicsChoice, EthicsAnswer } from "@/lib/types";
import MeterBar from "./MeterBar";

interface ChoiceRevealProps {
  scenario: EthicsScenario;
  choice: EthicsChoice;
  answer: EthicsAnswer;
  onNext: () => void;
  isLast: boolean;
}

const METER_COLORS: Record<string, string> = {
  trust: "#006a2d",
  profit: "#9b3f00",
  safety: "#0061a4",
  equity: "#5b4bb4",
};

export default function ChoiceReveal({ scenario, choice, answer, onNext, isLast }: ChoiceRevealProps) {
  const t = useTranslations("ethics");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Result banner */}
      <div role="status" className={`rounded-t-xl px-5 py-3 flex items-center gap-3 ${
        choice.isOptimal
          ? "bg-primary text-on-primary"
          : "bg-error text-on-error"
      }`}>
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
          {choice.isOptimal ? "check_circle" : "cancel"}
        </span>
        <div>
          <p className="font-headline font-bold text-lg">
            {choice.isOptimal ? t("optimal") : t("suboptimal")}
          </p>
          <p className="text-sm opacity-90">
            +{answer.score} {t("pts")}
          </p>
        </div>
      </div>

      {/* Consequence + explanation */}
      <div className="bg-surface-container-lowest border-2 border-t-0 border-outline-variant rounded-b-xl p-5 space-y-5">
        {/* Consequence */}
        <div>
          <h3 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
            {t("consequence")}
          </h3>
          <p className="text-on-surface font-body text-sm leading-relaxed">
            {choice.consequence}
          </p>
        </div>

        {/* Reasoning */}
        <div className="bg-surface-container-high rounded-lg p-4">
          <h3 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">lightbulb</span>
            {t("reasoning")}
          </h3>
          <p className="text-on-surface-variant font-body text-sm leading-relaxed">
            {choice.reasoning}
          </p>
        </div>

        {/* Meter impacts */}
        <div>
          <h3 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
            {t("meters")}
          </h3>
          <div className="space-y-2">
            <MeterBar label={t("trust")} value={answer.meters.trust} max={10} color={METER_COLORS.trust} />
            <MeterBar label={t("profit")} value={answer.meters.profit} max={10} color={METER_COLORS.profit} />
            <MeterBar label={t("safety")} value={answer.meters.safety} max={10} color={METER_COLORS.safety} />
            <MeterBar label={t("equity")} value={answer.meters.equity} max={10} color={METER_COLORS.equity} />
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          aria-label={isLast ? t("viewResults") : t("next")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-on-primary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(0,80,25,1)] hover:shadow-[0_1px_0_0_rgba(0,80,25,1)] hover:translate-y-[2px] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isLast ? t("viewResults") : t("next")}
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
}
