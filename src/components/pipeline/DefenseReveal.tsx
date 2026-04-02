"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PipelineThreat, DefenseOption, PipelineAnswer } from "@/lib/types";

interface DefenseRevealProps {
  threat: PipelineThreat;
  defense: DefenseOption;
  answer: PipelineAnswer;
  onNext: () => void;
  isLast: boolean;
}

export default function DefenseReveal({ threat, defense, answer, onNext, isLast }: DefenseRevealProps) {
  const t = useTranslations("pipeline");
  const correct = answer.isCorrect;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      {/* Result Banner */}
      <div className={`text-center py-4 px-6 rounded-2xl mb-4 border-2 ${
        correct
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-error/10 border-error/30 text-error"
      }`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {correct ? "shield" : "dangerous"}
          </span>
          <span className="font-headline font-bold text-lg">
            {correct ? t("threatNeutralized") : t("pipelineBreached")}
          </span>
        </div>
        <p className="text-sm font-mono font-bold">+{answer.score} pts</p>
      </div>

      {/* Your Choice */}
      <div className={`p-4 rounded-xl mb-3 border-2 ${
        correct ? "border-primary/20 bg-primary/5" : "border-error/20 bg-error/5"
      }`}>
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">{t("yourDefense")}</p>
        <p className="text-sm font-bold text-on-surface">{defense.text}</p>
      </div>

      {/* Explanation */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-4 mb-3">
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">{t("why")}</p>
        <p className="text-sm text-on-surface leading-relaxed">{defense.explanation}</p>
      </div>

      {/* Correct Defense (if wrong) */}
      {!correct && (
        <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 mb-3">
          <p className="text-xs font-label uppercase tracking-widest text-primary mb-1">{t("correctDefense")}</p>
          {threat.defenses.filter(d => d.isCorrect).map(d => (
            <div key={d.id}>
              <p className="text-sm font-bold text-on-surface">{d.text}</p>
              <p className="text-xs text-on-surface-variant mt-1">{d.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pipeline Health */}
      <div className="bg-surface-container rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">{t("pipelineHealth")}</span>
          <span className={`font-mono font-bold text-sm ${
            answer.pipelineHealth > 60 ? "text-primary" : answer.pipelineHealth > 30 ? "text-secondary" : "text-error"
          }`}>{answer.pipelineHealth}%</span>
        </div>
        <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              answer.pipelineHealth > 60 ? "bg-primary" : answer.pipelineHealth > 30 ? "bg-secondary" : "bg-error"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${answer.pipelineHealth}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        aria-label={isLast ? t("viewResults") : t("nextWave")}
        className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-bold font-label text-sm shadow-[0_3px_0_0_rgba(0,80,25,1)] hover:shadow-[0_1px_0_0_rgba(0,80,25,1)] hover:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
      >
        {isLast ? t("viewResults") : t("nextWave")}
      </button>
    </motion.div>
  );
}
