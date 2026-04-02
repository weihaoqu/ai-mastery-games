"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { EthicsScenario, EthicsChoice } from "@/lib/types";

interface ScenarioCardProps {
  scenario: EthicsScenario;
  onChoose: (choice: EthicsChoice) => void;
}

export default function ScenarioCard({ scenario, onChoose }: ScenarioCardProps) {
  const t = useTranslations("ethics");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Title */}
      <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-on-surface mb-4 text-center">
        {scenario.title}
      </h2>

      {/* Role badge */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="material-symbols-outlined text-tertiary text-lg" aria-hidden="true">person</span>
        <span className="text-sm font-label font-bold text-tertiary uppercase tracking-wider">
          {t("yourRole")}
        </span>
      </div>
      <p className="text-on-surface-variant text-sm font-body text-center mb-5 italic">
        {scenario.role}
      </p>

      {/* Setup */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-5 mb-4 shadow-[0_3px_0_0_rgba(152,182,125,0.6)]">
        <p className="text-on-surface font-body text-sm leading-relaxed">
          {scenario.setup}
        </p>
      </div>

      {/* Dilemma */}
      <div className="bg-tertiary-container border-2 border-tertiary/30 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-tertiary text-lg" aria-hidden="true">help</span>
          <span className="text-sm font-label font-bold text-tertiary uppercase tracking-wider">
            {t("theDilemma")}
          </span>
        </div>
        <p className="text-on-surface font-body text-base font-medium leading-relaxed">
          {scenario.dilemma}
        </p>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {scenario.choices.map((choice, i) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
            onClick={() => onChoose(choice)}
            aria-label={`${String.fromCharCode(65 + i)}: ${choice.text}`}
            className="w-full text-left bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-4 shadow-[0_3px_0_0_rgba(152,182,125,0.4)] hover:shadow-[0_1px_0_0_rgba(152,182,125,0.4)] hover:translate-y-[2px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-sm font-label shrink-0 mt-0.5">
                {String.fromCharCode(65 + i)}
              </span>
              <p className="text-on-surface font-body text-sm leading-relaxed group-hover:text-primary transition-colors">
                {choice.text}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
